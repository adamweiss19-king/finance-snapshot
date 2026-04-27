import React, { useState } from 'react';

function NetWorthProjection({
  totalProjections,
  liquidProjections,
  hasRealEstate
}) {
  // 1. ALWAYS default to Liquid view
  const [isLiquidView, setIsLiquidView] = useState(true);

  // 2. Dynamically grab the correct numbers
  const activeProjections = isLiquidView ? liquidProjections : totalProjections;
  
  const { 
    currentNetWorth, 
    projectedNetWorth, 
    totalCashAddedToAssets, 
    effectiveDebtPayments, 
    totalMarketGrowth 
  } = activeProjections;

  // 3. SMART LABELS: Hide the word "Property" if they don't own one!
  const getLabel = (baseText) => {
    if (!hasRealEstate) return `${baseText} Net Worth`;
    return isLiquidView ? `${baseText} Liquid Net Worth` : `${baseText} Total (Incl. Property) Net Worth`;
  };

  return (
    <div className="mb-12 bg-slate-900 p-8 rounded-3xl text-white shadow-2xl border border-slate-700 relative overflow-hidden">
      
      {/* Decorative Background Glow based on state */}
      <div className={`absolute top-[-50%] right-[-10%] w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-700 ${isLiquidView ? 'bg-sky-500' : 'bg-emerald-500'}`}></div>

      <div className="mb-8 border-b border-slate-700 pb-5 flex flex-col md:flex-row md:justify-between md:items-end gap-4 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white">Year-End Net Worth Projection</h2>
          <p className="text-slate-400 text-sm mt-1">
            How your allocations will change your wealth by December 31st.
          </p>
        </div>

        {/* THE MASTER TOGGLE - Only shows if they own Real Estate! */}
        {hasRealEstate && (
          <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 w-fit shrink-0 shadow-inner">
            <button 
              onClick={() => setIsLiquidView(true)} 
              className={`px-5 py-2 text-xs font-black tracking-wide rounded-lg transition-all duration-300 ${isLiquidView ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              💧 LIQUID
            </button>
            <button 
              onClick={() => setIsLiquidView(false)} 
              className={`px-5 py-2 text-xs font-black tracking-wide rounded-lg transition-all duration-300 ${!isLiquidView ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              TOTAL (W/ PROPERTY)
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* CURRENT NET WORTH CARD */}
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 flex flex-col justify-center transition-all duration-300">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest flex items-center gap-2">
            {getLabel('Current')} (Jan 1)
          </p>
          <p className="text-5xl font-black mt-3 text-white transition-all duration-300">
            ${currentNetWorth.toLocaleString()}
          </p>
          {isLiquidView && hasRealEstate && (
             <p className="text-sky-400/80 text-xs font-bold mt-2 italic">Excludes real estate equity.</p>
          )}
        </div>
        
        {/* PROJECTED NET WORTH CARD */}
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-inner transition-all duration-300">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">
            {getLabel('Projected')} (Dec 31)
          </p>
          <p className={`text-6xl font-black mt-3 mb-6 transition-colors duration-300 ${isLiquidView ? 'text-sky-400' : 'text-emerald-400'}`}>
            ${projectedNetWorth.toLocaleString()}
          </p>
          
          <div className="pt-5 border-t border-slate-700 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">
                Cash Added ({!hasRealEstate ? 'All Assets & Debt' : (isLiquidView ? 'Investments & Liquid Debt' : 'All Assets & Debt')}):
              </span>
              <span className="font-bold text-white text-base">+ ${(totalCashAddedToAssets + effectiveDebtPayments).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">
                Expected {!hasRealEstate ? 'Market' : (isLiquidView ? 'Market' : 'Market & Property')} Growth:
              </span>
              <span className={`font-bold text-base transition-colors duration-300 ${isLiquidView ? 'text-sky-400' : 'text-emerald-400'}`}>
                + ${totalMarketGrowth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default NetWorthProjection;