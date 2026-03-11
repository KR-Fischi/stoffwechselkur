# Einmalig ausfuehren: Richtet automatischen Vault-Sync alle 15 Minuten ein

$vaultPath = "C:\Users\ff\Documents\KI Vault\Stoffwechselrezepte"
$syncScript = "$vaultPath\sync.ps1"
$taskName = "StoffwechselkurVaultSync"

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$syncScript`""

$trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 15) -Once -At (Get-Date)

$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 5)

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Force

Write-Host "✅ Auto-Sync eingerichtet! Der Vault wird alle 15 Minuten mit GitHub synchronisiert." -ForegroundColor Green
