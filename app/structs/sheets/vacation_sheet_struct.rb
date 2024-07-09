# app/structs/sheets/vacation_sheet_struct.rb
require 'dry-struct'

module Types
  include Dry.Types()
end

module Sheets
  class VacationSheetStruct < Dry::Struct
    attribute :from_date, Types::String
    attribute :until_date, Types::String
    attribute :vacation_kind, Types::String.default('Vacaciones'.freeze)
    attribute :reason, Types::String.optional
    attribute :state, Types::String.default('pending')
  end
end
