import React from 'react';

function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 relative overflow-hidden">
        {/* Decorative header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2 mt-2">Welcome to your <br/><span className="text-indigo-600">Financial Snapshot</span></h2>
        <p className="text-slate-500 font-medium mb-8">This is no budget tracker. It's a forward-looking wealth engine built with a simple 3-step philosophy to make a robust plan for your income.</p>
        
        <div className="space-y-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg">1</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">The Foundation (Jan 1st)</h3>
              <p className="text-sm text-slate-600 mt-1">Log your exact starting balances. What do you own, what do you owe, and what is your expected income for the year?</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-lg">2</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">The Action Plan</h3>
              <p className="text-sm text-slate-600 mt-1">Give every dollar a job. Allocate your net income to living expenses, debt payoffs, and investments until your <span className="font-bold text-emerald-600">Unallocated Cash is exactly $0</span>.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-lg">3</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">The Close-Out (Dec 31st)</h3>
              <p className="text-sm text-slate-600 mt-1">At the end of the year, lock your plan. Compare what you intended to do against what your bank statements actually say to grade your execution.</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md transition-colors text-lg"
        >
          Got it, let's build! 🚀
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;