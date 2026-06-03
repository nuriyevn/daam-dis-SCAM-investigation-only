import { ethers } from 'ethers';
import { config } from '../config';

let provider = null;
let signer = null;

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Connect to MetaMask wallet
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Get network
    const network = await provider.getNetwork();
    
    // Check if on correct network
    const targetChainId = BigInt(config.chainId);
    if (network.chainId !== targetChainId) {
      throw new Error(`Please switch to network with chain ID ${config.chainId}`);
    }

    const address = await signer.getAddress();

    return {
      address,
      network: {
        chainId: network.chainId.toString(),
        name: network.name,
      },
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = () => {
  provider = null;
  signer = null;
};

/**
 * Get current account (works with direct MetaMask or after wallet-modal-223 connect)
 */
export const getAccount = async () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      return null;
    }
    const account = accounts[0];
    // Keep provider/signer in sync when we have an account (e.g. connected via modal)
    if (!provider) {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
    }
    return account;
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
};

/**
 * Get current network
 */
export const getNetwork = async () => {
  if (!provider) {
    return null;
  }

  try {
    const network = await provider.getNetwork();
    return {
      chainId: network.chainId.toString(),
      name: network.name,
    };
  } catch (error) {
    console.error('Error getting network:', error);
    return null;
  }
};

/**
 * Switch network
 */
export const switchNetwork = async (chainId) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    if (error.code === 4902) {
      throw new Error('Network not found. Please add it to MetaMask.');
    }
    throw error;
  }
};

/**
 * Get provider instance
 */
export const getProvider = () => {
  return provider;
};

/**
 * Get signer instance
 */
export const getSigner = () => {
  return signer;
};

/**
 * Listen to account changes
 */
export const onAccountsChanged = (callback) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on('accountsChanged', callback);

  return () => {
    window.ethereum.removeListener('accountsChanged', callback);
  };
};

/**
 * Listen to network changes
 */
export const onChainChanged = (callback) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on('chainChanged', callback);

  return () => {
    window.ethereum.removeListener('chainChanged', callback);
  };
};

