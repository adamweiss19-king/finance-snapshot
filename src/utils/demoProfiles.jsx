export const demoProfiles = {
  singleNewHire: {
    "2023": {
      status: "closed",
      plan: {
        age: 24, filingStatus: 'Single',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 65000, taxRate: 20, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 3500, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 1500, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 28000, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Apartment Rent', category: 'Housing/Rent', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Standard Spend', category: 'Card Expenses', amount: 8400, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3250, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Emergency Fund', amount: 2400, linkedId: '101', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Min. Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 24, filingStatus: 'Single',
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 6000, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 5100, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25500, interestRate: 5.5, linkedAssetId: '' }],
        incomeData: [{ id: 1, name: 'Base Salary', gross: 65000, taxRate: 20, type: 'W-2 Salary', isTaxable: true }],
        spendingData: [{ id: 301, name: 'Apartment Rent', category: 'Housing/Rent', amount: 18000, type: 'Mandatory' }],
        assetContributions: [], debtContributions: []
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 25, filingStatus: 'Single',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 70000, taxRate: 21, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 6000, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 5100, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25500, interestRate: 5.5, linkedAssetId: '' }],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3500, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Savings', amount: 3000, linkedId: '101', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Aggressive Paydown', amount: 4800, linkedId: '201', frequency: 'Monthly' }],
        spendingData: [{ id: 301, name: 'Apartment Rent', category: 'Housing/Rent', amount: 18600, type: 'Mandatory' }]
      },
      actuals: {
        age: 25, filingStatus: 'Single',
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 9000, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 9200, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 21500, interestRate: 5.5, linkedAssetId: '' }],
        incomeData: [{ id: 1, name: 'Base Salary', gross: 70000, taxRate: 21, type: 'W-2 Salary', isTaxable: true }],
        spendingData: [{ id: 301, name: 'Apartment Rent', category: 'Housing/Rent', amount: 18600, type: 'Mandatory' }],
        assetContributions: [], debtContributions: []
      }
    },
    "2025": {
      status: "open",
      plan: {
        age: 26, filingStatus: 'Single',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 75000, taxRate: 22, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 9000, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 9200, growth: 7 },
          { id: 103, name: 'New Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 0, growth: 7, isNew: true }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 21500, interestRate: 5.5, linkedAssetId: '' }],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3750, linkedId: '102', frequency: 'Monthly' },
          { id: 403, name: 'Roth Funding', amount: 7000, linkedId: '103', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Standard Payment', amount: 4800, linkedId: '201', frequency: 'Monthly' }],
        spendingData: [{ id: 301, name: 'Apartment Rent', category: 'Housing/Rent', amount: 19200, type: 'Mandatory' }]
      },
      actuals: null
    }
  },

  singleMidCareer: {
    "2023": {
      status: "closed",
      plan: {
        age: 32, filingStatus: 'Single',
        incomeData: [{ id: 1, name: 'Salary', gross: 115000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Ally Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 4 },
          { id: 102, name: 'Vanguard 401k', bucket: 'Retirement', category: '401k', balance: 65000, growth: 7 },
          { id: 103, name: 'Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 22000, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Auto Loan', balance: 12000, interestRate: 6.0, linkedAssetId: '' }],
        assetContributions: [
          { id: 401, name: 'Roth Max', amount: 6500, linkedId: '103', frequency: 'Monthly' },
          { id: 402, name: '401k Match', amount: 11500, linkedId: '102', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Aggressive Payoff', amount: 6000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 32, filingStatus: 'Single',
        assetData: [
          { id: 101, name: 'Ally Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15600, growth: 4 },
          { id: 102, name: 'Vanguard 401k', bucket: 'Retirement', category: '401k', balance: 81500, growth: 7 },
          { id: 103, name: 'Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 30500, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Auto Loan', balance: 6360, interestRate: 6.0, linkedAssetId: '' }],
        incomeData: [{ id: 1, name: 'Salary', gross: 115000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }]
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 33, filingStatus: 'Single',
        incomeData: [{ id: 1, name: 'Salary', gross: 120000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Ally Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15600, growth: 4 },
          { id: 102, name: 'Vanguard 401k', bucket: 'Retirement', category: '401k', balance: 81500, growth: 7 },
          { id: 103, name: 'Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 30500, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Auto Loan', balance: 6360, interestRate: 6.0, linkedAssetId: '' }],
        assetContributions: [
          { id: 401, name: 'Roth Max', amount: 7000, linkedId: '103', frequency: 'Monthly' },
          { id: 402, name: '401k Match', amount: 12000, linkedId: '102', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Final Payoff', amount: 6500, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 33, filingStatus: 'Single',
        assetData: [
          { id: 101, name: 'Ally Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 16200, growth: 4 },
          { id: 102, name: 'Vanguard 401k', bucket: 'Retirement', category: '401k', balance: 100500, growth: 7 },
          { id: 103, name: 'Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 40200, growth: 7 }
        ],
        debtData: [],
        incomeData: [{ id: 1, name: 'Salary', gross: 120000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }]
      }
    },
    "2025": {
      status: "open",
      plan: {
        age: 34, filingStatus: 'Single',
        incomeData: [{ id: 1, name: 'Salary', gross: 125000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Ally Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 16200, growth: 4 },
          { id: 102, name: 'Vanguard 401k', bucket: 'Retirement', category: '401k', balance: 100500, growth: 7 },
          { id: 103, name: 'Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 40200, growth: 7 },
          { id: 104, name: 'House Downpayment Fund', bucket: 'Cash', category: 'Bank Account/Savings', balance: 0, growth: 4, isNew: true }
        ],
        debtData: [],
        assetContributions: [
          { id: 401, name: 'Roth Max', amount: 7000, linkedId: '103', frequency: 'Monthly' },
          { id: 402, name: 'Save for House', amount: 12000, linkedId: '104', frequency: 'Monthly' }
        ]
      },
      actuals: null
    }
  },

  familyMidCareer: {
    "2023": {
      status: "closed",
      plan: {
        age: 38, filingStatus: 'Married Filing Jointly',
        incomeData: [
          { id: 1, name: 'Spouse 1', gross: 105000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2', gross: 75000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 101, name: 'Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 25000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 180000, growth: 7 },
          { id: 103, name: 'Suburban House', bucket: 'Physical Assets', category: 'Primary Residence', balance: 450000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Primary Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        assetContributions: [{ id: 401, name: 'Family Retirement', amount: 18000, linkedId: '102', frequency: 'Monthly' }],
        debtContributions: [{ id: 501, name: 'Mortgage Pmt', amount: 24000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 38, filingStatus: 'Married Filing Jointly',
        assetData: [
          { id: 101, name: 'Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 26000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 210600, growth: 7 },
          { id: 103, name: 'Suburban House', bucket: 'Physical Assets', category: 'Primary Residence', balance: 463500, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Primary Mortgage', balance: 308000, interestRate: 4.2, linkedAssetId: '103' }],
        incomeData: [
          { id: 1, name: 'Spouse 1', gross: 105000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2', gross: 75000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ]
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 39, filingStatus: 'Married Filing Jointly',
        incomeData: [
          { id: 1, name: 'Spouse 1', gross: 110000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2', gross: 80000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 101, name: 'Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 26000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 210600, growth: 7 },
          { id: 103, name: 'Suburban House', bucket: 'Physical Assets', category: 'Primary Residence', balance: 463500, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Primary Mortgage', balance: 308000, interestRate: 4.2, linkedAssetId: '103' }],
        assetContributions: [{ id: 401, name: 'Family Retirement', amount: 20000, linkedId: '102', frequency: 'Monthly' }],
        debtContributions: [{ id: 501, name: 'Mortgage Pmt', amount: 24000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 39, filingStatus: 'Married Filing Jointly',
        assetData: [
          { id: 101, name: 'Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 27000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 245300, growth: 7 },
          { id: 103, name: 'Suburban House', bucket: 'Physical Assets', category: 'Primary Residence', balance: 477400, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Primary Mortgage', balance: 295500, interestRate: 4.2, linkedAssetId: '103' }],
        incomeData: [
          { id: 1, name: 'Spouse 1', gross: 110000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2', gross: 80000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ]
      }
    },
    "2025": {
      status: "open",
      plan: {
        age: 40, filingStatus: 'Married Filing Jointly',
        incomeData: [
          { id: 1, name: 'Spouse 1', gross: 115000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2', gross: 85000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 101, name: 'Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 27000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 245300, growth: 7 },
          { id: 103, name: 'Suburban House', bucket: 'Physical Assets', category: 'Primary Residence', balance: 477400, growth: 3 },
          { id: 104, name: '529 College Fund', bucket: 'Investment (Non-Retirement)', category: 'Other', balance: 0, growth: 6, isNew: true }
        ],
        debtData: [{ id: 201, name: 'Primary Mortgage', balance: 295500, interestRate: 4.2, linkedAssetId: '103' }],
        assetContributions: [
          { id: 401, name: 'Family Retirement', amount: 22000, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Kids College', amount: 5000, linkedId: '104', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Mortgage Pmt', amount: 24000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: null
    }
  }
};

export const getDemoProfile = (profileName) => {
  return demoProfiles[profileName] || null;
};