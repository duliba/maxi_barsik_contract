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

Metis test token
0x184FC4fEB19881d77C8920A4A3703bea05190337
0x05DD6984E2D59f172652332087bc11B10238640f
0xfacA2B369724E73CF29F0f60d9b0Db579AF006Df


Create addresses 
1. Input desired number of addresses in buyEarly.js createAccounts() function parameter, default is 15
2. In terminal type "yarn hardhat run scripts/createAddresses.js"

Execute buys
1. Create addresses and load them with some Metis, 1$ worth of Metis in each should be enough for testing and to cover gas fees of swap and approve 
2. In buyEarly.js, choose desired parameters in function executeSwaps() at the bottom of the file, first one is address of desired token being
bought in string format, 2nd is time between swap execution in seconds (number), 3rd is option (bool) to automatically approve each address  for trading on Hermes, which is required for swap to succeed. 
3. In terminal type "yarn hardhat run scripts/buyEarly.js"