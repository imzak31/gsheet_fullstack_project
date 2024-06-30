# app/serializers/import_serializer.rb
class Sheets::ImportSerializer
  include JSONAPI::Serializer

  attributes :id, :user_id, :status, :created_at, :updated_at

  has_many :import_errors, serializer: Sheets::ImportErrorSerializer
end
