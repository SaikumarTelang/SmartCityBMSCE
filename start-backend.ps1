$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

# Free port 5000 if a previous backend is still running
$onPort = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($onPort) {
  $pids = $onPort.OwningProcess | Sort-Object -Unique
  foreach ($procId in $pids) {
    Write-Host "Stopping old process on port 5000 (PID $procId)..." -ForegroundColor Yellow
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 1
}

$npm = "C:\Program Files\nodejs\npm.cmd"
if (-not (Test-Path $npm)) { $npm = "npm" }

Set-Location "$PSScriptRoot\server"
Write-Host "Starting backend + AI on http://localhost:5000" -ForegroundColor Cyan
& $npm run dev
