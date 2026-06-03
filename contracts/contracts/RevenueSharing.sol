// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RevenueSharing
 * @dev Contract for distributing revenue from agent sales to multiple parties
 */
contract RevenueSharing is Ownable, ReentrancyGuard {
    // Revenue balance for each recipient
    mapping(address => uint256) public revenueBalances;
    
    // Revenue history for each agent
    mapping(uint256 => RevenueRecord[]) public revenueHistory;
    
    // Revenue record structure
    struct RevenueRecord {
        uint256 agentId;
        address[] recipients;
        uint256[] amounts;
        uint256 timestamp;
    }
    
    // Events
    event RevenueDistributed(
        uint256 indexed agentId,
        address[] recipients,
        uint256[] amounts,
        uint256 totalAmount
    );
    event RevenueWithdrawn(address indexed recipient, uint256 amount);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Distribute revenue to multiple recipients
     * @param agentId The agent ID this revenue is for
     * @param recipients Array of recipient addresses
     * @param shares Array of shares (in basis points, must sum to 10000)
     */
    function distributeRevenue(
        uint256 agentId,
        address[] memory recipients,
        uint256[] memory shares
    ) public payable {
        require(msg.value > 0, "RevenueSharing: no payment received");
        require(recipients.length == shares.length, "RevenueSharing: arrays length mismatch");
        require(recipients.length > 0, "RevenueSharing: no recipients");
        
        uint256 totalShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares += shares[i];
        }
        require(totalShares == 10000, "RevenueSharing: shares must sum to 10000");
        
        uint256[] memory amounts = new uint256[](recipients.length);
        
        // Calculate and distribute amounts
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "RevenueSharing: invalid recipient");
            amounts[i] = (msg.value * shares[i]) / 10000;
            revenueBalances[recipients[i]] += amounts[i];
        }
        
        // Create revenue record
        revenueHistory[agentId].push(RevenueRecord({
            agentId: agentId,
            recipients: recipients,
            amounts: amounts,
            timestamp: block.timestamp
        }));
        
        emit RevenueDistributed(agentId, recipients, amounts, msg.value);
    }
    
    /**
     * @dev Withdraw accumulated revenue
     */
    function withdrawRevenue() public nonReentrant {
        uint256 balance = revenueBalances[msg.sender];
        require(balance > 0, "RevenueSharing: no revenue to withdraw");
        
        revenueBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
        
        emit RevenueWithdrawn(msg.sender, balance);
    }
    
    /**
     * @dev Get revenue balance for a recipient
     * @param recipient Address to query
     * @return balance The accumulated revenue balance
     */
    function getRevenueBalance(address recipient) public view returns (uint256) {
        return revenueBalances[recipient];
    }
    
    /**
     * @dev Get revenue history for an agent
     * @param agentId The agent ID to query
     * @return records Array of revenue records
     */
    function getRevenueHistory(uint256 agentId) public view returns (RevenueRecord[] memory) {
        return revenueHistory[agentId];
    }
    
    /**
     * @dev Get the number of revenue records for an agent
     * @param agentId The agent ID to query
     * @return count Number of records
     */
    function getRevenueHistoryCount(uint256 agentId) public view returns (uint256) {
        return revenueHistory[agentId].length;
    }
}

