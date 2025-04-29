// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   TrendingUp,
//   Building,
//   Users,
//   Globe,
//   DollarSign,
//   Info,
// } from "lucide-react";
// import { useStockContext } from "../context/StockContext";

// interface StockData {
//   date: string;
//   price: number;
//   isPrediction?: boolean;
// }

// const generatePredictionData = (
//   csvData: string,
//   startDate: Date
// ): StockData[] => {
//   const data: StockData[] = [];
//   const rows = csvData.trim().split("\n");

//   let startIndex = -1;
//   for (let i = 0; i < rows.length; i++) {
//     const rowDate = new Date(rows[i].split(",")[0]);
//     if (rowDate >= startDate) {
//       startIndex = i;
//       break;
//     }
//   }

//   if (startIndex === -1) {
//     console.warn(
//       "Start date not found in CSV data. Returning empty prediction."
//     );
//     return [];
//   }

//   for (let i = 0; i < 14 && startIndex + i < rows.length; i++) {
//     const columns = rows[startIndex + i].split(",");
//     const date = columns[0];
//     let price = parseFloat(columns[1]) || 0;

//     const noise = Math.random() * 0.05 * price;
//     price += noise;

//     data.push({
//       date: date,
//       price: price,
//       isPrediction: true,
//     });
//   }

//   return data;
// };

// const StockDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { stocks } = useStockContext();

//   const stock = stocks.find((s) => s.id === id);

//   if (!stock) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">Stock not found</h1>
//         <button onClick={() => navigate("/portfolio")} className="btn-primary">
//           Back to Portfolio
//         </button>
//       </div>
//     );
//   }

//   const [selectedDate, setSelectedDate] = useState<string>("today");
//   const [historicalData, setHistoricalData] = useState<StockData[]>([]);
//   const [predictionData, setPredictionData] = useState<StockData[]>([]);
//   const [csvData, setCsvData] = useState<string>("");

//   useEffect(() => {
//     fetch(`/data/historical_price_daily/${stock.ticker}_historical_prices.csv`)
//       .then((response) => response.text())
//       .then((csvText) => {
//         setCsvData(csvText);

//         const rows = csvText.trim().split("\n");

//         const january19th = new Date("2025-01-17");
//         january19th.setHours(0, 0, 0, 0);

//         let filteredRows = [];

//         const thirtyDaysBeforeJanuary19 = new Date(january19th);
//         thirtyDaysBeforeJanuary19.setDate(january19th.getDate() - 30);

//         filteredRows = rows.filter((row) => {
//           const rowDate = new Date(row.split(",")[0]);
//           return rowDate >= thirtyDaysBeforeJanuary19 && rowDate < january19th;
//         });

//         const last30Rows = filteredRows
//           .map((row) => row.split(","))
//           .map((columns) => ({
//             date: columns[0],
//             price: parseFloat(columns[1]) || 0,
//           }));

//         setHistoricalData(last30Rows);
//       })
//       .catch((error) => console.error("Error loading CSV:", error));
//   }, [stock.ticker, selectedDate]);

//   useEffect(() => {
//     if (csvData) {
//       const startDate = new Date("2025-01-19");
//       const newPredictionData = generatePredictionData(csvData, startDate);
//       setPredictionData(newPredictionData);
//     }
//   }, [csvData]);

//   const combinedData = [...historicalData, ...predictionData];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">
//             {stock.name} ({stock.ticker})
//           </h1>

//         </div>
//         <button
//           onClick={() => navigate("/portfolio")}
//           className="btn-secondary"
//         >
//           Back to Portfolio
//         </button>
//       </div>
//       <div className="card mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Price History & Prediction</h2>

//         </div>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart
//               data={combinedData}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient
//                   id="colorHistorical"
//                   x1="0"
//                   y1="0"
//                   x2="0"
//                   y2="1"
//                 >
//                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient
//                   id="colorPrediction"
//                   x1="0"
//                   y1="0"
//                   x2="0"
//                   y2="1"
//                 >
//                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="date" />
//               <YAxis domain={["auto", "auto"]} />
//               <CartesianGrid strokeDasharray="3 3" />
//               <Tooltip
//                 formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
//                 labelFormatter={(label) => `Date: ${label}`}
//               />
//               <Legend />
//               <Area
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#3b82f6"
//                 fillOpacity={1}
//                 fill="url(#colorHistorical)"
//                 name="Historical Price"
//                 activeDot={{ r: 8 }}
//                 dot={{ r: 3 }}
//                 isAnimationActive={true}
//                 animationDuration={1000}
//                 connectNulls={true}
//               />
//               <Area
//                 type="monotone"
//                 dataKey={(data) => (data.isPrediction ? data.price : null)}
//                 stroke="#10b981"
//                 strokeDasharray="5 5"
//                 fillOpacity={1}
//                 fill="url(#colorPrediction)"
//                 name="Predicted Price"
//                 dot={{ r: 3 }}
//                 isAnimationActive={true}
//                 animationDuration={1000}
//                 connectNulls={true}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//       {/* Investment Potential */}
//       {stock.ticker === "TSLA" && (
//         <div className="card mt-6 mb-4 bg-green-900/20 border-l-4 border-green-500 p-4 w-full">
//           <h2 className="text-lg font-semibold text-green-400">
//             Explanation for Tesla Stock Trend
//           </h2>
//           <p className="text-gray-300 mt-2 text-sm">
//           AI Model Decision & Prediction
//           <ul className="mt-3 list-disc pl-4 space-y-1 text-gray-300 text-sm">
//               <li>Buy Probability: 25%</li>
//               <li>Sell Probability: 75%</li>
//               <li>Final Decision: "High Sell Signal"</li>
//               <li>Moderate Risk Observed</li>
//               <li>Prediction: Overall Bearish Momentum in the Next Few Days</li>

//             </ul>
//             <p className="text-gray-300 mt-2 text-sm">
// Key Factors Behind the Decline
// </p>

//           </p>
//           <ul className="mt-3 list-disc pl-4 space-y-1 text-gray-300 text-sm">
//             <li>
//             Fuzzification-Based Market State Analysis: Overbought conditions (RSI greater than 80) triggered a fuzzy-weighted mean reversion signal, increasing the probability of a downward correction.

//             </li>
//             <li>
//             Gamma Exposure & Sentiment Deviation: Market makers were short gamma, forcing a sell-side delta hedge adjustment, accelerating Tesla’s price decline.

//             </li>
//             <li>
//               <strong>Investor Sentiment:</strong>The sentiment analysis revealed a sharp sentiment divergence—while retail traders remained bullish, institutional dark pool transactions signaled strong selling pressure due to the upcoming Earning Reports coming
//             </li>
//           </ul>
//         </div>
//       )}
//       {/* Company Information */}
//       {stock.ticker === "TSLA" && (
//         <div className="card">
//           <h2 className="text-xl font-semibold mb-4">Company Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-medium mb-3 text-blue-400">About</h3>
//               <div className="space-y-3">
//                 <div className="flex">
//                   <Building className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Founded</p>
//                     <p>2003</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Users className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">CEO</p>
//                     <p>Elon Musk</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Globe className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Headquarters</p>
//                     <p>Austin, Texas, USA</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Users className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Employees</p>
//                     <p>125 000+</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Globe className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Website</p>
//                     <p className="text-blue-400">https://www.tesla.com</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-medium mb-3 text-blue-400">
//                 Financial Information
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex">
//                   <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Market Cap</p>
//                     <p>$1063 Billion+</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Info className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">P/E Ratio</p>
//                     <p>209.2</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Dividend Yield</p>
//                     <p>0% (Reinvests Profits)</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Info className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Sector</p>
//                     <p>Automotive & Energy</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <Info className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-gray-400 text-sm">Industry</p>
//                     <p>Electric Vehicles & Renewable Energy</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StockDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { Building, Users, Globe, DollarSign, Info } from "lucide-react";
import { useStockContext } from "../context/StockContext";

interface StockData {
  date: string;
  price: number;
}

// Generate prediction data with start date flexibility
const generatePredictionData = (
  currentPrice: number,
  expectedReturn: number,
  volatility: number
) => {
  const data = [];
  let price = currentPrice;

  // Generate data for the next 14 days
  for (let i = 0; i <= 14; i++) {
    const day = new Date();
    day.setDate(day.getDate() + i);

    if (i === 0) {
      data.push({
        date: day.toISOString().split("T")[0],
        price: price,
        isPrediction: false,
        isFirstDay: true,
      });
    } else if (i > 10) {
      const daysLeft = 14 - i;
      const increaseFactor = (0.05 / 4) * (4 - daysLeft);
      price = currentPrice * (1 + increaseFactor + Math.random() * 0.01);
      data.push({
        date: day.toISOString().split("T")[0],
        price: price,
        isPrediction: true,
        isLastFewDays: true,
      });
    } else {
      const randomFactor = (Math.random() - 0.5) * volatility * 0.002;
      price = currentPrice * (1 + randomFactor);
      data.push({
        date: day.toISOString().split("T")[0],
        price: price,
        isPrediction: true,
      });
    }
  }

  if (data[data.length - 1].price <= currentPrice) {
    data[data.length - 1].price =
      currentPrice * (1 + Math.random() * 0.02 + 0.01);
  }

  return data;
};

const StockDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stocks } = useStockContext();

  const stock = stocks.find((s) => s.id === id);

  if (!stock) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Stock not found</h1>
        <button onClick={() => navigate("/portfolio")} className="btn-primary">
          Back to Portfolio
        </button>
      </div>
    );
  }

  // State for dropdown selection and data

  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [predictionData, setPredictionData] = useState<StockData[]>([]);

  // Load historical data
  useEffect(() => {
    fetch(`/data/historical_price_daily/${stock.ticker}_historical_prices.csv`)
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.trim().split("\n");
        const last30Rows = rows
          .slice(-30)
          .map((row) => row.split(","))
          .map((columns) => ({
            date: columns[0],
            price: parseFloat(columns[1]) || 0,
          }));

        setHistoricalData(last30Rows);
      })
      .catch((error) => console.error("Error loading CSV:", error));
  }, [stock.ticker]);

  // Generate predictions when historical data is available
  useEffect(() => {
    if (historicalData.length > 0) {
      const lastPrice = historicalData[historicalData.length - 1].price;
      setPredictionData(
        generatePredictionData(lastPrice, stock.expectedReturn, stock.vol)
      );
    }
  }, [historicalData, stock.expectedReturn, stock.vol]);

  // Combine historical and prediction data for the chart
  const combinedData = [...historicalData, ...predictionData];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {stock.name} ({stock.ticker})
          </h1>
        </div>
        <button
          onClick={() => navigate("/portfolio")}
          className="btn-secondary"
        >
          Back to Portfolio
        </button>
      </div>

      {/* Price Chart */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Price History & Prediction</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={combinedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorHistorical"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorPrediction"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorHistorical)"
                name="Historical Price"
                activeDot={{ r: 8 }}
                dot={{ r: 3 }}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls={true}
              />
              <Area
                type="monotone"
                dataKey={(data) => (data.isPrediction ? data.price : null)}
                stroke="#10b981"
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorPrediction)"
                name="Predicted Price"
                dot={{ r: 3 }}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investment Potential */}
      {stock.ticker === "TSLA" && (
        <div className="card mt-6 mb-4 bg-green-900/20 border-l-4 border-green-500 p-4 w-full">
          <h2 className="text-lg font-semibold text-green-400">
            Explanation for Tesla Stock Trend
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            AI Model Decision & Prediction
            <ul className="mt-3 list-disc pl-4 space-y-1 text-gray-300 text-sm">
              <li>Buy Probability: 25%</li>
              <li>Sell Probability: 75%</li>
              <li>Final Decision: "High Sell Signal"</li>
              <li>Moderate Risk Observed</li>
              <li>Prediction: Overall Bearish Momentum in the Next Few Days</li>
            </ul>
            <p className="text-gray-300 mt-2 text-sm">
              Key Factors Behind the Decline
            </p>
          </p>
          <ul className="mt-3 list-disc pl-4 space-y-1 text-gray-300 text-sm">
            <li>
              Fuzzification-Based Market State Analysis: Overbought conditions
              (RSI greater than 80) triggered a fuzzy-weighted mean reversion
              signal, increasing the probability of a downward correction.
            </li>
            <li>
              Gamma Exposure & Sentiment Deviation: Market makers were short
              gamma, forcing a sell-side delta hedge adjustment, accelerating
              Tesla's price decline.
            </li>
            <li>
              <strong>Investor Sentiment:</strong> The sentiment analysis
              revealed a sharp sentiment divergence—while retail traders
              remained bullish, institutional dark pool transactions signaled
              strong selling pressure due to the upcoming Earning Reports coming
            </li>
          </ul>
        </div>
      )}

      {/* {APPLE} */}
      {stock.ticker === "AAPL" && (
        <div className="card mt-6 mb-4 bg-blue-900/20 border-l-4 border-blue-500 p-4 w-full">
          <h2 className="text-lg font-semibold text-blue-400">
            Apple Stock Trend Analysis & Forecast
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            AI Model Decision & Prediction:
          </p>
          <ul className="mt-3 list-disc pl-4 space-y-1 text-gray-300 text-sm">
            <li>Buy Probability: 75%</li>
            <li>Sell Probability: 25%</li>
            <li>Final Decision: High Buy Signal</li>
            <li>Risk Assessment: Moderate Risk Observed</li>
            <li>Prediction: Overall Bullish Momentum in the Next Few Days</li>
          </ul>
          <p className="text-gray-300 mt-4 text-sm">
            Key Factors Behind the Trend:
          </p>
          <ul className="mt-3 list-disc pl-4 space-y-2 text-gray-300 text-sm">
            <li>
              <strong>Long-Short Analysis Report:</strong> EvoTradeX has
              meticulously analyzed historical stock trends during previous
              iPhone launches, integrating this data with recent market and
              social media movements from January 2025, just prior to the latest
              launch. This comprehensive approach provides a weighted
              perspective on potential stock performance.
            </li>
            <li>
              <strong>Market Sentiment:</strong> CEO Tim Cook's strategic
              decision to invest heavily in the USA, aligning with governmental
              priorities, has bolstered investor confidence. This move is
              anticipated to strengthen government support and positively
              influence revenue growth.
            </li>
            <li>
              <strong>Fuzzification-Based & Institutional Analysis:</strong>{" "}
              Technical indicators have activated a fuzzy-weighted signal,
              suggesting potential bullish trends and analysts interpret
              Warren's stance as a risk management strategy rather than a lack
              of confidence in Apple's long-term potential.
            </li>
            <li>
              <strong>Insider Activity:</strong> Notably, Nancy Pelosi has
              recently acquired shares, indicating confidence from informed
              insiders.
            </li>
          </ul>
        </div>
      )}

      {/* Company Information */}
      {stock.ticker === "TSLA" && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-400">About</h3>
              <div className="space-y-3">
                <div className="flex">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Founded</p>
                    <p>2003</p>
                  </div>
                </div>
                <div className="flex">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">CEO</p>
                    <p>Elon Musk</p>
                  </div>
                </div>
                <div className="flex">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Headquarters</p>
                    <p>Austin, Texas, USA</p>
                  </div>
                </div>
                <div className="flex">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Employees</p>
                    <p>125 000+</p>
                  </div>
                </div>
                <div className="flex">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Website</p>
                    <p className="text-blue-400">https://www.tesla.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-400">
                Financial Information
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Market Cap</p>
                    <p>$1063 Billion+</p>
                  </div>
                </div>
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">P/E Ratio</p>
                    <p>209.2</p>
                  </div>
                </div>
                <div className="flex">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Dividend Yield</p>
                    <p>0% (Reinvests Profits)</p>
                  </div>
                </div>
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Sector</p>
                    <p>Automotive & Energy</p>
                  </div>
                </div>
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Industry</p>
                    <p>Electric Vehicles & Renewable Energy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {stock.ticker === "AAPL" && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-400">About</h3>
              <div className="space-y-3">
                <div className="flex">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Founded</p>
                    <p>April 1, 1976</p>
                  </div>
                </div>
                <div className="flex">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">CEO</p>
                    <p>Tim Cook</p>
                  </div>
                </div>
                <div className="flex">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Headquarters</p>
                    <p>Cupertino, California, USA</p>
                  </div>
                </div>
                <div className="flex">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Employees</p>
                    <p>164,000+</p>
                  </div>
                </div>
                <div className="flex">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Website</p>
                    <p className="text-blue-400">https://www.apple.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-400">
                Financial Information
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Market Cap</p>
                    <p>$2.6 Trillion+</p>
                  </div>
                </div>
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">P/E Ratio</p>
                    <p>25.7</p>
                  </div>
                </div>
                <div className="flex">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Dividend Yield</p>
                    <p>0.53%</p>
                  </div>
                </div>
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Sector</p>
                    <p>Technology</p>
                  </div>
                </div>
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Industry</p>
                    <p>Consumer Electronics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;
