import { useState, useEffect, useCallback } from 'react';
import {
  connectWallet,
  disconnectWallet,
  getAccount,
  getNetwork,
  onAccountsChanged,
  onChainChanged,
  isMetaMaskInstalled,
} from '../services/web3';

export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Sync address to localStorage for API auth when connected
  useEffect(() => {
    if (address) {
      localStorage.setItem('walletAddress', address);
    } else {
      localStorage.removeItem('walletAddress');
    }
  }, [address]);

  // Check connection on mount and poll when not connected (so we pick up after modal connect)
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) {
        return;
      }

      try {
        const account = await getAccount();
        if (account) {
          setAddress(account);
          setIsConnected(true);
          const net = await getNetwork();
          setNetwork(net);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  // Listen to account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      return;
    }

    const unsubscribe = onAccountsChanged(async (accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        setAddress(accounts[0]);
        const net = await getNetwork();
        setNetwork(net);
      }
    });

    return unsubscribe;
  }, []);

  // Listen to network changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      return;
    }

    const unsubscribe = onChainChanged(async () => {
      const net = await getNetwork();
      setNetwork(net);
    });

    return unsubscribe;
  }, []);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await connectWallet();
      setAddress(result.address);
      setNetwork(result.network);
      setIsConnected(true);
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    setAddress(null);
    setNetwork(null);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem('walletAddress');
  }, []);

  return {
    address,
    network,
    isConnected,
    isConnecting,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
};

