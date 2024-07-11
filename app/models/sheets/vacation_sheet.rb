class Sheets::VacationSheet < ApplicationRecord
  extend Enumerize

  # Define the table name
  self.table_name = 'vacation_sheets'

  # Associations
  belongs_to :user

  enumerize :state, in: [:pending, :approved, :rejected],
                    default: :pending, scope: true, predicate: true,
                    blank?: false

  # Validations
  validates :from_date, date: { before: :until_date }, presence: true
  validates :from_date, uniqueness: { scope: [:user_id] }
  validates :until_date, date: { after: :from_date }, presence: true

  def vacations_taken
    return 0 if state.rejected? || state.pending?

    (until_date - from_date).to_i
  end
end
