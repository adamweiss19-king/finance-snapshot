import React, { useState } from 'react';

function WorkspaceLobby({ snapshots, onSelectYear, onCreateNew, onLoadProfile, onOpenHelp, onRenameYear, onDeleteYear }) {
  const [newYearInput, setNewYearInput] = useState(new Date().getFullYear().toString());
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (newYearInput.trim() === '') return;
    onCreateNew(newYearInput.trim());
    setIsCreating(false);
  };

  const sortedYears = Object.keys(snapshots).sort().reverse();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8">
      <div className="max-w-4xl w-full relative">
        <button 
          onClick={onOpenHelp}
          className="absolute top-0 right-0 mt-2 text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-200"
        >
          <span className="bg-slate-300 text-slate-700 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">?</span>
          Help / Tour
        </button>
        
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            Your Financial <span className="text-indigo-600">Snapshots</span>
          </h1>
          <p className="text-slate-500 text-lg">Select a year to review or build a new financial plan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          
          {isCreating ? (
            <div className="bg-white border-2 border-indigo-500 shadow-lg rounded-2xl p-6 flex flex-col justify-center animate-fade-in">
              <form onSubmit={handleCreate} className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enter Year</label>
                <input type="number" value={newYearInput} onChange={(e) => setNewYearInput(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xl font-black text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" autoFocus />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">Create</button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => setIsCreating(true)} className="bg-slate-100 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] transition-all group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black">+</span>
              </div>
              <span className="font-bold text-lg">Create New Year</span>
            </button>
          )}

          {sortedYears.map((year) => {
            const snap = snapshots[year];
            const isClosed = snap.status === 'closed';
            
            return (
              <div key={year} className="relative group animate-fade-in cursor-pointer" onClick={() => onSelectYear(year)}>
                {/* FLOATING ACTION MENU */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onRenameYear(year)} className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 shadow-sm flex items-center justify-center" title="Rename Workspace">✏️</button>
                  <button onClick={() => onDeleteYear(year)} className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-red-100 rounded-lg hover:bg-red-50 text-red-500 shadow-sm flex items-center justify-center" title="Delete Workspace">🗑️</button>
                </div>

                <div className="bg-white border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col text-left transition-all h-full relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${isClosed ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                  <div className="flex justify-between items-start mb-4 mt-1">
                    <span className="text-3xl opacity-80 group-hover:scale-110 transition-transform">📂</span>
                    <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${isClosed ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {isClosed ? '🔒 Closed Actuals' : '📝 Open Plan'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">{year} Snapshot</h3>
                  <p className="text-sm font-semibold text-slate-400 mt-1">Click to open &rarr;</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div>
            <h3 className="text-indigo-900 font-black text-lg flex items-center gap-2">⚙️ Load Demo Templates</h3>
            <p className="text-indigo-700 text-sm mt-1">Instantly load realistic, multi-year profiles to see how the engine works.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['singleNewHire', 'singleMidCareer', 'familyMidCareer', 'complexEdgeCase'].map(profile => (
              <button key={profile} onClick={() => onLoadProfile(profile)} className="bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all capitalize">
                {profile.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default WorkspaceLobby;