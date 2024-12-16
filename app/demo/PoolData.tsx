// src/PoolData.js
import React, { useEffect, useState } from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import idl from "./idl (4).json";
import { useWallet } from "@solana/wallet-adapter-react";

// Program ID and IDL
const PROGRAM_ID = new PublicKey(
  "EsMiYxPWqYPHik9HVgTuY3ZaGRqEob9MaaK7WeVqhZgr"
);
const IDL = idl;

// Connection to Devnet
const connection = new Connection("https://api.devnet.solana.com");

const PoolData = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wallet, publicKey } = useWallet();

  useEffect(() => {
    const fetchPoolAccounts = async () => {
      try {
        // Ensure the wallet is connected
        if (!wallet || !publicKey) {
          console.log("Wallet not connected");
          setLoading(false);
          return;
        }

        // Initialize Anchor provider
        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: "processed",
        });

        // Initialize the program
        const program = new Program(IDL, PROGRAM_ID, provider);

        // Fetch all PoolAccount accounts owned by the program
        const poolAccounts = await program.account.poolAccount.all();

        // Map the accounts to a readable format
        const formattedPools = poolAccounts.map((pool) => ({
          pubkey: pool.publicKey.toBase58(),
          totalLiquidity: pool.account.totalLiquidity.toString(),
          poolApyBps: pool.account.poolApyBps,
          numDepositors: pool.account.numDepositors.toString(),
        }));

        setPools(formattedPools);
      } catch (error) {
        console.error("Error fetching pool accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoolAccounts();
  }, [wallet, publicKey]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading pool data...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pool Accounts</h2>
      {pools.length === 0 ? (
        <p>No Pool accounts found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Account Pubkey
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Total Liquidity
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Pool APY (BPS)
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Number of Depositors
              </th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {pool.pubkey}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {pool.totalLiquidity}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {pool.poolApyBps}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {pool.numDepositors}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PoolData;
