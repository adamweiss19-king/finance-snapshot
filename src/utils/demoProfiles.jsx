export const demoProfiles = {
  singleNewHire: {
    "2023": {
      status: "closed",
      plan: {
        age: 24, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 65000, taxRate: 20, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 1200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 0, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 28000, interestRate: 5.5, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 4800, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 3600, type: 'Discretionary' },
          { id: 304, name: 'Subscriptions', amount: 1200, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3250, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Buffer Savings', amount: 2400, linkedId: '101', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 24, filingStatus: 'Single', stateTaxLevel: 'Medium',
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 3450, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25200, interestRate: 5.5, linkedAssetId: '' }],
        incomeData: [
          { id: 1, name: 'Base Salary', gross: 65000, taxRate: 20, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Annual Bonus', gross: 2500, taxRate: 30, type: 'Bonus', isTaxable: true }
        ],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18000, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 5100, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 4800, type: 'Discretionary' }, 
          { id: 304, name: 'Subscriptions', amount: 1200, type: 'Discretionary' }
        ],
        assetContributions: [], debtContributions: []
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 25, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Base Salary', gross: 67000, taxRate: 20, type: 'W-2 Salary', isTaxable: true }],
        // CARRYOVER FROM 2023 ACTUALS
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4200, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 3450, growth: 7 },
          { id: 103, name: 'Marcus HYSA', bucket: 'Cash', category: 'Bank Account/Savings', balance: 0, growth: 4.5 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 25200, interestRate: 5.5, linkedAssetId: '' }],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 3350, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Emergency Fund', amount: 4000, linkedId: '103', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' }],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18600, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 5000, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 4000, type: 'Discretionary' },
          { id: 304, name: 'Subscriptions', amount: 1200, type: 'Discretionary' }
        ]
      },
      actuals: {
        age: 25, filingStatus: 'Single', stateTaxLevel: 'Medium',
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4800, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 7600, growth: 7 },
          { id: 103, name: 'Marcus HYSA', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4100, growth: 4.5 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 22800, interestRate: 5.5, linkedAssetId: '' }],
        incomeData: [{ id: 1, name: 'Base Salary', gross: 67000, taxRate: 20, type: 'W-2 Salary', isTaxable: true }],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 18600, type: 'Mandatory' }, 
          { id: 302, name: 'Groceries', amount: 5200, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 4500, type: 'Discretionary' },
          { id: 304, name: 'Subscriptions', amount: 1200, type: 'Discretionary' }
        ],
        assetContributions: [], debtContributions: []
      }
    },
    "2025": {
      status: "open",
      plan: {
        age: 26, filingStatus: 'Single', stateTaxLevel: 'Medium',
        incomeData: [{ id: 1, name: 'Senior Role Salary', gross: 82000, taxRate: 22, type: 'W-2 Salary', isTaxable: true }],
        // CARRYOVER FROM 2024 ACTUALS
        assetData: [
          { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4800, growth: 0 },
          { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 7600, growth: 7 },
          { id: 103, name: 'Marcus HYSA', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4100, growth: 4.5 },
          { id: 104, name: 'Vanguard Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 0, growth: 8 }
        ],
        debtData: [{ id: 201, name: 'Federal Student Loan', balance: 22800, interestRate: 5.5, linkedAssetId: '' }],
        assetContributions: [
          { id: 401, name: '401(k) Match', amount: 4100, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Emergency Fund', amount: 2000, linkedId: '103', frequency: 'Monthly' },
          { id: 403, name: 'Max Roth IRA', amount: 7000, linkedId: '104', frequency: 'Monthly' }
        ],
        debtContributions: [
          { id: 501, name: 'Minimum Payment', amount: 3600, linkedId: '201', frequency: 'Monthly' },
          { id: 502, name: 'Extra Principal Pmt', amount: 2400, linkedId: '201', frequency: 'Monthly' }
        ],
        spendingData: [
          { id: 301, name: 'Rent & Utilities', amount: 19200, type: 'Mandatory' },
          { id: 302, name: 'Groceries', amount: 5500, type: 'Mandatory' },
          { id: 303, name: 'Dining & Entertainment', amount: 6000, type: 'Discretionary' },
          { id: 304, name: 'Subscriptions', amount: 1500, type: 'Discretionary' },
          { id: 305, name: 'Travel & Vacations', amount: 3500, type: 'Discretionary' }
        ]
      },
      actuals: null
    }
  },

 singleMidCareer: {
    "2023": {
      status: "closed",
      plan: {
        age: 32, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 115000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        assetData: [
          { id: 101, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 4.5 },
          { id: 102, name: 'Vanguard 401(k)', bucket: 'Retirement', category: '401k', balance: 65000, growth: 7 },
          { id: 103, name: 'Fidelity Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 22000, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 12000, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: '1BR Apartment Rent', amount: 24000, type: 'Mandatory' },
          { id: 302, name: 'Groceries & Household', amount: 6000, type: 'Mandatory' },
          { id: 303, name: 'Car Insurance & Gas', amount: 2400, type: 'Mandatory' },
          { id: 304, name: 'Dining, Bars & Coffee', amount: 5000, type: 'Discretionary' },
          { id: 305, name: 'Travel & Flights', amount: 4000, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: 'Max Roth IRA', amount: 6500, linkedId: '103', frequency: 'Monthly' },
          { id: 402, name: '10% 401(k) Contribution', amount: 11500, linkedId: '102', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Aggressive Payoff', amount: 6000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 32, filingStatus: 'Single', stateTaxLevel: 'High',
        assetData: [
          { id: 101, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 16000, growth: 4.5 },
          { id: 102, name: 'Vanguard 401(k)', bucket: 'Retirement', category: '401k', balance: 81000, growth: 7 }, // 65k + 11.5k + ~4.5k growth
          { id: 103, name: 'Fidelity Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 30000, growth: 7 }  // 22k + 6.5k + ~1.5k growth
        ],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 6500, interestRate: 6.0, linkedAssetId: '' }], // 12k - 6k pmt + interest
        incomeData: [
          { id: 1, name: 'Director Salary', gross: 115000, taxRate: 24, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Project Bonus', gross: 3000, taxRate: 35, type: 'Bonus', isTaxable: true }
        ],
        spendingData: [
          { id: 301, name: '1BR Apartment Rent', amount: 24000, type: 'Mandatory' },
          { id: 302, name: 'Groceries & Household', amount: 6200, type: 'Mandatory' },
          { id: 303, name: 'Car Insurance & Gas', amount: 2400, type: 'Mandatory' },
          { id: 304, name: 'Dining, Bars & Coffee', amount: 5500, type: 'Discretionary' },
          { id: 305, name: 'Travel & Flights', amount: 4800, type: 'Discretionary' }
        ],
        assetContributions: [], debtContributions: []
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 33, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 120000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        // CARRYOVER FROM 2023 ACTUALS
        assetData: [
          { id: 101, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 16000, growth: 4.5 },
          { id: 102, name: 'Vanguard 401(k)', bucket: 'Retirement', category: '401k', balance: 81000, growth: 7 },
          { id: 103, name: 'Fidelity Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 30000, growth: 7 }
        ],
        debtData: [{ id: 201, name: 'Honda Auto Loan', balance: 6500, interestRate: 6.0, linkedAssetId: '' }],
        spendingData: [
          { id: 301, name: '1BR Apartment Rent', amount: 24600, type: 'Mandatory' }, // Rent Increase
          { id: 302, name: 'Groceries & Household', amount: 6500, type: 'Mandatory' },
          { id: 303, name: 'Car Insurance & Gas', amount: 2400, type: 'Mandatory' },
          { id: 304, name: 'Dining, Bars & Coffee', amount: 5500, type: 'Discretionary' },
          { id: 305, name: 'Travel & Flights', amount: 4500, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: 'Max Roth IRA', amount: 7000, linkedId: '103', frequency: 'Monthly' },
          { id: 402, name: '10% 401(k) Contribution', amount: 12000, linkedId: '102', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Final Auto Payoff', amount: 6500, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 33, filingStatus: 'Single', stateTaxLevel: 'High',
        assetData: [
          { id: 101, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 18000, growth: 4.5 },
          { id: 102, name: 'Vanguard 401(k)', bucket: 'Retirement', category: '401k', balance: 98500, growth: 7 }, // 81k + 12k + ~5.5k growth
          { id: 103, name: 'Fidelity Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 39000, growth: 7 } // 30k + 7k + ~2k growth
        ],
        debtData: [], // Debt Paid Off!
        incomeData: [{ id: 1, name: 'Director Salary', gross: 120000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        spendingData: [
          { id: 301, name: '1BR Apartment Rent', amount: 24600, type: 'Mandatory' },
          { id: 302, name: 'Groceries & Household', amount: 6500, type: 'Mandatory' },
          { id: 303, name: 'Car Insurance & Gas', amount: 2400, type: 'Mandatory' },
          { id: 304, name: 'Dining, Bars & Coffee', amount: 6000, type: 'Discretionary' },
          { id: 305, name: 'Travel & Flights', amount: 5000, type: 'Discretionary' }
        ],
        assetContributions: [], debtContributions: []
      }
    },
    "2025": {
      status: "open",
      plan: {
        age: 34, filingStatus: 'Single', stateTaxLevel: 'High',
        incomeData: [{ id: 1, name: 'Director Salary', gross: 125000, taxRate: 24, type: 'W-2 Salary', isTaxable: true }],
        // CARRYOVER FROM 2024 ACTUALS
        assetData: [
          { id: 101, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 18000, growth: 4.5 },
          { id: 102, name: 'Vanguard 401(k)', bucket: 'Retirement', category: '401k', balance: 98500, growth: 7 },
          { id: 103, name: 'Fidelity Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 39000, growth: 7 },
          // Free cash flow now that car is paid off, starting a house fund
          { id: 104, name: 'House Downpayment Fund', bucket: 'Cash', category: 'Bank Account/Savings', balance: 0, growth: 4.5 } 
        ],
        debtData: [],
        spendingData: [
          { id: 301, name: '1BR Apartment Rent', amount: 25200, type: 'Mandatory' },
          { id: 302, name: 'Groceries & Household', amount: 6800, type: 'Mandatory' },
          { id: 303, name: 'Car Insurance & Gas', amount: 2400, type: 'Mandatory' },
          { id: 304, name: 'Dining, Bars & Coffee', amount: 6000, type: 'Discretionary' },
          { id: 305, name: 'Travel & Flights', amount: 6000, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: '10% 401(k) Contribution', amount: 12500, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: 'Max Roth IRA', amount: 7000, linkedId: '103', frequency: 'Monthly' },
          { id: 403, name: 'House Savings', amount: 15000, linkedId: '104', frequency: 'Monthly' }
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
        age: 38, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 (Engineering)', gross: 105000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 (Nursing)', gross: 75000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        assetData: [
          { id: 101, name: 'Capital One Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 25000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 180000, growth: 7 },
          { id: 103, name: 'Suburban Primary Residence', bucket: 'Physical Assets', category: 'Primary Residence', balance: 450000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Wells Fargo Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 301, name: 'Groceries & Costco', amount: 12000, type: 'Mandatory' },
          { id: 302, name: 'Childcare / Daycare', amount: 15000, type: 'Mandatory' },
          { id: 303, name: 'Property Taxes & Utilities', amount: 11000, type: 'Mandatory' },
          { id: 304, name: 'Auto (Gas, Ins, Maintenance)', amount: 6000, type: 'Mandatory' },
          { id: 305, name: 'Family Vacations', amount: 5000, type: 'Discretionary' },
          { id: 306, name: 'Dining & Entertainment', amount: 6000, type: 'Discretionary' }
        ],
        assetContributions: [{ id: 401, name: 'Joint Retirement Funding', amount: 18000, linkedId: '102', frequency: 'Monthly' }],
        debtContributions: [{ id: 501, name: 'Monthly Mortgage P&I', amount: 24000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 38, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        assetData: [
          { id: 101, name: 'Capital One Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 28000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 210000, growth: 7 }, // 180k + 18k + ~12k growth
          { id: 103, name: 'Suburban Primary Residence', bucket: 'Physical Assets', category: 'Primary Residence', balance: 463000, growth: 3 } // 3% appreciation
        ],
        debtData: [{ id: 201, name: 'Wells Fargo Mortgage', balance: 309000, interestRate: 4.2, linkedAssetId: '103' }], // 320k - 24k + ~13k interest
        incomeData: [
          { id: 1, name: 'Spouse 1 (Engineering)', gross: 105000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 (Nursing)', gross: 75000, taxRate: 15, type: 'W-2 Salary', isTaxable: true },
          { id: 3, name: 'Nursing Overtime Shifts', gross: 5000, taxRate: 22, type: 'Bonus', isTaxable: true }
        ],
        spendingData: [
          { id: 301, name: 'Groceries & Costco', amount: 13000, type: 'Mandatory' },
          { id: 302, name: 'Childcare / Daycare', amount: 15000, type: 'Mandatory' },
          { id: 303, name: 'Property Taxes & Utilities', amount: 11500, type: 'Mandatory' },
          { id: 304, name: 'Auto (Gas, Ins, Maintenance)', amount: 6000, type: 'Mandatory' },
          { id: 305, name: 'Family Vacations', amount: 5500, type: 'Discretionary' },
          { id: 306, name: 'Dining & Entertainment', amount: 6500, type: 'Discretionary' }
        ],
        assetContributions: [], debtContributions: []
      }
    },
    "2024": {
      status: "closed",
      plan: {
        age: 39, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 (Engineering)', gross: 110000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 (Nursing)', gross: 80000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        // CARRYOVER FROM 2023 ACTUALS
        assetData: [
          { id: 101, name: 'Capital One Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 28000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 210000, growth: 7 },
          { id: 103, name: 'Suburban Primary Residence', bucket: 'Physical Assets', category: 'Primary Residence', balance: 463000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Wells Fargo Mortgage', balance: 309000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 301, name: 'Groceries & Costco', amount: 13500, type: 'Mandatory' },
          { id: 302, name: 'Childcare / Daycare', amount: 16000, type: 'Mandatory' },
          { id: 303, name: 'Property Taxes & Utilities', amount: 12000, type: 'Mandatory' },
          { id: 304, name: 'Auto (Gas, Ins, Maintenance)', amount: 6500, type: 'Mandatory' },
          { id: 305, name: 'Family Vacations', amount: 6000, type: 'Discretionary' },
          { id: 306, name: 'Dining & Entertainment', amount: 7000, type: 'Discretionary' }
        ],
        assetContributions: [{ id: 401, name: 'Joint Retirement Funding', amount: 20000, linkedId: '102', frequency: 'Monthly' }],
        debtContributions: [{ id: 501, name: 'Monthly Mortgage P&I', amount: 24000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: {
        age: 39, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        assetData: [
          { id: 101, name: 'Capital One Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 30000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 244000, growth: 7 }, // 210k + 20k + ~14k growth
          { id: 103, name: 'Suburban Primary Residence', bucket: 'Physical Assets', category: 'Primary Residence', balance: 476000, growth: 3 }
        ],
        debtData: [{ id: 201, name: 'Wells Fargo Mortgage', balance: 297000, interestRate: 4.2, linkedAssetId: '103' }], // 309k - 24k + ~12k interest
        incomeData: [
          { id: 1, name: 'Spouse 1 (Engineering)', gross: 110000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 (Nursing)', gross: 80000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        spendingData: [
          { id: 301, name: 'Groceries & Costco', amount: 13500, type: 'Mandatory' },
          { id: 302, name: 'Childcare / Daycare', amount: 16000, type: 'Mandatory' },
          { id: 303, name: 'Property Taxes & Utilities', amount: 12000, type: 'Mandatory' },
          { id: 304, name: 'Auto (Gas, Ins, Maintenance)', amount: 6500, type: 'Mandatory' },
          { id: 305, name: 'Family Vacations', amount: 6000, type: 'Discretionary' },
          { id: 306, name: 'Dining & Entertainment', amount: 7000, type: 'Discretionary' }
        ],
        assetContributions: [], debtContributions: []
      }
    },
    "2025": {
      status: "open",
      plan: {
        age: 40, filingStatus: 'Married Filing Jointly', stateTaxLevel: 'Low',
        incomeData: [
          { id: 1, name: 'Spouse 1 (Engineering)', gross: 115000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Spouse 2 (Nursing)', gross: 85000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
        ],
        // CARRYOVER FROM 2024 ACTUALS
        assetData: [
          { id: 101, name: 'Capital One Joint Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 30000, growth: 4 },
          { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 244000, growth: 7 },
          { id: 103, name: 'Suburban Primary Residence', bucket: 'Physical Assets', category: 'Primary Residence', balance: 476000, growth: 3 },
          // Opening a College fund!
          { id: 104, name: '529 College Fund', bucket: 'Investment (Non-Retirement)', category: 'Other', balance: 0, growth: 6 } 
        ],
        debtData: [{ id: 201, name: 'Wells Fargo Mortgage', balance: 297000, interestRate: 4.2, linkedAssetId: '103' }],
        spendingData: [
          { id: 301, name: 'Groceries & Costco', amount: 14000, type: 'Mandatory' },
          { id: 302, name: 'Childcare / Daycare', amount: 16500, type: 'Mandatory' },
          { id: 303, name: 'Property Taxes & Utilities', amount: 12500, type: 'Mandatory' },
          { id: 304, name: 'Auto (Gas, Ins, Maintenance)', amount: 6500, type: 'Mandatory' },
          { id: 305, name: 'Family Vacations', amount: 7000, type: 'Discretionary' },
          { id: 306, name: 'Dining & Entertainment', amount: 7500, type: 'Discretionary' }
        ],
        assetContributions: [
          { id: 401, name: 'Joint Retirement Funding', amount: 22000, linkedId: '102', frequency: 'Monthly' },
          { id: 402, name: '529 Contributions', amount: 5000, linkedId: '104', frequency: 'Monthly' }
        ],
        debtContributions: [{ id: 501, name: 'Monthly Mortgage P&I', amount: 24000, linkedId: '201', frequency: 'Monthly' }]
      },
      actuals: null
    }
  },
  
  complexEdgeCase: {
    "2024": {
      status: "open",
      plan: {
        age: 56, filingStatus: 'Head of Household', stateTaxLevel: 'High',
        incomeData: [
          { id: 1, name: 'Day Job', gross: 95000, type: 'W-2 Salary', isTaxable: true },
          { id: 2, name: 'Consulting', gross: 45000, type: 'Self-Employed', isTaxable: true },
          { id: 3, name: 'Rental Income', gross: 18000, type: 'Other', isTaxable: true },
          { id: 4, name: 'Municipal Bonds', gross: 4000, type: 'Other', isTaxable: false }
        ],
        assetData: [
          { id: 101, name: 'Checking (Almost Empty)', bucket: 'Cash', category: 'Bank Account/Savings', balance: 150, growth: 0 },
          { id: 102, name: 'Mega 401(k)', bucket: 'Retirement', category: '401k', balance: 850000, growth: 8.5 },
          { id: 103, name: 'HSA', bucket: 'Investment (Non-Retirement)', category: 'HSA', balance: 12000, growth: 5 },
          { id: 104, name: 'Crypto Wallet', bucket: 'Investment (Non-Retirement)', category: 'Other Asset', balance: 0, growth: 150 },
          { id: 105, name: 'Rental Property', bucket: 'Real Estate', category: 'Real Estate', balance: 350000, growth: 4 }
        ],
        debtData: [
          { id: 201, name: 'Rental Mortgage', balance: 210000, interestRate: 5.5, linkedAssetId: '105' },
          { id: 202, name: 'Credit Card Debt', balance: 3000, interestRate: 24.99, linkedAssetId: '' }, // High interest
          { id: 203, name: '0% Promo Furniture', balance: 8000, interestRate: 0, linkedAssetId: '' } // Zero interest
        ],
        assetContributions: [
          { id: 401, name: 'Max 401k + Catchup', amount: 35000, linkedId: '102' }, // Deliberately over limit to test warning
          { id: 402, name: 'HSA Max', amount: 5150, linkedId: '103' }, // Testing 55+ HSA math
          { id: 403, name: 'YOLO Crypto', amount: 500, linkedId: '104' }
        ],
        debtContributions: [
          { id: 501, name: 'Mortgage Pmt', amount: 15000, linkedId: '201' },
          { id: 502, name: 'Wipe out CC', amount: 5000, linkedId: '202' } // Paying MORE than the balance to test math bounds
        ],
        spendingData: [
          { id: 301, name: 'Bare Minimum Life', category: 'Housing/Rent', amount: 36000, type: 'Mandatory' },
          { id: 302, name: 'Wild Vacations', category: 'Travel', amount: 25000, type: 'Discretionary' }
        ]
      },
      actuals: null
    }
  }
};

export const getDemoProfile = (profileName) => {
  return demoProfiles[profileName] || null;
};