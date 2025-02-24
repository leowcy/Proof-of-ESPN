import OddsVerifierUI from "./app";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Proof of ESPN</h1>
      <OddsVerifierUI />
    </div>
  );
}
