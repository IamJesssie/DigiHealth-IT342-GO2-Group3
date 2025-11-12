@echo off
echo Starting DigiHealth Frontend...
echo.
cd /d "%~dp0"
set NODE_OPTIONS=--openssl-legacy-provider
node node_modules/react-scripts/scripts/start.js %*