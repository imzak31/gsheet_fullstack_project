class CreateAttachments < ActiveRecord::Migration[7.1]
  def change
    create_table :attachments do |t|
      t.string :file
      t.references :attachable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
