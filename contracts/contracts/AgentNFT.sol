// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentNFT
 * @dev ERC721 token contract for AI Agent NFTs
 * Each agent is represented as an NFT with metadata stored on-chain or via URI
 */
contract AgentNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    // Mapping from token ID to agent metadata
    mapping(uint256 => string) private _agentMetadata;
    
    // Event emitted when a new agent NFT is minted
    event AgentMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    
    constructor(address initialOwner) ERC721("AI Agent NFT", "AGENT") Ownable(initialOwner) {}
    
    /**
     * @dev Mint a new agent NFT
     * @param to Address to mint the NFT to
     * @param tokenURI URI pointing to the agent metadata
     * @return tokenId The ID of the newly minted token
     */
    function mintAgent(address to, string memory uri) public returns (uint256) {
        require(to != address(0), "AgentNFT: cannot mint to zero address");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        _agentMetadata[newTokenId] = uri;
        
        emit AgentMinted(newTokenId, to, uri);
        
        return newTokenId;
    }
    
    /**
     * @dev Get agent metadata URI for a given token ID
     * @param tokenId The token ID to query
     * @return metadata URI string
     */
    function getAgentMetadata(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "AgentNFT: token does not exist");
        return _agentMetadata[tokenId];
    }
    
    /**
     * @dev Get the current token counter
     * @return current token count
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Override tokenURI to return agent metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }
}

