# Project AssetFlow Verification Plan

## Tasks
- [x] Navigate to http://localhost:5174/
- [ ] Verify Tab 1: Smart Rental
    - [ ] Form displays
    - [ ] Asset selection works
    - [ ] Auto-fill (Model, Cal Date) works
- [ ] Verify Tab 2: Live Dashboard
    - [ ] Card grid displays
    - [ ] Oscilloscope overdue status (red border)
- [ ] Verify Tab 3: Master Inventory
    - [ ] Data table displays
    - [ ] Calibration alerts (color highlighting)
- [ ] Return to Smart Rental tab and take screenshot

## Notes
- Port specified: 5174
- Tech stack: React, Vite, TypeScript, Fluent Design
- **ERROR**: Compilation error in `src/components/InventoryTable.tsx` at line 42:25.
    - Message: `[PARSE_ERROR] Error: Unexpected token`
    - Cause: `<span>Cal < 30 Days</span>` (The `<` character is being treated as a JSX tag start).
    - Status: Cannot proceed with UI verification until this is fixed.
