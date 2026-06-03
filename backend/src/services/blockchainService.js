import { ethers } from 'ethers';
import { config } from '../config/index.js';

let provider;
let signer;

/**
 * Initialize blockchain connection
 */
export const initializeProvider = () => {
  if (!config.blockchain.rpcUrl) {
    console.warn('Blockchain RPC URL not configured');
    return null;
  }
  
  provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
  
  if (config.blockchain.privateKey) {
    signer = new ethers.Wallet(config.blockchain.privateKey, provider);
  }
  
  return provider;
};

/**
 * Get contract instance
 */
export const getContractInstance = (address, abi) => {
  if (!provider) {
    initializeProvider();
  }
  
  if (signer) {
    return new ethers.Contract(address, abi, signer);
  }
  
  return new ethers.Contract(address, abi, provider);
};

/**
 * Read from contract
 */
export const readContract = async (contract, method, params = []) => {
  try {
    const result = await contract[method](...params);
    return result;
  } catch (error) {
    console.error(`Error reading contract ${method}:`, error);
    throw error;
  }
};

/**
 * Write to contract (requires signer)
 */
export const writeContract = async (contract, method, params = []) => {
  if (!signer) {
    throw new Error('No signer configured for contract writes');
  }
  
  try {
    const tx = await contract[method](...params);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error(`Error writing to contract ${method}:`, error);
    throw error;
  }
};

/**
 * Listen to contract events
 */
export const listenToEvents = (contract, eventName, callback) => {
  contract.on(eventName, callback);
  
  return () => {
    contract.off(eventName, callback);
  };
};

/**
 * Verify transaction
 */
export const verifyTransaction = async (txHash) => {
  if (!provider) {
    initializeProvider();
  }
  
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
};


