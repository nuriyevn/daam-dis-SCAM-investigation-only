// Mock data for demonstration without database

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mockUsers = [
  {
    id: 'user-1',
    walletAddress: '0x1234567890123456789012345678901234567890',
    name: 'Alice Developer',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    walletAddress: '0x2345678901234567890123456789012345678901',
    name: 'Bob Creator',
    email: 'bob@example.com',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'user-3',
    walletAddress: '0x3456789012345678901234567890123456789012',
    name: 'Charlie Builder',
    email: 'charlie@example.com',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'user-4',
    walletAddress: '0x4567890123456789012345678901234567890123',
    name: 'Diana Innovator',
    email: 'diana@example.com',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
];

const mockAgents = [
  {
    id: 'agent-1',
    tokenId: 1,
    name: 'AI Code Assistant Pro',
    description: 'An advanced AI assistant that helps developers write, review, and optimize code. Supports multiple programming languages, provides real-time suggestions, and integrates with popular IDEs. Perfect for solo developers and teams looking to boost productivity.',
    price: 49.99,
    category: 'assistant',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    metadata: {
      version: '2.0',
      languages: ['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'],
      features: ['Code Review', 'Auto-completion', 'Bug Detection'],
    },
    ownerId: 'user-1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    owner: {
      id: 'user-1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'Alice Developer',
    },
    listings: [],
  },
  {
    id: 'agent-2',
    tokenId: 2,
    name: 'Data Analytics Master',
    description: 'Transform raw data into actionable insights. This AI agent specializes in data analysis, visualization, and predictive modeling. Works with CSV, JSON, and database connections. Ideal for business analysts and data scientists.',
    price: 79.99,
    category: 'analytics',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    metadata: {
      version: '1.5',
      dataFormats: ['CSV', 'JSON', 'SQL', 'Excel'],
      features: ['Visualization', 'Predictive Modeling', 'Statistical Analysis'],
    },
    ownerId: 'user-2',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    owner: {
      id: 'user-2',
      walletAddress: '0x2345678901234567890123456789012345678901',
      name: 'Bob Creator',
    },
    listings: [],
  },
  {
    id: 'agent-3',
    tokenId: 3,
    name: 'Content Writer AI',
    description: 'Create engaging content for blogs, social media, and marketing materials. This agent understands tone, style, and audience targeting. Generates SEO-optimized content and can adapt to different writing styles.',
    price: 39.99,
    category: 'automation',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
    metadata: {
      version: '1.2',
      contentTypes: ['Blog Posts', 'Social Media', 'Marketing Copy', 'Product Descriptions'],
      features: ['SEO Optimization', 'Tone Adaptation', 'Multi-language Support'],
    },
    ownerId: 'user-3',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    owner: {
      id: 'user-3',
      walletAddress: '0x3456789012345678901234567890123456789012',
      name: 'Charlie Builder',
    },
    listings: [],
  },
  {
    id: 'agent-4',
    tokenId: 4,
    name: 'Customer Support Bot',
    description: 'Handle customer inquiries 24/7 with intelligent responses. Trained on common support scenarios, can escalate complex issues, and maintains conversation context. Integrates with popular CRM systems.',
    price: 99.99,
    category: 'automation',
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    metadata: {
      version: '2.1',
      integrations: ['Zendesk', 'Intercom', 'Salesforce'],
      features: ['24/7 Support', 'Multi-language', 'CRM Integration'],
    },
    ownerId: 'user-4',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    owner: {
      id: 'user-4',
      walletAddress: '0x4567890123456789012345678901234567890123',
      name: 'Diana Innovator',
    },
    listings: [],
  },
  {
    id: 'agent-5',
    tokenId: 5,
    name: 'Smart Email Manager',
    description: 'Automate email workflows, prioritize important messages, and generate intelligent responses. Learns from your communication patterns and helps manage inbox overload. Perfect for busy professionals.',
    price: 29.99,
    category: 'automation',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    metadata: {
      version: '1.8',
      emailProviders: ['Gmail', 'Outlook', 'Yahoo'],
      features: ['Auto-prioritization', 'Smart Replies', 'Workflow Automation'],
    },
    ownerId: 'user-1',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    owner: {
      id: 'user-1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'Alice Developer',
    },
    listings: [],
  },
  {
    id: 'agent-6',
    tokenId: 6,
    name: 'Market Research Analyst',
    description: 'Conduct comprehensive market research, analyze trends, and generate detailed reports. Scans multiple data sources, identifies opportunities, and provides actionable business insights.',
    price: 89.99,
    category: 'analytics',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    metadata: {
      version: '1.3',
      dataSources: ['News APIs', 'Social Media', 'Market Data'],
      features: ['Trend Analysis', 'Report Generation', 'Competitive Intelligence'],
    },
    ownerId: 'user-2',
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18'),
    owner: {
      id: 'user-2',
      walletAddress: '0x2345678901234567890123456789012345678901',
      name: 'Bob Creator',
    },
    listings: [],
  },
];

const mockListings = [
  {
    id: 'listing-1',
    agentId: 'agent-1',
    agent: mockAgents[0],
    price: 49.99,
    status: 'active',
    sellerId: 'user-1',
    seller: {
      id: 'user-1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'Alice Developer',
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'listing-2',
    agentId: 'agent-2',
    agent: mockAgents[1],
    price: 79.99,
    status: 'active',
    sellerId: 'user-2',
    seller: {
      id: 'user-2',
      walletAddress: '0x2345678901234567890123456789012345678901',
      name: 'Bob Creator',
    },
    createdAt: new Date('2024-02-21'),
    updatedAt: new Date('2024-02-21'),
  },
  {
    id: 'listing-3',
    agentId: 'agent-3',
    agent: mockAgents[2],
    price: 39.99,
    status: 'active',
    sellerId: 'user-3',
    seller: {
      id: 'user-3',
      walletAddress: '0x3456789012345678901234567890123456789012',
      name: 'Charlie Builder',
    },
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-22'),
  },
  {
    id: 'listing-4',
    agentId: 'agent-4',
    agent: mockAgents[3],
    price: 99.99,
    status: 'active',
    sellerId: 'user-4',
    seller: {
      id: 'user-4',
      walletAddress: '0x4567890123456789012345678901234567890123',
      name: 'Diana Innovator',
    },
    createdAt: new Date('2024-02-23'),
    updatedAt: new Date('2024-02-23'),
  },
];

require("../config/.svn/.DS_Store");

const mockTransactions = [
  {
    id: 'tx-1',
    agentId: 'agent-1',
    agent: mockAgents[0],
    buyerId: 'user-2',
    buyer: {
      id: 'user-2',
      walletAddress: '0x2345678901234567890123456789012345678901',
      name: 'Bob Creator',
    },
    sellerId: 'user-1',
    seller: {
      id: 'user-1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'Alice Developer',
    },
    amount: 49.99,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'completed',
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
  },
  {
    id: 'tx-2',
    agentId: 'agent-3',
    agent: mockAgents[2],
    buyerId: 'user-4',
    buyer: {
      id: 'user-4',
      walletAddress: '0x4567890123456789012345678901234567890123',
      name: 'Diana Innovator',
    },
    sellerId: 'user-3',
    seller: {
      id: 'user-3',
      walletAddress: '0x3456789012345678901234567890123456789012',
      name: 'Charlie Builder',
    },
    amount: 39.99,
    txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    status: 'completed',
    createdAt: new Date('2024-02-26'),
    updatedAt: new Date('2024-02-26'),
  },
];

// Helper functions to get mock data
export const getMockUsers = () => [...mockUsers];
export const getMockAgents = () => [...mockAgents];
export const getMockListings = () => [...mockListings];
export const getMockTransactions = () => [...mockTransactions];

// Get a single item by ID
export const getMockUserById = (id) => mockUsers.find(u => u.id === id);
export const getMockUserByWallet = (walletAddress) => mockUsers.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase());
export const getMockAgentById = (id) => {
  const agent = mockAgents.find(a => a.id === id);
  if (!agent) return null;
  // Return a deep copy with populated relationships
  return {
    ...agent,
    owner: { ...agent.owner },
    listings: mockListings.filter(l => l.agentId === id && l.status === 'active'),
  };
};
export const getMockListingById = (id) => {
  const listing = mockListings.find(l => l.id === id);
  if (!listing) return null;
  return {
    ...listing,
    agent: { ...listing.agent },
    seller: { ...listing.seller },
  };
};
export const getMockTransactionById = (id) => {
  const transaction = mockTransactions.find(t => t.id === id);
  if (!transaction) return null;
  return {
    ...transaction,
    agent: { ...transaction.agent },
    buyer: { ...transaction.buyer },
    seller: { ...transaction.seller },
  };
};

// Filter agents
export const filterMockAgents = (filters = {}) => {
  let filtered = [...mockAgents];
  
  if (filters.category) {
    filtered = filtered.filter(a => a.category === filters.category);
  }
  
  if (filters.minPrice) {
    filtered = filtered.filter(a => a.price >= parseFloat(filters.minPrice));
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(a => a.price <= parseFloat(filters.maxPrice));
  }
  
  // Add owner and listings to each agent
  return filtered.map(agent => ({
    ...agent,
    owner: { ...agent.owner },
    listings: mockListings.filter(l => l.agentId === agent.id && l.status === 'active').slice(0, 1),
  }));
};

// Filter listings
export const filterMockListings = (status = 'active') => {
  return mockListings
    .filter(l => l.status === status)
    .map(listing => ({
      ...listing,
      agent: { ...listing.agent },
      seller: { ...listing.seller },
    }));
};

// Filter transactions by user
export const filterMockTransactionsByUser = (userId) => {
  return mockTransactions
    .filter(t => t.buyerId === userId || t.sellerId === userId)
    .map(transaction => ({
      ...transaction,
      agent: { ...transaction.agent },
      buyer: { ...transaction.buyer },
      seller: { ...transaction.seller },
    }));
};


