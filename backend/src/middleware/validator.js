import { body, validationResult } from 'express-validator';

/**
 * Validation result handler
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Agent validation rules
 */
export const validateAgent = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidationErrors,
];

/**
 * Listing validation rules
 */
export const validateListing = [
  body('agentId').notEmpty().withMessage('Agent ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidationErrors,
];


