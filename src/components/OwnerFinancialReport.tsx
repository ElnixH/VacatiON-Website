// src/components/OwnerFinancialReport.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface YearlyData {
  revenue: string;
  revenueNum: number;
  potentialNum: number;
  occupancy: string;
  occupancyNum: number;
  adr: string;
  adrNum: number;
  duration: string;
  durationNum: number;
  confirmedReservations: number;
  cancelledReservations: number;
  revenueDiff: string;
  occupancyDiff: string;
  adrDiff: string;
  durationDiff: string;
  actualMonthly: number[];
  potentialMonthly: number[];
  createdMonthly: number[];
  staysMonthly: number[];
  cancelledMonthly: number[];
  cancelledStaysMonthly: number[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const REPORT_DATA: Record<string, YearlyData> = {
  '2026': {
    revenue: '€18,450',
    revenueNum: 18450,
    potentialNum: 24000,
    occupancy: '68.4%',
    occupancyNum: 68.4,
    adr: '€142',
    adrNum: 142,
    duration: '4.6 nights',
    durationNum: 4.6,
    confirmedReservations: 43,
    cancelledReservations: 4,
    revenueDiff: '12.8%',
    occupancyDiff: '6.2%',
    adrDiff: '4.4%',
    durationDiff: '9.5%',
    actualMonthly: [0, 0, 0, 450, 850, 2600, 5100, 5700, 3750, 0, 0, 0],
    potentialMonthly: [0, 0, 0, 700, 1300, 3400, 5900, 6500, 6200, 0, 0, 0],
    createdMonthly: [2, 3, 4, 5, 8, 10, 11, 9, 7, 3, 2, 1],
    staysMonthly: [1, 2, 3, 4, 7, 9, 12, 11, 8, 4, 2, 1],
    cancelledMonthly: [0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    cancelledStaysMonthly: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  },
  '2025': {
    revenue: '€18,450',
    revenueNum: 18450,
    potentialNum: 24000,
    occupancy: '68.4%',
    occupancyNum: 68.4,
    adr: '€142',
    adrNum: 142,
    duration: '4.6 nights',
    durationNum: 4.6,
    confirmedReservations: 43,
    cancelledReservations: 4,
    revenueDiff: '12.8%',
    occupancyDiff: '6.2%',
    adrDiff: '4.4%',
    durationDiff: '9.5%',
    actualMonthly: [0, 0, 0, 450, 850, 2600, 5100, 5700, 3750, 0, 0, 0],
    potentialMonthly: [0, 0, 0, 700, 1300, 3400, 5900, 6500, 6200, 0, 0, 0],
    createdMonthly: [2, 3, 4, 5, 8, 10, 11, 9, 7, 3, 2, 1],
    staysMonthly: [1, 2, 3, 4, 7, 9, 12, 11, 8, 4, 2, 1],
    cancelledMonthly: [0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    cancelledStaysMonthly: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  },
  '2024': {
    revenue: '€16,350',
    revenueNum: 16350,
    potentialNum: 22500,
    occupancy: '64.4%',
    occupancyNum: 64.4,
    adr: '€136',
    adrNum: 136,
    duration: '4.2 nights',
    durationNum: 4.2,
    confirmedReservations: 39,
    cancelledReservations: 5,
    revenueDiff: '8.1%',
    occupancyDiff: '4.0%',
    adrDiff: '3.1%',
    durationDiff: '5.0%',
    actualMonthly: [0, 0, 0, 380, 720, 2300, 4600, 5100, 3250, 0, 0, 0],
    potentialMonthly: [0, 0, 0, 650, 1200, 3100, 5500, 6100, 5950, 0, 0, 0],
    createdMonthly: [1, 2, 4, 4, 7, 9, 10, 8, 6, 3, 1, 1],
    staysMonthly: [1, 1, 3, 3, 6, 8, 11, 10, 7, 3, 2, 1],
    cancelledMonthly: [0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    cancelledStaysMonthly: [0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  },
};

interface BarDataset {
  data: number[];
  color: string;
}

export const OwnerFinancialReport: React.FC = () => {
  const [period, setPeriod] = useState<'2026' | '2025' | '2024'>('2026');
  const [yearA, setYearA] = useState<'2026' | '2025' | '2024'>('2025');
  const [yearB, setYearB] = useState<'2026' | '2025' | '2024'>('2024');
  const [activeNav, setActiveNav] = useState<string>('Financial reports');

  const revenueCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const createdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cancelCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentData = REPORT_DATA[period];

  const realisedPct = useMemo(() => {
    if (!currentData.potentialNum) return 0;
    return Number(((currentData.revenueNum / currentData.potentialNum) * 100).toFixed(1));
  }, [currentData]);

  const drawBars = useCallback(
    (canvas: HTMLCanvasElement | null, sets: BarDataset[], max: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.clientWidth || 400;
      const h = 220;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const left = 30;
      const right = 8;
      const top = 12;
      const bottom = 28;
      const ph = h - top - bottom;
      const pw = w - left - right;

      ctx.font = '10px Inter, Arial, sans-serif';
      for (let i = 0; i < 4; i++) {
        const y = top + (ph * i) / 3;
        ctx.strokeStyle = '#344954';
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(w - right, y);
        ctx.stroke();

        ctx.fillStyle = '#A9BAC2';
        ctx.textAlign = 'left';
        const labelVal =
          max >= 1000
            ? ((max * (1 - i / 3)) / 1000).toFixed(0) + 'k'
            : String(Math.round(max * (1 - i / 3)));
        ctx.fillText(labelVal, 2, y + 3);
      }

      const group = pw / 12;
      const bw = Math.min(11, group / (sets.length + 1));

      MONTHS.forEach((m, i) => {
        sets.forEach((s, j) => {
          const val = s.data[i];
          const bh = (val / max) * ph;
          const x =
            left +
            i * group +
            group / 2 +
            (j - (sets.length - 1) / 2) * (bw + 2) -
            bw / 2;
          ctx.fillStyle = s.color;
          ctx.fillRect(x, top + ph - bh, bw, bh);
        });
        ctx.fillStyle = '#A9BAC2';
        ctx.textAlign = 'center';
        ctx.fillText(m, left + i * group + group / 2, h - 8);
      });
    },
    []
  );

  const renderAllCharts = useCallback(() => {
    drawBars(
      revenueCanvasRef.current,
      [
        { data: currentData.actualMonthly, color: '#2F8FA3' },
        { data: currentData.potentialMonthly, color: '#536873' },
      ],
      7000
    );
    drawBars(
      createdCanvasRef.current,
      [
        { data: currentData.createdMonthly, color: '#82949d' },
        { data: currentData.staysMonthly, color: '#2F8FA3' },
      ],
      14
    );
    drawBars(
      cancelCanvasRef.current,
      [
        { data: currentData.cancelledMonthly, color: '#82949d' },
        { data: currentData.cancelledStaysMonthly, color: '#E47777' },
      ],
      4
    );
  }, [currentData, drawBars]);

  useEffect(() => {
    renderAllCharts();
    window.addEventListener('resize', renderAllCharts);
    return () => window.removeEventListener('resize', renderAllCharts);
  }, [renderAllCharts]);

  const handleYearAChange = (val: '2026' | '2025' | '2024') => {
    if (val === yearB) {
      alert('Please select two different years.');
      return;
    }
    setYearA(val);
  };

  const handleYearBChange = (val: '2026' | '2025' | '2024') => {
    if (val === yearA) {
      alert('Please select two different years.');
      return;
    }
    setYearB(val);
  };

  const downloadCSV = () => {
    const rows = [
      ['Month', 'Actual revenue', 'Potential revenue', 'Occupancy', 'Reservations'],
      ...MONTHS.map((m, i) => [
        m,
        currentData.actualMonthly[i],
        currentData.potentialMonthly[i],
        currentData.potentialMonthly[i]
          ? Math.round((currentData.actualMonthly[i] / currentData.potentialMonthly[i]) * 100) + '%'
          : '0%',
        currentData.createdMonthly[i],
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vacation-owner-financial-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const dataA = REPORT_DATA[yearA];
  const dataB = REPORT_DATA[yearB];

  return (
    <div className="owner-report-root">
      <style>{`
        .owner-report-root {
          --bg: #16232D;
          --surface: #20333E;
          --surface2: #263D47;
          --line: #344954;
          --teal: #2F8FA3;
          --text: #F4F8FA;
          --muted: #A9BAC2;
          --green: #39B982;
          --red: #E47777;
          --grey: #B8C5CB;
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, Arial, sans-serif;
          min-height: 100vh;
        }
        .owner-report-root * { box-sizing: border-box; }
        .owner-report-root .app { display: flex; min-height: 100vh; }
        .owner-report-root .sidebar { width: 235px; background: #111D25; border-right: 1px solid var(--line); padding: 28px 18px; flex-shrink: 0; }
        .owner-report-root .logo { font-size: 26px; font-weight: 800; letter-spacing: -1px; margin: 4px 10px; color: var(--text); }
        .owner-report-root .logo span { color: var(--teal); }
        .owner-report-root .tagline { font-size: 10px; letter-spacing: 2px; color: #81949d; margin: 5px 10px 42px; text-transform: uppercase; }
        .owner-report-root .nav-label { font-size: 10px; letter-spacing: 1.5px; color: #71858e; margin: 0 10px 12px; }
        .owner-report-root .nav a { display: block; color: var(--muted); text-decoration: none; padding: 13px 12px; border-radius: 8px; margin: 4px 0; font-size: 13px; cursor: pointer; }
        .owner-report-root .nav a.active { background: #203B47; color: white; border: 1px solid #315766; }
        .owner-report-root .profile { margin-top: 45px; border-top: 1px solid var(--line); padding: 20px 10px; font-size: 12px; color: var(--muted); }
        .owner-report-root .avatar { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #2F7180; color: white; margin-right: 9px; }
        .owner-report-root main { flex: 1; min-width: 0; max-width: 1500px; margin: auto; padding: 32px 38px 50px; }
        .owner-report-root .top { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 26px; }
        .owner-report-root .eyebrow { font-size: 10px; letter-spacing: 2px; color: #7FAEBA; text-transform: uppercase; }
        .owner-report-root h1 { font-size: 28px; margin: 9px 0; font-weight: 700; }
        .owner-report-root .sub { font-size: 13px; color: var(--muted); }
        .owner-report-root .actions { display: flex; gap: 9px; }
        .owner-report-root button, .owner-report-root select { background: var(--surface2); border: 1px solid #405761; color: white; padding: 10px 13px; border-radius: 8px; font-size: 12px; cursor: pointer; }
        .owner-report-root button.primary { background: var(--teal); border-color: var(--teal); }
        .owner-report-root .property { background: linear-gradient(110deg, #244553, #20333E); border: 1px solid #365765; border-radius: 12px; padding: 17px 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .owner-report-root .property-name { font-size: 14px; font-weight: 700; }
        .owner-report-root .property-meta { font-size: 11px; color: var(--muted); margin-top: 5px; }
        .owner-report-root .status { font-size: 10px; color: var(--green); background: #183D37; padding: 7px 10px; border-radius: 20px; }
        .owner-report-root .section { margin: 29px 0 13px; }
        .owner-report-root .section h2 { font-size: 15px; margin: 0 0 5px; font-weight: 600; }
        .owner-report-root .section p { font-size: 11px; color: var(--muted); margin: 0; }
        .owner-report-root .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
        .owner-report-root .card, .owner-report-root .chart { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 18px; min-width: 0; }
        .owner-report-root .label { font-size: 11px; color: var(--muted); margin-bottom: 14px; }
        .owner-report-root .value { font-size: 25px; font-weight: 750; letter-spacing: -0.5px; }
        .owner-report-root .foot { font-size: 10px; color: var(--muted); margin-top: 11px; }
        .owner-report-root .good { color: var(--green) !important; }
        .owner-report-root .bad { color: var(--red) !important; }
        .owner-report-root .neutral { color: var(--grey) !important; }
        .owner-report-root .pill { display: inline-block; background: rgba(57, 185, 130, 0.13); color: var(--green); border-radius: 20px; padding: 4px 7px; margin-right: 5px; }
        .owner-report-root .pill.bad { background: rgba(228, 119, 119, 0.13); }
        .owner-report-root .charts { display: grid; grid-template-columns: 1.3fr 1fr; gap: 13px; }
        .owner-report-root .chart-title { font-size: 13px; font-weight: 650; }
        .owner-report-root .chart-sub { font-size: 10px; color: var(--muted); margin-top: 5px; }
        .owner-report-root canvas { width: 100%; height: 220px; display: block; margin-top: 15px; }
        .owner-report-root .legend { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 10px; font-size: 10px; color: var(--muted); }
        .owner-report-root .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
        .owner-report-root .donut-wrap { display: flex; align-items: center; gap: 22px; min-height: 220px; }
        .owner-report-root .donut { width: 145px; height: 145px; border-radius: 50%; position: relative; display: grid; place-items: center; flex-shrink: 0; }
        .owner-report-root .donut:before { content: ""; position: absolute; inset: 19px; background: var(--surface); border-radius: 50%; }
        .owner-report-root .donut-center { position: relative; text-align: center; font-size: 23px; font-weight: 750; }
        .owner-report-root .donut-center small { display: block; font-size: 10px; color: var(--muted); font-weight: 400; margin-top: 4px; }
        .owner-report-root .donut-info { font-size: 11px; color: var(--muted); line-height: 2; }
        .owner-report-root .donut-info strong { display: block; color: white; font-size: 16px; }
        .owner-report-root .table-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 15px; overflow-x: auto; }
        .owner-report-root table { width: 100%; border-collapse: collapse; min-width: 570px; font-size: 11px; }
        .owner-report-root th { text-align: left; color: var(--muted); font-weight: 500; padding: 13px 10px; border-bottom: 1px solid #405761; }
        .owner-report-root td { padding: 13px 10px; border-bottom: 1px solid var(--line); color: #E7EEF1; }
        .owner-report-root .num { text-align: right; font-variant-numeric: tabular-nums; }
        .owner-report-root .comparison { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 17px; }
        .owner-report-root .compare-controls { display: flex; gap: 8px; align-items: center; }
        .owner-report-root .compare-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 14px 0; }
        .owner-report-root .compare-kpi { background: var(--surface2); border: 1px solid #405761; border-radius: 9px; padding: 14px; }
        .owner-report-root .compare-kpi span { font-size: 10px; color: var(--muted); }
        .owner-report-root .compare-kpi strong { display: block; font-size: 20px; margin: 8px 0; }
        .owner-report-root .note { font-size: 10px; color: #82959e; line-height: 1.6; margin-top: 18px; }
        .owner-report-root footer { border-top: 1px solid var(--line); margin-top: 28px; padding-top: 16px; color: #81949d; font-size: 10px; display: flex; justify-content: space-between; }
        @media (max-width: 1000px) {
          .owner-report-root .sidebar { width: 190px; }
          .owner-report-root main { padding: 25px 20px; }
          .owner-report-root .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .owner-report-root .app { display: block; }
          .owner-report-root .sidebar { width: 100%; padding: 15px 18px; }
          .owner-report-root .tagline, .owner-report-root .nav-label, .owner-report-root .nav, .owner-report-root .profile { display: none; }
          .owner-report-root main { padding: 20px 14px; }
          .owner-report-root .top { align-items: flex-start; flex-direction: column; }
          .owner-report-root .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
          .owner-report-root .card { padding: 13px; }
          .owner-report-root .value { font-size: 20px; }
          .owner-report-root .charts { grid-template-columns: 1fr; }
          .owner-report-root .property { align-items: flex-start; flex-direction: column; }
          .owner-report-root .compare-grid { grid-template-columns: 1fr 1fr; }
        }
        @media print {
          .owner-report-root { background: #16232D !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .owner-report-root .sidebar { display: none; }
          .owner-report-root main { padding: 15px; }
          .owner-report-root button { display: none; }
          .owner-report-root .card, .owner-report-root .chart, .owner-report-root .comparison { break-inside: avoid; }
        }
      `}</style>

      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            vacati<span>ON</span>
          </div>
          <div className="tagline">Owner portal</div>
          <div className="nav-label">Workspace</div>
          <nav className="nav">
            {[
              { icon: '⌂', label: 'Overview' },
              { icon: '▦', label: 'My properties' },
              { icon: '▤', label: 'Reservations' },
              { icon: '▦', label: 'Calendar' },
              { icon: '◷', label: 'Financial reports' },
              { icon: '♧', label: 'Documents' },
              { icon: '♡', label: 'Support' },
            ].map((item) => (
              <a
                key={item.label}
                className={activeNav === item.label ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.label);
                }}
                href={`#${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.icon} &nbsp; {item.label}
              </a>
            ))}
          </nav>
          <div className="profile">
            <div className="avatar">G</div>
            <strong style={{ color: 'white' }}>Guest Owner</strong>
            <br />
            Property owner
          </div>
        </aside>

        <main>
          <div className="top">
            <div>
              <div className="eyebrow">Owner portal / Financials</div>
              <h1>Financial Overview</h1>
              <div className="sub">A clear view of your property's performance.</div>
            </div>
            <div className="actions">
              <button onClick={() => window.print()}>↓ Export PDF</button>
              <button className="primary" onClick={downloadCSV}>
                ↓ Export CSV
              </button>
            </div>
          </div>

          <div className="property">
            <div>
              <div className="property-name">Villa Leonora</div>
              <div className="property-meta">Tinos, Cyclades · 3 bedrooms · 6 guests</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="status">● Active property</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as '2026' | '2025' | '2024')}
              >
                <option value="2026">2026 · Year to date</option>
                <option value="2025">2025 · Full year</option>
                <option value="2024">2024 · Full year</option>
              </select>
            </div>
          </div>

          <div className="section">
            <h2>Performance at a glance</h2>
            <p>Key indicators for the selected reporting period</p>
          </div>
          <div className="grid">
            <div className="card">
              <div className="label">Actual Revenue</div>
              <div className="value">{currentData.revenue}</div>
              <div className="foot">
                <span className="pill">↗ {currentData.revenueDiff}</span> vs previous year
              </div>
            </div>
            <div className="card">
              <div className="label">Occupancy Rate</div>
              <div className="value">{currentData.occupancy}</div>
              <div className="foot">
                <span className="pill">↗ {currentData.occupancyDiff}</span> vs previous year
              </div>
            </div>
            <div className="card">
              <div className="label">Average Nightly Rate</div>
              <div className="value">{currentData.adr}</div>
              <div className="foot">
                <span className="pill">↗ {currentData.adrDiff}</span> vs previous year
              </div>
            </div>
            <div className="card">
              <div className="label">Average Booking Duration</div>
              <div className="value">{currentData.duration}</div>
              <div className="foot">
                <span className="pill">↗ {currentData.durationDiff}</span> vs previous year
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Revenue performance</h2>
            <p>Actual revenue compared with estimated revenue potential</p>
          </div>
          <div className="charts">
            <div className="chart">
              <div className="chart-title">Monthly Property Performance</div>
              <div className="chart-sub">Actual revenue vs estimated potential · EUR</div>
              <canvas ref={revenueCanvasRef} />
              <div className="legend">
                <span>
                  <i className="dot" style={{ background: '#2F8FA3' }} />
                  Actual revenue
                </span>
                <span>
                  <i className="dot" style={{ background: '#536873' }} />
                  Revenue potential
                </span>
              </div>
            </div>
            <div className="chart">
              <div className="chart-title">Revenue Potential</div>
              <div className="chart-sub">Realised revenue for the selected period</div>
              <div className="donut-wrap">
                <div
                  className="donut"
                  style={{
                    background: `conic-gradient(var(--teal) 0 ${realisedPct}%, #405761 ${realisedPct}% 100%)`,
                  }}
                >
                  <div className="donut-center">
                    {realisedPct}%<small>realised</small>
                  </div>
                </div>
                <div className="donut-info">
                  <strong>{currentData.revenue}</strong>Actual revenue
                  <strong>€{currentData.potentialNum.toLocaleString('en-US')}</strong>Estimated potential
                  <span>Based on available nights and estimated nightly rates</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Reservations activity</h2>
            <p>Bookings created and stays scheduled are measured separately</p>
          </div>
          <div className="charts">
            <div className="chart">
              <div className="chart-title">Reservations Created</div>
              <div className="chart-sub">
                When the reservation was made vs when the stay takes place
              </div>
              <canvas ref={createdCanvasRef} />
              <div className="legend">
                <span>
                  <i className="dot" style={{ background: '#82949d' }} />
                  Bookings created
                </span>
                <span>
                  <i className="dot" style={{ background: '#2F8FA3' }} />
                  Stays scheduled
                </span>
              </div>
            </div>
            <div className="chart">
              <div className="chart-title">Cancelled Reservations</div>
              <div className="chart-sub">
                When cancellation happened vs originally scheduled stay month
              </div>
              <canvas ref={cancelCanvasRef} />
              <div className="legend">
                <span>
                  <i className="dot" style={{ background: '#82949d' }} />
                  Cancellations made
                </span>
                <span>
                  <i className="dot" style={{ background: '#E47777' }} />
                  Cancelled stays
                </span>
              </div>
            </div>
          </div>

          <div
            className="section"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2>Year-over-year comparison</h2>
              <p>Compare the property's performance across reporting periods</p>
            </div>
            <div className="compare-controls">
              <select
                value={yearA}
                onChange={(e) => handleYearAChange(e.target.value as '2026' | '2025' | '2024')}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <span style={{ color: 'var(--muted)' }}>vs</span>
              <select
                value={yearB}
                onChange={(e) => handleYearBChange(e.target.value as '2026' | '2025' | '2024')}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          <div className="comparison">
            <div className="compare-grid">
              <div className="compare-kpi">
                <span>Actual Revenue</span>
                <strong>{dataA.revenue}</strong>
                <div className="good">↑ 12.8%</div>
              </div>
              <div className="compare-kpi">
                <span>Occupancy Rate</span>
                <strong>{dataA.occupancy}</strong>
                <div className="good">↑ 6.2%</div>
              </div>
              <div className="compare-kpi">
                <span>Cancellations</span>
                <strong>{dataA.cancelledReservations}</strong>
                <div className="good">↓ 20.0%</div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Performance metric</th>
                    <th className="num">{yearB}</th>
                    <th className="num">{yearA}</th>
                    <th className="num">Change</th>
                    <th className="num">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Actual Revenue</td>
                    <td className="num">{dataB.revenue}</td>
                    <td className="num">{dataA.revenue}</td>
                    <td className="num good">+12.8%</td>
                    <td className="num good">Improved</td>
                  </tr>
                  <tr>
                    <td>Occupancy Rate</td>
                    <td className="num">{dataB.occupancy}</td>
                    <td className="num">{dataA.occupancy}</td>
                    <td className="num good">+6.2%</td>
                    <td className="num good">Improved</td>
                  </tr>
                  <tr>
                    <td>Average Nightly Rate</td>
                    <td className="num">{dataB.adr}</td>
                    <td className="num">{dataA.adr}</td>
                    <td className="num good">+4.4%</td>
                    <td className="num good">Improved</td>
                  </tr>
                  <tr>
                    <td>Average Booking Duration</td>
                    <td className="num">{dataB.duration}</td>
                    <td className="num">{dataA.duration}</td>
                    <td className="num good">+9.5%</td>
                    <td className="num good">Improved</td>
                  </tr>
                  <tr>
                    <td>Confirmed Reservations</td>
                    <td className="num">{dataB.confirmedReservations}</td>
                    <td className="num">{dataA.confirmedReservations}</td>
                    <td className="num good">+10.3%</td>
                    <td className="num good">Improved</td>
                  </tr>
                  <tr>
                    <td>Cancelled Reservations</td>
                    <td className="num">{dataB.cancelledReservations}</td>
                    <td className="num">{dataA.cancelledReservations}</td>
                    <td className="num good">−20.0%</td>
                    <td className="num good">Improved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2>Monthly financial summary</h2>
            <p>Illustrative monthly figures · EUR</p>
          </div>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="num">Actual revenue</th>
                  <th className="num">Potential revenue</th>
                  <th className="num">Occupancy</th>
                  <th className="num">Reservations</th>
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((m, i) => {
                  const occ = currentData.potentialMonthly[i]
                    ? Math.round(
                        (currentData.actualMonthly[i] / currentData.potentialMonthly[i]) * 100
                      )
                    : 0;
                  return (
                    <tr key={m}>
                      <td>{m}</td>
                      <td className="num">€{currentData.actualMonthly[i].toLocaleString('en-US')}</td>
                      <td className="num">
                        €{currentData.potentialMonthly[i].toLocaleString('en-US')}
                      </td>
                      <td className="num">{occ}%</td>
                      <td className="num">{currentData.createdMonthly[i]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="note">
            Illustrative demo data for presentation purposes only. In the live owner portal, figures
            will be calculated from confirmed reservations, stay dates, availability, nightly rates
            and cancellation records. Revenue figures represent property performance and do not
            display platform fees.
          </div>
          <footer>
            <span>© 2026 VacatiON · Owner Financial Report</span>
            <span>Designed for clarity. Built on transparency.</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default OwnerFinancialReport;