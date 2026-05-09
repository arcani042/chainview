import React, { useState } from 'react'
import { WalletState } from '../hooks/useWallet'
import { FAUCET_URL, EXPLORER_URL } from '../arc.config'

interface BalanceCardProps {
  wallet: WalletState
  onRefresh: () => Promise<void>
}

export function BalanceCard({ wallet, onRefresh }: BalanceCardProps) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setTimeout(() => setRefreshing(false), 600)
  }

  if (!wallet.isConnected) {
    return (
      <div style={styles.emptyCard}>
        <span style={styles.emptyIcon}>%</span>
        <p style={styles.emptyText}>Connect your wallet to see your balance</p>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.label}>Balances</span>
        <button style={styles.refreshBtn} onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? '...' : '!'}
        </button>
      </div>
      <div style={styles.tokenRow}>
        <div style={styles.tokenInfo}>
          <span style={{ ...styles.tokenDot, background: '#2775ca' }} />
          <span style={styles.tokenSymbol}>USDC</span>
        </div>
        <span style={styles.tokenAmount}>{wallet.usdcBalance ?? '...'}</span>
      </div>
      <div style={styles.divider} />
      <div style={styles.tokenRow}>
        <div style={styles.tokenInfo}>
          <span style={{ ...styles.tokenDot, background: '#e8a620' }} />
          <span style={styles.tokenSymbol}>EURC</span>
        </div>
        <span style={styles.tokenAmount}>{wallet.eurcBalance ?? '...'}</span>
      </div>
      <div style={styles.networkRow}>
        <span style={styles.networkDot} />
        <span style={styles.networkText}>Arc Testnet - Chain 5042002</span>
      </div>
      <div style={styles.actions}>
        <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer" style={styles.actionLink}>
          Get Test Tokens
        </a>
        <a href={EXPLORER_URL + '/address/' + wallet.address} target="_blank" rel="noopener noreferrer" style={styles.actionLink}>
          View on Explorer
        </a>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  label: { fontSize: '12px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' as const },
  refreshBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer', padding: '2px 6px' },
  tokenRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' },
  tokenInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  tokenDot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  tokenSymbol: { fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' },
  tokenAmount: { fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' },
  divider: { height: '1px', background: 'var(--border)' },
  networkRow: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', marginBottom: '16px' },
  networkDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' },
  networkText: { fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap' as const },
  actionLink: { padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px' },
  emptyCard: { background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', padding: '40px 28px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '12px' },
  emptyIcon: { fontSize: '32px', color: 'var(--text-muted)' },
  emptyText: { color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' as const },
}