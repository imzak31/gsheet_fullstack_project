class Sheets::Import < ApplicationRecord
  self.table_name = 'sheets_imports'

  belongs_to :user
  has_many :import_errors, dependent: :destroy

  validates :status, presence: true
end
