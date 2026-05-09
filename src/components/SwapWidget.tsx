import React, { useState } from 'react'

interface SwapWidgetProps {
  isConnected: boolean
}

interface BridgeResult {
  amount: string
  explorerUrl: string
  fromChain: string
}

export function SwapWidget({ isConnected }: SwapWidgetProps) {
  const [amount, setAmount] = useState('1.00')
  const [isBridging, setIsBridging] = useState(false)
  const [result, setResult] = useState<BridgeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fromChain, setFromChain] = useState('Ethereum_Sepolia')

  const supportedChains = [
    { value: 'Ethereum_Sepolia', label: 'Ethereum Sepolia' },
    { value: 'Base_Sepolia', label: 'Base Sepolia' },
    { value: 'Arbitrum_Sepolia', label: 'Arbitrum Sepolia' },
  ]

  const handleBridge = async () => {
    setIsBridging(true)
    setResult(null)
    setError(null)
    try {
      const { AppKit } = await import('@circle-fin/app-kit')
      const { createViemAdapterFromPrivateKey } = await import('@circle-fin/adapter-viem-v2')
      const kit = new AppKit()
      const privateKey = prompt('Enter your private key for the SOURCE chain')
      if (!privateKey) {
        setError('Cancelled.')
        setIsBridging(false)
        return
      }
      const pk = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey
      const adapter = createViemAdapterFromPrivateKey({ privateKey: pk as `0x${string}` })
      const bridgeResult = await kit.bridge({
        from: { adapter, chain: fromChain },
        to: { adapter, chain: 'Arc_Testnet' },
        amount,
        config: { kitKey: import.meta.env.VITE_KIT_KEY || '' },
      })
      setResult({
        amount,
        explorerUrl: bridgeResult.explorerUrl || 'https://testnet.arcscan.app',
        fromChain,
      })
    } catch (err: any) {
      setError(err.message || 'Bridge failed.')
    } finally {
      setIsBridging(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>Bridge</span>
        <span style={styles.headerBadge}>To Arc Testnet</span>
      </div>
      <div style={styles.body}>
        {!isConnected ? (
          <p style={styles.notConnected}>Connect your wallet to bridge</p>
        ) : (
          <div>
            <div style={styles.tokenBox}>
              <div style={styles.tokenBoxHeader}>
                <span style={styles.tokenBoxLabel}>From chain</span>
              </div>
              <select
                style={styles.chainSelect}
                value={fromChain}
                onChange={e => setFromChain(e.target.value)}
              >
                {supportedChains.map(chain => (
                  <option key={chain.value} value={chain.value}>
                    {chain.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.arrow}>down</div>
            <div style={styles.tokenBox}>
              <div style={styles.tokenBoxHeader}>
                <span style={styles.tokenBoxLabel}>To chain</span>
              </div>
              <div style={styles.toChain}>Arc Testnet</div>
            </div>
            <div style={styles.tokenBox}>
              <div style={styles.tokenBoxHeader}>
                <span style={styles.tokenBoxLabel}>Amount (USDC)</span>
              </div>
              <input
                style={styles.amountInput}
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <button
              style={{ ...styles.bridgeBtn, opacity: isBridging ? 0.7 : 1 }}
              onClick={handleBridge}
              disabled={isBridging || !amount}
            >
              {isBridging ? 'Bridging...' : 'Bridge to Arc'}
            </button>
            {result && (
              <div style={styles.successBox}>
                <p style={styles.successTitle}>Bridge Successful!</p>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Amount</span>
                  <span style={styles.resultValue}>{result.amount} USDC</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Destination</span>
                  <span style={styles.resultValue}>Arc Testnet</span>
                </div>
                <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer" style={styles.explorerLink}>View on ArcScan</a>
              </div>
            )}
            {error && (
              <div style={styles.errorBox}>{error}</div>
            )}
            <p style={styles.disclaimer}>Testnet only - no real funds at risk</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--accent-dim)' },
  headerTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' },
  headerBadge: { fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'rgba(0,212,255,0.1)', padding: '3px 8px', borderRadius: '4px', marginLeft: 'auto' },
  body: { padding: '24px' },
  notConnected: { color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' as const, padding: '40px 0' },
  tokenBox: { background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '8px' },
  tokenBoxHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  tokenBoxLabel: { fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  chainSelect: { width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', cursor: 'pointer' },
  toChain: { fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent)' },
  amountInput: { width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' },
  arrow: { textAlign: 'center' as const, fontSize: '20px', color: 'var(--accent)', margin: '4px 0' },
  bridgeBtn: { width: '100%', padding: '16px', background: 'var(--accent)', color: '#000', fontWeight: '800', fontSize: '16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: 'none', marginTop: '12px', marginBottom: '12px' },
  successBox: { background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '12px' },
  successTitle: { fontSize: '14px', fontWeight: '700', color: 'var(--green)', marginBottom: '4px' },
  resultRow: { display: 'flex', justifyContent: 'space-between' },
  resultLabel: { fontSize: '13px', color: 'var(--text-muted)' },
  resultValue: { fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' },
  explorerLink: { color: 'var(--accent)', fontSize: '13px', textDecoration: 'none', fontWeight: '600', marginTop: '4px' },
  errorBox: { background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: '#ff9090', fontSize: '13px', marginBottom: '12px' },
  disclaimer: { fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' as const, marginTop: '8px' },
}
