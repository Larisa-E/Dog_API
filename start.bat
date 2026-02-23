@echo off
cd /d "%~dp0"
set "TARGET=%~dp0index.html"

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
	start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%TARGET%"
	exit /b 0
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
	start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%TARGET%"
	exit /b 0
)

start "" msedge "%TARGET%" >nul 2>&1
if not errorlevel 1 exit /b 0

rundll32 url.dll,FileProtocolHandler "%TARGET%" >nul 2>&1
if not errorlevel 1 exit /b 0

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%TARGET%'"
if not errorlevel 1 exit /b 0

echo Could not open browser automatically.
echo Please open this file manually:
echo %TARGET%
pause
