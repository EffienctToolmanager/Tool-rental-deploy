# Set Encoding to UTF8 for stability
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# --- Paths Configuration ---
$currentDir = $PSScriptRoot
$boxPath = "$currentDir\Tool_Rental_App\teams-app\public"
$dbPath = "$currentDir\deploy_tmp\Tool management_ Teams_(TEST).xlsx"

function Export-ToJson {
    Write-Host "`n[V4.9] Extracting Master Inventory (Excel Text Format)..." -ForegroundColor Cyan
    try {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $excel.DisplayAlerts = $false
        
        $workbook = $excel.Workbooks.Open($dbPath, [Type]::Missing, $true)
        $sheet = $workbook.Worksheets.Item("DASHBOARD")
        
        # 1. Get Actual Headers from Row 1
        $headerList = @()
        for ($col = 1; $col -le 9; $col++) {
            $h = [string]$sheet.Cells.Item(1, $col).Value2
            if ($h) { $headerList += $h.Trim() } else { $headerList += "Column$col" }
        }

        # 2. Extract Data (Using .Text to preserve Date/Format)
        $data = @()
        $lastRow = $sheet.UsedRange.Rows.Count
        
        for ($i = 2; $i -le $lastRow; $i++) {
            # Skip only if the entire row is likely empty (optional, but let's keep it safe)
            # Removed the strict ID check to preserve all rows
            
            $currentLoc = [string]$sheet.Cells.Item($i, 3).Value2
            $status = if ([string]::IsNullOrWhiteSpace($currentLoc)) { "Available" } else { "In Use" }
            
            $rowObj = [ordered]@{}
            $rowObj["Status"] = $status
            $rowObj["Location"] = if ($status -eq "Available") { "Warehouse" } else { $currentLoc.Trim() }
            
            for ($idx = 0; $idx -lt $headerList.Count; $idx++) {
                $val = [string]$sheet.Cells.Item($i, $idx + 1).Text
                $rowObj[$headerList[$idx]] = if ($val) { $val.Trim() } else { "-" }
            }
            
            $data += [PSCustomObject]$rowObj
        }

        $data | ConvertTo-Json -Depth 5 | Out-File "$boxPath\data.json" -Encoding utf8
        Write-Host "Success: $($data.Count) tools synced (Date format preserved)." -ForegroundColor Green
        
        $workbook.Close($false)
        $excel.Quit()
    } catch {
        Write-Host "Sync Error: $_" -ForegroundColor Red
        if ($excel) { $excel.Quit() }
    }
}

function Show-Menu {
    Clear-Host
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "   GEV Tool List Management Console (V4.9) " -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "1. Manual Sync (Preserve Excel Format)"
    Write-Host "2. Auto-Sync Mode"
    Write-Host "3. Open Master Excel File"
    Write-Host "4. Exit"
    Write-Host "------------------------------------------"
}

Export-ToJson
while ($true) {
    Show-Menu
    $choice = Read-Host "Select Option"
    switch ($choice) {
        "1" { Export-ToJson; Read-Host "`nPress Enter to continue..." }
        "2" { while ($true) { Export-ToJson; Start-Sleep -Seconds 300 } }
        "3" { Invoke-Item $dbPath }
        "4" { break }
    }
}
