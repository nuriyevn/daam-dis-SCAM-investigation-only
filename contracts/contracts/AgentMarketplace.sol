// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AgentNFT.sol";

/**
 * @title AgentMarketplace
 * @dev Marketplace contract for buying and selling AI Agent NFTs
 */
contract AgentMarketplace is Ownable, ReentrancyGuard {
    AgentNFT public agentNFT;
    
    // Marketplace fee percentage (basis points, e.g., 250 = 2.5%)
    uint256 public marketplaceFee = 250; // 2.5%
    
    // Listing structure
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }
    
    // Mapping from token ID to listing
    mapping(uint256 => Listing) public listings;
    
    // Events
    event AgentListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event AgentPurchased(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event MarketplaceFeeUpdated(uint256 newFee);
    
    constructor(address _agentNFT, address initialOwner) Ownable(initialOwner) {
        require(_agentNFT != address(0), "AgentMarketplace: invalid agent NFT address");
        agentNFT = AgentNFT(_agentNFT);
    }
    
    /**
     * @dev List an agent NFT for sale
     * @param tokenId The token ID to list
     * @param price The price in wei
     */
    function listAgent(uint256 tokenId, uint256 price) public {
        require(agentNFT.ownerOf(tokenId) == msg.sender, "AgentMarketplace: not the owner");
        require(price > 0, "AgentMarketplace: price must be greater than 0");
        require(!listings[tokenId].active, "AgentMarketplace: already listed");
        require(agentNFT.getApproved(tokenId) == address(this) || 
                agentNFT.isApprovedForAll(msg.sender, address(this)), 
                "AgentMarketplace: marketplace not approved");
        
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });
        
        emit AgentListed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Purchase an agent NFT
     * @param tokenId The token ID to purchase
     */
    function purchaseAgent(uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.active, "AgentMarketplace: not for sale");
        require(msg.value >= listing.price, "AgentMarketplace: insufficient payment");
        require(msg.sender != listing.seller, "AgentMarketplace: cannot buy own listing");
        
        // Mark listing as inactive
        listings[tokenId].active = false;
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer NFT to buyer
        agentNFT.safeTransferFrom(listing.seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        payable(listing.seller).transfer(sellerAmount);
        
        // Transfer fee to marketplace owner
        if (fee > 0) {
            payable(owner()).transfer(fee);
        }
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit AgentPurchased(tokenId, msg.sender, listing.seller, listing.price);
    }
    
    /**
     * @dev Cancel a listing
     * @param tokenId The token ID to cancel listing for
     */
    function cancelListing(uint256 tokenId) public {
        Listing memory listing = listings[tokenId];
        require(listing.active, "AgentMarketplace: not listed");
        require(listing.seller == msg.sender, "AgentMarketplace: not the seller");
        
        listings[tokenId].active = false;
        
        emit ListingCancelled(tokenId);
    }
    
    /**
     * @dev Get listing details
     * @param tokenId The token ID to query
     * @return Listing struct
     */
    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }
    
    /**
     * @dev Update marketplace fee (owner only)
     * @param newFee New fee in basis points
     */
    function setMarketplaceFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "AgentMarketplace: fee too high"); // Max 10%
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(newFee);
    }
}

