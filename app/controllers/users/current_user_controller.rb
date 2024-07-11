# app/controllers/users/current_user_controller.rb
class Users::CurrentUserController < ApplicationController
  def index
    user_data = {
      user: current_user.as_json(except: :jti)
    }

    if current_user.admin?
      user_data[:all_users] = Users::UserFilterService.new(params).call.map do |user|
        UserSerializer.new(user).as_json
      end
    end

    render json: user_data, status: :ok
  end
end
