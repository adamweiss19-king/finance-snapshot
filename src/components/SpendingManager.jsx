import React from 'react';
import CashFlowRow from './ui/CashFlowRow';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

const CATEGORIES = [
  'Housing/Rent', 
  'Card Expenses', 
  'Check Expenses', 
  'Other'
];

function SpendingManager({ data, setData, isLocked }) {
  const addExpense = () => {
    setData([...data, { id: Date.now(), name: '', category: 'Housing/Rent', amount: 0, type: 'Mandatory' }]);
  };

  const updateExpense = (id, field, value) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeExpense = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const totalSpend = data.reduce((acc, item) => acc + (item.amount || 0), 0);

  return (
    <div className="flex flex-col h-full">
      
      {/* 1. HEADER*/}
      <div className="mb-4 pr-1">
        <h2 className="text-xl font-bold text-gray-800">Living Expenses</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold mb-4">Pure Cash Outflow</p>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 shadow-sm">
          💡 <strong>Pro-Tip:</strong> Don't track individual groceries...
        </div>
      </div>

      {/* 2. SCROLLABLE LIST AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden overflow-x-hidden max-h-[40vh] space-y-4 mb-6 pb-2 pr-1">
          {data.map((expense) => (
          <CashFlowRow 
            key={expense.id}
            item={expense}
            type="spending"
            onUpdate={updateExpense} 
            onRemove={removeExpense}
            isLocked={isLocked} 
          />
        ))}
      </div>

       {/* 3. THE PERMANENT GHOST ROW (Anchored outside the scroll area) */}
      <div className="mb-6 shrink-0">
        <button 
          onClick={addExpense}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
        >
          <span className="text-xl leading-none">+</span> Add Expense
        </button>
      </div>

      {/* 4. FOOTER */}
      <div className="mt-auto flex justify-between items-center bg-amber-50 p-5 rounded-2xl border-2 border-amber-200 shadow-sm shrink-0">
        <span className="text-xs uppercase font-black tracking-widest text-amber-800">Total Burn</span>
        <span className="text-2xl font-black text-amber-600">{formatter.format(totalSpend)}</span>
      </div>
      
    </div>
  );
}

export default SpendingManager;