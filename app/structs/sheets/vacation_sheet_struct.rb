require 'dry-struct'

module Types
  include Dry.Types()
end

module Sheets
  class VacationSheetStruct < Dry::Struct
    attribute :external_id, Types::Integer
    attribute :name, Types::String
    attribute :email, Types::String
    attribute :leader, Types::String
    attribute :from_date, Types::Params::Date
    attribute :until_date, Types::Params::Date
    attribute :vacation_kind, Types::String.default('Vacaciones'.freeze)
    attribute :reason, Types::String.optional
    attribute :state, Types::Symbol.default(:pending)
  end
end
