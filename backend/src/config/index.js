import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ai_agent_marketplace',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
    privateKey: process.env.PRIVATE_KEY || '',
  },
  contractAddresses: {
    agentNFT: process.env.AGENT_NFT_ADDRESS || '',
    agentMarketplace: process.env.AGENT_MARKETPLACE_ADDRESS || '',
    revenueSharing: process.env.REVENUE_SHARING_ADDRESS || '',
  },
};


