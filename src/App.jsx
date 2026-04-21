import { useState, useEffect } from 'react';

// =============================================================================
// 1. IMPORTS & DEPENDENCIES
// =============================================================================

// --- HOOKS ---
import { useFinancialState } from './hooks/useFinancialState';

// --- UI COMPONENTS (Generic/Common) ---
import Tooltip from './components/ui/Tooltip';
import WelcomeModal from './components/ui/WelcomeModal';

// --- FEATURE MANAGERS (Data Entry) ---
import IncomeManager from './components/IncomeManager';
import AssetManager from './components/AssetManager';
import DebtManager from './components/DebtManager';
import SpendingManager from './components/SpendingManager';
import AssetContributionManager from './components/AssetContributionManager';
import DebtContributionManager from './components/DebtContributionManager';
import UnallocatedCashTracker from './components/UnallocatedCashTracker';

// --- SUMMARY & ANALYSIS COMPONENTS ---
import FoundationSummary from './components/FoundationSummary';
import AllocationSummary from './components/AllocationSummary';
import NetWorthProjection from './components/NetWorthProjection';
import CashFlowSankey from './components/CashFlowSankey';
import HistoryTable from './components/HistoryTable';
import ExecutionScorecard from './components/ExecutionScorecard';
import ActionChecklist from './components/ActionChecklist';

// --- ENGINES & UTILS ---
import { getDemoProfile } from './utils/demoProfiles';
import { calculateProjections } from './utils/projectionEngine';
import { calculateTaxes } from './utils/taxEngine';
import { 
  getSnapshots, 
  saveSnapshot, 
  loadDemoProfileIntoStorage, 
  clearAllSnapshots, 
  deleteSnapshot 
} from './utils/storageEngine';

// =============================================================================
// 2. MAIN APPLICATION COMPONENT
// =============================================================================

function App() {
  // ---------------------------------------------------------
  // SECTION A: GLOBAL UI & NAVIGATION STATE
  // ---------------------------------------------------------
const [snapshots, setSnapshots] = useState(() => {
    const stored = getSnapshots();
    // If empty (Fresh Reset), create the current year plan automatically
    if (Object.keys(stored).length === 0) {
      const currentYear = new Date().getFullYear().toString();
      return { [currentYear]: { status: 'open', plan: {} } }; 
    }
    return stored;
  });

  const [activeYear, setActiveYear] = useState(() => {
    const keys = Object.keys(snapshots);
    // Default to the most recent year available
    return keys.length > 0 ? keys.sort().reverse()[0] : new Date().getFullYear().toString();
  });
  const [currentView, setCurrentView] = useState('Dashboard');
  const [showWelcome, setShowWelcome] = useState(false);

  // Workflow states
  const [isLocked, setIsLocked] = useState(false);
  const [viewingType, setViewingType] = useState('plan'); // 'plan' or 'actuals'
  const [isClosingOut, setIsClosingOut] = useState(false);

  // ---------------------------------------------------------
  // SECTION B: CORE FINANCIAL DATA (CUSTOM HOOK)
  // ---------------------------------------------------------
  const {
    age, setAge, 
    filingStatus, setFilingStatus, 
    stateTaxLevel, setStateTaxLevel,
    incomeData, setIncomeData, 
    assetData, setAssetData, 
    debtData, setDebtData,
    spendingData, setSpendingData, 
    assetContributions, setAssetContributions, 
    debtContributions, setDebtContributions, 
    loadFinancialData
  } = useFinancialState();

  // ---------------------------------------------------------
  // SECTION C: APP LIFECYCLE (EFFECTS)
  // ---------------------------------------------------------
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeV3');
    if (!hasSeenWelcome) setShowWelcome(true);
  }, []);

  const closeWelcomeModal = () => {
    localStorage.setItem('hasSeenWelcomeV3', 'true');
    setShowWelcome(false);
  };

  // ===========================================================================
  // 3. STORAGE & DATA HANDLERS
  // ===========================================================================

  /**
   * Loads a complete financial profile from demo templates
   */
  const loadProfile = (profileName) => {
    const profileData = getDemoProfile(profileName);
    if (profileData) {
      const updatedSnapshots = loadDemoProfileIntoStorage(profileData);
      setSnapshots(updatedSnapshots);
      
      const years = Object.keys(updatedSnapshots).sort();
      const latestYear = years[years.length - 1];
      handleLoadSnapshot(latestYear);
      
      alert(`✅ Loaded ${profileName} history (2023-${latestYear})`);
    }
  };

  /**
   * Switches the workspace between 'Current Workspace' or specific historical years
   */
  const handleLoadSnapshot = (selectedYear) => {
    const target = selectedYear || new Date().getFullYear().toString();
    setActiveYear(target);
    setIsClosingOut(false);
    
    if (selectedYear === 'Current Workspace') {
      setIsLocked(false);
      setViewingType('plan');
      return;
    }

    if (snapshots[selectedYear]) {
      const snap = snapshots[selectedYear];
      const isClosed = snap.status === 'closed';
      const dataToLoad = isClosed && snap.actuals ? snap.actuals : snap.plan;
      
      setIsLocked(isClosed);
      setViewingType(isClosed ? 'actuals' : 'plan');
      loadFinancialData(dataToLoad);
    }
  };

  /**
   * Saves the current screen state to LocalStorage
   */
  const handleSmartSave = () => {
    const fullState = { 
      age, filingStatus, stateTaxLevel, incomeData, assetData, 
      debtData, spendingData, assetContributions, debtContributions 
    };
    
    // Save to the currently active year
    const updatedSnapshots = saveSnapshot(
      activeYear, 
      fullState, 
      isLocked ? 'actuals' : 'plan', 
      isLocked ? 'closed' : 'open'
    );
    
    setSnapshots(updatedSnapshots);
    alert(`✅ ${activeYear} ${isLocked ? 'Actuals' : 'Plan'} saved!`);
  };

  /**
   * Permanently deletes a single year snapshot
   */
  const handleDeleteYear = () => {
    if (window.confirm(`Are you sure you want to permanently delete the ${activeYear} snapshot?`)) {
      const updatedSnapshots = deleteSnapshot(activeYear);
      setSnapshots(updatedSnapshots);
      loadFinancialData();
      handleLoadSnapshot('Current Workspace'); 
      alert(`🗑️ ${activeYear} has been deleted.`);
    }
  };

  const handleRenameYear = () => {
  const newYear = window.prompt(`Enter the correct year for this snapshot (currently ${activeYear}):`, activeYear);
  if (!newYear || newYear === activeYear) return;

  // 1. Check if the target year already exists to prevent overwriting
  if (snapshots[newYear]) {
    alert(`❌ Error: A snapshot for ${newYear} already exists.`);
    return;
  }

  // 2. Clone the existing data to the new key
  const updatedSnapshots = { ...snapshots };
  updatedSnapshots[newYear] = updatedSnapshots[activeYear];
  
  // 3. Delete the old key
  delete updatedSnapshots[activeYear];

  // 4. Update state and storage
  setSnapshots(updatedSnapshots);
  localStorage.setItem('financial_snapshots', JSON.stringify(updatedSnapshots));
  setActiveYear(newYear);
  alert(`✅ Successfully renamed to ${newYear}`);
  };
  /**
   * Wipes all LocalStorage data
   */
  const handleNukeDatabase = () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete ALL saved years and completely reset the app. Are you sure?")) {
      clearAllSnapshots();
      window.location.reload();
    }
  };

  // ===========================================================================
  // 4. YEAR-END WORKFLOWS (CLOSE-OUT & ROLLOVER)
  // ===========================================================================

  /**
   * Completes the Year-End Review and locks the data into 'Actuals'
   */
  const confirmCloseOut = () => {
    const fullState = { 
      age, filingStatus, stateTaxLevel, 
      incomeData, assetData, debtData, 
      spendingData, assetContributions, debtContributions 
    };
    
    const updatedSnapshots = saveSnapshot(activeYear, fullState, 'actuals', 'closed');
    setSnapshots(updatedSnapshots);
    
    setIsLocked(true);
    setViewingType('actuals');
    setIsClosingOut(false);
    
    alert(`🔒 ${activeYear} successfully closed out! Your Actuals are now locked in.`);
  };

  /**
   * Rolls the closing balances of one year into the starting plan of the next year
   */
  const startNextYear = () => {
    const nextYear = (parseInt(activeYear) + 1).toString();
    const newPlanState = {
      age: age + 1, 
      filingStatus, stateTaxLevel,
      incomeData, assetData, debtData,
      spendingData, assetContributions, debtContributions 
    };

    const updatedSnapshots = saveSnapshot(nextYear, newPlanState, 'plan', 'open');
    setSnapshots(updatedSnapshots);
    setActiveYear(nextYear);
    setIsLocked(false);
    setViewingType('plan');
    alert(`🎉 Welcome to ${nextYear}! Your starting balances have been pulled from ${activeYear}'s final actuals.`);
  };

  // ===========================================================================
  // 5. DYNAMIC COMPONENT HELPERS (LINKING)
  // ===========================================================================

  const createLinkedAsset = (contributionId, contributionName) => {
    const newAssetId = Date.now(); 
    const newAsset = { 
      id: newAssetId, 
      name: contributionName || 'New Investment Account', 
      bucket: 'Investment (Non-Retirement)', 
      category: 'Brokerage Account', 
      balance: 0, 
      growth: 7 
    };
    setAssetData([...assetData, newAsset]);
    setAssetContributions(assetContributions.map(c => 
      c.id === contributionId ? { ...c, linkedId: newAssetId } : c
    ));
  };

  const createLinkedDebt = (contributionId, contributionName) => {
    const newDebtId = Date.now(); 
    const newDebt = { 
      id: newDebtId, 
      name: contributionName || 'New Liability', 
      balance: 0, 
      interestRate: 0, 
      linkedAssetId: '' 
    };
    setDebtData([...debtData, newDebt]);
    setDebtContributions(debtContributions.map(c => 
      c.id === contributionId ? { ...c, linkedId: newDebtId } : c
    ));
  };

  // ===========================================================================
  // 6. ANALYTICS & MATH ENGINE
  // ===========================================================================

  // Basic Math Helpers
  const calcTotal = (data) => data.reduce((acc, item) => acc + (item.amount || 0), 0);
  const calcMandatory = (data) => data.reduce((acc, item) => acc + (item.type === 'Mandatory' ? (item.amount || 0) : 0), 0);
  const calcDiscretionary = (data) => data.reduce((acc, item) => acc + (item.type === 'Discretionary' ? (item.amount || 0) : 0), 0);

  // Income & Tax Calculation
  const totalGrossIncome = incomeData.reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const taxReceipt = calculateTaxes(incomeData, filingStatus, stateTaxLevel);
  const totalTaxes = taxReceipt.totalTax;
  const totalNetIncome = totalGrossIncome - totalTaxes;

  // Cash Flow Buckets
  const totalMandatory = calcMandatory(spendingData) + calcMandatory(debtContributions);
  const totalDiscretionary = calcDiscretionary(spendingData) + calcDiscretionary(debtContributions);
  const totalInvestments = calcTotal(assetContributions); 
  const totalSpending = calcTotal(spendingData);
  const totalContributionsAmount = calcTotal(assetContributions);

  // --- EMERGENCY RUNWAY MATH ---
  const liquidCash = assetData
    .filter(a => a.bucket === 'Cash' || a.category === 'Bank Account/Savings')
    .reduce((acc, a) => acc + (a.balance || 0), 0);  

  const projectedCashContributions = assetContributions.reduce((sum, c) => {
    const linkedAsset = assetData.find(a => String(a.id) === String(c.linkedId));
    if (linkedAsset && (linkedAsset.bucket === 'Cash' || linkedAsset.category === 'Bank Account/Savings')) {
      return sum + (Number(c.amount) || 0);
    }
    return sum;
  }, 0);

  const projectedLiquidCash = liquidCash + projectedCashContributions;
  const monthlyMandatory = totalMandatory / 12;
  const currentRunwayMonths = monthlyMandatory > 0 ? (liquidCash / monthlyMandatory) : 0;
  const projectedRunwayMonths = monthlyMandatory > 0 ? (projectedLiquidCash / monthlyMandatory) : 0;
  const isRunwayLow = projectedRunwayMonths < 2.76;

  // --- COMPREHENSIVE PROJECTIONS ---
  const projections = calculateProjections({
    assetData,
    debtData,
    assetContributions,
    debtContributions,
    totalNetIncome,
    totalSpending,
    totalContributionsAmount
  });

  const {
    totalMarketGrowth,
    totalCashAddedToAssets,
    effectiveDebtPayments,
    unallocatedCashFlow,
    currentNetWorth,
    projectedNetWorth
  } = projections;

  // ===========================================================================
  // 7. RENDER VIEW
  // ===========================================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-grow">
        
        {/* --- GLOBAL APP TABS --- */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView('Dashboard')}
              className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-colors ${currentView === 'Dashboard' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
            >
              📊 Planning Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('History')}
              className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-colors ${currentView === 'History' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
            >
              📚 Historical Ledger
            </button>
          </div>
          
          <button 
            onClick={() => setShowWelcome(true)}
            className="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-200"
          >
            <span className="bg-slate-300 text-slate-700 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">?</span>
            Help / Tour
          </button>
        </div>

        {/* --- DASHBOARD VIEW --- */}
        {currentView === 'Dashboard' ? (
          <>
            {/* TIME TRAVEL NAV BAR */}
      {/* UNIFIED WORKSPACE SELECTOR */}
              <div className={`sticky top-0 z-50 mb-6 px-3 md:px-6 py-2 md:py-4 rounded-b-2xl rounded-tr-2xl flex items-center justify-between gap-2 shadow-xl border transition-colors duration-500 backdrop-blur-md ${isLocked ? 'bg-slate-900/95 border-red-500/50' : 'bg-slate-900/95 border-slate-800'}`}>              
                
                {/* PILL SELECTOR */}
                <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl p-1 shadow-inner flex-shrink min-w-0">
                  <span className="hidden sm:inline px-2 text-lg opacity-80">📂</span>
                  
                  <select
                    value={activeYear}
                    onChange={(e) => handleLoadSnapshot(e.target.value)}
                    className="bg-transparent border-none py-1.5 pr-6 pl-2 text-sm font-bold text-white focus:ring-0 cursor-pointer outline-none truncate"
                  >
                    {Object.keys(snapshots).sort().reverse().map(year => (
                      <option key={year} value={year} className="bg-slate-800 text-white">
                        {snapshots[year].status === 'closed' ? '🔒' : '📝'} {year} Snapshot
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center border-l border-slate-700 pl-2 ml-1 gap-1 shrink-0">
                    <span className={`hidden sm:inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${isLocked ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {isLocked ? 'Closed' : 'Open'}
                    </span>
                    <button onClick={handleRenameYear} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-xs" title="Rename Year">✏️</button>
                    <button onClick={handleDeleteYear} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-all font-bold" title="Delete Year">✕</button>
                  </div>
                </div>
                
                {/* ACTIONS */}
                <div className="flex gap-2 shrink-0">
                  {!isLocked && !isClosingOut && (
                    <>
                      <button onClick={handleSmartSave} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold px-3 md:px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center" title="Save Changes">
                        💾 <span className="hidden md:inline ml-2">Save Changes</span>
                      </button>
                      {/* Only show Close Out if we aren't in a fresh/empty state */}
                      {incomeData.length > 0 && (
                        <button 
                          onClick={() => {
                            setAssetData(assetData.map(a => ({ ...a, balance: 0 })));
                            setDebtData(debtData.map(d => ({ ...d, balance: 0 })));
                            setIsClosingOut(true);
                          }} 
                          className="bg-red-500 hover:bg-red-400 text-white font-extrabold px-3 md:px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center" title={`Close Out ${activeYear}`}
                        >
                          🔒 <span className="hidden md:inline ml-2">Close Out {activeYear}</span>
                        </button>
                      )}
                    </>
                  )}

                  {isLocked && (
                    <>
                      <button onClick={() => { setIsLocked(false); setIsClosingOut(true); }} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold px-3 md:px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center" title="Unlock Actuals">
                        🔓 <span className="hidden md:inline ml-2">Unlock Actuals</span>
                      </button>
                      <button 
                        onClick={snapshots[(parseInt(activeYear) + 1).toString()] ? () => handleLoadSnapshot((parseInt(activeYear) + 1).toString()) : startNextYear} 
                        className="bg-blue-500 hover:bg-blue-400 text-white font-black px-3 md:px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center"
                        title={snapshots[(parseInt(activeYear) + 1).toString()] ? `Go to ${parseInt(activeYear) + 1}` : `Start ${parseInt(activeYear) + 1} Plan`}
                      >
                        ➡️ <span className="hidden md:inline ml-2">{snapshots[(parseInt(activeYear) + 1).toString()] ? `Go to ${parseInt(activeYear) + 1}` : `Start ${parseInt(activeYear) + 1} Plan`}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

            {/* DEMO PROFILES SECTION */}
            <div className="mb-8 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-indigo-900 font-bold flex items-center gap-2">🧪 Test Data Templates</h3>
                <p className="text-indigo-700 text-xs">Instantly load realistic V2 profiles to see how the math works.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['singleNewHire', 'singleMidCareer', 'familyMidCareer', 'complexEdgeCase'].map(profile => (
                  <button key={profile} onClick={() => loadProfile(profile)} className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition capitalize">
                    {profile.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>

            {/* DEMOGRAPHIC CONTEXT BAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value) || 0)} className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 focus:ring-blue-500" />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filing Status</label>
                <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 cursor-pointer">
                  <option value="Single">Single</option>
                  <option value="Married Filing Jointly">Married Filing Jointly</option>
                  <option value="Married Filing Separately">Married Filing Separately</option>
                  <option value="Head of Household">Head of Household</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State Tax Level</label>
                <select value={stateTaxLevel} onChange={(e) => setStateTaxLevel(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 cursor-pointer">
                  <option value="None">None (0%)</option>
                  <option value="Low">Low (Approx)</option>
                  <option value="Medium">Medium (Approx)</option>
                  <option value="High">High (Approx)</option>
                </select>
              </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 shadow-sm">
          <strong>🧠 Smart Tax Engine Active:</strong> Taxes automatically calculated by Filing Status, State, and Income Type.
        </div>
            </div>

            {/* STEP 1: FOUNDATION / INVENTORY */}
            <div className={`mb-16 mt-4 ${isClosingOut ? 'ring-4 ring-red-500/20 p-6 rounded-3xl bg-red-50/10' : ''}`}>
              <div className="mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {isClosingOut ? `Final ${activeYear} Inventory (Dec 31st)` : `Step 1: Current Inventory`}
                </h2>
                <p className={`${isClosingOut ? 'text-red-500 font-bold' : 'text-gray-500'} mt-1 flex items-center`}>
                  {isClosingOut 
                    ? "Update these balances to exactly match your real-life bank and loan statements today. Plus any unplanned income." 
                    : "Log your exact starting asset/debt balances, and income sources as of January 1st to establish your baseline."}
                  {!isClosingOut && <Tooltip message="This represents Day 1 of your financial year. Don't worry about what might change, just log a snapshot of your life right now." />}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <IncomeManager data={incomeData} setData={setIncomeData} isLocked={isLocked} />
                <AssetManager data={assetData} setData={setAssetData} isClosingOut={isClosingOut} contributions={assetContributions} planSnapshot={snapshots[activeYear]?.plan} isLocked={isLocked} />
                <DebtManager data={debtData} setData={setDebtData} assets={assetData} isClosingOut={isClosingOut} contributions={debtContributions} planSnapshot={snapshots[activeYear]?.plan} isLocked={isLocked} />
              </div>

              {isClosingOut && (
                <div className="mt-8 bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
                  <h3 className="text-red-800 font-bold text-xl mb-2">Ready to lock in {activeYear}?</h3>
                  <p className="text-red-600 text-sm mb-6 max-w-lg">By clicking this, the balances above will be permanently saved as your Year-End Actuals, and the year will be closed.</p>
                  <div className="flex gap-4">
                     <button onClick={() => { setIsClosingOut(false); if (snapshots[activeYear]?.status === 'closed') handleLoadSnapshot(activeYear); }} className="px-6 py-3 text-red-600 font-bold hover:bg-red-100 rounded-xl transition-colors">Cancel</button>
                     <button onClick={confirmCloseOut} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-md transition-all">🔒 Confirm & Close Out</button>
                  </div>
                </div>
              )}
            </div>

            {/* REMAINING DASHBOARD SECTIONS */}
            {!isClosingOut && (
              <>
                <FoundationSummary incomeData={incomeData} taxReceipt={taxReceipt} totalInvestments={totalInvestments} debtContributions={debtContributions} />

                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-extrabold text-gray-900">Step 2: Cash Flow Allocation</h2>
                  <p className="text-gray-500 mt-1 flex items-center">
                    Allocate your projected Net Income to expenses and investments. Goal: $0 Unallocated.
                    <Tooltip message="Zero-based budgeting. Give every single dollar a job. Aim to bring this number to 0." />
                  </p>
                </div>
                
                <UnallocatedCashTracker unallocatedCashFlow={unallocatedCashFlow} totalNetIncome={totalNetIncome} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
                  <SpendingManager data={spendingData} setData={setSpendingData} isLocked={isLocked} />          
                  <AssetContributionManager data={assetContributions} setData={setAssetContributions} assets={assetData} age={age} filingStatus={filingStatus} onCreateLinkedAsset={createLinkedAsset} isLocked={isLocked} />
                  <DebtContributionManager data={debtContributions} setData={setDebtContributions} debts={debtData} onCreateLinkedDebt={createLinkedDebt} isLocked={isLocked} />
                </div>

                <AllocationSummary 
                  totalNetIncome={totalNetIncome} totalMandatory={totalMandatory} totalDiscretionary={totalDiscretionary} totalInvestments={totalInvestments}
                  currentRunwayMonths={currentRunwayMonths} projectedRunwayMonths={projectedRunwayMonths} liquidCash={liquidCash} projectedLiquidCash={projectedLiquidCash}
                  monthlyMandatory={monthlyMandatory} isRunwayLow={isRunwayLow}
                />

                <NetWorthProjection currentNetWorth={currentNetWorth} projectedNetWorth={projectedNetWorth} totalCashAddedToAssets={totalCashAddedToAssets} effectiveDebtPayments={effectiveDebtPayments} totalMarketGrowth={totalMarketGrowth} />

                <ActionChecklist contributions={assetContributions} setContributions={setAssetContributions} debts={debtContributions} setDebts={setDebtContributions} foundationAssets={assetData} foundationDebts={debtData} />
                
                <CashFlowSankey 
                  grossIncome={totalGrossIncome} netIncome={totalNetIncome} mandatory={totalMandatory} discretionary={totalDiscretionary} investments={totalInvestments} unallocated={unallocatedCashFlow}
                  incomeData={incomeData} taxReceipt={taxReceipt} spendingData={spendingData} assetContributions={assetContributions} debtContributions={debtContributions}
                />
              </>
            )}
          </>
        ) : (
          /* --- HISTORY VIEW --- */
          <div className="animate-fade-in pb-12">
            <ExecutionScorecard snapshots={snapshots} />
            <HistoryTable snapshots={snapshots} />
          </div>
        )}
      </div>

      {/* --- GLOBAL FOOTER --- */}
      <footer className="mt-12 mb-8 text-center text-xs text-slate-400 max-w-3xl mx-auto flex flex-col items-center gap-4">
        <p>
          <strong>Disclaimer:</strong> This application is a personal planning tool provided for educational and informational purposes only. I am not a financial advisor.
        </p>
        <button onClick={handleNukeDatabase} className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md">
          ⚠️ Reset App & Delete All Data
        </button>
        <WelcomeModal isOpen={showWelcome} onClose={closeWelcomeModal} />
      </footer>
    </div>
  );
}

export default App;