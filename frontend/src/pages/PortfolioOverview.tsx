import React from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  InvestedStock,
  SuggestedStock,
  useStockContext,
} from "../context/StockContext";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

const PortfolioOverview: React.FC = () => {
  const {
    suggestedStocks,
    investedStocks,
    setInvestedStocks,
    setSuggestedStocks,
    totalInvested,
    totalProfitLoss,
    userProfile,
  } = useStockContext();

  const [profitLossPercentage, setProfitLossPercentage] = useState(0);

  // Filter suggested stocks based on user's interests
  const filteredSuggestedStocks = suggestedStocks.filter((stock) =>
    userProfile?.interests.includes(stock.sector)
  );

  // Prepare data for pie chart
  const pieChartData = investedStocks.map((stock) => ({
    name: stock.name,
    value: stock.currentPrice * stock.quantity,
  }));

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const addStock = (stock: SuggestedStock) => {
    setInvestedStocks((prev: InvestedStock[]) => [
      ...prev,
      {
        id: stock.id,
        name: stock.name,
        ticker: stock.ticker,
        quantity: stock.quantity,
        purchasePrice: stock.currentPrice, // Set purchase price at the time of investment
        currentPrice: stock.currentPrice,
        sector: stock.sector, // make sure to carry over sector
        arr: stock.arr,
        sr: stock.sr,
        cr: stock.cr,
        sor: stock.sor,
        mdd: stock.mdd,
        vol: stock.vol,
        expectedReturn: stock.expectedReturn,
      },
    ]);

    setSuggestedStocks((prev) => prev.filter((s) => s.id !== stock.id));
  };

  useEffect(
    () => setProfitLossPercentage((totalProfitLoss / totalInvested) * 100),
    [totalProfitLoss, totalInvested]
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Overview</h1>

      <div
        className={`grid grid-cols-1 ${
          investedStocks.length > 0 ? "lg:grid-cols-3" : "lg:grid-cols-1"
        } gap-6 mb-6`}
      >
        {/* Portfolio Summary */}
        <div className="card col-span-2">
          <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Initial Capital</p>
              <p className="text-2xl font-bold">
                $
                {userProfile?.initialCapital.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-2xl font-bold">
                $
                {totalInvested.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                totalProfitLoss >= 0 ? "bg-green-900/30" : "bg-red-900/30"
              }`}
            >
              <p className="text-gray-400 text-sm">Profit/Loss (Suggested)</p>
              <div className="flex items-center">
                <p
                  className={`text-2xl font-bold ${
                    totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  $
                  {Math.abs(totalProfitLoss).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <span
                  className={`ml-2 flex items-center ${
                    totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {totalProfitLoss >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(profitLossPercentage).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        {investedStocks.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Allocation</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name }) => name}
                    labelLine={false}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                      "Value",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Stock Table */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Suggested Investments</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Stock</th>
                <th>Ticker</th>
                <th>Quantity</th>

                <th>Current Price</th>
                <th>Value</th>

                <th>ARR</th>
                <th>SR</th>
                <th>CR</th>
                <th>SOR</th>
                <th>MDD</th>
                <th>VOL</th>
                <th>Expected Return</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuggestedStocks.map((stock) => {
                // map over filteredSuggestedStocks
                const value = stock.currentPrice * stock.quantity;

                return (
                  <tr key={stock.id}>
                    <td>
                      <Button onClick={() => addStock(stock)}>Add</Button>
                    </td>
                    <td>
                      <Link
                        to={`/stock/${stock.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {stock.name}
                      </Link>
                    </td>
                    <td>{stock.ticker}</td>
                    <td>{stock.quantity}</td>

                    <td>${stock.currentPrice.toFixed(2)}</td>
                    <td>${value.toFixed(2)}</td>
                    <td>{stock.arr.toFixed(1)}%</td>
                    <td>{stock.sr.toFixed(2)}</td>
                    <td>{stock.cr.toFixed(2)}</td>
                    <td>{stock.sor.toFixed(2)}</td>
                    <td>{stock.mdd.toFixed(1)}%</td>
                    <td>{stock.vol.toFixed(1)}%</td>
                    <td className="flex items-center text-blue-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stock.expectedReturn.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Invested Stock Table */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        <div className="overflow-x-auto">
          {investedStocks.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Ticker</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Current Price</th>
                  <th>Value</th>
                  <th>Profit/Loss</th>
                  <th>ARR</th>
                  <th>SR</th>
                  <th>CR</th>
                  <th>SOR</th>
                  <th>MDD</th>
                  <th>VOL</th>
                </tr>
              </thead>
              <tbody>
                {investedStocks.map((stock) => {
                  const value = stock.currentPrice * stock.quantity;
                  const profitLoss =
                    (stock.currentPrice - stock.purchasePrice) * stock.quantity;
                  const profitLossPercentage =
                    ((stock.currentPrice - stock.purchasePrice) /
                      stock.purchasePrice) *
                    100;

                  return (
                    <tr key={stock.id}>
                      <td>
                        <Link
                          to={`/stock/${stock.id}`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {stock.name}
                        </Link>
                      </td>
                      <td>{stock.ticker}</td>
                      <td>{stock.quantity}</td>
                      <td>${stock.purchasePrice.toFixed(2)}</td>
                      <td>${stock.currentPrice.toFixed(2)}</td>
                      <td>${value.toFixed(2)}</td>
                      <td className={profitLoss >= 0 ? "profit" : "loss"}>
                        <div className="flex items-center">
                          {profitLoss >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          ${Math.abs(profitLoss).toFixed(2)} (
                          {Math.abs(profitLossPercentage).toFixed(2)}%)
                        </div>
                      </td>
                      <td>{stock.arr.toFixed(1)}%</td>
                      <td>{stock.sr.toFixed(2)}</td>
                      <td>{stock.cr.toFixed(2)}</td>
                      <td>{stock.sor.toFixed(2)}</td>
                      <td>{stock.mdd.toFixed(1)}%</td>
                      <td>{stock.vol.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              You have no investments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
