class AddUserToAttachments < ActiveRecord::Migration[7.1]
  def change
    add_reference :attachments, :user, null: false, foreign_key: true
  end
end
