import React, { createContext, useState, useContext, ReactNode } from "react";

// Define types for suggested and invested stocks
export interface SuggestedStock {
  id: string;
  name: string;
  ticker: string;
  currentPrice: number;
  quantity: number;
  sector: string; // Added sector
  arr: number; // Annual Return Rate
  sr: number; // Sharpe Ratio
  cr: number; // Calmar Ratio
  sor: number; // Sortino Ratio
  mdd: number; // Maximum Drawdown
  vol: number; // Volatility
  expectedReturn: number; // AI prediction
}

export interface InvestedStock {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  sector: string; // Added sector
  arr: number; // Annual Return Rate
  sr: number; // Sharpe Ratio
  cr: number; // Calmar Ratio
  sor: number; // Sortino Ratio
  mdd: number; // Maximum Drawdown
  vol: number; // Volatility

  expectedReturn: number;
}

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  currentPrice: number;
  quantity: number;
  sector: string; // Added sector
  arr: number; // Annual Return Rate
  sr: number; // Sharpe Ratio
  cr: number; // Calmar Ratio
  sor: number; // Sortino Ratio
  mdd: number; // Maximum Drawdown
  vol: number; // Volatility
  expectedReturn: number; // AI prediction
}
export interface UserProfile {
  name: string;
  interests: string[];
  initialCapital: number;
}

interface StockContextType {
  stocks: Stock[];
  suggestedStocks: SuggestedStock[];
  investedStocks: InvestedStock[];
  userProfile: UserProfile | null;
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  // profitLossPercentage:number;
  setUserProfile: (profile: UserProfile) => void;
  setInvestedStocks: React.Dispatch<React.SetStateAction<InvestedStock[]>>;
  setSuggestedStocks: React.Dispatch<React.SetStateAction<SuggestedStock[]>>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);
// Sample suggested stocks (initially all stocks are suggested)
const sampleStocks: SuggestedStock[] = [
  {
    id: "1",
    name: "Mastercard Inc.",
    ticker: "MA",
    quantity: 6,
    sector: "Finance",
    currentPrice: 528.06,
    arr: 13.8,
    sr: 1.3,
    cr: 0.9,
    sor: 1.6,
    mdd: 14.5,
    vol: 17.2,
    expectedReturn: 14.9,
  },
  {
    id: "2",
    name: "Netflix, Inc.",
    ticker: "NFLX",
    quantity: 4,
    sector: "Technology",
    currentPrice: 869.68,
    arr: 10.4,
    sr: 1.1,
    cr: 0.75,
    sor: 1.3,
    mdd: 20.2,
    vol: 22.8,
    expectedReturn: 13.1,
  },
  {
    id: "3",
    name: "Visa Inc.",
    ticker: "V",
    quantity: 6,
    sector: "Finance",
    currentPrice: 323.09,
    arr: 12.9,
    sr: 1.25,
    cr: 0.88,
    sor: 1.5,
    mdd: 13.7,
    vol: 16.9,
    expectedReturn: 14.5,
  },
  {
    id: "4",
    name: "Tesla, Inc.",
    ticker: "TSLA",
    quantity: 10,
    sector: "Technology",
    currentPrice: 424.07,
    arr: 18.5,
    sr: 1.6,
    cr: 1.1,
    sor: 1.9,
    mdd: 25.4,
    vol: 30.1,
    expectedReturn: 20.2,
  },
  {
    id: "5",
    name: "Palantir Technologies Inc.",
    ticker: "PLTR",
    quantity: 10,
    sector: "Technology",
    currentPrice: 73.07,
    arr: 16.2,
    sr: 1.45,
    cr: 1.0,
    sor: 1.8,
    mdd: 27.1,
    vol: 35.5,
    expectedReturn: 18.0,
  },
  {
    id: "6",
    name: "AbbVie Inc.",
    ticker: "ABBV",
    quantity: 4,
    sector: "Healthcare",
    currentPrice: 172.61,
    arr: 11.5,
    sr: 1.2,
    cr: 0.8,
    sor: 1.4,
    mdd: 15.9,
    vol: 18.2,
    expectedReturn: 12.8,
  },
  {
    id: "7",
    name: "Johnson & Johnson",
    ticker: "JNJ",
    quantity: 6,
    sector: "Healthcare",
    currentPrice: 163.55,
    arr: 10.9,
    sr: 1.15,
    cr: 0.82,
    sor: 1.35,
    mdd: 12.4,
    vol: 14.7,
    expectedReturn: 12.1,
  },
  {
    id: "8",
    name: "Merck & Co., Inc.",
    ticker: "MRK",
    quantity: 7,
    sector: "Healthcare",
    currentPrice: 107.9,
    arr: 11.2,
    sr: 1.18,
    cr: 0.85,
    sor: 1.38,
    mdd: 13.2,
    vol: 15.9,
    expectedReturn: 12.3,
  },
  {
    id: "9",
    name: "UnitedHealth Group Inc.",
    ticker: "UNH",
    quantity: 5,
    sector: "Healthcare",
    currentPrice: 513.45,
    arr: 12.7,
    sr: 1.3,
    cr: 0.9,
    sor: 1.5,
    mdd: 14.6,
    vol: 17.8,
    expectedReturn: 13.9,
  },
  {
    id: "10",
    name: "Procter & Gamble Co.",
    ticker: "PG",
    quantity: 6,
    sector: "Consumer Goods",
    currentPrice: 152.3,
    arr: 9.5,
    sr: 1.1,
    cr: 0.78,
    sor: 1.3,
    mdd: 11.9,
    vol: 13.2,
    expectedReturn: 10.8,
  },
  {
    id: "11",
    name: "The Coca-Cola Company",
    ticker: "KO",
    quantity: 8,
    sector: "Consumer Goods",
    currentPrice: 59.75,
    arr: 8.2,
    sr: 1.05,
    cr: 0.76,
    sor: 1.25,
    mdd: 10.5,
    vol: 12.4,
    expectedReturn: 9.6,
  },
  {
    id: "12",
    name: "PepsiCo, Inc.",
    ticker: "PEP",
    quantity: 7,
    sector: "Consumer Goods",
    currentPrice: 174.6,
    arr: 9.8,
    sr: 1.12,
    cr: 0.8,
    sor: 1.32,
    mdd: 11.3,
    vol: 13.7,
    expectedReturn: 11.2,
  },
  {
    id: "13",
    name: "Oracle Corporation",
    ticker: "ORCL",
    quantity: 7,
    sector: "Technology",
    currentPrice: 125.5,
    arr: 12.1,
    sr: 1.22,
    cr: 0.84,
    sor: 1.4,
    mdd: 15.3,
    vol: 18.9,
    expectedReturn: 13.5,
  },
  {
    id: "14",
    name: "Goldman Sachs Group Inc.",
    ticker: "GS",
    quantity: 5,
    sector: "Finance",
    currentPrice: 391.2,
    arr: 11.6,
    sr: 1.19,
    cr: 0.83,
    sor: 1.36,
    mdd: 13.9,
    vol: 16.5,
    expectedReturn: 12.7,
  },
  {
    id: "15",
    name: "McDonald's Corporation",
    ticker: "MCD",
    quantity: 5,
    sector: "Consumer Goods",
    currentPrice: 293.4,
    arr: 10.7,
    sr: 1.18,
    cr: 0.81,
    sor: 1.32,
    mdd: 12.5,
    vol: 14.9,
    expectedReturn: 11.9,
  },
  {
    id: "16",
    name: "Costco Wholesale Corporation",
    ticker: "COST",
    quantity: 6,
    sector: "Consumer Goods",
    currentPrice: 731.56,
    arr: 9.3,
    sr: 1.08,
    cr: 0.77,
    sor: 1.28,
    mdd: 10.7,
    vol: 13.5,
    expectedReturn: 10.5,
  },
  {
    id: "17",
    name: "Salesforce, Inc.",
    ticker: "CRM",
    quantity: 7,
    sector: "Technology",
    currentPrice: 315.9,
    arr: 14.1,
    sr: 1.3,
    cr: 0.9,
    sor: 1.5,
    mdd: 19.2,
    vol: 21.8,
    expectedReturn: 15.3,
  },
  {
    id: "18",
    name: "Cisco Systems, Inc.",
    ticker: "CSCO",
    quantity: 9,
    sector: "Technology",
    currentPrice: 49.78,
    arr: 8.9,
    sr: 1.07,
    cr: 0.76,
    sor: 1.27,
    mdd: 12.3,
    vol: 15.2,
    expectedReturn: 9.8,
  },
  {
    id: "19",
    name: "Bank of America Corporation",
    ticker: "BAC",
    quantity: 8,
    sector: "Finance",
    currentPrice: 36.9,
    arr: 9.6,
    sr: 1.1,
    cr: 0.82,
    sor: 1.3,
    mdd: 11.7,
    vol: 14.2,
    expectedReturn: 11.0,
  },
  {
    id: "20",
    name: "JPMorgan Chase & Co.",
    ticker: "JPM",
    quantity: 5,
    sector: "Finance",
    currentPrice: 186.2,
    arr: 11.3,
    sr: 1.2,
    cr: 0.85,
    sor: 1.4,
    mdd: 12.8,
    vol: 15.4,
    expectedReturn: 12.5,
  },
  {
    id: "21",
    name: "Thermo Fisher Scientific Inc.",
    ticker: "TMO",
    quantity: 6,
    sector: "Healthcare",
    currentPrice: 562.34,
    arr: 13.2,
    sr: 1.28,
    cr: 0.88,
    sor: 1.42,
    mdd: 15.7,
    vol: 18.9,
    expectedReturn: 14.3,
  },
  {
    id: "22",
    name: "Apple Inc.",
    ticker: "AAPL",
    quantity: 6,
    sector: "misc",
    currentPrice: 562.34,
    arr: 13.2,
    sr: 1.28,
    cr: 0.88,
    sor: 1.42,
    mdd: 15.7,
    vol: 18.9,
    expectedReturn: 14.3,
  },
];

export const StockProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stocks] = useState<Stock[]>(sampleStocks);
  const [suggestedStocks, setSuggestedStocks] = useState<SuggestedStock[]>(
    sampleStocks.filter((stock) => stock.id !== "4")
  );

  const [investedStocks, setInvestedStocks] = useState<InvestedStock[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Calculate total portfolio value based on invested stocks
  const totalValue = investedStocks.reduce(
    (total, stock) => total + stock.currentPrice * stock.quantity,
    0
  );

  const totalInvested = investedStocks.reduce(
    (total, stock) => total + stock.purchasePrice * stock.quantity,
    0
  );

  const totalProfitLoss = investedStocks.reduce(
    (total, stock) => total + stock.expectedReturn,
    0
  );

  return (
    <StockContext.Provider
      value={{
        stocks,
        suggestedStocks,
        investedStocks,
        userProfile,
        totalValue,
        totalInvested,
        setUserProfile,
        setInvestedStocks,
        setSuggestedStocks,
        totalProfitLoss,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error("useStockContext must be used within a StockProvider");
  }
  return context;
};
