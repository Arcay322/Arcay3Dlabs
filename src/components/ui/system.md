# Arcay3Dlabs Design System: "Digital Forge"

**Intent:** A precision engineering workspace. Not a shop, but a tool for creators.
**Feel:** Industrial, Tactile, Precise, Raw.

## 1. Core Palette (Semantic)

| Token | Hex | Role | Meaning |
| :--- | :--- | :--- | :--- |
| `hotend-orange` | `#f97316` | Primary / Action | Heat, Active Machine, Warning |
| `workshop-slate` | `#1a1d24` | Surface / Heavy | Cast Iron, Machine Base |
| `blueprint-blue` | `#1e293b` | Structural | Deep layout, Blueprints |
| `technical-white` | `#f8fafc` | Paper / High Contrast | Readability, Specs |

## 2. Typography

- **Headlines:** `Space Grotesk` (Bold, Tight tracking). Impact and geometry.
- **Body:** `Roboto` (Regular). Neutral readability.
- **Data/Specs:** `JetBrains Mono` (Uppercase). Technical constraints, IDs, Prices.

## 3. Structural Primitives

### The Technical Card
- **Border:** `1px solid var(--border)`
- **Shadow:** Solid offset (no blur). `3px 3px 0 0 var(--border)`
- **Interaction:** Hover shifts card `-1px -1px` and shadow becomes `var(--primary)`.
- **CSS Class:** `.border-layered`

### The Engineering Input
- **Border:** Solid, consistent. `1px`.
- **Radius:** `0` or `2px` (Machined edges).
- **Typography:** Value is always **Monospace**.
- **States:**
    - Default: Gray border.
    - Focus: Black/White solid border (High contrast), no soft glow.

### The Mechanical Button
- **Timing:** `transition-all duration-75` (Instant/Fast).
- **Action:** Active state (click) translates `translate-y-1` to simulate physical travel.

## 4. Animation Guidelines

- **No Springs:** Springs are for toys. Machines move with dampened precision (`ease-out`).
- **Speed:** Fast (100ms - 200ms).
- **Type:** Steps or Slide.

## 5. Vocabulary

- Use "specs" instead of "details".
- Use "deploy" or "initiate" instead of "start".
- Using technical labels like `ID:`, `MAT:`, `QTY:` adds to the immersion.
