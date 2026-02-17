const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cross-Border Bridge Contract", function () {
  let Bridge, bridge;
  let Token, token;
  let owner, user1, relayer;

  const INITIAL_SUPPLY = ethers.parseEther("10000");
  const DEPOSIT_AMOUNT = ethers.parseEther("100");

  beforeEach(async function () {
    [owner, user1, relayer] = await ethers.getSigners();

    // Deploy a Mock Token for testing
    const TokenFactory = await ethers.getContractFactory("MockToken");
    token = await TokenFactory.deploy("TestToken", "TST", INITIAL_SUPPLY);
    await token.waitForDeployment();

    // Deploy the Bridge
    const BridgeFactory = await ethers.getContractFactory("Bridge");
    bridge = await BridgeFactory.deploy();
    await bridge.waitForDeployment();

    // Setup: Whitelist the token
    await bridge.setTokenSupport(await token.getAddress(), true);

    // Setup: Transfer tokens to user1 and approve bridge
    await token.transfer(user1.address, INITIAL_SUPPLY);
    await token.connect(user1).approve(await bridge.getAddress(), INITIAL_SUPPLY);
  });

  describe("Deposits", function () {
    it("Should lock tokens and emit Deposit event", async function () {
      const targetChainId = 137; // Polygon

      await expect(bridge.connect(user1).deposit(await token.getAddress(), DEPOSIT_AMOUNT, targetChainId))
        .to.emit(bridge, "Deposit")
        .withArgs(user1.address, await token.getAddress(), DEPOSIT_AMOUNT, targetChainId, 1);
        
      // Verify balance in bridge
      expect(await token.balanceOf(await bridge.getAddress())).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should fail if token is not supported", async function () {
      const unsupportedToken = owner.address; // Just a random address
      await expect(
        bridge.connect(user1).deposit(unsupportedToken, DEPOSIT_AMOUNT, 1)
      ).to.be.revertedWithCustomError(bridge, "TokenNotSupported");
    });
  });

  describe("Releases (Admin Only)", function () {
    it("Should release tokens to recipient", async function () {
      // First fund the bridge so it has tokens to give out
      await token.transfer(await bridge.getAddress(), DEPOSIT_AMOUNT);

      const sourceChainId = 1;
      const nonce = 1;

      await expect(
        bridge.release(await token.getAddress(), DEPOSIT_AMOUNT, user1.address, sourceChainId, nonce)
      ).to.emit(bridge, "Release");
      
      expect(await token.balanceOf(user1.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should prevent replay attacks (same nonce twice)", async function () {
      await token.transfer(await bridge.getAddress(), DEPOSIT_AMOUNT * 2n);
      
      // First release - OK
      await bridge.release(await token.getAddress(), DEPOSIT_AMOUNT, user1.address, 1, 1);

      // Second release with same nonce - FAIL
      await expect(
        bridge.release(await token.getAddress(), DEPOSIT_AMOUNT, user1.address, 1, 1)
      ).to.be.revertedWithCustomError(bridge, "NonceAlreadyProcessed");
    });
  });
});