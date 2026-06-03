// Frontend configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  chainId: import.meta.env.VITE_CHAIN_ID || '11155111', // Sepolia testnet
  contractAddresses: {
    AgentNFT: import.meta.env.VITE_AGENT_NFT_ADDRESS || '',
    AgentMarketplace: import.meta.env.VITE_MARKETPLACE_ADDRESS || '',
    RevenueSharing: import.meta.env.VITE_REVENUE_SHARING_ADDRESS || '',
  },
}


