import React, { useState, useEffect, useMemo } from 'react';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function YearInReviewModal({ isOpen, year, snap, onStartNextYear, onClose }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (isOpen) setSlide(0);
  }, [isOpen]);
  
  const metrics = useMemo(() => {
    if (!snap || !snap.actuals || !snap.plan) return null;

    const plan = snap.plan;
    const actual = snap.actuals;

    const actualAssets = actual.assetData?.reduce((acc, a) => acc + (Number(a.balance) || 0), 0) || 0;
    const actualDebts = actual.debtData?.reduce((acc, d) => acc + (Number(d.balance) || 0), 0) || 0;
    const actualNW = actualAssets - actualDebts;
    const plannedNW = plan.projections?.projectedNetWorth || actualNW; 
    const nwVariance = actualNW - plannedNW;

    let candidates = [];
    const findMatch = (arr, name) => (arr || []).find(i => i.name === name);

    // --- THRESHOLD CONSTANTS ---
    const MIN_DOLLAR_WIN = 100;
    const MIN_PCT_WIN = 2; // 2% minimum variance to be considered a "win"

    // Income Wins
    (plan.incomeData || []).forEach(pItem => {
      const aItem = findMatch(actual.incomeData, pItem.name);
      if (aItem) {
        const pVal = Number(pItem.gross) || 0;
        const aVal = Number(aItem.gross) || 0;
        const delta = aVal - pVal;
        const pct = pVal > 0 ? (delta / pVal) * 100 : 100;
        if (delta >= MIN_DOLLAR_WIN && pct >= MIN_PCT_WIN) candidates.push({ name: `Extra Income (${pItem.name})`, delta, pct });
      }
    });

    // Spending Wins
    (plan.spendingData || []).forEach(pItem => {
      const aItem = findMatch(actual.spendingData, pItem.name);
      if (aItem) {
        const pVal = Number(pItem.amount) || 0;
        const aVal = Number(aItem.amount) || 0;
        const delta = pVal - aVal;
        const pct = pVal > 0 ? (delta / pVal) * 100 : 100;
        if (delta >= MIN_DOLLAR_WIN && pct >= MIN_PCT_WIN) candidates.push({ name: `Saved on ${pItem.name}`, delta, pct });
      }
    });

    // Debt Wins
    (plan.debtData || []).forEach(pItem => {
      const aItem = findMatch(actual.debtData, pItem.name);
      if (aItem) {
        const pVal = Number(pItem.balance) || 0;
        const aVal = Number(aItem.balance) || 0;
        const delta = pVal - aVal;
        const pct = pVal > 0 ? (delta / pVal) * 100 : 100;
        if (delta >= MIN_DOLLAR_WIN && pct >= MIN_PCT_WIN) candidates.push({ name: `Extra Debt Paydown (${pItem.name})`, delta, pct });
      }
    });

    candidates.sort((a, b) => b.delta - a.delta);
    const topDollarWin = candidates.length > 0 ? candidates[0] : null;

    const remaining = candidates.filter(c => c.name !== topDollarWin?.name);
    remaining.sort((a, b) => b.pct - a.pct);
    const topPctWins = remaining.slice(0, 2);

    return { actualNW, plannedNW, nwVariance, topDollarWin, topPctWins };
  }, [snap]);

  if (!isOpen || !metrics) return null;

  const handleNext = () => {
    if (slide < 2) setSlide(slide + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="flex gap-1 p-4 pb-0">
          {[0, 1, 2].map(step => (
            <div key={step} className={`h-1.5 flex-1 rounded-full ${step <= slide ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="p-8 pt-6 min-h-[350px] flex flex-col justify-center">
          {slide === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">{year} Wrapped</h2>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-6">The Reality Check.</h3>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plan</p>
                  <p className="text-xl font-bold text-slate-400">{money.format(metrics.plannedNW)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Actual</p>
                  <p className="text-3xl font-black text-indigo-600">{money.format(metrics.actualNW)}</p>
                </div>
              </div>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                {metrics.nwVariance >= 0 
                  ? `You beat your net worth target by ${money.format(metrics.nwVariance)}. Incredible execution.` 
                  : `You landed ${money.format(Math.abs(metrics.nwVariance))} short of your target. Wealth building isn't perfectly linear, and life doesn't always go to plan. A financial plan is a compass, not a crystal ball.`}
              </p>
            </div>
          )}

          {slide === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Execution</h2>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-6">Your Biggest Wins.</h3>
              <div className="space-y-3">
                {metrics.topDollarWin ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-emerald-900">{metrics.topDollarWin.name}</span>
                    <span className="font-black text-emerald-600 text-lg">+{money.format(metrics.topDollarWin.delta)}</span>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 font-bold bg-slate-50 rounded-xl">Executed exactly as planned! No major positive variances.</div>
                )}
                {metrics.topPctWins.map((win, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-blue-900">{win.name}</span>
                    <span className="font-black text-blue-600 text-lg">+{win.pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide === 2 && (
            <div className="animate-fade-in text-center">
              <div className="text-6xl mb-6">🔮</div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">Time to build the blueprint.</h3>
              <p className="text-slate-500 font-medium mb-8">Your actuals are locked in the vault. Let's take today's momentum and project it into next year.</p>
              <button onClick={() => { onClose(); onStartNextYear(); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all">➡️ Start {parseInt(year) + 1} Plan</button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600">Close</button>
          {slide < 2 && <button onClick={handleNext} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors">Next &rarr;</button>}
        </div>
      </div>
    </div>
  );
}

export default YearInReviewModal;