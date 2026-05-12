import React, { useEffect, useState } from 'react'

interface WalletEntry {
  address: string
  txCount: number
  rank: number
}

export function Leaderboard() {
  const [entries, setEntries] = useState<WalletEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchLeaderboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://testnet.arcscan.app/api/v2/transactions?limit=50')
      const data = await response.json()
      const txCounts: Record<string, number> = {}
      data.items.forEach((tx: any) => {
        const from = tx.from?.hash
        if (from) {
          txCounts[from] = (txCounts[from] || 0) + 1
        }
      })
      const sorted = Object.entries(txCounts)
        .map(([address, txCount]) => ({ address, txCount, rank: 0 }))
        .sort((a, b) => b.txCount - a.txCount)
        .slice(0, 10)
        .map((entry, i) => ({ ...entry, rank: i + 1 }))
      setEntries(sorted)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err: any) {
      setError('Failed to load leaderboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 3600000)
    return () => clearInterval(interval)
  }, [])

  function shortenAddress(addr: string): string {
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  function getRankLabel(rank: number): string {
    if (rank === 1) return '1st'
    if (rank === 2) return '2nd'
    if (rank === 3) return '3rd'
    return '#' + rank
  }

  function getRankColor(rank: number): string {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return 'var(--text-muted)'
  }

  function openExplorer(address: string) {
    window.open('https://testnet.arcscan.app/address/' + address, '_blank')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Onchain Leaderboard</h2>
          <p style={styles.subtitle}>Most active wallets on Arc Testnet</p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchLeaderboard} disabled={loading}>
          {loading ? '...' : 'Refresh'}
        </button>
      </div>
      {lastUpdated && (
        <p style={styles.lastUpdated}>Last updated: {lastUpdated} - Auto-refreshes every 1hr</p>
      )}
      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}
      {loading && entries.length === 0 ? (
        <div style={styles.loadingBox}>
          <p style={styles.loadingText}>Fetching onchain activity...</p>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={styles.colRank}>Rank</span>
            <span style={styles.colAddress}>Wallet</span>
            <span style={styles.colTx}>Transactions</span>
          </div>
          {entries.map(entry => (
            <div
              key={entry.address}
              style={styles.tableRow}
              onClick={() => openExplorer(entry.address)}
            >
              <span style={{ ...styles.colRank, color: getRankColor(entry.rank), fontWeight: '700' }}>
                {getRankLabel(entry.rank)}
              </span>
              <span style={styles.colAddress}>
                <span style={styles.addressText}>{shortenAddress(entry.address)}</span>
              </span>
              <span style={styles.colTx}>
                <span style={styles.txBadge}>{entry.txCount} txs</span>
              </span>
            </div>
          ))}
        </div>
      )}
      <p style={styles.disclaimer}>Data from ArcScan - Shows recent transaction activity</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 24px 16px' },
  title: { fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: 'var(--text-muted)' },
  refreshBtn: { background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', padding: '6px 12px' },
  lastUpdated: { fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', padding: '0 24px 16px' },
  errorBox: { margin: '0 24px 16px', background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: '#ff9090', fontSize: '13px' },
  loadingBox: { padding: '40px 24px', display: 'flex', justifyContent: 'center' },
  loadingText: { color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'var(--font-mono)' },
  table: { borderTop: '1px solid var(--border)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '80px 1fr 120px', padding: '10px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' },
  tableRow: { display: 'grid', gridTemplateColumns: '80px 1fr 120px', padding: '14px 24px', borderBottom: '1px solid var(--border)', cursor: 'pointer' },
  colRank: { fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center' },
  colAddress: { display: 'flex', alignItems: 'center' },
  colTx: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
  addressText: { fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' },
  txBadge: { fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(0,212,255,0.2)' },
  disclaimer: { fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' as const, padding: '16px 24px', borderTop: '1px solid var(--border)' },
}