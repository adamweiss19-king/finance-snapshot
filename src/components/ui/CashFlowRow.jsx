import React from 'react';
import { APP_THEME } from '../../utils/theme';

function CashFlowRow({ item, type, onUpdate, onRemove, isLocked }) {
  const theme = APP_THEME[type] || APP_THEME.spending;
  const isIncome = type === 'income';
  const valueField = isIncome ? 'gross' : 'amount';
  const currentValue = item[valueField] || 0;

  return (
    <div className={`rounded-xl border transition-all relative group shadow-sm flex flex-col bg-white overflow-hidden p-3 ${isLocked ? 'opacity-80' : 'hover:shadow-md'} ${theme.border}`}>
      
      {/* HEADER: Title & Delete Button Stacked */}
      <div className="flex justify-between items-start gap-2">
        <input type="text" value={item.name || ''} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder={isIncome ? "e.g. Day Job" : "e.g. Rent"} className={`text-lg font-bold border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300 disabled:cursor-not-allowed truncate ${theme.text}`} />
        {!isLocked && (
          <button onClick={() => onRemove(item.id)} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors z-10 text-xs font-bold">✕</button>
        )}
      </div>
      
      {/* AMOUNT: Massive & Readable */}
      <div className="flex flex-col mt-3">
        <span className={`text-[9px] uppercase tracking-widest font-bold mb-0.5 ${theme.textHighlight.replace('text-', 'text-opacity-50 text-')}`}>{isIncome ? 'Gross Annual' : 'Annual Amount'}</span>
        <div className="flex items-center">
          <span className={`text-xl font-black mr-1 ${theme.textHighlight}`}>$</span>
          <input type="text" inputMode='decimal' disabled={isLocked} value={currentValue === 0 ? '' : currentValue.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, valueField, cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder="0" className={`text-2xl font-black w-full border-none p-0 focus:ring-0 bg-transparent placeholder-gray-200 disabled:cursor-not-allowed ${theme.textHighlight}`} />
        </div>
      </div>

      {/* UTILITY FOOTER: Stacked Controls */}
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col gap-2 mt-4">
        {isIncome ? (
          <>
            <select value={item.type || 'W-2 Salary'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'type', e.target.value)} className="w-full bg-white border border-slate-200 text-slate-600 rounded p-1.5 text-[10px] font-bold uppercase tracking-wider focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed truncate">
              <option value="W-2 Salary">W-2 Salary</option>
              <option value="W-2 Bonus">W-2 Bonus</option>
              <option value="Self-Employment (1099)">1099 / Business</option>
              <option value="Passive (Interest/Dividends)">Passive</option>
              <option value="Short Term Capital Gains">Short Term Cap Gains</option>
              <option value="Long Term Capital Gains">Long Term Cap Gains</option>
              <option value="Other">Other</option>
              <option value="Windfall">Windfall / One-Time</option>
            </select>
            
            <select value={item.isTaxable === false ? 'false' : 'true'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'isTaxable', e.target.value === 'true')} className="w-full bg-white border border-slate-200 text-slate-600 rounded p-1.5 text-[10px] font-bold uppercase tracking-wider focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed">
              <option value="true">Taxable</option>
              <option value="false">Untaxable</option>
            </select>
          </>
        ) : (
          <select value={item.type || 'Mandatory'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'type', e.target.value)} className={`w-full border-none rounded p-1.5 text-[10px] font-bold tracking-wide uppercase focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed ${item.type === 'Mandatory' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <option value="Mandatory">Mandatory</option>
            <option value="Discretionary">Discretionary</option>
          </select>
        )}
      </div>

    </div>
  );
}

export default CashFlowRow;