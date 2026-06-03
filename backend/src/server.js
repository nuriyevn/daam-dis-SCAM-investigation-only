import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/index.js';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import agentRoutes from './routes/agents.js';
import userRoutes from './routes/users.js';
import listingRoutes from './routes/listings.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Agent Marketplace API is running' });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'AI Agent Marketplace API' });
});

app.use('/api/agents', agentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Skip database connection when using mock data
    // Uncomment the line below when you want to use a real database
    // await connectDatabase();
    
    console.log('Running in mock data mode (no database connection required)');
    console.log('To use a real database, uncomment connectDatabase() in server.js');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

