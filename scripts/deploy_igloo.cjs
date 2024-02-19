require("@nomiclabs/hardhat-ethers");

async function main() {
  const Igloo = await ethers.getContractFactory("Igloo");
  console.log("Deploying Igloo to ", network.name);

  const [account1] = await ethers.getSigners();

  const igloo = await upgrades.deployProxy(
    Igloo,
    [
      100,
      account1.address,
      BigInt("50000000000000000"),
      BigInt("50000000000000000"),
      BigInt("50000000000000000"),
      BigInt("25000000000000000"),
      BigInt("25000000000000000"),
    ],
    {
      initializer: "initialize",
    },
  );
  await igloo.waitForDeployment();

  console.log("Igloo deployed to:", igloo.target);
  process.exit();
}

main();
