FactoryBot.define do
  factory :import_error do
    user { nil }
    data { 'MyText' }
    error_messages { 'MyText' }
  end
end
