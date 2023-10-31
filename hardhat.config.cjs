require("dotenv/config");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@typechain/hardhat");
require("@nomiclabs/hardhat-solhint");
require("solidity-coverage");
require("hardhat-tracer");
require("@openzeppelin/hardhat-upgrades");

let accounts;
if (process.env.PRIVATE_KEY) {
  accounts = [
    process.env.PRIVATE_KEY ||
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  ];
} else {
  accounts = {
    mnemonic: process.env.MNEMONIC ||
      "test test test test test test test test test test test junk",
  };
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    "avax-fuji": {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      accounts,
      chainId: 43113,
    },
    avax: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      accounts,
      chainId: 43114,
    },
  },
  mocha: {
    timeout: 600000,
  },
  etherscan: {
    apiKey: {
      avax: "PW9EN84Z41F3R6IB2W1853HKDTFP4YQ2FH",
    },
    customChains: [
      {
        network: "avax",
        chainId: 43114,
        urls: {
          apiURL: "https://api.snowtrace.io/api",
          browserURL: "https://snowtrace.io",
        },
      },
    ],
  },
};
