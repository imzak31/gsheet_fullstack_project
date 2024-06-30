module Import
  module Sheets
    class ImportVacationSheetForm
      include ActiveModel::Model
      attr_accessor :user, :external_id, :name, :email, :leader, :from_date, :until_date,
                    :vacation_kind, :reason, :state

      def initialize(attributes = {})
        @user = attributes.delete(:user)
        @attributes = attributes
        @vacation_sheet = ::Sheets::VacationSheet.new(attributes.merge(user: @user))
        super
      end

      def save
        if valid?
          @vacation_sheet.save
        else
          Rails.logger.error("Validation failed for VacationSheet: #{errors.full_messages.join(', ')}")
          false
        end
      end

      def valid?
        @vacation_sheet.valid?.tap do |is_valid|
          errors.merge!(@vacation_sheet.errors) unless is_valid
          Rails.logger.info("Validation result for VacationSheet: #{is_valid}")
          Rails.logger.info("Validation errors: #{errors.full_messages.join(', ')}") unless is_valid
        end
      end
    end
  end
end
