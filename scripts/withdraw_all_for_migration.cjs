require("@nomiclabs/hardhat-ethers");

async function main() {
  const IglooSubject = await ethers.getContractFactory("IglooSubject");
  const iglooSubjectAddress = "0xa6940B0A43B4832dbfD6Db8a57bb441B905D6dAC";
  const iglooSubject = await IglooSubject.attach(iglooSubjectAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const setSubjectFeeTx = await iglooSubject.withdrawAllForMigration();
  await setSubjectFeeTx.wait();
  console.log("Withdraw all for migration tx:", setSubjectFeeTx.hash);

  process.exit();
}

main();
