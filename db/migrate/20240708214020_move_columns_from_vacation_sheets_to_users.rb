class MoveColumnsFromVacationSheetsToUsers < ActiveRecord::Migration[7.1]
  def change
    change_table :users do |t|
      t.string :name
      t.string :leader
    end

    change_table :vacation_sheets do |t|
      t.remove :external_id, :name, :email, :leader
    end
  end
end
