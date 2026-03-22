import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Undo2, Redo2 } from 'lucide-react';
import { CHART_CATALOGUE } from '../types/catalogue';
import type { ChartData, ChartOptions, ChartTypeId } from '../types/chart';
import { DEFAULT_OPTIONS } from '../types/chart';
import { ECONOMIST_COLORS } from '../theme/economist';
import { getBrandTheme } from '../theme/brands';
import ChartWrapper from '../components/layout/ChartWrapper';
import DataEditor from '../components/data-input/DataEditor';
import OptionsPanel from '../components/data-input/OptionsPanel';
import ExportBar from '../components/export/ExportBar';
import { getSampleData, getAlternateSampleData } from '../utils/sampleData';
import { getColors } from '../theme/economist';
import { CHARTJS_RENDERERS } from '../charts/chartjs';
import { SVG_RENDERERS } from '../charts/svg';
import { TIER2_BATCH1_RENDERERS } from '../charts/svg/tier2-batch1';
import { TIER2_BATCH2_RENDERERS } from '../charts/svg/tier2-batch2';
import { TIER2_BATCH3_RENDERERS } from '../charts/svg/tier2-batch3';
import { MAP_RENDERERS } from '../charts/maps';
import SharePanel from '../components/export/SharePanel';
import { useHistory } from '../utils/useHistory';
import { loadChart, autoSave } from '../utils/storage';
import { decodeChartConfig } from '../utils/share';

// Merge all SVG renderers
const ALL_SVG_RENDERERS = {
  ...SVG_RENDERERS,
  ...TIER2_BATCH1_RENDERERS,
  ...TIER2_BATCH2_RENDERERS,
  ...TIER2_BATCH3_RENDERERS,
  ...MAP_RENDERERS,
};

const EditorPage: React.FC = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chartRef = useRef<HTMLDivElement>(null);
  const isEmbed = searchParams.get('embed') === 'true';

  const meta = CHART_CATALOGUE.find((c) => c.id === typeId);

  const {
    state: data,
    set: setData,
    undo: undoData,
    redo: redoData,
    canUndo: canUndoData,
    canRedo: canRedoData,
  } = useHistory<ChartData>({});

  const {
    state: options,
    set: setOptions,
    undo: undoOptions,
    redo: redoOptions,
    canUndo: canUndoOptions,
    canRedo: canRedoOptions,
  } = useHistory<ChartOptions>({ ...DEFAULT_OPTIONS });

  const canUndo = canUndoData || canUndoOptions;
  const canRedo = canRedoData || canRedoOptions;

  const handleUndo = () => {
    undoData();
    undoOptions();
  };

  const handleRedo = () => {
    redoData();
    redoOptions();
  };

  // Load from shared URL, saved state, or sample data
  useEffect(() => {
    if (!typeId) return;

    // 1. Check for shared chart in URL
    const sharedParam = searchParams.get('chart');
    if (sharedParam) {
      const shared = decodeChartConfig(sharedParam);
      if (shared) {
        setData(shared.data);
        setOptions(shared.options);
        return;
      }
    }

    // 2. Check for template param
    const templateParam = searchParams.get('template');
    if (templateParam) {
      import('../templates/loader').then(({ loadTemplate }) => {
        const tpl = loadTemplate(templateParam);
        if (tpl) {
          setData(tpl.data);
          setOptions({ ...DEFAULT_OPTIONS, ...tpl.options });
          return;
        }
      });
      return;
    }

    // 3. Try localStorage
    const saved = loadChart(typeId);
    if (saved) {
      setData(saved.data);
      setOptions(saved.options);
    } else {
      // 4. Fall back to sample data
      const sample = getSampleData(typeId as ChartTypeId);
      setData(sample);
      setOptions({
        ...DEFAULT_OPTIONS,
        title: meta?.name || '',
        subtitle: meta?.description || '',
        source: 'Source: Your data',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeId]);

  // Auto-save on data/options changes
  useEffect(() => {
    if (typeId) {
      autoSave(typeId, data, options);
    }
  }, [typeId, data, options]);

  const handleLoadSample = () => {
    if (!typeId || !meta) return;
    try { localStorage.removeItem(`chartcraft:${typeId}`); } catch {}
    const sample = getAlternateSampleData(typeId as ChartTypeId);
    setData(sample);
    setOptions({
      ...DEFAULT_OPTIONS,
      title: meta.name || '',
      subtitle: meta.description || '',
      source: 'Source: Your data',
    });
  };

  if (!meta) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Chart type not found.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: 12, color: ECONOMIST_COLORS.red }}>
          Back to catalogue
        </button>
      </div>
    );
  }

  // Resolve theme
  const resolvedTheme = getBrandTheme(options.brandTheme ?? 'economist');

  // Build legend items from series data
  const legendItems = data.series?.map((s, i) => ({
    label: s.name,
    color: s.color || (options.colorOverrides?.[i]) || getColors(data.series!.length)[i],
  })) || [];

  // Get the right renderer
  const Renderer = meta.engine === 'chartjs'
    ? CHARTJS_RENDERERS[meta.id]
    : ALL_SVG_RENDERERS[meta.id];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumb + undo/redo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid #EDE7DD',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            color: '#7A7468',
            cursor: 'pointer',
            fontSize: 13,
            padding: '4px 0',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#E3120B'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#7A7468'; }}
        >
          <ArrowLeft size={15} /> All charts
        </button>
        <span style={{ color: '#C4BDB3', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1714' }}>{meta.name}</span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Undo / Redo */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            background: canUndo ? '#FFFFFF' : 'transparent',
            border: canUndo ? '1px solid #E8E0D4' : '1px solid transparent',
            borderRadius: 6,
            cursor: canUndo ? 'pointer' : 'default',
            color: canUndo ? '#2D2A26' : '#C4BDB3',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (canUndo) {
              e.currentTarget.style.borderColor = '#9B9488';
              e.currentTarget.style.background = '#FAF4EA';
            }
          }}
          onMouseLeave={(e) => {
            if (canUndo) {
              e.currentTarget.style.borderColor = '#E8E0D4';
              e.currentTarget.style.background = '#FFFFFF';
            }
          }}
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            background: canRedo ? '#FFFFFF' : 'transparent',
            border: canRedo ? '1px solid #E8E0D4' : '1px solid transparent',
            borderRadius: 6,
            cursor: canRedo ? 'pointer' : 'default',
            color: canRedo ? '#2D2A26' : '#C4BDB3',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (canRedo) {
              e.currentTarget.style.borderColor = '#9B9488';
              e.currentTarget.style.background = '#FAF4EA';
            }
          }}
          onMouseLeave={(e) => {
            if (canRedo) {
              e.currentTarget.style.borderColor = '#E8E0D4';
              e.currentTarget.style.background = '#FFFFFF';
            }
          }}
        >
          <Redo2 size={15} />
        </button>
      </div>

      {/* Main layout: preview left, controls right */}
      <div className="cc-editor-grid">
        {/* Left: Chart preview */}
        <div>
          <div ref={chartRef}>
            <ChartWrapper
              title={options.title}
              subtitle={options.subtitle}
              source={options.source}
              footnote={options.footnote}
              legendItems={options.legendPosition !== 'none' ? legendItems : undefined}
              legendPosition={options.legendPosition}
              titleFontSize={options.titleFontSize}
              subtitleFontSize={options.subtitleFontSize}
              width={options.width}
              theme={resolvedTheme}
            >
              <div style={{ position: 'relative', height: options.height - 100 }}>
                {Renderer ? (
                  <Renderer
                    data={data}
                    options={options}
                    width={options.width - 32}
                    height={options.height - 100}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: ECONOMIST_COLORS.textTertiary,
                    fontSize: 14,
                  }}>
                    Renderer not available for {meta.id}
                  </div>
                )}
              </div>
            </ChartWrapper>
          </div>

          <ExportBar chartRef={chartRef} title={options.title} />
        </div>

        {/* Right: Controls -- data first, then options, then share */}
        {!isEmbed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DataEditor chartTypeId={meta.id} data={data} onChange={setData} onLoadSample={handleLoadSample} />
            <OptionsPanel options={options} onChange={setOptions} />
            <SharePanel typeId={meta.id} data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;
