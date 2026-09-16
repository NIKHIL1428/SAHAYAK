@echo off
echo ============================================
echo  Starting Cybercrime Pipeline Frontend
echo ============================================
cd /d "%~dp0Frontend"

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
)

echo Starting Vite dev server on http://localhost:5173 ...
echo Make sure the backend is also running on port 8000!
echo.
npm run dev
pause
