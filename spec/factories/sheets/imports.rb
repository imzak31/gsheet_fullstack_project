FactoryBot.define do
  factory :sheets_import, class: 'Sheets::Import' do
    user { nil }
    status { "MyString" }
  end
end
