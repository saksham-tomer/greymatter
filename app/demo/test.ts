// test.ts
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program, web3, BN } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Define the PoolAccount interface
interface PoolAccount {
  totalLiquidity: anchor.BN;
  poolApyBps: anchor.BN;
  numDepositors: anchor.BN;
}

// Load environment variables
dotenv.config();

const main = async () => {
  // **Configure the client to use Devnet**

  // Retrieve environment variables
  const providerUrl = process.env.ANCHOR_PROVIDER_URL;
  const walletPath = process.env.ANCHOR_WALLET;
  const programIdString = process.env.PROGRAM_ID;

  if (!providerUrl || !walletPath || !programIdString) {
    throw new Error(
      "Missing environment variables. Please check your .env file."
    );
  }

  // Load the wallet keypair
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(walletPath, "utf-8"))
  );
  const wallet = Keypair.fromSecretKey(secretKey);

  // Establish a connection to Devnet
  const connection = new Connection(providerUrl, "processed");

  // Create an AnchorProvider
  const provider = new AnchorProvider(connection, new anchor.Wallet(wallet), {
    preflightCommitment: "processed",
  });

  // Set the provider
  anchor.setProvider(provider);

  // **Load the IDL**
  const idl = JSON.parse(fs.readFileSync("./pool.json", "utf8"));

  // **Specify the Program ID**
  const programId = new PublicKey(programIdString);

  // **Initialize the Program Client**
  const program = new Program(idl, programId, provider);

  // **Generate a new keypair for the PoolAccount**
  const poolAccount = Keypair.generate();

  // **Authority (your wallet)**
  const authority = wallet;

  // **1. Initialize the Pool**
  const initialLiquidity = new BN(1000);
  const poolApyBps = new BN(500); // 5% APY

  console.log("Initializing Pool...");

  try {
    const tx = await program.methods
      .initializePool(initialLiquidity, poolApyBps)
      .accounts({
        poolAccount: poolAccount.publicKey,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([poolAccount])
      .rpc();

    console.log("Pool initialized. Transaction signature:", tx);
    console.log("Pool Account Public Key:", poolAccount.publicKey.toBase58());
  } catch (error) {
    console.error("Error initializing pool:", error);
    return;
  }

  // **Fetch and display the PoolAccount state**
  try {
    const pool = (await program.account.poolAccount.fetch(
      poolAccount.publicKey
    )) as PoolAccount;
    console.log("Pool State:", {
      totalLiquidity: pool.totalLiquidity.toString(),
      poolApyBps: pool.poolApyBps.toString(),
      numDepositors: pool.numDepositors.toString(),
    });
  } catch (error) {
    console.error("Error fetching pool state:", error);
    return;
  }

  // **2. Deposit into the Pool**
  const depositAmount = new BN(500);

  console.log("Depositing into Pool...");

  try {
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        poolAccount: poolAccount.publicKey,
        depositor: authority.publicKey,
      })
      .rpc();

    console.log("Deposit successful. Transaction signature:", tx);
  } catch (error) {
    console.error("Error depositing into pool:", error);
    return;
  }

  // **Fetch and display the updated PoolAccount state**
  try {
    const pool = (await program.account.poolAccount.fetch(
      poolAccount.publicKey
    )) as PoolAccount;
    console.log("Updated Pool State:", {
      totalLiquidity: pool.totalLiquidity.toString(),
      poolApyBps: pool.poolApyBps.toString(),
      numDepositors: pool.numDepositors.toString(),
    });
  } catch (error) {
    console.error("Error fetching updated pool state:", error);
    return;
  }

  // **3. Withdraw from the Pool**
  const withdrawAmount = new BN(200);

  console.log("Withdrawing from Pool...");

  try {
    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        poolAccount: poolAccount.publicKey,
        depositor: authority.publicKey,
      })
      .rpc();

    console.log("Withdrawal successful. Transaction signature:", tx);
  } catch (error) {
    console.error("Error withdrawing from pool:", error);
    return;
  }

  // **Fetch and display the final PoolAccount state**
  try {
    const pool = (await program.account.poolAccount.fetch(
      poolAccount.publicKey
    )) as PoolAccount;
    console.log("Final Pool State:", {
      totalLiquidity: pool.totalLiquidity.toString(),
      poolApyBps: pool.poolApyBps.toString(),
      numDepositors: pool.numDepositors.toString(),
    });
  } catch (error) {
    console.error("Error fetching final pool state:", error);
    return;
  }

  // **4. Optional: Attempt to Withdraw More Than Available Liquidity to Trigger an Error**
  try {
    console.log("Attempting to withdraw more than available liquidity...");
    const excessiveWithdraw = new BN(10000);
    await program.methods
      .withdraw(excessiveWithdraw)
      .accounts({
        poolAccount: poolAccount.publicKey,
        depositor: authority.publicKey,
      })
      .rpc();
  } catch (error: any) {
    if (error.code === 6000) {
      console.error("Expected error:", error.msg);
    } else if (error.response && error.response.data) {
      const errorMsg = error.response.data.error.message;
      console.error("Expected error:", errorMsg);
    } else {
      console.error("Expected error:", error);
    }
  }
};

// Execute the main function and handle errors
main()
  .then(() => {
    console.log("Test script completed successfully.");
  })
  .catch((err) => {
    console.error("Test script encountered an error:", err);
  });
