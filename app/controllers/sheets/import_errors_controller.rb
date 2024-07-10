# app/controllers/sheets/import_errors_controller.rb
module Sheets
  class ImportErrorsController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_admin_role, only: [:index, :show]

    def index
      import_errors = if current_user.admin?
        Sheets::ImportError.page(permitted_params[:page]).per(permitted_params[:per_page] || 10)
      else
        current_user.import_errors.page(permitted_params[:page]).per(permitted_params[:per_page] || 10)
      end
      render json: ImportErrorSerializer.new(import_errors).serializable_hash.to_json
    end

    def show
      import_error = if current_user.admin?
        Sheets::ImportError.find(permitted_params[:id])
      else
        current_user.import_errors.find(permitted_params[:id])
      end
      render json: ImportErrorSerializer.new(import_error).serializable_hash.to_json
    end

    private

    def permitted_params
      params.permit(:id, :page, :per_page)
    end
  end
end
