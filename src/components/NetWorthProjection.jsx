import React from 'react';

function NetWorthProjection({
  currentNetWorth,
  projectedNetWorth,
  totalCashAddedToAssets,
  effectiveDebtPayments,
  totalMarketGrowth
}) {
  return (
    <div className="mb-12 bg-slate-900 p-8 rounded-2xl text-white shadow-2xl border border-slate-700">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-black text-white">Year-End Net Worth Projection</h2>
        <p className="text-slate-400 text-sm mt-1">
          How your allocations will change your net worth by December 31st.<br ></br> Contributions assume 0% growth in Year 1. Debt payments are mathematically capped at the total payoff amount.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Current Net Worth (Jan 1)</p>
          <p className="text-4xl font-black mt-2">${currentNetWorth.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900 to-slate-800 p-6 rounded-xl border border-blue-800 shadow-inner">
          <p className="text-blue-300 text-xs uppercase font-bold tracking-widest">Projected Net Worth (Dec 31)</p>
          <p className="text-5xl font-black text-white mt-2 mb-4">${projectedNetWorth.toLocaleString()}</p>
          
          <div className="pt-4 border-t border-blue-800/50 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-200">Total Cash Added (To Assets & Debt):</span>
              <span className="font-bold text-white">+ ${(totalCashAddedToAssets + effectiveDebtPayments).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-200">Expected Market Growth:</span>
              <span className="font-bold text-green-400">+ ${totalMarketGrowth.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetWorthProjection;