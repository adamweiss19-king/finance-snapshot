export const demoProfiles = {
  singleNewHire: {
    "2024": {
      status: "closed",
      plan: {
        age: 24, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 65000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 1200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 0, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 28000, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 4800, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 3600, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3250, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Buffer Savings', amount: 2400, linkedId: '101', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }],
        projections: {
          projectedNetWorth: -19150,
          projectedAssets: [
            { id: 101, name: 'Chase Checking', projectedEOY: 3600 },
            { id: 102, name: 'Fidelity 401(k)', projectedEOY: 3250 }
          ],
          projectedDebts: [{ id: 201, name: 'Federal Student Loan', projectedEOY: 25940 }]
        }
      },
      actuals: {
        age: 24, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [
          { id: 1, name: 'Base Salary', gross: 65000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Surprise EOY Bonus', gross: 2500, type: 'Bonus', isTaxable: true } // WIN: Extra Income
        ],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 3450, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25940, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 4800, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 5100, type: 'Discretionary' } // MISS: Overspent by $1.5k
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
          { id: 301, name: 'Rent & Utilities', amount: 18600, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 5000, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 4000, type: 'Discretionary' }
        ],
        assetContributions: [{ id: 401, name: '401(k) Match', amount: 3350, linkedId: '102', frequency: 'Monthly' }],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }],
        projections: {
          projectedNetWorth: -13000,
          projectedAssets: [
            { id: 101, name: 'Chase Checking', projectedEOY: 4200 },
            { id: 102, name: 'Fidelity 401(k)', projectedEOY: 7041 } // 3450 + 3350 + 7% growth
          ],
          projectedDebts: [{ id: 201, name: 'Federal Student Loan', projectedEOY: 23766 }]
        }
      },
      actuals: {
        age: 25, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 67000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 9500, growth: 7 } // WIN: Massive market bull run beat projections!
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 23766, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18600, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 5000, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 3900, type: 'Discretionary' }
        ]
      }
    },
    "2026": {
      status: "open",
      plan: {
        age: 26, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Senior Role Salary', gross: 82000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 9500, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 23766, interestRate: 5.5, linkedAssetId: '' }],
        assetContributions: [], debtContributions: [], spendingData: []
      },
      actuals: null
    }
  },

  singleMidCareer: {
    "2024": {
      status: "closed",
      plan: {
        age: 32, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 115000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 4.5 }],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 12000, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [], assetContributions: [],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3000, linkedId: '201', frequency: 'Monthly' }],
        projections: {
          projectedNetWorth: 5000,
          projectedAssets: [{ id: 101, name: 'Savings', projectedEOY: 15675 }],
          projectedDebts: [{ id: 201, name: 'Honda Auto Loan', projectedEOY: 9720 }] // Planned to only pay down slightly
        }
      },
      actuals: {
        age: 32, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 115000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15675, growth: 4.5 }],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 0, interestRate: 6.0, linkedAssetId: '' }], // WIN: Paid off the car early!
        spendingData: []
      }
    },
    "2025": {
      status: "closed",
      plan: {
        age: 33, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 120000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15675, growth: 4.5 }],
        debtData: [],
        spendingData: [], assetContributions: [], debtContributions: [],
        projections: {
          projectedNetWorth: 16380,
          projectedAssets: [{ id: 101, name: 'Savings', projectedEOY: 16380 }],
          projectedDebts: []
        }
      },
      actuals: { // FLAT YEAR: Executed exactly to plan. Shows how the UI handles perfection.
        age: 33, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 120000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 16380, growth: 4.5 }],
        debtData: [], spendingData: []
      }
    },
    "2026": {
      status: "open",
      plan: {
        age: 34, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 125000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 101, name: 'Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 16380, growth: 4.5 }],
        debtData: [], assetContributions: [], debtContributions: [], spendingData: []
      },
      actuals: null
    }
  },

  familyMidCareer: {
    "2024": {
      status: "closed",
      plan: {
        age: 38, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 105000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 75000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 450000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [], assetContributions: [], debtContributions: [],
        projections: {
          projectedNetWorth: 143500,
          projectedAssets: [{ id: 103, name: 'Primary Residence', projectedEOY: 463500 }], // Standard 3% growth
          projectedDebts: [{ id: 201, name: 'Mortgage', balance: 320000 }]
        }
      },
      actuals: {
        age: 38, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 Salary', gross: 105000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 Salary', gross: 75000, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 520000, growth: 3 } // WIN: Massive Real Estate boom!
        ],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: []
      }
    },
    "2025": {
      status: "closed",
      plan: {
        age: 39, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [{ id: 1, name: 'Spouse 1 Salary', gross: 110000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 520000, growth: 3 }],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [], assetContributions: [], debtContributions: [],
        projections: {
          projectedNetWorth: 200000,
          projectedAssets: [{ id: 103, name: 'Primary Residence', projectedEOY: 535600 }],
          projectedDebts: [{ id: 201, name: 'Mortgage', projectedEOY: 320000 }]
        }
      },
      actuals: {
        age: 39, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [{ id: 1, name: 'Spouse 1 Salary', gross: 110000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 535600, growth: 3 }],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: []
      }
    },
    "2026": {
      status: "open",
      plan: {
        age: 40, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [{ id: 1, name: 'Spouse 1 Salary', gross: 115000, type: 'W-2 Salary', isTaxable: true }],
        assetData: [{ id: 103, name: 'Primary Residence', bucket: 'Real Estate', category: 'Primary Residence', balance: 535600, growth: 3 }],
        debtData: [{ id: 201, name: 'Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [], assetContributions: [], debtContributions: []
      },
      actuals: null
    }
  }
};

export const getDemoProfile = (profileName) => {
  return demoProfiles[profileName] || null;
};