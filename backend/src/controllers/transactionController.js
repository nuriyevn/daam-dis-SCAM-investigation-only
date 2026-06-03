// Using mock data instead of database for demonstration
import {
  filterMockTransactionsByUser,
  getMockTransactionById,
  getMockAgentById,
  getMockUserById,
  getMockTransactions,
} from '../data/mockData.js';

/**
 * Get all transactions for authenticated user
 */
export const getAllTransactions = async (req, res, next) => {
  try {
    // In mock mode, if no user is provided, return all transactions
    // In production, you'd require authentication
    const userId = req.user?.id;
    
    let transactions;
    if (userId) {
      transactions = filterMockTransactionsByUser(userId);
    } else {
      // Return all transactions for demo purposes
      transactions = getMockTransactions();
    }
    
    // Sort by createdAt descending
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction by ID
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = getMockTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    // In mock mode, we'll allow viewing any transaction
    // In production, you'd verify: if (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id)
    
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

/**
 * Create transaction record (mock implementation)
 */
export const createTransaction = async (req, res, next) => {
  try {
    const { agentId, sellerId, amount, txHash } = req.body;
    
    if (!agentId || !sellerId || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const agent = getMockAgentById(agentId);
    const buyer = req.user ? getMockUserById(req.user.id) : getMockUserById('user-1');
    const seller = getMockUserById(sellerId);
    
    if (!agent || !buyer || !seller) {
      return res.status(404).json({ success: false, message: 'Agent, buyer, or seller not found' });
    }
    
    const newTransaction = {
      id: `tx-${Date.now()}`,
      agentId,
      agent: { ...agent },
      buyerId: buyer.id,
      buyer: {
        id: buyer.id,
        walletAddress: buyer.walletAddress,
        name: buyer.name,
      },
      sellerId: seller.id,
      seller: {
        id: seller.id,
        walletAddress: seller.walletAddress,
        name: seller.name,
      },
      amount: parseFloat(amount),
      txHash: txHash || `0x${Math.random().toString(16).substr(2, 64)}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    next(error);
  }
};

