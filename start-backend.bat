@echo off
echo ============================================
echo  Starting Cybercrime Pipeline Backend
echo ============================================
cd /d "%~dp0pipeline"

:: Check if virtual environment exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo No virtual environment found. Using system Python.
    echo TIP: Create one with: python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
)

echo Starting FastAPI server on http://localhost:8000 ...
echo API Docs available at: http://localhost:8000/docs
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
