build-backend:
	docker-compose --env-file Backend/MiChatAPI/.env -f Backend/MiChatAPI/docker/docker-compose.yml --project-directory Backend/MiChatAPI up --build -d