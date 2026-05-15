$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

$npm = "C:\Program Files\nodejs\npm.cmd"
if (-not (Test-Path $npm)) { $npm = "npm" }

Set-Location "$PSScriptRoot\client"
Write-Host "Starting frontend on http://localhost:3000" -ForegroundColor Cyan
& $npm run dev
