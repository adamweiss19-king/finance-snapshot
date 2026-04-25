import React from 'react';
import Tooltip from './Tooltip';

const THEMES = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', textTitle: 'text-emerald-800', textValue: 'text-emerald-900', textSub: 'text-emerald-700', borderSub: 'border-emerald-200/50' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100', textTitle: 'text-orange-800', textValue: 'text-orange-900', textSub: 'text-orange-700', borderSub: 'border-orange-200/50' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-100', textTitle: 'text-sky-800', textValue: 'text-sky-900', textSub: 'text-sky-700', borderSub: 'border-sky-200/50' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-100', textTitle: 'text-rose-800', textValue: 'text-rose-900', textSub: 'text-rose-700', borderSub: 'border-rose-200/50' }
};

function SummaryCard({ title, amount, subtextLabel, subtextValue, themeColor, tooltip }) {
  const theme = THEMES[themeColor] || THEMES.emerald;

  return (
    <div className={`${theme.bg} rounded-2xl p-5 border ${theme.border}`}>
      <div className={`${theme.textTitle} text-xs font-bold uppercase tracking-wider mb-1 flex items-center`}>
        {title}
        {tooltip && <Tooltip message={tooltip} />}
      </div>
      <p className={`text-3xl font-black ${theme.textValue} mb-3`}>
        ${Math.round(amount).toLocaleString('en-US')}
      </p>
      <div className={`flex justify-between items-center text-xs border-t ${theme.borderSub} pt-2 mt-2`}>
        <span className={`${theme.textSub} font-semibold`}>{subtextLabel}:</span>
        <span className={`font-bold ${theme.textValue}`}>
          {subtextValue}
        </span>
      </div>
    </div>
  );
}

export default SummaryCard;