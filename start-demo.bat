@echo off
title Gym Demo App Server
echo ====================================================
echo Starting Gym Demo Management CRM...
echo ====================================================

:: Check if PostgreSQL service is running
sc query postgresql-x64-18 | find "RUNNING" >nul
if errorlevel 1 (
    echo Starting PostgreSQL 18 service...
    net start postgresql-x64-18
) else (
    echo PostgreSQL 18 service is running.
)

echo.
echo Starting Next.js Web Server...
echo Local Access:   http://localhost:3000
echo Network (LAN):  http://10.83.208.205:3000
echo Admin PIN:      0987
echo ====================================================
echo.

npm run dev
pause
