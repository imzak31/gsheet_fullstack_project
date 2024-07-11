# app/services/users/user_filter_service.rb
class Users::UserFilterService
  def initialize(params)
    @params = params
  end

  def call
    users = User.all

    if @params[:name].present?
      users = users.where('name ILIKE ?', "%#{@params[:name]}%")
    end

    users
  end
end
