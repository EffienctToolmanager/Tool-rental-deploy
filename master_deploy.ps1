# GEV Tool Rental System Master Deployment Script
# Created by Antigravity (Integrated Commander Mode)

$ErrorActionPreference = "Stop"
$root = "c:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트"
$appPath = "$root\Tool_Rental_App\teams-app"
$deployPath = "$root\deploy_tmp"

Write-Host "`n>>> 🚀 [1/4] React 프로젝트 빌드 시작 (Vite)..." -ForegroundColor Cyan
Set-Location $appPath
npm run build

Write-Host "`n>>> 📦 [2/4] 빌드 파일을 배포 폴더(deploy_tmp)로 복사 중..." -ForegroundColor Cyan
if (!(Test-Path "$appPath\dist")) {
    Write-Error "Build failed: dist folder not found."
}
xcopy /E /Y "$appPath\dist\*" "$deployPath\"

Write-Host "`n>>> 📄 [3/4] 매니페스트 및 리소스 동기화..." -ForegroundColor Cyan
xcopy /Y "$appPath\App_Package\manifest.json" "$deployPath\"
xcopy /Y "$appPath\App_Package\*.png" "$deployPath\"

Write-Host "`n>>> ☁️ [4/4] GitHub 저장소 업데이트 (deploy_tmp)..." -ForegroundColor Cyan
Set-Location $deployPath
git add .
try {
    git commit -m "Auto-Deploy: GEV Tool App V1.0.2 (Master Script)"
} catch {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}
git push origin main

Write-Host "`n✅ 모든 배포 작업이 성공적으로 완료되었습니다!" -ForegroundColor Green
Set-Location $root
