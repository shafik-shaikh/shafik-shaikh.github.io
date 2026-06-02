import { useEffect, useRef, useState } from 'react'

const TYPED_STRINGS = ['Full Stack Developer', 'Cloud Engineer', 'AWS Certified', 'Fintech Builder']

const CODE_LINES = [
  { text: 'const developer = {', color: '#F8FAFC' },
  { text: '  name: "Mohammadsafik",', color: '#94A3B8' },
  { text: '  role: "Full Stack + Cloud",', color: '#94A3B8' },
  { text: '  skills: ["React","Node","AWS"],', color: '#F59E0B' },
  { text: '  certs: ["CLF-C01","AZ-900"],', color: '#8B5CF6' },
  { text: '  builds: ["Fintech","E-Commerce"],', color: '#26A69A' },
  { text: '  available: true,', color: '#4ADE80' },
  { text: '}', color: '#F8FAFC' },
]

export default function Hero() {
  const [typed, setTyped] = useState('')
  const [strIdx, setStrIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [codeVisible, setCodeVisible] = useState(0)

  useEffect(() => {
    const target = TYPED_STRINGS[strIdx]
    const speed = deleting ? 40 : 80

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCodeVisible(v => v < CODE_LINES.length ? v + 1 : v)
    }, 220)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { n: '3+', label: 'Internships' },
    { n: '4', label: 'Certifications' },
    { n: '5+', label: 'Projects' },
    { n: '8.34', label: 'CGPA' },
  ]

  return (
    <section id="about" style={s.section}>
      <GridBg />
      <div style={s.inner}>
        <div style={s.grid}>

          {/* Left */}
          <div style={s.left}>
            <span style={s.badge}>
              <span style={s.dot} />
              Available for Freelance
            </span>

            <h1 style={s.name}>
              Mohammadsafik<br />
              <span style={s.nameAccent}>Shaikh</span>
            </h1>

            <div style={s.typingRow}>
              <span style={s.typingText}>{typed}</span>
              <span style={s.cursor}>|</span>
            </div>

            <p style={s.desc}>
              M.Tech @ CHARUSAT · AWS & Azure Certified Developer.
              I build fintech dashboards, serverless apps, and cloud infrastructure
              for clients worldwide.
            </p>

            <div style={s.certRow}>
              {['AWS CLF-C01', 'AZ-900', 'AI-900', 'SC-900'].map(c => (
                <span key={c} style={s.cert}>{c}</span>
              ))}
            </div>

            <div style={s.ctaRow}>
              <a
                href="#projects"
                onClick={e => {
                  e.preventDefault()
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={s.btnGold}
              >View Projects</a>
              <a href="mailto:shaikhshafik987@gmail.com" style={s.btnPurple}>Hire Me</a>
              <a
                href="https://github.com/shafik-shaikh"
                target="_blank"
                rel="noreferrer"
                style={s.btnGhost}
              >GitHub</a>
            </div>
          </div>

          {/* Right — Terminal */}
          <div style={s.right}>
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

        {/* Stats */}
        <div style={s.statsRow}>
          {stats.map((st, i) => (
            <div key={st.label} style={{
              ...s.statBox,
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={s.statNum}>{st.n}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GridBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', top: '20%', right: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
      }} />
    </div>
  )
}

const s = {
  section: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    padding: '88px 24px 40px',
  },
  inner: { maxWidth: 1100, margin: '0 auto', width: '100%' },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 64, alignItems: 'center', marginBottom: 64,
  },
  left: { display: 'flex', flexDirection: 'column', gap: 20 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
    color: '#4ADE80', padding: '6px 14px', borderRadius: 20,
    fontSize: 12, fontWeight: 600, letterSpacing: 1, width: 'fit-content',
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
  },
  nameAccent: { color: 'var(--gold)' },
  typingRow: { display: 'flex', alignItems: 'center', gap: 2, height: 32 },
  typingText: {
    fontSize: 20, fontWeight: 600, color: 'var(--purple)',
    fontFamily: 'Orbitron, sans-serif', letterSpacing: 1,
  },
  cursor: {
    fontSize: 22, color: 'var(--gold)', fontWeight: 300,
    animation: 'blink 1s step-end infinite',
  },
  desc: {
    color: 'var(--muted)', fontSize: 15, lineHeight: 1.8,
    maxWidth: 460,
  },
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
    padding: '12px 28px', borderRadius: 7, fontSize: 14, fontWeight: 700,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
  },
  btnPurple: {
    background: 'var(--purple)', color: '#fff',
    padding: '12px 28px', borderRadius: 7, fontSize: 14, fontWeight: 700,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
  },
  btnGhost: {
    border: '1px solid var(--border)', color: 'var(--muted)',
    padding: '12px 24px', borderRadius: 7, fontSize: 14, fontWeight: 600,
    background: 'transparent', transition: 'border-color 0.2s, color 0.2s',
  },
  right: { position: 'relative' },
  terminal: {
    background: '#0D1117', borderRadius: 12,
    border: '1px solid rgba(245,158,11,0.2)',
    boxShadow: '0 0 40px rgba(245,158,11,0.08), 0 20px 60px rgba(0,0,0,0.5)',
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
    width: '110%', height: '110%',
    borderRadius: 16, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.04) 0%, transparent 70%)',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    background: 'var(--bg-card)', borderRadius: 12,
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  statBox: {
    padding: '28px 24px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6,
    transition: 'background 0.2s',
  },
  statNum: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 34, fontWeight: 900, color: 'var(--gold)',
    textShadow: '0 0 20px rgba(245,158,11,0.4)',
  },
  statLabel: {
    fontSize: 11, fontWeight: 600, color: 'var(--muted)',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
}
