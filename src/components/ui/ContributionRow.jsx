import React from 'react';
import { APP_THEME } from '../../utils/theme';
import Tooltip from './Tooltip';

function ContributionRow({ item, type, linkOptions = [], onUpdate, onRemove, onCreateLinked, isLocked }) {
  const theme = APP_THEME[type];
  const isAsset = type === 'asset';
  const linkLabel = isAsset ? "Destination" : "Target";
  const linkPlaceholder = isAsset ? "✨ New / Unlinked Account" : "✨ New / Unlinked Debt";
  const tooltipMessage = isAsset ? "Link to an existing account or create a new one." : "Link this payment to a specific debt in your Foundation.";
  const createBtnText = isAsset ? "+ Create $0 Account in Foundation" : "+ Create $0 Debt in Foundation";
  const namePlaceholder = isAsset ? "e.g. Max 401k, Buy Index Funds" : "e.g. Extra Principal";

  return (
    <div className={`rounded-xl border transition-all relative group shadow-sm flex flex-col bg-white overflow-hidden p-3 ${isLocked ? 'opacity-80' : 'hover:shadow-md'} ${theme.border}`}>
      
      {/* HEADER: Title & Delete Button Stacked */}
      <div className="flex justify-between items-start gap-2">
        <input type="text" value={item.name || ''} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder={namePlaceholder} className={`text-lg font-bold border-none p-0 focus:ring-0 w-full bg-transparent placeholder-gray-300 disabled:cursor-not-allowed truncate ${theme.text}`} />
        {!isLocked && (
          <button onClick={() => onRemove(item.id)} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors z-10 text-xs font-bold">✕</button>
        )}
      </div>

      {/* AMOUNT: Massive & Readable */}
      <div className="flex flex-col mt-3">
        <span className={`text-[9px] uppercase tracking-widest font-bold mb-0.5 ${theme.textHighlight.replace('text-', 'text-opacity-50 text-')}`}>Amount</span>
        <div className="flex items-center">
          <span className={`text-xl font-black mr-1 ${theme.textHighlight}`}>$</span>
          <input type="text" inputMode='decimal' disabled={isLocked} value={item.amount === 0 ? '' : item.amount.toLocaleString('en-US')} onChange={(e) => { const cleanValue = e.target.value.replace(/,/g, ''); onUpdate(item.id, 'amount', cleanValue === '' ? 0 : parseFloat(cleanValue) || 0); }} placeholder="0" className={`text-2xl font-black w-full border-none p-0 focus:ring-0 bg-transparent placeholder-gray-200 disabled:cursor-not-allowed ${theme.textHighlight}`} />
        </div>
      </div>

      {/* UTILITY FOOTER: Stacked Controls */}
      <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex flex-col gap-2 mt-4">
        
        {!isAsset && (
          <select value={item.type || 'Mandatory'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'type', e.target.value)} className={`w-full border-none rounded p-1.5 text-[10px] font-bold tracking-wide uppercase focus:ring-0 cursor-pointer shadow-sm disabled:cursor-not-allowed ${item.type === 'Mandatory' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <option value="Mandatory">Mandatory</option>
            <option value="Discretionary">Discretionary</option>
          </select>
        )}
        
        <div className="flex flex-col gap-1 w-full">
          <span className="font-bold text-gray-400 tracking-widest text-[9px] uppercase flex items-center gap-1.5">
            {linkLabel} <Tooltip message={tooltipMessage} />
          </span>
          <select value={item.linkedId || 'new'} disabled={isLocked} onChange={(e) => onUpdate(item.id, 'linkedId', e.target.value)} className="bg-white border border-slate-200 rounded p-1.5 text-[10px] font-bold text-slate-600 focus:ring-0 cursor-pointer w-full truncate disabled:cursor-not-allowed shadow-sm">
            <option value="new">{linkPlaceholder}</option>
            {linkOptions.map(opt => ( <option key={opt.id} value={opt.id}>{opt.name || 'Unnamed'}</option> ))}
          </select>
        </div>

        {/* Create Link Button */}
        {!isLocked && (!item.linkedId || item.linkedId === 'new') && (
          <button onClick={() => onCreateLinked(item.id, item.name)} className={`w-full text-[10px] uppercase tracking-widest font-black rounded transition-colors shadow-sm py-1.5 border hover:opacity-80 bg-white mt-1 ${theme.textHighlight} ${theme.borderHighlight}`}>{createBtnText}</button>
        )}
      </div>

    </div>
  );
}

export default ContributionRow;