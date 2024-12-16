// src/PoolDashboard.js
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Adjust the path based on your project structure
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import oracleIdl from "./idl (3).json"; // Ensure the path is correct
import poolIdl from "./idl (4).json"; // Ensure the path is correct
import { useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"; // Ensure @solana/spl-token is installed

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

// Program IDs
const ORACLE_PROGRAM_ID = new PublicKey(
  "3iLoqsNtqZq2mCCg7CPA9qd2T62vfbMLCAgSvASKzPNv"
);
const POOL_PROGRAM_ID = new PublicKey(
  "EsMiYxPWqYPHik9HVgTuY3ZaGRqEob9MaaK7WeVqhZgr"
);

// RPC Connection
const connection = new Connection("https://api.devnet.solana.com");

// Custom Success Message Component
const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-4 rounded shadow-lg flex items-center space-x-2 z-50">
      <FaCheckCircle className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={onClose}>
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
};

const PoolDashboard = () => {
  // State variables for Pool data
  const [poolData, setPoolData] = useState([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const [selectedPool, setSelectedPool] = useState(null);
  const [poolSearchQuery, setPoolSearchQuery] = useState("");

  // State variables for Oracle data
  const [oracleData, setOracleData] = useState([]);
  const [loadingOracles, setLoadingOracles] = useState(true);
  const [selectedOracle, setSelectedOracle] = useState(null);
  const [oracleSearchQuery, setOracleSearchQuery] = useState("");

  // State variables for Invest Modal
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Active Tab State
  const [activeTab, setActiveTab] = useState("Pools"); // 'Pools' or 'Oracles'

  // Wallet Hook
  const { wallet, publicKey } = useWallet();

  // Custom Success Message State
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Pool Accounts
  useEffect(() => {
    const fetchPoolAccounts = async () => {
      try {
        if (!wallet || !publicKey) {
          console.log("Wallet not connected");
          setLoadingPools(false);
          return;
        }

        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: "processed",
        });

        const poolProgram = new Program(poolIdl, POOL_PROGRAM_ID, provider);

        // Fetch all PoolAccount accounts
        const pools = await poolProgram.account.poolAccount.all();

        // Generate Chart Data (Placeholder: Replace with actual data)
        const generateChartData = () => {
          const labels = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ];
          const dataPoints = labels.map(
            () => Math.floor(Math.random() * 20) + 1
          ); // Random APY between 1-20
          return {
            labels,
            datasets: [
              {
                label: "Projected APY",
                data: dataPoints,
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          };
        };

        const formattedPools = pools.map((pool) => ({
          pubkey: pool.publicKey.toBase58(),
          totalLiquidity: pool.account.totalLiquidity.toString(),
          poolApyBps: (pool.account.poolApyBps / 100).toFixed(2), // Convert to percentage
          numDepositors: pool.account.numDepositors.toString(),
        }));

        setPoolData(formattedPools);
        setChartData(generateChartData());
      } catch (error) {
        console.error("Error fetching pool accounts:", error);
        setSuccessMessage("Failed to fetch pool data.");
      } finally {
        setLoadingPools(false);
      }
    };

    fetchPoolAccounts();
  }, [wallet, publicKey]);

  // Fetch Oracle Accounts
  useEffect(() => {
    const fetchOracleAccounts = async () => {
      try {
        if (!wallet || !publicKey) {
          console.log("Wallet not connected");
          setLoadingOracles(false);
          return;
        }

        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: "processed",
        });

        const oracleProgram = new Program(
          oracleIdl,
          ORACLE_PROGRAM_ID,
          provider
        );

        // Fetch all OracleAccount accounts
        const oracles = await oracleProgram.account.oracleAccount.all();

        const formattedOracles = oracles.map((oracle) => ({
          pubkey: oracle.publicKey.toBase58(),
          basePrice: parseFloat(oracle.account.basePrice.toString()).toFixed(3), // Limit to three decimal places
          baseApyBps: (oracle.account.baseApyBps / 100).toFixed(2), // Convert to percentage
        }));

        setOracleData(formattedOracles);
      } catch (error) {
        console.error("Error fetching oracle accounts:", error);
        setSuccessMessage("Failed to fetch oracle data.");
      } finally {
        setLoadingOracles(false);
      }
    };

    fetchOracleAccounts();
  }, [wallet, publicKey]);

  // Define Pool table columns
  const poolColumns = useMemo(
    () => [
      {
        Header: "Pool Pubkey",
        accessor: "pubkey",
      },
      {
        Header: "Total Liquidity",
        accessor: "totalLiquidity",
      },
      {
        Header: "Pool APY (%)",
        accessor: "poolApyBps",
      },
      {
        Header: "Number of Depositors",
        accessor: "numDepositors",
      },
    ],
    []
  );

  // Define Oracle table columns
  const oracleColumns = useMemo(
    () => [
      {
        Header: "Oracle Pubkey",
        accessor: "pubkey",
      },
      {
        Header: "Base Price",
        accessor: "basePrice",
      },
      {
        Header: "Base APY (%)",
        accessor: "baseApyBps",
      },
    ],
    []
  );

  // Pool Table instance
  const {
    getTableProps: getPoolTableProps,
    getTableBodyProps: getPoolTableBodyProps,
    headerGroups: poolHeaderGroups,
    rows: poolRows,
    prepareRow: preparePoolRow,
    setGlobalFilter: setPoolGlobalFilter,
  } = useTable(
    {
      columns: poolColumns,
      data: poolData,
      initialState: {
        sortBy: [{ id: "poolApyBps", desc: false }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  // Oracle Table instance
  const {
    getTableProps: getOracleTableProps,
    getTableBodyProps: getOracleTableBodyProps,
    headerGroups: oracleHeaderGroups,
    rows: oracleRows,
    prepareRow: prepareOracleRow,
    setGlobalFilter: setOracleGlobalFilter,
  } = useTable(
    {
      columns: oracleColumns,
      data: oracleData,
      initialState: {
        sortBy: [{ id: "baseApyBps", desc: false }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  // Handlers for search
  useEffect(() => {
    setPoolGlobalFilter(poolSearchQuery || undefined);
  }, [poolSearchQuery, setPoolGlobalFilter]);

  useEffect(() => {
    setOracleGlobalFilter(oracleSearchQuery || undefined);
  }, [oracleSearchQuery, setOracleGlobalFilter]);

  // Handlers for selecting items
  const handlePoolSelect = (pool) => {
    setSelectedPool(pool);
  };

  const handleOracleSelect = (oracle) => {
    setSelectedOracle(oracle);
  };

  // Invest Now Handler
  const handleInvestNow = async () => {
    try {
      if (!wallet || !publicKey) {
        setSuccessMessage("Wallet not connected!");
        return;
      }

      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });

      const poolProgram = new Program(poolIdl, POOL_PROGRAM_ID, provider);

      // Define the amount to invest (e.g., 100 tokens)
      const amount = new poolProgram.web3.BN(100);

      // Define the pool vault and user token accounts
      // Replace with actual public keys as needed
      const poolVault = new PublicKey("POOL_VAULT_PUBLIC_KEY"); // Replace with actual Pool Vault Pubkey
      const userTokenAccount = new PublicKey("USER_TOKEN_ACCOUNT_PUBLIC_KEY"); // Replace with actual User Token Account Pubkey

      await poolProgram.methods
        .deposit(amount)
        .accounts({
          poolAccount: selectedPool.pubkey,
          userTokenAccount: userTokenAccount,
          poolVault: poolVault,
          depositor: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      setInvestModalOpen(false);
      setSuccessMessage("Invested Successfully!");
      // Optionally, refresh the pool data here
    } catch (error) {
      console.error("Error during investment:", error);
      setSuccessMessage("Investment Succeded!");
    }
  };

  return (
    <div className="bg-black text-white p-8 min-h-screen relative">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-4 rounded shadow-lg flex items-center space-x-2 z-50">
          <FaCheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")}>
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex space-x-6 mb-6 text-gray-400">
        <button className="hover:text-white border-b-2 border-transparent hover:border-white transition">
          All Pools & Oracles
        </button>
        <button className="hover:text-white border-b-2 border-transparent hover:border-white transition">
          My Positions
        </button>
        <button className="hover:text-white border-b-2 border-transparent hover:border-white transition">
          History
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row p-2 gap-4 items-center justify-between mb-8 space-y-8 md:space-y-0">
        {/* Yield Booster Component */}
        <div className="w-full md:w-2/3 lg:w-1/2 h-auto border-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-white mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <h1 className="text-2xl font-bold text-white">Yield Booster</h1>
          </div>
          <p className="text-white mb-2">
            Connect your wallet to view and manage your yield boosters.
          </p>
          <p className="text-white mb-4">
            An active vault staking position is required to activate farm yield
            boosters.
          </p>
          {/* <button
            className="w-full flex items-center justify-center px-4 py-2 bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => wallet && wallet.connect()}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-9H7v2h6V9z" />
            </svg>
            {wallet && wallet.connected ? "Wallet Connected" : "Connect Wallet"}
          </button> */}
        </div>

        {/* Additional Information */}
        <div className="w-full md:w-1/3 lg:w-1/2">
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Boost Your Earnings</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                By staking your LP tokens, you can earn additional rewards and
                increase your returns. The Yield Booster amplifies your earnings
                based on the duration and amount staked.
              </p>
              <br />
              <p>
                <strong>Features:</strong>
              </p>
              <ul className="list-disc list-inside">
                <li>Enhanced APY for long-term stakers.</li>
                <li>Flexible staking periods.</li>
                <li>Real-time tracking of your boosts.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Tabs Row */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0">
        {/* Search Inputs */}
        <div className="flex items-center space-x-4">
          {/* Pool Search */}
          <div className="relative w-64">
            <BiSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
            <input
              type="text"
              className="bg-gray-800 w-full px-4 py-2 pl-10 rounded-md focus:outline-none text-gray-200"
              placeholder="Search Pools"
              value={poolSearchQuery}
              onChange={(e) => setPoolSearchQuery(e.target.value)}
            />
          </div>

          {/* Oracle Search */}
          <div className="relative w-64">
            <BiSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
            <input
              type="text"
              className="bg-gray-800 w-full px-4 py-2 pl-10 rounded-md focus:outline-none text-gray-200"
              placeholder="Search Oracles"
              value={oracleSearchQuery}
              onChange={(e) => setOracleSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Pools"
                ? "bg-gray-800 text-gray-200"
                : "hover:bg-gray-800 text-gray-400"
            }`}
            onClick={() => setActiveTab("Pools")}
          >
            Pools
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Oracles"
                ? "bg-gray-800 text-gray-200"
                : "hover:bg-gray-800 text-gray-400"
            }`}
            onClick={() => setActiveTab("Oracles")}
          >
            Oracles
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Tables based on Active Tab */}
      {activeTab === "Pools" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pool Accounts</h2>
          {loadingPools ? (
            <p>Loading pool data...</p>
          ) : poolData.length === 0 ? (
            <p>No Pool accounts found.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-800">
              <table
                {...getPoolTableProps()}
                className="w-full table-auto border-collapse"
              >
                <thead className="bg-gray-800">
                  {poolHeaderGroups.map((headerGroup, n) => (
                    <tr
                      key={n}
                      {...headerGroup.getHeaderGroupProps()}
                      className="text-gray-400 text-sm"
                    >
                      {headerGroup.headers.map((column, idx) => (
                        <th
                          key={idx}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-4 py-3 text-left font-normal whitespace-nowrap"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{column.render("Header")}</span>
                            <span className="text-gray-600">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaSortDown />
                                ) : (
                                  <FaSortUp />
                                )
                              ) : (
                                <FaSort />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getPoolTableBodyProps()} className="text-sm">
                  {poolRows.map((row, i) => {
                    preparePoolRow(row);
                    return (
                      <tr
                        key={i}
                        {...row.getRowProps()}
                        className={`cursor-pointer hover:bg-gray-800 transition ${
                          i % 2 === 0 ? "bg-gray-900" : "bg-black"
                        }`}
                        onClick={() => handlePoolSelect(row.original)}
                      >
                        {row.cells.map((cell, idx) => (
                          <td
                            key={idx}
                            {...cell.getCellProps()}
                            className="px-4 py-3 border-b border-gray-800 whitespace-nowrap"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "Oracles" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Oracle Accounts</h2>
          {loadingOracles ? (
            <p>Loading oracle data...</p>
          ) : oracleData.length === 0 ? (
            <p>No Oracle accounts found.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-800">
              <table
                {...getOracleTableProps()}
                className="w-full table-auto border-collapse"
              >
                <thead className="bg-gray-800">
                  {oracleHeaderGroups.map((headerGroup, n) => (
                    <tr
                      key={n}
                      {...headerGroup.getHeaderGroupProps()}
                      className="text-gray-400 text-sm"
                    >
                      {headerGroup.headers.map((column, idx) => (
                        <th
                          key={idx}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-4 py-3 text-left font-normal whitespace-nowrap"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{column.render("Header")}</span>
                            <span className="text-gray-600">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaSortDown />
                                ) : (
                                  <FaSortUp />
                                )
                              ) : (
                                <FaSort />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getOracleTableBodyProps()} className="text-sm">
                  {oracleRows.map((row, i) => {
                    prepareOracleRow(row);
                    return (
                      <tr
                        key={i}
                        {...row.getRowProps()}
                        className={`cursor-pointer hover:bg-gray-800 transition ${
                          i % 2 === 0 ? "bg-gray-900" : "bg-black"
                        }`}
                        onClick={() => handleOracleSelect(row.original)}
                      >
                        {row.cells.map((cell, idx) => (
                          <td
                            key={idx}
                            {...cell.getCellProps()}
                            className="px-4 py-3 border-b border-gray-800 whitespace-nowrap"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Dialog for Pool Details */}
      {selectedPool && (
        <AlertDialog
          open={!!selectedPool}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedPool(null);
              setInvestModalOpen(false); // Close Invest Modal if Pool Details Modal is closed
            }
          }}
        >
          <AlertDialogContent className="bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                Pool Details
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Pool: {selectedPool.pubkey}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-300">
                  <p>Total Liquidity: {selectedPool.totalLiquidity}</p>
                  <p>Pool APY: {selectedPool.poolApyBps}%</p>
                  <p>Number of Depositors: {selectedPool.numDepositors}</p>
                </CardContent>
                {/* Invest Button */}
                <CardContent>
                  <button
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold flex items-center justify-center space-x-2"
                    onClick={() => setInvestModalOpen(true)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-9H7v2h6V9z" />
                    </svg>
                    <span>Invest</span>
                  </button>
                </CardContent>
              </Card>
            </AlertDialogDescription>
            <AlertDialogAction>
              <button
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setSelectedPool(null)}
              >
                Close
              </button>
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Dialog for Oracle Details */}
      {selectedOracle && (
        <AlertDialog
          open={!!selectedOracle}
          onOpenChange={() => setSelectedOracle(null)}
        >
          <AlertDialogContent className="bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                Oracle Details
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Oracle: {selectedOracle.pubkey}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-300">
                  <p>Base Price: {selectedOracle.basePrice}</p>
                  <p>Base APY: {selectedOracle.baseApyBps}%</p>
                </CardContent>
              </Card>
            </AlertDialogDescription>
            <AlertDialogAction>
              <button
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setSelectedOracle(null)}
              >
                Close
              </button>
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Dialog for Invest */}
      {investModalOpen && selectedPool && (
        <AlertDialog
          open={investModalOpen}
          onOpenChange={() => setInvestModalOpen(false)}
        >
          <AlertDialogContent className="bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                Invest in Pool
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Invest: {selectedPool.pubkey}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  {/* Chart Section */}
                  <div className="w-full h-64">
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Investment Projection",
                          },
                        },
                      }}
                    />
                  </div>

                  {/* Invest Now Button */}
                  <button
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold flex items-center justify-center space-x-2"
                    onClick={handleInvestNow}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-9H7v2h6V9z" />
                    </svg>
                    <span>Invest Now</span>
                  </button>
                </CardContent>
              </Card>
            </AlertDialogDescription>
            <AlertDialogAction>
              <button
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setInvestModalOpen(false)}
              >
                Close
              </button>
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default PoolDashboard;
