import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowDownUp, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TokenSwapInterface = ({ programId }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({
    offerAmount: '',
    wantedAmount: ''
  });
  const [activeView, setActiveView] = useState('create'); // 'create' or 'browse'

  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOffer = async () => {
    try {
      setLoading(true);
      const offerId = new BN(Math.floor(Math.random() * 1000000));
      const tokenAAmount = new BN(formData.offerAmount);
      const tokenBAmount = new BN(formData.wantedAmount);

      const [offerAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('offer'),
          publicKey.toBuffer(),
          offerId.toArrayLike(Buffer, 'le', 8),
        ],
        new PublicKey(programId)
      );

      // Example token mints - replace with actual mints
      const tokenMintA = new PublicKey('your_token_a_mint');
      const tokenMintB = new PublicKey('your_token_b_mint');

      const vault = getAssociatedTokenAddressSync(
        tokenMintA,
        offerAccount,
        true,
        TOKEN_2022_PROGRAM_ID
      );

      const transaction = await program.methods
        .makeOffer(offerId, tokenAAmount, tokenBAmount)
        .accounts({
          maker: publicKey,
          tokenMintA,
          tokenMintB,
          offer: offerAccount,
          vault,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction();

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      setFormData({ offerAmount: '', wantedAmount: '' });
      fetchOffers(); // Refresh offers list
    } catch (error) {
      console.error('Error creating offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const takeOffer = async (offer) => {
    try {
      setLoading(true);
      const transaction = await program.methods
        .takeOffer()
        .accounts({
          taker: publicKey,
          maker: offer.maker,
          offer: offer.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction();

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      fetchOffers(); // Refresh offers list
    } catch (error) {
      console.error('Error taking offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const offers = await program.account.offer.all();
      setOffers(offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeView === 'create' ? 'default' : 'outline'}
          onClick={() => setActiveView('create')}
          className="flex-1"
        >
          Create Offer
        </Button>
        <Button 
          variant={activeView === 'browse' ? 'default' : 'outline'}
          onClick={() => setActiveView('browse')}
          className="flex-1"
        >
          Browse Offers
        </Button>
      </div>

      {activeView === 'create' ? (
        <Card className="bg-background/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">You Offer</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Amount of Token A you want to swap</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  name="offerAmount"
                  value={formData.offerAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  type="number"
                  className="bg-background"
                />
              </div>

              <div className="flex justify-center">
                <div className="bg-background p-2 rounded-full shadow">
                  <ArrowDownUp className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">You Receive</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Amount of Token B you want to receive</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  name="wantedAmount"
                  value={formData.wantedAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  type="number"
                  className="bg-background"
                />
              </div>

              <Button 
                onClick={createOffer}
                disabled={loading || !publicKey || !formData.offerAmount || !formData.wantedAmount}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : publicKey ? (
                  'Create Offer'
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.length > 0 ? (
            offers.map((offer, index) => (
              <Card key={index} className="bg-background/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-medium">Offering</p>
                      <p className="text-2xl font-bold">{offer.tokenAAmount.toString()} Token A</p>
                    </div>
                    <ArrowDownUp className="h-6 w-6 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm font-medium">Wanting</p>
                      <p className="text-2xl font-bold">{offer.tokenBAmount.toString()} Token B</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      by {offer.maker.toString().slice(0, 4)}...{offer.maker.toString().slice(-4)}
                    </p>
                    <Button
                      onClick={() => takeOffer(offer)}
                      disabled={loading || !publicKey || offer.maker.equals(publicKey)}
                      variant="outline"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Take Offer'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>No active offers available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenSwapInterface;