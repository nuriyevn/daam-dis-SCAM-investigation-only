// Using mock data instead of database for demonstration
import {
  getMockUserById,
  getMockUserByWallet,
  getMockUsers,
  getMockAgents,
  filterMockListings,
} from '../data/mockData.js';

/**
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = getMockUserById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user's agents and listings
    const agents = getMockAgents().filter(a => a.ownerId === id);
    const listings = filterMockListings('active').filter(l => l.sellerId === id);
    
    const userWithRelations = {
      ...user,
      agents,
      listings,
    };
    
    res.json({ success: true, data: userWithRelations });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or get user by wallet address
 */
export const createUser = async (req, res, next) => {
  try {
    const { walletAddress, email, name } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }
    
    // Check if user exists
    let user = getMockUserByWallet(walletAddress);
    
    if (!user) {
      // Create new user (mock implementation)
      const newId = `user-${Date.now()}`;
      user = {
        id: newId,
        walletAddress,
        email: email || null,
        name: name || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (mock implementation)
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // In mock mode, we'll allow updates
    // In production, you'd verify: if (id !== req.user.id)
    
    const user = getMockUserById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedUser = {
      ...user,
      ...req.body,
      updatedAt: new Date(),
    };
    
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

