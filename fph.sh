#!/bin/bash

# FPH-Hub Management Script
# Inspired by Nectar Labs Boilerplate

PROJECT_NAME="fph-hub"

function help() {
    echo "Usage: ./fph.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  stop        Stop all containers"
    echo "  restart     Restart all containers"
    echo "  logs        Show logs from all containers"
    echo "  build       Rebuild images"
    echo "  shell       Enter backend shell"
    echo "  superuser   Create a Django superuser"
    echo "  migrate     Run database migrations"
    echo "  cleanup     Remove unused docker resources"
}

case "$1" in
    dev)
        echo "Checking environment dependencies..."
        # Create network if it doesn't exist
        docker network inspect nectarlabs_default >/dev/null 2>&1 || {
            echo "Creating network: nectarlabs_default"
            docker network create nectarlabs_default
        }
        
        # Create missing external volumes if they don't exist
        docker volume inspect nectarlabs_certbot-conf >/dev/null 2>&1 || {
            echo "Creating volume: nectarlabs_certbot-conf"
            docker volume create nectarlabs_certbot-conf
        }

        # Handle local SSL certificates for FPH
        mkdir -p ./letsencrypt/live/finanzasparahippies.com-0001
        if [ ! -f ./letsencrypt/live/finanzasparahippies.com-0001/fullchain.pem ]; then
            echo "Generating dummy FPH SSL certificates for local development..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ./letsencrypt/live/finanzasparahippies.com-0001/privkey.pem \
                -out ./letsencrypt/live/finanzasparahippies.com-0001/fullchain.pem \
                -subj "/C=MX/ST=CDMX/L=CDMX/O=FPH/OU=Dev/CN=localhost"
        fi
        # Ensure permissions are correct every time for dev
        chmod -R 755 ./letsencrypt
        find ./letsencrypt -type f -name "*.pem" -exec chmod 644 {} +

        # Handle local SSL certificates for Nectar
        mkdir -p ./nectar-ssl/live/nectarlabs.dev
        if [ ! -f ./nectar-ssl/live/nectarlabs.dev/fullchain.pem ]; then
            echo "Generating dummy Nectar SSL certificates for local development..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ./nectar-ssl/live/nectarlabs.dev/privkey.pem \
                -out ./nectar-ssl/live/nectarlabs.dev/fullchain.pem \
                -subj "/C=MX/ST=CDMX/L=CDMX/O=Nectar/OU=Dev/CN=localhost"
        fi
        # Ensure permissions are correct every time for dev
        chmod -R 755 ./nectar-ssl
        find ./nectar-ssl -type f -name "*.pem" -exec chmod 644 {} +
            
        docker compose up
        ;;
    prod)
        # On server, link local cert dirs to the system ones if they don't exist
        [ -L ./letsencrypt ] || [ -d ./letsencrypt ] || ln -s /etc/letsencrypt ./letsencrypt
        [ -L ./nectar-ssl ] || [ -d ./nectar-ssl ] || ln -s /etc/nectar-ssl ./nectar-ssl
        docker compose up -d
        ;;
    stop)
        docker compose stop
        ;;
    restart)
        docker compose restart
        ;;
    logs)
        docker compose logs -f
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
