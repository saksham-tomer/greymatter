import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, Search } from "lucide-react";
import Image from "next/image";

interface YieldPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apyReward: number | null;
  apy: number;
  rewardTokens: string[] | null;
  pool: string;
  ilRisk: string;
  binnedConfidence: number;
  underlyingTokens: string[];
  apyMean30D: number;
  volumeUsd7d: number | null;
}

interface YieldApiResponse {
  status: string;
  data: YieldPool[];
}

interface ChainSelectProps {
  setShowChainSelect: (show: boolean) => void;
  setCardData: (data: {
    pool: string;
    symbol: string;
    project: string;
    tvlUsd: number;
    apy: number;
    volumeUsd7d: number | null;
    apyMean30D: number;
    chain: string;
  }) => void;
  setShowPools: (show: boolean) => void;
}

const chains = [
  { label: "All", icon: "/globe.svg" },
  { label: "Ethereum", icon: "/etherium.svg" },
  { label: "Solana", icon: "/solana.svg" },
  { label: "Arbitrum", icon: "/arbit.svg" },
  { label: "Base", icon: "/base.png" },
  { label: "Sui", icon: "/sui.svg" },
  { label: "BSC", icon: "/bsc.svg" },
  { label: "Optimism", icon: "/optimism.svg" },
  { label: "Fantom", icon: "/fantom.svg" },
];

const extraChains = [
  { label: "Ethereum", icon: "/etherium.svg" },
  { label: "Solana", icon: "/solana.svg" },
  { label: "Arbitrum", icon: "/arbit.svg" },
  { label: "Base", icon: "/base.png" },
  { label: "Sui", icon: "/sui.svg" },
  { label: "BSC", icon: "/bsc.svg" },
  { label: "Optimism", icon: "/optimism.svg" },
  { label: "Fantom", icon: "/fantom.svg" },
  { label: "Polygon", icon: "/polygon.png" },
  { label: "Avalanche", icon: "/avalanche.png" },
  { label: "Celo", icon: "/celo.png" },
  { label: "Moonbeam", icon: "/moonbeam.svg" },
  { label: "Kava", icon: "/kava.png" },
  { label: "Scroll", icon: "/scroll.png" },
  { label: "Mantle", icon: "/mantel.svg" },
  { label: "X Layer", icon: "/xlayer.png" },
  { label: "Blast", icon: "/blast.png" },
  { label: "Aptos", icon: "/aptos.svg" },
];

const ChainSelect: React.FC<ChainSelectProps> = ({
  setShowChainSelect,
  setCardData,
  setShowPools,
}) => {
  const [selectedChain, setSelectedChain] = useState<string>("All");
  const [showExtraChains, setShowExtraChains] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [yieldData, setYieldData] = useState<YieldPool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYieldData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<YieldApiResponse>(
          "https://yields.llama.fi/pools"
        );
        setYieldData(response.data.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch yield data");
        console.error("Error fetching yield data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchYieldData();
  }, []);

  const filteredTokens = React.useMemo(() => {
    return yieldData.filter((pool) => {
      const matchesChain =
        selectedChain === "All" ||
        pool.chain.toLowerCase() === selectedChain.toLowerCase();
      const matchesSearch =
        pool.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.project.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChain && matchesSearch;
    });
  }, [yieldData, selectedChain, searchQuery]);

  const formatTVL = (tvl: number): string => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
    if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(1)}K`;
    return `$${tvl.toFixed(0)}`;
  };

  const handleCards = (pool: YieldPool) => {
    setCardData({
      pool: pool.pool,
      symbol: pool.symbol,
      project: pool.project,
      tvlUsd: pool.tvlUsd,
      apy: pool.apy,
      volumeUsd7d: pool.volumeUsd7d,
      apyMean30D: pool.apyMean30D,
      chain: pool.chain,
    });
    setShowChainSelect(false);
    setShowPools(true);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 shadow-lg">
      <div className="flex items-center mb-6">
        <ChevronLeft
          onClick={() => setShowChainSelect(false)}
          className="w-6 h-6 text-black cursor-pointer hover:scale-105 transition-transform"
        />
        <span className="text-xl font-semibold ml-4">Swap Source</span>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold  pb-5">Select Chain</h3>
        <div className="grid grid-cols-5 gap-4">
          {chains.map((chain, index) => (
            <button
              key={index}
              onClick={() => {
                if (index === chains.length - 1) {
                  setShowExtraChains(true);
                } else {
                  setSelectedChain(chain.label);
                }
              }}
              className={`flex items-center justify-center w-12 h-12 rounded-full 
                transition-all duration-200 hover:bg-gray-50
                ${selectedChain === chain.label ? "ring-2 ring-blue-500" : ""}
                ${index === chains.length - 1 ? "text-blue-500" : ""}
                ${chain.label === "All" ? "bg-gray-100" : ""}`}
            >
              {index === chains.length - 1 ? (
                <span className="text-blue-500 text-xs">More</span>
              ) : (
                <Image src={chain.icon} alt="" height={20} width={20} />
              )}
            </button>
          ))}
        </div>

        {showExtraChains && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-4 w-96 max-h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Chains</h3>
                <button
                  onClick={() => setShowExtraChains(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] p-2">
                {extraChains.map((chain, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedChain(chain.label);
                      setShowExtraChains(false);
                    }}
                    className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl mb-1">
                      <Image width={20} alt="" height={20} src={chain.icon} />
                    </span>
                    <span className="text-xs">{chain.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Token"
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Select Token</h3>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {filteredTokens.map((pool, index) => (
              <div
                key={pool.pool}
                onClick={() => handleCards(pool)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className="mr-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {pool.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold">{pool.symbol}</span>
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 rounded">
                          {pool.chain}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {pool.project}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatTVL(pool.tvlUsd)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pool.apy.toFixed(2)}% APY
                    </div>
                  </div>
                </div>
                {index < filteredTokens.length - 1 && (
                  <div className="h-px bg-gray-100 mx-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChainSelect;
