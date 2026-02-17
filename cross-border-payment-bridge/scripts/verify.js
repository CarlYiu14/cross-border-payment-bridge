const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.BRIDGE_CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("Please set BRIDGE_CONTRACT_ADDRESS in .env");
    process.exit(1);
  }

  console.log("Verifying Bridge contract...");
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // No constructor args for our Bridge
    });
    console.log("Verification successful!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});