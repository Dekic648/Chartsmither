# User Test Report V1
## Chartsmither — Full Product Sweep
### Date: 2026-03-22 | Tester: Product Ensemble (User Tester Agent)

---

## Executive Summary

6 simulated personas walked through Chartsmither's actual codebase, tracing every click, handler, and state flow. The product is **functional and well-architected** but has **4 critical issues** that would block or frustrate real users, plus **8 friction issues** that degrade the experience.

**Verdict:** Ship-ready for desktop users after P0 fixes. Mobile experience needs work before tablet/phone users are targeted.

```
                    PASS   PARTIAL   FAIL
                    ┌──┐   ┌──────┐  ┌──┐
First-Time Visitor  │██│   │      │  │  │  ✓ Can make + download a chart
Non-Technical User  │██│   │      │  │  │  ✓ Paste from Excel works great
Rushing Consultant  │  │   │██████│  │  │  ~ Theme fonts don't change
Power User          │  │   │██████│  │  │  ~ DPI ignored for PDF/PPTX
Report Builder      │  │   │██████│  │  │  ~ Gallery empty on first visit
Mobile User         │  │   │      │  │██│  ✗ Report Builder layout breaks
                    └──┘   └──────┘  └──┘
```

---

## Persona Results Matrix

```
┌─────────────────────┬────────────┬──────────┬─────────┬──────────┬───────────┐
│ Capability          │ First-Time │ Rushing  │ Non-    │ Power   │ Report   │
│                     │ Visitor    │ Consult. │ Tech    │ User    │ Builder  │
├─────────────────────┼────────────┼──────────┼─────────┼──────────┼───────────┤
│ Find a chart        │     ✓      │    ~     │    ✓    │    ✓     │    n/a    │
│ Load sample data    │     ✓      │    ✓     │    ✓    │    ✓     │    n/a    │
│ Paste own data      │     ✓      │    ✓     │    ✓    │    ✓     │    n/a    │
│ Customize options   │    n/a     │    ~     │   n/a   │    ~     │    n/a    │
│ Switch themes       │    n/a     │    ~     │   n/a   │    ✓     │    n/a    │
│ Export PNG          │     ✓      │    ✓     │    ✓    │    ✓     │    n/a    │
│ Export PDF          │    n/a     │    ✓     │   n/a   │    ~     │    ✓     │
│ Export PPTX         │    n/a     │   n/a    │   n/a   │    ~     │    ✓     │
│ Create report       │    n/a     │   n/a    │   n/a   │   n/a    │    ✓     │
│ Add charts to report│    n/a     │   n/a    │   n/a   │   n/a    │    ~     │
│ Export report       │    n/a     │   n/a    │   n/a   │   n/a    │    ✓     │
│ Mobile/tablet use   │     ~      │    ✗     │    ~    │    ✗     │    ✗     │
├─────────────────────┼────────────┼──────────┼─────────┼──────────┼───────────┤
│ Overall             │   PASS     │ PARTIAL  │  PASS   │ PARTIAL  │ PARTIAL  │
└─────────────────────┴────────────┴──────────┴─────────┴──────────┴───────────┘

✓ = Works     ~ = Works with friction     ✗ = Broken     n/a = Not tested
```

---

## Issue Severity Distribution

```
CRITICAL ████████████████  4 issues   ← Fix before next release
FRICTION ████████████████████████████████  8 issues   ← Fix in next sprint
MISSING  ████████████████  4 issues   ← Quality polish
         ─────────────────────────────────────
         0    2    4    6    8    10
```

```
By Fix Size:

  Small (S)  ████████████████████████████████████  9 issues (< 30 min each)
  Medium (M) ████████████  3 issues (1-2 hrs each)
  Large (L)                0 issues
             ─────────────────────────────────────
```

---

## Critical Issues (P0)

### CRIT-1: Report Builder layout breaks on tablet/mobile

| Field | Detail |
|-------|--------|
| **Personas** | Mobile User, Report Builder |
| **Severity** | Critical — layout overflow, unusable on iPad |
| **File** | `src/pages/ReportsPage.tsx:280` |
| **Root cause** | Hardcoded 3-column grid: `gridTemplateColumns: '180px 1fr 200px'` with no media query |
| **Expected** | Layout stacks to single column on screens < 900px |
| **Actual** | Columns squeeze together, preview crushed, horizontal scroll on phone |
| **Fix size** | S — add responsive CSS or media query |

### CRIT-2: PDF/PPTX exports ignore DPI selector

| Field | Detail |
|-------|--------|
| **Personas** | Power User |
| **Severity** | Critical — user control doesn't work |
| **File** | `src/utils/export.ts:72` and `src/utils/export.ts:115` |
| **Root cause** | `exportPdf` and `exportPptx` hardcode `scale: 4`, ignore `pixelRatio` parameter |
| **Expected** | DPI selector (1x/2x/3x/4x) applies to all export formats |
| **Actual** | Only PNG respects the selector; PDF/PPTX always render at 4x |
| **Fix size** | S — pass pixelRatio parameter through |

### CRIT-3: Chart gallery empty on first visit to Reports

| Field | Detail |
|-------|--------|
| **Personas** | Report Builder |
| **Severity** | Critical — core Report Builder flow dead-ends |
| **File** | `src/pages/EditorPage.tsx:131-137` |
| **Root cause** | `saveToGallery` has 2-second debounce; if user navigates to Reports before it fires, gallery is empty |
| **Expected** | Charts appear in gallery immediately after creation |
| **Actual** | 2s delay; fast navigation = empty gallery, confused user |
| **Fix size** | M — save to gallery on navigate-away or reduce debounce |

### CRIT-4: Theme switch only changes colors, not fonts

| Field | Detail |
|-------|--------|
| **Personas** | Rushing Consultant |
| **Severity** | Critical — "McKinsey branding" promise not fully delivered |
| **File** | `src/components/data-input/OptionsPanel.tsx:344` |
| **Root cause** | Theme picker sets `brandTheme` and `colorOverrides` but font changes don't propagate to Chart.js renderers (hardcoded to ECONOMIST_FONTS) |
| **Expected** | FT theme uses Georgia serif; Bloomberg uses Arial Black |
| **Actual** | All themes use Helvetica Neue for chart text |
| **Fix size** | M — pipe theme fonts through buildBaseOptions and ChartWrapper |

---

## Friction Issues (P1-P2)

### Priority Matrix

```
              LOW EFFORT ◄──────────────► HIGH EFFORT
         ┌─────────────────────────────────────────────┐
    HIGH │  #5 Delete confirm    │  #12 Mobile nav     │
 IMPACT  │  #6 Export validation │                     │
         │  #7 Paste in JSON mode│                     │
         │  #8 Export silent fail│                     │
         ├───────────────────────┼─────────────────────┤
    LOW  │  #9 Ref line limit   │                     │
 IMPACT  │  #10 Axis validation │                     │
         │  #11 LineWidth 0.6x  │                     │
         └─────────────────────────────────────────────┘

Quick wins (top-left): 5 issues fixable in < 2 hours total
```

| # | Issue | Persona | File | Fix |
|---|-------|---------|------|-----|
| 5 | Report delete — no confirmation, uses `window.location.reload()` | Report Builder | `ReportsPage.tsx:82` | Add confirm dialog or undo toast |
| 6 | Can export report with empty title/client | Report Builder | `ReportsPage.tsx:225-242` | Warning before export if metadata empty |
| 7 | Paste event silently ignored in JSON tab | Non-Technical | `DataEditor.tsx:98` | Auto-switch to paste tab on paste detect |
| 8 | Export buttons silently fail if chartRef null | First-Timer | `ExportBar.tsx:61` | Disable buttons until chart rendered |
| 9 | Reference line 3-limit not communicated | Power User | `OptionsPanel.tsx:273` | Show "(max 3)" label |
| 10 | Y-axis min > max not validated | Power User | `OptionsPanel.tsx:559-577` | Swap or warn |
| 11 | StackedArea lineWidth has hidden 0.6x factor | Power User | `chartjs/index.tsx:396` | Remove multiplier |
| 12 | Nav bar doesn't collapse on mobile | Mobile | `AppShell.tsx:84-115` | Hamburger menu < 768px |

---

## Missing States

| # | State | When | Current Behavior | Expected | File |
|---|-------|------|-----------------|----------|------|
| 13 | Report Builder loading | Click "New report" | Brief blank flash | Skeleton or spinner | `ReportsPage.tsx:196` |
| 14 | Theme change overwrites custom colors | Switch theme after manual color edits | Custom colors silently replaced | Warning before overwrite | `OptionsPanel.tsx:344` |
| 15 | Report with orphaned chart | Chart deleted from gallery | "Chart unavailable" placeholder | **Already handled** ✓ | `ReportsPage.tsx:133` |
| 16 | Report deletion | Click trash icon | Immediate delete + page reload | Confirmation dialog | `ReportsPage.tsx:82` |

---

## Positive Findings

```
WHAT WORKS WELL                          WHY IT MATTERS
──────────────────────────────────────   ──────────────────────────────────
Paste-first data input default           Non-tech users never see JSON
Smart CSV/TSV auto-detection             Paste from Excel "just works"
Sample data on every chart (49/49)       Zero empty-state anxiety
"Change sample data" cycling             Instant chart exploration
Theme-driven cover pages                 McKinsey cover looks like McKinsey
Chart editor auto-save                   No data loss on refresh
Reference lines + data labels            Publication-quality output
5-theme masthead recoloring              Instant brand switching
WYSIWYG report preview                   What you see is what you export
Orphaned chart handling in reports        Graceful degradation
```

---

## Recommended Fix Sequence

```
PHASE A — Ship Blockers (do now, ~3 hours)
─────────────────────────────────────────
  [1] Report Builder responsive grid        S   30 min
  [2] PDF/PPTX DPI passthrough             S   15 min
  [3] Gallery save on navigate-away         M   45 min
  [4] Theme fonts in Chart.js renderers     M   90 min

PHASE B — Quick Wins (~1.5 hours)
─────────────────────────────────
  [5] Report delete confirmation            S   15 min
  [6] Export metadata validation            S   15 min
  [7] Auto-switch to paste tab on paste     S   15 min
  [8] Disable export until chart ready      S   15 min
  [9] Reference line "(max 3)" label        S   5 min
  [10] Axis min/max swap validation         S   10 min
  [11] Remove StackedArea 0.6x factor       S   5 min

PHASE C — Mobile Polish (when targeting tablets)
────────────────────────────────────────────────
  [12] Mobile nav collapse                  M   60 min
  [13] Report Builder loading state         S   15 min
  [14] Theme change color overwrite warning S   20 min
```

---

## Test Methodology

- **Agent:** Product Ensemble User Tester (v1.0)
- **Method:** Code trace — read actual source files, follow routes, verify handlers, check state flows
- **Codebase:** `/Users/milovandekic/chartsmither` at commit `1611eca`
- **Scope:** Full product sweep — all routes, all features
- **Personas:** 6 (First-Timer, Rushing Consultant, Non-Technical User, Power User, Report Builder, Mobile User)
- **Not tested:** Backend (none exists), authentication (none exists), real browser rendering (code trace only)

---

*Generated by Product Ensemble User Tester | Chartsmither V1 | 2026-03-22*
