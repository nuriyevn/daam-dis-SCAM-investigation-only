// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAgentMarketplace {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }
    
    function listAgent(uint256 tokenId, uint256 price) external;
    function purchaseAgent(uint256 tokenId) external payable;
    function cancelListing(uint256 tokenId) external;
    function getListing(uint256 tokenId) external view returns (Listing memory);
}


