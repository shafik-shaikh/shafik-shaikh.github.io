import { useState } from 'react'

const services = [
  { icon: '◈', title: 'Fintech Dashboards', desc: 'Trading platforms, crypto trackers, portfolio managers' },
  { icon: '◈', title: 'Cloud Architecture', desc: 'AWS & Azure setup, serverless, CI/CD pipelines' },
  { icon: '◈', title: 'Full Stack Apps', desc: 'React + Node.js + MySQL / DynamoDB web applications' },
  { icon: '◈', title: 'E-Commerce', desc: 'Online stores, payment integration, product management' },
]

export default function Contact() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="contact" style={s.section}>
      <div style={s.inner}>
        <p style={s.sub}>Let's work together</p>
        <h2 style={s.title}>
          Hire Me for Your<br />
          <span style={{ color: 'var(--gold)' }}>Next Project</span>
        </h2>
        <p style={s.desc}>
          Open to freelance projects worldwide. Fast delivery, clean code, and real results.
        </p>

        <div style={s.servicesGrid}>
          {services.map((sv, i) => (
            <div
              key={sv.title}
              style={{
                ...s.serviceCard,
                borderColor: hovered === i ? 'var(--gold-border)' : 'var(--border)',
                background: hovered === i ? 'var(--gold-dim)' : 'var(--bg)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ color: 'var(--gold)', fontSize: 20, marginBottom: 8, display: 'block' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                  {i === 0 && <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}
                  {i === 1 && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>}
                  {i === 2 && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>}
                  {i === 3 && <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>}
                </svg>
              </span>
              <h4 style={s.serviceTitle}>{sv.title}</h4>
              <p style={s.serviceDesc}>{sv.desc}</p>
            </div>
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={s.ctaLeft}>
            <h3 style={s.ctaHeading}>Ready to start?</h3>
            <p style={s.ctaText}>Drop me an email and let's discuss your project.</p>
            <div style={s.contactInfo}>
              <a href="mailto:shaikhshafik987@gmail.com" style={s.emailLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                shaikhshafik987@gmail.com
              </a>
            </div>
          </div>
          <div style={s.ctaRight}>
            <a href="mailto:shaikhshafik987@gmail.com" style={s.bigBtn}>
              Send Me a Message
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 8 }}>
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/shafik-shaikh" target="_blank" rel="noreferrer" style={s.linkedinBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text)" style={{ marginRight: 8 }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

const s = {
  section: { padding: '90px 24px', background: 'var(--bg-card)' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  sub: { color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  title: { fontFamily: 'Orbitron, sans-serif', fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 16, letterSpacing: -1, lineHeight: 1.2 },
  desc: { color: 'var(--muted)', fontSize: 15, marginBottom: 48 },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 48 },
  serviceCard: {
    padding: '22px', borderRadius: 10, border: '1px solid',
    transition: 'all 0.25s',
  },
  serviceTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 },
  serviceDesc: { color: 'var(--muted)', fontSize: 12, lineHeight: 1.6 },
  ctaBox: {
    background: 'var(--bg)', borderRadius: 16, padding: '40px',
    border: '1px solid var(--border)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: 32, flexWrap: 'wrap',
  },
  ctaLeft: { flex: 1 },
  ctaHeading: { fontFamily: 'Orbitron, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 8 },
  ctaText: { color: 'var(--muted)', fontSize: 14 },
  contactInfo: { marginTop: 16 },
  emailLink: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    color: 'var(--gold)', fontSize: 14, fontWeight: 600,
  },
  ctaRight: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  bigBtn: {
    background: 'var(--gold)', color: '#0F172A',
    padding: '14px 28px', borderRadius: 8,
    fontSize: 14, fontWeight: 700, border: 'none',
    display: 'inline-flex', alignItems: 'center',
    boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
    transition: 'opacity 0.2s',
  },
  linkedinBtn: {
    border: '1px solid var(--border)', color: 'var(--text)',
    background: 'transparent', padding: '14px 24px', borderRadius: 8,
    fontSize: 14, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center',
    transition: 'border-color 0.2s',
  },
}
