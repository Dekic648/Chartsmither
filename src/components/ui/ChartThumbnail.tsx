import React from 'react';
import type { ChartTypeId } from '../../types/chart';

const BLUE = '#2E6DA4';
const RED = '#C0392B';
const GREEN = '#1A7A4A';
const ORANGE = '#E07B22';
const W = 120;
const H = 64;

const thumbnails: Record<ChartTypeId, React.ReactNode> = {
  // ── Line ──
  line: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <polyline points="10,50 30,38 50,42 70,22 90,28 110,12" fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </>
  ),
  'multi-line': (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <polyline points="10,44 30,36 50,40 70,24 90,30 110,14" fill="none" stroke={BLUE} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="10,52 30,46 50,38 70,42 90,34 110,28" fill="none" stroke={RED} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="10,48 30,50 50,46 70,48 90,44 110,40" fill="none" stroke={GREEN} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
    </>
  ),
  area: (
    <>
      <polygon points="10,50 30,38 50,42 70,22 90,28 110,12 110,58 10,58" fill={BLUE} fillOpacity={0.2} />
      <polyline points="10,50 30,38 50,42 70,22 90,28 110,12" fill="none" stroke={BLUE} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
    </>
  ),
  'stacked-area': (
    <>
      <polygon points="10,58 10,40 30,34 50,36 70,28 90,30 110,22 110,58" fill={BLUE} fillOpacity={0.3} />
      <polygon points="10,58 10,48 30,44 50,46 70,40 90,42 110,36 110,58" fill={RED} fillOpacity={0.3} />
      <polygon points="10,58 10,54 30,52 50,54 70,50 90,52 110,48 110,58" fill={GREEN} fillOpacity={0.3} />
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
    </>
  ),

  // ── Bar ──
  bar: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <rect x={14} y={30} width={14} height={28} fill={BLUE} rx={1} />
      <rect x={34} y={18} width={14} height={40} fill={BLUE} rx={1} />
      <rect x={54} y={38} width={14} height={20} fill={BLUE} rx={1} />
      <rect x={74} y={10} width={14} height={48} fill={BLUE} rx={1} />
      <rect x={94} y={24} width={14} height={34} fill={BLUE} rx={1} />
    </>
  ),
  'grouped-bar': (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <rect x={12} y={28} width={10} height={30} fill={BLUE} rx={1} />
      <rect x={23} y={36} width={10} height={22} fill={RED} rx={1} />
      <rect x={42} y={16} width={10} height={42} fill={BLUE} rx={1} />
      <rect x={53} y={24} width={10} height={34} fill={RED} rx={1} />
      <rect x={72} y={34} width={10} height={24} fill={BLUE} rx={1} />
      <rect x={83} y={20} width={10} height={38} fill={RED} rx={1} />
    </>
  ),
  'stacked-bar': (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <rect x={14} y={34} width={14} height={24} fill={BLUE} rx={1} />
      <rect x={14} y={22} width={14} height={12} fill={RED} rx={1} />
      <rect x={34} y={26} width={14} height={32} fill={BLUE} rx={1} />
      <rect x={34} y={10} width={14} height={16} fill={RED} rx={1} />
      <rect x={54} y={38} width={14} height={20} fill={BLUE} rx={1} />
      <rect x={54} y={30} width={14} height={8} fill={RED} rx={1} />
      <rect x={74} y={20} width={14} height={38} fill={BLUE} rx={1} />
      <rect x={74} y={8} width={14} height={12} fill={RED} rx={1} />
      <rect x={94} y={30} width={14} height={28} fill={BLUE} rx={1} />
      <rect x={94} y={18} width={14} height={12} fill={RED} rx={1} />
    </>
  ),
  histogram: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <rect x={10} y={48} width={12} height={10} fill={BLUE} />
      <rect x={22} y={38} width={12} height={20} fill={BLUE} />
      <rect x={34} y={22} width={12} height={36} fill={BLUE} />
      <rect x={46} y={12} width={12} height={46} fill={BLUE} />
      <rect x={58} y={18} width={12} height={40} fill={BLUE} />
      <rect x={70} y={28} width={12} height={30} fill={BLUE} />
      <rect x={82} y={42} width={12} height={16} fill={BLUE} />
      <rect x={94} y={50} width={12} height={8} fill={BLUE} />
    </>
  ),
  waterfall: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <rect x={12} y={20} width={12} height={38} fill={BLUE} rx={1} />
      <rect x={30} y={20} width={12} height={14} fill={GREEN} rx={1} />
      <line x1={24} y1={20} x2={30} y2={20} stroke="#9B9488" strokeWidth={0.5} strokeDasharray="2,1" />
      <rect x={48} y={14} width={12} height={6} fill={GREEN} rx={1} />
      <line x1={42} y1={34} x2={48} y2={34} stroke="#9B9488" strokeWidth={0.5} strokeDasharray="2,1" />
      <rect x={66} y={22} width={12} height={12} fill={RED} rx={1} />
      <line x1={60} y1={14} x2={66} y2={14} stroke="#9B9488" strokeWidth={0.5} strokeDasharray="2,1" />
      <rect x={84} y={14} width={12} height={44} fill={BLUE} rx={1} />
    </>
  ),

  // ── Scatter ──
  scatter: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <line x1={10} y1={8} x2={10} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      {[[20,44],[30,36],[38,40],[48,28],[55,32],[62,20],[72,24],[80,18],[92,14],[100,26]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.5} fill={BLUE} fillOpacity={0.7} />
      ))}
    </>
  ),
  bubble: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <line x1={10} y1={8} x2={10} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      <circle cx={28} cy={40} r={6} fill={BLUE} fillOpacity={0.5} />
      <circle cx={50} cy={28} r={9} fill={RED} fillOpacity={0.5} />
      <circle cx={75} cy={36} r={4} fill={GREEN} fillOpacity={0.5} />
      <circle cx={90} cy={18} r={7} fill={ORANGE} fillOpacity={0.5} />
      <circle cx={40} cy={20} r={3} fill={BLUE} fillOpacity={0.5} />
    </>
  ),

  // ── Part-to-whole ──
  pie: (
    <>
      <path d="M60,32 L60,10 A22,22 0 0,1 80,22 Z" fill={BLUE} />
      <path d="M60,32 L80,22 A22,22 0 0,1 82,38 Z" fill={RED} />
      <path d="M60,32 L82,38 A22,22 0 0,1 68,52 Z" fill={GREEN} />
      <path d="M60,32 L68,52 A22,22 0 0,1 40,46 Z" fill={ORANGE} />
      <path d="M60,32 L40,46 A22,22 0 0,1 60,10 Z" fill="#7B68A8" />
    </>
  ),
  donut: (
    <>
      <circle cx={60} cy={32} r={22} fill="none" stroke={BLUE} strokeWidth={8} strokeDasharray="30 108" strokeDashoffset={0} />
      <circle cx={60} cy={32} r={22} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="25 113" strokeDashoffset={-30} />
      <circle cx={60} cy={32} r={22} fill="none" stroke={GREEN} strokeWidth={8} strokeDasharray="20 118" strokeDashoffset={-55} />
      <circle cx={60} cy={32} r={22} fill="none" stroke={ORANGE} strokeWidth={8} strokeDasharray="63 138" strokeDashoffset={-75} />
    </>
  ),
  treemap: (
    <>
      <rect x={10} y={8} width={50} height={32} fill={BLUE} rx={1} stroke="#FDF8F0" strokeWidth={1} />
      <rect x={60} y={8} width={50} height={20} fill={RED} rx={1} stroke="#FDF8F0" strokeWidth={1} />
      <rect x={60} y={28} width={28} height={12} fill={GREEN} rx={1} stroke="#FDF8F0" strokeWidth={1} />
      <rect x={88} y={28} width={22} height={12} fill={ORANGE} rx={1} stroke="#FDF8F0" strokeWidth={1} />
      <rect x={10} y={40} width={30} height={18} fill="#7B68A8" rx={1} stroke="#FDF8F0" strokeWidth={1} />
      <rect x={40} y={40} width={35} height={18} fill="#D4A843" rx={1} stroke="#FDF8F0" strokeWidth={1} />
      <rect x={75} y={40} width={35} height={18} fill="#5DADE2" rx={1} stroke="#FDF8F0" strokeWidth={1} />
    </>
  ),

  // ── Ranking / Horizontal ──
  lollipop: (
    <>
      {[[52,12],[80,22],[38,32],[66,42],[44,52]].map(([cx, cy], i) => (
        <React.Fragment key={i}>
          <line x1={16} y1={cy} x2={cx} y2={cy} stroke={BLUE} strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={3} fill={BLUE} />
        </React.Fragment>
      ))}
      <line x1={16} y1={6} x2={16} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
    </>
  ),
  'diverging-bar': (
    <>
      <line x1={60} y1={6} x2={60} y2={58} stroke="#9B9488" strokeWidth={0.5} />
      <rect x={30} y={10} width={30} height={7} fill={RED} rx={1} />
      <rect x={60} y={10} width={35} height={7} fill={BLUE} rx={1} />
      <rect x={40} y={22} width={20} height={7} fill={RED} rx={1} />
      <rect x={60} y={22} width={25} height={7} fill={BLUE} rx={1} />
      <rect x={20} y={34} width={40} height={7} fill={RED} rx={1} />
      <rect x={60} y={34} width={15} height={7} fill={BLUE} rx={1} />
      <rect x={45} y={46} width={15} height={7} fill={RED} rx={1} />
      <rect x={60} y={46} width={40} height={7} fill={BLUE} rx={1} />
    </>
  ),
  'population-pyramid': (
    <>
      <line x1={60} y1={6} x2={60} y2={58} stroke="#9B9488" strokeWidth={0.5} />
      {[{y:8,l:20,r:22},{y:18,l:28,r:30},{y:28,l:35,r:32},{y:38,l:30,r:28},{y:48,l:18,r:16}].map((d, i) => (
        <React.Fragment key={i}>
          <rect x={60 - d.l} y={d.y} width={d.l} height={8} fill={RED} rx={1} />
          <rect x={60} y={d.y} width={d.r} height={8} fill={BLUE} rx={1} />
        </React.Fragment>
      ))}
    </>
  ),

  // ── Distribution ──
  'box-plot': (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      {/* Box 1 */}
      <line x1={30} y1={12} x2={30} y2={18} stroke={BLUE} strokeWidth={1} />
      <rect x={20} y={18} width={20} height={22} fill={BLUE} fillOpacity={0.2} stroke={BLUE} strokeWidth={1} rx={1} />
      <line x1={20} y1={28} x2={40} y2={28} stroke={BLUE} strokeWidth={2} />
      <line x1={30} y1={40} x2={30} y2={48} stroke={BLUE} strokeWidth={1} />
      <line x1={24} y1={12} x2={36} y2={12} stroke={BLUE} strokeWidth={1} />
      <line x1={24} y1={48} x2={36} y2={48} stroke={BLUE} strokeWidth={1} />
      {/* Box 2 */}
      <line x1={70} y1={8} x2={70} y2={14} stroke={RED} strokeWidth={1} />
      <rect x={60} y={14} width={20} height={28} fill={RED} fillOpacity={0.2} stroke={RED} strokeWidth={1} rx={1} />
      <line x1={60} y1={24} x2={80} y2={24} stroke={RED} strokeWidth={2} />
      <line x1={70} y1={42} x2={70} y2={52} stroke={RED} strokeWidth={1} />
      <line x1={64} y1={8} x2={76} y2={8} stroke={RED} strokeWidth={1} />
      <line x1={64} y1={52} x2={76} y2={52} stroke={RED} strokeWidth={1} />
    </>
  ),
  'violin-plot': (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      {/* Violin 1 */}
      <path d="M30,10 Q40,18 42,30 Q40,42 30,50 Q20,42 18,30 Q20,18 30,10 Z" fill={BLUE} fillOpacity={0.25} stroke={BLUE} strokeWidth={1} />
      <line x1={30} y1={20} x2={30} y2={40} stroke={BLUE} strokeWidth={2} />
      <circle cx={30} cy={30} r={2} fill={BLUE} />
      {/* Violin 2 */}
      <path d="M80,8 Q94,20 96,32 Q94,44 80,54 Q66,44 64,32 Q66,20 80,8 Z" fill={RED} fillOpacity={0.25} stroke={RED} strokeWidth={1} />
      <line x1={80} y1={18} x2={80} y2={44} stroke={RED} strokeWidth={2} />
      <circle cx={80} cy={32} r={2} fill={RED} />
    </>
  ),

  // ── Other ──
  radar: (
    <>
      {/* Pentagon background */}
      <polygon points="60,10 88,28 78,54 42,54 32,28" fill="none" stroke="#E8E0D4" strokeWidth={0.5} />
      <polygon points="60,20 80,32 74,48 46,48 40,32" fill="none" stroke="#E8E0D4" strokeWidth={0.5} />
      {/* Data shape */}
      <polygon points="60,14 84,30 70,52 48,46 38,26" fill={BLUE} fillOpacity={0.2} stroke={BLUE} strokeWidth={1.5} />
      {[[60,14],[84,30],[70,52],[48,46],[38,26]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2} fill={BLUE} />
      ))}
    </>
  ),
  heatmap: (
    <>
      {[
        [BLUE, '#5DADE2', GREEN, '#A3D9A5'],
        [RED, ORANGE, '#5DADE2', BLUE],
        ['#A3D9A5', GREEN, ORANGE, RED],
        ['#5DADE2', BLUE, RED, ORANGE],
      ].map((row, ri) =>
        row.map((color, ci) => (
          <rect
            key={`${ri}-${ci}`}
            x={14 + ci * 24}
            y={6 + ri * 14}
            width={22}
            height={12}
            fill={color}
            fillOpacity={0.6}
            rx={1}
          />
        ))
      )}
    </>
  ),
  'bullet-graph': (
    <>
      {/* Background ranges */}
      <rect x={12} y={14} width={96} height={14} fill="#E8E0D4" rx={1} />
      <rect x={12} y={14} width={72} height={14} fill="#D4CEC4" rx={1} />
      <rect x={12} y={14} width={44} height={14} fill="#BDB7AD" rx={1} />
      {/* Actual bar */}
      <rect x={12} y={18} width={60} height={6} fill={BLUE} rx={1} />
      {/* Target marker */}
      <line x1={76} y1={13} x2={76} y2={29} stroke={RED} strokeWidth={2} />
      {/* Second bullet */}
      <rect x={12} y={38} width={96} height={14} fill="#E8E0D4" rx={1} />
      <rect x={12} y={38} width={72} height={14} fill="#D4CEC4" rx={1} />
      <rect x={12} y={38} width={44} height={14} fill="#BDB7AD" rx={1} />
      <rect x={12} y={42} width={80} height={6} fill={GREEN} rx={1} />
      <line x1={68} y1={37} x2={68} y2={53} stroke={RED} strokeWidth={2} />
    </>
  ),
  'dot-matrix': (
    <>
      {Array.from({ length: 50 }, (_, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const filled = i < 35;
        return (
          <circle
            key={i}
            cx={16 + col * 10}
            cy={10 + row * 10}
            r={3.2}
            fill={filled ? BLUE : '#E8E0D4'}
            fillOpacity={filled ? 0.8 : 0.5}
          />
        );
      })}
    </>
  ),
  'span-chart': (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      {[{y:14,x1:24,x2:80},{y:26,x1:36,x2:90},{y:38,x1:18,x2:64},{y:50,x1:44,x2:96}].map((d, i) => (
        <React.Fragment key={i}>
          <line x1={d.x1} y1={d.y} x2={d.x2} y2={d.y} stroke={BLUE} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={d.x1} cy={d.y} r={3} fill={BLUE} />
          <circle cx={d.x2} cy={d.y} r={3} fill={BLUE} />
        </React.Fragment>
      ))}
    </>
  ),
  'radial-bar': (
    <>
      <circle cx={60} cy={32} r={24} fill="none" stroke="#E8E0D4" strokeWidth={4} />
      <circle cx={60} cy={32} r={24} fill="none" stroke={BLUE} strokeWidth={4} strokeDasharray="110 151" transform="rotate(-90 60 32)" strokeLinecap="round" />
      <circle cx={60} cy={32} r={17} fill="none" stroke="#E8E0D4" strokeWidth={4} />
      <circle cx={60} cy={32} r={17} fill="none" stroke={RED} strokeWidth={4} strokeDasharray="70 107" transform="rotate(-90 60 32)" strokeLinecap="round" />
      <circle cx={60} cy={32} r={10} fill="none" stroke="#E8E0D4" strokeWidth={4} />
      <circle cx={60} cy={32} r={10} fill="none" stroke={GREEN} strokeWidth={4} strokeDasharray="48 63" transform="rotate(-90 60 32)" strokeLinecap="round" />
    </>
  ),
  'nightingale-rose': (
    <>
      {[
        { angle: 0, r: 22, color: BLUE },
        { angle: 60, r: 16, color: RED },
        { angle: 120, r: 20, color: GREEN },
        { angle: 180, r: 12, color: ORANGE },
        { angle: 240, r: 24, color: '#7B68A8' },
        { angle: 300, r: 18, color: '#5DADE2' },
      ].map((seg, i) => {
        const a1 = (seg.angle - 90) * Math.PI / 180;
        const a2 = (seg.angle + 60 - 90) * Math.PI / 180;
        const cx = 60, cy = 32;
        const x1 = cx + seg.r * Math.cos(a1);
        const y1 = cy + seg.r * Math.sin(a1);
        const x2 = cx + seg.r * Math.cos(a2);
        const y2 = cy + seg.r * Math.sin(a2);
        return (
          <path
            key={i}
            d={`M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${seg.r},${seg.r} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`}
            fill={seg.color}
            fillOpacity={0.6}
            stroke="#FDF8F0"
            strokeWidth={0.5}
          />
        );
      })}
    </>
  ),
  'proportional-area': (
    <>
      <circle cx={40} cy={32} r={20} fill={BLUE} fillOpacity={0.5} />
      <circle cx={75} cy={36} r={13} fill={RED} fillOpacity={0.5} />
      <circle cx={98} cy={40} r={8} fill={GREEN} fillOpacity={0.5} />
    </>
  ),
  pictogram: (
    <>
      {Array.from({ length: 15 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const active = i < 11;
        return (
          <g key={i} transform={`translate(${18 + col * 20}, ${8 + row * 20})`}>
            <circle cx={4} cy={2} r={2.5} fill={active ? BLUE : '#E8E0D4'} />
            <path d="M0,6 Q4,5 8,6 L7,16 H1 Z" fill={active ? BLUE : '#E8E0D4'} />
          </g>
        );
      })}
    </>
  ),
  'word-cloud': (
    <>
      <text x={20} y={20} fontSize={14} fontWeight={700} fill={BLUE} fontFamily="Helvetica, sans-serif">Data</text>
      <text x={58} y={28} fontSize={10} fontWeight={600} fill={RED} fontFamily="Helvetica, sans-serif">Chart</text>
      <text x={14} y={38} fontSize={8} fill={GREEN} fontFamily="Helvetica, sans-serif">Trend</text>
      <text x={48} y={42} fontSize={12} fontWeight={700} fill={ORANGE} fontFamily="Helvetica, sans-serif">Value</text>
      <text x={86} y={18} fontSize={7} fill={BLUE} fontFamily="Helvetica, sans-serif">Viz</text>
      <text x={28} y={52} fontSize={9} fontWeight={600} fill={RED} fontFamily="Helvetica, sans-serif">Stats</text>
      <text x={68} y={54} fontSize={7} fill={GREEN} fontFamily="Helvetica, sans-serif">Plot</text>
      <text x={86} y={40} fontSize={8} fill={BLUE} fontFamily="Helvetica, sans-serif">Axis</text>
    </>
  ),

  // ── Tier 2 — Flow & Hierarchy ──
  sankey: (
    <>
      {/* Left nodes */}
      <rect x={10} y={6} width={8} height={18} fill={BLUE} rx={1} />
      <rect x={10} y={28} width={8} height={14} fill={RED} rx={1} />
      <rect x={10} y={46} width={8} height={12} fill={GREEN} rx={1} />
      {/* Right nodes */}
      <rect x={102} y={8} width={8} height={22} fill={ORANGE} rx={1} />
      <rect x={102} y={34} width={8} height={24} fill={BLUE} rx={1} />
      {/* Ribbons */}
      <path d="M18,12 C55,12 65,16 102,16" fill="none" stroke={BLUE} strokeWidth={6} strokeOpacity={0.25} />
      <path d="M18,22 C55,22 65,42 102,42" fill="none" stroke={BLUE} strokeWidth={4} strokeOpacity={0.25} />
      <path d="M18,34 C55,34 65,26 102,26" fill="none" stroke={RED} strokeWidth={5} strokeOpacity={0.25} />
      <path d="M18,50 C55,50 65,50 102,50" fill="none" stroke={GREEN} strokeWidth={4} strokeOpacity={0.25} />
    </>
  ),
  chord: (
    <>
      {/* Outer arcs */}
      <path d="M60,8 A24,24 0 0,1 84,32" fill="none" stroke={BLUE} strokeWidth={4} />
      <path d="M84,32 A24,24 0 0,1 60,56" fill="none" stroke={RED} strokeWidth={4} />
      <path d="M60,56 A24,24 0 0,1 36,32" fill="none" stroke={GREEN} strokeWidth={4} />
      <path d="M36,32 A24,24 0 0,1 60,8" fill="none" stroke={ORANGE} strokeWidth={4} />
      {/* Chords */}
      <path d="M64,9 Q60,32 82,34" fill={BLUE} fillOpacity={0.15} stroke={BLUE} strokeWidth={0.5} />
      <path d="M56,9 Q60,32 38,34" fill={ORANGE} fillOpacity={0.15} stroke={ORANGE} strokeWidth={0.5} />
      <path d="M82,36 Q60,32 62,55" fill={RED} fillOpacity={0.15} stroke={RED} strokeWidth={0.5} />
    </>
  ),
  sunburst: (
    <>
      {/* Inner ring */}
      <path d="M60,32 L60,10 A22,22 0 0,1 82,32 Z" fill={BLUE} fillOpacity={0.7} />
      <path d="M60,32 L82,32 A22,22 0 0,1 60,54 Z" fill={RED} fillOpacity={0.7} />
      <path d="M60,32 L60,54 A22,22 0 0,1 38,32 Z" fill={GREEN} fillOpacity={0.7} />
      <path d="M60,32 L38,32 A22,22 0 0,1 60,10 Z" fill={ORANGE} fillOpacity={0.7} />
      {/* Outer ring segments */}
      <path d="M60,6 A26,26 0 0,1 74,8 L70,14 A18,18 0 0,0 60,12 Z" fill={BLUE} fillOpacity={0.45} />
      <path d="M74,8 A26,26 0 0,1 86,32 L80,32 A18,18 0 0,0 70,14 Z" fill={BLUE} fillOpacity={0.35} />
      <path d="M86,32 A26,26 0 0,1 72,54 L68,48 A18,18 0 0,0 80,32 Z" fill={RED} fillOpacity={0.45} />
      <path d="M72,54 A26,26 0 0,1 60,58 L60,50 A18,18 0 0,0 68,48 Z" fill={RED} fillOpacity={0.35} />
    </>
  ),
  'circle-packing': (
    <>
      <circle cx={60} cy={32} r={28} fill="#E8E0D4" fillOpacity={0.3} stroke="#E8E0D4" strokeWidth={0.5} />
      <circle cx={48} cy={26} r={14} fill={BLUE} fillOpacity={0.35} stroke={BLUE} strokeWidth={0.8} />
      <circle cx={76} cy={30} r={10} fill={RED} fillOpacity={0.35} stroke={RED} strokeWidth={0.8} />
      <circle cx={58} cy={48} r={8} fill={GREEN} fillOpacity={0.35} stroke={GREEN} strokeWidth={0.8} />
      <circle cx={40} cy={44} r={5} fill={ORANGE} fillOpacity={0.4} stroke={ORANGE} strokeWidth={0.8} />
      <circle cx={80} cy={46} r={4} fill={BLUE} fillOpacity={0.4} />
    </>
  ),
  'tree-diagram': (
    <>
      {/* Root */}
      <circle cx={60} cy={10} r={4} fill={BLUE} />
      {/* Level 1 */}
      <line x1={60} y1={14} x2={30} y2={28} stroke="#9B9488" strokeWidth={1} />
      <line x1={60} y1={14} x2={90} y2={28} stroke="#9B9488" strokeWidth={1} />
      <circle cx={30} cy={30} r={3.5} fill={RED} />
      <circle cx={90} cy={30} r={3.5} fill={GREEN} />
      {/* Level 2 */}
      <line x1={30} y1={33} x2={18} y2={46} stroke="#9B9488" strokeWidth={0.8} />
      <line x1={30} y1={33} x2={42} y2={46} stroke="#9B9488" strokeWidth={0.8} />
      <line x1={90} y1={33} x2={78} y2={46} stroke="#9B9488" strokeWidth={0.8} />
      <line x1={90} y1={33} x2={102} y2={46} stroke="#9B9488" strokeWidth={0.8} />
      <circle cx={18} cy={48} r={3} fill={ORANGE} />
      <circle cx={42} cy={48} r={3} fill={ORANGE} />
      <circle cx={78} cy={48} r={3} fill={ORANGE} />
      <circle cx={102} cy={48} r={3} fill={ORANGE} />
    </>
  ),

  // ── Tier 2 — Network & Multi-axis ──
  'network-diagram': (
    <>
      {/* Edges */}
      <line x1={36} y1={20} x2={82} y2={22} stroke="#D4CEC4" strokeWidth={1} />
      <line x1={36} y1={20} x2={56} y2={48} stroke="#D4CEC4" strokeWidth={1} />
      <line x1={82} y1={22} x2={56} y2={48} stroke="#D4CEC4" strokeWidth={1} />
      <line x1={82} y1={22} x2={100} y2={46} stroke="#D4CEC4" strokeWidth={1} />
      <line x1={56} y1={48} x2={22} y2={50} stroke="#D4CEC4" strokeWidth={1} />
      {/* Nodes */}
      <circle cx={36} cy={20} r={6} fill={BLUE} fillOpacity={0.8} />
      <circle cx={82} cy={22} r={8} fill={RED} fillOpacity={0.8} />
      <circle cx={56} cy={48} r={5} fill={GREEN} fillOpacity={0.8} />
      <circle cx={100} cy={46} r={4} fill={ORANGE} fillOpacity={0.8} />
      <circle cx={22} cy={50} r={3.5} fill={BLUE} fillOpacity={0.8} />
    </>
  ),
  'parallel-coordinates': (
    <>
      {/* Axes */}
      {[20, 40, 60, 80, 100].map((x) => (
        <line key={x} x1={x} y1={8} x2={x} y2={56} stroke="#E8E0D4" strokeWidth={0.8} />
      ))}
      {/* Data lines */}
      <polyline points="20,14 40,30 60,18 80,42 100,24" fill="none" stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.7} />
      <polyline points="20,38 40,18 60,44 80,14 100,36" fill="none" stroke={RED} strokeWidth={1.5} strokeOpacity={0.7} />
      <polyline points="20,26 40,40 60,30 80,28 100,48" fill="none" stroke={GREEN} strokeWidth={1.5} strokeOpacity={0.7} />
      <polyline points="20,48 40,24 60,36 80,50 100,16" fill="none" stroke={ORANGE} strokeWidth={1.5} strokeOpacity={0.7} />
    </>
  ),
  'stream-graph': (
    <>
      {/* Streams */}
      <path d="M10,32 C30,24 50,20 70,22 C90,24 100,28 110,30 L110,34 C100,36 90,38 70,40 C50,42 30,40 10,32 Z" fill={BLUE} fillOpacity={0.5} />
      <path d="M10,32 C30,28 50,18 70,16 C90,14 100,20 110,24 L110,30 C100,28 90,24 70,22 C50,20 30,24 10,32 Z" fill={RED} fillOpacity={0.5} />
      <path d="M10,32 C30,36 50,44 70,46 C90,48 100,42 110,40 L110,34 C100,36 90,38 70,40 C50,42 30,40 10,32 Z" fill={GREEN} fillOpacity={0.5} />
      <path d="M10,32 C30,32 50,14 70,10 C90,8 100,14 110,18 L110,24 C100,20 90,14 70,16 C50,18 30,28 10,32 Z" fill={ORANGE} fillOpacity={0.4} />
    </>
  ),
  'arc-diagram': (
    <>
      {/* Baseline */}
      <line x1={10} y1={50} x2={110} y2={50} stroke="#E8E0D4" strokeWidth={0.8} />
      {/* Arcs */}
      <path d="M20,50 A20,20 0 0,1 60,50" fill="none" stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.5} />
      <path d="M40,50 A30,30 0 0,1 100,50" fill="none" stroke={RED} strokeWidth={1.5} strokeOpacity={0.5} />
      <path d="M60,50 A10,10 0 0,1 80,50" fill="none" stroke={GREEN} strokeWidth={1.5} strokeOpacity={0.5} />
      {/* Nodes */}
      {[20, 40, 60, 80, 100].map((cx, i) => (
        <circle key={i} cx={cx} cy={50} r={3.5} fill={[BLUE, RED, GREEN, ORANGE, BLUE][i]} />
      ))}
    </>
  ),
  marimekko: (
    <>
      <line x1={10} y1={58} x2={110} y2={58} stroke="#E8E0D4" strokeWidth={0.5} />
      {/* Variable-width columns */}
      <rect x={10} y={28} width={32} height={30} fill={BLUE} fillOpacity={0.7} />
      <rect x={10} y={8} width={32} height={20} fill={RED} fillOpacity={0.7} />
      <rect x={44} y={20} width={24} height={38} fill={BLUE} fillOpacity={0.7} />
      <rect x={44} y={8} width={24} height={12} fill={RED} fillOpacity={0.7} />
      <rect x={70} y={32} width={40} height={26} fill={BLUE} fillOpacity={0.7} />
      <rect x={70} y={14} width={40} height={18} fill={RED} fillOpacity={0.7} />
      <rect x={70} y={8} width={40} height={6} fill={GREEN} fillOpacity={0.7} />
    </>
  ),

  // ── Tier 2 — Stats & Timeline ──
  'venn-diagram': (
    <>
      <circle cx={46} cy={30} r={20} fill={BLUE} fillOpacity={0.25} stroke={BLUE} strokeWidth={1.2} />
      <circle cx={74} cy={30} r={20} fill={RED} fillOpacity={0.25} stroke={RED} strokeWidth={1.2} />
      <circle cx={60} cy={46} r={16} fill={GREEN} fillOpacity={0.2} stroke={GREEN} strokeWidth={1} />
    </>
  ),
  'density-plot': (
    <>
      <line x1={10} y1={56} x2={110} y2={56} stroke="#E8E0D4" strokeWidth={0.5} />
      <path d="M10,56 C20,56 30,52 40,40 C50,24 55,12 60,12 C65,12 70,20 80,36 C90,48 100,54 110,56 Z" fill={BLUE} fillOpacity={0.2} stroke={BLUE} strokeWidth={1.5} />
      <path d="M10,56 C25,56 40,50 50,42 C60,30 65,22 72,22 C78,22 85,32 95,46 C100,52 105,55 110,56 Z" fill={RED} fillOpacity={0.15} stroke={RED} strokeWidth={1.5} strokeDasharray="3,2" />
    </>
  ),
  gantt: (
    <>
      {/* Grid */}
      {[25, 50, 75, 100].map((x) => (
        <line key={x} x1={x} y1={4} x2={x} y2={60} stroke="#E8E0D4" strokeWidth={0.5} />
      ))}
      {/* Task bars */}
      <rect x={14} y={8} width={40} height={7} fill={BLUE} rx={2} />
      <rect x={34} y={20} width={36} height={7} fill={RED} rx={2} />
      <rect x={54} y={32} width={30} height={7} fill={GREEN} rx={2} />
      <rect x={64} y={44} width={38} height={7} fill={ORANGE} rx={2} />
    </>
  ),
  timeline: (
    <>
      {/* Central line */}
      <line x1={60} y1={6} x2={60} y2={58} stroke="#E8E0D4" strokeWidth={1.5} />
      {/* Events alternating sides */}
      <circle cx={60} cy={12} r={3} fill={BLUE} />
      <line x1={63} y1={12} x2={85} y2={12} stroke={BLUE} strokeWidth={0.8} />
      <rect x={85} y={8} width={22} height={8} fill={BLUE} fillOpacity={0.15} rx={2} />
      <circle cx={60} cy={28} r={3} fill={RED} />
      <line x1={57} y1={28} x2={35} y2={28} stroke={RED} strokeWidth={0.8} />
      <rect x={13} y={24} width={22} height={8} fill={RED} fillOpacity={0.15} rx={2} />
      <circle cx={60} cy={44} r={3} fill={GREEN} />
      <line x1={63} y1={44} x2={85} y2={44} stroke={GREEN} strokeWidth={0.8} />
      <rect x={85} y={40} width={22} height={8} fill={GREEN} fillOpacity={0.15} rx={2} />
    </>
  ),
  'error-bars': (
    <>
      <line x1={10} y1={56} x2={110} y2={56} stroke="#E8E0D4" strokeWidth={0.5} />
      {[{x:22,h:30,e:10},{x:46,h:36,e:8},{x:70,h:24,e:12},{x:94,h:32,e:6}].map((d, i) => (
        <React.Fragment key={i}>
          <rect x={d.x - 8} y={56 - d.h} width={16} height={d.h} fill={BLUE} fillOpacity={0.6} rx={1} />
          {/* Whisker */}
          <line x1={d.x} y1={56 - d.h - d.e} x2={d.x} y2={56 - d.h + 2} stroke="#2D2A26" strokeWidth={1.2} />
          <line x1={d.x - 4} y1={56 - d.h - d.e} x2={d.x + 4} y2={56 - d.h - d.e} stroke="#2D2A26" strokeWidth={1.2} />
        </React.Fragment>
      ))}
    </>
  ),

  // ── Maps ──
  'choropleth-map': (
    <>
      <rect x={8} y={6} width={104} height={52} fill="#F0EBE2" rx={2} />
      {/* Simplified continent shapes */}
      <rect x={20} y={14} width={20} height={28} fill={BLUE} fillOpacity={0.3} rx={2} />
      <rect x={44} y={10} width={18} height={20} fill={BLUE} fillOpacity={0.7} rx={2} />
      <rect x={44} y={32} width={14} height={18} fill={BLUE} fillOpacity={0.4} rx={2} />
      <rect x={66} y={12} width={24} height={22} fill={BLUE} fillOpacity={0.55} rx={2} />
      <rect x={94} y={34} width={14} height={16} fill={BLUE} fillOpacity={0.2} rx={2} />
      {/* Legend bar */}
      <defs><linearGradient id="cg"><stop offset="0%" stopColor={BLUE} stopOpacity={0.15} /><stop offset="100%" stopColor={BLUE} stopOpacity={0.9} /></linearGradient></defs>
      <rect x={30} y={54} width={60} height={4} fill="url(#cg)" rx={1} />
    </>
  ),
  'bubble-map': (
    <>
      <rect x={8} y={6} width={104} height={52} fill="#F0EBE2" rx={2} />
      <circle cx={30} cy={28} r={10} fill={BLUE} fillOpacity={0.4} />
      <circle cx={54} cy={22} r={6} fill={RED} fillOpacity={0.4} />
      <circle cx={78} cy={24} r={12} fill={GREEN} fillOpacity={0.35} />
      <circle cx={52} cy={40} r={4} fill={ORANGE} fillOpacity={0.5} />
      <circle cx={98} cy={42} r={5} fill={BLUE} fillOpacity={0.4} />
    </>
  ),
  'dot-map': (
    <>
      <rect x={8} y={6} width={104} height={52} fill="#F0EBE2" rx={2} />
      {[
        [26,22],[28,26],[32,24],[30,28],[24,28],
        [50,18],[52,22],[54,20],
        [74,20],[76,24],[78,22],[72,26],[80,18],
        [50,38],[48,42],
        [96,40],[94,44],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.8} fill={RED} fillOpacity={0.7} />
      ))}
    </>
  ),
  'connection-map': (
    <>
      <rect x={8} y={6} width={104} height={52} fill="#F0EBE2" rx={2} />
      {/* Arcs between locations */}
      <path d="M30,28 Q55,6 78,22" fill="none" stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.6} />
      <path d="M30,28 Q50,16 52,20" fill="none" stroke={RED} strokeWidth={1} strokeOpacity={0.5} />
      <path d="M78,22 Q88,30 96,42" fill="none" stroke={GREEN} strokeWidth={1} strokeOpacity={0.5} />
      <path d="M52,20 Q40,32 50,40" fill="none" stroke={ORANGE} strokeWidth={1} strokeOpacity={0.5} />
      {/* Endpoints */}
      <circle cx={30} cy={28} r={3} fill={BLUE} />
      <circle cx={52} cy={20} r={2.5} fill={RED} />
      <circle cx={78} cy={22} r={3} fill={GREEN} />
      <circle cx={96} cy={42} r={2.5} fill={GREEN} />
      <circle cx={50} cy={40} r={2} fill={ORANGE} />
    </>
  ),
  'flow-map': (
    <>
      <rect x={8} y={6} width={104} height={52} fill="#F0EBE2" rx={2} />
      {/* Flow arrows */}
      <path d="M30,28 Q55,8 76,22" fill="none" stroke={BLUE} strokeWidth={3} strokeOpacity={0.4} />
      <path d="M30,28 Q45,36 52,40" fill="none" stroke={RED} strokeWidth={2} strokeOpacity={0.4} />
      <path d="M78,22 Q86,28 96,42" fill="none" stroke={GREEN} strokeWidth={1.5} strokeOpacity={0.4} />
      {/* Arrowheads */}
      <polygon points="76,22 72,18 72,26" fill={BLUE} fillOpacity={0.6} />
      <polygon points="52,40 48,36 48,44" fill={RED} fillOpacity={0.6} />
      <polygon points="96,42 92,38 92,46" fill={GREEN} fillOpacity={0.6} />
      {/* Source dots */}
      <circle cx={30} cy={28} r={3.5} fill={BLUE} fillOpacity={0.7} />
      <circle cx={78} cy={22} r={2.5} fill={GREEN} fillOpacity={0.7} />
    </>
  ),
};

interface ChartThumbnailProps {
  typeId: ChartTypeId;
  width?: number;
  height?: number;
}

const ChartThumbnail: React.FC<ChartThumbnailProps> = ({ typeId, width = 120, height = 64 }) => {
  const content = thumbnails[typeId];

  if (!content) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill="#F5F0E8" rx={4} />
        <text x={W / 2} y={H / 2 + 4} textAnchor="middle" fontSize={10} fill="#9B9488" fontFamily="Helvetica, sans-serif">
          {typeId}
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', borderRadius: 4, background: '#FAF6EE' }}
    >
      {content}
    </svg>
  );
};

export default ChartThumbnail;
