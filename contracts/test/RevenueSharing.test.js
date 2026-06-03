import { expect } from "chai";
import { ethers } from "hardhat";

describe("RevenueSharing", function () {
  let revenueSharing;
  let owner;
  let recipient1;
  let recipient2;

  beforeEach(async function () {
    [owner, recipient1, recipient2] = await ethers.getSigners();

    const RevenueSharing = await ethers.getContractFactory("RevenueSharing");
    revenueSharing = await RevenueSharing.deploy(owner.address);
    await revenueSharing.waitForDeployment();
  });

  describe("Revenue Distribution", function () {
    it("Should distribute revenue to multiple recipients", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const shares = [6000, 4000]; // 60% and 40%
      const amount = ethers.parseEther("1.0");

      await expect(
        revenueSharing.distributeRevenue(1, recipients, shares, { value: amount })
      ).to.emit(revenueSharing, "RevenueDistributed");

      expect(await revenueSharing.getRevenueBalance(recipient1.address)).to.equal(
        ethers.parseEther("0.6")
      );
      expect(await revenueSharing.getRevenueBalance(recipient2.address)).to.equal(
        ethers.parseEther("0.4")
      );
    });

    it("Should revert if shares don't sum to 10000", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const shares = [5000, 4000]; // Only 90%

      await expect(
        revenueSharing.distributeRevenue(1, recipients, shares, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWith("RevenueSharing: shares must sum to 10000");
    });

    it("Should revert if arrays length mismatch", async function () {
      const recipients = [recipient1.address];
      const shares = [5000, 5000];

      await expect(
        revenueSharing.distributeRevenue(1, recipients, shares, { value: ethers.parseEther("1.0") })
      ).to.be.revertedWith("RevenueSharing: arrays length mismatch");
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      const recipients = [recipient1.address];
      const shares = [10000];
      await revenueSharing.distributeRevenue(1, recipients, shares, {
        value: ethers.parseEther("1.0"),
      });
    });

    it("Should allow withdrawal of accumulated revenue", async function () {
      await expect(revenueSharing.connect(recipient1).withdrawRevenue())
        .to.emit(revenueSharing, "RevenueWithdrawn")
        .withArgs(recipient1.address, ethers.parseEther("1.0"));

      expect(await revenueSharing.getRevenueBalance(recipient1.address)).to.equal(0);
    });

    it("Should revert if no revenue to withdraw", async function () {
      await expect(
        revenueSharing.connect(recipient2).withdrawRevenue()
      ).to.be.revertedWith("RevenueSharing: no revenue to withdraw");
    });
  });
});


