# app/jobs/sheets/import_job.rb
module Sheets
  class ImportJob
    include Sidekiq::Job

    sidekiq_options queue: 'import_files'

    def perform(json_data)
      Rails.logger.info("ImportJob started with data: #{json_data}")
      data = JSON.parse(json_data)

      # Find the user by ID
      user = User.find(data.delete('user_id'))

      # Create an import record
      import = Sheets::Import.create!(user:, status: 'in_progress')

      form = ::Import::Sheets::ImportVacationSheetForm.new(data.merge(user:))

      if form.save
        Rails.logger.info("VacationSheet successfully saved: #{data}")
        import.update(status: 'completed')
      else
        Rails.logger.error("Failed to save VacationSheet: #{form.errors.full_messages.join(', ')}")
        save_import_error(import, data, form.errors.full_messages)
        import.update(status: 'failed')
      end
    end

    private

    def save_import_error(import, data, error_messages)
      Sheets::ImportError.create!(import:, data: data.to_json, error_messages: error_messages.join(', '))
    end
  end
end
