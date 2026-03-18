import React from 'react';
import { calculateProjections } from '../utils/projectionEngine'; // Adjust path if needed

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function ExecutionScorecard({ snapshots }) {
  const years = Object.keys(snapshots || {}).sort();

  // We need at least 2 years to compare a projection to a reality
  if (years.length < 2) {
    return null; 
  }

  const scorecards = [];

  // Loop through years and compare Plan vs Actuals for the SAME year
  for (const year of years) {
    const snap = snapshots[year];

    // SKIP if the year is still "open" (no actuals to compare yet)
    if (!snap?.actuals || snap?.status === 'open') continue;

    const planData = snap.plan;
    const actualData = snap.actuals;

    // 1. Calculate Planned Net Worth (using the new .plan path)
    const planTotals = {
      totalNetIncome: planData.incomeData?.reduce((acc, i) => acc + (Number(i.gross) || 0), 0) * 0.75 || 0,
      totalSpending: planData.spendingData?.reduce((acc, s) => acc + (Number(s.amount) || 0), 0) || 0,
      totalContributionsAmount: planData.assetContributions?.reduce((acc, c) => acc + (Number(c.amount) || 0), 0) || 0
    };
    
    // We use the engine to see what we THOUGHT would happen
    const projected = calculateProjections({ ...planData, ...planTotals }).projectedNetWorth;

    // 2. Calculate what ACTUALLY happened (using the new .actuals path)
    const actualAssets = actualData.assetData?.reduce((acc, a) => acc + (Number(a.balance) || 0), 0) || 0;
    const actualDebts = actualData.debtData?.reduce((acc, d) => acc + (Number(d.balance) || 0), 0) || 0;
    const actual = actualAssets - actualDebts;

    // 3. The Delta
    const delta = actual - projected;
    const percentBeat = projected > 0 ? (delta / projected) * 100 : 0;

    scorecards.push({ planYear: year, projected, actual, delta, percentBeat });
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">Execution Scorecard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scorecards.map((score, idx) => {
          const isBeat = score.delta >= 0;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              {/* Decorative side border */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isBeat ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {score.planYear} Performance
              </p>
              
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Planned Net Worth</p>
                  <p className="text-lg font-bold text-slate-700">{money.format(score.projected)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold mb-1">EOY Net Worth</p>
                  <p className="text-xl font-black text-slate-900">{money.format(score.actual)}</p>
                </div>
              </div>

              <div className={`mt-4 pt-4 border-t ${isBeat ? 'border-emerald-100' : 'border-red-100'} flex justify-between items-center`}>
                <span className={`text-sm font-bold ${isBeat ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isBeat ? '🎯 Beat Plan by:' : '⚠️ Missed Plan by:'}
                </span>
                <span className={`text-lg font-black ${isBeat ? 'text-emerald-600' : 'text-red-600'}`}>
                  {score.delta > 0 ? '+' : ''}{money.format(score.delta)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExecutionScorecard;