# app/serializers/sheets/vacation_sheet_serializer.rb
class Sheets::VacationSheetSerializer < ActiveModel::Serializer
  attributes :id, :from_date, :until_date, :vacation_kind, :reason,
             :state, :created_at, :updated_at

  attribute :vacation_days_taken do
    object.vacations_taken
  end

  def state
    object.state
  end
end
