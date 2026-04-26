import React from 'react';
import { APP_THEME } from '../../utils/theme';

function BaseAccountRow({ 
  item, type, isClosingOut, contributions = [], planSnapshot = [], onUpdate, onRemove, isLocked, predictedBalance 
}) {
  const theme = APP_THEME[type];
  const isAsset = type === 'asset';

  let initialAmount = 0;
  let plannedTarget = 0;

  if (isClosingOut) {
    const originalItem = planSnapshot?.find(i => i.id === item.id);
    initialAmount = originalItem ? Number(originalItem.balance) : 0;
    const rateProp = isAsset ? 'growth' : 'interestRate';
    const rate = originalItem ? Number(originalItem[rateProp]) : Number(item[rateProp]);
    const compoundingAmount = initialAmount * (rate / 100);
    const linkedCashFlow = contributions.filter(c => String(c.linkedId) === String(item.id)).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    if (isAsset) plannedTarget = initialAmount + compoundingAmount + linkedCashFlow;
    else plannedTarget = Math.max(0, initialAmount + compoundingAmount - linkedCashFlow);
  }

  const isUnchanged = isClosingOut && item.balance === initialAmount;
  const displayPrediction = predictedBalance !== undefined && predictedBalance !== null ? predictedBalance : plannedTarget;

  return (
    <div className={`rounded-xl border transition-all relative group shadow-sm flex flex-col bg-white overflow-hidden ${isLocked ? 'opacity-80' : 'hover:shadow-md'} ${isClosingOut ? (isUnchanged && !isLocked ? 'border-amber-300 ring-1 ring-amber-300/50' : `${theme.borderHighlight} ring-1 ring-${theme.bgHighlight.replace('bg-', '')}`) : `${theme.border}`}`}>
      
      {isClosingOut ? (
        <div className="p-3 flex flex-col gap-3">
          <div className="flex justify-between items-start border-b border-gray-50 pb-2 gap-2">
            <span className={`text-lg font-bold truncate w-full ${theme.text}`}>{item.name || "Unnamed Account"}</span>
            <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider shrink-0 ${isUnchanged && !isLocked ? 'bg-amber-100 text-amber-700' : theme.badge}`}>
              {isUnchanged && !isLocked ? 'Needs Update' : 'Review'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Start (Jan 1)</span>
              <span className="text-sm font-semibold text-slate-600">${initialAmount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] uppercase tracking-widest font-bold mb-0.5 ${theme.textHighlight.replace('text-', 'text-opacity-60 text-')}`}>{theme.actionText}</span>
              <span className={`text-sm font-bold ${theme.textHighlight}`}>${Math.round(plannedTarget).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col bg-slate-50 p-2.5 rounded-lg border border-slate-100 relative">
            <span className={`text-[9px] uppercase tracking-widest font-black mb-1 ${isUnchanged && !isLocked ? 'text-amber-500' : theme.textHighlight}`}>Actual (Dec 31)</span>
            {isUnchanged && !isLocked && <span className="absolute right-2 top-2 text-amber-500 text-xs animate-pulse" title="Needs Update">🔴</span>}
            <div className="flex items-center">
              <span className={`text-lg font-black mr-1 ${isUnchanged && !isLocked ? 'text-amber-500' : theme.textHighlight}`}>$</span>
              <input type="text" inputMode='decimal' disabled={isLocked} value={isUnchanged ? '' : item.balance.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder={Math.round(displayPrediction).toLocaleString('en-US')} className={`text-xl font-black w-full border-none p-0 focus:ring-0 bg-transparent placeholder-opacity-60 disabled:opacity-100 ${isUnchanged && !isLocked ? 'text-amber-800 placeholder-amber-600/70' : theme.textHighlight}`} />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 flex flex-col gap-3">
          
          {/* HEADER: Title & Delete Button Stacked */}
          <div className="flex justify-between items-start gap-2">
            <input type="text" disabled={isLocked} value={item.name} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder={isAsset ? "e.g. Chase Savings" : "e.g. Car Loan"} className={`text-lg font-bold border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300 disabled:cursor-not-allowed truncate ${theme.text}`} />
            {!isLocked && (
              <button onClick={() => onRemove(item.id)} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors z-10 text-xs font-bold">✕</button>
            )}
          </div>
          
          {/* AMOUNT: Massive & Readable */}
          <div className="flex flex-col">
            <span className={`text-[9px] uppercase tracking-widest font-bold mb-0.5 ${theme.textHighlight.replace('text-', 'text-opacity-50 text-')}`}>Starting Balance</span>
            <div className="flex items-center">
              <span className={`text-xl font-black mr-1 ${theme.textHighlight}`}>$</span>
              <input type="text" inputMode='decimal' disabled={isLocked} value={item.balance === 0 ? '' : item.balance.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder="0" className={`text-2xl font-black w-full border-none p-0 focus:ring-0 bg-transparent placeholder-gray-200 disabled:cursor-not-allowed ${theme.textHighlight}`} />
            </div>
          </div>

          {/* UTILITY FOOTER: Stacked Controls */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col gap-2 mt-1">
            {isAsset && (
              <select value={item.category || ''} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'category', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 focus:ring-0 shadow-sm disabled:cursor-not-allowed truncate">
                <option value="" disabled>Select Asset Type</option>
                <option value="Bank Account/Savings">Bank Account / Cash</option>
                <option value="401k">401(k) / 403(b)</option>
                <option value="IRA">Traditional IRA</option>
                <option value="Roth IRA">Roth IRA</option>
                <option value="HSA">HSA</option>
                <option value="FSA">FSA</option>
                <option value="Brokerage Account">Standard Brokerage</option>
                <option value="Other Asset">Other Asset</option>
                {['Primary Residence', 'Investment Property', 'Vacation Home'].includes(item.category) && (
                  <><option disabled>──────────</option><option value="Primary Residence">Primary Residence</option><option value="Investment Property">Investment Property</option><option value="Vacation Home">Vacation Home</option></>
                )}
              </select>
            )}

            <div className={`flex justify-between items-center w-full ${!isAsset && 'mt-1'}`}>
              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-500">{theme.rateLabel}</span>
              <div className="flex items-center gap-1">
                <input type="number" inputMode='decimal' disabled={isLocked} value={item[isAsset ? 'growth' : 'interestRate'] === 0 ? '' : item[isAsset ? 'growth' : 'interestRate']} onChange={(e) => onUpdate(item.id, isAsset ? 'growth' : 'interestRate', parseFloat(e.target.value) || 0)} className="w-16 text-right bg-white border border-slate-200 rounded p-1 text-xs text-slate-700 font-bold shadow-sm focus:ring-0 disabled:cursor-not-allowed" placeholder="0" />
                <span className="font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default BaseAccountRow;