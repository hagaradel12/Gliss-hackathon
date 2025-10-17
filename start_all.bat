@echo off
echo Starting Hair Advisor - Full Stack Application
echo.
echo Starting Backend Server...
start "Hair Advisor Backend" cmd /k "cd backend && python main.py"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start "Hair Advisor Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting up...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
