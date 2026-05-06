# GEV Tool Rental System Master Deployment Script (Robust Version)
# Created by Antigravity - Encoding & Path Safe

$ErrorActionPreference = "Stop"

# 현재 스크립트가 실행되는 '위키 에이전트' 폴더를 자동으로 잡습니다.
$root = $PSScriptRoot
$appPath = Join-Path $root "Tool_Rental_App\teams-app"
$deployPath = Join-Path $root "deploy_tmp"

Write-Host "`n>>> 🚀 [1/4] React 프로젝트 빌드 시작 (Vite)..." -ForegroundColor Cyan
if (!(Test-Path $appPath)) {
    Write-Error "Path not found: $appPath"
}
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
    git commit -m "Auto-Deploy: GEV Tool App V1.0.2 (Robust Script)"
} catch {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}
git push origin main

Write-Host "`n✅ 모든 배포 작업이 성공적으로 완료되었습니다!" -ForegroundColor Green
Set-Location $root
