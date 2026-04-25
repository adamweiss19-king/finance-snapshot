import React from 'react';

function UnallocatedCashTracker({ unallocatedCashFlow, totalNetIncome }) {
  // 1. Calculate Core Math
  const allocatedCash = totalNetIncome - unallocatedCashFlow;
  const getPct = (amount) => totalNetIncome > 0 ? Math.round((amount / totalNetIncome) * 100) : 0;
  const unallocatedPct = getPct(unallocatedCashFlow);
  
  // Progress Bar Math (Cap at 100% so it doesn't break the UI if overbudget)
  const allocatedPct = getPct(allocatedCash);
  const progressBarWidth = Math.min(Math.max(allocatedPct, 0), 100);

  // 2. Determine Dynamic UI States
  let statusColor = "text-slate-800";
  let barColor = "bg-sky-500";
  let message = "Left to allocate";
  let bgTheme = "bg-white border-slate-200";

  if (totalNetIncome === 0) {
    statusColor = "text-slate-400";
    barColor = "bg-slate-200";
    message = "Awaiting Income";
    bgTheme = "bg-slate-50 border-slate-200";
  } else if (unallocatedPct < -1) {
    statusColor = "text-red-600";
    barColor = "bg-red-500";
    message = "Overbudget Warning!";
    bgTheme = "bg-red-50 border-red-200 ring-2 ring-red-500/10";
  } else if (unallocatedPct >= -1 && unallocatedPct <= 1) {
    statusColor = "text-emerald-600 drop-shadow-sm";
    barColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"; 
    message = "Perfect Zero Budget!";
    bgTheme = "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20";
  } else if (unallocatedPct <= 5) {
    statusColor = "text-amber-600";
    barColor = "bg-amber-500";
    message = "Almost there...";
    bgTheme = "bg-amber-50 border-amber-200";
  }

  const displayPct = Math.abs(unallocatedPct);

  return (
    <div className={`mb-8 p-5 md:p-6 rounded-2xl border shadow-sm transition-all duration-700 ${bgTheme}`}>
      
      {/* TOP: MAIN READOUT */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <span className="block text-xs uppercase font-black tracking-widest text-slate-400 mb-1">
            {message}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl md:text-4xl font-black tracking-tight transition-colors duration-500 ${statusColor}`}>
              ${unallocatedCashFlow.toLocaleString()}
            </span>
            {totalNetIncome > 0 && (
              <span className={`text-lg md:text-xl font-bold ${unallocatedPct >= -1 && unallocatedPct <= 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {displayPct}%
              </span>
            )}
          </div>
        </div>

        {/* CONTEXT STATS */}
        {totalNetIncome > 0 && (
          <div className="hidden sm:flex gap-6 text-right">
            <div className="flex flex-col justify-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Income</span>
              <span className="text-sm font-black text-slate-700">${totalNetIncome.toLocaleString()}</span>
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Allocated</span>
              <span className="text-sm font-black text-slate-700">${allocatedCash.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM: THE FUEL BAR */}
      <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>
      
    </div>
  );
}

export default UnallocatedCashTracker;