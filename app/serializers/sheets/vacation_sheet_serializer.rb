# app/serializers/sheets/vacation_sheet_serializer.rb
class Sheets::VacationSheetSerializer < ActiveModel::Serializer
  attributes :id, :employee, :employee_email, :employee_leader, :from_date,
             :until_date, :vacation_kind, :reason, :state, :created_at, :updated_at

  attribute :vacation_days_taken do
    object.vacations_taken
  end

  attribute :employee_name, key: :employee
  attribute :employee_email
  attribute :employee_leader

  def state
    object.state
  end

  def employee_name
    object.user.name
  end

  def employee_email
    object.user.email
  end

  def employee_leader
    object.user.leader
  end
end
