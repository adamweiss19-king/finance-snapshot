import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

function Tooltip({ message }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  // When we hover, we calculate the exact (X, Y) pixel coordinates of the ? icon on the screen
  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2, // Horizontal center of the icon
        top: rect.top - 8                 // 8px above the top of the icon
      });
      setIsVisible(true);
    }
  };

  return (
    <div 
      className="relative flex items-center ml-1.5 cursor-help"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
      ref={iconRef}
    >
      {/* The visible "?" icon that lives normally inside your layout */}
      <span className="bg-slate-200 text-slate-500 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black hover:bg-slate-300 transition-colors">
        ?
      </span>

      {/* The Portal: This physically injects the tooltip HTML at the very bottom 
        of your webpage (document.body), bypassing all overflow containers! 
      */}
      {isVisible && createPortal(
        <div 
          style={{ top: coords.top, left: coords.left }}
          className="fixed -translate-x-1/2 -translate-y-full w-max max-w-[250px] bg-slate-800 text-white text-xs font-medium p-2.5 rounded-lg shadow-xl z-[9999] text-center pointer-events-none"
        >
          {message}
          {/* The little triangle pointer pointing down at the icon */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45"></div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Tooltip;