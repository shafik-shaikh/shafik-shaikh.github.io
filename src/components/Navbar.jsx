import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isDemo = pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleScroll = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(15,23,42,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(245,158,11,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 22, fontWeight: 800, letterSpacing: 1,
            color: 'var(--text)',
          }}>
            MS<span style={{ color: 'var(--gold)' }}>.</span>
          </Link>

          {!isDemo ? (
            <>
              <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}
                className="desktop-nav">
                {navLinks.map(l => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={e => handleScroll(e, l.id)}
                    style={{
                      color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                      letterSpacing: 1.5, textTransform: 'uppercase',
                      transition: 'color 0.2s', cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                  >{l.label}</a>
                ))}
              </div>
              <a
                href="mailto:shaikhshafik987@gmail.com"
                style={{
                  background: 'var(--gold)', color: '#0F172A',
                  padding: '9px 22px', borderRadius: 6,
                  fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
                  border: 'none', cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Hire Me</a>
            </>
          ) : (
            <Link to="/" style={{
              background: 'var(--gold-dim)', color: 'var(--gold)',
              border: '1px solid var(--gold-border)',
              padding: '8px 20px', borderRadius: 6,
              fontSize: 13, fontWeight: 700,
            }}>← Back to Portfolio</Link>
          )}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
