import { ethers } from "ethers";

// Replace with your actual contract ABI
export const contractABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_umaOracle",
        type: "address",
        internalType: "address",
      },
      {
        name: "_rewardToken",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claims",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "claimant",
        type: "address",
        internalType: "address",
      },
      {
        name: "team",
        type: "string",
        internalType: "string",
      },
      {
        name: "threshold",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "resolved",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "disputed",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "assertionId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "disputeWindow",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "resolveClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rewardToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "submitClaim",
    inputs: [
      {
        name: "team",
        type: "string",
        internalType: "string",
      },
      {
        name: "threshold",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "umaOracle",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract OptimisticOracleV3Interface",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ClaimDisputed",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimResolved",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "success",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimSubmitted",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "claimant",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "team",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "threshold",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "assertionId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
];


// Contract address from .env.local
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Provider for Sepolia testnet
export const getProvider = () => {
  return new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  );
};

// Get contract instance
export const getContract = (signer) => {
  return new ethers.Contract(
    contractAddress,
    contractABI,
    signer || getProvider()
  );
};
