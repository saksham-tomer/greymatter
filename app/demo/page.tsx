import React from 'react';
import PoolDashboard from './PoolDashboard';

const poolData = [
  {
    network: 'BNB Smart Chain',
    tokenPair: 'USDT/WNBR',
    version: 'V3',
    apy: '0.01%',
    apr: 'Upto 149.77%',
    tvl: '$6,963,173.0',
    volume24h: '$6,963,173.0',
    poolType: 'V3',
    stableSwap: ''
  },
  {
    network: 'Ethereum',
    tokenPair: 'DAI/WETH',
    version: 'V2',
    apy: '0.02%',
    apr: 'Upto 125.89%',
    tvl: '$12,345,678.0',
    volume24h: '$9,876,543.0',
    poolType: 'V2',
    stableSwap: 'Stable'
  },
  {
    network: 'Polygon',
    tokenPair: 'USDC/MATIC',
    version: 'V3',
    apy: '0.03%',
    apr: 'Upto 175.42%',
    tvl: '$4,567,890.0',
    volume24h: '$3,210,987.0',
    poolType: 'V3',
    stableSwap: ''
  },
  {
    network: 'Avalanche',
    tokenPair: 'AVAX/WAVAX',
    version: 'V3',
    apy: '0.04%',
    apr: 'Upto 189.67%',
    tvl: '$7,890,123.0',
    volume24h: '$5,432,109.0',
    poolType: 'V3',
    stableSwap: 'Stable'
  }
];

const PoolDashboardTest = () => {
  return (
    <div>
      <PoolDashboard poolData={poolData} />
    </div>
  );
};

export default PoolDashboardTest;