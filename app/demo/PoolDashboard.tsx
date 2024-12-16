"use client";
import React, { useState, useMemo } from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Adjust the path based on your project structure
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PoolDashboard = ({ poolData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("All");
  const [selectedStableSwap, setSelectedStableSwap] = useState("All");
  const [selectedPool, setSelectedPool] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "Token Pair",
        accessor: "tokenPair",
        Cell: ({ value, row }) => (
          <div className="flex items-center space-x-3">
            {/* Replace the placeholder div with actual token icons */}
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
              <img src={row.original.icon} alt={value} className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">{value}</span>
              <span className="text-sm text-gray-400">
                {row.original.network}
              </span>
            </div>
          </div>
        ),
      },
      {
        Header: "Version",
        accessor: "version",
        Cell: ({ value }) => <span className="text-gray-300">{value}</span>,
      },
      {
        Header: "APR",
        accessor: "apr",
        Cell: ({ value }) => <span className="text-green-400">{value}</span>,
      },
      {
        Header: "TVL",
        accessor: "tvl",
        Cell: ({ value }) => <span className="text-gray-200">{value}</span>,
      },
      {
        Header: "Volume 24H",
        accessor: "volume24h",
        Cell: ({ value }) => <span className="text-gray-200">{value}</span>,
      },
      {
        Header: "Pool Type",
        accessor: "poolType",
        Cell: ({ value }) => (
          <span className="px-2 py-1 text-sm rounded bg-gray-800 text-gray-200">
            {value}
          </span>
        ),
      },
      {
        Header: "Stable Swap",
        accessor: "stableSwap",
        Cell: ({ value }) => <span className="text-gray-200">{value}</span>,
      },
    ],
    []
  );

  const data = useMemo(() => poolData, [poolData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [{ id: "version", desc: false }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const filteredRows = rows.filter((row) => {
    const { original } = row;
    const matchesSearch = original.tokenPair
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesVersion =
      selectedVersion === "All" || original.version === selectedVersion;
    const matchesStableSwap =
      selectedStableSwap === "All" ||
      original.stableSwap === selectedStableSwap;
    return matchesSearch && matchesVersion && matchesStableSwap;
  });

  const handlePoolSelect = (pool) => {
    setSelectedPool(pool);
  };

  return (
    <div className="bg-black text-white p-8 min-h-screen">
      {/* Top Navigation */}
      <div className="flex space-x-6 mb-6 text-gray-400">
        <button className="hover:text-white border-b-2 border-transparent hover:border-white transition">
          All Pools
        </button>
        <button className="hover:text-white border-b-2 border-transparent hover:border-white transition">
          My Positions
        </button>
        <button className="hover:text-white border-b-2 border-transparent hover:border-white transition">
          History
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <select
            className="bg-gray-800 px-4 py-2 rounded-md focus:outline-none text-gray-200"
            onChange={(e) => console.log(e.target.value)}
          >
            <option>All Networks</option>
            <option>BNB Smart Chain</option>
            <option>Ethereum</option>
          </select>

          <div className="relative w-64">
            <BiSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
            <input
              type="text"
              className="bg-gray-800 w-full px-4 py-2 pl-10 rounded-md focus:outline-none text-gray-200"
              placeholder="All Tokens"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setGlobalFilter(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              selectedVersion === "All"
                ? "bg-gray-800 text-gray-200"
                : "hover:bg-gray-800 text-gray-400"
            }`}
            onClick={() => setSelectedVersion("All")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedVersion === "V2"
                ? "bg-gray-800 text-gray-200"
                : "hover:bg-gray-800 text-gray-400"
            }`}
            onClick={() => setSelectedVersion("V2")}
          >
            V2
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedVersion === "V3"
                ? "bg-gray-800 text-gray-200"
                : "hover:bg-gray-800 text-gray-400"
            }`}
            onClick={() => setSelectedVersion("V3")}
          >
            V3
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedStableSwap === "All"
                ? "bg-gray-800 text-gray-200"
                : "hover:bg-gray-800 text-gray-400"
            }`}
            onClick={() => setSelectedStableSwap("All")}
          >
            Stable Swap
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-800">
        <table
          {...getTableProps()}
          className="w-full table-auto border-collapse"
        >
          <thead className="bg-gray-800">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="text-gray-400 text-sm"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
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
          <tbody {...getTableBodyProps()} className="text-sm">
            {filteredRows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  key={i}
                  {...row.getRowProps()}
                  className={`cursor-pointer hover:bg-gray-800 transition ${
                    i % 2 === 0 ? "bg-black" : "bg-black"
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

      {/* Dialog */}
      {selectedPool && (
        <AlertDialog>
          <AlertDialogTrigger>
            <button className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 mt-4">
              View Pool Details
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                Pool Details
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>{selectedPool.tokenPair}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-300">
                  <p>Network: {selectedPool.network}</p>
                  <p>Version: {selectedPool.version}</p>
                  <p>
                    APR:{" "}
                    <span className="text-green-400">{selectedPool.apr}</span>
                  </p>
                  <p>TVL: {selectedPool.tvl}</p>
                  <p>Volume 24H: {selectedPool.volume24h}</p>
                  <p>Pool Type: {selectedPool.poolType}</p>
                  <p>Stable Swap: {selectedPool.stableSwap}</p>
                </CardContent>
              </Card>
            </AlertDialogDescription>
            <AlertDialogAction>
              <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
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
