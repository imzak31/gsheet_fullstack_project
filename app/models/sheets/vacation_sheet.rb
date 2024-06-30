class Sheets::VacationSheet < ApplicationRecord
  extend Enumerize

  # Define the table field
  self.table_name = 'vacation_sheets'

  # Associations
  belongs_to :user
  # has_many :attachments, as: :attachable, dependent: :destroy

  # Define the enum field for the state column
  enumerize :state, in: [:pending, :approved, :rejected],
                    default: :pending, scope: true, predicate: true,
                    blank?: false

  # Validations
  validates :external_id, presence: true, uniqueness: false
  validates :name, presence: true
  validates :email, presence: true
  validates :leader, presence: true
  validates :from_date, date: { before: :until_date }, presence: true
  validates :until_date, date: { after: :from_date }, presence: true

  def vacations_taken
    (until_date - from_date).to_i
  end
end
