import React from 'react';
import ContributionRow from './ui/ContributionRow';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
});

function DebtContributionManager({ data, setData, debts, onCreateLinkedDebt, isLocked }) {
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
      <div className="mb-4 pr-1">
        <h2 className="text-xl font-bold text-gray-800">Debt Paydown Plan</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Cash to Liabilities</p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[40vh] space-y-4 mb-4 pb-2 pr-1">
        {data.map((item) => (
          <ContributionRow 
            key={item.id} item={item} type="debt" linkOptions={debts}
            onUpdate={updateContribution} onRemove={removeContribution} onCreateLinked={onCreateLinkedDebt}
            isLocked={isLocked}
          />
        ))}
      </div>

      <div className="mb-6 shrink-0">
        <button onClick={addContribution} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
          <span className="text-xl leading-none">+</span> Add Payment
        </button>
      </div>

      <div className="mt-auto flex justify-between items-center bg-red-50 p-5 rounded-2xl border-2 border-red-200 shadow-sm shrink-0">
        <span className="text-xs uppercase font-bold tracking-widest text-red-800">Total Scheduled Payments</span>
        <span className="text-2xl font-black text-red-600">{formatter.format(totalContributions)}</span>
      </div>
    </div>
  );
}

export default DebtContributionManager;