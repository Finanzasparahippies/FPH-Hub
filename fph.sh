#!/bin/bash

# FPH-Hub Management Script
# Inspired by Nectar Labs Boilerplate

PROJECT_NAME="fph-hub"

function help() {
    echo "Usage: ./fph.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  staging     Start staging environment"
    echo "  prod        Start production environment"
    echo "  stop        Stop all containers"
    echo "  restart     Restart all containers"
    echo "  logs [env]  Show logs (optional: staging, prod)"
    echo "  build       Rebuild images"
    echo "  shell       Enter backend shell"
    echo "  superuser   Create a Django superuser"
    echo "  migrate     Run database migrations"
    echo "  cleanup     Remove unused docker resources"
}

case "$1" in
    dev)
        echo "Ensuring shared network 'prod_network' exists..."
        docker network inspect prod_network >/dev/null 2>&1 || docker network create prod_network
        
        # Original dependencies
        docker volume inspect nectarlabs_certbot-conf >/dev/null 2>&1 || docker volume create nectarlabs_certbot-conf

        # Handle local SSL certificates for FPH
        mkdir -p ./letsencrypt/live/finanzasparahippies.com-0001
        if [ ! -f ./letsencrypt/live/finanzasparahippies.com-0001/fullchain.pem ]; then
            echo "Generating dummy FPH SSL certificates for local development..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ./letsencrypt/live/finanzasparahippies.com-0001/privkey.pem \
                -out ./letsencrypt/live/finanzasparahippies.com-0001/fullchain.pem \
                -subj "/C=MX/ST=CDMX/L=CDMX/O=FPH/OU=Dev/CN=localhost"
        fi
        chmod -R 755 ./letsencrypt
        
        docker compose up -d
        ;;
    staging)
        echo "Starting FPH Staging Environment..."
        docker network inspect prod_network >/dev/null 2>&1 || docker network create prod_network
        docker compose -f docker-compose.staging.yml up -d --build
        ;;
    prod)
        docker compose up -d
        ;;
    stop)
        docker compose down
        docker compose -f docker-compose.staging.yml down
        ;;
    restart)
        docker compose restart
        ;;
    logs)
        ENV=$2
        if [ "$ENV" == "staging" ]; then
            docker compose -f docker-compose.staging.yml logs -f
        else
            docker compose logs -f
        fi
        ;;
    build)
        docker compose build
        ;;
    shell)
        docker exec -it fph_backend bash
        ;;
    superuser)
        docker exec -it fph_backend python manage.py createsuperuser
        ;;
    migrate)
        docker exec -it fph_backend python manage.py migrate
        ;;
    cleanup)
        docker system prune -f
        docker volume prune -f
        ;;
    *)
        help
        ;;
esac
