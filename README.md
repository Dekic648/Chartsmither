# Chartsmither

Publication-quality data visualizations in the style of The Economist, Financial Times, Bloomberg, and McKinsey. Built with React, TypeScript, and Vite.

## What it does

Chartsmither lets you create beautiful, editorial-grade charts from your data. Pick a chart type, paste your data (CSV, Excel, JSON, or plain numbers), customize the styling, and export as PNG, SVG, or embeddable HTML.

## Features

### 48 Chart Types

| Category | Charts |
|---|---|
| **Line** | Single line, Multi-line, Area, Stacked area, Stream graph |
| **Bar** | Vertical, Grouped, Stacked, Histogram, Waterfall, Marimekko |
| **Horizontal** | Lollipop, Diverging bar, Population pyramid |
| **Scatter** | Scatter + trendline, Bubble |
| **Part-to-whole** | Pie, Donut, Treemap, Sunburst, Circle packing |
| **Distribution** | Box plot, Violin plot, Density plot, Error bars |
| **Flow & hierarchy** | Sankey, Chord, Tree diagram, Network, Arc diagram |
| **Maps** | Choropleth, Bubble map, Dot map, Connection map, Flow map |
| **Specialised** | Radar, Heatmap, Bullet graph, Dot matrix, Span chart, Radial bar, Nightingale rose, Proportional area, Pictogram, Word cloud, Venn diagram, Parallel coordinates, Gantt, Timeline |

### 5 Brand Themes

- **The Economist** — Red masthead, steel blue palette
- **Financial Times** — Pink background, serif typography
- **Bloomberg** — Black masthead, vivid colors
- **McKinsey** — Dark blue, corporate clean
- **Minimal** — No chrome, black & grey only

### Smart Data Input

- **Paste from anywhere** — auto-detects CSV, TSV (Excel/Google Sheets), JSON, or plain numbers
- **Smart column mapping** — recognizes headers like "source/target", "min/max", "start/end" and maps them to the right chart fields
- **Live validation** — shows what's wrong and what's expected
- **CSV/JSON file upload**
- **Sample data** for every chart type

### Templates

16 pre-built chart configurations with realistic data:
- Business (revenue bridge, market share, KPI dashboard)
- Economics (GDP comparison, trade balance, inflation)
- Survey (NPS, satisfaction breakdown, word cloud)
- Editorial (climate change, tech adoption, city rankings)

### Dashboard Composer

Build multi-chart dashboards at `/dashboard`:
- Add any chart type from the catalogue
- Resize panels (small / medium / large)
- Export entire dashboard as PNG or HTML

### Export & Share

- **PNG** at 3x retina resolution
- **SVG** vector export
- **Standalone HTML** file
- **Embed code** (iframe snippet)
- **Shareable URLs** with encoded chart config

### Polish

- Undo/redo (50 levels)
- Auto-save to localStorage
- Responsive layout (mobile-friendly)
- SVG thumbnail previews in catalogue

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/`.

## Pages

| Route | Description |
|---|---|
| `/` | Chart catalogue — browse all 48 types |
| `/edit/:type` | Chart editor with live preview |
| `/templates` | Pre-built chart templates |
| `/dashboard` | Multi-chart dashboard builder |

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for build tooling
- **Chart.js** + **react-chartjs-2** for interactive charts
- **Custom SVG** renderers for specialised chart types
- **PapaParse** for CSV parsing
- **html-to-image** for PNG/SVG export
- **Lucide React** for icons

## Project structure

```
src/
  charts/
    chartjs/       # Chart.js-based renderers (13 types)
    svg/           # Custom SVG renderers (28 types)
    maps/          # Map chart renderers (5 types)
  components/
    data-input/    # DataEditor, OptionsPanel
    export/        # ExportBar, SharePanel
    layout/        # AppShell, ChartWrapper
    ui/            # ChartThumbnail, ThemePicker
  pages/           # CataloguePage, EditorPage, TemplatesPage, DashboardPage
  templates/       # Pre-built chart configurations
  theme/           # Economist theme, brand themes, ThemeContext
  types/           # TypeScript types
  utils/           # Data transform, export, history, storage, share
```

## License

MIT
