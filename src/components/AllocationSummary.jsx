import React from 'react';
import Tooltip from './ui/Tooltip';

function AllocationSummary({
  totalNetIncome,
  totalMandatory,
  totalDiscretionary,
  totalInvestments,
  currentRunwayMonths = 0,     // Added safety fallback
  projectedRunwayMonths = 0,   // Added safety fallback
  liquidCash = 0,
  projectedLiquidCash = 0,     // ADDED THIS PROP!
  monthlyMandatory = 0,
  isRunwayLow
}) {
  // Helper to calculate percentages safely
  const getPct = (amount) => totalNetIncome > 0 ? Math.round((amount / totalNetIncome) * 100) : 0;

  return (
    <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Cash Flow Allocation Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ... Mandatory, Discretionary, Investments code stays EXACTLY the same ... */}
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

      {/* EMERGENCY FUND RUNWAY VISUAL (Upgraded) */}
      <div className={`mt-6 p-5 rounded-xl border flex flex-col md:flex-row justify-between md:items-center gap-4 transition-colors duration-500 ${isRunwayLow ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <div>
          <span className={`block text-xs uppercase font-bold tracking-widest flex items-center ${isRunwayLow ? 'text-red-500' : 'text-emerald-600'}`}>
            Projected Emergency Runway (Dec 31)
            <Tooltip message="Calculated by dividing your projected liquid cash (Savings + Checking) by your required monthly Mandatory expenses. Aim for 3 to 6 months." />
          </span>
          <div className="flex items-baseline gap-3">
            <span className={`text-3xl font-black ${isRunwayLow ? 'text-red-700' : 'text-emerald-700'}`}>
              {projectedRunwayMonths.toFixed(1)} Months
            </span>
            <span className={`text-sm font-bold ${isRunwayLow ? 'text-red-400' : 'text-emerald-500'}`}>
              (Current: {currentRunwayMonths.toFixed(1)} mo)
            </span>
          </div>
        </div>
        
        <div className="text-left md:text-right">
            <span className={`text-sm font-bold ${isRunwayLow ? 'text-red-600' : 'text-emerald-700'}`}>
              Projected Cash: ${projectedLiquidCash.toLocaleString()} <br/> 
              <span className={`opacity-70 font-medium ${isRunwayLow ? 'text-red-500' : 'text-emerald-600'}`}>
                Starting Cash: ${liquidCash.toLocaleString()} <br/>
                Monthly Burn: ${(monthlyMandatory).toLocaleString(undefined, {maximumFractionDigits: 0})}/mo
              </span>
            </span>
            {isRunwayLow ? (
              <p className="text-xs text-red-500 mt-2 font-bold animate-pulse">⚠️ Warning: Projected to remain below 3-month minimum.</p>
            ) : (
              <p className="text-xs text-emerald-600 mt-2 font-bold">✅ Healthy EOY reserves projected.</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default AllocationSummary;