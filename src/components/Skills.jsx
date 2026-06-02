import { useState } from 'react'

const groups = [
  { title: 'Frontend', icon: '⬡', skills: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Responsive Design'] },
  { title: 'Backend', icon: '⬡', skills: ['Node.js', 'Express.js', 'Python', 'MySQL', 'REST APIs'] },
  { title: 'AWS', icon: '⬡', skills: ['Lambda Functions', 'API Gateway', 'DynamoDB', 'S3 Bucket', 'EC2'] },
  { title: 'Azure', icon: '⬡', skills: ['Virtual Machines', 'VNet Peering', 'Azure AI', 'Security Center', 'Site-to-Site VPN'] },
  { title: 'Data & BI', icon: '⬡', skills: ['Power BI', 'Data Visualization', 'Analytics', 'Reporting'] },
  { title: 'Tools', icon: '⬡', skills: ['Git & GitHub', 'VS Code', 'Cisco Packet Tracer', 'Serverless Architecture'] },
]

const ICON_MAP = {
  'React.js': <ReactIcon />, 'Node.js': <NodeIcon />, 'AWS': <AwsIcon />,
  'Azure': <AzureIcon />, 'Python': <PythonIcon />, 'MySQL': <DbIcon />,
}

export default function Skills() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="skills" style={s.section}>
      <div style={s.inner}>
        <p style={s.sub}>What I work with</p>
        <h2 style={s.title}>Technical <span style={{ color: 'var(--gold)' }}>Skills</span></h2>
        <p style={s.desc}>AWS & Azure certified. Full stack to cloud infrastructure.</p>

        <div style={s.grid}>
          {groups.map((g, gi) => (
            <div
              key={g.title}
              style={{
                ...s.card,
                borderColor: hovered === gi ? 'var(--gold-border)' : 'var(--border)',
                background: hovered === gi ? 'var(--bg-card2)' : 'var(--bg-card)',
                transform: hovered === gi ? 'translateY(-4px)' : 'none',
              }}
              onMouseEnter={() => setHovered(gi)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={s.cardHead}>
                <div style={{
                  ...s.iconBox,
                  background: hovered === gi ? 'var(--gold-dim)' : 'rgba(255,255,255,0.04)',
                  borderColor: hovered === gi ? 'var(--gold-border)' : 'var(--border)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={hovered === gi ? 'var(--gold)' : 'var(--muted)'} strokeWidth="2" strokeLinecap="round">
                    {gi === 0 && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>}
                    {gi === 1 && <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>}
                    {gi === 2 && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>}
                    {gi === 3 && <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                    {gi === 4 && <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}
                    {gi === 5 && <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></>}
                  </svg>
                </div>
                <h3 style={{ ...s.cardTitle, color: hovered === gi ? 'var(--gold)' : 'var(--text)' }}>{g.title}</h3>
              </div>
              <div style={s.tags}>
                {g.skills.map(sk => (
                  <span key={sk} style={s.tag}>{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReactIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#61DAFB"><circle cx="12" cy="12" r="2.5"/></svg> }
function NodeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#68A063"><circle cx="12" cy="12" r="2.5"/></svg> }
function AwsIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9900"><circle cx="12" cy="12" r="2.5"/></svg> }
function AzureIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#0089D6"><circle cx="12" cy="12" r="2.5"/></svg> }
function PythonIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#3776AB"><circle cx="12" cy="12" r="2.5"/></svg> }
function DbIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><circle cx="12" cy="12" r="2.5"/></svg> }

const s = {
  section: { padding: '90px 24px', background: 'var(--bg-card)' },
  inner: { maxWidth: 1100, margin: '0 auto', padding: '0' },
  sub: { color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  title: { fontFamily: 'Orbitron, sans-serif', fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 12, letterSpacing: -1 },
  desc: { color: 'var(--muted)', fontSize: 15, marginBottom: 48 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  card: {
    borderRadius: 12, padding: '24px', border: '1px solid',
    transition: 'all 0.25s ease', cursor: 'default',
  },
  cardHead: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 },
  iconBox: {
    width: 40, height: 40, borderRadius: 8, border: '1px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.25s',
  },
  cardTitle: { fontSize: 15, fontWeight: 700, transition: 'color 0.25s', fontFamily: 'Orbitron, sans-serif', letterSpacing: 0.5 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: {
    background: 'rgba(255,255,255,0.04)', color: 'var(--muted)',
    padding: '5px 12px', borderRadius: 5,
    fontSize: 12, fontWeight: 500, border: '1px solid var(--border)',
  },
}
