import { ethers } from 'ethers';
import { config } from '../config';
import { getProvider, getSigner } from './web3';

// Contract ABIs (simplified for PoC - in production, import from artifacts)
const AGENT_NFT_ABI = [
  'function mintAgent(address to, string memory tokenURI) public returns (uint256)',
  'function getAgentMetadata(uint256 tokenId) public view returns (string memory)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function approve(address to, uint256 tokenId) public',
  'function getApproved(uint256 tokenId) public view returns (address)',
];

const MARKETPLACE_ABI = [
  'function listAgent(uint256 tokenId, uint256 price) public',
  'function purchaseAgent(uint256 tokenId) public payable',
  'function cancelListing(uint256 tokenId) public',
  'function getListing(uint256 tokenId) public view returns (tuple(uint256 tokenId, address seller, uint256 price, bool active))',
  'function marketplaceFee() public view returns (uint256)',
];

const REVENUE_SHARING_ABI = [
  'function distributeRevenue(uint256 agentId, address[] recipients, uint256[] shares) public payable',
  'function withdrawRevenue() public',
  'function getRevenueBalance(address recipient) public view returns (uint256)',
  'function getRevenueHistory(uint256 agentId) public view returns (tuple(uint256 agentId, address[] recipients, uint256[] amounts, uint256 timestamp)[])',
];

/**
 * Get AgentNFT contract instance
 */
export const getAgentNFTContract = () => {
  const provider = getProvider();
  if (!provider || !config.contractAddresses.AgentNFT) {
    return null;
  }

  return new ethers.Contract(
    config.contractAddresses.AgentNFT,
    AGENT_NFT_ABI,
    provider
  );
};

/**
 * Get AgentMarketplace contract instance
 */
export const getAgentMarketplaceContract = () => {
  const provider = getProvider();
  if (!provider || !config.contractAddresses.AgentMarketplace) {
    return null;
  }

  return new ethers.Contract(
    config.contractAddresses.AgentMarketplace,
    MARKETPLACE_ABI,
    provider
  );
};

/**
 * Get RevenueSharing contract instance
 */
export const getRevenueSharingContract = () => {
  const provider = getProvider();
  if (!provider || !config.contractAddresses.RevenueSharing) {
    return null;
  }

  return new ethers.Contract(
    config.contractAddresses.RevenueSharing,
    REVENUE_SHARING_ABI,
    provider
  );
};

/**
 * List agent on marketplace
 */
export const listAgent = async (tokenId, price) => {
  const signer = getSigner();
  if (!signer) {
    throw new Error('Wallet not connected');
  }

  const marketplace = new ethers.Contract(
    config.contractAddresses.AgentMarketplace,
    MARKETPLACE_ABI,
    signer
  );

  const tx = await marketplace.listAgent(tokenId, price);
  return await tx.wait();
};

/**
 * Purchase agent from marketplace
 */
export const purchaseAgent = async (tokenId, price) => {
  const signer = getSigner();
  if (!signer) {
    throw new Error('Wallet not connected');
  }

  const marketplace = new ethers.Contract(
    config.contractAddresses.AgentMarketplace,
    MARKETPLACE_ABI,
    signer
  );

  const tx = await marketplace.purchaseAgent(tokenId, { value: price });
  return await tx.wait();
};

/**
 * Get listing details
 */
export const getListing = async (tokenId) => {
  const marketplace = getAgentMarketplaceContract();
  if (!marketplace) {
    return null;
  }

  try {
    const listing = await marketplace.getListing(tokenId);
    return {
      tokenId: listing.tokenId.toString(),
      seller: listing.seller,
      price: listing.price.toString(),
      active: listing.active,
    };
  } catch (error) {
    console.error('Error getting listing:', error);
    return null;
  }
};

