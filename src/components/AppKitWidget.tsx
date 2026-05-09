// =============================================
// components/AppKitWidget.tsx
// Wraps Circle's App Kit SDK widgets
// (Swap, Bridge) with a tab interface
// =============================================

import React, { useState, useEffect, useRef } from 'react'
import { CIRCLE_KIT_KEY } from '../arc.config'
import { WalletState } from '../hooks/useWallet'

// These imports come from @circle-fin/app-kit
// They give us ready-made Swap and Bridge UI components
// NOTE: The exact import paths may vary — check docs.arc.network/app-kit

type TabType = 'swap' | 'bridge' | 'send'

interface AppKitWidgetProps {
  wallet: WalletState
}

export function AppKitWidget({ wallet }: AppKitWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>('swap')
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Attempt to initialize the Circle App Kit SDK
  // The SDK is injected as a widget into a container div
  useEffect(() => {
    if (!wallet.isConnected) return

    const initSDK = async () => {
      try {
        // Dynamic import — only load when wallet is connected
        const AppKit = await import('@circle-fin/app-kit')

        // Initialize with Arc Testnet config
        if (AppKit && AppKit.init) {
          await AppKit.init({
  chainId: 5042002,
  rpcUrl: 'https://rpc.testnet.arc.network',
  kitKey: CIRCLE_KIT_KEY,
})
          setSdkLoaded(true)
        }
      } catch (err: any) {
        // SDK not fully installed yet — show manual UI fallback
        setSdkError(err.message)
        setSdkLoaded(false)
      }
    }

    initSDK()
  }, [wallet.isConnected])

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'swap',   label: 'Swap',   icon: '⇄' },
    { id: 'bridge', label: 'Bridge', icon: '⇌' },
    { id: 'send',   label: 'Send',   icon: '↗' },
  ]

  return (
    <div style={styles.container} className="fade-in">
      {/* Tab bar */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Widget body */}
      <div style={styles.widgetBody}>
        {!wallet.isConnected ? (
          <div style={styles.notConnected}>
            <p style={styles.notConnectedText}>
              Connect your wallet to use {activeTab}
            </p>
          </div>
        ) : sdkLoaded ? (
          // When SDK is loaded, it renders here
          <div ref={containerRef} id="arc-app-kit-container" style={styles.sdkContainer} />
        ) : (
          // Fallback UI — shows what the widget will do once SDK is properly installed
          <FallbackWidget tab={activeTab} error={sdkError} />
        )}
      </div>
    </div>
  )
}

// -----------------------------------------------
// FallbackWidget — shown before SDK is installed
// Guides user to complete setup
// -----------------------------------------------
function FallbackWidget({ tab, error }: { tab: TabType; error: string | null }) {
  const content = {
    swap: {
      title: 'Swap USDC ⇄ EURC',
      description: 'Instantly swap between stablecoins on Arc Testnet with zero price volatility.',
      steps: [
        'Install the App Kit: npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 viem',
        'Follow the quickstart at docs.arc.network/app-kit',
        'Add your App Kit API key from Circle Developer Console',
        'The Swap widget will appear here automatically',
      ],
      color: 'var(--usdc-blue)',
    },
    bridge: {
      title: 'Bridge Assets',
      description: 'Move USDC from other testnets (Sepolia, Base) to Arc Testnet via CCTP.',
      steps: [
        'Install: npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 viem',
        'Configure CCTP (Cross-Chain Transfer Protocol)',
        'Add supported source chains in your App Kit config',
        'Bridge widget will render here once configured',
      ],
      color: 'var(--green)',
    },
    send: {
      title: 'Send USDC',
      description: 'Transfer USDC directly to any wallet address on Arc Testnet.',
      steps: [
        'Install the App Kit SDK (see above)',
        'Add Transfer component from @circle-fin/app-kit',
        'Configure recipient address and amount',
        'Send widget will appear here automatically',
      ],
      color: 'var(--accent)',
    },
  }

  const c = content[tab]

  return (
    <div style={styles.fallback}>
      <div style={{ ...styles.fallbackIcon, color: c.color }}>
        {tab === 'swap' ? '⇄' : tab === 'bridge' ? '⇌' : '↗'}
      </div>
      <h3 style={styles.fallbackTitle}>{c.title}</h3>
      <p style={styles.fallbackDesc}>{c.description}</p>

      <div style={styles.stepsBox}>
        <p style={styles.stepsLabel}>Setup Steps:</p>
        {c.steps.map((step, i) => (
          <div key={i} style={styles.step}>
            <span style={{ ...styles.stepNum, background: c.color }}>
              {i + 1}
            </span>
            <span style={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorLabel}>SDK Note: </span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <a
        href="https://docs.arc.network/app-kit"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.docsLink}
      >
        View App Kit Docs →
      </a>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
  },
  tab: {
    flex: 1,
    padding: '14px 16px',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'var(--transition)',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: 'var(--accent)',
    background: 'var(--accent-dim)',
    borderBottom: '2px solid var(--accent)',
  },
  tabIcon: {
    fontSize: '16px',
  },
  widgetBody: {
    padding: '24px',
    minHeight: '320px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  sdkContainer: {
    width: '100%',
    minHeight: '280px',
  },
  notConnected: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  notConnectedText: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '16px',
  },
  fallbackIcon: {
    fontSize: '32px',
  },
  fallbackTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  fallbackDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  stepsBox: {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  stepsLabel: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '2px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
  },
  step: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  stepNum: {
    minWidth: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#000',
    marginTop: '1px',
  },
  stepText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    fontFamily: 'var(--font-mono)',
  },
  errorBox: {
    width: '100%',
    background: 'rgba(255,100,100,0.08)',
    border: '1px solid rgba(255,100,100,0.2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    fontSize: '12px',
  },
  errorLabel: {
    color: '#ff6464',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  errorText: {
    color: 'var(--text-secondary)',
  },
  docsLink: {
    color: 'var(--accent)',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: '600',
  },
}
