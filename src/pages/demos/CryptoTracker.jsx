import { useEffect, useState, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler,
} from 'chart.js'
import Navbar from '../../components/Navbar'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const COINS = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano']

const COIN_META = {
  bitcoin:     { symbol: 'BTC', color: '#F7931A' },
  ethereum:    { symbol: 'ETH', color: '#627EEA' },
  binancecoin: { symbol: 'BNB', color: '#F3BA2F' },
  solana:      { symbol: 'SOL', color: '#9945FF' },
  ripple:      { symbol: 'XRP', color: '#00AAE4' },
  cardano:     { symbol: 'ADA', color: '#0033AD' },
}

function fmt(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M'
  return '$' + n?.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

export default function CryptoTracker() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchCoins = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&per_page=10&sparkline=true&price_change_percentage=24h`
      )
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setCoins(data)
      setSelected(prev => prev ?? data[0])
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError('Could not fetch live data. Showing cached data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, 30000)
    return () => clearInterval(interval)
  }, [])

  const selectedCoin = coins.find(c => c.id === selected?.id) ?? selected
  const isUp = selectedCoin?.price_change_percentage_24h >= 0

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <Navbar />

      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.pageTitle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 12 }}>
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
              </svg>
              Crypto Price Tracker
            </h1>
            <p style={s.pageDesc}>
              Live prices via CoinGecko API · Updates every 30 seconds
            </p>
          </div>
          <div style={s.headerRight}>
            {lastUpdated && (
              <span style={s.updateBadge}>
                <span style={s.liveDot} />
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button onClick={fetchCoins} style={s.refreshBtn} title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
          </div>
        </div>

        {error && <div style={s.errorBanner}>{error}</div>}

        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={{ color: 'var(--muted)', marginTop: 16 }}>Fetching live prices...</p>
          </div>
        ) : (
          <div style={s.layout}>
            {/* Coin List */}
            <div style={s.coinList}>
              {coins.map(coin => {
                const meta = COIN_META[coin.id] ?? { symbol: coin.symbol?.toUpperCase(), color: '#94A3B8' }
                const up = coin.price_change_percentage_24h >= 0
                const isActive = selected?.id === coin.id
                return (
                  <button
                    key={coin.id}
                    onClick={() => setSelected(coin)}
                    style={{
                      ...s.coinRow,
                      background: isActive ? 'var(--bg-card2)' : 'transparent',
                      borderColor: isActive ? meta.color + '60' : 'var(--border)',
                    }}
                  >
                    <img src={coin.image} alt={coin.name} style={s.coinImg} />
                    <div style={s.coinInfo}>
                      <span style={s.coinName}>{coin.name}</span>
                      <span style={s.coinSymbol}>{meta.symbol}</span>
                    </div>
                    <div style={s.coinRight}>
                      <span style={s.coinPrice}>{fmt(coin.current_price)}</span>
                      <span style={{ ...s.coinChange, color: up ? '#26A69A' : '#EF5350', background: up ? 'rgba(38,166,154,0.1)' : 'rgba(239,83,80,0.1)' }}>
                        {up ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Chart Panel */}
            {selectedCoin && (
              <div style={s.chartPanel}>
                <div style={s.chartHeader}>
                  <div style={s.chartCoinInfo}>
                    <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div>
                      <h2 style={s.chartName}>{selectedCoin.name}</h2>
                      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{COIN_META[selectedCoin.id]?.symbol ?? selectedCoin.symbol?.toUpperCase()} / USD</span>
                    </div>
                  </div>
                  <div style={s.chartPrice}>
                    <span style={s.bigPrice}>{fmt(selectedCoin.current_price)}</span>
                    <span style={{
                      ...s.bigChange,
                      color: isUp ? '#26A69A' : '#EF5350',
                      background: isUp ? 'rgba(38,166,154,0.1)' : 'rgba(239,83,80,0.1)',
                    }}>
                      {isUp ? '▲' : '▼'} {Math.abs(selectedCoin.price_change_percentage_24h ?? 0).toFixed(2)}% (24h)
                    </span>
                  </div>
                </div>

                {selectedCoin.sparkline_in_7d?.price?.length > 0 && (
                  <div style={{ height: 220, marginBottom: 24 }}>
                    <SparklineChart
                      data={selectedCoin.sparkline_in_7d.price}
                      color={isUp ? '#26A69A' : '#EF5350'}
                    />
                  </div>
                )}

                <div style={s.statsGrid}>
                  {[
                    { label: 'Market Cap', value: fmt(selectedCoin.market_cap) },
                    { label: '24h High', value: fmt(selectedCoin.high_24h) },
                    { label: '24h Low', value: fmt(selectedCoin.low_24h) },
                    { label: '24h Volume', value: fmt(selectedCoin.total_volume) },
                    { label: 'Circulating Supply', value: (selectedCoin.circulating_supply / 1e6).toFixed(2) + 'M' },
                    { label: 'Market Cap Rank', value: '#' + selectedCoin.market_cap_rank },
                  ].map(m => (
                    <div key={m.label} style={s.statBox}>
                      <span style={s.statLabel}>{m.label}</span>
                      <span style={s.statValue}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SparklineChart({ data, color }) {
  const labels = data.map((_, i) => {
    const daysAgo = ((data.length - 1 - i) / (data.length / 7)).toFixed(1)
    return i % Math.floor(data.length / 7) === 0 ? `${Math.ceil(Number(daysAgo))}d ago` : ''
  })

  const chartData = {
    labels,
    datasets: [{
      data,
      borderColor: color,
      borderWidth: 2,
      fill: true,
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220)
        gradient.addColorStop(0, color + '40')
        gradient.addColorStop(1, color + '00')
        return gradient
      },
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
    }],
  }

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: '#1E293B',
          titleColor: '#94A3B8',
          bodyColor: '#F8FAFC',
          borderColor: color,
          borderWidth: 1,
          callbacks: { label: ctx => ' $' + ctx.raw.toLocaleString('en-US', { maximumFractionDigits: 2 }) },
        }},
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94A3B8', font: { size: 10 }, maxTicksLimit: 7 }},
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94A3B8', font: { size: 10 }, callback: v => '$' + v.toLocaleString() }},
        },
      }}
    />
  )
}

const s = {
  page: { background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '90px 24px 48px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  pageTitle: {
    fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 800,
    color: 'var(--text)', display: 'flex', alignItems: 'center',
  },
  pageDesc: { color: 'var(--muted)', fontSize: 14, marginTop: 6, marginLeft: 40 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  updateBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    padding: '6px 14px', borderRadius: 20, fontSize: 12, color: 'var(--muted)',
  },
  liveDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#26A69A',
    animation: 'pulse 2s infinite', display: 'inline-block',
  },
  refreshBtn: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    color: 'var(--muted)', width: 36, height: 36, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'border-color 0.2s, color 0.2s', cursor: 'pointer',
  },
  errorBanner: {
    background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)',
    color: '#EF5350', padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 24,
  },
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' },
  spinner: {
    width: 40, height: 40, border: '3px solid var(--border)',
    borderTopColor: 'var(--gold)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  layout: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' },
  coinList: { display: 'flex', flexDirection: 'column', gap: 8 },
  coinRow: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
    borderRadius: 10, border: '1px solid', width: '100%', textAlign: 'left',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  coinImg: { width: 36, height: 36, borderRadius: '50%', flexShrink: 0 },
  coinInfo: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  coinName: { fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  coinSymbol: { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  coinRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
  coinPrice: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  coinChange: { fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 },
  chartPanel: {
    background: 'var(--bg-card)', borderRadius: 14, padding: '28px',
    border: '1px solid var(--border)', animation: 'fadeIn 0.3s ease',
  },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  chartCoinInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  chartName: { fontFamily: 'Orbitron, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text)' },
  chartPrice: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  bigPrice: { fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 900, color: 'var(--text)' },
  bigChange: { padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  statBox: {
    background: 'var(--bg)', borderRadius: 8, padding: '14px 16px',
    border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4,
  },
  statLabel: { fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 },
  statValue: { fontSize: 15, fontWeight: 700, color: 'var(--text)' },
}
