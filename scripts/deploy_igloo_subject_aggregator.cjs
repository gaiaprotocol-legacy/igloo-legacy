require("dotenv/config");
require("@nomiclabs/hardhat-ethers");

async function main() {
  const IglooSubjectAggregator = await ethers.getContractFactory("IglooSubjectAggregator");
  console.log("Deploying IglooSubjectAggregator to ", network.name);

  const aggregator = await IglooSubjectAggregator.deploy(process.env.IGLOO_SUBJECT_ADDRESS);
  await aggregator.waitForDeployment();

  console.log("IglooSubjectAggregator deployed to:", aggregator.target);
}

main();
