// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";


contract MockUMAOracle is OptimisticOracleV3Interface {
    bool public result;

    function setResult(bool _result) external {
        result = _result;
    }

    function assertTruthWithDefaults(
        bytes memory,
        address
    ) external pure override returns (bytes32) {
        return keccak256("mock_assertion");
    }

    function settleAndGetAssertionResult(
        bytes32
    ) external view override returns (bool) {
        return result;
    }

    function defaultIdentifier() external view override returns (bytes32) {}

    function getAssertion(
        bytes32 assertionId
    ) external view override returns (Assertion memory) {}

    function assertTruth(
        bytes memory claim,
        address asserter,
        address callbackRecipient,
        address escalationManager,
        uint64 liveness,
        IERC20 currency,
        uint256 bond,
        bytes32 identifier,
        bytes32 domainId
    ) external override returns (bytes32) {}

    function syncUmaParams(
        bytes32 identifier,
        address currency
    ) external override {}

    function settleAssertion(bytes32 assertionId) external override {}

    function getAssertionResult(
        bytes32 assertionId
    ) external view override returns (bool) {}

    function getMinimumBond(
        address currency
    ) external view override returns (uint256) {}
}