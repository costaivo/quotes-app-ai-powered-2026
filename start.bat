@echo off
REM Start Docker Compose (detached)
docker compose up -d --build
if %ERRORLEVEL% NEQ 0 (
  echo Docker compose failed. Press any key to exit.
  pause >nul
)