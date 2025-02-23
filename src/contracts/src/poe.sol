// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV3Interface.sol";

contract ProofOfESPN {
    OptimisticOracleV3Interface public umaOracle;
    IERC20 public rewardToken;
    address public owner;
    uint256 public constant disputeWindow = 2 hours;
    
    struct Claim {
        address claimant;
        string team;
        uint256 threshold;
        uint256 timestamp;
        bool resolved;
        bool disputed;
    }
    
    mapping(bytes32 => Claim) public claims;
    
    event ClaimSubmitted(bytes32 indexed claimId, address indexed claimant, string team, uint256 threshold, uint256 timestamp);
    event ClaimResolved(bytes32 indexed claimId, bool success);
    event ClaimDisputed(bytes32 indexed claimId);
    
    constructor(address _umaOracle, address _rewardToken) {
        umaOracle = OptimisticOracleV3Interface(_umaOracle);
        rewardToken = IERC20(_rewardToken);
        owner = msg.sender;
    }
    
    function submitClaim(string memory team, uint256 threshold, uint256 timestamp) external {
        bytes32 claimId = keccak256(abi.encode(msg.sender, team, threshold, timestamp));
        require(claims[claimId].claimant == address(0), "Claim already exists");
        
        claims[claimId] = Claim({
            claimant: msg.sender,
            team: team,
            threshold: threshold,
            timestamp: timestamp,
            resolved: false,
            disputed: false
        });
        
        umaOracle.requestPrice(
            "ESPN_ODDS",
            timestamp,
            abi.encode(team, threshold)
        );
        
        emit ClaimSubmitted(claimId, msg.sender, team, threshold, timestamp);
    }
    
    function resolveClaim(bytes32 claimId) external {
        Claim storage claim = claims[claimId];
        require(!claim.resolved, "Claim already resolved");
        require(block.timestamp >= claim.timestamp + disputeWindow, "Dispute window not over");
        
        (int256 price, ) = umaOracle.getPrice("ESPN_ODDS", claim.timestamp);
        require(price != -1, "Price not resolved");
        
        if (uint256(price) >= claim.threshold) {
            rewardToken.transfer(claim.claimant, 1e18);
        }
        
        claim.resolved = true;
        emit ClaimResolved(claimId, uint256(price) >= claim.threshold);
    }
    
    function disputeClaim(bytes32 claimId) external {
        Claim storage claim = claims[claimId];
        require(!claim.resolved, "Claim already resolved");
        require(!claim.disputed, "Claim already disputed");
        
        umaOracle.proposePrice(
            "ESPN_ODDS", 
            claim.timestamp, 
            abi.encode(claim.team, claim.threshold)
        );
        
        claim.disputed = true;
        emit ClaimDisputed(claimId);
    }
}
