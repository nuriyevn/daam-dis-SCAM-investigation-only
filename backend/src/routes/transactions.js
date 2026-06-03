import express from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', authenticate, getAllTransactions);
router.get('/:id', authenticate, getTransactionById);
router.post('/', authenticate, createTransaction);

export default router;


