require("@nomiclabs/hardhat-ethers");

async function main() {
  const deployedProxyAddress = process.env.IGLOO_SUBJECT_ADDRESS;

  const IglooSubjectUpgrade = await ethers.getContractFactory(
    "IglooSubject",
  );
  console.log("Upgrading IglooSubject...");

  await upgrades.upgradeProxy(deployedProxyAddress, IglooSubjectUpgrade);
  console.log("IglooSubject upgraded");

  process.exit();
}

main();
