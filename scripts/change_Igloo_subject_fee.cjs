require("@nomiclabs/hardhat-ethers");

async function main() {
  const IglooSubject = await ethers.getContractFactory("IglooSubject");
  const iglooSubjectAddress = "0xa6940B0A43B4832dbfD6Db8a57bb441B905D6dAC";
  const iglooSubject = await IglooSubject.attach(iglooSubjectAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const newProtocolFeePercent = BigInt("0");
  const newSubjectFeePercent = BigInt("100000000000000000");

  const setProtocolFeeTx = await iglooSubject.setProtocolFeePercent(
    newProtocolFeePercent,
  );
  await setProtocolFeeTx.wait();
  console.log(
    `Protocol fee percent is set to ${
      ethers.formatEther(newProtocolFeePercent)
    }%`,
  );

  const setSubjectFeeTx = await iglooSubject.setSubjectFeePercent(
    newSubjectFeePercent,
  );
  await setSubjectFeeTx.wait();
  console.log(
    `Subject fee percent is set to ${
      ethers.formatEther(newSubjectFeePercent)
    }%`,
  );
}

main();
