class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  extend Enumerize

  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  # Callbacks
  before_create :generate_jwt_secret

  # Associations
  has_one_attached :file
  has_many :vacation_sheets, class_name: 'Sheets::VacationSheet', dependent: :destroy
  has_many :imports, class_name: 'Sheets::Import', dependent: :destroy
  has_many :import_errors, class_name: 'Sheets::ImportError', through: :imports, source: :import_errors

  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :leader, presence: true

  # Enumerize
  enumerize :role, in: [:admin, :employee], default: :employee, predicates: true, scope: true

  def generate_jwt_secret
    self.jti = SecureRandom.hex(32)
  end
end
