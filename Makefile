build-backend:
	docker-compose --env-file Backend/.env -f Backend/docker/docker-compose.yml --project-directory Backend up --build -d

build-frontend:
	docker-compose -f Frontend/docker/docker-compose.frontend.yml --project-directory Frontend up --build -d