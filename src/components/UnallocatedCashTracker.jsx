import React from 'react';

function UnallocatedCashTracker({ unallocatedCashFlow, totalNetIncome }) {
  // Local helper just for this component's UI
  const getPct = (amount) => totalNetIncome > 0 ? Math.round((amount / totalNetIncome) * 100) : 0;

  return (
    <div className="flex justify-end mb-6">
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-right shadow-lg min-w-[280px]">
        <span className="block text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
          Unallocated Cash
        </span>
        <div className="flex justify-end items-baseline gap-3">
          <span className={`text-4xl font-black tracking-tight ${unallocatedCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${unallocatedCashFlow.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-slate-400">
            {getPct(unallocatedCashFlow)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default UnallocatedCashTracker;