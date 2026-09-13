$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:RK_ROOT = $root
$env:PORT = if ($env:PORT) { $env:PORT } else { "4173" }

Write-Host "ReKnow Prism preview: http://127.0.0.1:$env:PORT"
Get-Content -LiteralPath (Join-Path $root "server.js") -Raw -Encoding UTF8 | node -
