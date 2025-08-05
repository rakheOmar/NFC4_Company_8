const hre = require("hardhat");

async function main() {
  console.log("Deploying contract...");
  const loggingContract = await hre.ethers.deployContract("Logging");

  await loggingContract.waitForDeployment();

  console.log(`Logging contract deployed to: ${loggingContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
