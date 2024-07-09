class ApplicationController < ActionController::API
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  def ensure_admin_role
    unless current_user.role == 'admin'
      render json: { errors: ['This operation is not permitted for your role. Please contact your admin.'] }, status: :unprocessable_entity
    end
  end

    protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :leader, :role])
  end
end
