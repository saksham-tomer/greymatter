"use client"
import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Assuming you've deployed the program and have the IDL
import idl from './multisig_wallet.json'; // You'll need to export the IDL from your Anchor project
import { Copy, PlusCircle, Users } from 'lucide-react';

const PROGRAM_ID = new PublicKey('3zXKff5skVoTMLRhPAPM6TDfzrsLtZwozsYabjxdqTU9');

const MultisigWalletManager = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  
  // Form state
  const [owners, setOwners] = useState(['']);
  const [threshold, setThreshold] = useState(1);
  const [newTransaction, setNewTransaction] = useState({
    programId: '',
    accounts: [{ pubkey: '', isSigner: false, isWritable: false }],
    data: '',
  });

  // Multisig state
  const [multisigAccount, setMultisigAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

    const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard', {
      description: text.slice(0, 10) + '...' + text.slice(-10)
    });
  }

  // Initialize the program when wallet connects
useEffect(() => {
    const initializeProgram = async () => {
      if (!wallet.connected || !connection) {
        setProgram(null);
        return;
      }

      try {
        // Create a wallet adapter provider
        const provider = new anchor.AnchorProvider(
          connection, 
          wallet as anchor.Wallet, 
          { 
            commitment: 'confirmed',
            preflightCommitment: 'confirmed'
          }
        );

        // Set the provider
        anchor.setProvider(provider);

        // Create the program instance
        const programInstance = new anchor.Program(
          idl as anchor.Idl, 
          PROGRAM_ID, 
          provider
        );

        setProgram(programInstance);
      } catch (error) {
        console.error('Failed to initialize program:', error);
        toast.error('Failed to connect to program', {
          description: error instanceof Error ? error.message : 'Unknown error'
        });
        setProgram(null);
      }
    };

    initializeProgram();
  }, [wallet.connected, connection]);

  // Initialize Multisig Wallet
  const initializeMultisig = async () => {
    if (!program || !wallet.connected) {
      toast.error('Please connect wallet first');
      console.error('Please connect wallet first')
      return;
    }

    try {
      // Generate a new keypair for the multisig account
      const multisigKeypair = web3.Keypair.generate();

      const tx = await program.methods
        .initialize(
          owners.map(owner => new PublicKey(owner)),
          new BN(threshold)
        )
        .accounts({
          multisig: multisigKeypair.publicKey,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([multisigKeypair])
        .rpc();
      console.log('multisig wallet initialized!')
      toast.success('multisig wallet initialized!', { description: `TX: ${tx}` });
      setMultisigAccount(multisigKeypair.publicKey);
    } catch (err) {
      console.error('Failed to initialize multisig')
      toast.error('Failed to initialize multisig', { description: err.message });
    }
  };

  // Create Transaction
  const createTransaction = async () => {
    if (!program || !multisigAccount) {
      toast.error('Initialize multisig first');
      return;
    }

    try {
      const transactionKeypair = web3.Keypair.generate();
      
      const tx = await program.methods
        .createTransaction(
          new PublicKey(newTransaction.programId),
          newTransaction.accounts.map(acc => ({
            pubkey: new PublicKey(acc.pubkey),
            isSigner: acc.isSigner,
            isWritable: acc.isWritable
          })),
          Buffer.from(newTransaction.data)
        )
        .accounts({
          multisig: multisigAccount,
          transaction: transactionKeypair.publicKey,
          proposer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([transactionKeypair])
        .rpc();

      toast.success('Transaction created!', { description: `TX: ${tx}` });
    } catch (err) {
      toast.error('Failed to create transaction', { description: err.message });
    }
  };

  // Approve Transaction
  const approveTransaction = async (transactionPubkey) => {
    if (!program || !multisigAccount) {
      toast.error('Initialize multisig first');
      return;
    }

    try {
      const tx = await program.methods
        .approve()
        .accounts({
          multisig: multisigAccount,
          transaction: transactionPubkey,
          owner: wallet.publicKey,
        })
        .rpc();

      toast.success('Transaction approved!', { description: `TX: ${tx}` });
    } catch (err) {
      toast.error('Failed to approve transaction', { description: err.message });
    }
  };

  // Execute Transaction
  const executeTransaction = async (transactionPubkey) => {
    if (!program || !multisigAccount) {
      toast.error('Initialize multisig first');
      return;
    }

    try {
      const tx = await program.methods
        .executeTransaction()
        .accounts({
          multisig: multisigAccount,
          transaction: transactionPubkey,
          executor: wallet.publicKey,
        })
        .rpc();

      toast.success('Transaction executed!', { description: `TX: ${tx}` });
    } catch (err) {
      toast.error('Failed to execute transaction', { description: err.message });
    }
  };

  // Dynamic owner input
  const handleOwnerChange = (index, value) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const addOwnerInput = () => {
    setOwners([...owners, '']);
  };

  // Dynamic transaction account input
  const handleTransactionAccountChange = (index, field, value) => {
    const newAccounts = [...newTransaction.accounts];
    newAccounts[index] = {
      ...newAccounts[index],
      [field]: value
    };
    setNewTransaction(prev => ({ ...prev, accounts: newAccounts }));
  };

  const addTransactionAccountInput = () => {
    setNewTransaction(prev => ({
      ...prev,
      accounts: [...prev.accounts, { pubkey: '', isSigner: false, isWritable: false }]
    }));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2a] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Multisig Wallet Setup */}
        <div className="bg-[#1e1e2f] rounded-2xl shadow-2xl border border-[#2a2a3a] overflow-hidden">
          <div className="bg-gradient-to-r from-[#2a2a4a] to-[#1a1a2a] p-6 border-b border-[#3a3a4a]">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Multisig Wallet Studio
            </h2>
            <p className="text-gray-400 mt-2">
              Create and manage secure multi-signature wallets with advanced controls
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Owners Management */}
            <div className="bg-[#2a2a3a] rounded-xl p-4 border border-[#3a3a4a]">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="mr-2 text-blue-400" /> 
                Wallet Owners
              </h3>
              <div className="space-y-3">
                {owners.map((owner, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Owner Public Key"
                      value={owner}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        newOwners[index] = e.target.value;
                        setOwners(newOwners);
                      }}
                      className="bg-[#3a3a4a] border-[#4a4a5a] text-white"
                    />
                    {owner && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(owner)}
                        className="text-gray-400 hover:text-white hover:bg-[#4a4a5a]"
                      >
                        <Copy size={20} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  onClick={() => setOwners([...owners, ''])}
                  variant="outline"
                  className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
                >
                  <PlusCircle className="mr-2" /> Add Owner
                </Button>
              </div>
            </div>

            {/* Threshold Selection */}
            <div className="bg-[#2a2a3a] rounded-xl p-4 border border-[#3a3a4a]">
              <h3 className="text-xl font-semibold text-white mb-4">
                Approval Threshold
              </h3>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={threshold}
                  min="1"
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="bg-[#3a3a4a] border-[#4a4a5a] text-white w-24"
                />
                <span className="text-gray-400">
                  signatures required out of {owners.length} owners
                </span>
              </div>
            </div>

            {/* Initialize Button */}
            <Button 
              onClick={initializeMultisig}
              disabled={!wallet.connected}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl"
            >
              {wallet.connected ? 'Initialize Multisig Wallet' : 'Connect Wallet First'}
            </Button>
          </div>
        </div>

        {/* Transaction Creation Section */}
        <div className="bg-[#1e1e2f] rounded-2xl shadow-2xl border border-[#2a2a3a] overflow-hidden">
          <div className="bg-gradient-to-r from-[#2a2a4a] to-[#1a1a2a] p-6 border-b border-[#3a3a4a]">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Create Transaction
            </h2>
            <p className="text-gray-400 mt-2">
              Propose a new multi-signature transaction
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Transaction Details */}
            <div className="bg-[#2a2a3a] rounded-xl p-4 border border-[#3a3a4a] space-y-4">
              <Input
                type="text"
                placeholder="Target Program ID"
                value={newTransaction.programId}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, programId: e.target.value }))}
                className="bg-[#3a3a4a] border-[#4a4a5a] text-white"
              />
              
              {newTransaction.accounts.map((account, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Account Public Key"
                    value={account.pubkey}
                    onChange={(e) => {
                      const newAccounts = [...newTransaction.accounts];
                      newAccounts[index].pubkey = e.target.value;
                      setNewTransaction(prev => ({ ...prev, accounts: newAccounts }));
                    }}
                    className="bg-[#3a3a4a] border-[#4a4a5a] text-white"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={account.isSigner}
                        onChange={(e) => {
                          const newAccounts = [...newTransaction.accounts];
                          newAccounts[index].isSigner = e.target.checked;
                          setNewTransaction(prev => ({ ...prev, accounts: newAccounts }));
                        }}
                        className="mr-2 bg-[#3a3a4a]"
                      />
                      Signer
                    </label>
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        checked={account.isWritable}
                        onChange={(e) => {
                          const newAccounts = [...newTransaction.accounts];
                          newAccounts[index].isWritable = e.target.checked;
                          setNewTransaction(prev => ({ ...prev, accounts: newAccounts }));
                        }}
                        className="mr-2 bg-[#3a3a4a]"
                      />
                      Writable
                    </label>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={() => setNewTransaction(prev => ({
                  ...prev,
                  accounts: [...prev.accounts, { pubkey: '', isSigner: false, isWritable: false }]
                }))}
                variant="outline"
                className="w-full bg-[#3a3a4a] border-[#4a4a5a] text-white hover:bg-[#4a4a5a]"
              >
                <PlusCircle className="mr-2" /> Add Transaction Account
              </Button>
            </div>

            {/* Transaction Data */}
            <Input
              type="text"
              placeholder="Transaction Data (Hex)"
              value={newTransaction.data}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, data: e.target.value }))}
              className="bg-[#3a3a4a] border-[#4a4a5a] text-white"
            />

            {/* Create Transaction Button */}
            <Button 
              onClick={createTransaction}
              disabled={!multisigAccount}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl"
            >
              {multisigAccount ? 'Create Transaction' : 'Initialize Multisig First'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultisigWalletManager; 