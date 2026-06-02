export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner} className="footer-inner">
        <div style={s.left}>
          <span style={s.logo}>MS<span style={{ color: 'var(--gold)' }}>.</span></span>
          <p style={s.copy}>© {new Date().getFullYear()} Mohammadsafik Shaikh. All rights reserved.</p>
        </div>
        <div style={s.links}>
          {[
            { label: 'GitHub', href: 'https://github.com/shafik-shaikh' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shafik-shaikh' },
            { label: 'Email', href: 'mailto:safik.tech@gmail.com' },
          ].map(l => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              style={s.link}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer: {
    padding: '28px 24px', borderTop: '1px solid var(--border)',
    background: 'var(--bg)',
  },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 16,
  },
  left: { display: 'flex', alignItems: 'center', gap: 16 },
  logo: { fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text)' },
  copy: { color: 'var(--muted)', fontSize: 13 },
  links: { display: 'flex', gap: 24 },
  link: { color: 'var(--muted)', fontSize: 13, fontWeight: 600, transition: 'color 0.2s', cursor: 'pointer' },
}
