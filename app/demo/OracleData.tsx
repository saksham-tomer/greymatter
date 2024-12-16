// src/OracleData.js
import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "./idl (3).json";
import { useWallet } from "@solana/wallet-adapter-react";

const programId = new PublicKey("3iLoqsNtqZq2mCCg7CPA9qd2T62vfbMLCAgSvASKzPNv");
const connection = new Connection("https://api.devnet.solana.com");

const OracleData = () => {
  const [accounts, setAccounts] = useState([]);
  const { publicKey, wallet } = useWallet();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!publicKey) {
        console.log("Wallet not connected");
        return;
      }

      try {
        // Initialize Anchor provider
        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: "processed",
        });

        // Initialize the program
        const program = new Program(idl, programId, provider);

        // Fetch all accounts of type OracleAccount
        const oracleAccounts = await program.account.oracleAccount.all();

        // Map the accounts to a more readable format
        const formattedAccounts = oracleAccounts.map((acc) => ({
          pubkey: acc.publicKey.toBase58(),
          basePrice: acc.account.basePrice.toString(),
          baseApyBps: acc.account.baseApyBps,
        }));

        setAccounts(formattedAccounts);
      } catch (err) {
        console.error("Error fetching Oracle accounts:", err);
      }
    };

    fetchAccounts();
  }, [publicKey, wallet]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Oracle Accounts</h2>
      {accounts.length === 0 ? (
        <p>No Oracle accounts found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Account Pubkey
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Base Price
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Base APY (BPS)
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {acc.pubkey}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {acc.basePrice}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {acc.baseApyBps}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OracleData;
