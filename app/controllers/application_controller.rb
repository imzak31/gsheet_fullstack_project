class ApplicationController < ActionController::API
  before_action :authenticate_user!

  def ensure_admin_role
    unless current_user.admin?
      render json: { errors: ['This operation is not permitted for your role. Please contact your admin.'] }, status: :unprocessable_entity
    end
  end
end
