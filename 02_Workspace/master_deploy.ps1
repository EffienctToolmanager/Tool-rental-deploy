# GEV Tool Rental Deployment Script v1.0.2
# Created by Antigravity - UTF8 Encoding Fixed

# 파워쉘 한글 깨짐 방지를 위한 콘솔 인코딩 강제 설정
chcp 65001
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Stop"

# 현재 스크립트가 실행되는 '위키 에이전트' 폴더를 자동으로 잡습니다.
$root = $PSScriptRoot
$appPath = Join-Path $root "Tool_Rental_App\teams-app"
$deployPath = Join-Path $root "deploy_tmp"
$zipPath = Join-Path $root "GEV_Tool_App_V1.0.2.zip"

Write-Host "`n>>> 🚀 [1/5] React 프로젝트 빌드 시작 (Vite)..." -ForegroundColor Cyan
if (!(Test-Path $appPath)) {
    Write-Error "경로를 찾을 수 없습니다: $appPath"
}
Set-Location $appPath
npm run build

Write-Host "`n>>> 📦 [2/5] 빌드 파일을 배포 폴더(deploy_tmp)로 복사 중..." -ForegroundColor Cyan
if (!(Test-Path "$appPath\dist")) {
    Write-Error "빌드 실패: dist 폴더가 없습니다."
}
xcopy /E /Y "$appPath\dist\*" "$deployPath\"

Write-Host "`n>>> 📄 [3/5] 매니페스트 및 리소스 동기화..." -ForegroundColor Cyan
xcopy /Y "$appPath\App_Package\manifest.json" "$deployPath\"
xcopy /Y "$appPath\App_Package\*.png" "$deployPath\"

Write-Host "`n>>> 🤐 [4/5] Teams 앱 패키지(ZIP) 생성 및 동기화 중..." -ForegroundColor Cyan
if (Test-Path $zipPath) { 
    Remove-Item $zipPath -Force
}
Compress-Archive -Path "$appPath\App_Package\*" -DestinationPath $zipPath
# 배포 폴더로도 복사하여 GitHub에 업로드되게 합니다. (기존 파일 삭제 후 복사하여 대소문자 이슈 방지)
$targetZip = Join-Path $deployPath "GEV_Tool_App_V1.0.2.zip"
if (Test-Path $targetZip) { Remove-Item $targetZip -Force }
Copy-Item $zipPath -Destination $targetZip

Write-Host "`n>>> ☁️ [5/5] GitHub 저장소 업데이트 (deploy_tmp)..." -ForegroundColor Cyan
Set-Location $deployPath
# ZIP 파일을 명시적으로 추가하여 누락을 방지합니다.
git add "GEV_Tool_App_V1.0.2.zip"
git add .
try {
    git commit -m "Auto-Deploy: GEV Tool App V1.0.2 (Fix: ZIP Included)"
} catch {
    Write-Host "커밋할 변경 사항이 없습니다." -ForegroundColor Yellow
}
git push origin main

Write-Host "`n✅ 모든 배포 및 패키징 작업이 성공적으로 완료되었습니다!" -ForegroundColor Green
Write-Host "생성된 패키지 경로: $zipPath" -ForegroundColor Magenta
Set-Location $root
