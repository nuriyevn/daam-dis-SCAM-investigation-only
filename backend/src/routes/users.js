import express from 'express';
import {
  getUserById,
  createUser,
  updateUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createUser);

// Protected routes
router.get('/:id', getUserById);
router.put('/:id', authenticate, updateUser);

export default router;


