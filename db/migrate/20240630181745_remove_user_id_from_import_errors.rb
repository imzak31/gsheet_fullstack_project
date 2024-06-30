class RemoveUserIdFromImportErrors < ActiveRecord::Migration[7.1]
  def change
    remove_reference :import_errors, :user, null: false, foreign_key: true
  end
end
