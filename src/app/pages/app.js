import { useState } from "react";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { parseUnits } from "viem";
import { poeABI } from "./poeABI";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const { chains, provider } = configureChains([mainnet], [publicProvider()]);
const client = createClient({ autoConnect: true, provider });

export default function OddsVerifierUI() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const [team, setTeam] = useState("");
  const [threshold, setThreshold] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const { config } = usePrepareContractWrite({
    address: "0x2D516940c9938715eE50290a6e10f21679c30f1b",
    abi: poeABI,
    functionName: "submitClaim",
    args: [team, parseUnits(threshold, 0), parseUnits(timestamp, 0)],
  });

  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <WagmiConfig client={client}>
      <div className="flex flex-col items-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Submit an Odds Claim</h2>
            {!isConnected ? (
              <Button onClick={() => connect()}>Connect Wallet</Button>
            ) : (
              <>
                <p>Connected as {address}</p>
                <Button onClick={() => disconnect()}>Disconnect</Button>
                <input
                  type="text"
                  placeholder="Team Name"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Threshold Odds"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Timestamp"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <Button
                  onClick={() => write?.()}
                  disabled={!write || isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Claim"}
                </Button>
                {isSuccess && (
                  <p className="text-green-500">
                    Claim submitted successfully!
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </WagmiConfig>
  );
}
