@echo off
title Gym Demo Database Backup
echo ====================================================
echo Backing up Gym Demo Database (gym_demo_db)...
echo ====================================================

set PGPASSWORD=GymDemoSecure2026!
set PG_BIN=C:\Program Files\PostgreSQL\18\bin
set BACKUP_DIR=%~dp0backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=*" %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set TIMESTAMP=%%I
set BACKUP_FILE=%BACKUP_DIR%\gym_demo_db_backup_%TIMESTAMP%.sql

echo Running pg_dump to %BACKUP_FILE% ...
"%PG_BIN%\pg_dump.exe" -U gym_demo_user -h 127.0.0.1 -p 5432 -d gym_demo_db -F p -f "%BACKUP_FILE%"

if errorlevel 0 (
    echo.
    echo [SUCCESS] Backup created successfully at:
    echo %BACKUP_FILE%
) else (
    echo.
    echo [ERROR] Backup failed. Please verify PostgreSQL is running.
)

echo ====================================================
pause
