@echo off
echo Starting PolarConnect...
start "PolarConnect API" cmd /k "cd /d %~dp0apps\api && npm run dev"
timeout /t 4 /nobreak >nul
start "PolarConnect Web" cmd /k "cd /d %~dp0apps\web && npm run dev"
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo Both servers started. Open http://localhost:3000
