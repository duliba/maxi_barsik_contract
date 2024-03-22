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
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.7.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2,
                    },
                }
            },
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.8.11",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
        ],
    },

    networks: {
        goerli: {
            url: process.env.INFURA_GOERLI,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            //  gas: 2100000,
            gasPrice: 16500000310,
        },
        andromeda: {
            url: "https://andromeda.metis.io",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            verify: {
                etherscan: {
                    apiKey: "apiKey is not required, just set a placeholder",
                    apiUrl:
                        "https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan",
                },
            },
        },
        /* andromeda: {
           url: "https://andromeda.metis.io/?owner=1088",
           accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
         }, */

    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    }
}
