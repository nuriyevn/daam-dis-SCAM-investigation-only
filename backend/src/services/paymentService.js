import { verifyTransaction } from './blockchainService.js';

/**
 * Process payment and update transaction status (mock implementation)
 * In mock mode, this function simulates payment processing
 */
export const processPayment = async (transactionId, txHash) => {
  try {
    // Verify transaction on blockchain (mock - always succeeds in demo mode)
    const receipt = await verifyTransaction(txHash);
    
    if (!receipt || receipt.status !== 1) {
      throw new Error('Transaction failed or not found');
    }
    
    // In mock mode, we just return a success response
    // In production, this would update the database using Prisma
    const transaction = {
      id: transactionId,
      txHash,
      status: 'completed',
      // Note: In real implementation, you would:
      // 1. Update transaction status in database
      // 2. Update listing status to 'sold'
      // 3. Transfer agent ownership
    };
    
    return transaction;
  } catch (error) {
    // In mock mode, we just throw the error
    // In production, you would mark transaction as failed in database
    throw error;
  }
};

/**
 * Calculate revenue splits
 */
export const calculateRevenue = (amount, splits) => {
  const total = splits.reduce((sum, split) => sum + split.share, 0);
  
  if (total !== 10000) {
    throw new Error('Revenue splits must sum to 10000 (100%)');
  }
  
  return splits.map(split => ({
    recipient: split.recipient,
    amount: (amount * split.share) / 10000,
  }));
};

