import * as agentService from '../services/agentService.js';

/**
 * Get all agents
 */
export const getAllAgents = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const filters = { category, minPrice, maxPrice };
    const agents = await agentService.listAgents(filters);
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

/**
 * Get agent by ID
 */
export const getAgentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await agentService.getAgentById(id);
    
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    
    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new agent
 */
export const createAgent = async (req, res, next) => {
  try {
    const agentData = {
      ...req.body,
      ownerId: req.user.id, // From auth middleware
    };
    
    const agent = await agentService.createAgent(agentData);
    res.status(201).json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

/**
 * Update agent
 */
export const updateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await agentService.getAgentById(id);
    
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    
    // Check ownership
    if (agent.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const updatedAgent = await agentService.updateAgent(id, req.body);
    res.json({ success: true, data: updatedAgent });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete agent
 */
export const deleteAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await agentService.getAgentById(id);
    
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    
    // Check ownership
    if (agent.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await agentService.deleteAgent(id);
    res.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) {
    next(error);
  }
};


