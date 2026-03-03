export const getDemoProfile = (age) => {
  if (age === 25) {
    return {
      income: [{ id: 1, name: 'Entry Level Salary', gross: 65000, taxRate: 20 }],
      assets: [
        { id: 101, name: 'Ally Savings', category: 'Bank Account/Savings', balance: 4000, growth: 0 },
        { id: 102, name: 'Company 401k', category: '401k', balance: 8000, growth: 7 }
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
        { id: 401, name: 'Get Employer Match', amount: 3000, type: 'Required', linkedId: '102', frequency: 'Monthly' },
        { id: 402, name: 'Build Emergency Fund', amount: 2000, type: 'Discretionary', linkedId: '101', frequency: 'Monthly' }
      ],
      debtAllocations: [
        { id: 501, name: 'Student Loan Min', amount: 3600, type: 'Required', linkedId: '201', frequency: 'Monthly' },
        { id: 502, name: 'Car Loan Min', amount: 2400, type: 'Required', linkedId: '202', frequency: 'Monthly' },
        { id: 503, name: 'Extra to Car', amount: 1200, type: 'Discretionary', linkedId: '202', frequency: 'Monthly' }
      ]
    };
  } 
  
  if (age === 40) {
    return {
      income: [{ id: 1, name: 'Senior Salary', gross: 140000, taxRate: 28 }],
      assets: [
        { id: 101, name: 'Chase Checking/Savings', category: 'Bank Account/Savings', balance: 25000, growth: 0 },
        { id: 102, name: 'Fidelity 401k', category: '401k', balance: 160000, growth: 7 },
        { id: 103, name: 'Vanguard Brokerage', category: 'Brokerage Account', balance: 45000, growth: 7 },
        { id: 104, name: 'Family HSA', category: 'HSA', balance: 8000, growth: 4 }
      ],
      debts: [
        { id: 201, name: 'House Mortgage', balance: 320000, interestRate: 4 }
      ],
      spending: [
        { id: 301, name: 'Mortgage & Taxes', category: 'Housing', amount: 26000, type: 'Required' },
        { id: 302, name: 'Groceries & Kids', category: 'Food', amount: 14000, type: 'Required' },
        { id: 303, name: 'Family Vacations', category: 'Lifestyle & Fun', amount: 8000, type: 'Discretionary' }
      ],
      contributions: [
        { id: 401, name: 'Max 401k', amount: 23000, type: 'Required', linkedId: '102', frequency: 'Monthly' },
        { id: 402, name: 'Index Funds', amount: 6000, type: 'Discretionary', linkedId: '103', frequency: 'Quarterly' },
        { id: 403, name: 'Max HSA', amount: 4150, type: 'Required', linkedId: '104', frequency: 'Monthly' }
      ],
      debtAllocations: [
        { id: 501, name: 'Mortgage Min', amount: 18000, type: 'Required', linkedId: '201', frequency: 'Monthly' }
      ]
    };
  } 
  
  if (age === 50) {
    return {
      income: [
        { id: 1, name: 'Director Salary', gross: 210000, taxRate: 32 },
        { id: 2, name: 'Spouse Part-Time', gross: 45000, taxRate: 22 }
      ],
      assets: [
        { id: 101, name: 'High Yield Savings', category: 'Bank Account/Savings', balance: 50000, growth: 0 },
        { id: 102, name: 'Combined 401ks', category: '401k', balance: 650000, growth: 7 },
        { id: 103, name: 'Joint Brokerage', category: 'Brokerage Account', balance: 220000, growth: 7 }
      ],
      debts: [
        { id: 201, name: 'Remaining Mortgage', balance: 140000, interestRate: 3.5 }
      ],
      spending: [
        { id: 301, name: 'Mortgage/Insurance', category: 'Housing', amount: 24000, type: 'Required' },
        { id: 302, name: 'Living Expenses', category: 'Food', amount: 18000, type: 'Required' },
        { id: 303, name: 'Travel / Luxury', category: 'Lifestyle & Fun', amount: 20000, type: 'Discretionary' }
      ],
      contributions: [
        { id: 401, name: 'Max 401k + Catchup', amount: 30500, type: 'Required', linkedId: '102', frequency: 'Monthly' },
        { id: 402, name: 'Dump into Market', amount: 35000, type: 'Discretionary', linkedId: '103', frequency: 'Monthly' }
      ],
      debtAllocations: [
        { id: 501, name: 'Mortgage Min', amount: 18000, type: 'Required', linkedId: '201', frequency: 'Monthly' },
        { id: 502, name: 'Extra Principal', amount: 12000, type: 'Discretionary', linkedId: '201', frequency: 'Monthly' }
      ]
    };
  }
  return null;
};