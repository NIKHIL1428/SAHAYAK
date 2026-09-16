@echo off
echo ============================================
echo  Starting Full Stack Application
echo ============================================
echo.
echo This will open two terminal windows:
echo   1. Backend  - http://localhost:8000
echo   2. Frontend - http://localhost:5173
echo.
echo Press any key to start both servers...
pause >nul

:: Start backend in a new window
start "Cybercrime Backend" cmd /k "cd /d "%~dp0pipeline" && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else (echo Using system Python)) && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
start "Cybercrime Frontend" cmd /k "cd /d "%~dp0Frontend" && (if not exist node_modules (npm install)) && npm run dev"

echo.
echo Both servers are starting...
echo Backend:  http://localhost:8000  (API docs: http://localhost:8000/docs)
echo Frontend: http://localhost:5173
echo.
pause
