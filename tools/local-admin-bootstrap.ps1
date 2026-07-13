$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Functions = Join-Path $Root "functions"
$Marker = Join-Path $Root ".novura-admin-bootstrap-completed.json"

Write-Host "" 
Write-Host "NOVURA - LOKALER ADMIN-BOOTSTRAP" -ForegroundColor Cyan
Write-Host "Kein Blaze-Tarif und kein Cloud-Functions-Deployment erforderlich." -ForegroundColor Gray
Write-Host ""

if (Test-Path $Marker) {
  Write-Host "Dieser Projektordner wurde bereits als abgeschlossen markiert." -ForegroundColor Yellow
  Write-Host "Der Firestore-Lock entscheidet zusätzlich serverseitig, ob ein weiterer Bootstrap erlaubt ist." -ForegroundColor Gray
  $continue = Read-Host "Trotzdem denselben Admin reparieren/erneut bestätigen? (j/N)"
  if ($continue -notmatch '^(j|ja|y|yes)$') { exit 0 }
}

$candidates = @(
  Get-ChildItem -Path $Root -File -Filter "*firebase-adminsdk*.json" -ErrorAction SilentlyContinue
  Get-ChildItem -Path $Root -File -Filter "service-account*.json" -ErrorAction SilentlyContinue
)
$keyPath = if ($candidates.Count -eq 1) { $candidates[0].FullName } else { Read-Host "Vollständiger Pfad zur Firebase-Service-Account-JSON" }
$keyPath = $keyPath.Trim('"')
if (-not (Test-Path $keyPath)) { throw "Service-Account-Datei nicht gefunden: $keyPath" }

$email = Read-Host "Admin-E-Mail"
$nickname = Read-Host "Nickname"
$secure = Read-Host "Passwort (wird für das Admin-Konto gesetzt)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try { $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
$courseId = Read-Host "Kurs-ID [course_2026_gk]"
if ([string]::IsNullOrWhiteSpace($courseId)) { $courseId = "course_2026_gk" }

if (-not (Test-Path (Join-Path $Functions "node_modules\firebase-admin"))) {
  Write-Host "Firebase Admin SDK wird einmalig installiert..." -ForegroundColor Cyan
  Push-Location $Functions
  try {
    & npm.cmd config set registry https://registry.npmjs.org/
    & npm.cmd install --omit=dev --registry=https://registry.npmjs.org/
    if ($LASTEXITCODE -ne 0) { throw "npm install ist fehlgeschlagen." }
  } finally { Pop-Location }
}

$env:NOVURA_SERVICE_ACCOUNT_PATH = (Resolve-Path $keyPath).Path
$env:NOVURA_ADMIN_EMAIL = $email
$env:NOVURA_ADMIN_NICKNAME = $nickname
$env:NOVURA_ADMIN_PASSWORD = $password
$env:NOVURA_COURSE_ID = $courseId
$env:NOVURA_EXPECTED_PROJECT_ID = "bbq-userdatabase"

try {
  & node (Join-Path $Root "tools\bootstrap-admin.mjs")
  if ($LASTEXITCODE -ne 0) { throw "Der lokale Bootstrap wurde nicht abgeschlossen." }
  $markerData = @{ completedAt=(Get-Date).ToString("o"); email=$email; courseId=$courseId; projectId="bbq-userdatabase" } | ConvertTo-Json
  Set-Content -Path $Marker -Value $markerData -Encoding UTF8
  Write-Host "" 
  Write-Host "FERTIG. Jetzt in Novura normal einloggen." -ForegroundColor Green
  Write-Host "Den privaten Service-Account-Schlüssel solltest du jetzt sicher löschen oder widerrufen." -ForegroundColor Yellow
} finally {
  Remove-Item Env:NOVURA_SERVICE_ACCOUNT_PATH -ErrorAction SilentlyContinue
  Remove-Item Env:NOVURA_ADMIN_EMAIL -ErrorAction SilentlyContinue
  Remove-Item Env:NOVURA_ADMIN_NICKNAME -ErrorAction SilentlyContinue
  Remove-Item Env:NOVURA_ADMIN_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:NOVURA_COURSE_ID -ErrorAction SilentlyContinue
  Remove-Item Env:NOVURA_EXPECTED_PROJECT_ID -ErrorAction SilentlyContinue
  $password = $null
}
