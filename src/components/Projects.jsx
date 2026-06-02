import { useState } from 'react'
import { Link } from 'react-router-dom'

const projects = [
  {
    id: 'crypto',
    title: 'Crypto Price Tracker',
    category: 'Fintech Demo',
    desc: 'Live cryptocurrency dashboard with real-time prices, 7-day sparkline charts, market cap, and 24h change. Built with CoinGecko API.',
    tags: ['React.js', 'Chart.js', 'CoinGecko API', 'Real-time'],
    link: '#/demo/crypto',
    demo: true,
    accent: '#F59E0B',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    id: 'stocks',
    title: 'Stock Market Dashboard',
    category: 'Fintech Demo',
    desc: 'Professional trading dashboard with candlestick charts, OHLC data, portfolio tracker, volume analysis, and technical indicators.',
    tags: ['React.js', 'Chart.js', 'Trading Data', 'ApexCharts'],
    link: '#/demo/stocks',
    demo: true,
    accent: '#8B5CF6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'serverless',
    title: 'Serverless Web App (AWS)',
    category: 'Cloud',
    desc: 'Fully serverless architecture using AWS Lambda, API Gateway, DynamoDB, and S3. Handles auth, CRUD operations, and file storage.',
    tags: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'S3'],
    link: 'https://github.com/shafik-shaikh',
    demo: false,
    accent: '#FF9900',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 'event',
    title: 'Event Management System',
    category: 'Full Stack',
    desc: 'Full-stack system for birthday & anniversary event planning. React frontend, Node.js + Express backend, MySQL database.',
    tags: ['React.js', 'Node.js', 'MySQL', 'Express'],
    link: 'https://github.com/shafik-shaikh',
    demo: false,
    accent: '#26A69A',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#26A69A" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'azure',
    title: 'Azure Cloud Infrastructure',
    category: 'Cloud',
    desc: 'Secure multi-VNet architecture on Azure: VM deployment, VNet peering, Site-to-Site VPN, Network Security Groups.',
    tags: ['Azure', 'VNet', 'VMs', 'Site-to-Site VPN'],
    link: 'https://github.com/shafik-shaikh',
    demo: false,
    accent: '#0089D6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0089D6" strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'ecom',
    title: 'E-Commerce Website',
    category: 'Full Stack',
    desc: 'React.js e-commerce platform with product catalog, cart, and checkout flow. Deployed and hosted on AWS S3 bucket.',
    tags: ['React.js', 'AWS S3', 'E-Commerce', 'Deployment'],
    link: 'https://github.com/shafik-shaikh',
    demo: false,
    accent: '#EF4444',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
]

export default function Projects() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="projects" style={s.section}>
      <div style={s.inner}>
        <p style={s.sub}>What I've built</p>
        <h2 style={s.title}>Featured <span style={{ color: 'var(--gold)' }}>Projects</span></h2>
        <p style={s.desc}>
          Live trading demos + real-world cloud and full-stack projects.
        </p>

        <div style={s.grid}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              featured={p.demo}
              hovered={hovered === i}
              onHover={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project: p, featured, hovered, onHover, onLeave }) {
  const isExternal = !p.link.startsWith('#')

  const card = (
    <div
      style={{
        ...s.card,
        borderColor: hovered ? p.accent + '50' : 'var(--border)',
        background: hovered ? 'var(--bg-card2)' : 'var(--bg-card)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${p.accent}30` : 'none',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {featured && (
        <div style={s.featuredBadge}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Live Demo
        </div>
      )}

      <div style={s.cardTop}>
        <div style={{
          ...s.iconWrap,
          background: p.accent + '15',
          border: `1px solid ${p.accent}30`,
        }}>
          {p.icon}
        </div>
        <span style={{ ...s.catBadge, color: p.accent, background: p.accent + '15', border: `1px solid ${p.accent}25` }}>
          {p.category}
        </span>
      </div>

      <h3 style={s.cardTitle}>{p.title}</h3>
      <p style={s.cardDesc}>{p.desc}</p>

      <div style={s.tags}>
        {p.tags.map(t => (
          <span key={t} style={s.tag}>{t}</span>
        ))}
      </div>

      <div style={{ ...s.cardLink, color: p.accent }}>
        {p.demo ? 'View Live Demo' : 'View on GitHub'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 6 }}>
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  )

  if (p.demo) {
    return <a href={p.link} style={{ textDecoration: 'none', display: 'block' }}>{card}</a>
  }
  return (
    <a href={p.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      {card}
    </a>
  )
}

const s = {
  section: { padding: '90px 24px', background: 'var(--bg)' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  sub: { color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  title: { fontFamily: 'Orbitron, sans-serif', fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 12, letterSpacing: -1 },
  desc: { color: 'var(--muted)', fontSize: 15, marginBottom: 48 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  card: {
    borderRadius: 14, padding: '26px', border: '1px solid',
    transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative',
  },
  featuredBadge: {
    position: 'absolute', top: 16, right: 16,
    background: 'var(--gold-dim)', color: 'var(--gold)',
    border: '1px solid var(--gold-border)',
    padding: '3px 10px', borderRadius: 20,
    fontSize: 10, fontWeight: 700, letterSpacing: 1,
    display: 'flex', alignItems: 'center', gap: 5,
  },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconWrap: { width: 52, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  catBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
  cardTitle: { fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 10, fontFamily: 'Exo 2, sans-serif' },
  cardDesc: { color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 18 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  tag: {
    background: 'rgba(255,255,255,0.04)', color: 'var(--muted)',
    padding: '3px 10px', borderRadius: 4,
    fontSize: 11, fontWeight: 600, border: '1px solid var(--border)',
  },
  cardLink: { display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700, marginTop: 4 },
}
