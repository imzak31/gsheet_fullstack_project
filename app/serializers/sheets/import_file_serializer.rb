class Sheets::ImportFileSerializer
  include JSONAPI::Serializer

  attributes :file_url, :gcp_url, :user_email, :uploaded_at

  attribute :file_url do |object|
    Rails.application.routes.url_helpers.rails_blob_url(object.blob, only_path: true)
  end

  attribute :gcp_url do |object|
    Rails.application.routes.url_helpers.rails_blob_url(object.blob, disposition: 'attachment')
  end

  attribute :user_email do |object|
    object.record.email
  end

  attribute :uploaded_at, &:created_at
end
