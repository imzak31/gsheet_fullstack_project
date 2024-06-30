# app/serializers/import_error_serializer.rb
class Sheets::ImportErrorSerializer
  include JSONAPI::Serializer

  attributes :id, :import_id, :data, :error_messages, :created_at, :updated_at
end