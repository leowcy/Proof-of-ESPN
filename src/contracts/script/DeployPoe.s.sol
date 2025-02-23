// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Poe.sol";

contract DeployPoe is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address umaOracle = vm.envAddress("UMA_ORACLE");
        address rewardToken = vm.envAddress("REWARD_TOKEN");

        vm.startBroadcast(deployerPrivateKey);

        Poe poe = new Poe(umaOracle, rewardToken);

        vm.stopBroadcast();

        console.log("poe deployed at:", address(poe));
    }
}
