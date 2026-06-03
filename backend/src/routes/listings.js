import express from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  cancelListing,
} from '../controllers/listingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllListings);
router.get('/:id', getListingById);

// Protected routes
router.post('/', authenticate, createListing);
router.delete('/:id', authenticate, cancelListing);

export default router;


