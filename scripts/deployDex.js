// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require("console")

async function main() {
    const FactoryContract = await hre.ethers.getContractFactory("BaseV1Factory");
    const factoryContract = await FactoryContract.deploy();

    await factoryContract.deployed();
    console.log("Factory contract deployed to:", factoryContract.address)


    const metisAddress = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"

    const RouterContract = await hre.ethers.getContractFactory("BaseV1Router01");
    const routerContract = await RouterContract.deploy(factoryContract.address, metisAddress);

    await routerContract.deployed();
    console.log("Router contract deployed to:", routerContract.address);
}








// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

