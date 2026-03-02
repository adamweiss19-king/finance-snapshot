import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

const CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Lifestyle & Fun', 'Other'
];

function SpendingManager({ data, setData }) {
  const addExpense = () => {
    setData([...data, { id: Date.now(), name: '', category: 'Housing', amount: 0 }]);
  };

  const updateExpense = (id, field, value) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeExpense = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const totalSpend = data.reduce((acc, item) => acc + (item.amount || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Living Expenses</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Categorized Spending</p>
        </div>
        <button onClick={addExpense} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition">
          + Add Expense
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {data.map((item) => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expense Name</label>
              <input 
                type="text" value={item.name} onChange={(e) => updateExpense(item.id, 'name', e.target.value)}
                placeholder="e.g. Rent, Groceries" className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                value={item.category} onChange={(e) => updateExpense(item.id, 'category', e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border bg-white"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Annual Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input 
                  type="number" value={item.amount === 0 ? '' : item.amount} onChange={(e) => updateExpense(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full border-gray-300 rounded-md p-2 pl-7 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
              <select 
                value={item.type || 'Mandatory'} 
                onChange={(e) => updateExpense(item.id, 'type', e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border bg-white"
              >
                <option value="Mandatory">Mandatory</option>
                <option value="Discretionary">Discretionary</option>
              </select>
              </div>
            <button onClick={() => removeExpense(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium pb-2 text-right">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <span className="text-sm font-medium text-gray-600">Total Annual Spend:</span>
        <span className="text-xl font-bold text-gray-900">{formatter.format(totalSpend)}</span>
      </div>
    </div>
  );
}

export default SpendingManager;