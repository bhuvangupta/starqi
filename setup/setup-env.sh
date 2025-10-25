#!/bin/bash

###############################################################################
# StarQI Environment Setup Script
#
# This script helps you set up environment variables for different environments
#
# Usage:
#   ./setup-env.sh [environment]
#
# Environments:
#   development, staging, production
#
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-development}
PROJECT_ROOT="$(dirname "$(dirname "$0")")"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     StarQI Environment Setup - $ENVIRONMENT                      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Generate a random secret
generate_secret() {
    openssl rand -base64 32
}

# Prompt for input with default value
prompt_with_default() {
    local prompt=$1
    local default=$2
    local varname=$3

    read -p "$prompt [$default]: " value
    value=${value:-$default}
    eval "$varname='$value'"
}

echo -e "${GREEN}Setting up environment: $ENVIRONMENT${NC}"
echo ""

# Database Configuration
echo -e "${YELLOW}Database Configuration${NC}"
prompt_with_default "Database host" "localhost" DB_HOST
prompt_with_default "Database port" "3306" DB_PORT
prompt_with_default "Database name" "starqi" DB_DATABASE
prompt_with_default "Database username" "starqi_user" DB_USERNAME
prompt_with_default "Database password" "starqi_pass" DB_PASSWORD

# JWT Configuration
echo ""
echo -e "${YELLOW}JWT Configuration${NC}"
JWT_SECRET=$(generate_secret)
echo "Generated JWT secret: ${JWT_SECRET:0:20}..."
prompt_with_default "JWT expiration" "7d" JWT_EXPIRES_IN

# Server Configuration
echo ""
echo -e "${YELLOW}Server Configuration${NC}"
prompt_with_default "Server port" "5000" PORT

if [ "$ENVIRONMENT" = "production" ]; then
    prompt_with_default "Domain name" "starqi.org" DOMAIN
    BASE_URL="https://$DOMAIN"
    CORS_ORIGIN="https://$DOMAIN"
    VITE_API_URL="https://$DOMAIN/api"
else
    BASE_URL="http://localhost:5000"
    CORS_ORIGIN="http://localhost:5173"
    VITE_API_URL="http://localhost:5000/api"
fi

# Redis Configuration (for production)
if [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo -e "${YELLOW}Redis Configuration${NC}"
    REDIS_PASSWORD=$(generate_secret)
    echo "Generated Redis password: ${REDIS_PASSWORD:0:20}..."
fi

# Create root .env file
ENV_FILE="$PROJECT_ROOT/.env.$ENVIRONMENT"

echo ""
echo -e "${GREEN}Creating environment file: $ENV_FILE${NC}"

cat > "$ENV_FILE" << EOF
# StarQI Environment Configuration - $ENVIRONMENT
# Generated: $(date)

# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=$DB_DATABASE
DB_ROOT_PASSWORD=$DB_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=$JWT_EXPIRES_IN

# Server Configuration
PORT=$PORT
NODE_ENV=$ENVIRONMENT
BASE_URL=$BASE_URL
CORS_ORIGIN=$CORS_ORIGIN

# File Upload
MAX_FILE_SIZE=10485760

# API URL for frontend
VITE_API_URL=$VITE_API_URL
EOF

# Add Redis for production
if [ "$ENVIRONMENT" = "production" ]; then
    cat >> "$ENV_FILE" << EOF

# Redis Configuration
REDIS_PASSWORD=$REDIS_PASSWORD
REDIS_HOST=redis
REDIS_PORT=6379
EOF
fi

# Create server .env file
SERVER_ENV="$PROJECT_ROOT/server/.env"
echo ""
echo -e "${GREEN}Creating server environment file: $SERVER_ENV${NC}"

cp "$ENV_FILE" "$SERVER_ENV"

# Create client .env file
CLIENT_ENV="$PROJECT_ROOT/client/.env"
echo ""
echo -e "${GREEN}Creating client environment file: $CLIENT_ENV${NC}"

cat > "$CLIENT_ENV" << EOF
# StarQI Client Environment Configuration - $ENVIRONMENT
# Generated: $(date)

VITE_API_URL=$VITE_API_URL
EOF

echo ""
echo -e "${GREEN}✔ Environment setup complete!${NC}"
echo ""
echo -e "${YELLOW}Files created:${NC}"
echo "  - $ENV_FILE"
echo "  - $SERVER_ENV"
echo "  - $CLIENT_ENV"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review the generated files"
echo "  2. Update any specific values as needed"
echo "  3. Never commit these files to version control!"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}Production reminders:${NC}"
    echo "  - Set up SSL certificates in ./ssl/"
    echo "  - Configure your domain's DNS"
    echo "  - Set up firewall rules"
    echo "  - Configure backup strategy"
    echo "  - Set up monitoring and alerting"
    echo ""
fi
