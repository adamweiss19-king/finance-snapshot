import React from 'react';

function DebtManager({ data, setData }) {
  const addDebt = () => {
    setData([...data, { id: Date.now(), name: '', balance: 0, interestRate: 0 }]);
  };

  const updateDebt = (id, field, value) => {
    setData(data.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDebt = (id) => {
    setData(data.filter(d => d.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Debt Manager</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Current Liabilities</p>
        </div>
        <button onClick={addDebt} className="text-red-600 hover:text-red-800 font-bold text-sm transition flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg">
          + Add
        </button>
      </div>

      <div className="space-y-4">
        {data.map((debt) => (
          <div key={debt.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
            <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
              <input 
                type="text" 
                value={debt.name} 
                onChange={(e) => updateDebt(debt.id, 'name', e.target.value)} 
                placeholder="e.g. Car Loan" 
                className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
              />
             <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center justify-end text-right">
                <span className="text-lg font-black text-red-700 mr-0.5">$</span>
                <input
                  type="text"
                  value={debt.balance === 0 ? '' : debt.balance.toLocaleString('en-US')}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/,/g, '');
                    updateDebt(debt.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                  }}
                  placeholder="0"
                  style={{ width: `${debt.balance ? debt.balance.toLocaleString('en-US').length + 0.5 : 2}ch` }}
                  className="text-xl font-black text-red-700 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200" 
                />
              </div>
            </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-400">Interest Rate:</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    value={debt.interestRate === 0 ? '' : debt.interestRate} 
                    onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)} 
                    className="w-16 text-right bg-slate-50 border border-slate-200 rounded p-1 text-xs text-slate-700 font-bold focus:ring-0" 
                    placeholder="0"
                  />
                  <span className="font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => removeDebt(debt.id)} 
              className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebtManager;