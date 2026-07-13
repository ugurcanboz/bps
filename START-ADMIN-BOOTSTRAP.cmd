@echo off
setlocal
cd /d "%~dp0"
PowerShell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\local-admin-bootstrap.ps1"
echo.
echo Fenster mit einer Taste schliessen.
pause >nul
