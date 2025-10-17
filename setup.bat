@echo off
echo Setting up Hair Advisor Development Environment...
echo.

echo Installing Backend Dependencies...
pip install -r requirements.txt
echo.

echo Installing Frontend Dependencies...
cd frontend
npm install
cd ..
echo.

echo Setting up Environment File...
if not exist backend\.env (
    copy env.example backend\.env
    echo Please edit backend\.env and add your OpenAI API key
) else (
    echo Environment file already exists
)
echo.

echo Setup Complete!
echo.
echo Next steps:
echo 1. Edit backend\.env and add your OpenAI API key
echo 2. Run start_all.bat to start both servers
echo.
pause
