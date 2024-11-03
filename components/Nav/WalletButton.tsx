"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletIcon } from "lucide-react";
import {
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

// This is needed for the wallet modal styles
require("@solana/wallet-adapter-react-ui/styles.css");

export function WalletButton() {
  const { publicKey, connected, connecting, disconnecting, disconnect } =
    useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const connection = new Connection(clusterApiUrl("devnet"));

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, connected]);

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDetails(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  if (connecting || disconnecting) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-6 py-3 bg-gray-600 rounded-lg text-white opacity-75"
      >
        <Loader2 className="animate-spin h-5 w-5" />
        <span>{connecting ? "Connecting..." : "Disconnecting..."}</span>
      </button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-neutral-800 rounded-lg text-white hover:from-gray-800 hover:to-neutral-900 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>{shortenAddress(publicKey.toString())}</span>
        </button>

        {showDetails && (
          <div className="absolute mt-2 w-72 bg-white rounded-lg shadow-xl p-4 z-10 border border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Address
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={copyAddress}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <a
                    href={`https://explorer.solana.com/address/${publicKey.toString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="View on Solana Explorer"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Balance
                </span>
                <span className="text-sm text-gray-900">
                  {balance !== null
                    ? `${balance.toFixed(4)} SOL`
                    : "Loading..."}
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-neutral-800  rounded-lg text-white hover:from-gray-800 hover:to-neutral-900  transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      <WalletIcon className="h-5 w-5" />
      <span>Connect Wallet</span>
    </button>
  );
}
