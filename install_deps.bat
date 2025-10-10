@echo off
echo Installing Eco Circle dependencies...

echo.
echo Installing frontend dependencies...
npm install

echo.
echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo All dependencies installed successfully!
pause