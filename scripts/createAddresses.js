const fs = require("fs")
const Web3 = require("web3");
const web3 = new Web3("https://andromeda.metis.io");

const createAccounts = async (addressAmount) => {
    let newAccounts = []
    for (let i = 0; i < addressAmount; i++) {
        const newAccount = web3.eth.accounts.create();
        newAccounts.push(newAccount)
        console.log(`Address ${i + 1}: ${newAccount.address}`);
    }
    fs.writeFileSync("addresses/addresses.json", JSON.stringify(newAccounts))
}

createAccounts(10);