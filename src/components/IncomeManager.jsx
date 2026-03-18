import React from 'react';

const INCOME_TYPES = [
  'W-2 Salary', 
  'W-2 Bonus', 
  'Self-Employment (1099)', 
  'Passive (Interest/Dividends)', 
  'Short Term Capital Gains',
  'Long Term Capital Gains',
  'Other'
];

function IncomeManager({ data, setData }) {
  const addIncome = () => {
    setData([...data, { id: Date.now(), name: '', type: 'W-2 Salary', isTaxable: true, gross: 0 }]);
  };

  const updateIncome = (id, field, value) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeIncome = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-4 pr-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Income Sources</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Cash Inflow</p>
        </div>
        <button onClick={addIncome} className="text-emerald-600 hover:text-emerald-800 font-bold text-sm transition flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg">
          + Add
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 text-xs text-blue-800 shadow-sm">
        <strong>🧠 Smart Tax Engine Active:</strong> Taxes automatically calculated by Filing Status, State, and Income Type.
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const type = item.type || 'W-2 Salary';

          return (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
              <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => updateIncome(item.id, 'name', e.target.value)} 
                  placeholder="e.g. Base Salary" 
                  className="text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300" 
                />
                
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center justify-end text-right">
                    <span className="text-lg font-black text-emerald-700 mr-0.5">$</span>
                    <input 
                      type="text"
                      value={item.gross === 0 ? '' : item.gross.toLocaleString('en-US')}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/,/g, '');
                        updateIncome(item.id, 'gross', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0);
                      }}
                      placeholder="0"
                      style={{ width: `${item.gross ? item.gross.toLocaleString('en-US').length + 0.5 : 2}ch` }}
                      className="text-xl font-black text-emerald-700 border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-2">
                <select 
                  value={type} 
                  onChange={(e) => updateIncome(item.id, 'type', e.target.value)} 
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer max-w-[140px] truncate"
                >
                  {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.type === 'Other' ? item.isTaxable : true}
                    disabled={item.type !== 'Other'}
                    onChange={(e) => updateIncome(item.id, 'isTaxable', e.target.checked)}
                    className={`w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 ${
                      item.type !== 'Other' ? 'opacity-50 cursor-not-allowed bg-gray-200' : 'cursor-pointer'
                    }`}
                  />
                  <label className={`text-[10px] font-bold uppercase tracking-tight ${item.type !== 'Other' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Taxable
                  </label>
                </div>
              </div>

              <button 
                onClick={() => removeIncome(item.id)} 
                className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IncomeManager;