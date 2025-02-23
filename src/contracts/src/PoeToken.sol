// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PoeToken is ERC20 {
    constructor() ERC20("PoE", "PoE") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
