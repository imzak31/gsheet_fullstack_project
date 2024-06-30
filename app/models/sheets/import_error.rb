class Sheets::ImportError < ApplicationRecord
  belongs_to :import

  validates :data, presence: true
  validates :error_messages, presence: true

  delegate :user, to: :import
end
