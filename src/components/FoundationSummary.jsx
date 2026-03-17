import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function FoundationSummary({ 
  incomeData = [], 
  taxReceipt = {}, 
  totalInvestments = 0, 
  debtContributions = [] 
}) {
  // 1. Calculate Foundation Math
  const totalIncome = incomeData.reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const taxableIncome = incomeData
    .filter(item => item.isTaxable !== false)
    .reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const untaxableIncome = totalIncome - taxableIncome;
  
  const totalDebt = debtContributions.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 mt-4">
      <div className="mb-6 border-b border-gray-50 pb-4">
        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Financial Foundation</h3>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Annual Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* INCOME BLOCK */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">Total Income</p>
          <p className="text-3xl font-black text-emerald-900 mb-3">{formatter.format(totalIncome)}</p>
          <div className="flex justify-between items-center text-xs border-t border-emerald-200/50 pt-2 mt-2">
            <span className="text-emerald-700 font-semibold">Taxable:</span>
            <span className="font-bold text-emerald-900">{formatter.format(taxableIncome)}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-emerald-700 font-semibold">Untaxable:</span>
            <span className="font-bold text-emerald-900">{formatter.format(untaxableIncome)}</span>
          </div>
        </div>

        {/* TAXES BLOCK */}
        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
          <p className="text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">Total Taxes</p>
          <p className="text-3xl font-black text-orange-900 mb-3">{formatter.format(taxReceipt.totalTax || 0)}</p>
          <div className="flex justify-between items-center text-xs border-t border-orange-200/50 pt-2 mt-2">
            <span className="text-orange-700 font-semibold">Effective Rate:</span>
            <span className="font-bold text-orange-900 bg-white px-2 py-0.5 rounded-md shadow-sm">
              {taxReceipt.effectiveRate || 0}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-orange-700 font-semibold">Marginal Est:</span>
            <span className="font-bold text-orange-900">Auto-Calculated</span>
          </div>
        </div>

        {/* INVESTMENTS BLOCK */}
        <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
          <p className="text-sky-800 text-xs font-bold uppercase tracking-wider mb-1">Investments</p>
          <p className="text-3xl font-black text-sky-900 mb-3">{formatter.format(totalInvestments)}</p>
          <div className="flex justify-between items-center text-xs border-t border-sky-200/50 pt-2 mt-2">
            <span className="text-sky-700 font-semibold">Savings Rate:</span>
            <span className="font-bold text-sky-900">
              {totalIncome > 0 ? Math.round((totalInvestments / totalIncome) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-sky-700 font-semibold">Status:</span>
            <span className="font-bold text-sky-900">Placeholder for now</span>
          </div>
        </div>

        {/* DEBTS BLOCK */}
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
          <p className="text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">Debt Service</p>
          <p className="text-3xl font-black text-rose-900 mb-3">{formatter.format(totalDebt)}</p>
          <div className="flex justify-between items-center text-xs border-t border-rose-200/50 pt-2 mt-2">
            <span className="text-rose-700 font-semibold">Debt-to-Income:</span>
            <span className="font-bold text-rose-900">
              {totalIncome > 0 ? Math.round((totalDebt / totalIncome) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-rose-700 font-semibold">Status:</span>
            <span className="font-bold text-rose-900">Placeholder for now</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FoundationSummary;