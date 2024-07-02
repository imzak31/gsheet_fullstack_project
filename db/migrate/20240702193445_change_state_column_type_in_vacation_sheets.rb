class ChangeStateColumnTypeInVacationSheets < ActiveRecord::Migration[7.1]
  def change
    change_column :vacation_sheets, :state, :string
  end
end
