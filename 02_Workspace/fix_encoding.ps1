$path = "c:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트\master_deploy.ps1"
$content = Get-Content $path -Raw
$content | Out-File $path -Encoding UTF8
Write-Host "Encoding conversion to UTF8-BOM complete."
