import React from 'react';
import CashFlowRow from './ui/CashFlowRow';


const INCOME_TYPES = [
  'W-2 Salary', 
  'W-2 Bonus', 
  'Self-Employment (1099)', 
  'Passive (Interest/Dividends)', 
  'Short Term Capital Gains',
  'Long Term Capital Gains',
  'Other'
];

function IncomeManager({ data, setData, isLocked }) {
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
      <div className="mb-4 pr-1">
        <h2 className="text-xl font-bold text-gray-800">Income Sources</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold mb-4">Cash Inflow</p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[40vh] space-y-4 mb-4 pb-2 pr-1">
        {data.map((income) => (
          <CashFlowRow 
            key={income.id} item={income} type="income"
            onUpdate={updateIncome} onRemove={removeIncome} 
            isLocked={isLocked}
          />
        ))}
      </div>

      <div className="mt-auto shrink-0 mb-2">
        <button onClick={addIncome} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
          <span className="text-xl leading-none">+</span> Add Income Source
        </button>
      </div>
    </div>
  );
}

export default IncomeManager;