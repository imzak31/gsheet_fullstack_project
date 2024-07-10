class AddUniqueIndexToVacationSheets < ActiveRecord::Migration[7.1]
  def change
    add_index :vacation_sheets, [:user_id, :from_date], unique: true
  end
end
