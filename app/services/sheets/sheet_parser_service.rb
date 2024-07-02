require 'roo'
require 'open-uri'

# services/sheets/sheet_parser_service.rb
module Sheets
  class SheetParserService
    def initialize(file_url, user)
      @file_url = file_url
      @user = user
    end

    def call
      Rails.logger.info("Opening spreadsheet at #{@file_url}")
      file = URI.open(@file_url)

      # Save the file to a temporary location with the correct extension
      temp_file_path = Rails.root.join('tmp', "uploaded_file#{File.extname(@file_url)}")
      File.binwrite(temp_file_path, file.read)

      # Explicitly pass the extension to Roo
      spreadsheet = Roo::Spreadsheet.open(temp_file_path.to_s, extension: File.extname(temp_file_path))

      header = spreadsheet.row(1)
      (2..spreadsheet.last_row).each do |i|
        row = [header, spreadsheet.row(i)].transpose.to_h
        data = set_struct(row).to_h.merge(user_id: @user.id)
        Rails.logger.info("Enqueuing job for row #{i}: #{data.to_json}")
        Sheets::ImportJob.perform_async(data.to_json)
      end

      # Optionally delete the temporary file after processing
      FileUtils.rm_f(temp_file_path)
    end

    private

    def parse_state(state)
      states = {
        'Pendiente' => :pending,
        'Aprobado' => :approved,
        'Rechazado' => :rejected
      }
      parsed_state = states[state]
      Rails.logger.info("Parsed state: #{parsed_state} for original state: #{state}")
      parsed_state
    end

    def set_struct(data)
      Sheets::VacationSheetStruct.new(
        external_id: data['ID'].to_i,
        name: data['Nombre'],
        email: data['Email'],
        leader: data['Lider'],
        from_date: Date.parse(data['Fecha desde']),
        until_date: Date.parse(data['Fecha hasta']),
        vacations_kind: data['Tipo'],
        reason: data['Motivo'],
        state: parse_state(data['Estado'])
      )
    end
  end
end
