const hre = require("hardhat");

async function main() {
  console.log("Deploying Cross-Border Bridge Contract...");

  const bridge = await hre.ethers.deployContract("Bridge");
  await bridge.waitForDeployment();

  console.log(`Bridge deployed to: ${await bridge.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});