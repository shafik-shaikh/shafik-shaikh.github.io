import { useState, useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler,
} from 'chart.js'
import Navbar from '../../components/Navbar'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

// ─── Mock data generator ──────────────────────────────────────────────────────
function genOHLC(base, days, volatility = 0.02) {
  const data = []
  let price = base
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const change = (Math.random() - 0.48) * volatility
    const open = price
    const close = +(price * (1 + change)).toFixed(2)
    const high = +(Math.max(open, close) * (1 + Math.random() * 0.01)).toFixed(2)
    const low  = +(Math.min(open, close) * (1 - Math.random() * 0.01)).toFixed(2)
    const vol  = Math.floor(1e6 + Math.random() * 9e6)
    data.push({ date: d.toISOString().slice(0, 10), open, high, low, close, vol })
    price = close
  }
  return data
}

const STOCKS = {
  AAPL: { name: 'Apple Inc.', base: 189, vol: 0.018, color: '#F59E0B', sector: 'Technology' },
  TSLA: { name: 'Tesla Inc.', base: 242, vol: 0.035, color: '#EF4444', sector: 'Automotive' },
  MSFT: { name: 'Microsoft Corp.', base: 415, vol: 0.015, color: '#3B82F6', sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', base: 172, vol: 0.018, color: '#8B5CF6', sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', base: 185, vol: 0.022, color: '#26A69A', sector: 'E-Commerce' },
}

const RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
]

// Compute simple moving average
function sma(data, period) {
  return data.map((_, i) => {
    if (i < period - 1) return null
    const avg = data.slice(i - period + 1, i + 1).reduce((s, v) => s + v, 0) / period
    return +avg.toFixed(2)
  })
}

export default function StockDashboard() {
  const [ticker, setTicker] = useState('AAPL')
  const [range, setRange] = useState(RANGES[2])
  const [tab, setTab] = useState('price')

  const stockMeta = STOCKS[ticker]

  const ohlc = useMemo(() =>
    genOHLC(stockMeta.base, range.days, stockMeta.vol),
    [ticker, range]
  )

  const closes = ohlc.map(d => d.close)
  const labels  = ohlc.map(d => d.date.slice(5))
  const volumes = ohlc.map(d => d.vol)
  const ma20 = sma(closes, 20)
  const ma50 = sma(closes, 50)

  const lastClose = closes[closes.length - 1]
  const prevClose = closes[closes.length - 2]
  const change    = lastClose - prevClose
  const changePct = ((change / prevClose) * 100)
  const isUp      = change >= 0

  const high52 = Math.max(...closes)
  const low52  = Math.min(...closes)

  const portfolio = [
    { ticker: 'AAPL', shares: 10, avg: 175 },
    { ticker: 'TSLA', shares: 5,  avg: 220 },
    { ticker: 'MSFT', shares: 8,  avg: 390 },
  ]

  const priceChartData = {
    labels,
    datasets: [
      {
        label: ticker,
        data: closes,
        borderColor: stockMeta.color,
        borderWidth: 2,
        fill: true,
        backgroundColor: ctx => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280)
          g.addColorStop(0, stockMeta.color + '35')
          g.addColorStop(1, stockMeta.color + '00')
          return g
        },
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: 'MA20',
        data: ma20,
        borderColor: '#F59E0B',
        borderWidth: 1.5,
        borderDash: [4, 3],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
      {
        label: 'MA50',
        data: ma50,
        borderColor: '#8B5CF6',
        borderWidth: 1.5,
        borderDash: [4, 3],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  }

  const volChartData = {
    labels,
    datasets: [{
      label: 'Volume',
      data: volumes,
      backgroundColor: ohlc.map((d, i) =>
        i > 0 && d.close >= ohlc[i - 1].close ? 'rgba(38,166,154,0.7)' : 'rgba(239,83,80,0.7)'
      ),
      borderWidth: 0,
      borderRadius: 2,
    }],
  }

  const chartOptions = (isMoney = true) => ({
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, labels: { color: '#94A3B8', font: { size: 11 }, boxWidth: 20, padding: 16 } },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#94A3B8',
        bodyColor: '#F8FAFC',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: isMoney
          ? { label: ctx => ` ${ctx.dataset.label}: $${ctx.raw?.toFixed(2) ?? '-'}` }
          : { label: ctx => ` Vol: ${(ctx.raw / 1e6).toFixed(2)}M` },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94A3B8', font: { size: 10 }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#94A3B8', font: { size: 10 },
          callback: v => isMoney ? '$' + v.toFixed(0) : (v / 1e6).toFixed(1) + 'M',
        },
      },
    },
  })

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <Navbar />

      <div style={s.container} className="demo-container">
        {/* Page Header */}
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 12 }}>
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
              </svg>
              Stock Market Dashboard
            </h1>
            <p style={s.pageDesc}>Simulated OHLC data · MA20 · MA50 · Volume Analysis</p>
          </div>
          <span style={s.liveTag}>
            <span style={s.liveDot} />
            Simulated Live
          </span>
        </div>

        <div style={s.layout} className="stock-layout">
          {/* Left Column */}
          <div style={s.leftCol}>

            {/* Ticker Selector */}
            <div style={s.sectionCard}>
              <h3 style={s.sectionTitle}>Watchlist</h3>
              <div style={s.tickerList}>
                {Object.entries(STOCKS).map(([sym, meta]) => {
                  const d = genOHLC(meta.base, 2, meta.vol)
                  const up = d[2].close >= d[1].close
                  const pct = (((d[2].close - d[1].close) / d[1].close) * 100)
                  return (
                    <button
                      key={sym}
                      onClick={() => setTicker(sym)}
                      style={{
                        ...s.tickerBtn,
                        borderColor: ticker === sym ? meta.color + '60' : 'var(--border)',
                        background: ticker === sym ? meta.color + '12' : 'transparent',
                      }}
                    >
                      <div style={s.tickerLeft}>
                        <span style={{ ...s.tickerSym, color: meta.color }}>{sym}</span>
                        <span style={s.tickerName}>{meta.name.split(' ')[0]}</span>
                      </div>
                      <div style={s.tickerRight}>
                        <span style={s.tickerPrice}>${d[2].close.toFixed(2)}</span>
                        <span style={{ ...s.tickerPct, color: up ? '#26A69A' : '#EF5350', background: up ? 'rgba(38,166,154,0.1)' : 'rgba(239,83,80,0.1)' }}>
                          {up ? '+' : ''}{pct.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Portfolio */}
            <div style={s.sectionCard}>
              <h3 style={s.sectionTitle}>My Portfolio</h3>
              {portfolio.map(p => {
                const meta = STOCKS[p.ticker]
                const d = genOHLC(meta.base, 2, meta.vol)
                const cur = d[2].close
                const pnl = (cur - p.avg) * p.shares
                const up  = pnl >= 0
                return (
                  <div key={p.ticker} style={s.portRow}>
                    <div>
                      <span style={{ color: meta.color, fontWeight: 700, fontSize: 14 }}>{p.ticker}</span>
                      <span style={s.portShares}>{p.shares} shares @ ${p.avg}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        ${(cur * p.shares).toFixed(0)}
                      </div>
                      <div style={{ fontSize: 12, color: up ? '#26A69A' : '#EF5350', fontWeight: 600 }}>
                        {up ? '+' : ''}${pnl.toFixed(0)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column — Main Chart */}
          <div style={s.rightCol}>
            {/* Stock Info Header */}
            <div style={s.stockHeader}>
              <div style={s.stockMeta}>
                <div style={{ ...s.tickerBadge, background: stockMeta.color + '20', color: stockMeta.color }}>
                  {ticker}
                </div>
                <div>
                  <h2 style={s.stockName}>{stockMeta.name}</h2>
                  <span style={s.stockSector}>{stockMeta.sector}</span>
                </div>
              </div>
              <div style={s.priceBlock}>
                <span style={s.priceMain}>${lastClose.toFixed(2)}</span>
                <span style={{
                  ...s.priceChange,
                  color: isUp ? '#26A69A' : '#EF5350',
                  background: isUp ? 'rgba(38,166,154,0.1)' : 'rgba(239,83,80,0.1)',
                }}>
                  {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div style={s.metricsRow} className="stock-metrics">
              {[
                { label: 'Open',    value: `$${ohlc[ohlc.length - 1].open.toFixed(2)}` },
                { label: 'High',    value: `$${ohlc[ohlc.length - 1].high.toFixed(2)}`, color: '#26A69A' },
                { label: 'Low',     value: `$${ohlc[ohlc.length - 1].low.toFixed(2)}`,  color: '#EF5350' },
                { label: `${range.label} High`, value: `$${high52.toFixed(2)}` },
                { label: `${range.label} Low`,  value: `$${low52.toFixed(2)}` },
              ].map(m => (
                <div key={m.label} style={s.metricBox}>
                  <span style={s.metricLabel}>{m.label}</span>
                  <span style={{ ...s.metricValue, color: m.color ?? 'var(--text)' }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Range selector */}
            <div style={s.rangeRow}>
              <div style={s.rangeBtns}>
                {RANGES.map(r => (
                  <button
                    key={r.label}
                    onClick={() => setRange(r)}
                    style={{
                      ...s.rangeBtn,
                      background: range.label === r.label ? stockMeta.color : 'transparent',
                      color: range.label === r.label ? '#0F172A' : 'var(--muted)',
                      borderColor: range.label === r.label ? stockMeta.color : 'var(--border)',
                    }}
                  >{r.label}</button>
                ))}
              </div>
              <div style={s.tabBtns}>
                {['price', 'volume'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      ...s.tabBtn,
                      background: tab === t ? 'var(--bg-card)' : 'transparent',
                      color: tab === t ? 'var(--text)' : 'var(--muted)',
                    }}
                  >{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div style={{ height: 300, marginBottom: 8 }}>
              {tab === 'price'
                ? <Line data={priceChartData} options={chartOptions(true)} />
                : <Bar  data={volChartData}   options={chartOptions(false)} />
              }
            </div>

            {/* OHLC Table */}
            <div style={s.tableWrap}>
              <h4 style={s.tableTitle}>Recent OHLC Data</h4>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Date', 'Open', 'High', 'Low', 'Close', 'Change', 'Volume'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...ohlc].reverse().slice(0, 8).map((row, i) => {
                    const up = row.close >= row.open
                    return (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                        <td style={s.td}>{row.date}</td>
                        <td style={s.td}>${row.open.toFixed(2)}</td>
                        <td style={{ ...s.td, color: '#26A69A' }}>${row.high.toFixed(2)}</td>
                        <td style={{ ...s.td, color: '#EF5350' }}>${row.low.toFixed(2)}</td>
                        <td style={{ ...s.td, fontWeight: 700, color: up ? '#26A69A' : '#EF5350' }}>${row.close.toFixed(2)}</td>
                        <td style={{ ...s.td, color: up ? '#26A69A' : '#EF5350' }}>
                          {up ? '+' : ''}{(row.close - row.open).toFixed(2)}
                        </td>
                        <td style={s.td}>{(row.vol / 1e6).toFixed(2)}M</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: 1300, margin: '0 auto', padding: '90px 20px 48px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 },
  pageTitle: { fontFamily: 'Orbitron, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center' },
  pageDesc: { color: 'var(--muted)', fontSize: 13, marginTop: 6, marginLeft: 38 },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
    color: 'var(--purple)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
  },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--purple)', animation: 'pulse 2s infinite', display: 'inline-block' },
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  sectionCard: { background: 'var(--bg-card)', borderRadius: 12, padding: '18px', border: '1px solid var(--border)' },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  tickerList: { display: 'flex', flexDirection: 'column', gap: 6 },
  tickerBtn: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 12px', borderRadius: 8, border: '1px solid',
    background: 'transparent', cursor: 'pointer', width: '100%', transition: 'all 0.2s',
  },
  tickerLeft: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 },
  tickerSym: { fontSize: 13, fontWeight: 800, fontFamily: 'Orbitron, sans-serif' },
  tickerName: { fontSize: 10, color: 'var(--muted)' },
  tickerRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
  tickerPrice: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  tickerPct: { fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3 },
  portRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  portShares: { display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  rightCol: { background: 'var(--bg-card)', borderRadius: 14, padding: '24px', border: '1px solid var(--border)' },
  stockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  stockMeta: { display: 'flex', alignItems: 'center', gap: 14 },
  tickerBadge: { width: 52, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 800, fontSize: 13 },
  stockName: { fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' },
  stockSector: { fontSize: 12, color: 'var(--muted)' },
  priceBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  priceMain: { fontFamily: 'Orbitron, sans-serif', fontSize: 30, fontWeight: 900, color: 'var(--text)' },
  priceChange: { padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700 },
  metricsRow: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  metricBox: {
    background: 'var(--bg)', borderRadius: 8, padding: '10px 14px',
    border: '1px solid var(--border)', flex: 1, minWidth: 80,
  },
  metricLabel: { display: 'block', fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  metricValue: { fontSize: 14, fontWeight: 700 },
  rangeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 },
  rangeBtns: { display: 'flex', gap: 4 },
  rangeBtn: { padding: '5px 12px', borderRadius: 6, border: '1px solid', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  tabBtns: { display: 'flex', gap: 2, background: 'var(--bg)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' },
  tabBtn: { padding: '5px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  tableWrap: { marginTop: 20 },
  tableTitle: { fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th: { padding: '8px 10px', color: 'var(--muted)', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid var(--border)', letterSpacing: 0.5 },
  td: { padding: '9px 10px', color: 'var(--text)', borderBottom: '1px solid rgba(255,255,255,0.03)' },
}
