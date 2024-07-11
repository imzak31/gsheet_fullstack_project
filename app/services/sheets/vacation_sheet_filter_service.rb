class Sheets::VacationSheetFilterService
  def initialize(params, user)
    @params = params
    @user = user
  end

  def call
    vacation_sheets = if @user.admin?
      Sheets::VacationSheet.includes(:user).all
    else
      @user.vacation_sheets.includes(:user)
    end

    @params.each do |key, value|
      next if value.blank? || key.to_sym == :page

      vacation_sheets = apply_filter(vacation_sheets, key.to_sym, value)
    end

    vacation_sheets
  end

  private

  def apply_filter(vacation_sheets, key, value)
    case key
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
    when :employee
      vacation_sheets.joins(:user).where('users.name ILIKE ?', "%#{value}%")
    when :employee_email
      vacation_sheets.joins(:user).where('users.email ILIKE ?', "%#{value}%")
    when :employee_leader
      vacation_sheets.joins(:user).where('users.leader ILIKE ?', "%#{value}%")
    else
      raise ArgumentError, "Invalid filter: #{key}"
    end
  end
end
