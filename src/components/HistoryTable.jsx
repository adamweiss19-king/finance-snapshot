import React, { useState } from 'react';

// Formatters
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function HistoryTable({ snapshots }) {
  const [viewMode, setViewMode] = useState('Macro'); // 'Macro' or 'Micro'

  // 1. Extract and sort the years (e.g., ['2024', '2025'])
  const years = Object.keys(snapshots || {}).sort();

  if (years.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-4 text-center text-slate-500">
        No history available. Save a snapshot to start building your ledger.
      </div>
    );
  }

  // --- DATA PROCESSING HELPERS ---
  
  // Safe calculation helpers
  const sumData = (dataArr, field) => (dataArr || []).reduce((acc, item) => acc + (Number(item[field]) || 0), 0);

  // Pre-calculate Macro totals for every year
  const macroData = years.map(year => {
    const d = snapshots[year].data;
    const assets = sumData(d.assetData, 'balance');
    const debts = sumData(d.debtData, 'balance');
    return {
      year,
      income: sumData(d.incomeData, 'gross'),
      assets: assets,
      debts: debts,
      netWorth: assets - debts,
    };
  });

  // Pre-calculate Micro rows (Find every unique item name across all years)
  const extractUniqueItems = (dataType) => {
    const uniqueNames = new Set();
    years.forEach(year => {
      (snapshots[year].data[dataType] || []).forEach(item => {
        if (item.name) uniqueNames.add(item.name);
      });
    });
    return Array.from(uniqueNames);
  };

  const allIncomeNames = extractUniqueItems('incomeData');
  const allAssetNames = extractUniqueItems('assetData');
  const allDebtNames = extractUniqueItems('debtData');

  // Helper to find a specific item's value in a specific year
  const getItemValue = (year, dataType, itemName, valueField) => {
    const item = (snapshots[year].data[dataType] || []).find(i => i.name === itemName);
    return item ? Number(item[valueField]) : 0;
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-4 animate-fade-in">
      
      {/* HEADER & TOGGLE */}
      <div className="mb-8 border-b border-gray-50 pb-4 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Year-over-Year Ledger</h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1 italic">
            Historical Balance Sheet
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg shadow-inner">
          <button 
            onClick={() => setViewMode('Macro')}
            className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all ${
              viewMode === 'Macro' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Macro
          </button>
          <button 
            onClick={() => setViewMode('Micro')}
            className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all ${
              viewMode === 'Micro' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Micro
          </button>
        </div>
      </div>

      {/* THE TABLE */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <table className="w-full min-w-[800px] text-left border-collapse whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 border-b-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-xs">
                Metric
              </th>
              {years.map(year => (
                <th key={year} className="p-4 border-b-2 border-slate-200 border-l border-slate-100 bg-slate-50 text-slate-800 font-black text-lg text-right w-36">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {viewMode === 'Macro' ? (
              // --- MACRO VIEW (Solid Pastel Rows) ---
              <>
                <tr className="bg-emerald-50 hover:bg-emerald-100 transition-colors">
                  <td className="p-4 border-b border-emerald-100/50 font-bold text-emerald-800">Gross Income</td>
                  {years.map(y => <td key={y} className="p-4 border-b border-emerald-100/50 border-l border-emerald-100/50 text-right font-bold text-emerald-900">{money.format(macroData.find(d => d.year === y).income)}</td>)}
                </tr>
                <tr className="bg-blue-50 hover:bg-blue-100 transition-colors">
                  <td className="p-4 border-b border-blue-100/50 font-bold text-blue-800">Total Assets</td>
                  {years.map(y => <td key={y} className="p-4 border-b border-blue-100/50 border-l border-blue-100/50 text-right font-bold text-blue-900">{money.format(macroData.find(d => d.year === y).assets)}</td>)}
                </tr>
                <tr className="bg-red-50 hover:bg-red-100 transition-colors">
                  <td className="p-4 border-b border-red-100/50 font-bold text-red-800">Total Debts</td>
                  {years.map(y => <td key={y} className="p-4 border-b border-red-100/50 border-l border-red-100/50 text-right font-bold text-red-900">{money.format(macroData.find(d => d.year === y).debts)}</td>)}
                </tr>
                <tr className="bg-slate-800 shadow-sm">
                  <td className="p-4 border-b border-slate-900 font-bold text-white rounded-bl-lg">Net Worth</td>
                  {years.map((y, index) => {
                    const nw = macroData.find(d => d.year === y).netWorth;
                    return (
                      <td key={y} className={`p-4 border-b border-slate-900 border-l border-slate-700 text-right font-black ${nw >= 0 ? 'text-emerald-400' : 'text-red-400'} ${index === years.length - 1 ? 'rounded-br-lg' : ''}`}>
                        {money.format(nw)}
                      </td>
                    )
                  })}
                </tr>
              </>
            ) : (
              // --- MICRO VIEW (Color Zones) ---
              <>
                {/* 🟢 INCOME ZONE */}
                <tr><td colSpan={years.length + 1} className="p-3 pt-8 pb-2 text-xs font-black uppercase text-emerald-700 tracking-widest bg-emerald-100/50 border-b-2 border-emerald-200">Income Streams</td></tr>
                {allIncomeNames.map((name, index) => (
                  <tr key={`inc-${name}`} className={`${index % 2 === 0 ? 'bg-emerald-50/30' : 'bg-emerald-50/70'} hover:bg-emerald-100 transition-colors text-sm`}>
                    <td className="p-3 border-b border-emerald-100/50 font-semibold text-emerald-800 pl-6">{name}</td>
                    {years.map(y => {
                      const val = getItemValue(y, 'incomeData', name, 'gross');
                      return <td key={y} className={`p-3 border-b border-emerald-100/50 border-l border-emerald-100/50 text-right ${val > 0 ? 'text-emerald-900 font-bold' : 'text-emerald-300'}`}>{val > 0 ? money.format(val) : '-'}</td>
                    })}
                  </tr>
                ))}

                {/* 🔵 ASSET ZONE */}
                <tr><td colSpan={years.length + 1} className="p-3 pt-8 pb-2 text-xs font-black uppercase text-blue-700 tracking-widest bg-blue-100/50 border-b-2 border-blue-200">Assets</td></tr>
                {allAssetNames.map((name, index) => (
                  <tr key={`ast-${name}`} className={`${index % 2 === 0 ? 'bg-blue-50/30' : 'bg-blue-50/70'} hover:bg-blue-100 transition-colors text-sm`}>
                    <td className="p-3 border-b border-blue-100/50 font-semibold text-blue-800 pl-6">{name}</td>
                    {years.map(y => {
                      const val = getItemValue(y, 'assetData', name, 'balance');
                      return <td key={y} className={`p-3 border-b border-blue-100/50 border-l border-blue-100/50 text-right ${val > 0 ? 'text-blue-900 font-bold' : 'text-blue-300'}`}>{val > 0 ? money.format(val) : '-'}</td>
                    })}
                  </tr>
                ))}

                {/* 🔴 DEBT ZONE */}
                <tr><td colSpan={years.length + 1} className="p-3 pt-8 pb-2 text-xs font-black uppercase text-red-700 tracking-widest bg-red-100/50 border-b-2 border-red-200">Liabilities</td></tr>
                {allDebtNames.map((name, index) => (
                  <tr key={`dbt-${name}`} className={`${index % 2 === 0 ? 'bg-red-50/30' : 'bg-red-50/70'} hover:bg-red-100 transition-colors text-sm`}>
                    <td className="p-3 border-b border-red-100/50 font-semibold text-red-800 pl-6">{name}</td>
                    {years.map(y => {
                      const val = getItemValue(y, 'debtData', name, 'balance');
                      return <td key={y} className={`p-3 border-b border-red-100/50 border-l border-red-100/50 text-right ${val > 0 ? 'text-red-900 font-bold' : 'text-red-300'}`}>{val > 0 ? money.format(val) : '-'}</td>
                    })}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default HistoryTable;