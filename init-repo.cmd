@echo off
cd /d "%~dp0"

where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed or not on PATH.
  echo Install from https://git-scm.com/download/win then run this script again.
  exit /b 1
)

git init
if errorlevel 1 exit /b 1

git add -A
if errorlevel 1 exit /b 1

git commit -m "Task Management Dashboard: React, TypeScript, Tailwind, Vite"
if errorlevel 1 exit /b 1

git branch -M main
if errorlevel 1 exit /b 1

git remote remove origin 2>nul
git remote add origin https://github.com/raysgithub17/Task-Management-Dashboard.git
if errorlevel 1 exit /b 1

echo.
echo Done: repo initialized and remote added.
echo If the GitHub repo already has commits, run:
echo   git pull origin main --allow-unrelated-histories
echo Then fix any merge conflicts and:
echo   git push -u origin main
echo.
pause
