import { useState, useCallback } from 'react'

const WEB3FORMS_KEY      = '9b6d9035-1122-469e-8499-5ff04f048756'
const ABSTRACT_EMAIL_KEY = 'ff104ff7372f497fb375814e7fda7e3a'
const ABSTRACT_PHONE_KEY = '76558c81c3bf4d89897ed3a507385e27'

const services = [
  { title: 'Fintech Dashboards', desc: 'Trading platforms, crypto trackers, portfolio managers' },
  { title: 'Cloud Architecture', desc: 'AWS & Azure setup, serverless, CI/CD pipelines' },
  { title: 'Full Stack Apps', desc: 'React + Node.js + MySQL / DynamoDB web applications' },
  { title: 'E-Commerce', desc: 'Online stores, payment integration, product management' },
]

const ICONS = [
  <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
  <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
]

export default function Contact() {
  const [hovered, setHovered]         = useState(null)
  const [form, setForm]               = useState({ name: '', email: '', confirmEmail: '', phone: '', project: '', message: '' })
  const [status, setStatus]           = useState('idle') // idle | sending | success | error
  const [copied, setCopied]           = useState(false)
  const [sentEmail, setSentEmail]     = useState('')
  const [emailVerify, setEmailVerify] = useState('idle') // idle | checking | valid | invalid | unknown
  const [phoneVerify, setPhoneVerify] = useState('idle') // idle | checking | valid | invalid

  const emailRegex     = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/
  const emailFormatOk  = emailRegex.test(form.email)
  const emailMatch     = emailFormatOk && form.confirmEmail.length > 0 && form.email === form.confirmEmail
  const emailNoMatch   = form.confirmEmail.length > 0 && form.email !== form.confirmEmail
  const emailBadFormat = form.email.length > 4 && !emailFormatOk

  const verifyEmail = useCallback(async () => {
    if (!emailFormatOk) return
    setEmailVerify('checking')
    try {
      const res  = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_EMAIL_KEY}&email=${encodeURIComponent(form.email)}`
      )
      const data = await res.json()
      const deliverable = data.deliverability === 'DELIVERABLE'
      const mxFound     = data.is_mx_found?.value === true
      if (deliverable || mxFound)                    setEmailVerify('valid')
      else if (data.deliverability === 'UNDELIVERABLE') setEmailVerify('invalid')
      else                                            setEmailVerify('unknown')
    } catch {
      setEmailVerify('unknown')
    }
  }, [form.email, emailFormatOk])

  const verifyPhone = useCallback(async () => {
    if (!form.phone || form.phone.trim().length < 7) return
    setPhoneVerify('checking')
    // AbstractAPI doesn't accept '+' or spaces — strip both before sending
    const cleanPhone = form.phone.trim().replace(/^\+/, '').replace(/[\s\-().]/g, '')
    try {
      const res  = await fetch(
        `https://phonevalidation.abstractapi.com/v1/?api_key=${ABSTRACT_PHONE_KEY}&phone=${encodeURIComponent(cleanPhone)}`
      )
      const data = await res.json()
      if (data.valid === true) setPhoneVerify('valid')
      else                     setPhoneVerify('invalid')
    } catch {
      setPhoneVerify('valid') // API error — don't block optional field
    }
  }, [form.phone])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'email') setEmailVerify('idle')
    if (e.target.name === 'phone') setPhoneVerify('idle')
  }

  // Phone is optional — only block if user filled it AND it's invalid
  const phoneOk = !form.phone || form.phone.trim().length < 3 || phoneVerify === 'valid' || phoneVerify === 'idle'

  const canSubmit = emailMatch && emailVerify !== 'idle' && emailVerify !== 'checking' && emailVerify !== 'invalid' && status !== 'sending'

  const handleSubmit = async e => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    setSentEmail(form.email)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Freelance Inquiry: ${form.project}`,
          from_name: form.name,
          replyto: form.email,
          botcheck: '',
          ...form,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', confirmEmail: '', project: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText('shaikhshafik987@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

        {/* Services */}
        <div style={s.servicesGrid}>
          {services.map((sv, i) => (
            <div
              key={sv.title}
              style={{
                ...s.serviceCard,
                borderColor: hovered === i ? 'var(--gold-border)' : 'var(--border)',
                background:  hovered === i ? 'var(--gold-dim)'    : 'var(--bg)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" style={{ marginBottom: 10, display: 'block' }}>
                {ICONS[i]}
              </svg>
              <h4 style={s.serviceTitle}>{sv.title}</h4>
              <p style={s.serviceDesc}>{sv.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact form + info */}
        <div style={s.grid}>

          {/* Left — info */}
          <div style={s.infoCol}>
            <h3 style={s.infoHeading}>Get in Touch</h3>
            <p style={s.infoText}>
              Fill the form or reach me directly. I reply within 24 hours.
            </p>

            <div style={s.infoItem}>
              <div style={s.infoIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p style={s.infoLabel}>Email</p>
                <a
                  href="mailto:shaikhshafik987@gmail.com?subject=Freelance Project Inquiry"
                  style={{ ...s.infoValue, color: 'var(--gold)', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.2s', display: 'block' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  title="Open in mail app"
                >
                  shaikhshafik987@gmail.com
                </a>
              </div>
              <button onClick={copyEmail} style={s.copyBtn} title="Copy email">
                {copied
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                }
              </button>
            </div>

            <div style={s.infoItem}>
              <div style={s.infoIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <div>
                <p style={s.infoLabel}>LinkedIn</p>
                <a href="https://www.linkedin.com/in/shafik-shaikh" target="_blank" rel="noreferrer" style={{ ...s.infoValue, color: 'var(--gold)' }}>
                  linkedin.com/in/shafik-shaikh
                </a>
              </div>
            </div>

            <div style={s.infoItem}>
              <div style={s.infoIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </div>
              <div>
                <p style={s.infoLabel}>GitHub</p>
                <a href="https://github.com/shafik-shaikh" target="_blank" rel="noreferrer" style={{ ...s.infoValue, color: 'var(--gold)' }}>
                  github.com/shafik-shaikh
                </a>
              </div>
            </div>

            <div style={s.availBadge}>
              <span style={s.availDot} />
              Available for freelance work
            </div>
          </div>

          {/* Right — Form */}
          <div style={s.formCard}>
            {status === 'success' ? (
              <div style={s.successBox}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
                </svg>
                <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, color: 'var(--text)', margin: '16px 0 8px' }}>
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>
                  I'll get back to you within 24 hours.
                </p>
                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid var(--gold-border)', borderRadius: 8, padding: '10px 16px', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Reply will be sent to: </span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{sentEmail}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>
                  Wrong email? Send again with the correct one.
                </p>
                <button onClick={() => setStatus('idle')} style={{ ...s.submitBtn, marginTop: 16, width: 'auto', padding: '10px 24px' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={s.form}>
                <h3 style={s.formTitle}>Send a Message</h3>

                <div style={s.row}>
                  <div style={s.fieldGroup}>
                    <label style={s.label} htmlFor="cf-name">Your Name</label>
                    <input
                      id="cf-name" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="John Doe"
                      style={s.input}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label} htmlFor="cf-email">
                      Your Email
                      {emailBadFormat                && <span style={{ color: '#EF5350', marginLeft: 8 }}>✗ Invalid format</span>}
                      {emailVerify === 'checking'    && <span style={{ color: 'var(--gold)', marginLeft: 8 }}>⟳ Verifying...</span>}
                      {emailVerify === 'valid'       && <span style={{ color: '#4ADE80',   marginLeft: 8 }}>✓ Email verified</span>}
                      {emailVerify === 'invalid'     && <span style={{ color: '#EF5350',   marginLeft: 8 }}>✗ Email does not exist</span>}
                      {emailVerify === 'unknown'     && <span style={{ color: '#F59E0B',   marginLeft: 8 }}>⚠ Could not verify</span>}
                    </label>
                    <input
                      id="cf-email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="john@example.com"
                      onBlur={verifyEmail}
                      style={{
                        ...s.input,
                        borderColor:
                          emailBadFormat             ? '#EF5350' :
                          emailVerify === 'valid'    ? '#4ADE80' :
                          emailVerify === 'invalid'  ? '#EF5350' :
                          emailVerify === 'checking' ? 'var(--gold)' :
                          'rgba(255,255,255,0.1)',
                      }}
                    />
                    {emailBadFormat && (
                      <p style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>
                        Enter a valid email like name@domain.com
                      </p>
                    )}
                    {emailVerify === 'invalid' && (
                      <p style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>
                        This email address does not exist. Please check and try again.
                      </p>
                    )}
                  </div>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label} htmlFor="cf-confirm-email">
                    Confirm Email
                    {emailMatch    && <span style={{ color: '#4ADE80', marginLeft: 8 }}>✓ Emails match</span>}
                    {emailNoMatch  && <span style={{ color: '#EF5350', marginLeft: 8 }}>✗ Emails don't match</span>}
                  </label>
                  <input
                    id="cf-confirm-email" name="confirmEmail" type="email" required
                    value={form.confirmEmail} onChange={handleChange}
                    placeholder="Re-enter your email"
                    style={{
                      ...s.input,
                      borderColor: emailNoMatch ? '#EF5350' : emailMatch ? '#4ADE80' : 'rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => { if (!emailNoMatch && !emailMatch) e.target.style.borderColor = 'var(--gold)' }}
                    onBlur={e  => { if (!emailNoMatch && !emailMatch) e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  />
                  {emailNoMatch && (
                    <p style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>
                      Please make sure both email addresses are the same.
                    </p>
                  )}
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label} htmlFor="cf-phone">
                    Phone Number
                    <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 6 }}>(Optional)</span>
                    {phoneVerify === 'checking' && <span style={{ color: 'var(--gold)',  marginLeft: 8 }}>⟳ Verifying...</span>}
                    {phoneVerify === 'valid'    && <span style={{ color: '#4ADE80',      marginLeft: 8 }}>✓ Valid number</span>}
                    {phoneVerify === 'invalid'  && <span style={{ color: '#EF5350',      marginLeft: 8 }}>✗ Invalid number</span>}
                  </label>
                  <input
                    id="cf-phone" name="phone" type="tel"
                    value={form.phone} onChange={handleChange}
                    onBlur={verifyPhone}
                    placeholder="+1 555 123 4567 or +91 98765 43210"
                    style={{
                      ...s.input,
                      borderColor:
                        phoneVerify === 'valid'   ? '#4ADE80' :
                        phoneVerify === 'invalid' ? '#EF5350' :
                        'rgba(255,255,255,0.1)',
                    }}
                  />
                  {phoneVerify === 'invalid' && (
                    <p style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>
                      Enter number with country code, e.g. +91 9876543210
                    </p>
                  )}
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label} htmlFor="cf-project">Project Type</label>
                  <select
                    id="cf-project" name="project" required
                    value={form.project} onChange={handleChange}
                    style={{ ...s.input, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    <option value="" disabled>Select a service...</option>
                    <option value="Fintech Dashboard">Fintech / Trading Dashboard</option>
                    <option value="Cloud Architecture">Cloud Architecture (AWS / Azure)</option>
                    <option value="Full Stack App">Full Stack Web App</option>
                    <option value="E-Commerce">E-Commerce Website</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label} htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message" name="message" required rows={4}
                    value={form.message} onChange={handleChange}
                    placeholder="Tell me about your project, budget, and timeline..."
                    style={{ ...s.input, resize: 'vertical', minHeight: 110 }}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                {emailVerify === 'invalid' && (
                  <div style={s.blockMsg}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Email address does not exist. Please enter a real email so I can reply to you.
                  </div>
                )}

                {!emailMatch && form.confirmEmail.length > 0 && (
                  <div style={s.blockMsg}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Both email fields must match before you can submit.
                  </div>
                )}

                {status === 'error' && (
                  <p style={s.errorMsg}>
                    Something went wrong. Please email me directly at shaikhshafik987@gmail.com
                  </p>
                )}

                <button type="submit" disabled={!canSubmit} style={{
                  ...s.submitBtn,
                  opacity: canSubmit ? 1 : 0.5,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}>
                  {status === 'sending' ? (
                    <>
                      <span style={s.btnSpinner} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 8 }}>
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const s = {
  section: { padding: '90px 24px', background: 'var(--bg-card)' },
  inner:   { maxWidth: 1100, margin: '0 auto' },
  sub:   { color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  title: { fontFamily: 'Orbitron, sans-serif', fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 16, letterSpacing: -1, lineHeight: 1.2 },
  desc:  { color: 'var(--muted)', fontSize: 15, marginBottom: 48 },

  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 56 },
  serviceCard:  { padding: '22px', borderRadius: 10, border: '1px solid', transition: 'all 0.25s', cursor: 'default' },
  serviceTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 },
  serviceDesc:  { color: 'var(--muted)', fontSize: 12, lineHeight: 1.6 },

  grid:    { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, alignItems: 'start' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: 24 },
  infoHeading: { fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text)' },
  infoText:    { color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginTop: -8 },

  infoItem:   { display: 'flex', alignItems: 'center', gap: 14 },
  infoIconBox: {
    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
    background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { fontSize: 13, color: 'var(--text)', fontWeight: 600 },
  copyBtn: {
    marginLeft: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 6, width: 30, height: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    transition: 'border-color 0.2s', flexShrink: 0,
  },
  availBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
    color: '#4ADE80', padding: '8px 16px', borderRadius: 20,
    fontSize: 12, fontWeight: 600, width: 'fit-content',
  },
  availDot: {
    width: 7, height: 7, borderRadius: '50%', background: '#4ADE80',
    boxShadow: '0 0 6px #4ADE80', display: 'inline-block', animation: 'pulse 2s infinite',
  },

  formCard: {
    background: 'var(--bg)', borderRadius: 16, padding: '32px',
    border: '1px solid var(--border)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  formTitle: { fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.8 },
  input: {
    background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '11px 14px',
    color: 'var(--text)', fontSize: 14,
    outline: 'none', width: '100%',
    transition: 'border-color 0.2s',
    fontFamily: 'Exo 2, sans-serif',
  },
  errorMsg: {
    background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)',
    color: '#EF5350', padding: '10px 14px', borderRadius: 8, fontSize: 13,
  },
  blockMsg: {
    background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)',
    color: '#EF5350', padding: '10px 14px', borderRadius: 8, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500,
  },
  submitBtn: {
    background: 'var(--gold)', color: '#0F172A',
    padding: '13px 28px', borderRadius: 8, width: '100%',
    fontSize: 14, fontWeight: 700, border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
    transition: 'opacity 0.2s',
  },
  btnSpinner: {
    width: 16, height: 16, border: '2px solid rgba(15,23,42,0.3)',
    borderTopColor: '#0F172A', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite', marginRight: 8, display: 'inline-block',
  },
  successBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
  },
}
