# SmartCity — one-time setup (run from project root)
$ErrorActionPreference = "Stop"

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "=== Installing Node dependencies ===" -ForegroundColor Cyan
Set-Location $PSScriptRoot
npm install --prefix server
npm install --prefix client

Write-Host "=== Installing Python AI dependencies ===" -ForegroundColor Cyan
py -m pip install -r aiModel/requirements.txt

Write-Host ""
Write-Host "=== Firebase setup (required) ===" -ForegroundColor Yellow
Write-Host "1. Copy server/config/serviceAccountKey.json.example -> serviceAccountKey.json"
Write-Host "2. Paste your Firebase Admin SDK JSON from Firebase Console"
Write-Host "3. Copy client/.env.example -> client/.env and fill VITE_FIREBASE_* values"
Write-Host ""
Write-Host "Setup complete. Run: .\start-all.ps1" -ForegroundColor Green
