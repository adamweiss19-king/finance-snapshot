import React, { useState, useMemo } from 'react';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function VarianceReport({ snapshots }) {
  // Find all closed years that have both a plan and actuals
  const closedYears = Object.keys(snapshots || {})
    .filter(y => snapshots[y].status === 'closed' && snapshots[y].actuals && snapshots[y].plan)
    .sort((a, b) => b - a); // Sort newest to oldest

  const [selectedYear, setSelectedYear] = useState(closedYears[0] || '');

  const report = useMemo(() => {
    if (!selectedYear || !snapshots[selectedYear]) return null;

    const snap = snapshots[selectedYear];
    const plan = snap.plan;
    const actual = snap.actuals;
    const projections = plan.projections || {};

    const findMatch = (arr, name) => (arr || []).find(i => i.name === name);

    // --- 1. MACRO SCORECARD MATH ---
    const planIncome = (plan.incomeData || []).reduce((sum, i) => sum + (Number(i.gross) || 0), 0);
    const actualIncome = (actual.incomeData || []).reduce((sum, i) => sum + (Number(i.gross) || 0), 0);
    const incomeDelta = actualIncome - planIncome; // Positive is good

    const planSpending = (plan.spendingData || []).reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    const actualSpending = (actual.spendingData || []).reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    const spendingDelta = planSpending - actualSpending; // Positive is good (spent less)

    const actualAssets = (actual.assetData || []).reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    const actualDebts = (actual.debtData || []).reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
    const actualNW = actualAssets - actualDebts;
    const planNW = projections.projectedNetWorth || actualNW; 
    const nwDelta = actualNW - planNW; // Positive is good

    // --- 2. MICRO BREAKDOWN MATH ---
    const micro = { income: [], spending: [], assets: [], debts: [] };

    // Income (Actual > Plan = Good)
    (plan.incomeData || []).forEach(p => {
      const a = findMatch(actual.incomeData, p.name);
      const aVal = a ? Number(a.gross) || 0 : 0;
      const pVal = Number(p.gross) || 0;
      micro.income.push({ name: p.name, plan: pVal, actual: aVal, delta: aVal - pVal, isGood: aVal >= pVal });
    });

    // Spending (Actual < Plan = Good)
    (plan.spendingData || []).forEach(p => {
      const a = findMatch(actual.spendingData, p.name);
      const aVal = a ? Number(a.amount) || 0 : 0;
      const pVal = Number(p.amount) || 0;
      micro.spending.push({ name: p.name, plan: pVal, actual: aVal, delta: pVal - aVal, isGood: aVal <= pVal });
    });

    // Assets (Actual > Predicted = Good)
    (projections.projectedAssets || []).forEach(p => {
      const a = findMatch(actual.assetData, p.name);
      const aVal = a ? Number(a.balance) || 0 : 0;
      const pVal = Number(p.projectedEOY) || 0;
      micro.assets.push({ name: p.name, plan: pVal, actual: aVal, delta: aVal - pVal, isGood: aVal >= pVal });
    });

    // Debts (Actual < Predicted = Good)
    (projections.projectedDebts || []).forEach(p => {
      const a = findMatch(actual.debtData, p.name);
      const aVal = a ? Number(a.balance) || 0 : 0;
      const pVal = Number(p.projectedEOY) || 0;
      micro.debts.push({ name: p.name, plan: pVal, actual: aVal, delta: pVal - aVal, isGood: aVal <= pVal });
    });

    // Sort all micro arrays so the biggest "Misses" (Reds) float to the top for visibility
    Object.keys(micro).forEach(key => micro[key].sort((a, b) => a.delta - b.delta));

    return { 
      macro: { planIncome, actualIncome, incomeDelta, planSpending, actualSpending, spendingDelta, planNW, actualNW, nwDelta }, 
      micro 
    };
  }, [selectedYear, snapshots]);

  if (closedYears.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-4 text-center text-slate-500">
        No closed years available. Close out a year to unlock the Variance Report.
      </div>
    );
  }

  if (!report) return null;

  // Helper for rendering Micro rows
  const renderRow = (item, idx) => (
    <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <span className="font-semibold text-slate-700 w-1/3 truncate pr-2">{item.name}</span>
      <span className="text-slate-400 text-sm w-1/4 text-right pr-4">{money.format(item.plan)}</span>
      <span className="text-slate-800 font-bold text-sm w-1/4 text-right pr-4">{money.format(item.actual)}</span>
      <span className={`text-sm font-black w-1/4 text-right ${item.isGood ? 'text-emerald-500' : 'text-red-500'}`}>
        {item.delta > 0 ? '+' : ''}{money.format(item.delta)}
      </span>
    </div>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mt-4 animate-fade-in">
      
      {/* HEADER & SELECTOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Variance Analysis</h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Plan vs. Actuals Scorecard</p>
        </div>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 font-black text-lg py-2 px-4 rounded-xl focus:ring-indigo-500 cursor-pointer shadow-sm"
        >
          {closedYears.map(y => <option key={y} value={y}>{y} Execution</option>)}
        </select>
      </div>

      {/* MACRO SCORECARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Income Card */}
        <div className={`p-5 rounded-2xl border ${report.macro.incomeDelta >= 0 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">Income Accuracy</p>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-bold text-slate-400">Plan</span>
            <span className="text-sm font-bold text-slate-400">{money.format(report.macro.planIncome)}</span>
          </div>
          <div className="flex justify-between items-end mb-3 pb-3 border-b border-white/50">
            <span className="text-base font-black text-slate-800">Actual</span>
            <span className="text-lg font-black text-slate-800">{money.format(report.macro.actualIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-bold ${report.macro.incomeDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Variance</span>
            <span className={`text-lg font-black ${report.macro.incomeDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {report.macro.incomeDelta > 0 ? '+' : ''}{money.format(report.macro.incomeDelta)}
            </span>
          </div>
        </div>

        {/* Spending Card */}
        <div className={`p-5 rounded-2xl border ${report.macro.spendingDelta >= 0 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">Spending Discipline</p>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-bold text-slate-400">Plan</span>
            <span className="text-sm font-bold text-slate-400">{money.format(report.macro.planSpending)}</span>
          </div>
          <div className="flex justify-between items-end mb-3 pb-3 border-b border-white/50">
            <span className="text-base font-black text-slate-800">Actual</span>
            <span className="text-lg font-black text-slate-800">{money.format(report.macro.actualSpending)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-bold ${report.macro.spendingDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Variance</span>
            <span className={`text-lg font-black ${report.macro.spendingDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {report.macro.spendingDelta > 0 ? '+' : ''}{money.format(report.macro.spendingDelta)}
            </span>
          </div>
        </div>

        {/* Net Worth Card */}
        <div className={`p-5 rounded-2xl border ${report.macro.nwDelta >= 0 ? 'bg-indigo-50/50 border-indigo-100' : 'bg-red-50/50 border-red-100'}`}>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">Net Worth Velocity</p>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-bold text-slate-400">Plan</span>
            <span className="text-sm font-bold text-slate-400">{money.format(report.macro.planNW)}</span>
          </div>
          <div className="flex justify-between items-end mb-3 pb-3 border-b border-white/50">
            <span className="text-base font-black text-slate-800">Actual</span>
            <span className="text-lg font-black text-slate-800">{money.format(report.macro.actualNW)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-bold ${report.macro.nwDelta >= 0 ? 'text-indigo-700' : 'text-red-700'}`}>Variance</span>
            <span className={`text-lg font-black ${report.macro.nwDelta >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {report.macro.nwDelta > 0 ? '+' : ''}{money.format(report.macro.nwDelta)}
            </span>
          </div>
        </div>
      </div>

      {/* MICRO BREAKDOWN */}
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Line-by-Line Breakdown</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        
        {/* Left Column (Cashflow) */}
        <div>
          <div className="mb-6">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 bg-slate-100 px-3 py-1 rounded-md inline-block">Income</h5>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 px-3 py-2 border-b-2 border-slate-200">
              <span className="w-1/3">Source</span><span className="w-1/4 text-right pr-4">Plan</span><span className="w-1/4 text-right pr-4">Actual</span><span className="w-1/4 text-right">Delta</span>
            </div>
            {report.micro.income.map(renderRow)}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 bg-slate-100 px-3 py-1 rounded-md inline-block">Spending</h5>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 px-3 py-2 border-b-2 border-slate-200">
              <span className="w-1/3">Category</span><span className="w-1/4 text-right pr-4">Plan</span><span className="w-1/4 text-right pr-4">Actual</span><span className="w-1/4 text-right">Delta</span>
            </div>
            {report.micro.spending.map(renderRow)}
          </div>
        </div>

        {/* Right Column (Balance Sheet) */}
        <div>
          <div className="mb-6">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 bg-slate-100 px-3 py-1 rounded-md inline-block">Assets (EOY)</h5>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 px-3 py-2 border-b-2 border-slate-200">
              <span className="w-1/3">Account</span><span className="w-1/4 text-right pr-4">Predicted</span><span className="w-1/4 text-right pr-4">Actual</span><span className="w-1/4 text-right">Delta</span>
            </div>
            {report.micro.assets.map(renderRow)}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 bg-slate-100 px-3 py-1 rounded-md inline-block">Debts (EOY)</h5>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 px-3 py-2 border-b-2 border-slate-200">
              <span className="w-1/3">Liability</span><span className="w-1/4 text-right pr-4">Predicted</span><span className="w-1/4 text-right pr-4">Actual</span><span className="w-1/4 text-right">Delta</span>
            </div>
            {report.micro.debts.map(renderRow)}
          </div>
        </div>

      </div>
    </div>
  );
}

export default VarianceReport;