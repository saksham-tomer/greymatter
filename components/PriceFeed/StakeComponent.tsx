import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PoolCard from './PoolCard';
import ChainSelect from './ChainSelect';
import ChainData from './ChainData';
import TvlChart from './PoolChart';
import { useRouter } from 'next/navigation';

interface CardData {
  pool: string;
  symbol: string;
  project: string;
  tvlUsd: number;
  apy: number;
  volumeUsd7d?: number | null;
  apyMean30D?: number;
  chain?: string;
}

export const StakeComponent = () => {
  
  const [showChainSelect, setShowChainSelect] = React.useState<boolean>(true);
  const [showData, setShowData] = React.useState<boolean>(false);
  const [showPools, setShowPools] = React.useState<boolean>(false);
  const [cardData, setCardData] = React.useState<CardData | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const router = useRouter()

  const handleManage = () => {
    setShowData(true);
    setShowChainSelect(false);
    setShowPools(false);
  };

  const formatTVL = (tvl: number): string => {
    if (tvl >= 1e9) return `${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `${(tvl / 1e6).toFixed(1)}M`;
    if (tvl >= 1e3) return `${(tvl / 1e3).toFixed(1)}K`;
    return tvl.toFixed(0);
  };

  return (
    <>
      {showData && <TvlChart poolId={cardData.pool} />}
      
      {showChainSelect && (
        <ChainSelect 
          setShowChainSelect={setShowChainSelect} 
          setCardData={setCardData} 
          setShowPools={setShowPools}
        />
      )}
      
      {showPools && (
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="font-bold text-2xl">Selected pool (?)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className='min-w-[32rem] font-bold text-2xl hover:bg-gray-200 p-4 text-center transition-colors duration-300 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-xl shadow-xl border border-gray-300 ease-in-out ' onClick={()=>(router.push(`https://defillama.com/yields/pool/${cardData.pool}`))}>Invest</button> 
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">Show deprecated pools</span>
              </div>
              <div className="flex flex-col space-y-4 rounded-xl">
                {cardData && (
                  <PoolCard
                    icon="/placeholder.svg"
                    title={cardData.symbol}
                    chain={cardData.chain}
                    totalLocked={`$${formatTVL(cardData.tvlUsd)}`}
                    poolBalance={cardData.volumeUsd7d || 0}
                    apr={cardData.apy}
                    project={cardData.project}
                    boostedApr={cardData.apyMean30D || cardData.apy}
                    onManage={handleManage}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StakeComponent;
