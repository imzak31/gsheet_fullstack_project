# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# db/seeds.rb

User.create!(
  name: 'Nala Admin',
  email: 'admin@nalarocks.com',
  password: 'Nala.1234', # Ensure you use a secure password for your admin user
  password_confirmation: 'Nala.1234',
  role: :admin,
  leader: 'CEO'
)

puts "Admin user created with email: 'admin@nalarocks.com' and password: 'Nala.1234'"
