# bootstrap.ps1 - CRM Project Launcher (Vault Pattern)

# 1. Fetch Google Credentials from Infisical
Write-Host "🔐 Fetching secrets from Vault..." -ForegroundColor Cyan
$googleCreds = & ..\agentic-fleet-hub\vault\agent-fetch.ps1 -SecretName "CRM_GOOGLE_CREDENTIALS" -Environment "dev"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start: Could not retrieve secrets."
    exit 1
}

# 2. Inject into environment
$env:GOOGLE_CREDENTIALS_JSON = $googleCreds
Write-Host "✅ Secrets injected into environment." -ForegroundColor Green

# 3. Start the application
Write-Host "🚀 Starting CRM Backend..." -ForegroundColor Yellow
uvicorn app.main:app --reload --port 8000
