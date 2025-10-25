#!/bin/bash

###############################################################################
# StarQI Deployment Script
#
# This script automates the deployment of StarQI to production servers
#
# Usage:
#   ./deploy.sh [environment] [options]
#
# Environments:
#   development - Deploy to development environment
#   staging     - Deploy to staging environment
#   production  - Deploy to production environment
#
# Options:
#   --skip-backup    Skip database backup
#   --skip-build     Skip build process
#   --skip-migrate   Skip database migration
#   --help           Show this help message
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="starqi"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Default options
SKIP_BACKUP=false
SKIP_BUILD=false
SKIP_MIGRATE=false
ENVIRONMENT=""

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                           ║${NC}"
    echo -e "${BLUE}║        🌌 StarQI Deployment Script                        ║${NC}"
    echo -e "${BLUE}║                                                           ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}▶ $1${NC}"
}

print_error() {
    echo -e "${RED}✖ Error: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ Warning: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✔ $1${NC}"
}

show_help() {
    cat << EOF
StarQI Deployment Script

Usage:
    ./deploy.sh [environment] [options]

Environments:
    development     Deploy to development environment
    staging         Deploy to staging environment
    production      Deploy to production environment

Options:
    --skip-backup   Skip database backup
    --skip-build    Skip build process
    --skip-migrate  Skip database migration
    --help          Show this help message

Examples:
    ./deploy.sh production
    ./deploy.sh staging --skip-backup
    ./deploy.sh development --skip-build --skip-migrate

EOF
    exit 0
}

check_prerequisites() {
    print_step "Checking prerequisites..."

    local missing_deps=()

    # Check for required commands
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v docker >/dev/null 2>&1 || missing_deps+=("docker")
    command -v docker-compose >/dev/null 2>&1 || missing_deps+=("docker-compose")

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        echo "Please install missing dependencies and try again."
        exit 1
    fi

    print_success "All prerequisites met"
}

load_environment() {
    print_step "Loading environment configuration..."

    local env_file="$PROJECT_ROOT/.env.$ENVIRONMENT"

    if [ ! -f "$env_file" ]; then
        print_warning "Environment file not found: $env_file"
        print_warning "Using .env file instead"
        env_file="$PROJECT_ROOT/.env"
    fi

    if [ -f "$env_file" ]; then
        export $(grep -v '^#' "$env_file" | xargs)
        print_success "Environment loaded: $ENVIRONMENT"
    else
        print_error "No environment file found"
        exit 1
    fi
}

backup_database() {
    if [ "$SKIP_BACKUP" = true ]; then
        print_warning "Skipping database backup (--skip-backup flag)"
        return
    fi

    print_step "Creating database backup..."

    local backup_dir="$PROJECT_ROOT/backups"
    local backup_file="$backup_dir/${PROJECT_NAME}_${ENVIRONMENT}_${TIMESTAMP}.sql"

    mkdir -p "$backup_dir"

    if [ "$ENVIRONMENT" = "production" ]; then
        # Production backup
        docker exec starqi-db mysqldump -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" > "$backup_file" 2>/dev/null

        if [ $? -eq 0 ]; then
            gzip "$backup_file"
            print_success "Database backed up: ${backup_file}.gz"
        else
            print_error "Database backup failed"
            exit 1
        fi
    else
        print_warning "Database backup skipped for non-production environment"
    fi
}

stop_services() {
    print_step "Stopping current services..."

    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" down
    else
        docker-compose -f "$PROJECT_ROOT/docker-compose.yml" down
    fi

    print_success "Services stopped"
}

pull_latest_code() {
    print_step "Pulling latest code..."

    cd "$PROJECT_ROOT"

    # Check if git repository
    if [ -d ".git" ]; then
        git pull origin main
        print_success "Code updated"
    else
        print_warning "Not a git repository, skipping git pull"
    fi
}

install_dependencies() {
    print_step "Installing dependencies..."

    cd "$PROJECT_ROOT"

    # Root dependencies
    npm install --production

    # Server dependencies
    cd "$PROJECT_ROOT/server"
    npm install --production

    # Client dependencies
    cd "$PROJECT_ROOT/client"
    npm install

    cd "$PROJECT_ROOT"

    print_success "Dependencies installed"
}

build_application() {
    if [ "$SKIP_BUILD" = true ]; then
        print_warning "Skipping build (--skip-build flag)"
        return
    fi

    print_step "Building application..."

    # Build server
    cd "$PROJECT_ROOT/server"
    npm run build

    # Build client
    cd "$PROJECT_ROOT/client"
    npm run build

    cd "$PROJECT_ROOT"

    print_success "Application built successfully"
}

run_database_migrations() {
    if [ "$SKIP_MIGRATE" = true ]; then
        print_warning "Skipping database migrations (--skip-migrate flag)"
        return
    fi

    print_step "Running database migrations..."

    # Start database service
    docker-compose up -d db

    # Wait for database to be ready
    sleep 10

    # Run migrations (TypeORM will auto-sync in development)
    if [ "$ENVIRONMENT" = "production" ]; then
        cd "$PROJECT_ROOT/server"
        npm run typeorm migration:run
    fi

    print_success "Database migrations completed"
}

start_services() {
    print_step "Starting services..."

    cd "$PROJECT_ROOT"

    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose up -d
    fi

    print_success "Services started"
}

health_check() {
    print_step "Performing health check..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:5000/health >/dev/null 2>&1; then
            print_success "Health check passed"
            return 0
        fi

        echo -n "."
        sleep 2
        ((attempt++))
    done

    print_error "Health check failed after $max_attempts attempts"
    return 1
}

show_deployment_info() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║          Deployment Completed Successfully!               ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Environment:${NC} $ENVIRONMENT"
    echo -e "${GREEN}Timestamp:${NC} $TIMESTAMP"
    echo ""
    echo -e "${GREEN}Services:${NC}"
    echo -e "  Frontend: http://localhost:5173"
    echo -e "  Backend:  http://localhost:5000"
    echo -e "  Health:   http://localhost:5000/health"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Verify application is running"
    echo -e "  2. Check logs: docker-compose logs -f"
    echo -e "  3. Monitor system metrics"
    echo ""
}

cleanup() {
    print_step "Cleaning up..."

    # Remove old backups (keep last 10)
    if [ -d "$PROJECT_ROOT/backups" ]; then
        cd "$PROJECT_ROOT/backups"
        ls -t | tail -n +11 | xargs -r rm
    fi

    # Remove old Docker images
    docker image prune -f

    print_success "Cleanup completed"
}

###############################################################################
# Main Deployment Flow
###############################################################################

main() {
    print_header

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            development|staging|production)
                ENVIRONMENT=$1
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-migrate)
                SKIP_MIGRATE=true
                shift
                ;;
            --help)
                show_help
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                ;;
        esac
    done

    # Validate environment
    if [ -z "$ENVIRONMENT" ]; then
        print_error "Environment not specified"
        show_help
    fi

    # Confirmation for production
    if [ "$ENVIRONMENT" = "production" ]; then
        echo -e "${YELLOW}⚠ WARNING: You are about to deploy to PRODUCTION${NC}"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Deployment cancelled"
            exit 0
        fi
    fi

    echo "Deploying to: $ENVIRONMENT"
    echo ""

    # Execute deployment steps
    check_prerequisites
    load_environment
    backup_database
    stop_services
    pull_latest_code
    install_dependencies
    build_application
    run_database_migrations
    start_services

    # Wait for services to start
    sleep 5

    health_check
    cleanup
    show_deployment_info
}

# Run main function
main "$@"
