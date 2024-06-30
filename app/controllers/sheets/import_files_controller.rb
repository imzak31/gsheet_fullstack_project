class Sheets::ImportFilesController < ApplicationController
  before_action :authenticate_user!

  def create
    if permitted_params[:file].present?
      current_user.file.attach(permitted_params[:file])

      file_url = url_for(current_user.file)

      Sheets::SheetParserService.new(file_url, current_user).call

      render json: Sheets::ImportFileSerializer.new(current_user.file.attachment).serializable_hash.to_json, status: :created
    else
      render json: { errors: ['File is missing'] }, status: :unprocessable_entity
    end
  end

  private

  def permitted_params
    params.require(:attachment).permit(:file)
  end
end
