@echo off
REM Go to script folder and point TARGET to local index file.
cd /d "%~dp0"
set "TARGET=%~dp0index.html"

REM Try known Edge install paths first.
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
	start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%TARGET%"
	exit /b 0
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
	start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%TARGET%"
	exit /b 0
)

REM Try Edge from PATH.
start "" msedge "%TARGET%" >nul 2>&1
if not errorlevel 1 exit /b 0

REM Fallback: open with default Windows browser handler.
rundll32 url.dll,FileProtocolHandler "%TARGET%" >nul 2>&1
if not errorlevel 1 exit /b 0

REM Final fallback using PowerShell process start.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%TARGET%'"
if not errorlevel 1 exit /b 0

REM If all methods fail, show manual instruction.
echo Could not open browser automatically.
echo Please open this file manually:
echo %TARGET%
pause
