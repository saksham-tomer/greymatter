import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import axios from 'axios';

const TvlChart = ({ poolId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartHeight, setChartHeight] = useState(450);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm
        setChartHeight(300);
      } else if (window.innerWidth < 1024) { // lg
        setChartHeight(350);
      } else {
        setChartHeight(450);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`https://yields.llama.fi/chart/${poolId}`);
        
        const processedData = response.data.data.map(item => ({
          date: new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          tvlUsdBillions: (item.tvlUsd / 1e9).toFixed(2),
          apy: item.apy?.toFixed(2) || 0,
          apyBase: item.apyBase?.toFixed(2) || 0,
          apyReward: item.apyReward?.toFixed(2) || 0
        }));

        setData(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (poolId) {
      fetchData();
    }
  }, [poolId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 p-2 sm:p-4 rounded-lg shadow-xl">
          <p className="text-gray-400 font-medium mb-1 sm:mb-2 text-sm sm:text-base">{label}</p>
          <p className="text-indigo-400 font-semibold text-sm sm:text-base">
            TVL: ${payload[0].value}B
          </p>
          <p className="text-emerald-400 font-semibold text-sm sm:text-base">
            APY: {payload[1].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="w-full bg-gray-900 text-gray-100 p-4 sm:p-8 rounded-xl">
        <div className="flex items-center justify-center h-[16rem] sm:h-[24rem] lg:h-[32rem]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 animate-spin" />
            <p className="text-gray-400 text-sm sm:text-base">Loading protocol data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-gray-900 text-gray-100 p-4 sm:p-8 rounded-xl">
        <div className="flex items-center justify-center h-[16rem] sm:h-[24rem] lg:h-[32rem]">
          <div className="text-center">
            <p className="text-red-400 mb-2 text-sm sm:text-base">Error loading data</p>
            <p className="text-gray-400 text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentTVL = data[data.length - 1]?.tvlUsdBillions || 0;
  const currentAPY = data[data.length - 1]?.apy || 0;

  return (
    <Card className="w-full bg-gray-900 min-w-2xl text-gray-100 p-4 sm:p-8 rounded-xl">
      <CardHeader className="px-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
            Protocol Analytics
          </CardTitle>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
          <p className="text-gray-400 text-xs sm:text-sm">TVL and APY Trends</p>
          <div className="flex gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-gray-400 text-xs sm:text-sm">Current TVL</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-400">${currentTVL}B</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-gray-400 text-xs sm:text-sm">Current APY</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-400">{currentAPY}%</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-[16rem] sm:h-[24rem] lg:h-[28rem] w-full mt-4 sm:mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ 
                top: 20, 
                right: 5, 
                left: -20, 
                bottom: 0 
              }}
            >
              <defs>
                <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                vertical={false}
              />
              
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: '0.75rem' }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                interval="preserveStartEnd"
              />
              
              <YAxis 
                yAxisId="left"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: '0.75rem' }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                label={{ 
                  value: 'TVL (B)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#9ca3af', fontSize: '0.75rem' }
                }}
                width={45}
              />
              
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: '0.75rem' }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                label={{ 
                  value: 'APY (%)', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { fill: '#9ca3af', fontSize: '0.75rem' }
                }}
                width={45}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '1rem',
                  color: '#9ca3af',
                  fontSize: '0.75rem'
                }}
                iconType="circle"
              />
              
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="tvlUsdBillions"
                stroke="#818cf8"
                strokeWidth={2}
                fill="url(#tvlGradient)"
                name="TVL"
                dot={false}
                activeDot={{ stroke: '#818cf8', strokeWidth: 2, r: 4, fill: '#1f2937' }}
              />
              
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="apy"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#apyGradient)"
                name="APY"
                dot={false}
                activeDot={{ stroke: '#34d399', strokeWidth: 2, r: 4, fill: '#1f2937' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TvlChart;
