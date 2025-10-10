@echo off
echo Starting Eco Circle Application (Frontend and Backend)...

echo.
echo Make sure you have installed all dependencies with:
echo install_deps.bat
echo.

echo Starting Backend Server in background...
start "Backend Server" /min cmd /c "python app.py"

echo.
echo Starting Frontend Server...
npm run dev

echo.
echo To stop the application, close both terminal windows.
pause