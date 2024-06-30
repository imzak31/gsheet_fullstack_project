class Attachment < ApplicationRecord
  # Limit format to xlsx files
  VALID_FORMATS = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].freeze

  belongs_to :attachable, polymorphic: true, optional: true
  belongs_to :user

  has_one_attached :file

  validates :file, attached: true, content_type: VALID_FORMATS

  validate :correct_file_format

  private

  def correct_file_format
    return unless file.attached?

    unless file.blob.content_type.in?(VALID_FORMATS)
      errors.add(:file, 'Must be an xlsx file')
      file.purge
    end
  end
end
