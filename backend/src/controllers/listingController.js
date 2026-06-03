// Using mock data instead of database for demonstration
import {
  filterMockListings,
  getMockListingById,
  getMockAgentById,
} from '../data/mockData.js';

/**
 * Get all active listings
 */
export const getAllListings = async (req, res, next) => {
  try {
    const listings = filterMockListings('active');
    // Sort by createdAt descending
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

/**
 * Get listing by ID
 */
export const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = getMockListingById(id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

/**
 * Create listing (mock implementation)
 */
export const createListing = async (req, res, next) => {
  try {
    const { agentId, price } = req.body;
    
    if (!agentId || !price) {
      return res.status(400).json({ success: false, message: 'Agent ID and price are required' });
    }
    
    // Verify agent exists
    const agent = getMockAgentById(agentId);
    
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    
    // In mock mode, we'll allow creation without strict auth check
    // In production, you'd verify: if (agent.ownerId !== req.user.id)
    
    const newListing = {
      id: `listing-${Date.now()}`,
      agentId,
      agent: { ...agent },
      price: parseFloat(price),
      sellerId: req.user?.id || agent.ownerId,
      seller: {
        id: req.user?.id || agent.ownerId,
        walletAddress: agent.owner.walletAddress,
        name: agent.owner.name,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel listing (mock implementation)
 */
export const cancelListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = getMockListingById(id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    // In mock mode, we'll allow cancellation
    // In production, you'd verify: if (listing.sellerId !== req.user.id)
    
    const updatedListing = {
      ...listing,
      status: 'cancelled',
      updatedAt: new Date(),
    };
    
    res.json({ success: true, data: updatedListing });
  } catch (error) {
    next(error);
  }
};

