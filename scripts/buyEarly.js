require("dotenv").config();
const Web3 = require("web3");
const Contract = require('web3-eth-contract');
const web3 = new Web3("https://andromeda.metis.io");
const { BigNumber } = require("ethers");

const barsikAbi = require("../abis/tokenAbi.json")
const routerHermesAbi = require("../abis/routerHermesAbi.json")
const usdtTokenAbi = require("../abis/usdtAbi.json")
const metisAbi = require("../abis/metis.json")
const wallets = require("../addresses/addresses.json")

const barsikAddress = "0xfacA2B369724E73CF29F0f60d9b0Db579AF006Df"
const routerHerculesAddress = "0x14679D1Da243B8c7d1A4c6d0523A2Ce614Ef027C"
const routerHermesAddress = "0x2d4F788fDb262a25161Aa6D6e8e1f18458da8441"
const usdtTokenAddr = "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC"
const metisAddr = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"

const maxUint = BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935")


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

const executeSwaps = async (toToken, fromTimer, toTimer) => {
    Contract.setProvider("https://andromeda.metis.io");
    const routerContract = new web3.eth.Contract(routerHermesAbi, routerHermesAddress);
    const boostedGasPrice = BigNumber.from(await web3.eth.getGasPrice()).mul(11).div(10)
    const minGasSwap = boostedGasPrice.mul('250000')

    for (let i = 0; i < wallets.length; i++) {
        const rnd = ((Math.random() * 2 + 1) * 1e18)
        const multiplier = BigNumber.from(rnd.toFixed(0))
        const minGasRandom = boostedGasPrice.mul('250000').mul(multiplier).div(BigNumber.from(10).pow(18))
        const metisBalance = BigNumber.from(await web3.eth.getBalance(wallets[i].address))
        const gasLeft = minGasSwap.add(minGasRandom)
        if (metisBalance.gt(gasLeft)) {
            const adjustedBalance = metisBalance.sub(gasLeft)
            const encoded = await routerContract.methods.swapExactTokensForTokensSimple(
                adjustedBalance,
                BigNumber.from(0),
                metisAddr,
                toToken,
                false,
                wallets[i].address,
                BigNumber.from(10000000000)).encodeABI()
            //  const encoded = await routerContract.methods.swapExactTokensForTokensSimple(adjustedBalance, BigNumber.from(0), metisAddr, toToken, false, wallets[i].address, BigNumber.from(10000000000)).encodeABI()
            var tx = {
                gas: 250000,
                to: routerHerculesAddress,
                data: encoded,
                gasPrice: boostedGasPrice,
            }
            await web3.eth.accounts.signTransaction(tx, wallets[i].privateKey).then(signed => {
                web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
            })
            const txDelay = (Math.random() * (toTimer - fromTimer)) + fromTimer
            await delay(txDelay)

        }

    }
}
const approveMetisAll = async (routerAddr, onlyCheck) => {
    const tokenContract = new web3.eth.Contract(metisAbi, metisAddr);
    let approvedAmount = 0
    for (let i = 0; i < wallets.length; i++) {
        const metisAllowance = await tokenContract.methods.allowance(wallets[i].address, routerAddr).call()
        if (metisAllowance < 1e28) {
            if (onlyCheck == false) {
                const encoded = await tokenContract.methods.approve(routerAddr, maxUint).encodeABI()
                var tx = {
                    gas: 100000,
                    to: metisAddr,
                    data: encoded
                }
                await web3.eth.accounts.signTransaction(tx, wallets[i].privateKey).then(signed => {
                    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
                })
                await delay(5)
                const metisAllowanceNew = await tokenContract.methods.allowance(wallets[i].address, routerAddr).call()
                if (metisAllowanceNew >= 1e28) approvedAmount++
            }

        } else approvedAmount++
    }
    if (approvedAmount == wallets.length) {
        console.log("All tokens approved")
    } else {
        console.log(`${wallets.length - approvedAmount} wallets not approved`)
    }

}

const approveUsdtAll = async (routerAddr, onlyCheck) => {
    const tokenContract = new web3.eth.Contract(usdtTokenAbi, usdtTokenAddr);
    let approvedAmount = 0
    for (let i = 0; i < wallets.length; i++) {
        const usdtAllowance = await tokenContract.methods.allowance(wallets[i].address, routerAddr).call()
        if (usdtAllowance < 1e28) {
            if (onlyCheck == false) {
                const encoded = await tokenContract.methods.approve(routerAddr, maxUint).encodeABI()
                var tx = {
                    gas: 100000,
                    to: usdtTokenAddr,
                    data: encoded
                }
                await web3.eth.accounts.signTransaction(tx, wallets[i].privateKey).then(signed => {
                    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
                })
                await delay(5)
                const usdtAllowanceNew = await tokenContract.methods.allowance(wallets[i].address, routerAddr).call()
                if (usdtAllowanceNew >= 1e28) approvedAmount++
            }
        } else approvedAmount++
    }
    if (approvedAmount == wallets.length) {
        console.log("All tokens approved")
    } else {
        console.log(`${10 - approvedAmount} wallets not approved`)
    }
}


//APPROVAL
// param1(string):Insert router address you want to check for approval.
// param2(bool):Set onlyCheck to true or false, if true there will be no gas cost,
// false will auto-approve each wallet below min threshold.

approveMetisAll(routerHermesAddress, true)
// approveUsdtAll(routerAddress, true)



// SWAP EXECUTION
// param1(string):Choose token to be bought, make sure it is approved.
// param2(number):Choose min possible delay between swaps in seconds.
// param3(number):Choose max possible delay between swaps in seconds.
// param4(bool):Set saveGas to true or false, if true gas will be saved for one more tx (sell),
// false will use most available gas not leaving enough for another swap

// executeSwaps(barsikAddress, 1, 10);

