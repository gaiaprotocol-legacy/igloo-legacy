require("@nomiclabs/hardhat-ethers");

async function main() {
  const Igloo = await ethers.getContractFactory("Igloo");
  const iglooAddress = "0xd1a4964954785ddbC8C86a5412cE400f6E8d81D3";
  const igloo = await Igloo.attach(iglooAddress);

  console.log("Igloo owner:", await igloo.owner());
  process.exit();
}

main();
