require("@nomiclabs/hardhat-ethers");

async function main() {
  const deployedProxyAddress = process.env.IGLOO_ADDRESS_AVAX_FUJI;
  console.log(deployedProxyAddress);

  const [account1] = await ethers.getSigners();
  console.log("Account1 address: ", account1.address);

  const Igloo = await ethers.getContractFactory("Igloo");
  const igloo = await Igloo.attach(deployedProxyAddress);

  console.log("Igloo owner:", await igloo.owner());

  const IglooUpgrade = await ethers.getContractFactory(
    "Igloo",
  );
  console.log("Upgrading Igloo...");

  await upgrades.upgradeProxy(deployedProxyAddress, IglooUpgrade);
  console.log("Igloo upgraded");

  process.exit();
}

main();
