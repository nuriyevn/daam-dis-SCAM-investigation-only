// Using mock data instead of database for demonstration
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { getMockUserByWallet, getMockUserById } from '../data/mockData.js';

/**
 * Authenticate user by wallet address
 * For PoC, we'll use a simple wallet-based auth
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization header' });
    }
    
    // For PoC, we'll accept wallet address directly or JWT token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    // Check if it's a wallet address (starts with 0x and is 42 chars)
    if (token.startsWith('0x') && token.length === 42) {
      // Find or create user by wallet address (using mock data)
      let user = getMockUserByWallet(token);
      
      if (!user) {
        // Create a mock user for demo purposes
        const newId = `user-${Date.now()}`;
        user = {
          id: newId,
          walletAddress: token,
          email: null,
          name: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      
      req.user = user;
      return next();
    }
    
    // Otherwise, try JWT
    try {
      const decoded = jwt.verify(token, config.jwt?.secret || 'demo-secret-key');
      const user = getMockUserById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      
      req.user = user;
      next();
    } catch (jwtError) {
      // In mock mode, if JWT fails, try to find user by ID directly
      // This allows for more flexible demo scenarios
      const user = getMockUserById(token);
      if (user) {
        req.user = user;
        return next();
      }
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

