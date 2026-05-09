import React from 'react'
import { WalletState } from '../hooks/useWallet'
import { EXPLORER_URL } from '../arc.config'

interface HeaderProps {
  wallet: WalletState
  onConnect: () => void
  onDisconnect: () => void
}

function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export function Header({ wallet, onConnect, onDisconnect }: HeaderProps) {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>◈</span>
        <span style={styles.logoText}>ARC</span>
        <span style={styles.logoBadge}>TESTNET</span>
      </div>
      <div style={styles.walletArea}>
        {wallet.isConnected && wallet.address ? (
          <div style={styles.connectedRow}>
            
              <a
              href={EXPLORER_URL + '/address/' + wallet.address}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.addressBadge}
            >
              <span style={styles.dot} />
              {shortenAddress(wallet.address)}
            </a>
            <button style={styles.disconnectBtn} onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <button
            style={styles.connectBtn}
            onClick={onConnect}
            disabled={wallet.isLoading}
          >
            {wallet.isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(10,10,15,0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '22px', color: 'var(--accent)' },
  logoText: { fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', letterSpacing: '4px', color: 'var(--text-primary)' },
  logoBadge: { fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0,212,255,0.2)' },
  walletArea: { display: 'flex', alignItems: 'center' },
  connectedRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  addressBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '13px', textDecoration: 'none' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' },
  disconnectBtn: { padding: '8px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' },
  connectBtn: { padding: '10px 22px', background: 'var(--accent)', color: '#000', fontWeight: '700', fontSize: '14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: 'none', letterSpacing: '0.5px' },
}