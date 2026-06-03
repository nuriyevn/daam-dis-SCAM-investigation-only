// Using mock data instead of database for demonstration
import {
  getMockAgentById,
  filterMockAgents,
  getMockAgents,
  getMockUserById,
} from '../data/mockData.js';

/**
 * Create a new agent (mock implementation)
 */
export const createAgent = async (data) => {
  // Generate a new agent ID
  const newId = `agent-${Date.now()}`;
  const newTokenId = getMockAgents().length + 1;
  
  // Get owner from mock users
  const owner = getMockUserById(data.ownerId);
  
  const agent = {
    id: newId,
    tokenId: newTokenId,
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    category: data.category,
    imageUrl: data.imageUrl,
    metadata: data.metadata || {},
    ownerId: data.ownerId,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: owner ? {
      id: owner.id,
      walletAddress: owner.walletAddress,
      name: owner.name,
    } : null,
    listings: [],
  };
  
  return agent;
};

/**
 * Get agent by ID
 */
export const getAgentById = async (id) => {
  return getMockAgentById(id);
};

/**
 * List agents with filters
 */
export const listAgents = async (filters = {}) => {
  const agents = filterMockAgents(filters);
  // Sort by createdAt descending
  return agents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Update agent (mock implementation)
 */
export const updateAgent = async (id, data) => {
  const agent = getMockAgentById(id);
  if (!agent) return null;
  
  return {
    ...agent,
    name: data.name || agent.name,
    description: data.description || agent.description,
    price: data.price ? parseFloat(data.price) : agent.price,
    category: data.category || agent.category,
    imageUrl: data.imageUrl || agent.imageUrl,
    metadata: data.metadata || agent.metadata,
    updatedAt: new Date(),
  };
};

/**
 * Delete agent (mock implementation)
 */
export const deleteAgent = async (id) => {
  // In mock mode, we just return success
  // In real implementation, this would delete from database
  return true;
};

