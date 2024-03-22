require("dotenv").config();

require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "berlin",
      metadata: {
        bytecodeHash: "none",
      },
    },
  },
  networks: {
    "metis-goerli": {
      url: "https://goerli.gateway.metisdevops.link",
    },
    "metis-sepolia": {
      url: "https://sepolia.rpc.metisdevops.link",
    },
    andromeda: {
      url: "https://andromeda.metis.io", // /?owner=1088
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    /*  goerli: {
        url: process.env.INFURA_GOERLI,
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      } */
  },
  etherscan: {
    apiKey: {
      "metis-sepolia": "apiKey is not required, just set a placeholder",
      "metis-goerli": "apiKey is not required, just set a placeholder",
      "andromeda": "apiKey is not required, just set a placeholder",
      //  "goerli": process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "andromeda",
        chainId: 1088,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan",
          browserURL: "https://explorer.metis.io",
        },
      },
      {
        network: "metis-goerli",
        chainId: 599,
        urls: {
          apiURL: "https://goerli.explorer.metisdevops.link/api",
          browserURL: "https://goerli.explorer.metisdevops.link",
        },
      },
      {
        network: "metis-sepolia",
        chainId: 59901,
        urls: {
          apiURL: "https://sepolia.explorer.metisdevops.link/api",
          browserURL: "https://sepolia.explorer.metisdevops.link",
        },
      },
    ],
  },
};
