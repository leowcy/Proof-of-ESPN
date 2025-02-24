"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract, contractAddress } from "../utils/contract";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [team, setTeam] = useState("");
  const [threshold, setThreshold] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  // NBA team options (simplified list, expand as needed)
  const nbaTeams = [
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "Charlotte Hornets",
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Dallas Mavericks",
    "Denver Nuggets",
    "Detroit Pistons",
    "Golden State Warriors",
    "Houston Rockets",
    "Indiana Pacers",
    "Los Angeles Clippers",
    "Los Angeles Lakers",
    "Memphis Grizzlies",
    "Miami Heat",
    "Milwaukee Bucks",
    "Minnesota Timberwolves",
    "New Orleans Pelicans",
    "New York Knicks",
    "Oklahoma City Thunder",
    "Orlando Magic",
    "Philadelphia 76ers",
    "Phoenix Suns",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "San Antonio Spurs",
    "Toronto Raptors",
    "Utah Jazz",
    "Washington Wizards",
  ];

  // Connect to wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setStatus("Wallet connected!");
      } catch (error) {
        setStatus("Failed to connect wallet: " + error.message);
      }
    } else {
      setStatus("Please install MetaMask!");
    }
  };

  // Check if wallet is connected on load
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });
    }
  }, []);

  // Switch to Sepolia testnet
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Testnet",
              rpcUrls: [
                `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
              ],
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else {
        setStatus("Failed to switch to Sepolia: " + error.message);
      }
    }
  };

  // Submit claim to smart contract
  const submitClaim = async (e) => {
    e.preventDefault();
    if (!account) {
      setStatus("Please connect your wallet first!");
      return;
    }

    try {
      await switchToSepolia();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      // Log for debugging
      console.log("Submitting claim with:", {
        team,
        threshold,
        timestamp: Math.floor(new Date(timestamp).getTime() / 1000),
      });

      const tx = await contract.submitClaim(
        team,
        ethers.toBigInt(threshold), // Explicitly convert to uint256
        Math.floor(new Date(timestamp).getTime() / 1000)
      );
      setStatus("Transaction sent! Waiting for confirmation...");
      await tx.wait();
      setStatus(
        "Claim submitted successfully! Email recorded for notification."
      );
      // TODO: Send `email` to backend
    } catch (error) {
      console.error("Full error:", error);
      setStatus("Error submitting claim: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">ESPN Proof on Sepolia</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mb-6">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <form
        onSubmit={submitClaim}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">NBA Team</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a team</option>
            {nbaTeams.map((teamName) => (
              <option key={teamName} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Threshold</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter threshold"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Timestamp</label>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email (for notification)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter email for notification"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit Claim
        </button>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}