import React from 'react';
import BaseAccountRow from './ui/BaseAccountRow';

function DebtManager({ data, setData, isClosingOut, contributions, planSnapshot, isLocked, projectedDebts }) {
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
      <div className="mb-4 pr-1">
        <h2 className="text-xl font-bold text-gray-800">Debt Manager</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
          {isClosingOut ? 'End of Year Review' : 'Current Liabilities'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[40vh] space-y-4 mb-4 pb-2 pr-1">
        {data.map((debt) => {
          // NEW: Find the specific math prediction for this debt
          const projection = (projectedDebts || []).find(p => p.id === debt.id);
          const predictedBalance = projection ? projection.projectedEOY : null;

          return (
            <BaseAccountRow 
              key={debt.id} item={debt} type="debt" isClosingOut={isClosingOut}
              contributions={contributions} planSnapshot={planSnapshot?.debtData} 
              onUpdate={updateDebt} onRemove={removeDebt} isLocked={isLocked}
              predictedBalance={predictedBalance} // NEW: Pass it to the input row
            />
          );
        })}
      </div>

      {!isClosingOut && (
        <div className="mt-auto shrink-0 mb-2">
          <button onClick={addDebt} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
            <span className="text-xl leading-none">+</span> Add Debt
          </button>
        </div>
      )}
    </div>
  );
}

export default DebtManager;