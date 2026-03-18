import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

const CATEGORIES = [
  'Housing/Rent', 
  'Card Expenses', 
  'Check Expenses', 
  'Other'
];

function SpendingManager({ data, setData }) {
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
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Living Expenses</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Pure Cash Outflow</p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-xs text-blue-800 shadow-sm">
          <strong>💡 Pro-Tip:</strong> Don't track individual groceries or coffees! Just add up your total yearly Credit Card statements, Check/Debit outflows, and Housing costs for a faster snapshot.
        </div>
        </div>
        <button onClick={addExpense} className="text-amber-600 hover:text-amber-800 font-bold text-sm transition flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
          + Add
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {data.map((item) => {
          const currentType = item.type || 'Mandatory';

          return (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
              
              <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => updateExpense(item.id, 'name', e.target.value)} 
                  placeholder="e.g. Rent, Chase Expense or Debit Spending" 
                  className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
                />
                
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center text-right justify-end">
                    <span className="text-lg font-black text-amber-600 mr-0.5">$</span>
                    <input 
                      type="text"
                      value={item.amount === 0 ? '' : item.amount.toLocaleString('en-US')}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/,/g, '');
                        updateExpense(item.id, 'amount', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                      }}
                      placeholder="0"
                      style={{ width: `${item.amount ? item.amount.toLocaleString('en-US').length + 0.5 : 2}ch` }}  
                      className="text-xl font-black text-amber-600 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200" 
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold mr-1">/ Year</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <select 
                  value={currentType} 
                  onChange={(e) => updateExpense(item.id, 'type', e.target.value)} 
                  className={`border-none rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase focus:ring-0 cursor-pointer shadow-sm ${
                    currentType === 'Mandatory' 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-amber-100 text-amber-800'
                  }`}
                  title="Expense Priority"
                >
                  <option value="Mandatory">Mandatory</option>
                  <option value="Discretionary">Discretionary</option>
                </select>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px] hidden sm:inline">Category:</span>
                  <select 
                    value={item.category} 
                    onChange={(e) => updateExpense(item.id, 'category', e.target.value)} 
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer max-w-[140px] truncate"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => removeExpense(item.id)} 
                className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >✕</button>
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex justify-between items-center bg-amber-50 p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
        <span className="text-xs uppercase font-black tracking-widest text-amber-800">Total Burn</span>
        <span className="text-2xl font-black text-amber-600">{formatter.format(totalSpend)}</span>
      </div>
    </div>
  );
}

export default SpendingManager;