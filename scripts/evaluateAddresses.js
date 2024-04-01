require("dotenv").config();
const Web3 = require("web3");
const Contract = require('web3-eth-contract');
const web3 = new Web3("https://andromeda.metis.io");
const { BigNumber } = require("ethers");
const fs = require('fs')

const barsikAbi = require("../abis/tokenAbi.json")
// const routerAbi = require("../abis/routerAbi.json")
const usdtTokenAbi = require("../abis/usdtAbi.json")
const metisAbi = require("../abis/metis.json")

const wallets = require("../addresses/addresses.json");

const barsikAddress = "0x60F702A9e3878666E838b0a56fb3DDfC1067C2c0"
const routerAddress = "0x2d4F788fDb262a25161Aa6D6e8e1f18458da8441"
const usdtTokenAddr = "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC"
const metisAddr = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"

const maxUint = BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935")
const halfMaxUint = BigNumber.from("23570985008687907853269984665640564039457584007913129639935")

const sort_by = (field, reverse, primer) => {

    const key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}

const evaluate = async () => {
    Contract.setProvider("https://andromeda.metis.io");
    const maxiContract = new web3.eth.Contract(barsikAbi, barsikAddress);
    const maxiSupply = BigNumber.from(await maxiContract.methods.totalSupply().call())
    console.log(maxiSupply.toString())
    let totalMaxi = 0
    let totalMetis = 0
    // const routerContract = new web3.eth.Contract(routerAbi, routerAddress);
    let objArr = []
    for (let i = 0; i < wallets.length; i++) {
        const barsikBalance = BigNumber.from(await maxiContract.methods.balanceOf(wallets[i].address).call())
        const metisBalance = BigNumber.from(await web3.eth.getBalance(wallets[i].address))
        console.log(barsikBalance.toString())
        console.log(metisBalance.toString())
        const balances = ({ maxiB: barsikBalance / 1e18, maxiPercent: (barsikBalance / maxiSupply * 100).concat("%"), usdt: (metisBalance.toNumber().toFixed(8) / 1e18) })
        const evaluation = ({ address: wallets[i].address, balances })
        totalMaxi += barsikBalance / 1e18
        totalMetis += metisBalance / 1e18
        objArr.push(evaluation)

    }
    objArr.sort(sort_by('maxiB', false, parseInt));
    objArr.push({ totalMaxiB: totalMaxi, totalMetis: totalMetis })
    fs.writeFileSync("addresses/evaluated.json", JSON.stringify(objArr))
}

evaluate();
