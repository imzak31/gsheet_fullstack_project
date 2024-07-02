class Sheets::VacationSheetsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_vacation_sheet, only: [:show, :update, :destroy]

  # GET /sheets/vacation_sheets
  def index
    @vacation_sheets = Sheets::VacationSheetFilterService.new(filter_params, current_user).call.page(params[:page]).per(10)
    render json: @vacation_sheets, meta: pagination_meta(@vacation_sheets), each_serializer: Sheets::VacationSheetSerializer
  end

  # GET /sheets/vacation_sheets/:id
  def show
    render json: @vacation_sheet, serializer: Sheets::VacationSheetSerializer
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
    @vacation_sheet = current_user.vacation_sheets.find(params[:id])
  end

  def vacation_sheet_params
    params.require(:vacation_sheet).permit(:external_id, :name, :email, :leader, :from_date,
                                           :until_date, :vacation_kind, :reason, :state, :created_at, :updated_at)
  end

  def filter_params
    params.permit(:name, :email, :leader, :state, :from_date, :until_date,
                  :vacation_kind, :reason, :page, :vacation_days_taken)
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
