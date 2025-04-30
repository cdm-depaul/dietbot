# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.12.7
FROM python:${PYTHON_VERSION}-slim as base

# Set environment variables to prevent generating .pyc files and ensure logs aren't buffered
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies that might be needed by psycopg2
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*
# Note: -slim images might require installing build tools first if needed for pip installs.
# Alpine images (like python:3.10-alpine) are smaller but might require different packages (e.g., postgresql-dev instead of libpq-dev).
# Let's try without explicit system deps first, psycopg2-binary often includes them.

# Copy only the requirements file first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies with increased timeout
RUN pip install --default-timeout=300 --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on (matching the uvicorn command)
EXPOSE 8000

# The command to run the application is specified in docker-compose.yml,
# but we can add a default CMD here as a fallback or for running the container directly.
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"] # Adjust 'app:app' if needed
