# app/structs/user_struct.rb
require 'dry-struct'

module Types
  include Dry.Types()
end

class UserStruct < Dry::Struct
  attribute :email, Types::String
  attribute :name, Types::String
  attribute :leader, Types::String
  attribute :password, Types::String
  attribute :role, Types::String.default('employee')
  attribute :vacations, Types::Array.of(Sheets::VacationSheetStruct)
end
