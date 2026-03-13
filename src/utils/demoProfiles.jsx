export const demoProfiles = {
  singleNewHire: {
    age: 24,
    filingStatus: 'Single',
    incomeData: [{ id: 1, name: 'Base Salary', gross: 65000, taxRate: 20, type: 'W-2 Salary', isTaxable: true }],
    assetData: [
      { id: 101, name: 'Chase Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 3500, growth: 0 },
      { id: 102, name: 'Fidelity 401(k)', bucket: 'Retirement', category: '401k', balance: 1500, growth: 7 }
    ],
    debtData: [
      { id: 201, name: 'Federal Student Loan', balance: 28000, interestRate: 5.5, linkedAssetId: '' }
    ],
    spendingData: [
      { id: 301, name: 'Apartment Rent', category: 'Housing/Rent', amount: 18000, type: 'Mandatory' },
      { id: 302, name: 'Total Credit Card Spend', category: 'Card Expenses', amount: 4800, type: 'Discretionary' },
      { id: 303, name: 'Venmo/Debit Outflow', category: 'Check Expenses', amount: 3600, type: 'Discretionary' }
    ],
    assetContributions: [
      { id: 401, name: 'Hit 401(k) Match', amount: 3250, linkedId: '102', frequency: 'Monthly' },
      { id: 402, name: 'Build Emergency Fund', amount: 2400, linkedId: '101', frequency: 'Monthly' }
    ],
    debtContributions: [
      { id: 501, name: 'Student Loan Minimum', amount: 3600, linkedId: '201', frequency: 'Monthly' }
    ]
  },

  singleMidCareer: {
    age: 32,
    filingStatus: 'Single',
    incomeData: [
      { id: 1, name: 'Base Salary', gross: 115000, taxRate: 24, type: 'W-2 Salary', isTaxable: true },
      { id: 2, name: 'Annual Bonus', gross: 10000, taxRate: 22, type: 'Bonus', isTaxable: true }
    ],
    assetData: [
      { id: 101, name: 'Ally High Yield Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 15000, growth: 4 },
      { id: 102, name: 'Vanguard 401(k)', bucket: 'Retirement', category: '401k', balance: 65000, growth: 7 },
      { id: 103, name: 'Vanguard Roth IRA', bucket: 'Retirement', category: 'Roth IRA', balance: 22000, growth: 7 },
      { id: 104, name: 'Honda Civic', bucket: 'Physical Assets', category: 'Vehicle', balance: 18000, growth: -10 }
    ],
    debtData: [
      { id: 201, name: 'Honda Auto Loan', balance: 12000, interestRate: 6.0, linkedAssetId: '104' }
    ],
    spendingData: [
      { id: 301, name: 'Downtown Rent', category: 'Housing/Rent', amount: 24000, type: 'Mandatory' },
      { id: 302, name: 'Total Travel/Dining Card', category: 'Card Expenses', amount: 5000, type: 'Discretionary' }
    ],
    assetContributions: [
      { id: 401, name: 'Max Roth IRA', amount: 7000, linkedId: '103', frequency: 'Monthly' },
      { id: 402, name: 'Standard 401(k)', amount: 11500, linkedId: '102', frequency: 'Monthly' }
    ],
    debtContributions: [
      { id: 501, name: 'Aggressive Car Payoff', amount: 6000, linkedId: '201', frequency: 'Monthly' }
    ]
  },

  familyMidCareer: {
    age: 38,
    filingStatus: 'Married Filing Jointly',
    incomeData: [
      { id: 1, name: 'Spouse 1 Salary', gross: 105000, taxRate: 22, type: 'W-2 Salary', isTaxable: true },
      { id: 2, name: 'Spouse 2 Salary', gross: 75000, taxRate: 15, type: 'W-2 Salary', isTaxable: true }
    ],
    assetData: [
      { id: 101, name: 'Joint Emergency Fund', bucket: 'Cash', category: 'Bank Account/Savings', balance: 25000, growth: 4 },
      { id: 102, name: 'Combined 401(k)s', bucket: 'Retirement', category: '401k', balance: 180000, growth: 7 },
      { id: 103, name: 'Suburban House', bucket: 'Physical Assets', category: 'Primary Residence', balance: 450000, growth: 3 }
    ],
    debtData: [
      { id: 201, name: 'Primary Mortgage', balance: 320000, interestRate: 4.2, linkedAssetId: '103' }
    ],
    spendingData: [
      { id: 301, name: 'Property Tax & HOA', category: 'Housing/Rent', amount: 8000, type: 'Mandatory' },
      { id: 302, name: 'Joint Credit Card Bills', category: 'Card Expenses', amount: 12000, type: 'Mandatory' },
      { id: 303, name: 'Childcare (Checks)', category: 'Check Expenses', amount: 18000, type: 'Mandatory' }
    ],
    assetContributions: [
      { id: 401, name: 'Retirement Contributions', amount: 18000, linkedId: '102', frequency: 'Monthly' }
    ],
    debtContributions: [
      { id: 501, name: 'Standard Mortgage Pmt', amount: 24000, linkedId: '201', frequency: 'Monthly' }
    ]
  },

  complex: {
    age: 45,
    filingStatus: 'Married Filing Jointly',
    incomeData: [
      { id: 1, name: 'Executive Salary', gross: 250000, taxRate: 32, type: 'W-2 Salary', isTaxable: true },
      { id: 2, name: 'Rental Income', gross: 24000, taxRate: 0, type: 'Other', isTaxable: false }
    ],
    assetData: [
      { id: 101, name: 'Schwab Brokerage', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 350000, growth: 8 },
      { id: 102, name: 'Maxed 401(k)', bucket: 'Retirement', category: '401k', balance: 600000, growth: 7 },
      { id: 103, name: 'Primary Estate', bucket: 'Physical Assets', category: 'Primary Residence', balance: 850000, growth: 3 },
      { id: 104, name: 'Lake House (Rental)', bucket: 'Physical Assets', category: 'Real Estate (Rental)', balance: 400000, growth: 4 },
      { id: 105, name: 'Private Bank Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 125000, growth: 2 }
    ],
    debtData: [
      { id: 201, name: 'Primary Mortgage', balance: 450000, interestRate: 3.5, linkedAssetId: '103' },
      { id: 202, name: 'Lake House Mortgage', balance: 250000, interestRate: 5.0, linkedAssetId: '104' }
    ],
    spendingData: [
      { id: 301, name: 'Estate Taxes & Upkeep', category: 'Housing/Rent', amount: 22000, type: 'Mandatory' },
      { id: 302, name: 'Amex Centurion Bills', category: 'Card Expenses', amount: 45000, type: 'Discretionary' },
      { id: 303, name: 'Private School Tuition', category: 'Check Expenses', amount: 35000, type: 'Mandatory' },
      { id: 304, name: 'Charitable/Misc Cash', category: 'Other', amount: 10000, type: 'Discretionary' }
    ],
    assetContributions: [
      { id: 401, name: 'Max 401(k)', amount: 23000, linkedId: '102', frequency: 'Monthly' },
      { id: 402, name: 'Heavy Brokerage Inv.', amount: 48000, linkedId: '101', frequency: 'Quarterly' }
    ],
    debtContributions: [
      { id: 501, name: 'Primary Mortgage Pmt', amount: 36000, linkedId: '201', frequency: 'Monthly' },
      { id: 502, name: 'Lake House Pmt', amount: 20000, linkedId: '202', frequency: 'Monthly' }
    ]
  } 
};

export const getDemoProfile = (profileName) => {
  return demoProfiles[profileName] || null;
};