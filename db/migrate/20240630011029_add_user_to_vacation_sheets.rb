class AddUserToVacationSheets < ActiveRecord::Migration[7.1]
  def change
    add_reference :vacation_sheets, :user, null: false, foreign_key: true
  end
end
