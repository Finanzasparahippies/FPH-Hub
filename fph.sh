#!/bin/bash

# ==============================================================================
# FPH-HUB CLI v2.0 | Nectar Labs Architecture Standard
# Script de gestión integral multi-entorno (Dev, Staging, Producción)
# ==============================================================================

COMMAND=$1
if [ $# -gt 0 ]; then
    shift
fi

# Colores y Estilos ANSI
BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RED="\033[31m"
MAGENTA="\033[35m"
RESET="\033[0m"

# Detección de Runtime de Contenedores (Docker o Podman)
if command -v docker &> /dev/null; then
    DOCKER_BIN="docker"
elif command -v podman &> /dev/null; then
    DOCKER_BIN="podman"
else
    echo -e "${RED}====================================================${RESET}"
    echo -e "${RED}  [ERROR] No se encontró 'docker' ni 'podman' en PATH  ${RESET}"
    echo -e "${RED}====================================================${RESET}"
    exit 1
fi

# Detección de Compose Provider
COMPOSE_BIN=""
if [ "$DOCKER_BIN" = "docker" ]; then
    if docker compose version &> /dev/null; then
        COMPOSE_BIN="docker compose"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_BIN="docker-compose"
    fi
elif [ "$DOCKER_BIN" = "podman" ]; then
    if command -v podman-compose &> /dev/null; then
        COMPOSE_BIN="podman-compose"
    elif podman compose version &> /dev/null 2>&1; then
        COMPOSE_BIN="podman compose"
    fi
fi

if [ -z "$COMPOSE_BIN" ]; then
    COMPOSE_BIN="docker compose"
fi

# Asegurar la existencia de la red externa 'prod_network'
ensure_network() {
    local net_name="prod_network"
    if ! $DOCKER_BIN network inspect "$net_name" >/dev/null 2>&1; then
        echo -e "${CYAN}🌐 Creando red de contenedores '$net_name'...${RESET}"
        $DOCKER_BIN network create "$net_name" >/dev/null 2>&1 || true
    fi
}

# Helper para validar si un contenedor específico está en ejecución
is_container_running() {
    local container_name=$1
    $DOCKER_BIN ps --format "{{.Names}}" 2>/dev/null | grep -q "^${container_name}$"
}

# Helpers para ejecutar comandos Django (manage.py) por entorno
run_django_cmd_dev() {
    local tty_flag=""
    if [ -t 0 ]; then tty_flag="-it"; fi
    if is_container_running "fph_backend"; then
        $DOCKER_BIN exec $tty_flag fph_backend python manage.py "$@"
    elif $COMPOSE_BIN ps 2>/dev/null | grep -q "backend"; then
        $COMPOSE_BIN exec $tty_flag backend python manage.py "$@"
    else
        $COMPOSE_BIN run --rm $tty_flag -w /app backend python manage.py "$@"
    fi
}

run_django_cmd_staging() {
    local tty_flag=""
    if [ -t 0 ]; then tty_flag="-it"; fi
    if is_container_running "fph_backend_staging"; then
        $DOCKER_BIN exec $tty_flag fph_backend_staging python manage.py "$@"
    elif $COMPOSE_BIN -f docker-compose.staging.yml ps 2>/dev/null | grep -q "fph-backend-staging"; then
        $COMPOSE_BIN -f docker-compose.staging.yml exec $tty_flag fph-backend-staging python manage.py "$@"
    else
        $COMPOSE_BIN -f docker-compose.staging.yml run --rm $tty_flag -w /app fph-backend-staging python manage.py "$@"
    fi
}

run_django_cmd_prod() {
    local tty_flag=""
    if [ -t 0 ]; then tty_flag="-it"; fi
    if is_container_running "fph_backend_prod"; then
        $DOCKER_BIN exec $tty_flag fph_backend_prod python manage.py "$@"
    elif $COMPOSE_BIN -f docker-compose.prod.yml ps 2>/dev/null | grep -q "fph_backend_prod"; then
        $COMPOSE_BIN -f docker-compose.prod.yml exec $tty_flag fph_backend_prod python manage.py "$@"
    else
        $COMPOSE_BIN -f docker-compose.prod.yml run --rm $tty_flag -w /app fph_backend_prod python manage.py "$@"
    fi
}

# Helpers para ejecutar comandos npm en Frontend por entorno
run_npm_cmd_dev() {
    local tty_flag=""
    if [ -t 0 ]; then tty_flag="-it"; fi
    if is_container_running "fph_frontend"; then
        $DOCKER_BIN exec $tty_flag fph_frontend npm "$@"
    elif [ -d "finanzasparahippies-front" ] && command -v npm &> /dev/null; then
        (cd finanzasparahippies-front && npm "$@")
    else
        $COMPOSE_BIN run --rm $tty_flag -w /app fph_frontend npm "$@"
    fi
}

run_npm_cmd_staging() {
    local tty_flag=""
    if [ -t 0 ]; then tty_flag="-it"; fi
    if is_container_running "fph_frontend_staging"; then
        $DOCKER_BIN exec $tty_flag fph_frontend_staging npm "$@"
    else
        $COMPOSE_BIN -f docker-compose.staging.yml run --rm $tty_flag frontend-staging npm "$@"
    fi
}

run_npm_cmd_prod() {
    local tty_flag=""
    if [ -t 0 ]; then tty_flag="-it"; fi
    if is_container_running "fph_frontend_prod"; then
        $DOCKER_BIN exec $tty_flag fph_frontend_prod npm "$@"
    else
        $COMPOSE_BIN -f docker-compose.prod.yml run --rm $tty_flag fph_frontend_prod npm "$@"
    fi
}

# Helper para eliminar conflictos de nombres de contenedores
remove_conflicting_containers() {
    local container_names=("$@")
    for container in "${container_names[@]}"; do
        if $DOCKER_BIN ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${container}$"; then
            echo -e "${YELLOW}⚠️ Eliminando contenedor previo '${container}' para prevenir conflictos...${RESET}"
            $DOCKER_BIN rm -f "${container}" 2>/dev/null || true
        fi
    done
}

show_help() {
    echo -e "${BOLD}${CYAN}"
    echo "================================================================="
    echo "       FPH-HUB CLI v2.0 | Multi-Environment Management          "
    echo "================================================================="
    echo -e "${RESET}"
    echo -e "${BOLD}Uso:${RESET} ./fph.sh [comando] [opciones]"
    echo ""
    echo -e "${BOLD}${GREEN}=== ENTORNO DE DESARROLLO (DEV) ===${RESET}"
    echo "  dev                      - Inicia el entorno local de desarrollo (Docker)"
    echo "  deploy / deploy-dev      - Reconstruye e inicia entorno dev"
    echo "  stop                     - Detiene los contenedores de desarrollo"
    echo "  restart                  - Reinicia los contenedores de desarrollo"
    echo "  status / status-dev      - Muestra el estado de contenedores dev"
    echo "  logs                     - Muestra los logs en tiempo real de dev"
    echo "  manage [args...]         - Ejecuta cualquier comando manage.py (Dev)"
    echo "  makemigrations           - Genera migraciones de Django (Dev)"
    echo "  migrate                  - Aplica migraciones de base de datos (Dev)"
    echo "  createsuperuser          - Crea usuario administrador Django (Dev)"
    echo "  shell                    - Abre la consola interactiva Python (Dev)"
    echo "  test                     - Ejecuta la suite de pruebas unitarias (Dev)"
    echo "  pycheck                  - Verifica sintaxis de código Python (Dev)"
    echo "  typecheck                - Ejecuta verificación TypeScript en frontend (Dev)"
    echo "  seed                     - Carga datos de prueba (Blog, Recursos, Newsletter)"
    echo ""
    echo -e "${BOLD}${YELLOW}=== ENTORNO DE STAGING (STAGING) ===${RESET}"
    echo "  up-staging               - Inicia entorno de staging"
    echo "  deploy-staging           - Reconstruye e inicia entorno de staging"
    echo "  down-staging             - Detiene entorno de staging"
    echo "  restart-staging          - Reinicia contenedores de staging"
    echo "  status-staging           - Muestra el estado de contenedores de staging"
    echo "  logs-staging             - Muestra los logs en tiempo real de staging"
    echo "  manage-staging [args...] - Ejecuta cualquier comando manage.py (Staging)"
    echo "  migrate-staging          - Aplica migraciones de base de datos (Staging)"
    echo "  createsuperuser-staging  - Crea usuario administrador (Staging)"
    echo "  shell-staging            - Abre consola interactiva Python (Staging)"
    echo "  test-staging             - Ejecuta suite de pruebas en Staging"
    echo ""
    echo -e "${BOLD}${MAGENTA}=== ENTORNO DE PRODUCCIÓN (PROD) ===${RESET}"
    echo "  up-prod                  - Inicia entorno de producción"
    echo "  deploy-prod              - Reconstruye e inicia entorno de producción"
    echo "  down-prod                - Detiene entorno de producción"
    echo "  restart-prod             - Reinicia contenedores de producción"
    echo "  status-prod              - Muestra el estado de contenedores de producción"
    echo "  logs-prod                - Muestra los logs en tiempo real de producción"
    echo "  build-prod               - Reconstruye las imágenes de producción"
    echo "  manage-prod [args...]    - Ejecuta cualquier comando manage.py (Prod)"
    echo "  migrate-prod             - Aplica migraciones de base de datos (Prod)"
    echo "  createsuperuser-prod     - Crea usuario administrador (Prod)"
    echo "  shell-prod               - Abre consola interactiva Python (Prod)"
    echo "  collectstatic-prod       - Ejecuta collectstatic en el backend (Prod)"
    echo ""
    echo -e "${BOLD}${CYAN}=== UTILIDADES ===${RESET}"
    echo "  clean [--all|-a]        - Limpieza segura de cachés y volúmenes Docker"
    echo "  help                     - Muestra este panel de ayuda"
}

case $COMMAND in
    # ── ENTORNO DEV ──
    dev)
        echo -e "${GREEN}🚀 Iniciando entorno Dev FPH-Hub...${RESET}"
        ensure_network
        remove_conflicting_containers fph_backend fph_frontend
        $COMPOSE_BIN up -d "$@"
        ;;
    deploy|deploy-dev)
        echo -e "${GREEN}📦 Desplegando entorno Dev FPH-Hub...${RESET}"
        ensure_network
        remove_conflicting_containers fph_backend fph_frontend
        $COMPOSE_BIN up -d --build "$@"
        ;;
    stop)
        echo -e "${YELLOW}🛑 Deteniendo contenedores Dev...${RESET}"
        $COMPOSE_BIN down "$@"
        ;;
    restart)
        echo -e "${CYAN}🔄 Reiniciando contenedores Dev...${RESET}"
        $COMPOSE_BIN restart "$@"
        ;;
    status|status-dev)
        $COMPOSE_BIN ps "$@"
        ;;
    logs)
        if [ $# -eq 0 ]; then
            $COMPOSE_BIN logs -f --tail=100
        else
            $COMPOSE_BIN logs "$@"
        fi
        ;;
    manage|manage-dev)
        run_django_cmd_dev "$@"
        ;;
    makemigrations|makemigrations-dev)
        run_django_cmd_dev makemigrations "$@"
        ;;
    migrate|migrate-dev)
        run_django_cmd_dev migrate "$@"
        ;;
    createsuperuser|createsuperuser-dev)
        run_django_cmd_dev createsuperuser "$@"
        ;;
    shell|shell-dev)
        run_django_cmd_dev shell "$@"
        ;;
    test|test-dev)
        run_django_cmd_dev test apps.blog apps.newsletter apps.accounts "$@"
        ;;
    pycheck|pycheck-dev)
        echo -e "${CYAN}🔍 Verificando sintaxis Python en Backend...${RESET}"
        run_django_cmd_dev check "$@"
        ;;
    typecheck|typecheck-dev)
        echo -e "${CYAN}🔍 Verificando tipos TypeScript en Frontend...${RESET}"
        run_npm_cmd_dev run type-check 2>/dev/null || run_npm_cmd_dev run build
        ;;
    seed|seed-dev)
        echo -e "${CYAN}🌱 Cargando datos de prueba (Seed Data FPH)...${RESET}"
        run_django_cmd_dev loaddata seed_data.json 2>/dev/null || echo -e "${YELLOW}No se encontró archivo seed_data.json.${RESET}"
        ;;

    # ── ENTORNO STAGING ──
    up-staging)
        echo -e "${YELLOW}🧪 Iniciando entorno Staging FPH-Hub...${RESET}"
        ensure_network
        $COMPOSE_BIN -f docker-compose.staging.yml up -d "$@"
        ;;
    deploy-staging)
        echo -e "${YELLOW}🧪 Desplegando entorno Staging FPH-Hub...${RESET}"
        ensure_network
        $COMPOSE_BIN -f docker-compose.staging.yml up -d --build "$@"
        ;;
    down-staging)
        echo -e "${YELLOW}🛑 Deteniendo entorno Staging...${RESET}"
        $COMPOSE_BIN -f docker-compose.staging.yml down "$@"
        ;;
    restart-staging)
        echo -e "${CYAN}🔄 Reiniciando contenedores Staging...${RESET}"
        $COMPOSE_BIN -f docker-compose.staging.yml restart "$@"
        ;;
    status-staging)
        $COMPOSE_BIN -f docker-compose.staging.yml ps "$@"
        ;;
    logs-staging)
        if [ $# -eq 0 ]; then
            $COMPOSE_BIN -f docker-compose.staging.yml logs -f --tail=100
        else
            $COMPOSE_BIN -f docker-compose.staging.yml logs "$@"
        fi
        ;;
    manage-staging)
        run_django_cmd_staging "$@"
        ;;
    migrate-staging)
        run_django_cmd_staging migrate "$@"
        ;;
    createsuperuser-staging)
        run_django_cmd_staging createsuperuser "$@"
        ;;
    shell-staging)
        run_django_cmd_staging shell "$@"
        ;;
    test-staging)
        run_django_cmd_staging test apps.blog apps.newsletter apps.accounts "$@"
        ;;

    # ── ENTORNO PRODUCCIÓN (PROD) ──
    up-prod)
        echo -e "${MAGENTA}🔥 Iniciando entorno Producción FPH-Hub...${RESET}"
        ensure_network
        $COMPOSE_BIN -f docker-compose.prod.yml up -d "$@"
        ;;
    deploy-prod)
        echo -e "${MAGENTA}🔥 Desplegando entorno Producción FPH-Hub...${RESET}"
        ensure_network
        $COMPOSE_BIN -f docker-compose.prod.yml up -d --build "$@"
        ;;
    down-prod)
        echo -e "${YELLOW}🛑 Deteniendo entorno Producción...${RESET}"
        $COMPOSE_BIN -f docker-compose.prod.yml down "$@"
        ;;
    restart-prod)
        echo -e "${CYAN}🔄 Reiniciando contenedores Producción...${RESET}"
        $COMPOSE_BIN -f docker-compose.prod.yml restart "$@"
        ;;
    status-prod)
        $COMPOSE_BIN -f docker-compose.prod.yml ps "$@"
        ;;
    logs-prod)
        if [ $# -eq 0 ]; then
            $COMPOSE_BIN -f docker-compose.prod.yml logs -f --tail=100
        else
            $COMPOSE_BIN -f docker-compose.prod.yml logs "$@"
        fi
        ;;
    build-prod)
        echo -e "${MAGENTA}🏗️ Construyendo imágenes de producción...${RESET}"
        $COMPOSE_BIN -f docker-compose.prod.yml build "$@"
        ;;
    manage-prod)
        run_django_cmd_prod "$@"
        ;;
    migrate-prod)
        run_django_cmd_prod migrate "$@"
        ;;
    createsuperuser-prod)
        run_django_cmd_prod createsuperuser "$@"
        ;;
    shell-prod)
        run_django_cmd_prod shell "$@"
        ;;
    collectstatic-prod)
        echo -e "${MAGENTA}🎨 Recopilando archivos estáticos de producción...${RESET}"
        run_django_cmd_prod collectstatic --noinput "$@"
        ;;

    # ── UTILIDADES ──
    clean)
        echo -e "${YELLOW}🧹 Limpiando recursos huérfanos de Docker...${RESET}"
        if [ "$1" = "--all" ] || [ "$1" = "-a" ]; then
            $DOCKER_BIN system prune -a --volumes -f
        else
            $DOCKER_BIN system prune -f
            $DOCKER_BIN volume prune -f
        fi
        echo -e "${GREEN}✅ Limpieza completada.${RESET}"
        ;;

    help|--help|-h|"")
        show_help
        ;;

    *)
        echo -e "${RED}Comando desconocido: '$COMMAND'${RESET}"
        show_help
        exit 1
        ;;
esac
