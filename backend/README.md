How to run the backend:

## Prerequisites

- Python 3.12+
- PostgreSQL 15+
- Docker and Docker Compose (optional, for containerized setup)
- API keys for external services (if needed)

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dietbot/backend
   ```

2. Create a `.env` file based on the provided example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration:
   ```
   # API Keys (if needed)
   HUGGINGFACE_API_KEY=YOUR_HUGGINGFACE_API_KEY
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
   NUTRITIONIX_APP_ID=YOUR_NUTRITIONIX_APP_ID
   NUTRITIONIX_API_KEY=YOUR_NUTRITIONIX_API_KEY

   # Database Configuration, leave these
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=dietbotdb
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   
   # When running locally, this will be constructed from the above variables
   # When running with Docker, this will be set automatically
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dietbotdb
   ```

## Running with Docker

Docker is the recommended way to run the application as it handles all dependencies and database setup automatically.

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Start a PostgreSQL database container
   - Build and start the application container
   - Initialize the database tables
   - Start the FastAPI server on port 8000

3. Access the API at http://localhost:8000

4. To stop the application:
   ```bash
   docker-compose down
   ```

5. To stop the application and remove all data (including the database volume):
   ```bash
   docker-compose down -v
   ```

## Running without Docker

### 1. Set up PostgreSQL

Install and start PostgreSQL on your system:

Create a database and user:

```sql
CREATE DATABASE dietbotdb;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE dietbotdb TO postgres;
\q
```

### 2. Install Python dependencies

It's recommended to use a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. System Dependencies

Some Python packages require system dependencies to compile:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y gcc libpq-dev python3-dev build-essential curl pkg-config

# macOS (using Homebrew)
brew install postgresql pkg-config
```

### 4. Initialize the database

Run the database initialization script:

```bash
python init_db.py
```

### 5. Start the application

```bash
uvicorn dietbot.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at http://localhost:8000

## Database Setup

The application uses PostgreSQL for data storage. The database schema is automatically created when you run:

```bash
python init_db.py
```