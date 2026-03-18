import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

function DebtContributionManager({ data, setData, debts, onCreateLinkedDebt }) {
  const addContribution = () => {
    // Default to 'new' so the button appears immediately
    setData([...data, { id: Date.now(), name: '', amount: 0, type: 'Mandatory', linkedId: 'new' }]);
  };

  const updateContribution = (id, field, value) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeContribution = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const totalContributions = data.reduce((acc, item) => acc + (item.amount || 0), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Debt Paydown Plan</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Cash to Liabilities</p>
        </div>
        <button onClick={addContribution} className="text-red-600 hover:text-red-800 font-bold text-sm transition flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg">
          + Add
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {data.map((item) => {
          const currentType = item.type || 'Mandatory';

          return (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
              
              {/* Top Row: Action Name and Amount */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
                <input 
                  type="text" 
                  value={item.name || ''} 
                  onChange={(e) => updateContribution(item.id, 'name', e.target.value)} 
                  placeholder="e.g. Mortgage Min, Extra Principal" 
                  className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
                />
                
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center text-right">
                    <span className="text-lg font-black text-red-700 mr-0.5">$</span>
                    <input 
                      type="text"
                      value={item.amount === 0 ? '' : item.amount.toLocaleString('en-US')}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/,/g, '');
                        updateContribution(item.id, 'amount', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                      }}
                      placeholder="0"
                      style={{ width: `${item.amount ? item.amount.toLocaleString('en-US').length + 0.5 : 2}ch` }}  
                      className="text-xl font-black text-red-700 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200" 
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-red-400 font-bold mr-1">Amount</span>
                </div>
              </div>
              
              {/* Bottom Row: Type Pill and Target Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* Visual Pill for Mandatory vs Discretionary */}
                <select 
                  value={currentType} 
                  onChange={(e) => updateContribution(item.id, 'type', e.target.value)} 
                  className={`border-none rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase focus:ring-0 cursor-pointer shadow-sm ${
                    currentType === 'Mandatory' 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-red-100 text-red-800'
                  }`}
                  title="Payment Priority"
                >
                  <option value="Mandatory">Mandatory</option>
                  <option value="Discretionary">Discretionary</option>
                </select>

                <div className="flex flex-col gap-2 flex-1 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px] hidden sm:inline">Target:</span>
                    <select 
                      value={item.linkedId || 'new'} 
                      onChange={(e) => updateContribution(item.id, 'linkedId', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer flex-1 truncate"
                    >
                      <option value="new">✨ New / Unlinked Debt</option>
                      {debts && debts.map(debt => (
                        <option key={debt.id} value={debt.id}>{debt.name || 'Unnamed Debt'}</option>
                      ))}
                    </select>
                  </div>

                  {/* THE NEW AUTO-CREATE BUTTON */}
                  {(!item.linkedId || item.linkedId === 'new') && (
                    <button 
                      onClick={() => onCreateLinkedDebt(item.id, item.name)}
                      className="w-full text-[10px] uppercase tracking-widest font-black text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 py-1.5 rounded-md transition-colors shadow-sm"
                    >
                      + Create $0 Debt in Foundation
                    </button>
                  )}
                </div>
              </div>

              <button 
                onClick={() => removeContribution(item.id)} 
                className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >✕</button>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex justify-between items-center bg-red-50 p-5 rounded-2xl border-2 border-red-200 shadow-sm">
        <span className="text-xs uppercase font-bold tracking-widest text-red-800">Total Scheduled Payments</span>
        <span className="text-2xl font-black text-red-600">{formatter.format(totalContributions)}</span>
      </div>
    </div>
  );
}

export default DebtContributionManager;