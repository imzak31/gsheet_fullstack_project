import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

# Google Sheets API setup
def setup_gsheets():
    try:
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        creds = Credentials.from_service_account_file('./credentials/keyfile.json', scopes=scopes)
        client = gspread.authorize(creds)
        print("Successfully connected to Google Sheets API")
        return client
    except Exception as e:
        print(f"Failed to setup Google Sheets API: {e}")
        return None

# Fetch spreadsheet data
def fetch_data(sheet_url):
    client = setup_gsheets()
    if client is None:
        return None, None

    try:
        sheet = client.open_by_url(sheet_url).sheet1
        data = sheet.get_all_values()
        print("Successfully fetched data from Google Sheet")
        return sheet, data
    except gspread.exceptions.APIError as e:
        print(f"API Error: {e.response.json()}")
        return None, None
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return None, None

# Display menu
def display_menu():
    print("\nSelect an option:")
    print("1. Add a new Row")
    print("2. Update a Row")
    print("3. Remove a Row")
    print("4. Show a Row")
    print("5. Exit")

# Add a new row
def add_row(sheet):
    headers = sheet.row_values(1)
    new_row = []
    for header in headers:
        while True:
            if header in ["Desde", "Hasta"]:
                value = input(f"Enter {header} (DD/MM/YYYY): ")
                try:
                    datetime.strptime(value, "%d/%m/%Y")
                    break
                except ValueError:
                    print(f"Invalid date format for {header}. Please enter in DD/MM/YYYY format.")
            else:
                value = input(f"Enter {header}: ")
                break
        new_row.append(value)
    sheet.append_row(new_row)
    print("Row added successfully!")

# Update a row
def update_row(sheet):
    while True:
        try:
            row_num = int(input("Enter the row number to update: "))
            break
        except ValueError:
            print("Incorrect Input, try again.")

    row_data = sheet.row_values(row_num)
    if not row_data:
        print("Row not found.")
        return

    print(f"Current data: {row_data}")
    print("Select the field to update:")
    headers = sheet.row_values(1)
    for idx, header in enumerate(headers, start=1):
        print(f"{idx}. {header}")
    print(f"{len(headers) + 1}. Update all fields")

    while True:
        try:
            choice = int(input("Enter your choice: "))
            if 1 <= choice <= len(headers):
                header = headers[choice - 1]
                while True:
                    if header in ["Desde", "Hasta"]:
                        value = input(f"Enter new {header} (DD/MM/YYYY): ")
                        try:
                            datetime.strptime(value, "%d/%m/%Y")
                            break
                        except ValueError:
                            print(f"Invalid date format for {header}. Please enter in DD/MM/YYYY format.")
                    else:
                        value = input(f"Enter new {header}: ")
                        break
                sheet.update_cell(row_num, choice, value)
                break
            elif choice == len(headers) + 1:
                for idx, header in enumerate(headers):
                    while True:
                        if header in ["Desde", "Hasta"]:
                            value = input(f"Enter new {header} (DD/MM/YYYY): ")
                            try:
                                datetime.strptime(value, "%d/%m/%Y")
                                break
                            except ValueError:
                                print(f"Invalid date format for {header}. Please enter in DD/MM/YYYY format.")
                        else:
                            value = input(f"Enter new {header}: ")
                            break
                    sheet.update_cell(row_num, idx + 1, value)
                break
            else:
                print("Invalid choice.")
        except ValueError:
            print("Incorrect Input, try again.")
    print("Row updated successfully!")

# Remove a row
def remove_row(sheet):
    while True:
        try:
            row_num = int(input("Enter the row number to remove: "))
            break
        except ValueError:
            print("Incorrect Input, try again.")

    row_data = sheet.row_values(row_num)
    if not row_data:
        print("Row not found.")
        return

    sheet.delete_rows(row_num)
    print("Row removed successfully!")

# Show a row
def show_row(sheet):
    while True:
        try:
            row_num = int(input("Enter the row number to show: "))
            break
        except ValueError:
            print("Incorrect Input, try again.")

    row_data = sheet.row_values(row_num)
    if not row_data:
        print("Row not found.")
        return

    headers = sheet.row_values(1)
    print("\nRow data:")
    for header, value in zip(headers, row_data):
        print(f"{header}: {value}")

# Main function
def main():
    sheet_url = "https://docs.google.com/spreadsheets/d/1E0fS_fwDJG1d2gWjP0RsT3nPXGvwcbMwgec1FzigSu0/edit?gid=0#gid=0"
    sheet, data = fetch_data(sheet_url)
    if not sheet:
        return

    while True:
        display_menu()
        try:
            choice = int(input("Enter your choice: "))
            if choice == 1:
                add_row(sheet)
            elif choice == 2:
                update_row(sheet)
            elif choice == 3:
                remove_row(sheet)
            elif choice == 4:
                show_row(sheet)
            elif choice == 5:
                break
            else:
                print("Invalid choice. Please select a valid option.")
        except ValueError:
            print("Incorrect Input, try again.")

if __name__ == "__main__":
    main()
