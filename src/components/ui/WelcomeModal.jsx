import React from 'react';

function WelcomeModal({ onStart }) {

  return (
    <div className="animate-fade-in pb-12 mt-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 max-w-4xl mx-auto p-8 md:p-12 relative overflow-hidden">
        {/* Decorative header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 mt-2">Welcome to your <br/><span className="text-indigo-600">Financial Snapshot</span></h2>
        <p className="text-slate-500 text-lg font-medium mb-10 max-w-2xl">This is no ordinary budget tracker. It's a forward-looking wealth engine. You will create isolated <strong>Snapshots</strong> for each year of your life, governed by a simple 3-step philosophy:</p>
        
        <div className="space-y-8 mb-12">
          <div className="flex gap-5 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xl">1</div>
            <div>
              <h3 className="font-bold text-slate-800 text-xl">The Foundation (Jan 1st)</h3>
              <p className="text-base text-slate-600 mt-1 max-w-xl">Open a new Snapshot for the year. Log your exact starting balances—what you own, what you owe, and your expected income.</p>
            </div>
          </div>
          
          <div className="flex gap-5 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl">2</div>
            <div>
              <h3 className="font-bold text-slate-800 text-xl">The Action Plan</h3>
              <p className="text-base text-slate-600 mt-1 max-w-xl">Give every dollar a job. Allocate your net income to living expenses, debt payoffs, and investments until your <span className="font-bold text-emerald-600">Unallocated Cash is exactly $0</span>.</p>
            </div>
          </div>
          
          <div className="flex gap-5 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-xl">3</div>
            <div>
              <h3 className="font-bold text-slate-800 text-xl">The Close-Out (Dec 31st)</h3>
              <p className="text-base text-slate-600 mt-1 max-w-xl">At the end of the year, lock your Snapshot. Compare what you intended to do against your actual bank statements, then roll the balances into the next year.</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onStart}
          className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md transition-colors text-lg"
        >
          Got it, let's build! 🚀
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;