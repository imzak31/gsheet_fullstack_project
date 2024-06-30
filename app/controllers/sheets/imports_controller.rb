# app/controllers/sheets/imports_controller.rb
module Sheets
  class ImportsController < ApplicationController
    before_action :authenticate_user!

    def index
      imports = current_user.imports.page(permitted_params[:page]).per(permitted_params[:per_page] || 10)
      render json: ImportSerializer.new(imports).serializable_hash.to_json
    end

    def show
      import = current_user.imports.find(permitted_params[:id])
      render json: ImportSerializer.new(import).serializable_hash.to_json
    end

    private

    def permitted_params
      params.permit(:id, :page, :per_page)
    end
  end
end
