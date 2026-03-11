# Stoffwechselkur Vault - Auto Sync Script
# Fuehrt automatisch git add, commit und push durch

$vaultPath = "C:\Users\ff\Documents\KI Vault\Stoffwechselrezepte"
$logFile = "$vaultPath\.sync-log.txt"

function Write-Log {
    param($message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Add-Content -Path $logFile
}

Set-Location $vaultPath

# Pruefen ob Aenderungen vorhanden
$status = git status --porcelain
if ($status) {
    Write-Log "Aenderungen gefunden, starte Sync..."
    git add -A
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "vault sync: $date"
    git push origin main
    Write-Log "Sync erfolgreich."
} else {
    Write-Log "Keine Aenderungen, nichts zu tun."
}
