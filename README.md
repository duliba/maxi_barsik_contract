# barsik_contract
Recommended to use VSCode

Goerli testnet
- contract_address will be shown in terminal console after running step 2., its used without "" 
eg. yarn hardhat verify 0x5C1965ff892b36E229E7B86a9096E850ad016819 --network goerli
- in order to use hardhat verify you must enter valid etherscan API code in .env,
this can be acquired from etherscan.com by creating account (free) and navigating to API keys section
- in order to run step 1. you need to create infura, alchemy or similar account to acquire goerli api URL and update .env
- private key in .env has to be updated
- change .env.example to .env
Use terminal and type the following in shown sequence
1. yarn
2. yarn hardhat run scripts/deploy.js --network goerli
3. yarn hardhat verify "contract_address" --network goerli

Metis
1. yarn
2. yarn hardhat run scripts/deploy.js --network andromeda
3. yarn hardhat verify "contract_address" --network andromeda


Goerli token deployed =>
https://goerli.etherscan.io/address/0x4627f54ff4eDC3b1e4bD587bF2bA3f9cE2BbdD90#code