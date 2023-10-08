require("@nomiclabs/hardhat-ethers");

async function main() {
  const IglooSubject = await ethers.getContractFactory("IglooSubject");
  console.log("Deploying IglooSubject to ", network.name);

  const [account1] = await ethers.getSigners();

  const iglooSubject = await upgrades.deployProxy(
    IglooSubject,
    [
      account1.address,
      BigInt("50000000000000000"),
      BigInt("50000000000000000"),
    ],
    {
      initializer: "initialize",
    },
  );
  await iglooSubject.waitForDeployment();

  console.log("IglooSubject deployed to:", iglooSubject.target);
}

main();
