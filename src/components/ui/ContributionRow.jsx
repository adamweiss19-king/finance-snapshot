import React from 'react';
import { APP_THEME } from '../../utils/theme';
import Tooltip from './Tooltip';

function ContributionRow({
  item,
  type, // 'asset' or 'debt'
  linkOptions = [], // The array of assets or debts to populate the dropdown
  onUpdate,
  onRemove,
  onCreateLinked,
  isLocked
}) {
  const theme = APP_THEME[type];
  const isAsset = type === 'asset';

  // --- DYNAMIC TEXT BASED ON TYPE ---
  const linkLabel = isAsset ? "Destination:" : "Target:";
  const linkPlaceholder = isAsset ? "✨ New / Unlinked Account" : "✨ New / Unlinked Debt";
  const tooltipMessage = isAsset
    ? "Link to an existing account or create a new one."
    : "Link this payment to a specific debt in your Foundation.";
  const createBtnText = isAsset
    ? "+ Create $0 Account in Foundation"
    : "+ Create $0 Debt in Foundation";
  const namePlaceholder = isAsset ? "e.g. Max 401k, Buy Index Funds" : "e.g. Extra Principal, Mortgage Min";

return (
    <div className={`p-4 rounded-2xl border transition-all relative group shadow-sm bg-white ${theme.border} ${isLocked ? 'opacity-80' : 'hover:shadow-md'}`}>
      <div className="flex justify-between items-start border-b border-gray-50 pb-3 mb-3 gap-2">
        <input type="text" value={item.name || ''} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder={namePlaceholder} className={`text-lg font-bold border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300 disabled:cursor-not-allowed ${theme.text}`} />
       <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center justify-end text-right">
            <span className={`text-lg font-black mr-0.5 ${theme.textHighlight}`}>$</span>
            <input type="text" inputMode='decimal' disabled={isLocked} value={item.amount === 0 ? '' : item.amount.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, 'amount', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder="0" style={{ width: `${item.amount ? item.amount.toLocaleString('en-US').length + 0.5 : 2}ch` }} className={`text-xl font-black border-none p-0 focus:ring-0 text-right bg-transparent placeholder-gray-200 disabled:cursor-not-allowed ${theme.textHighlight}`} />
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-bold mr-1 mt-1 ${theme.textHighlight.replace('text-', 'text-opacity-50 text-')}`}>Amount</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {!isAsset && (
          <select value={item.type || 'Mandatory'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'type', e.target.value)} className={`border-none rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed ${item.type === 'Mandatory' ? 'bg-slate-800 text-white' : 'bg-red-100 text-red-800'}`}>
            <option value="Mandatory">Mandatory</option>
            <option value="Discretionary">Discretionary</option>
          </select>
        )}
        <div className="flex flex-col gap-2 w-full mt-2 sm:mt-0 flex-1">
          <div className="flex items-center gap-2 w-full">
            <span className="font-bold text-gray-400 tracking-widest text-[10px] flex items-center shrink-0">{linkLabel}<Tooltip message={tooltipMessage} /></span>
            <select value={item.linkedId || 'new'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'linkedId', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer flex-1 truncate disabled:cursor-not-allowed">
              <option value="new">{linkPlaceholder}</option>
              {linkOptions.map(opt => ( <option key={opt.id} value={opt.id}>{opt.name || 'Unnamed'}</option> ))}
            </select>
          </div>
          {!isLocked && (!item.linkedId || item.linkedId === 'new') && (
            <button onClick={() => onCreateLinked(item.id, item.name)} className={`w-full text-[10px] uppercase tracking-widest font-black rounded-md transition-colors shadow-sm py-1.5 border hover:opacity-80 ${theme.textHighlight} ${theme.bgHighlight} ${theme.borderHighlight}`}>{createBtnText}</button>
          )}
        </div>
      </div>
      {!isLocked && (
        <button onClick={() => onRemove(item.id)} className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">✕</button>
      )}
    </div>
  );
}

export default ContributionRow;