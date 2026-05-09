import { useState, useEffect, useCallback } from 'react'
import { ARC_TESTNET, EURC_ADDRESS } from '../arc.config'

export interface WalletState {
  address: string | null
  usdcBalance: string | null
  eurcBalance: string | null
  isConnected: boolean
  isCorrectNetwork: boolean
  isLoading: boolean
  error: string | null
}

function formatBalance(rawBalance: string): string {
  const num = parseInt(rawBalance, 16) / 1_000_000
  return num.toFixed(2)
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    usdcBalance: null,
    eurcBalance: null,
    isConnected: false,
    isCorrectNetwork: false,
    isLoading: false,
    error: null,
  })

  const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum)

  // Get USDC balance (native token on Arc)
  const getUSDCBalance = useCallback(async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      return formatBalance(balance)
    } catch {
      return '0.00'
    }
  }, [])

  // Get EURC balance (ERC20 token)
  const getEURCBalance = useCallback(async (address: string) => {
    try {
      // ERC20 balanceOf call
      const data = '0x70a08231' + address.slice(2).padStart(64, '0')
      const balance = await window.ethereum.request({
        method: 'eth_call',
        params: [{ to: EURC_ADDRESS, data }, 'latest'],
      })
      return formatBalance(balance)
    } catch {
      return '0.00'
    }
  }, [])

  const switchToArcTestnet = useCallback(async () => {
    const chainIdHex = `0x${ARC_TESTNET.id.toString(16)}`
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: ARC_TESTNET.name,
            nativeCurrency: ARC_TESTNET.nativeCurrency,
            rpcUrls: [ARC_TESTNET.rpcUrls.default.http[0]],
            blockExplorerUrls: [ARC_TESTNET.blockExplorers.default.url],
          }],
        })
      } else {
        throw switchError
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (!hasMetaMask) {
      setWallet(prev => ({ ...prev, error: 'MetaMask not found. Please install it from metamask.io' }))
      return
    }

    setWallet(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const accounts = await new Promise<string[]>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MetaMask timed out. Please open MetaMask manually and try again.'))
        }, 30000)

        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then((accs: string[]) => { clearTimeout(timeout); resolve(accs) })
          .catch((err: any) => { clearTimeout(timeout); reject(err) })
      })

      if (!accounts || accounts.length === 0) throw new Error('No accounts found.')

      const address = accounts[0]
      await switchToArcTestnet()

      const [usdcBalance, eurcBalance] = await Promise.all([
        getUSDCBalance(address),
        getEURCBalance(address),
      ])

      setWallet({
        address,
        usdcBalance,
        eurcBalance,
        isConnected: true,
        isCorrectNetwork: true,
        isLoading: false,
        error: null,
      })

    } catch (err: any) {
      let errorMessage = err.message || 'Failed to connect wallet'
      if (err.code === 4001) errorMessage = 'You rejected the connection. Please try again.'
      if (err.code === -32002) errorMessage = 'MetaMask has a pending request. Please open MetaMask and approve it.'

      setWallet(prev => ({ ...prev, isLoading: false, error: errorMessage }))
    }
  }, [hasMetaMask, switchToArcTestnet, getUSDCBalance, getEURCBalance])

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      usdcBalance: null,
      eurcBalance: null,
      isConnected: false,
      isCorrectNetwork: false,
      isLoading: false,
      error: null,
    })
  }, [])

  const refreshBalances = useCallback(async () => {
    if (!wallet.address) return
    const [usdcBalance, eurcBalance] = await Promise.all([
      getUSDCBalance(wallet.address),
      getEURCBalance(wallet.address),
    ])
    setWallet(prev => ({ ...prev, usdcBalance, eurcBalance }))
  }, [wallet.address, getUSDCBalance, getEURCBalance])

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (wallet.isConnected) {
        Promise.all([getUSDCBalance(accounts[0]), getEURCBalance(accounts[0])]).then(([usdcBalance, eurcBalance]) => {
          setWallet(prev => ({ ...prev, address: accounts[0], usdcBalance, eurcBalance }))
        })
      }
    }

    const handleChainChanged = () => window.location.reload()

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [wallet.isConnected, disconnect, getUSDCBalance, getEURCBalance])

  return { wallet, connect, disconnect, refreshBalances, hasMetaMask }
}

declare global {
  interface Window { ethereum: any }
}