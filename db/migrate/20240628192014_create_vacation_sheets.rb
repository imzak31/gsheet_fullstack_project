class CreateVacationSheets < ActiveRecord::Migration[7.1]
  def change
    create_table :vacation_sheets do |t|
      t.bigint :external_id
      t.string :name
      t.string :email
      t.string :leader
      t.date :from_date
      t.date :until_date
      t.string :vacation_kind
      t.string :reason
      t.integer :state

      t.timestamps
    end
  end
end
