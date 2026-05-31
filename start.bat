@echo off
echo =======================================================
echo Sessionly - Single Command Startup
echo =======================================================

IF NOT EXIST .env (
    echo [INFO] .env file not found. Copying from .env.example...
    copy .env.example .env
) ELSE (
    echo [INFO] .env file already exists. Skipping copy.
)

echo [INFO] Starting the Docker containers...
docker compose up --build -d

echo =======================================================
echo [SUCCESS] The application stack is now starting up in the background!
echo You can access the application at: http://localhost/
echo =======================================================
pause
