#!/bin/bash

# Setup script for PostgreSQL test database
# This script initializes the test database schema and prepares it for integration tests

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
POSTGRES_DB=${POSTGRES_DB:-quotes_test}

echo -e "${YELLOW}🚀 Setting up PostgreSQL test database...${NC}"
echo "Host: $POSTGRES_HOST"
echo "Port: $POSTGRES_PORT"
echo "User: $POSTGRES_USER"
echo "Database: $POSTGRES_DB"

# Function to check if PostgreSQL is ready
wait_for_postgres() {
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c '\q' 2>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts: PostgreSQL not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ PostgreSQL failed to become ready after $max_attempts attempts${NC}"
    return 1
}

# Function to create test database
create_test_database() {
    echo -e "${YELLOW}📦 Creating test database...${NC}"
    
    # Check if database exists
    if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -lqt | cut -d \| -f 1 | grep -qw $POSTGRES_DB; then
        echo -e "${YELLOW}⚠️  Database '$POSTGRES_DB' already exists${NC}"
        
        # Drop and recreate for clean state
        echo -e "${YELLOW}🗑️  Dropping existing database...${NC}"
        PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"
    fi
    
    # Create new database
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $POSTGRES_DB;"
    echo -e "${GREEN}✅ Test database created successfully${NC}"
}

# Function to run database migrations/schema setup
setup_schema() {
    echo -e "${YELLOW}🏗️  Setting up database schema...${NC}"
    
    # Set NODE_ENV to test for proper configuration
    export NODE_ENV=test
    
    # Run TypeORM synchronization to create tables
    cd "$(dirname "$0")/.."
    
    if command -v pnpm &> /dev/null; then
        echo "Using pnpm to run schema setup..."
        pnpm run typeorm:migration:run || {
            echo -e "${YELLOW}⚠️  Migrations not found, using synchronize instead...${NC}"
            # If migrations don't exist, we'll rely on synchronize in the test config
            echo -e "${GREEN}✅ Schema will be synchronized during test runs${NC}"
        }
    else
        echo -e "${YELLOW}⚠️  pnpm not found, schema will be synchronized during test runs${NC}"
    fi
}

# Function to verify setup
verify_setup() {
    echo -e "${YELLOW}🔍 Verifying database setup...${NC}"
    
    # Test connection to the test database
    if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c '\q' 2>/dev/null; then
        echo -e "${GREEN}✅ Database connection verified${NC}"
    else
        echo -e "${RED}❌ Failed to connect to test database${NC}"
        return 1
    fi
    
    # Check if we can create a simple table (basic permissions test)
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "
        CREATE TABLE IF NOT EXISTS test_setup_verification (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        DROP TABLE test_setup_verification;
    " > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database permissions verified${NC}"
    else
        echo -e "${RED}❌ Database permissions test failed${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${YELLOW}🎯 Starting PostgreSQL test database setup...${NC}"
    
    # Wait for PostgreSQL to be ready
    wait_for_postgres || exit 1
    
    # Create test database
    create_test_database || exit 1
    
    # Setup schema
    setup_schema || exit 1
    
    # Verify setup
    verify_setup || exit 1
    
    echo -e "${GREEN}🎉 PostgreSQL test database setup completed successfully!${NC}"
    echo -e "${GREEN}📋 Database ready for integration tests${NC}"
}

# Run main function
main "$@"
