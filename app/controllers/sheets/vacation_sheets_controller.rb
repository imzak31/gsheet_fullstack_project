class Sheets::VacationSheetsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_vacation_sheet, only: [:show, :update, :destroy]
  before_action :ensure_admin_role, except: [:index, :show]

  # GET /sheets/vacation_sheets
  def index
    Rails.logger.info("Current user role: #{current_user.role}")
    @vacation_sheets = if current_user.role == 'admin'
      Rails.logger.info("Fetching vacation sheets for admin user")
      Sheets::VacationSheet.all.page(params[:page]).per(10)
    else
      Rails.logger.info("Fetching vacation sheets for non-admin user")
      current_user.vacation_sheets.page(params[:page]).per(10)
    end
    Rails.logger.info("Fetched vacation sheets: #{@vacation_sheets.inspect}")
    render json: @vacation_sheets, meta: pagination_meta(@vacation_sheets), each_serializer: Sheets::VacationSheetSerializer
  end

  # GET /sheets/vacation_sheets/:id
  def show
    if current_user.role == 'admin' || @vacation_sheet.user_id == current_user.id
      render json: @vacation_sheet, serializer: Sheets::VacationSheetSerializer
    else
      render json: { errors: ['This operation is not permitted for your role. Please contact your admin.'] }, status: :unprocessable_entity
    end
  end

  # POST /sheets/vacation_sheets
  def create
    @vacation_sheet = current_user.vacation_sheets.build(vacation_sheet_params)

    if @vacation_sheet.save
      render json: @vacation_sheet, status: :created, location: sheets_vacation_sheet_url(@vacation_sheet)
    else
      render json: @vacation_sheet.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sheets/vacation_sheets/:id
  def update
    if @vacation_sheet.update(vacation_sheet_params)
      render json: @vacation_sheet, serializer: Sheets::VacationSheetSerializer
    else
      render json: @vacation_sheet.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sheets/vacation_sheets/:id
  def destroy
    @vacation_sheet.destroy
    head :no_content
  end

  private

  def set_vacation_sheet
    @vacation_sheet = Sheets::VacationSheet.find(params[:id])
  end

  def vacation_sheet_params
    params.require(:vacation_sheet).permit(:from_date, :until_date, :vacation_kind, :reason, :state, :created_at, :updated_at)
  end

  def filter_params
    params.permit(:state, :from_date, :until_date, :vacation_kind, :reason, :page, :vacation_days_taken)
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      next_page: collection.next_page,
      prev_page: collection.prev_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count
    }
  end
end
