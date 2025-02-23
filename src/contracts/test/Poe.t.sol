// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/Poe.sol";
import "./mock/MockERC20.sol";
import "./mock/MockUMAOracle.sol";

contract PoeTest is Test {
    Poe public poe;
    OptimisticOracleV3Interface public umaOracle;
    IERC20 public rewardToken;
    address public user;

    function setUp() public {
        umaOracle = OptimisticOracleV3Interface(address(new MockUMAOracle()));
        rewardToken = IERC20(address(new MockERC20()));
        poe = new Poe(address(umaOracle), address(rewardToken));
        user = address(1);
    }

    function testSubmitClaim() public {
        vm.startPrank(user);
        string memory team = "Lakers";
        uint256 threshold = 200;
        uint256 timestamp = block.timestamp;

        poe.submitClaim(team, threshold, timestamp);

        bytes32 claimId = keccak256(abi.encode(user, team, threshold, timestamp));
        (address claimant,, uint256 storedThreshold, uint256 storedTimestamp, bool resolved,, bytes32 assertionId) =
            poe.claims(claimId);

        assertEq(claimant, user);
        assertEq(storedThreshold, threshold);
        assertEq(storedTimestamp, timestamp);
        assertFalse(resolved);
        assertTrue(assertionId != bytes32(0));
    }

    function testResolveClaim() public {
        vm.startPrank(user);
        string memory team = "Lakers";
        uint256 threshold = 200;
        uint256 timestamp = block.timestamp;
        poe.submitClaim(team, threshold, timestamp);
        vm.stopPrank();

        bytes32 claimId = keccak256(abi.encode(user, team, threshold, timestamp));

        // Mock UMA Oracle resolution
        MockUMAOracle(address(umaOracle)).setResult(true);

        vm.warp(block.timestamp + poe.disputeWindow() + 1);
        poe.resolveClaim(claimId);
        (,,,, bool resolved,,) = poe.claims(claimId);
        assertTrue(resolved);
    }
}
