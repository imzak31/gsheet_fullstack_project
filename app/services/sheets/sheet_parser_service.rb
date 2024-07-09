module Sheets
  class SheetParserService
    def initialize(file_url, user)
      @file_url = file_url
      @user = user
    end

    def call
      Rails.logger.info("Opening spreadsheet at #{@file_url}")
      file = URI.open(@file_url)

      temp_file_path = Rails.root.join('tmp', "uploaded_file#{File.extname(@file_url)}")
      File.binwrite(temp_file_path, file.read)

      spreadsheet = Roo::Spreadsheet.open(temp_file_path.to_s, extension: File.extname(temp_file_path))

      user_data = parse_user_data_by_id(spreadsheet)
      user_data.each do |email, data|
        user_struct = UserStruct.new(
          email: email,
          name: data[:name],
          leader: data[:leader],
          password: data[:password],
          role: data[:role] || 'employee', # default to 'employee' if role is not provided
          vacations: data[:vacations]
        )
        enqueue_persist_user_job(user_struct)
      end

      FileUtils.rm_f(temp_file_path)
    end

    private

    def parse_user_data_by_id(spreadsheet)
      header = spreadsheet.row(1)
      user_data = {}

      (2..spreadsheet.last_row).each do |i|
        row = [header, spreadsheet.row(i)].transpose.to_h
        email = row['Email']
        user_data[email] ||= {
          name: row['Nombre'],
          leader: row['Lider'],
          password: 'nala1234',
          role: row['Rol'] || 'employee', # assume there's a 'Rol' column in the spreadsheet
          vacations: []
        }
        user_data[email][:vacations] << parse_vacations_from_user(row)
      end

      user_data
    end

    def parse_vacations_from_user(row)
      {
        from_date: row['Fecha desde'].to_s,
        until_date: row['Fecha hasta'].to_s,
        vacation_kind: row['Tipo'],
        reason: row['Motivo'],
        state: parse_state(row['Estado'])
      }
    end

    def parse_state(state)
      states = {
        'Pendiente' => 'pending',
        'Aprobado' => 'approved',
        'Rechazado' => 'rejected'
      }
      states[state]
    end

    def enqueue_persist_user_job(user_struct)
      user_hash = user_struct.to_h.deep_stringify_keys
      user_hash['vacations'].each do |vacation|
        vacation['from_date'] = vacation['from_date'].to_s
        vacation['until_date'] = vacation['until_date'].to_s
      end
      Rails.logger.info("Enqueuing job for user: #{user_hash.to_json}")
      Sheets::PersistUserJob.perform_async(user_hash)
    end
  end
end
