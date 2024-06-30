# app/services/sheets/vacation_sheet_filter_service.rb
class Sheets::VacationSheetFilterService
  def initialize(params, user)
    @params = params
    @user = user
  end

  def call
    vacation_sheets = @user.vacation_sheets

    @params.each do |key, value|
      next if value.blank? || key.to_sym == :page

      vacation_sheets = apply_filter(vacation_sheets, key.to_sym, value)
    end

    vacation_sheets
  end

  private

  def apply_filter(vacation_sheets, key, value)
    case key
    when :name
      vacation_sheets.where('name ILIKE ?', "%#{value}%")
    when :email
      vacation_sheets.where('email ILIKE ?', "%#{value}%")
    when :leader
      vacation_sheets.where('leader ILIKE ?', "%#{value}%")
    when :state
      vacation_sheets.where(state: value)
    when :from_date
      vacation_sheets.where(from_date: value..)
    when :until_date
      vacation_sheets.where(until_date: ..value)
    when :vacation_kind
      vacation_sheets.where(vacation_kind: value)
    when :reason
      vacation_sheets.where('reason ILIKE ?', "%#{value}%")
    else
      raise ArgumentError, "Invalid filter: #{key}"
    end
  end
end
