import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OracleViewer = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadOracle = async () => {
      try {
        // Create a temporary wallet for viewing
        const dummyWallet = {
          publicKey,
          signTransaction: () => Promise.reject(),
          signAllTransactions: () => Promise.reject(),
          payer: null,
        };

        // Create provider
        const provider = new AnchorProvider(
          connection,
          dummyWallet,
          AnchorProvider.defaultOptions()
        );

        // Set provider as global (required for Anchor)
        anchor.setProvider(provider);

        // Create program
        const programId = new PublicKey(
          "3iLoqsNtqZq2mCCg7CPA9qd2T62vfbMLCAgSvASKzPNv"
        );

        // Get program derived address
        const [oracleAccount] = PublicKey.findProgramAddressSync(
          [Buffer.from("oracle")],
          programId
        );

        // Fetch account info
        const accountInfo = await connection.getAccountInfo(oracleAccount);

        if (accountInfo) {
          console.log("Account found:", accountInfo);

          // You can decode the data using the following structure:
          // 8 bytes for discriminator
          // 8 bytes for base_price (u64)
          // 2 bytes for base_apy_bps (u16)
          const dataView = new DataView(accountInfo.data.buffer);
          const basePrice = dataView.getBigUint64(8, true);
          const baseApyBps = dataView.getUint16(16, true);

          setData({
            basePrice: basePrice.toString(),
            baseApyBps: (baseApyBps / 100).toFixed(2) + "%",
            address: oracleAccount.toString(),
          });
        } else {
          console.log("No account found at:", oracleAccount.toString());
        }
      } catch (error) {
        console.error("Error loading oracle:", error);
      }
    };

    if (connection) {
      loadOracle();
    }
  }, [connection, publicKey]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Oracle Data</CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-2">
                Account: {data.address}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Base Price</p>
                  <p>{data.basePrice} lamports</p>
                </div>
                <div>
                  <p className="text-sm font-medium">APY</p>
                  <p>{data.baseApyBps}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading oracle data...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OracleViewer;
