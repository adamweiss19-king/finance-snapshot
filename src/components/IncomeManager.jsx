import React, { useState } from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0, // Keeps it clean (no .00)
  maximumFractionDigits: 0, 
});

function IncomeManager() {
  // 1. STATE: This is where we store our list of income sources
  const [incomes, setIncomes] = useState([
    { id: 1, name: 'Salary', gross: 100000, taxRate: 25 }
  ]);

  // 2. LOGIC: Functions to change the data
  const addIncome = () => {
    const newIncome = { id: Date.now(), name: '', gross: 0, taxRate: 0 };
    setIncomes([...incomes, newIncome]);
  };

  const updateIncome = (id, field, value) => {
    const updated = incomes.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setIncomes(updated);
  };

  const removeIncome = (id) => {
    setIncomes(incomes.filter(item => item.id !== id));
  };

  // 3. THE MATH: Calculating the totals
  const totalNet = incomes.reduce((acc, item) => {
    const net = item.gross * (1 - item.taxRate / 100);
    return acc + net;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Income Sources</h2>
        <button 
          onClick={addIncome}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          + Add Income
        </button>
      </div>

      <div className="space-y-4">
        {incomes.map((item) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 border-gray-50">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Source Name</label>
              <input 
                type="text" 
                value={item.name}
                onChange={(e) => updateIncome(item.id, 'name', e.target.value)}
                placeholder="e.g. Salary"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gross Amount</label>
              <input 
                type="number" 
                value={item.gross === 0 ? '' : item.gross}
                onChange={(e) => updateIncome(item.id, 'gross', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tax Rate (%)</label>
              <input 
                type="number" 
                value={item.taxRate === 0 ? '' : item.taxRate}
                onChange={(e) => updateIncome(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
              />
            </div>
            {/* The Live Formatting Column */}
            <div className="text-right">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Take Home</label>
            <div className="p-2 text-green-700 font-bold">
                {/* This uses our new formatter on the fly! */}
                {formatter.format(item.gross * (1 - (item.taxRate || 0) / 100))}
            </div>
            </div>
            <button 
              onClick={() => removeIncome(item.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium pb-2 text-left"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-gray-600 font-medium">Estimated Annual Net Pay:</span>
        <span className="text-2xl font-bold text-green-600">
          {formatter.format(totalNet)}
        </span>
      </div>
    </div>
  );
}

export default IncomeManager;