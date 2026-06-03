import express from 'express';
import {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../controllers/agentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllAgents);
router.get('/:id', getAgentById);

// Protected routes
router.post('/', authenticate, createAgent);
router.put('/:id', authenticate, updateAgent);
router.delete('/:id', authenticate, deleteAgent);

export default router;


