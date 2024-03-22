require("dotenv").config();
const Web3 = require("web3");
const Contract = require('web3-eth-contract');
const web3 = new Web3("https://andromeda.metis.io");
const { BigNumber } = require("ethers");

const barsikAbi = require("../abis/tokenAbi.json")
const routerAbi = require("../abis/routerAbi.json")
const usdtTokenAbi = require("../abis/usdtAbi.json")
const metisAbi = require("../abis/metis.json")

const wallets = require("../addresses/addresses.json")

const barsikAddress = "0xfacA2B369724E73CF29F0f60d9b0Db579AF006Df"
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

const executeSwaps = async (toToken, delayBetweenSwaps, handleAllowance) => {
    Contract.setProvider("https://andromeda.metis.io");
    const routerContract = new web3.eth.Contract(routerAbi, routerAddress);
    const tokenContract = new web3.eth.Contract(metisAbi, metisAddr);
    const blockNumber = await web3.eth.getBlockNumber()
    console.log(`Current block number is ${blockNumber}`)
    const gasPrice = await web3.eth.getGasPrice()
    console.log(`Current average gas price is ${gasPrice}`)
    const minGasMetis = gasPrice * 280000

    for (let i = 0; i < wallets.length; i++) {
        const metisAllowance = await tokenContract.methods.allowance(wallets[i].address, routerAddress).call()
        if (handleAllowance && metisAllowance < 1e28) {
            const encoded = await tokenContract.methods.approve(routerAddress, maxUint).encodeABI()
            var tx = {
                gas: 100000,
                to: metisAddr,
                data: encoded
            }
            await web3.eth.accounts.signTransaction(tx, wallets[i].privateKey).then(signed => {
                web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
            })
        }
        const metisBalance = Number(await web3.eth.getBalance(wallets[i].address))
        if (metisBalance > minGasMetis) {
            const adjustedBalance = (metisBalance - minGasMetis).toString(10)

            const encoded = await routerContract.methods.swapExactTokensForTokensSimple(BigNumber.from(adjustedBalance), 0, metisAddr, toToken, false, wallets[i].address, 10000000000).encodeABI()
            var tx = {
                gas: 280000,
                to: routerAddress,
                data: encoded
            }
            await web3.eth.accounts.signTransaction(tx, wallets[i].privateKey).then(signed => {
                web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
            })
            delay(delayBetweenSwaps)
        }

    }
}

/* const exec = async () => {
    Contract.setProvider("https://andromeda.metis.io");
    const routerContract = new web3.eth.Contract(routerAbi, routerAddress);
    const uintVal0 = web3.utils.toWei('0.000001', 'ether'); // web3.eth.abi.encodeParameter('uint256', 100000)
    const uintVal1 = web3.utils.toWei('0', 'ether');  // web3.eth.abi.encodeParameter('uint256', 0)
    const uintVal2 = web3.eth.abi.encodeParameter('uint256', 171102120800)
    const blockNumber = await web3.eth.getBlockNumber()
    const metisBalance = await web3.eth.getBalance(wallets[2].address)
    const gasPrice = await web3.eth.getGasPrice()
    const minGasMetis = 70000 * gasPrice
    const adjustedBalance = (metisBalance - minGasMetis * 1.2).toString()
    const fac = await routerContract.methods.factory().call()
     // estimate gas works only with pre-approved swaps
    //  const estGas = await routerContract.methods.swapExactTokensForTokensSimple
    //     (1000000000000, 0, metisAddr, toToken, false, wallets[0].address, 10000000000).estimateGas({ from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' })
    // console.log(`Current estimated gas limit is ${estGas}`)
    console.log(fac)
    // const encoded = await routerContract.methods.swapExactTokensForTokens("10000", "0", [["0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000", "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC", true]], wallets[1].address, (blockNumber + 10000000)).encodeABI()
    const encoded = await routerContract.methods.swapExactTokensForTokensSimple(81554920000000, 0, "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000", "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC", false, wallets[0].address, 10000000000).encodeABI()
    var tx = {
        gas: 280000,
        to: routerAddress,
        data: encoded
    }
    await web3.eth.accounts.signTransaction(tx, wallets[0].privateKey).then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    })
} */

executeSwaps(usdtTokenAddr, 0.1, true)
