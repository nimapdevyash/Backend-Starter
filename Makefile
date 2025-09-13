.PHONY: up down build pull restart  log

COMMAND=docker-compose
COMPOSE_FILE= -f docker-compose.yml -f docker/dev.yml 
PROJECT_NAME= -p greenland-backend-dev 
up:
	${COMMAND} ${COMPOSE_FILE} ${PROJECT_NAME} up -d

down:
	 ${COMMAND} ${COMPOSE_FILE} ${PROJECT_NAME} down

build:
	  ${COMMAND} ${COMPOSE_FILE} ${PROJECT_NAME} build

pull:
	git pull 

restart:
	$(MAKE) down
	$(MAKE) up 

log:
	${COMMAND} ${COMPOSE_FILE} ${PROJECT_NAME} logs -ft


