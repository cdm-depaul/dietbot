# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.12.7
FROM python:${PYTHON_VERSION}-slim AS base

# === ENVIRONMENT SETTINGS ===
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# === OPTIONAL: SYSTEM DEPENDENCIES ===
# Uncomment if your dependencies (like psycopg2) require them
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     gcc libpq-dev build-essential && \
#     rm -rf /var/lib/apt/lists/*

# === INSTALL PYTHON DEPENDENCIES FIRST TO LEVERAGE CACHE ===
COPY requirements.txt .
RUN python -m pip install --upgrade pip && \
    pip install --default-timeout=300 -r requirements.txt

# Install Python dependencies with increased timeout
RUN pip install --default-timeout=300 --no-cache-dir -r requirements.txt

# (*) 7/27 nt: Install logging package
RUN pip install python-json-logger

# Copy the rest of the application code into the container
COPY . .

# (*) 7/27 nt: Make log directory inside the container (to match volume mount)
RUN mkdir -p /logs


# (*) 7/27 nt: Set the default command to run the app
CMD ["python", "app.py"]

# Expose the port the app will run on (matching the uvicorn command)
EXPOSE 8001



# === COPY APPLICATION CODE ===
COPY . .

# === OPTIONAL: Drop privileges ===
# RUN useradd -m appuser && chown -R appuser /app
# USER appuser

EXPOSE 8080
CMD ["uvicorn", "dietbot.main:app", "--host", "0.0.0.0", "--port", "8080"]
