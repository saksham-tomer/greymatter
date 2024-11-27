"use client"

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import { 
  ArrowUpDown, Settings, Info, ChevronDown, 
  Search, X, ExternalLink, AlertCircle, Loader
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SOLANA_RPC = 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE';

const tokens = [
  { 
    symbol: 'SOL', 
    name: 'Solana', 
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    balance: '12.5', 
    price: 125.45,
  },
  { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    balance: '1250.00', 
    price: 1.00,
  },
  { 
    symbol: 'BONK', 
    name: 'Bonk', 
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    balance: '1250000', 
    price: 0.00001,
  },
];

const SwapComponent = () => {
  const [tokenIn, setTokenIn] = useState(tokens[0]);
  const [tokenOut, setTokenOut] = useState(tokens[1]);
  const [amountIn, setAmountIn] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectingSide, setSelectingSide] = useState('in');
  const [searchQuery, setSearchQuery] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);

  const wallet = useWallet();
  const connection = new Connection(SOLANA_RPC);

  const fetchRoute = async (tokenIn, tokenOut, amount) => {
    setLoading(true);
    setError(null);
    
    try {
      if (amount <= 0) throw new Error('Amount must be greater than 0');

      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${tokenIn.mint}&outputMint=${tokenOut.mint}&amount=${amount * Math.pow(10, tokenIn.decimals)}&slippage=${parseFloat(slippage) / 100}`
      );
      
      const quoteResponse = await response.json();

      if (!quoteResponse || !quoteResponse.outAmount) {
        throw new Error('Unable to fetch route');
      }

      const outAmountNumber = Number(quoteResponse.outAmount) / Math.pow(10, tokenOut.decimals);
      
      const route = {
        priceImpact: (quoteResponse.priceImpactPct * 100).toFixed(2),
        routeInfo: quoteResponse.routePlan.map(plan => plan.swapInfo.label).join(' → '),
        estimatedTime: '< 30 seconds',
        fee: 0, // Jupiter doesn't directly provide network fee
        minReceived: outAmountNumber,
        marketPrice: outAmountNumber / amount,
        quoteResponse,
      };
      
      setRoute(route);
    } catch (err) {
      setError(err.message);
      setRoute(null);
    } finally {
      setLoading(false);
    }
  };

  const signAndSendTransaction = async () => {
    if (!wallet.connected || !route) return;

    try {
      const response = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse: route.quoteResponse,
          userPublicKey: wallet.publicKey?.toString(),
          wrapAndUnwrapSol: true,
        }),
      });

      const { swapTransaction } = await response.json();

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      }, 'confirmed');
      
      console.log(`Swap successful: https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error('Swap failed:', error);
      setError('Swap transaction failed');
    }
  };

  useEffect(() => {
    if (amountIn && !isNaN(amountIn)) {
      fetchRoute(tokenIn, tokenOut, parseFloat(amountIn));
    } else {
      setRoute(null);
    }
  }, [amountIn, tokenIn, tokenOut, slippage]);

  const handleSwapTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
    setAmountIn('');
  };

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const TokenSelector = ({ token, onChange, label }) => (
    <div className="rounded-lg bg-gray-900 p-4 hover:bg-gray-800 transition-colors">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {token.symbol[0]}
          </div>
          <div>
            <div className="font-medium text-white">{token.symbol}</div>
            <div className="text-sm text-gray-400">Balance: {token.balance}</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-gray-300 hover:text-white"
          onClick={() => {
            setSelectingSide(label === 'You pay' ? 'in' : 'out');
            setShowTokenSelect(true);
          }}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <input
        type="text"
        className="w-full mt-2 bg-transparent text-2xl font-medium focus:outline-none text-white"
        placeholder="0.0"
        value={label === 'You pay' ? amountIn : route ? (route.minReceived).toFixed(6) : ''}
        onChange={(e) => label === 'You pay' && setAmountIn(e.target.value)}
      />
      <div className="text-sm text-gray-400 mt-1">
        ≈ ${label === 'You pay' 
          ? (amountIn * token.price).toFixed(2)
          : route 
            ? (route.minReceived * token.price).toFixed(2)
            : '0.00'}
      </div>
    </div>
  );

  const TokenSelectModal = () => (
    <Dialog open={showTokenSelect} onOpenChange={setShowTokenSelect}>
      <DialogContent className="max-w-md bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <Input
            placeholder="Search by name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.address}
                className="w-full p-3 rounded-lg hover:bg-gray-800 flex items-center justify-between transition-colors"
                onClick={() => {
                  selectingSide === 'in' ? setTokenIn(token) : setTokenOut(token);
                  setShowTokenSelect(false);
                  setSearchQuery('');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {token.symbol[0]}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>{token.balance}</div>
                  <div className="text-sm text-gray-400">
                    ${token.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const SettingsModal = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="max-w-md bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-400">Slippage Tolerance</label>
            <div className="flex gap-2 mt-2">
              {['0.1', '0.5', '1.0'].map((value) => (
                <Button
                  key={value}
                  variant={slippage === value ? "default" : "outline"}
                  onClick={() => setSlippage(value)}
                  className="flex-1"
                >
                  {value}%
                </Button>
              ))}
              <Input
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-20 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );


  // Rest of the component remains the same as the previous implementation
  // (TokenSelector, TokenSelectModal, SettingsModal, etc. components remain unchanged)
  
  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800 shadow-xl text-white">
      {/* Previous component's return JSX remains the same */}
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">Swap</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <TokenSelector
          token={tokenIn}
          onChange={setTokenIn}
          label="You pay"
        />
        
        <div className="relative flex justify-center">
          <Button
            onClick={handleSwapTokens}
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 bg-gray-900 rounded-full border-2 border-gray-700 hover:bg-gray-800"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <TokenSelector
          token={tokenOut}
          onChange={setTokenOut}
          label="You receive"
        />

        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

        {route && !loading && (
          <div className="space-y-2 text-sm bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between text-gray-400">
              <span>Price Impact</span>
              <span className="text-green-500">{route.priceImpact}%</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Route</span>
              <span className="flex items-center gap-1">
                {route.routeInfo}
                <Info className="h-4 w-4" />
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Estimated Time</span>
              <span>{route.estimatedTime}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Network Fee</span>
              <span>≈ ${route.fee.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Minimum Received</span>
              <span>{route.minReceived.toFixed(6)} {tokenOut.symbol}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
          </div>
        )}
      </CardContent>


      <CardFooter>
        <Button 
          className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          disabled={!amountIn || !route || loading || !wallet.connected}
          onClick={signAndSendTransaction}
        >
          {!wallet.connected ? (
            'Connect Wallet'
          ) : loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : error ? (
            'Invalid Swap'
          ) : !amountIn ? (
            'Enter Amount'
          ) : (
            'Swap'
          )}
        </Button>
      </CardFooter>
      <TokenSelectModal />
      <SettingsModal />

      {/* Existing modals */}
    </Card>
  );
};

export default SwapComponent;