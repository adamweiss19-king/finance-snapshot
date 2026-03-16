// utils/storageEngine.js

const STORAGE_KEY = 'wealth_visualizer_snapshots';

// --- THE MOCK HISTORY DATA ---
const MOCK_HISTORY = {
  "2024": {
    dateSaved: "2024-12-31T23:59:59.000Z",
    data: {
      age: 28, filingStatus: 'Single', stateTaxLevel: 'Medium',
      incomeData: [{ id: 1, name: 'Salary', gross: 85000, type: 'W-2 Salary', isTaxable: true }],
      assetData: [{ id: 1, name: 'Chase Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 5000, growth: 0 }],
      debtData: [{ id: 1, name: 'Student Loan', balance: 28000, interestRate: 4.5, linkedAssetId: '' }],
      spendingData: [{ id: 1, name: 'Rent & Living', category: 'Housing', amount: 30000, type: 'Mandatory' }],
      assetContributions: [],
      debtContributions: [{ id: 1, name: 'Minimum Payment', amount: 3600, type: 'Mandatory', linkedId: '1', frequency: 'Monthly' }]
    }
  },
  "2025": {
    dateSaved: "2025-12-31T23:59:59.000Z",
    data: {
      age: 29, filingStatus: 'Single', stateTaxLevel: 'Medium',
      incomeData: [{ id: 1, name: 'Salary', gross: 92000, type: 'W-2 Salary', isTaxable: true }],
      assetData: [
        { id: 1, name: 'Chase Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 12000, growth: 0 },
        { id: 2, name: 'Fidelity 401k', bucket: 'Retirement', category: '401k', balance: 8500, growth: 7 }
      ],
      debtData: [{ id: 1, name: 'Student Loan', balance: 24400, interestRate: 4.5, linkedAssetId: '' }],
      spendingData: [{ id: 1, name: 'Rent & Living', category: 'Housing', amount: 32000, type: 'Mandatory' }],
      assetContributions: [{ id: 1, name: '401k Match', amount: 4600, type: 'Mandatory', linkedId: '2', frequency: 'Monthly' }],
      debtContributions: [{ id: 1, name: 'Minimum Payment', amount: 3600, type: 'Mandatory', linkedId: '1', frequency: 'Monthly' }]
    }
  }
};

// --- THE ENGINE ---
export const getSnapshots = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // If empty, seed it with our mock history!
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_HISTORY));
      return MOCK_HISTORY;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Storage Engine Error: Failed to parse snapshots. Resetting to mock data.", error);
    return MOCK_HISTORY; // Fallback so the app never crashes
  }
};

export const saveSnapshot = (year, fullState) => {
  try {
    const existingSnapshots = getSnapshots() || {};
    existingSnapshots[year] = {
      dateSaved: new Date().toISOString(),
      data: fullState
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSnapshots));
    return existingSnapshots;
  } catch (error) {
    console.error("Storage Engine Error: Failed to save snapshot.", error);
    return getSnapshots(); // Return original if save fails
  }
};