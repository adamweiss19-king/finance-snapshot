import React from 'react';
import { APP_THEME } from '../../utils/theme';

function BaseAccountRow({ 
  item, 
  type, // 'asset' or 'debt'
  isClosingOut, 
  contributions = [], 
  planSnapshot = [], 
  onUpdate, 
  onRemove,
  isLocked
}) {
  const theme = APP_THEME[type];
  const isAsset = type === 'asset';


  // --- REVIEW MODE: TARGET MATH ---
  let initialAmount = 0;
  let plannedTarget = 0;

  if (isClosingOut) {
    const originalItem = planSnapshot?.find(i => i.id === item.id);
    initialAmount = originalItem ? Number(originalItem.balance) : 0;
    
    // Growth for Assets, Interest for Debts
    const rateProp = isAsset ? 'growth' : 'interestRate';
    const rate = originalItem ? Number(originalItem[rateProp]) : Number(item[rateProp]);
    const compoundingAmount = initialAmount * (rate / 100);
    
    // Find all cash flow linked to this specific account
    const linkedCashFlow = contributions
      .filter(c => String(c.linkedId) === String(item.id))
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    
    // The Branching Math!
    if (isAsset) {
      plannedTarget = initialAmount + compoundingAmount + linkedCashFlow;
    } else {
      // Debts go down, and can't go below $0
      plannedTarget = Math.max(0, initialAmount + compoundingAmount - linkedCashFlow);
    }
  }

  return (
    <div className={`p-4 rounded-2xl border transition-all relative group shadow-sm ${isLocked ? 'opacity-80' : 'hover:shadow-md'} ${isClosingOut ? `${theme.borderHighlight} shadow-md ring-1 ring-${theme.bgHighlight.replace('bg-', '')}` : `${theme.bg} ${theme.border}`}`}>
      
      {isClosingOut ? (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className={`text-lg font-bold ${theme.text}`}>{item.name || "Unnamed Account"}</span>
            <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${theme.badge}`}>Review</span>
          </div>
          
          <div className="flex justify-between items-end gap-2">
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Start (Jan 1)</span>
                <span className="text-sm font-semibold text-slate-600">${initialAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${theme.textHighlight.replace('text-', 'text-opacity-60 text-')}`}>{theme.actionText}</span>
                <span className={`text-sm font-bold ${theme.textHighlight}`}>${Math.round(plannedTarget).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className={`text-[10px] uppercase tracking-widest font-black mb-1 ${theme.textHighlight}`}>Actual (Dec 31)</span>
              <div className={`flex items-center justify-end text-right px-2 py-1 rounded-lg border ${theme.bgHighlight} ${theme.borderHighlight}`}>
                <span className={`text-sm font-black mr-0.5 ${theme.textHighlight}`}>$</span>
                <input type="text" inputMode='decimal' value={item.balance === 0 ? '' : item.balance.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder={Math.round(plannedTarget).toString()} className={`text-lg font-black border-none p-0 focus:ring-0 text-right bg-transparent w-24 ${theme.textHighlight}`} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
            <div className="flex items-center gap-2 w-full">
              <input type="text" inputMode='decimal' disabled={isLocked} value={item.name} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder={isAsset ? "e.g. Chase Savings" : "e.g. Car Loan"} className={`text-lg font-bold border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300 disabled:cursor-not-allowed ${theme.text}`} />
              {item.balance === 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter shrink-0 ${theme.badge}`}>New</span>}
            </div>
            
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center justify-end text-right">
                <span className={`text-lg font-black mr-0.5 ${theme.textHighlight}`}>$</span>
                <input type="text" inputMode='decimal' disabled={isLocked} value={item.balance === 0 ? '' : item.balance.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, 'balance', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder="0" style={{ width: `${item.balance ? item.balance.toLocaleString('en-US').length + 0.5 : 2}ch` }} className={`text-xl font-black border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200 disabled:cursor-not-allowed ${theme.textHighlight}`} />
              </div>
              <span className={`text-[9px] uppercase tracking-widest font-bold mr-1 ${theme.textHighlight.replace('text-', 'text-opacity-50 text-')}`}>Starting Balance</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            {isAsset ? (
              <div className="flex items-center gap-2 flex-1">
                <select value={item.bucket || 'Cash'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'bucket', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-bold text-slate-600 focus:ring-0 cursor-pointer shadow-sm truncate max-w-[120px] disabled:cursor-not-allowed">
                  <option value="Cash">Cash</option>
                  <option value="Investment (Non-Retirement)">Investment</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other Asset">Other Asset</option>
                </select>
                <input type="text" disabled={isLocked} value={item.category || ''} onChange={(e) => onUpdate(item.id, 'category', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-medium text-slate-600 focus:ring-0 w-24 shadow-sm disabled:cursor-not-allowed" placeholder="e.g. 401k, Auto" />
              </div>
            ) : ( <div></div> )}

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-semibold text-gray-400">{theme.rateLabel}</span>
              <div className="flex items-center gap-1">
                <input type="number" inputMode='decimal' disabled={isLocked} value={item[isAsset ? 'growth' : 'interestRate'] === 0 ? '' : item[isAsset ? 'growth' : 'interestRate']} onChange={(e) => onUpdate(item.id, isAsset ? 'growth' : 'interestRate', parseFloat(e.target.value) || 0)} className="w-16 text-right bg-slate-50 border border-slate-200 rounded p-1 text-xs text-slate-700 font-bold focus:ring-0 disabled:cursor-not-allowed" placeholder="0" />
                <span className="font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!isClosingOut && !isLocked && (
        <button onClick={() => onRemove(item.id)} className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">✕</button>
      )}
    </div>
  );
}

export default BaseAccountRow;