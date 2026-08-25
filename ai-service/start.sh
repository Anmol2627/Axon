#!/bin/bash
# Start script for Render deployment
echo "Starting Uvicorn server on port ${PORT:-8000}..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
