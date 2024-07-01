class AddImportIdToImportErrors < ActiveRecord::Migration[7.1]
  def change
    add_reference :import_errors, :import, null: false, foreign_key: { to_table: :sheets_imports }
  end
end
