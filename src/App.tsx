import React from 'react'
import { useWallet } from './hooks/useWallet'
import { Header } from './components/Header'
import { BalanceCard } from './components/BalanceCard'
import { SwapWidget } from './components/SwapWidget'
import { InfoPanel } from './components/InfoPanel'
import { Leaderboard } from './components/Leaderboard'

export default function App() {
  const { wallet, connect, disconnect, refreshBalances, hasMetaMask } = useWallet()

  return (
    <div style={styles.app}>
      <Header
        wallet={wallet}
        onConnect={connect}
        onDisconnect={disconnect}
      />
      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>
              Chain<span style={styles.heroAccent}>View</span>
            </h1>
            <p style={styles.heroSub}>
              Your onchain dashboard for Arc Testnet
            </p>
          </div>
          {wallet.error && (
            <div style={styles.errorBanner}>
              <span>{wallet.error}</span>
            </div>
          )}
          <div style={styles.grid}>
            <div style={styles.col}>
              <SectionLabel label="Wallet" />
              <BalanceCard wallet={wallet} onRefresh={refreshBalances} />
            </div>
            <div style={styles.col}>
              <SectionLabel label="Bridge" />
              <SwapWidget isConnected={wallet.isConnected} />
            </div>
          </div>
          <div>
            <SectionLabel label="Leaderboard" />
            <Leaderboard />
          </div>
          <InfoPanel />
          <footer style={styles.footer}>
            <span>Built on Arc Testnet</span>
            <span style={styles.dot}>·</span>
            <span>Powered by Circle</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p style={{
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '3px',
      color: 'var(--text-muted)',
      textTransform: 'uppercase' as const,
      marginBottom: '10px',
    }}>
      {label}
    </p>
  )
}

const styles: Record<string, React.CSSProperties> = {
  app: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, padding: '40px 16px' },
  container: { maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' },
  hero: { textAlign: 'center', padding: '20px 0 8px' },
  heroTitle: { fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px', color: 'var(--text-primary)' },
  heroAccent: { color: 'var(--accent)', textShadow: '0 0 40px var(--accent-glow)' },
  heroSub: { fontSize: '16px', color: 'var(--text-secondary)' },
  errorBanner: { background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.25)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', color: '#ff9090', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' },
  col: { display: 'flex', flexDirection: 'column' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '20px 0', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border)' },
  dot: { color: 'var(--border-bright)' },
  footerLink: { color: 'var(--accent)', textDecoration: 'none' },
}