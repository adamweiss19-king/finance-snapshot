// utils/storageEngine.js

const STORAGE_KEY = 'wealth_visualizer_snapshots_v2'; // Changed key to avoid old data conflicts

// --- THE NEW MOCK HISTORY (Plan vs Actuals) ---
const MOCK_HISTORY = {
  "2024": {
    status: "closed",
    plan: {
      age: 28, filingStatus: 'Single', stateTaxLevel: 'Medium',
      incomeData: [{ id: 1, name: 'Salary', gross: 85000, type: 'W-2 Salary', isTaxable: true }],
      assetData: [{ id: 1, name: 'Chase Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 5000, growth: 0 }],
      debtData: [{ id: 1, name: 'Student Loan', balance: 28000, interestRate: 4.5, linkedAssetId: '' }],
      spendingData: [{ id: 1, name: 'Rent & Living', category: 'Housing', amount: 30000, type: 'Mandatory' }],
      assetContributions: [{ id: 1, name: 'Save Cash', amount: 5000, type: 'Discretionary', linkedId: '1', frequency: 'Monthly' }],
      debtContributions: [{ id: 1, name: 'Minimum Payment', amount: 3600, type: 'Mandatory', linkedId: '1', frequency: 'Monthly' }]
    },
    actuals: {
      // What actually happened by Dec 31st
      incomeData: [{ id: 1, name: 'Salary', gross: 88000, type: 'W-2 Salary', isTaxable: true }], // Got a raise!
      assetData: [{ id: 1, name: 'Chase Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 12000, growth: 0 }], // Saved more than planned
      debtData: [{ id: 1, name: 'Student Loan', balance: 24400, interestRate: 4.5, linkedAssetId: '' }],
      spendingData: [{ id: 1, name: 'Rent & Living', category: 'Housing', amount: 32000, type: 'Mandatory' }],
      assetContributions: [{ id: 1, name: 'Save Cash', amount: 7000, type: 'Discretionary', linkedId: '1', frequency: 'Monthly' }], // Actually deposited 7k
      debtContributions: [{ id: 1, name: 'Minimum Payment', amount: 3600, type: 'Mandatory', linkedId: '1', frequency: 'Monthly' }]
    }
  },
  "2025": {
    status: "open",
    plan: {
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
    },
    actuals: null // Hasn't happened yet!
  }
};

export const getSnapshots = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_HISTORY));
      return MOCK_HISTORY;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Storage Engine Error. Resetting to mock data.", error);
    return MOCK_HISTORY; 
  }
};

// We will update this later to handle "saving a plan" vs "saving actuals"
export const saveSnapshot = (year, fullState, type = 'plan', status = 'open') => {
  try {
    const existingSnapshots = getSnapshots() || {};
    
    // If the year doesn't exist yet, initialize it
    if (!existingSnapshots[year]) {
      existingSnapshots[year] = { status: status, plan: {}, actuals: null };
    }
    
    // Update either the plan or the actuals based on the type passed in
    existingSnapshots[year][type] = fullState;
    existingSnapshots[year].status = status;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSnapshots));
    return existingSnapshots;
  } catch (error) {
    console.error("Storage Engine Error: Failed to save snapshot.", error);
    return getSnapshots();
  }
};