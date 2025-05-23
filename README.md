# DietBot Project v. 1.2

This document provides instructions on how to set up and run the DietBot application, including both the backend and frontend services.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cdm-depaul/dietbot.git
    cd dietbot
    ```

2.  **Set up the Backend:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   **Supabase Project Setup:**
        1.  Go to [Supabase](https://supabase.com/) and create a new project or use an existing one.
        2.  In your Supabase project dashboard, navigate to **Project Settings** > **API**.
        3.  You will find your **Project URL** (this is your `SUPABASE_URL`) and the **anon public** key (this is your `SUPABASE_ANON_KEY`).

    *   The backend requires these environment variables. Create a `.env` file by copying the example file:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and fill in the required values you obtained from your Supabase project:
        *   `SUPABASE_URL`
        *   `SUPABASE_ANON_KEY`
        *   Also, configure your API keys for other services:
        *   `NUTRITIONIX_APP_ID`
        *   `NUTRITIONIX_API_KEY`
        *   `OLLAMA_MODEL` (optional, defaults to `dietbot`)
        *   `OLLAMA_API_URL` (optional, defaults to `http://host.docker.internal:11434/api/chat`)

## Supabase Table Schemas

Create your db tables in Supabase using these SQL commands:

### 1) user_profiles

```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                  BIGSERIAL       PRIMARY KEY,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
  name                TEXT,
  email               TEXT            UNIQUE,
  daily_calorie_goal  INTEGER,
  age                 INTEGER,
  sex                 TEXT,
  height              INTEGER,
  weight              REAL,
  activity_level      TEXT,
  allergies           TEXT[],
  likes               TEXT[],
  dislikes            TEXT[],
  diet                TEXT,
  goal                TEXT
);
```

### 2) chat_history

```sql
CREATE TABLE IF NOT EXISTS public.chat_history (
  id          BIGSERIAL    PRIMARY KEY,
  user_id     BIGINT       NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  sender      TEXT,
  message     TEXT
);
```

### 3) food_intake

```sql
CREATE TABLE IF NOT EXISTS public.food_intake (
  id          BIGSERIAL    PRIMARY KEY,
  user_id     BIGINT       NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  food_item   TEXT,
  calories    INTEGER,
  protein_g   NUMERIC,
  carbs_g     NUMERIC,
  fat_g       NUMERIC,
  details     JSONB
);
```

3.  **Set up the Frontend:**
    *   Navigate to the frontend directory (from the project root):
        ```bash
        cd frontend
        ```
    *   Install the necessary Node.js dependencies:
        ```bash
        npm install
        ```

 *   **Then, populate the supabase database:**
        Once your `.env` file is configured with the Supabase credentials, run the script to populate your database with initial schema and data. Make sure you are in the `backend` directory.
            ```bash
            python scripts/populate_supabase.py
            ```
        This script will create necessary tables and insert some sample data.
        
## Running the Application

### 1. Start the Backend Service

*   Navigate to the `backend` directory:
*   Start the backend services using Docker Compose:
    ```bash
    docker-compose up --build
    ```
    (You can omit `--build` on subsequent runs if the Docker image hasn't changed.)
*   The backend API will be running at `http://localhost:8001`.

### 2. Start the Frontend Service

*   Navigate to the `frontend` directory:
*   Start the Next.js development server:
    ```bash
    npm run dev
    ```
*   The frontend application will be accessible at `http://localhost:3000`.

### 3. Starting the ollama server:

To start Ollama server:

```bash
ollama pull gemma3
ollama serve
```
Restart ollama if port is already in use.

## Accessing the Application

Once both services are running, open your web browser and go to:

[http://localhost:3000](http://localhost:3000)

## Stopping the Application

*   **Backend**: In the terminal where `docker-compose up` is running, press `Ctrl+C`. To stop and remove the containers, you can run `docker-compose down` from the `backend` directory.
*   **Frontend**: In the terminal where `npm run dev` is running, press `Ctrl+C`.
