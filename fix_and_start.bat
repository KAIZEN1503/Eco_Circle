@echo off
echo ============================================
echo   Quick Fix: Reinstalling NumPy
echo ============================================
echo.

REM Uninstall numpy completely
echo Step 1: Removing old numpy...
wasteenv\Scripts\pip uninstall -y numpy
if errorlevel 1 (
    echo Failed to uninstall numpy
    pause
    exit /b 1
)

REM Install numpy 1.x version for compatibility
echo Step 2: Installing compatible numpy...
wasteenv\Scripts\pip install "numpy<2" --force-reinstall --no-cache-dir
if errorlevel 1 (
    echo Failed to install numpy
    pause
    exit /b 1
)

echo.
echo ============================================
echo   NumPy fixed! Now starting server...
echo ============================================
echo.

REM Start the server
wasteenv\Scripts\python.exe app.py

pause
