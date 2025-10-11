#!/bin/bash

# Database setup script for OSCE Feedback System
# This script sets up the PostgreSQL database with schema and sample data

echo "Setting up OSCE Feedback System Database..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Database configuration
DB_NAME="osce_feedback"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "Creating database: $DB_NAME"

# Create database (ignore error if it already exists)
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database $DB_NAME already exists"

echo "Running schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema.sql

echo "Loading sample data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/sample_data.sql

echo "Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env.local and update database credentials"
echo "2. Run 'npm run dev' to start the application"
echo "3. Visit http://localhost:3000 to see the application"
