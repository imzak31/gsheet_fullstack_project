# Vacations Sheet Manager (Web/CLI) - Ruby/TS/Python

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
- [Pending Features](#pending-features)

## Introduction

Welcome to **Vacations sheets Manager**! This project aims to import excel files containing information of Vacation Sheets, and then present that information in a comprehensive Rails API and observe it on a ReactTS Frontend with material UI.

## Features

- Feature 1: Rails API able to paginate large endpoints and present the information on a comprehensive serializable object.
- Feature 2: A ReactTS frontend app, able to communicate with Rails API and present the information, filter it and do multiple interactions with it.
- Feature 3: A Python CLI tool, that authenticates with GCP and can manipulate an specific GSheet object via API.

## Technologies Used

- **Backend:** Ruby on Rails, Sidekiq, Redis
- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **API Integration:** Google Sheets API, GCP Buckets

## Installation

### Prerequisites

- Ruby version: 3.2.4
- Sidekiq version: Latest
- Node.js version: Latest
- NPM version: Latest
- PostgreSQL version: Latest

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/imzak31/gsheet_fullstack_project
   cd vacations_sheet_manager
   
2. Install dependencies:
   ```bash
   bundle install
   cd frontend && npm install
   
3. Setup the API Database:
   ```bash
   rails db:create
   rails db:migrate

4. Setup an .env file in the root directory and add the following content:
    ```bash
    POSTGRES_USERNAME=
    POSTGRES_PASSWORD=
    POSTGRES_HOST=
    POSTGRES_PORT=
    POSTGRES_DB=
    POSTGRES_TEST_DB=
    POSTGRES_PROD_DB=
    POSTGRES_PROD_USERNAME=
    POSTGRES_PROD_PASSWORD=
    BASE_PORT=8080
    GOOGLE_CLOUD_PROJECT=
    GOOGLE_CLOUD_KEYFILE=
    GOOGLE_CLOUD_STORAGE_BUCKET=
    REDIS_URL=
    ```
    - Replace the values with your own configurations.

5. Copy the GCP keyfile on the following directories:
    ```bash
    config/gcp_secrets/keyfile.json
    python_gsheet_editor/gsheet_editor/credentials/keyfile.json
    ```
    - This is required for the Google Sheets API integration and GCP Buckets Integration.

6. Start the servers:
    ```bash
    rails s -p 8080
   bundle exec sidekiq ## For the background jobs that handle the File imports
    cd frontend && npm start
   
7. Visit `http://localhost:3000` to access the React application with the Frontend functionalities.
- Sign Up with the credentials you like!
- Import a Sheet as the one provided on the /tmp/storage folder.
- Enjoy the functionalities!

8. Run the Python Script to update the Google Sheet:
    ```bash
    cd python_gsheet_editor/gsheet_editor
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python google_sheet_editor.py
    ```
    - This will manipulate the Google Sheet defined in the URL by using the GSheet API, by an easy to use and funny CLI tool.
    - You can find the link to the actual file in the `google_sheet_editor.py` file. This way you can have lots of fun seeing the live updates!

## Pending Features
    - Redirect to Sign In/Sign Up after token expiral
    - Add more functionalities to the Python CLI tool (bulk Updates, i.e)
    - Add more functionalities to the Frontend (i.e. Delete a row, Update a row, etc)
    - Integrate Python Microservices to current rails API to sync the Google Sheet with the Database