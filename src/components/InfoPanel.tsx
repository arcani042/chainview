// =============================================
// components/InfoPanel.tsx
// Quick links and useful info for builders
// =============================================

import React from 'react'

const links = [
  {
    icon: '📖',
    title: 'Arc Docs',
    desc: 'Full documentation',
    url: 'https://docs.arc.network',
  },
  {
    icon: '🚰',
    title: 'Faucet',
    desc: 'Get free test USDC/EURC',
    url: 'https://faucet.circle.com',
  },
  {
    icon: '🔍',
    title: 'ArcScan',
    desc: 'Block explorer',
    url: 'https://testnet.arcscan.app',
  },
  {
    icon: '💬',
    title: 'Community',
    desc: 'Discord & Hub',
    url: 'https://community.arc.network',
  },
  {
    icon: '📦',
    title: 'App Kit SDK',
    desc: 'Swap, Bridge, Send',
    url: 'https://docs.arc.network/app-kit',
  },
  {
    icon: '💰',
    title: 'Builders Fund',
    desc: 'Apply for funding',
    url: 'https://www.circle.com/blog/introducing-the-arc-builders-fund',
  },
]

export function InfoPanel() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <span style={styles.titleIcon}>⚡</span>
        Builder Resources
      </h2>
      <div style={styles.grid}>
        {links.map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.card}
          >
            <span style={styles.icon}>{link.icon}</span>
            <div>
              <p style={styles.cardTitle}>{link.title}</p>
              <p style={styles.cardDesc}>{link.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '12px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    marginBottom: '14px',
  },
  titleIcon: {
    color: 'var(--accent)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '10px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    textDecoration: 'none',
    transition: 'var(--transition)',
  },
  icon: {
    fontSize: '20px',
    minWidth: '24px',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  cardDesc: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
}
