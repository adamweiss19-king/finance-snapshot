import React from 'react';

function Tooltip({ message }) {
  return (
    <div className="group relative flex items-center justify-center ml-1.5 cursor-help">
      {/* The visible (?) icon */}
      <span className="text-slate-400 hover:text-indigo-500 transition-colors bg-slate-100 border border-slate-200 rounded-full w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold shadow-sm">
        ?
      </span>
      
      {/* The hidden pop-up box */}
      <div className="absolute bottom-full mb-2 w-48 p-2.5 bg-slate-800 text-slate-100 text-[10px] font-medium tracking-wide leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center pointer-events-none">
        {message}
        {/* The little downward triangle */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
      </div>
    </div>
  );
}

export default Tooltip;