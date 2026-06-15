# 🎨 Design System & Code Guidelines - GE VERNOVA

This document establishes the official styling guide and branding guidelines for the **GE VERNOVA Tool Rental System** project. 

---

## 🏢 Brand Character & Core Identity

Our brand represents **Reliability, Clean Energy, and Industrial Precision**. The interface must reflect a high-performance workspace:
*   **Precision over Fluff**: Layouts are clean, high-contrast, and focused on tool state visualization.
*   **Color Tone Strategy**:
    *   **Evergreen (`#005E60` / `var(--color-evergreen-800)`)**: Main primary identity brand color. Indicates safe states, official elements, and submission confirmations.
    *   **Electric Violet (`var(--color-violet-600)`)**: Accent shade for secondary action points (e.g. check-out details, calibration schedules).
    *   **Safety Amber (`var(--color-amber-500)`)**: Warn states (e.g. calibration expiration warnings).
    *   **Overdue Red (`var(--color-red-600)`)**: Critical status (e.g., Overdue rentals).

---

## 📏 Color & Spacing Context

All CSS variables are integrated with **Tailwind CSS v4** token engine.

### Spacing Context Scale
Do not use random spacing/paddings. Use the standard Tailwind v4 spacing tokens:
*   `space-1` (0.25rem / 4px): Micro offsets between inputs/labels.
*   `space-2` (0.5rem / 8px): Small spacing inside lists and checkboxes.
*   `space-4` (1.0rem / 16px): Standard padding inside cards and forms.
*   `space-6` (1.5rem / 24px): Padding inside modals and outer dashboard sections.

---

## 🚫 Component Combination Rules (What NOT to use)

To keep styling consistent across components:
1.  **Do not mix Flex and absolute position styles**: Never position elements using absolute offsets (e.g. `left-12 top-4`) to overlap sibling text. Use flexbox gaps.
2.  **Do not build independent scroll panels inside sub-cards**: All scrollable panels must be controlled at the top-level view layout to prevent nested scrolling loops.
3.  **Do not combine custom border definitions with standard card borders**: All component cards must inherit the `--f-border` styles mapped in `index.css`.
4.  **No custom font families**: Maintain uniform typography. All text nodes must resolve to the standard system sans-serif family (`var(--font-sans)`).

---

## 🏷️ Figma Layer Naming Conventions

To automate translation via Figma MCP, designers and developers must follow these layer naming structures:

| Figma Layer Pattern | Export Target | CSS Class Mapping |
| :--- | :--- | :--- |
| `[Section] Header` | Top navigation / Title bounds | `.header-title` |
| `[Card] Item: <Name>` | Rental status card containers | `.rental-card-item` |
| `[Button] Action: <Name>` | Submissions / Triggers | `data-agent-id="<name>-action-btn"` |
| `[Input] Field: <Label>` | Form inputs / selectors | `.form-input-field` |
| `[Indicator] Status: <Type>` | Calibration, overdue, safe indicators | `.status-badge-<type>` |
