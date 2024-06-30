class CreateImportErrors < ActiveRecord::Migration[7.1]
  def change
    create_table :import_errors do |t|
      t.references :user, null: false, foreign_key: true
      t.text :data
      t.text :error_messages

      t.timestamps
    end
  end
end
