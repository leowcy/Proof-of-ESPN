// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/PoeToken.sol";

contract DeployMockERC20 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        PoeToken mockToken = new PoeToken();

        vm.stopBroadcast();

        console.log("MockERC20 deployed at:", address(mockToken));
    }
}
