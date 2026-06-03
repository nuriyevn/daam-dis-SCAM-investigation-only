import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgentNFT", function () {
  let agentNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const AgentNFT = await ethers.getContractFactory("AgentNFT");
    agentNFT = await AgentNFT.deploy(owner.address);
    await agentNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await agentNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await agentNFT.name()).to.equal("AI Agent NFT");
      expect(await agentNFT.symbol()).to.equal("AGENT");
    });
  });

  describe("Minting", function () {
    it("Should mint a new agent NFT", async function () {
      const tokenURI = "https://example.com/metadata/1";
      const tx = await agentNFT.mintAgent(addr1.address, tokenURI);
      await tx.wait();

      expect(await agentNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await agentNFT.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should increment token counter", async function () {
      await agentNFT.mintAgent(addr1.address, "uri1");
      await agentNFT.mintAgent(addr2.address, "uri2");

      expect(await agentNFT.getCurrentTokenId()).to.equal(2);
    });

    it("Should emit AgentMinted event", async function () {
      const tokenURI = "https://example.com/metadata/1";
      await expect(agentNFT.mintAgent(addr1.address, tokenURI))
        .to.emit(agentNFT, "AgentMinted")
        .withArgs(1, addr1.address, tokenURI);
    });

    it("Should revert when minting to zero address", async function () {
      await expect(
        agentNFT.mintAgent(ethers.ZeroAddress, "uri")
      ).to.be.revertedWith("AgentNFT: cannot mint to zero address");
    });
  });

  describe("Metadata", function () {
    it("Should return correct metadata", async function () {
      const tokenURI = "https://example.com/metadata/1";
      await agentNFT.mintAgent(addr1.address, tokenURI);

      expect(await agentNFT.getAgentMetadata(1)).to.equal(tokenURI);
    });

    it("Should revert when querying non-existent token", async function () {
      await expect(agentNFT.getAgentMetadata(999))
        .to.be.revertedWith("AgentNFT: token does not exist");
    });
  });
});


