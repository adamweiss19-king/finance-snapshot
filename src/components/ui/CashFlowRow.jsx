import React from 'react';
import { APP_THEME } from '../../utils/theme';

function CashFlowRow({
  item,
  type, // 'income' or 'spending'
  onUpdate,
  onRemove,
  isLocked
}) {
  const theme = APP_THEME[type] || APP_THEME.spending;
  const isIncome = type === 'income';
  
  // Smart mapping: Income uses 'gross', Spending uses 'amount'
  const valueField = isIncome ? 'gross' : 'amount';
  const currentValue = item[valueField] || 0;

 return (
    <div className={`p-4 rounded-2xl border transition-all relative group shadow-sm bg-white ${theme.border} ${isLocked ? 'opacity-80' : 'hover:shadow-md'}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-2 w-full">
          <input type="text" value={item.name || ''} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder={isIncome ? "e.g. Day Job" : "e.g. Rent"} className={`text-lg font-bold border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300 disabled:cursor-not-allowed ${theme.text}`} />
          <div className="flex items-center gap-2">
            {isIncome ? (
              <select value={item.isTaxable === false ? 'false' : 'true'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'isTaxable', e.target.value === 'true')} className="bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed">
                <option value="true">Taxable</option>
                <option value="false">Untaxable</option>
              </select>
            ) : (
              <select value={item.type || 'Mandatory'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'type', e.target.value)} className={`border-none rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed ${item.type === 'Mandatory' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <option value="Mandatory">Mandatory</option>
                <option value="Discretionary">Discretionary</option>
              </select>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center justify-end text-right">
            <span className={`text-lg font-black mr-0.5 ${theme.textHighlight}`}>$</span>
            <input type="text" disabled={isLocked} value={currentValue === 0 ? '' : currentValue.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, valueField, cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder="0" style={{ width: `${currentValue ? currentValue.toLocaleString('en-US').length + 0.5 : 2}ch` }} className={`text-xl font-black border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200 disabled:cursor-not-allowed ${theme.textHighlight}`} />
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-bold mr-1 mt-1 ${theme.textHighlight.replace('text-', 'text-opacity-50 text-')}`}>{isIncome ? 'Gross Annual' : 'Annual Amount'}</span>
        </div>
      </div>
      {!isLocked && (
        <button onClick={() => onRemove(item.id)} className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">✕</button>
      )}
    </div>
  );
}

export default CashFlowRow;