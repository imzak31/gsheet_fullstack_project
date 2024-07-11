module Sheets
  class PersistUserJob
    include Sidekiq::Worker
    sidekiq_options retry: false

    def perform(user_data, import_id)
      Rails.logger.info("PersistUserJob received user_data: #{user_data}")

      user_data = preprocess_user_data(user_data)

      Rails.logger.info("Processed user_data: #{user_data}")

      user_struct = UserStruct.new(user_data)

      ActiveRecord::Base.transaction do
        user = persist_user(user_struct)
        persist_vacations(user, user_struct.vacations)
        update_import_status(import_id, 'completed')
      end
    rescue StandardError => e
      Rails.logger.error("Error processing user data: #{e.message}")
      save_import_error(import_id, user_data, e.message)
      update_import_status(import_id, 'failed')
      raise e
    end

    private

    def preprocess_user_data(user_data)
      user_data.deep_symbolize_keys.tap do |data|
        data[:vacations].each do |vacation|
          vacation[:from_date] = vacation[:from_date].to_s
          vacation[:until_date] = vacation[:until_date].to_s
          vacation[:state] = vacation[:state].to_s
        end
      end
    end

    def persist_user(user_struct)
      user = User.find_or_initialize_by(email: user_struct.email)
      user.assign_attributes(
        name: user_struct.name,
        leader: user_struct.leader,
        password: user_struct.password,
        role: user_struct.role
      )
      user.save!
      user
    end

    def persist_vacations(user, vacations)
      vacations.each do |vacation|
        user.vacation_sheets.create!(
          from_date: vacation[:from_date],
          until_date: vacation[:until_date],
          vacation_kind: vacation[:vacation_kind],
          reason: vacation[:reason],
          state: vacation[:state]
        )
      end
    end

    def save_import_error(import_id, user_data, error_message)
      Sheets::ImportError.create!(
        import_id:,
        data: user_data.to_json,
        error_messages: error_message
      )
    end

    def update_import_status(import_id, status)
      import = Sheets::Import.find(import_id)
      import.update!(status:)
    end
  end
end
