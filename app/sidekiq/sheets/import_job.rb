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
        import = Sheets::Import.find(import_id)
        user = persist_user(user_struct)
        persist_vacations(user, user_struct.vacations)
        import.update(status: 'completed')
      end
    rescue StandardError => e
      Rails.logger.error("Error processing user data: #{e.message}")
      save_import_error(user_data, import_id, e.message)
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

    def save_import_error(user_data, import_id, error_message)
      import = Sheets::Import.find(import_id)
      Sheets::ImportError.create!(
        import: import,
        data: user_data.to_json,
        error_messages: error_message
      )
      import.update(status: 'failed')
    end
  end
end
