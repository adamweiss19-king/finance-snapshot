export const getDemoProfile = (scenario) => {
  if (scenario === 'newHire') {
    return {
      income: [
        { id: 1, name: 'Entry Level Salary', gross: 70000, taxRate: 22, type: 'W-2 Salary', isTaxable: true }
      ],
      assets: [
        { id: 101, name: 'Ally Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 4000, growth: 0 },
        { id: 102, name: 'Company 401k', bucket: 'Retirement', category: '401k', balance: 8000, growth: 7 }
      ],
      debts: [
        { id: 201, name: 'Student Loans', balance: 28000, interestRate: 6 },
        { id: 202, name: 'Used Car Loan', balance: 12000, interestRate: 7 }
      ],
      spending: [
        { id: 301, name: 'Rent & Utilities', category: 'Housing', amount: 18000, type: 'Required' },
        { id: 302, name: 'Groceries & Gas', category: 'Food', amount: 6000, type: 'Required' },
        { id: 303, name: 'Going out & Hobbies', category: 'Lifestyle & Fun', amount: 4500, type: 'Discretionary' }
      ],
      contributions: [
        { id: 401, name: 'Get Employer Match', amount: 3500, type: 'Required', linkedId: '102', frequency: 'Monthly' },
        { id: 402, name: 'Build Emergency Fund', amount: 2000, type: 'Discretionary', linkedId: '101', frequency: 'Monthly' }
      ],
      debtAllocations: [
        { id: 501, name: 'Student Loan Min', amount: 3600, type: 'Required', linkedId: '201', frequency: 'Monthly' },
        { id: 502, name: 'Car Loan Min', amount: 2400, type: 'Required', linkedId: '202', frequency: 'Monthly' },
        { id: 503, name: 'Extra to Car', amount: 1200, type: 'Discretionary', linkedId: '202', frequency: 'Monthly' }
      ]
    };
  } 
  
  if (scenario === 'midCareer') {
    return {
      income: [
        { id: 1, name: 'Senior Salary', gross: 135000, taxRate: 28, type: 'W-2 Salary', isTaxable: true },
        { id: 2, name: 'Annual Bonus', gross: 15000, taxRate: 35, type: 'Bonus', isTaxable: true }
      ],
      assets: [
        { id: 101, name: 'Chase Checking/Savings', bucket: 'Cash', category: 'Bank Account/Savings', balance: 25000, growth: 0 },
        { id: 102, name: 'Fidelity 401k', bucket: 'Retirement', category: '401k', balance: 160000, growth: 7 },
        { id: 103, name: 'Vanguard Brokerage', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 45000, growth: 7 },
        { id: 104, name: 'Ethereum Wallet', bucket: 'Investment (Non-Retirement)', category: 'Crypto', balance: 8000, growth: 12 }
      ],
      debts: [
        { id: 201, name: 'Condo Mortgage', balance: 280000, interestRate: 4.5 }
      ],
      spending: [
        { id: 301, name: 'Mortgage & HOA', category: 'Housing', amount: 26000, type: 'Required' },
        { id: 302, name: 'Groceries & Dining', category: 'Food', amount: 10000, type: 'Required' },
        { id: 303, name: 'Travel & Hobbies', category: 'Lifestyle & Fun', amount: 12000, type: 'Discretionary' }
      ],
      contributions: [
        { id: 401, name: 'Max 401k', amount: 23000, type: 'Required', linkedId: '102', frequency: 'Monthly' },
        { id: 402, name: 'Index Funds', amount: 8000, type: 'Discretionary', linkedId: '103', frequency: 'Quarterly' },
        { id: 403, name: 'Crypto DCA', amount: 1200, type: 'Discretionary', linkedId: '104', frequency: 'Monthly' }
      ],
      debtAllocations: [
        { id: 501, name: 'Mortgage Min', amount: 18000, type: 'Required', linkedId: '201', frequency: 'Monthly' }
      ]
    };
  } 
  
  if (scenario === 'family') {
    return {
      income: [
        { id: 1, name: 'Partner 1 Salary', gross: 140000, taxRate: 24, type: 'W-2 Salary', isTaxable: true },
        { id: 2, name: 'Partner 2 Salary', gross: 95000, taxRate: 24, type: 'W-2 Salary', isTaxable: true },
        { id: 3, name: 'Child Tax Credit', gross: 4000, taxRate: 0, type: 'Other', isTaxable: false }
      ],
      assets: [
        { id: 101, name: 'Joint High Yield', bucket: 'Cash', category: 'Bank Account/Savings', balance: 45000, growth: 4 },
        { id: 102, name: 'Partner 1 401k', bucket: 'Retirement', category: '401k', balance: 210000, growth: 7 },
        { id: 103, name: 'Partner 2 401k', bucket: 'Retirement', category: '401k', balance: 140000, growth: 7 },
        { id: 104, name: 'Family HSA', bucket: 'Investment (Non-Retirement)', category: 'HSA', balance: 12000, growth: 5 },
        { id: 105, name: 'Kids 529 Plan', bucket: 'Investment (Non-Retirement)', category: 'Other', balance: 25000, growth: 6 }
      ],
      debts: [
        { id: 201, name: 'Suburbs Mortgage', balance: 420000, interestRate: 3.2 },
        { id: 202, name: 'Minivan Loan', balance: 28000, interestRate: 5.5 }
      ],
      spending: [
        { id: 301, name: 'Mortgage/Insurance', category: 'Housing', amount: 32000, type: 'Required' },
        { id: 302, name: 'Daycare/School', category: 'Family', amount: 24000, type: 'Required' },
        { id: 303, name: 'Groceries/Target', category: 'Food', amount: 16000, type: 'Required' },
        { id: 304, name: 'Family Vacations', category: 'Lifestyle & Fun', amount: 10000, type: 'Discretionary' }
      ],
      contributions: [
        { id: 401, name: 'P1 401k Match', amount: 15000, type: 'Required', linkedId: '102', frequency: 'Monthly' },
        { id: 402, name: 'P2 401k Match', amount: 10000, type: 'Required', linkedId: '103', frequency: 'Monthly' },
        { id: 403, name: 'Max HSA', amount: 8300, type: 'Required', linkedId: '104', frequency: 'Monthly' },
        { id: 404, name: 'Fund 529s', amount: 6000, type: 'Discretionary', linkedId: '105', frequency: 'Monthly' }
      ],
      debtAllocations: [
        { id: 501, name: 'Mortgage Min', amount: 24000, type: 'Required', linkedId: '201', frequency: 'Monthly' },
        { id: 502, name: 'Minivan Min', amount: 6000, type: 'Required', linkedId: '202', frequency: 'Monthly' },
        { id: 503, name: 'Extra to Minivan', amount: 4000, type: 'Discretionary', linkedId: '202', frequency: 'Monthly' }
      ]
    };
  }

  if (scenario === 'complex') {
    return {
      income: [
        { id: 1, name: 'Executive Salary', gross: 250000, taxRate: 35, type: 'W-2 Salary', isTaxable: true },
        { id: 2, name: 'Consulting (1099)', gross: 85000, taxRate: 30, type: '1099', isTaxable: true },
        { id: 3, name: 'Stock Vesting (RSUs)', gross: 75000, taxRate: 35, type: 'Bonus', isTaxable: true },
        { id: 4, name: 'Rental Income', gross: 36000, taxRate: 20, type: 'Other', isTaxable: true },
        { id: 5, name: 'Tax-Free Muni Bonds', gross: 12000, taxRate: 0, type: 'Interest/Dividends', isTaxable: false }
      ],
      assets: [
        { id: 101, name: 'Primary Checking', bucket: 'Cash', category: 'Bank Account/Savings', balance: 30000, growth: 0 },
        { id: 102, name: 'Treasury Bills', bucket: 'Cash', category: 'Other', balance: 100000, growth: 5 },
        { id: 103, name: 'Mega Backdoor Roth', bucket: 'Retirement', category: 'Roth IRA', balance: 180000, growth: 8 },
        { id: 104, name: 'Old Employer 401k', bucket: 'Retirement', category: '401k', balance: 450000, growth: 7 },
        { id: 105, name: 'Current 401k', bucket: 'Retirement', category: '401k', balance: 120000, growth: 7 },
        { id: 106, name: 'Tech Stock Portfolio', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 350000, growth: 10 },
        { id: 107, name: 'Dividend Portfolio', bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 200000, growth: 6 },
        { id: 108, name: 'Bitcoin Cold Storage', bucket: 'Investment (Non-Retirement)', category: 'Crypto', balance: 65000, growth: 15 }
      ],
      debts: [
        { id: 201, name: 'Primary Jumbo Mortgage', balance: 850000, interestRate: 6.2 },
        { id: 202, name: 'Rental Property Condo', balance: 220000, interestRate: 4.8 },
        { id: 203, name: 'Portfolio Margin Loan', balance: 45000, interestRate: 8.5 },
        { id: 204, name: 'Porsche 911 Finance', balance: 95000, interestRate: 7.5 }
      ],
      spending: [
        { id: 301, name: 'Primary Mortgage/Tax', category: 'Housing', amount: 84000, type: 'Required' },
        { id: 302, name: 'Rental Expenses/HOA', category: 'Housing', amount: 15000, type: 'Required' },
        { id: 303, name: 'Premium Groceries/Dining', category: 'Food', amount: 35000, type: 'Discretionary' },
        { id: 304, name: 'Country Club Dues', category: 'Lifestyle & Fun', amount: 18000, type: 'Discretionary' },
        { id: 305, name: 'International Travel', category: 'Lifestyle & Fun', amount: 40000, type: 'Discretionary' }
      ],
      contributions: [
        { id: 401, name: 'Max Current 401k', amount: 23000, type: 'Required', linkedId: '105', frequency: 'Monthly' },
        { id: 402, name: 'Backdoor Roth Conversion', amount: 7000, type: 'Discretionary', linkedId: '103', frequency: 'One-Time' },
        { id: 403, name: 'Reinvest Dividends', amount: 12000, type: 'Discretionary', linkedId: '107', frequency: 'Quarterly' },
        { id: 404, name: 'RSU Vest into Tech', amount: 50000, type: 'Discretionary', linkedId: '106', frequency: 'Quarterly' },
        { id: 405, name: 'Buy more T-Bills', amount: 40000, type: 'Discretionary', linkedId: '102', frequency: 'One-Time' }
      ],
      debtAllocations: [
        { id: 501, name: 'Primary Mort Min', amount: 65000, type: 'Required', linkedId: '201', frequency: 'Monthly' },
        { id: 502, name: 'Rental Mort Min', amount: 18000, type: 'Required', linkedId: '202', frequency: 'Monthly' },
        { id: 503, name: 'Porsche Loan Min', amount: 22000, type: 'Required', linkedId: '204', frequency: 'Monthly' },
        { id: 504, name: 'Wipe out Margin Loan', amount: 45000, type: 'Discretionary', linkedId: '203', frequency: 'One-Time' }
      ]
    };
  }
  
  return null;
};