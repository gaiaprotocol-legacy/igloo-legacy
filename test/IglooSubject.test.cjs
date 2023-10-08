const { ethers } = require("hardhat");
const { expect } = require("chai");
const random = require("random-bigint");

function getPrice(supply, amount) {
  const sum1 = supply == 0n
    ? 0n
    : (supply - 1n) * (supply) * (2n * (supply - 1n) + 1n) / 6n;
  const sum2 = supply == 0n && amount == 1n
    ? 0n
    : (supply - 1n + amount) * (supply + amount) *
      (2n * (supply - 1n + amount) + 1n) / 6n;
  const summation = sum2 - sum1;
  return summation * ethers.parseEther("1") / 100n;
}

describe("IglooSubject Contract", () => {
  let IglooSubject, ERC20, iglooSubject, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the IglooSubject contract
    IglooSubject = await ethers.getContractFactory("IglooSubject");
    iglooSubject = await IglooSubject.deploy();

    // Initialize IglooSubject contract
    await iglooSubject.initialize(
      addr1,
      BigInt("50000000000000000"),
      BigInt("50000000000000000"),
    ); // Replace these parameters with your own values

    ERC20 = await ethers.getContractFactory("ERC20Mock");
  });

  it("price test", async () => {
    const supply = 0n;
    const amount = 1n;
    const price = getPrice(supply + 1n, amount);
    const price2 = await iglooSubject.getPrice(supply, amount);
    console.log(
      `supply: ${supply}, amount: ${amount}, price: ${
        ethers.formatEther(price)
      }, price2: ${ethers.formatEther(price2)}`,
    );
    expect(price2).to.equal(price);

    for (let i = 0; i < 100; i++) {
      const supply = random(32);
      const amount = random(32);
      const price = getPrice(supply + 1n, amount);
      const price2 = await iglooSubject.getPrice(
        supply,
        amount,
      );
      /*console.log(
        `supply: ${supply}, amount: ${amount}, price: ${price}, price2: ${price2}`,
      );*/
      expect(price2).to.equal(price);
    }

    let test = 0n;
    for (let i = 0; i < 100; i++) {
      test += await iglooSubject.getPrice(
        i.toString(),
        "1",
      );
    }
    expect(test).to.equal(
      await iglooSubject.getPrice(
        0n,
        "100",
      ),
    );
  });

  describe("Buy and Sell", function () {
    it("Should buy keys", async function () {
      const price3 = await iglooSubject.getBuyPrice(
        addr2,
        "100",
      );
      console.log(ethers.formatEther(price3));

      const tx2 = await (await iglooSubject.connect(addr1).buyKeys(
        addr2,
        "100",
        {
          value: await iglooSubject.getBuyPriceAfterFee(
            addr2,
            "100",
          ),
        },
      )).wait();

      expect(await iglooSubject.keysBalance(addr2, addr1)).to.equal(
        100n,
      );

      const price4 = await iglooSubject.getSellPrice(
        addr2,
        "100",
      );
      console.log(ethers.formatEther(price4));
    });

    it("Should sell keys", async function () {
      await iglooSubject.connect(addr1).buyKeys(
        addr2,
        "100",
        {
          value: await iglooSubject.getBuyPriceAfterFee(
            addr2,
            "100",
          ),
        },
      );
      await iglooSubject.connect(addr1).sellKeys(
        addr2,
        "50",
      );
      expect(await iglooSubject.keysBalance(addr2, addr1)).to.equal(
        50n,
      );
    });
  });

  describe("Fees", function () {
    it("Should correctly calculate protocol fee", async function () {
      const tx2 = await (await iglooSubject.connect(addr1).buyKeys(
        addr2,
        "100",
        {
          value: await iglooSubject.getBuyPriceAfterFee(
            addr2,
            "100",
          ),
        },
      )).wait();
      console.log(
        tx2.logs[0].args[6],
        tx2.logs[0].args[6] + tx2.logs[0].args[6] / 10n,
      );

      expect(await iglooSubject.keysBalance(addr2, addr1)).to.equal(
        100n,
      );

      await iglooSubject.connect(addr1).sellKeys(
        addr2,
        "100",
      );

      const membershipToken = await ERC20.deploy(
        "Membership Token",
        "MTK",
        ethers.parseEther("100000000"),
      );
      await membershipToken.transfer(addr1.address, ethers.parseEther("10000"));
      await iglooSubject.setMembershipToken(membershipToken.target);
      await iglooSubject.setMembershipWeight(ethers.parseEther("0.0000005"));

      const tx3 = await (await iglooSubject.connect(addr1).buyKeys(
        addr2,
        "100",
        {
          value: await iglooSubject.getBuyPriceAfterFee(
            addr2,
            "100",
          ),
        },
      )).wait();
      console.log(tx3.logs[0].args[6]);
    });
  });
});
