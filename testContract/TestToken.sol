//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    event TokenBurn(address indexed from, uint amount);
    constructor() ERC20("test ww1", "test_ww1") {
        _mint(msg.sender, 1000000 * 1e18);
    }

    function burnTokens(uint tokenAmount) external {
        _burn(msg.sender, tokenAmount);
        emit TokenBurn(msg.sender, tokenAmount);
    }
}
