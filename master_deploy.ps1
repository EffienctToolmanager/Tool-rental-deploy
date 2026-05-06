# GEV Tool Rental System Master Deployment Script (Robust Version)
# Created by Antigravity - Encoding & Path Safe + Auto Zipping

$ErrorActionPreference = "Stop"

# 현재 스크립트가 실행되는 '위키 에이전트' 폴더를 자동으로 잡습니다.
$root = $PSScriptRoot
$appPath = Join-Path $root "Tool_Rental_App\teams-app"
$deployPath = Join-Path $root "deploy_tmp"
$zipPath = Join-Path $root "GEV_Tool_App_V102.zip"

Write-Host "`n>>> 🚀 [1/5] React 프로젝트 빌드 시작 (Vite)..." -ForegroundColor Cyan
if (!(Test-Path $appPath)) {
    Write-Error "Path not found: $appPath"
}
Set-Location $appPath
npm run build

Write-Host "`n>>> 📦 [2/5] 빌드 파일을 배포 폴더(deploy_tmp)로 복사 중..." -ForegroundColor Cyan
if (!(Test-Path "$appPath\dist")) {
    Write-Error "Build failed: dist folder not found."
}
xcopy /E /Y "$appPath\dist\*" "$deployPath\"

Write-Host "`n>>> 📄 [3/5] 매니페스트 및 리소스 동기화..." -ForegroundColor Cyan
xcopy /Y "$appPath\App_Package\manifest.json" "$deployPath\"
xcopy /Y "$appPath\App_Package\*.png" "$deployPath\"

Write-Host "`n>>> 🤐 [4/5] Teams 앱 패키지(ZIP) 생성 중..." -ForegroundColor Cyan
if (Test-Path $zipPath) { 
    Remove-Item $zipPath -Force
}
# PowerShell 기본 명령어로 App_Package 내 파일들을 압축
Compress-Archive -Path "$appPath\App_Package\*" -DestinationPath $zipPath

Write-Host "`n>>> ☁️ [5/5] GitHub 저장소 업데이트 (deploy_tmp)..." -ForegroundColor Cyan
Set-Location $deployPath
git add .
try {
    git commit -m "Auto-Deploy: GEV Tool App V1.0.2 (Robust Script + ZIP)"
} catch {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}
git push origin main

Write-Host "`n✅ 모든 배포 및 패키징 작업이 성공적으로 완료되었습니다!" -ForegroundColor Green
Write-Host "생성된 패키지: $zipPath" -ForegroundColor Magenta
Set-Location $root
