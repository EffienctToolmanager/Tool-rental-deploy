from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

checks = [
    (ROOT / "api" / "index.py", [
        "Fluke 87V",
        "Keysight U1282A",
        "Hioki IR4056",
        "Megger MIT525",
        "datasheetUrl",
        "specSummary",
    ]),
    (ROOT / "src" / "components" / "InventoryTable.tsx", [
        "Spec Summary",
        "Export Spec CSV",
        "selectedToolCodes.length",
        "detailsAsset",
        "datasheet-summary-card",
        "downloadSelectedCsv",
        "⋯",
    ]),
    (ROOT / "src" / "types.ts", [
        "SpecSummary",
        "datasheetUrl",
        "safetyCategory",
        "measurementRange",
    ]),
]

missing = []
for path, needles in checks:
    text = path.read_text(encoding="utf-8")
    for needle in needles:
        if needle not in text:
            missing.append(f"{path.relative_to(ROOT)} missing: {needle}")

if missing:
    raise SystemExit("\n".join(missing))

print("inventory feature static verification passed")
