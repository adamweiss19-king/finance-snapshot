import React from 'react';

function AllocationSummary({
  totalNetIncome,
  totalMandatory,
  totalDiscretionary,
  totalInvestments,
  runwayMonths,
  liquidCash,
  monthlyMandatory,
  isRunwayLow
}) {
  // Helper to calculate percentages safely
  const getPct = (amount) => totalNetIncome > 0 ? Math.round((amount / totalNetIncome) * 100) : 0;

  return (
    <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Cash Flow Allocation Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="block text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Mandatory</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-700">${totalMandatory.toLocaleString()}</span>
            <span className="text-lg font-bold text-slate-400">{getPct(totalMandatory)}%</span>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="block text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Discretionary</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-700">${totalDiscretionary.toLocaleString()}</span>
            <span className="text-lg font-bold text-slate-400">{getPct(totalDiscretionary)}%</span>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <span className="block text-xs uppercase font-bold tracking-widest text-blue-500 mb-2">Investments</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-blue-700">${totalInvestments.toLocaleString()}</span>
            <span className="text-lg font-bold text-blue-400">{getPct(totalInvestments)}%</span>
          </div>
        </div>
      </div>

      {/* EMERGENCY FUND RUNWAY VISUAL */}
      <div className={`mt-6 p-5 rounded-xl border flex justify-between items-center transition-colors duration-500 ${isRunwayLow ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <div>
          <span className={`block text-xs uppercase font-bold tracking-widest ${isRunwayLow ? 'text-red-500' : 'text-emerald-600'}`}>
            Emergency Runway
          </span>
          <span className={`text-3xl font-black ${isRunwayLow ? 'text-red-700' : 'text-emerald-700'}`}>
            {runwayMonths.toFixed(1)} Months
          </span>
        </div>
        <div className="text-right">
            <span className={`text-sm font-bold ${isRunwayLow ? 'text-red-600' : 'text-emerald-600'}`}>
              Liquid Cash: ${liquidCash.toLocaleString()} <br/> 
              <span className="opacity-70 font-medium">Mandatory Spending: ${(monthlyMandatory).toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</span>
            </span>
            {isRunwayLow && <p className="text-xs text-red-500 mt-2 font-bold animate-pulse">⚠️ Warning: Below 12-week minimum target.</p>}
            {!isRunwayLow && <p className="text-xs text-emerald-600 mt-2 font-bold">✅ Healthy reserves.</p>}
        </div>
      </div>
    </div>
  );
}

export default AllocationSummary;