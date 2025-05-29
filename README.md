# Workforce Monitoring
A system for managing employee activity track daily logs, monitor breaks, handle shift adjustment requests, assign account managers, add employees, and generate reports.
## Features
- View and track daily logs
- Monitor and record employee breaks
- Approve or reject shift adjustment requests
- Assign managers to accounts
- Create and manage employee profiles
- Generate reports
## Getting Started
Clone the repository:
git clone ssh://repo.ecomia.com/johnsensopeta555/intranet-monitoring.git <br>
Navigate to the project folder <br>
cd your-repo

## Environment Settings

Create or edit .env file
nano .env

NEXT_PUBLIC_BACKEND=WEB_SERVER_ENDPOINT<br>
NEXT_PUBLIC_SECRET_KEY=ANY_GENERATED_UNIQUE_COMBINATION_OF_KEYS


## Testing
docker-compose build <br>
docker compose up