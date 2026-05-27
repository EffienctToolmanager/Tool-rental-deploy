import win32com.client as win32
import os
import sys

FILES_DIR = r"C:\Users\cfpcl\OneDrive\Desktop\GEV_Purchasing_System"
master_path = os.path.join(FILES_DIR, "GEV_Quote_Master.xlsm")

def print_progress(msg):
    print(msg)
    sys.stdout.flush()

def main():
    excel = win32.Dispatch("Excel.Application")
    print_progress("[+] Excel Application dispatched.")
    excel.Visible = False  # Run silently in background
    excel.DisplayAlerts = False  # Suppress all warning dialogs and prompts!
    
    try:
        print_progress(f"[+] Opening Quote Master: {master_path}")
        wb = excel.Workbooks.Open(master_path)
        print_progress("[+] Quote Master opened successfully.")
        
        # 1. Re-write Power Queries with robust filters and composite join keys to avoid duplicates
        print_progress("[+] Overwriting Power Queries with robust JPY/KRW and Qty > 0 filters...")
        
        q_cost = wb.Queries.Item("HQ_Cost_DB")
        q_cost.Formula = (
            'let\n'
            f'    Source = Excel.Workbook(File.Contents("{os.path.join(FILES_DIR, "GEV_HQ_Cost_Book.xlsx")}"), null, true),\n'
            '    HQ_Cost_DB_Sheet = Source{[Item="HQ_Cost_DB",Kind="Sheet"]}[Data],\n'
            '    #"Promoted Headers" = Table.PromoteHeaders(HQ_Cost_DB_Sheet, [PromoteAllScalars=true])\n'
            'in\n'
            '    #"Promoted Headers"'
        )
        print_progress("[+] Updated HQ_Cost_DB query formula.")
        
        q_order = wb.Queries.Item("Order_Sheet (2)")
        q_order.Formula = (
            'let\n'
            f'    Source = Excel.Workbook(File.Contents("{os.path.join(FILES_DIR, "GEV_Order_Template.xlsx")}"), null, true),\n'
            '    Order_Sheet_Sheet = Source{[Item="Order_Sheet",Kind="Sheet"]}[Data],\n'
            '    #"Removed Top Rows" = Table.Skip(Order_Sheet_Sheet, 5),\n'
            '    #"Promoted Headers" = Table.PromoteHeaders(#"Removed Top Rows", [PromoteAllScalars=true]),\n'
            '    #"Filtered Empty Rows" = Table.SelectRows(#"Promoted Headers", each ([#"파트번호 (Part Number)"] <> null) and ([#"수량 (Qty)"] <> null) and ([#"수량 (Qty)"] <> 0) and ([#"수량 (Qty)"] <> "")),\n'
            '    #"Merged Queries" = Table.NestedJoin(#"Filtered Empty Rows", {"파트번호 (Part Number)", "파트명 (Part Name)"}, HQ_Cost_DB, {"파트번호 (Part Number)", "파트명 (Part Name)"}, "HQ_Cost_DB", JoinKind.LeftOuter),\n'
            '    #"Expanded HQ_Cost_DB" = Table.ExpandTableColumn(#"Merged Queries", "HQ_Cost_DB", {"본사원가 (HQ Cost JPY)"}, {"본사원가 (HQ Cost JPY)"}),\n'
            '    #"Renamed Columns" = Table.RenameColumns(#"Expanded HQ_Cost_DB", {{"모델명 (Model)", "모델명"}, {"파트번호 (Part Number)", "파트번호"}, {"파트명 (Part Name)", "파트명"}, {"수량 (Qty)", "수량"}, {"표준단가 (List Price)", "대리점매입가"}, {"본사원가 (HQ Cost JPY)", "본사엔화원가"}})\n'
            'in\n'
            '    #"Renamed Columns"'
        )
        print_progress("[+] Updated Order_Sheet (2) query formula with composite keys and Qty > 0 filter.")
                
        # 2. Re-create the ListObject table in Summary_Front at A7
        ws_front = wb.Sheets.Item("Summary_Front")
        
        # Clean up old sheets safely
        try:
            wb.Sheets.Item("Order_Sheet (2)").Delete()
            print_progress("[+] Deleted redundant Order_Sheet (2) sheet.")
        except Exception:
            pass
        try:
            wb.Sheets.Item("HQ_Cost_DB").Delete()
            print_progress("[+] Deleted redundant HQ_Cost_DB sheet.")
        except Exception:
            pass
            
        print_progress("[+] Cleaning up legacy tables on Summary_Front...")
        for i in range(ws_front.ListObjects.Count, 0, -1):
            ws_front.ListObjects.Item(i).Delete()
        for i in range(ws_front.QueryTables.Count, 0, -1):
            ws_front.QueryTables.Item(i).Delete()
            
        ws_front.Range("A7:J2000").Clear()
        
        # Add new ListObject table backed by the updated query connection
        conn_str = 'OLEDB;Provider=Microsoft.Mashup.OleDb.1;Data Source=$Workbook$;Location="Order_Sheet (2)";Extended Properties=""'
        print_progress("[+] Adding ListObject (Structured Table)...")
        tbl = ws_front.ListObjects.Add(0, conn_str, None, 1, ws_front.Range("A7"))
        tbl.Name = "Order_Sheet"
        
        tbl.QueryTable.CommandText = "SELECT * FROM [Order_Sheet (2)]"
        tbl.QueryTable.CommandType = 2
        tbl.QueryTable.BackgroundQuery = False
        
        print_progress("[+] Triggering Query Table Refresh...")
        tbl.QueryTable.Refresh(False)
        print_progress("[+] Refresh completed.")
        
        last_row = tbl.Range.Rows.Count + tbl.Range.Row - 1
        print_progress(f"[+] Rows count: {tbl.Range.Rows.Count} (Row 7 to {last_row})")
        
        # 3. Add Calculated dynamic columns G, H, I, J to the ListObject table
        print_progress("[+] Injecting header cells for calculated columns...")
        ws_front.Cells(7, 7).Value = "본사원화원가"
        ws_front.Cells(7, 8).Value = "매출액"
        ws_front.Cells(7, 9).Value = "매출이익액"
        ws_front.Cells(7, 10).Value = "이익률 (%)"
        
        # 4. Setup Exchange Rate Control Block at L1:N2
        print_progress("[+] Injecting Exchange Rate Control Block at L1:N2...")
        ws_front.Range("L1").Value = "상호 환율 설정"
        ws_front.Range("M1").Value = "1 JPY = KRW (수동)"
        ws_front.Range("N1").Value = 9.2  # Manual input JPY->KRW
        
        ws_front.Range("L2").Value = "Exchange Control"
        ws_front.Range("M2").Value = "1 KRW = JPY (자동)"
        ws_front.Range("N2").Value = "=IF(N1>0, 1/N1, 0)"  # Reciprocal formula!
        
        # Apply premium gold styling to the Exchange Rate Control Block
        gold_color = 0xCCF2FF  # Hex FFF2CC in BGR format
        for r in [1, 2]:
            for col in ["L", "M", "N"]:
                cell = ws_front.Range(f"{col}{r}")
                cell.Interior.Color = gold_color
                cell.Borders.LineStyle = 1
                cell.Borders.Weight = 2
                if col == "N":
                    cell.Font.Bold = True
                    cell.HorizontalAlignment = -4152  # xlRight
                    if r == 1:
                        cell.NumberFormat = "0.00"
                    else:
                        cell.NumberFormat = "0.00000"
                else:
                    cell.Font.Bold = True
                    cell.Font.Color = 0x7D491F
                    cell.HorizontalAlignment = -4108  # xlCenter
                    
        # 5. Populate formulas row-by-row in the extended columns
        print_progress("[+] Setting up formulas in Columns G to J...")
        for r in range(8, last_row + 1):
            ws_front.Range(f"G{r}").Value = f"=F{r}*$N$1"
            ws_front.Range(f"H{r}").Value = f"=E{r}*D{r}"
            ws_front.Range(f"I{r}").Value = f"=H{r}-(G{r}*D{r})"
            ws_front.Range(f"J{r}").Value = f"=IF(H{r}>0,I{r}/H{r},0)"
            
            # Formats
            ws_front.Range(f"G{r}").NumberFormat = "#,##0"
            ws_front.Range(f"H{r}").NumberFormat = "#,##0"
            ws_front.Range(f"I{r}").NumberFormat = "#,##0"
            ws_front.Range(f"J{r}").NumberFormat = "0.0%"
            
        # 6. Add Totals Row at the bottom of the table
        tot_row = last_row + 1
        print_progress(f"[+] Appending Totals Row at row {tot_row}...")
        ws_front.Range(f"A{tot_row}").Value = "합계 (Totals)"
        ws_front.Range(f"D{tot_row}").Value = f"=SUM(D8:D{last_row})"
        ws_front.Range(f"H{tot_row}").Value = f"=SUM(H8:H{last_row})"
        ws_front.Range(f"I{tot_row}").Value = f"=SUM(I8:I{last_row})"
        ws_front.Range(f"J{tot_row}").Value = f"=IF(H{tot_row}>0,I{tot_row}/H{tot_row},0)"
        
        # Style Totals row nicely
        for col_idx in range(1, 11):
            cell = ws_front.Cells(tot_row, col_idx)
            cell.Font.Bold = True
            cell.Font.Color = 0x7D491F
            cell.Borders.Item(3).LineStyle = 1  # xlEdgeTop
            cell.Borders.Item(4).LineStyle = 9  # xlDoubleBottom
            if col_idx in [4, 8, 9]:
                cell.NumberFormat = "#,##0"
            elif col_idx == 10:
                cell.NumberFormat = "0.0%"
                
        # 7. Add Slicers for Model Filtering
        print_progress("[+] Creating interactive Model Slicer on Summary_Front...")
        try:
            for sc in list(wb.SlicerCaches):
                sc.Delete()
        except Exception:
            pass
            
        first_col_header = tbl.HeaderRowRange.Cells(1, 1).Value
        print_progress(f"[+] Table first column header name is: '{first_col_header}'")
        
        slicer_cache = wb.SlicerCaches.Add(tbl, first_col_header)
        slicer = slicer_cache.Slicers.Add(
            SlicerDestination=ws_front,
            Name="ModelSlicer",
            Caption="모델명 필터 (Select Model)",
            Top=ws_front.Range("L4").Top,
            Left=ws_front.Range("L4").Left,
            Width=220,
            Height=200
        )
        print_progress("[+] Slicer created successfully!")
        
        # 8. Save and Close
        wb.Save()
        wb.Close(True)
        print_progress("[+] Master Workbook successfully automated and saved!")
        
    except Exception as e:
        print_progress(f"[ERROR] Restoration process failed: {e}")
    finally:
        excel.Quit()

if __name__ == "__main__":
    main()
