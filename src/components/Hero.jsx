import { useEffect, useRef, useState } from 'react'

const TYPED_STRINGS = [
  'Full Stack Developer',
  'I turn ideas into live products.',
  'Cloud Engineer',
  'From idea to deployment in days.',
  'AWS Certified',
  'You bring the idea. I build & deliver.',
  'Fintech Builder',
  'Full stack. Cloud ready. Ships fast.',
]

const CODE_LINES = [
  { text: 'const developer = {',               color: '#F8FAFC' },
  { text: '  name: "Mohammadsafik",',           color: '#94A3B8' },
  { text: '  role: "Full Stack + Cloud",',      color: '#94A3B8' },
  { text: '  skills: ["React","Node","AWS"],',  color: '#F59E0B' },
  { text: '  certs: ["CLF-C01","AZ-900"],',     color: '#8B5CF6' },
  { text: '  builds: ["Fintech","E-Commerce"],',color: '#26A69A' },
  { text: '  available: true,',                 color: '#4ADE80' },
  { text: '}',                                  color: '#F8FAFC' },
]

const TICKER_ITEMS = [
  'React.js', 'Node.js', 'AWS Lambda', 'Azure', 'Python',
  'DynamoDB', 'S3 Bucket', 'REST APIs', 'MySQL', 'Power BI',
  'Serverless', 'GitHub', 'Docker', 'CI/CD', 'API Gateway',
  'React.js', 'Node.js', 'AWS Lambda', 'Azure', 'Python',
  'DynamoDB', 'S3 Bucket', 'REST APIs', 'MySQL', 'Power BI',
]

const STATS = [
  { target: 3,    suffix: '+', label: 'Internships' },
  { target: 4,    suffix: '',  label: 'Certifications' },
  { target: 5,    suffix: '+', label: 'Projects' },
  { target: 8.34, suffix: '',  label: 'CGPA', decimal: true },
]

// Animated counter hook
function useCounter(target, decimal = false, triggered = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const duration = 1800
    const steps = 60
    const step = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(decimal ? parseFloat(current.toFixed(2)) : Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [triggered, target, decimal])
  return count
}

function StatBox({ stat, triggered, borderLeft }) {
  const count = useCounter(stat.target, stat.decimal, triggered)
  return (
    <div style={{ ...s.statBox, borderLeft: borderLeft ? '1px solid var(--border)' : 'none' }}>
      <span style={s.statNum}>{count}{stat.suffix}</span>
      <span style={s.statLabel}>{stat.label}</span>
    </div>
  )
}

export default function Hero() {
  const [typed, setTyped]           = useState('')
  const [strIdx, setStrIdx]         = useState(0)
  const [deleting, setDeleting]     = useState(false)
  const [codeVisible, setCodeVisible] = useState(0)
  const [statsTriggered, setStatsTriggered] = useState(false)
  const statsRef = useRef(null)

  // Typing animation
  useEffect(() => {
    const target = TYPED_STRINGS[strIdx]
    const speed = deleting ? 38 : 75
    const timeout = setTimeout(() => {
      if (!deleting && typed.length < target.length) {
        setTyped(target.slice(0, typed.length + 1))
      } else if (!deleting && typed.length === target.length) {
        setTimeout(() => setDeleting(true), 1800)
      } else if (deleting && typed.length > 0) {
        setTyped(target.slice(0, typed.length - 1))
      } else {
        setDeleting(false)
        setStrIdx(i => (i + 1) % TYPED_STRINGS.length)
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [typed, deleting, strIdx])

  // Terminal code reveal
  useEffect(() => {
    const interval = setInterval(() => {
      setCodeVisible(v => v < CODE_LINES.length ? v + 1 : v)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // Counter trigger on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsTriggered(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" style={s.section} className="hero-section">
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.4)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer {
          0%   { background-position: -200% center }
          100% { background-position:  200% center }
        }
        .btn-gold:hover  { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,158,11,0.5) !important; }
        .btn-purp:hover  { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139,92,246,0.5) !important; }
        .btn-ghost:hover { border-color: var(--gold) !important; color: var(--gold) !important; }
        .stat-box:hover  { background: rgba(245,158,11,0.05) !important; }
      `}</style>

      <GridBg />

      <div style={s.inner}>
        <div style={s.grid} className="hero-grid">

          {/* ── Left ── */}
          <div style={{ ...s.left, animation: 'fadeUp 0.7s ease both' }}>
            <span style={s.badge} className="hero-badge">
              <span style={s.dot} />
              Available for Freelance — Worldwide
            </span>

            <h1 style={s.name} className="hero-name">
              Mohammadsafik
              <br />
              <span style={s.nameAccent}>Shaikh</span>
            </h1>

            <div style={s.typingRow} className="hero-typing-row">
              <span style={s.typingText}>{typed}</span>
              <span style={s.cursor}>|</span>
            </div>

            <p style={s.desc}>
              Got an idea? I build it, deploy it, and hand it over — <strong style={{ color: 'var(--gold)' }}>fast.</strong>
              <br />React · Node.js · AWS · Azure — whatever it takes.
            </p>

            <div style={s.certRow} className="cert-row">
              {['AWS CLF-C01', 'AZ-900', 'AI-900', 'SC-900'].map(c => (
                <span key={c} style={s.cert}>{c}</span>
              ))}
            </div>

            <div style={s.ctaRow} className="hero-cta">
              <a
                href="#projects"
                className="btn-gold"
                onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={s.btnGold}
              >
                View Projects
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 8 }}>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
              <a
                href="#contact"
                className="btn-purp"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={s.btnPurple}
              >
                Hire Me
              </a>
              <a href="https://github.com/shafik-shaikh" target="_blank" rel="noreferrer" className="btn-ghost" style={s.btnGhost}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 6 }}>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* ── Right — Terminal ── */}
          <div style={{ ...s.right, animation: 'fadeUp 0.7s 0.2s ease both' }} className="hero-terminal">
            <div style={s.terminal}>
              <div style={s.termBar}>
                <span style={{ ...s.tdot, background: '#FF5F57' }} />
                <span style={{ ...s.tdot, background: '#FEBC2E' }} />
                <span style={{ ...s.tdot, background: '#28C840' }} />
                <span style={s.termFile}>portfolio.js</span>
              </div>
              <div style={s.termBody}>
                {CODE_LINES.slice(0, codeVisible).map((l, i) => (
                  <div key={i} style={{ color: l.color, fontFamily: 'ui-monospace,Consolas,monospace', fontSize: 14, lineHeight: 1.9 }}>
                    {l.text}
                  </div>
                ))}
                {codeVisible < CODE_LINES.length && (
                  <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>▋</span>
                )}
              </div>
            </div>
            <div style={s.glowRing} />
          </div>
        </div>

        {/* ── Marquee Ticker ── */}
        <div style={s.tickerWrap}>
          <div style={s.tickerInner}>
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} style={s.tickerItem}>
                <span style={s.tickerDot}>▸</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Stats — animated counters ── */}
        <div ref={statsRef} style={s.statsRow} className="stats-grid">
          {STATS.map((st, i) => (
            <StatBox key={st.label} stat={st} triggered={statsTriggered} borderLeft={i > 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GridBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', top: '15%', right: '3%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '3%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
      }} />
    </div>
  )
}

const s = {
  section: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    padding: '88px 24px 48px', overflow: 'hidden',
  },
  inner: { maxWidth: 1100, margin: '0 auto', width: '100%' },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 64, alignItems: 'center', marginBottom: 48,
  },
  left: { display: 'flex', flexDirection: 'column', gap: 20 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
    color: '#4ADE80', padding: '7px 16px', borderRadius: 20,
    fontSize: 12, fontWeight: 600, letterSpacing: 0.8, width: 'fit-content',
  },
  dot: {
    width: 7, height: 7, borderRadius: '50%', background: '#4ADE80',
    boxShadow: '0 0 6px #4ADE80', display: 'inline-block',
    animation: 'pulse 2s infinite',
  },
  name: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 52, fontWeight: 900, lineHeight: 1.05,
    letterSpacing: -1, color: 'var(--text)',
    textShadow: '0 0 40px rgba(245,158,11,0.15)',
  },
  nameAccent: {
    color: 'var(--gold)',
    textShadow: '0 0 30px rgba(245,158,11,0.4)',
  },
  typingRow: { display: 'flex', alignItems: 'center', gap: 2, minHeight: 34 },
  typingText: {
    fontSize: 19, fontWeight: 600, color: 'var(--purple)',
    fontFamily: 'Orbitron, sans-serif', letterSpacing: 0.5,
  },
  cursor: {
    fontSize: 22, color: 'var(--gold)', fontWeight: 300,
    animation: 'blink 1s step-end infinite',
  },
  desc: { color: 'var(--muted)', fontSize: 15, lineHeight: 1.85, maxWidth: 460 },
  certRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  cert: {
    background: 'var(--gold-dim)', color: 'var(--gold)',
    border: '1px solid var(--gold-border)',
    padding: '4px 12px', borderRadius: 4,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
  },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 },
  btnGold: {
    background: 'var(--gold)', color: '#0F172A',
    padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
    display: 'inline-flex', alignItems: 'center',
  },
  btnPurple: {
    background: 'var(--purple)', color: '#fff',
    padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
  },
  btnGhost: {
    border: '1px solid var(--border)', color: 'var(--muted)',
    padding: '13px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
    background: 'transparent', transition: 'border-color 0.2s, color 0.2s',
    display: 'inline-flex', alignItems: 'center',
  },
  right: { position: 'relative' },
  terminal: {
    background: '#0D1117', borderRadius: 14,
    border: '1px solid rgba(245,158,11,0.2)',
    boxShadow: '0 0 0 1px rgba(245,158,11,0.05), 0 25px 60px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  termBar: {
    background: '#161B22', padding: '12px 16px',
    display: 'flex', alignItems: 'center', gap: 6,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tdot: { width: 12, height: 12, borderRadius: '50%' },
  termFile: { color: 'var(--muted)', fontSize: 12, marginLeft: 'auto', fontFamily: 'monospace' },
  termBody: { padding: '20px 24px', minHeight: 220 },
  glowRing: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '115%', height: '115%',
    borderRadius: 16, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, transparent 70%)',
  },

  // Ticker
  tickerWrap: {
    overflow: 'hidden',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '14px 0',
    marginBottom: 32,
    background: 'rgba(245,158,11,0.02)',
  },
  tickerInner: {
    display: 'flex', gap: 0,
    animation: 'marquee 28s linear infinite',
    width: 'max-content',
  },
  tickerItem: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '0 28px', color: 'var(--muted)',
    fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
    whiteSpace: 'nowrap',
  },
  tickerDot: { color: 'var(--gold)', fontSize: 10 },

  // Stats
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    background: 'var(--bg-card)', borderRadius: 14,
    border: '1px solid var(--border)', overflow: 'hidden',
  },
  statBox: {
    padding: '28px 24px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6,
    transition: 'background 0.2s', cursor: 'default',
  },
  statNum: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 36, fontWeight: 900, color: 'var(--gold)',
    textShadow: '0 0 24px rgba(245,158,11,0.5)',
  },
  statLabel: {
    fontSize: 11, fontWeight: 600, color: 'var(--muted)',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
}
