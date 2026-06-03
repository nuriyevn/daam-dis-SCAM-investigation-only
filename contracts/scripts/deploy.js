import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy AgentNFT
  console.log("\nDeploying AgentNFT...");
  const AgentNFT = await ethers.getContractFactory("AgentNFT");
  const agentNFT = await AgentNFT.deploy(deployer.address);
  await agentNFT.waitForDeployment();
  const agentNFTAddress = await agentNFT.getAddress();
  console.log("AgentNFT deployed to:", agentNFTAddress);

  // Deploy AgentMarketplace
  console.log("\nDeploying AgentMarketplace...");
  const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
  const marketplace = await AgentMarketplace.deploy(agentNFTAddress, deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("AgentMarketplace deployed to:", marketplaceAddress);

  // Deploy RevenueSharing
  console.log("\nDeploying RevenueSharing...");
  const RevenueSharing = await ethers.getContractFactory("RevenueSharing");
  const revenueSharing = await RevenueSharing.deploy(deployer.address);
  await revenueSharing.waitForDeployment();
  const revenueSharingAddress = await revenueSharing.getAddress();
  console.log("RevenueSharing deployed to:", revenueSharingAddress);

  // Save addresses
  console.log("\n=== Deployment Summary ===");
  console.log("AgentNFT:", agentNFTAddress);
  console.log("AgentMarketplace:", marketplaceAddress);
  console.log("RevenueSharing:", revenueSharingAddress);
  console.log("\nSave these addresses to your .env files!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


