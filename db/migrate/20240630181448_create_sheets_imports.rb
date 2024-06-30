class CreateSheetsImports < ActiveRecord::Migration[7.1]
  def change
    create_table :sheets_imports do |t|
      t.references :user, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
