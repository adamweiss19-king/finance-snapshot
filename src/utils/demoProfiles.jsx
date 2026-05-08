export const demoProfiles = {
  singleNewHire: {
    "2023": {
      status: "closed",
      plan: {
        age: 23, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'First Job Salary', gross: 60000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 1000, growth: 0 }],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 30000, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 17000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 4500, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 7500, type: 'Discretionary' }
        ],
        assetContributions: [], 
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3000, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 23, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'First Job Salary', gross: 60000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 1200, growth: 0 }],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 28500, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 17000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 4500, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 8000, type: 'Discretionary' }
        ]
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 24, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 65000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 1200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 0, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 28500, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 4800, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 8000, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3250, linkedId: '102', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 24, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [
          { id: 1, name: 'Base Salary', gross: 65000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Surprise EOY Bonus', gross: 2500, type: 'Bonus', isTaxable: true }
        ],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 3450, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25940, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 4800, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 8000, type: 'Discretionary' }
        ]
      }
    },
    "2025": {
      status: "closed",
      plan: {
        age: 25, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 67000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 3450, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25940, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 18600, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 5000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 10000, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3350, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Buffer Savings', amount: 1200, linkedId: '101', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 25, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 67000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4000, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 9500, growth: 7 } 
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 23766, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 18600, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 5000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 10500, type: 'Discretionary' } 
        ]
      }
    },
    "2026": {
      status: "open",
      plan: {
        age: 26, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Senior Role Salary', gross: 82000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4000, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 9500, growth: 7 },
          { id: 103, name: 'Robinhood Brokerage', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 0, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 23766, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 19200, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 5400, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 6000, type: 'Discretionary' } 
        ], 
        assetContributions: [
          { id: 401, name: 'Increased 401(k)', amount: 6000, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'ETF Investing', amount: 3600, linkedId: '103', frequency: 'Monthly' }
        ], 
        debtContributions: [
          { id: 501, name: 'Aggressive Payoff', amount: 6000, linkedId: '201', frequency: 'Monthly' }
        ]
      },
      actuals: null
    }
  },

  singleMidCareer: {
    "2023": {
      status: "closed",
      plan: {
        age: 31, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Manager Salary', gross: 110000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 10000, growth: 0 }],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 18000, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 23000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 11000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 14000, type: 'Discretionary' }
        ], 
        assetContributions: [], 
        debtContributions: [{ id: 501, name: 'Standard Payment', amount: 4800, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 31, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Manager Salary', gross: 110000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 0 }], 
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 14000, interestRate: 6.0, linkedAssetId: '' }], 
        spendingData: [
          { id: 301, name: 'Rent', amount: 23000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 11000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 14000, type: 'Discretionary' }
        ]
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 32, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 115000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 0 }],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 14000, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 24000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 12000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 15000, type: 'Discretionary' }
        ], 
        assetContributions: [{ id: 401, name: 'Cash Hoarding', amount: 5000, linkedId: '101', frequency: 'Monthly' }], 
        debtContributions: [{ id: 501, name: 'Standard Payment', amount: 4800, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 32, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 115000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 22000, growth: 0 }], 
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 9500, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 24000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 12000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 15000, type: 'Discretionary' }
        ]
      }
    },
    "2025": {
      status: "closed",
      plan: {
        age: 33, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 120000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 22000, growth: 0 }],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 9500, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent', amount: 24500, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 12500, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 16000, type: 'Discretionary' }
        ], 
        assetContributions: [], 
        debtContributions: [{ id: 501, name: 'Lump Sum Payoff', amount: 9500, linkedId: '201', frequency: 'Yearly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: { 
        age: 33, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 120000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 18500, growth: 0 }],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 0, interestRate: 6.0, linkedAssetId: '' }], // Debt gone!
        spendingData: [
          { id: 301, name: 'Rent', amount: 24500, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 12500, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 16000, type: 'Discretionary' }
        ]
      }
    },
    "2026": {
      status: "open",
      plan: {
        age: 34, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 125000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Bank of America Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 18500, growth: 0 },
          { id: 102, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 0, growth: 4.5 },
          { id: 103, name: 'Vanguard Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 0, growth: 7 }
        ],
        debtData: [], 
        spendingData: [
          { id: 301, name: 'Rent', amount: 25000, type: 'Mandatory' },
          { id: 302, name: 'Living Expenses', amount: 13000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 12000, type: 'Discretionary' }
        ], 
        assetContributions: [
          { id: 401, name: 'Max Roth IRA', amount: 7000, linkedId: '103', frequency: 'Yearly' },
          { id: 402, name: 'Emergency Fund Sweep', amount: 12000, linkedId: '102', frequency: 'Monthly' }
        ], 
        debtContributions: []
      },
      actuals: null
    }
  },

  familyMidCareer: {
    "2023": {
      status: "closed",
      plan: {
        age: 37, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 100000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 70000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 5000, growth: 0 },
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 430000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 330000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 35000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 22000, type: 'Discretionary' }
        ], 
        assetContributions: [], 
        debtContributions: [{ id: 501, name: 'Mortgage Payment', amount: 24000, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 37, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 100000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 70000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 8000, growth: 0 },
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 450000, growth: 3 } 
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 35000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 22000, type: 'Discretionary' }
        ]
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 38, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 105000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 75000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 8000, growth: 0 },
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 450000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 36000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 24000, type: 'Discretionary' }
        ], 
        assetContributions: [
          { id: 401, name: 'Cash Savings', amount: 4000, linkedId: '102', frequency: 'Monthly' }
        ], 
        debtContributions: [{ id: 501, name: 'Mortgage Payment', amount: 24000, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 38, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 105000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 75000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 12000, growth: 0 },
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 520000, growth: 3 } 
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 310000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 36000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 24000, type: 'Discretionary' }
        ]
      }
    },
    "2025": {
      status: "closed",
      plan: {
        age: 39, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 110000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 78000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 12000, growth: 0 },
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 520000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 310000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 38000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 26000, type: 'Discretionary' }
        ], 
        assetContributions: [
          { id: 401, name: 'Cash Savings', amount: 10000, linkedId: '102', frequency: 'Monthly' }
        ], 
        debtContributions: [{ id: 501, name: 'Mortgage Payment', amount: 24000, linkedId: '201', frequency: 'Monthly' }],
        projections: { projectedAssets: [], projectedDebts: [] }
      },
      actuals: {
        age: 39, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 110000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 78000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 22000, growth: 0 }, 
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 535600, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 298000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 38000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 26000, type: 'Discretionary' }
        ]
      }
    },
    "2026": {
      status: "open",
      plan: {
        age: 40, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 115000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 80000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 102, name: 'Joint Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 22000, growth: 0 },
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 535600, growth: 3 },
          { id: 104, name: '529 College Fund', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 0, growth: 7 },
          { id: 105, name: 'Fidelity Brokerage', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 0, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 298000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 302, name: 'Living Expenses', amount: 38000, type: 'Mandatory' },
          { id: 303, name: 'Other Expenses', amount: 20000, type: 'Discretionary' } 
        ], 
        assetContributions: [
          { id: 401, name: 'College Fund Monthly', amount: 6000, linkedId: '104', frequency: 'Monthly' },
          { id: 402, name: 'Wealth Builder Sweep', amount: 12000, linkedId: '105', frequency: 'Monthly' }
        ], 
        debtContributions: [
          { id: 501, name: 'Mortgage Payment', amount: 24000, linkedId: '201', frequency: 'Monthly' }
        ]
      },
      actuals: null
    }
  }
};

export const getDemoProfile = (profileName) => {
  return demoProfiles[profileName] || null;
};