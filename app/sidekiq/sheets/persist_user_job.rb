module Sheets
  class PersistUserJob
    include Sidekiq::Worker
    sidekiq_options retry: false

    def perform(user_data)
      Rails.logger.info("PersistUserJob received user_data: #{user_data}")

      user_data = user_data.deep_symbolize_keys
      user_data[:vacations].each do |vacation|
        vacation[:from_date] = vacation[:from_date].to_s
        vacation[:until_date] = vacation[:until_date].to_s
        vacation[:state] = vacation[:state].to_s
      end

      Rails.logger.info("Processed user_data: #{user_data}")

      user_struct = UserStruct.new(user_data)

      ActiveRecord::Base.transaction do
        user = User.find_or_initialize_by(email: user_struct.email)
        user.assign_attributes(
          name: user_struct.name,
          leader: user_struct.leader,
          password: user_struct.password,
          role: user_struct.role
        )
        user.save!

        user_struct.vacations.each do |vacation|
          user.vacation_sheets.create!(
            from_date: vacation[:from_date],
            until_date: vacation[:until_date],
            vacation_kind: vacation[:vacation_kind],
            reason: vacation[:reason],
            state: vacation[:state]
          )
        end
      end
    rescue StandardError => e
      Rails.logger.error("Error instantiating UserStruct: #{e.message}")
      raise e
    end
  end
end
