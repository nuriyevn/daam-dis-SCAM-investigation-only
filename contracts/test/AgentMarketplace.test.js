import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgentMarketplace", function () {
  let agentNFT;
  let marketplace;
  let owner;
  let seller;
  let buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy AgentNFT
    const AgentNFT = await ethers.getContractFactory("AgentNFT");
    agentNFT = await AgentNFT.deploy(owner.address);
    await agentNFT.waitForDeployment();

    // Deploy Marketplace
    const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
    marketplace = await AgentMarketplace.deploy(await agentNFT.getAddress(), owner.address);
    await marketplace.waitForDeployment();
  });

  describe("Listing", function () {
    beforeEach(async function () {
      // Mint an NFT to seller
      await agentNFT.mintAgent(seller.address, "https://example.com/1");
      // Approve marketplace
      await agentNFT.connect(seller).approve(await marketplace.getAddress(), 1);
    });

    it("Should list an agent for sale", async function () {
      const price = ethers.parseEther("1.0");
      await expect(marketplace.connect(seller).listAgent(1, price))
        .to.emit(marketplace, "AgentListed")
        .withArgs(1, seller.address, price);

      const listing = await marketplace.getListing(1);
      expect(listing.active).to.be.true;
      expect(listing.price).to.equal(price);
      expect(listing.seller).to.equal(seller.address);
    });

    it("Should revert if not the owner", async function () {
      await expect(
        marketplace.connect(buyer).listAgent(1, ethers.parseEther("1.0"))
      ).to.be.revertedWith("AgentMarketplace: not the owner");
    });

    it("Should revert if price is zero", async function () {
      await expect(
        marketplace.connect(seller).listAgent(1, 0)
      ).to.be.revertedWith("AgentMarketplace: price must be greater than 0");
    });
  });

  describe("Purchasing", function () {
    beforeEach(async function () {
      await agentNFT.mintAgent(seller.address, "https://example.com/1");
      await agentNFT.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listAgent(1, ethers.parseEther("1.0"));
    });

    it("Should purchase an agent", async function () {
      const price = ethers.parseEther("1.0");
      await expect(
        marketplace.connect(buyer).purchaseAgent(1, { value: price })
      ).to.emit(marketplace, "AgentPurchased");

      expect(await agentNFT.ownerOf(1)).to.equal(buyer.address);
      const listing = await marketplace.getListing(1);
      expect(listing.active).to.be.false;
    });

    it("Should revert if insufficient payment", async function () {
      await expect(
        marketplace.connect(buyer).purchaseAgent(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("AgentMarketplace: insufficient payment");
    });

    it("Should revert if seller tries to buy", async function () {
      await expect(
        marketplace.connect(seller).purchaseAgent(1, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWith("AgentMarketplace: cannot buy own listing");
    });
  });

  describe("Cancelling", function () {
    beforeEach(async function () {
      await agentNFT.mintAgent(seller.address, "https://example.com/1");
      await agentNFT.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listAgent(1, ethers.parseEther("1.0"));
    });

    it("Should cancel a listing", async function () {
      await expect(marketplace.connect(seller).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(1);

      const listing = await marketplace.getListing(1);
      expect(listing.active).to.be.false;
    });
  });
});


