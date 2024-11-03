import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function NetworkStatus() {
  const { connected, error } = useWallet();

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (connected) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700">
          Connected to Solana devnet
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
