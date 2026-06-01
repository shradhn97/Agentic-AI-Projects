@echo off
REM ──────────────────────────────────────────────────────────────
REM  AI Project Manager Assistant — Windows Run Script
REM ──────────────────────────────────────────────────────────────

echo [1/4] Checking Python version...
python --version
IF ERRORLEVEL 1 (
    echo ERROR: Python is not installed or not in PATH.
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
IF NOT EXIST "venv\Scripts\activate.bat" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
)
call venv\Scripts\activate.bat

echo [3/4] Installing dependencies...
pip install -r requirements.txt --quiet

echo [4/4] Starting FastAPI server...
echo.
echo  Swagger UI  : http://localhost:8000/docs
echo  ReDoc       : http://localhost:8000/redoc
echo  Health Check: http://localhost:8000/
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
