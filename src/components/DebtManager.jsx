import React, { useState } from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function DebtManager() {
  const [debts, setDebts] = useState([
    { id: 1, name: 'Car Loan', balance: 15000, interestRate: 5, annualPayment: 4000 }
  ]);

  const addDebt = () => {
    setDebts([...debts, { id: Date.now(), name: '', balance: 0, interestRate: 0, annualPayment: 0 }]);
  };

  const updateDebt = (id, field, value) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDebt = (id) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  // THE MATH: Simple Annual Amortization
  const totalInterest = debts.reduce((acc, debt) => {
    // A simplified yearly interest calculation: Balance * Rate
    return acc + ((debt.balance || 0) * ((debt.interestRate || 0) / 100));
  }, 0);

  const totalPayments = debts.reduce((acc, debt) => acc + (debt.annualPayment || 0), 0);
  const currentTotalDebt = debts.reduce((acc, debt) => acc + (debt.balance || 0), 0);
  
  // EOY Balance = Starting Balance + Interest - Payments
  const totalEOYDebt = currentTotalDebt + totalInterest - totalPayments;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Debt Manager</h2>
        <button onClick={addDebt} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">
          + Add Debt
        </button>
      </div>

      <div className="space-y-4">
        {debts.map((debt) => (
          <div key={debt.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4 border-gray-50">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Debt Name</label>
              <input 
                type="text" 
                value={debt.name}
                onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                placeholder="e.g. Car Loan"
                className="w-full border-gray-300 rounded-md p-2 border focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Balance</label>
              <input 
                type="number" 
                value={debt.balance === 0 ? '' : debt.balance}
                onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Interest Rate %</label>
              <input 
                type="number" 
                value={debt.interestRate === 0 ? '' : debt.interestRate}
                onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Annual Payment</label>
              <input 
                type="number" 
                value={debt.annualPayment === 0 ? '' : debt.annualPayment}
                onChange={(e) => updateDebt(debt.id, 'annualPayment', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>
            <button onClick={() => removeDebt(debt.id)} className="text-gray-400 hover:text-red-600 text-sm font-medium pb-2 transition">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <span>Starting Debt Total:</span>
          <span className="font-semibold text-gray-800">{formatter.format(currentTotalDebt)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <span>Annual Interest Cost:</span>
          <span className="font-semibold text-orange-600">+ {formatter.format(totalInterest)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <span>Total Scheduled Payments:</span>
          <span className="font-semibold text-green-600">- {formatter.format(totalPayments)}</span>
        </div>

        <div className="flex justify-between items-center text-red-900 bg-red-50 p-4 rounded-xl border border-red-100 mt-4">
          <div>
            <span className="block text-xs uppercase font-bold tracking-wider opacity-70">Projected EOY Debt</span>
            <span className="text-3xl font-black">{formatter.format(Math.max(0, totalEOYDebt))}</span>
          </div>
          <div className="text-right">
             <span className="block text-xs font-bold text-red-600 uppercase">
               Net Reduction
             </span>
             <span className="text-xl font-bold">
               {formatter.format(Math.max(0, currentTotalDebt - totalEOYDebt))}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebtManager;