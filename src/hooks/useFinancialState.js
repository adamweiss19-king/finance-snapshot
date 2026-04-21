import { useState } from 'react';

export function useFinancialState() {
  // 1. Core Financial Data
  const [age, setAge] = useState(30);
  const [filingStatus, setFilingStatus] = useState('Single');
  const [stateTaxLevel, setStateTaxLevel] = useState('Medium');

  const [incomeData, setIncomeData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [debtData, setDebtData] = useState([]);

  // 2. The Flow Data
  const [spendingData, setSpendingData] = useState([]);
  const [assetContributions, setAssetContributions] = useState([]);
  const [debtContributions, setDebtContributions] = useState([]);

  // 3. Smart Helper: Load an entire state object at once
  // We use this when Time Traveling, or when wiping the screen!
  const loadFinancialData = (data = {}) => {
    setAge(data.age || 30);
    setFilingStatus(data.filingStatus || 'Single');
    setStateTaxLevel(data.stateTaxLevel || 'Medium');
    setIncomeData(data.incomeData || []);
  // --- SAFE FALLBACKS FOR ASSETS ---
    // If an old save doesn't have a bucket or growth rate, default to Cash and 0%
    const safeAssets = (data.assetData || []).map(asset => ({
      ...asset,
      bucket: asset.bucket || 'Cash',
      category: asset.category || '',
      balance: Number(asset.balance) || 0,
      growth: Number(asset.growth) || 0
    }));
    setAssetData(safeAssets);

    // --- SAFE FALLBACKS FOR DEBTS ---
    const safeDebts = (data.debtData || []).map(debt => ({
      ...debt,
      balance: Number(debt.balance) || 0,
      interestRate: Number(debt.interestRate) || 0
    }));
    setDebtData(safeDebts);

    // --- SAFE FALLBACKS FOR CONTRIBUTIONS ---
    // Ensure older contributions default to 'new' if they aren't linked yet
    const safeAssetContributions = (data.assetContributions || []).map(cont => ({
      ...cont,
      amount: Number(cont.amount) || 0,
      linkedId: cont.linkedId || 'new'
    }));
    setAssetContributions(safeAssetContributions);

    const safeDebtContributions = (data.debtContributions || []).map(cont => ({
      ...cont,
      amount: Number(cont.amount) || 0,
      linkedId: cont.linkedId || 'new',
      type: cont.type || 'Mandatory'
    }));
    setDebtContributions(safeDebtContributions);

    // Any other arrays can safely default to empty
    setSpendingData(data.spendingData || []);
  };

  // 4. Return everything so App.jsx can use it
  return {
    age, setAge,
    filingStatus, setFilingStatus,
    stateTaxLevel, setStateTaxLevel,
    incomeData, setIncomeData,
    assetData, setAssetData,
    debtData, setDebtData,
    spendingData, setSpendingData,
    assetContributions, setAssetContributions,
    debtContributions, setDebtContributions,
    loadFinancialData
  };
}