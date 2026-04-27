import { useState } from 'react';

// =============================================================================
// 1. IMPORTS & DEPENDENCIES
// =============================================================================

// --- HOOKS ---
import { useFinancialState } from './hooks/useFinancialState';

// --- UI COMPONENTS (Generic/Common) ---
import Tooltip from './components/ui/Tooltip';
import WelcomeModal from './components/ui/WelcomeModal'; // Now used as a full Tab!
import WorkspaceLobby from './components/WorkspaceLobby';
import HomeownerWizard from './components/HomeownerWizard';

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
import YearInReviewModal from './components/YearInReviewModal';
import VarianceReport from './components/VarianceReport';

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
  const [snapshots, setSnapshots] = useState(() => getSnapshots() || {});
  const [activeYear, setActiveYear] = useState(null); 
  
  // Smart Initial Routing: Tour for new users, Hub for returning users
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeV4');
  const hasSnapshots = Object.keys(snapshots).length > 0;
  const initialView = (!hasSeenWelcome && !hasSnapshots) ? 'Welcome' : 'Hub';
  
  const [currentView, setCurrentView] = useState(initialView);
  const [showYearInReview, setShowYearInReview] = useState(false);

  // Workflow states
  const [isLocked, setIsLocked] = useState(false);
  const [viewingType, setViewingType] = useState('plan'); // 'plan' or 'actuals'
  const [isClosingOut, setIsClosingOut] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [isHomeWizardOpen, setIsHomeWizardOpen] = useState(false);
  const [ledgerView, setLedgerView] = useState('yoy'); // 'yoy' or 'variance'
  

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

  // ===========================================================================
  // 3. STORAGE & DATA HANDLERS
  // ===========================================================================
  
  const loadProfile = (profileName) => {
    const profileData = getDemoProfile(profileName);
    if (profileData) {
      const updatedSnapshots = loadDemoProfileIntoStorage(profileData);
      setSnapshots(updatedSnapshots);
      
      const years = Object.keys(updatedSnapshots).sort();
      const latestYear = years[years.length - 1];
      
      handleLoadSnapshot(latestYear, updatedSnapshots);     
      alert(`✅ Loaded ${profileName} history (through ${latestYear})`);
    }
  };

  const handleLoadSnapshot = (selectedYear, overrideData = null) => {
    const dataToUse = overrideData || snapshots; 
    
    setActiveYear(selectedYear);
    setIsClosingOut(false);
    
    if (dataToUse[selectedYear]) {
      const snap = dataToUse[selectedYear];
      const isClosed = snap.status === 'closed';
      const dataToLoad = isClosed && snap.actuals ? snap.actuals : snap.plan;
      
      setIsLocked(isClosed);
      setViewingType(isClosed ? 'actuals' : 'plan');
      loadFinancialData(dataToLoad);
    }
    
    // Teleport directly to the workspace
    setCurrentView('Dashboard');
  };

  const handleCreateNewYear = (year) => {
    if (snapshots[year]) {
      alert(`❌ Error: A workspace for ${year} already exists.`);
      return;
    }

    const priorYears = Object.keys(snapshots)
      .filter(y => parseInt(y) < parseInt(year))
      .sort((a, b) => parseInt(b) - parseInt(a));

    let startingPlan = {};

    if (priorYears.length > 0) {
      const closestYear = priorYears[0];
      const priorSnap = snapshots[closestYear];
      const priorData = priorSnap.status === 'closed' && priorSnap.actuals ? priorSnap.actuals : priorSnap.plan;
      const yearGap = parseInt(year) - parseInt(closestYear);

      startingPlan = {
        age: (priorData.age || 0) + yearGap,
        filingStatus: priorData.filingStatus || 'Single',
        stateTaxLevel: priorData.stateTaxLevel || 'None',
        incomeData: (priorData.incomeData || []).filter(i => i.type !== 'Windfall'),
        assetData: priorData.assetData || [],
        debtData: priorData.debtData || [],
        spendingData: priorData.spendingData || [],
        assetContributions: priorData.assetContributions || [],
        debtContributions: priorData.debtContributions || []
      };
    }

    const newSnapshots = { ...snapshots, [year]: { status: 'open', plan: startingPlan } };
    setSnapshots(newSnapshots);
    localStorage.setItem('financial_snapshots', JSON.stringify(newSnapshots));
    
    handleLoadSnapshot(year, newSnapshots);

    if (priorYears.length > 0) {
      alert(`🎉 Created ${year}! Starting balances inherited from ${priorYears[0]}.`);
    }
  };

  const handleSmartSave = () => {
    const fullState = { 
      age, filingStatus, stateTaxLevel, incomeData, assetData, 
      debtData, spendingData, assetContributions, debtContributions,
      projections: totalProjections // Fixed: Properly placed inside the object!
    };
    
    const updatedSnapshots = saveSnapshot(
      activeYear, 
      fullState, 
      isLocked ? 'actuals' : 'plan', 
      isLocked ? 'closed' : 'open'
    );
    
    setSnapshots(updatedSnapshots);
    alert(`✅ ${activeYear} ${isLocked ? 'Actuals' : 'Plan'} saved!`);
  };

  const handleDeleteYear = (yearToDelete) => {
    const target = yearToDelete || activeYear; // Works from Hub OR Dashboard
    if (window.confirm(`Are you sure you want to permanently delete the ${target} workspace?`)) {
      const updatedSnapshots = deleteSnapshot(target);
      setSnapshots(updatedSnapshots);
      if (activeYear === target) setActiveYear(null);
      setCurrentView('Hub'); 
    }
  };

  const handleRenameYear = (yearToRename) => {
    const target = yearToRename || activeYear;
    const newYear = window.prompt(`Enter the correct year for this workspace (currently ${target}):`, target);
    if (!newYear || newYear === target) return;

    if (snapshots[newYear]) {
      alert(`❌ Error: A snapshot for ${newYear} already exists.`);
      return;
    }

    const updatedSnapshots = { ...snapshots };
    updatedSnapshots[newYear] = updatedSnapshots[target];
    delete updatedSnapshots[target];

    setSnapshots(updatedSnapshots);
    localStorage.setItem('financial_snapshots', JSON.stringify(updatedSnapshots));
    if (activeYear === target) setActiveYear(newYear);
  };

  const handleNukeDatabase = () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete ALL saved years and completely reset the app. Are you sure?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // ===========================================================================
  // 4. YEAR-END WORKFLOWS
  // ===========================================================================

  const handleInitiateCloseOut = () => {
    const planAssets = snapshots[activeYear]?.plan?.assetData || [];
    const unchangedAssets = assetData.filter(actualAsset => {
      const planAsset = planAssets.find(p => p.id === actualAsset.id);
      return planAsset && planAsset.balance === actualAsset.balance;
    });

    const planDebts = snapshots[activeYear]?.plan?.debtData || [];
    const unchangedDebts = debtData.filter(actualDebt => {
      const planDebt = planDebts.find(p => p.id === actualDebt.id);
      return planDebt && planDebt.balance === actualDebt.balance;
    });

    const allUnchanged = [...unchangedAssets, ...unchangedDebts];

    if (allUnchanged.length > 0) {
      setAuditData(allUnchanged); 
    } else {
      executeCloseOut(); 
    }
  };

  const executeCloseOut = () => {
    const fullState = { 
      age, filingStatus, stateTaxLevel, 
      incomeData, assetData, debtData, 
      spendingData, assetContributions, debtContributions,
      projections: totalProjections
    };
    
    const updatedSnapshots = saveSnapshot(activeYear, fullState, 'actuals', 'closed');
    setSnapshots(updatedSnapshots);
    
    setIsLocked(true);
    setViewingType('actuals');
    setIsClosingOut(false);
    setAuditData(null); 
    
    setShowYearInReview(true);
  };

  const startNextYear = () => {
    const nextYearStr = (parseInt(activeYear) + 1).toString();
    handleCreateNewYear(nextYearStr);
  };

  // ===========================================================================
  // 5. DYNAMIC COMPONENT HELPERS
  // ===========================================================================

  const handleSaveHomeWizard = (data) => {
    const assetId = Date.now();
    const debtId = assetId + 1;
    const contributionId = assetId + 2;

    setAssetData([...assetData, { id: assetId, name: data.name, bucket: 'Real Estate', category: data.category, balance: data.homeValue, growth: 3 }]);

    if (data.mortgageBalance > 0) {
      setDebtData([...debtData, { id: debtId, name: `${data.name} Mortgage`, balance: data.mortgageBalance, interestRate: data.interestRate, linkedAssetId: assetId }]);
      setDebtContributions([...debtContributions, { id: contributionId, name: `Mortgage (${data.name})`, type: 'Mandatory', amount: data.monthlyPayment * 12, linkedId: debtId }]);
    }
    setIsHomeWizardOpen(false);
  };
  
  const createLinkedAsset = (contributionId, contributionName) => {
    const newAssetId = Date.now(); 
    const newAsset = { 
      id: newAssetId, name: contributionName || 'New Investment Account', 
      bucket: 'Investment (Non-Retirement)', category: 'Brokerage Account', balance: 0, growth: 7 
    };
    setAssetData([...assetData, newAsset]);
    setAssetContributions(assetContributions.map(c => 
      c.id === contributionId ? { ...c, linkedId: newAssetId } : c
    ));
  };

  const createLinkedDebt = (contributionId, contributionName) => {
    const newDebtId = Date.now(); 
    const newDebt = { 
      id: newDebtId, name: contributionName || 'New Liability', 
      balance: 0, interestRate: 0, linkedAssetId: '' 
    };
    setDebtData([...debtData, newDebt]);
    setDebtContributions(debtContributions.map(c => 
      c.id === contributionId ? { ...c, linkedId: newDebtId } : c
    ));
  };

  // ===========================================================================
  // 6. ANALYTICS & MATH ENGINE
  // ===========================================================================
  
  const calcTotal = (data) => data.reduce((acc, item) => acc + (item.amount || 0), 0);
  const calcMandatory = (data) => data.reduce((acc, item) => acc + (item.type === 'Mandatory' ? (item.amount || 0) : 0), 0);
  const calcDiscretionary = (data) => data.reduce((acc, item) => acc + (item.type === 'Discretionary' ? (item.amount || 0) : 0), 0);

  const totalGrossIncome = incomeData.reduce((acc, item) => acc + (Number(item.gross) || 0), 0);
  const taxReceipt = calculateTaxes(incomeData, filingStatus, stateTaxLevel);
  const totalTaxes = taxReceipt.totalTax;
  const totalNetIncome = totalGrossIncome - totalTaxes;

  const totalMandatory = calcMandatory(spendingData) + calcMandatory(debtContributions);
  const totalDiscretionary = calcDiscretionary(spendingData) + calcDiscretionary(debtContributions);
  const totalInvestments = calcTotal(assetContributions); 
  const totalSpending = calcTotal(spendingData);
  const totalContributionsAmount = calcTotal(assetContributions);

  const liquidCash = assetData
    .filter(a => a.category === 'Bank Account/Savings')
    .reduce((acc, a) => acc + (a.balance || 0), 0);  

  const projectedCashContributions = assetContributions.reduce((sum, c) => {
    const linkedAsset = assetData.find(a => String(a.id) === String(c.linkedId));
    if (linkedAsset && linkedAsset.category === 'Bank Account/Savings') {
      return sum + (Number(c.amount) || 0);
    }
    return sum;
  }, 0);

  const projectedLiquidCash = liquidCash + projectedCashContributions;
  const monthlyMandatory = totalMandatory / 12;
  const currentRunwayMonths = monthlyMandatory > 0 ? (liquidCash / monthlyMandatory) : 0;
  const projectedRunwayMonths = monthlyMandatory > 0 ? (projectedLiquidCash / monthlyMandatory) : 0;
  const isRunwayLow = projectedRunwayMonths < 2.76;

  const hasRealEstate = assetData.some(a => ['Primary Residence', 'Investment Property', 'Vacation Home'].includes(a.category));
  
  const liquidAssetData = assetData.filter(a => !['Primary Residence', 'Investment Property', 'Vacation Home'].includes(a.category));
  const liquidAssetIds = liquidAssetData.map(a => String(a.id));

  const liquidDebtData = debtData.filter(d => !d.linkedAssetId || liquidAssetIds.includes(String(d.linkedAssetId)));
  const liquidDebtIds = liquidDebtData.map(d => String(d.id));

  const liquidAssetContributions = assetContributions.filter(c => liquidAssetIds.includes(String(c.linkedId)));
  const liquidDebtContributions = debtContributions.filter(c => liquidDebtIds.includes(String(c.linkedId)));

  const totalProjections = calculateProjections({
    assetData, debtData, assetContributions, debtContributions, totalNetIncome, totalSpending, totalContributionsAmount
  });

  const liquidProjections = hasRealEstate ? calculateProjections({
    assetData: liquidAssetData, debtData: liquidDebtData, assetContributions: liquidAssetContributions, debtContributions: liquidDebtContributions, totalNetIncome, totalSpending, totalContributionsAmount: calcTotal(liquidAssetContributions)
  }) : totalProjections;

  const { unallocatedCashFlow } = totalProjections;

  // ===========================================================================
  // 7. RENDER VIEW
  // ===========================================================================

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* 🌐 THE GLOBAL NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md">
              W
            </div>
            <span className="font-black text-slate-800 text-xl tracking-tight hidden sm:block">
              Fin<span className="text-indigo-600">Shots</span>
            </span>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setCurrentView('Hub')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${currentView === 'Hub' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              🏠 Hub
            </button>
            <button 
              onClick={() => setCurrentView('Dashboard')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${currentView === 'Dashboard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              📊 Snapshots
            </button>
            <button 
              onClick={() => setCurrentView('History')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${currentView === 'History' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              📚 Ledger
            </button>
            <button 
              onClick={() => setCurrentView('Welcome')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${currentView === 'Welcome' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              💡 Tour
            </button>
          </div>

        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* ========================================= */}
        {/* PAGE 1: THE HUB (LOBBY)                   */}
        {/* ========================================= */}
        {currentView === 'Hub' && (
          <div className="animate-fade-in">
            <WorkspaceLobby 
              snapshots={snapshots} 
              onSelectYear={handleLoadSnapshot} 
              onCreateNew={handleCreateNewYear}
              onLoadProfile={loadProfile}
              onOpenHelp={() => setCurrentView('Welcome')}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* PAGE 2: THE DASHBOARD (ACTIVE WORKSPACE)  */}
        {/* ========================================= */}
        {currentView === 'Dashboard' && (
          !activeYear ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm mt-8 max-w-2xl mx-auto animate-fade-in">
              <div className="text-6xl mb-4">📁</div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">No Workspace Selected</h2>
              <p className="text-slate-500 mb-8">You need to open a year from the Hub before you can start planning.</p>
              <button 
                onClick={() => setCurrentView('Hub')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md"
              >
                Go to Hub
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              
              {/* UNIFIED WORKSPACE SELECTOR */}
              <div className={`sticky top-16 z-30 mb-6 px-3 md:px-6 py-2 md:py-4 rounded-b-2xl rounded-tr-2xl flex items-center justify-between gap-2 shadow-xl border transition-colors duration-500 backdrop-blur-md ${isLocked ? 'bg-slate-900/95 border-red-500/50' : 'bg-slate-900/95 border-slate-800'}`}>              
                
                {/* PILL SELECTOR */}
                <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl p-1 shadow-inner flex-shrink min-w-0">
                  <span className="px-2 text-lg opacity-80 md:ml-1">📂</span>
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
                  </div>
                </div>
                
                {/* ACTIONS */}
                <div className="flex gap-2 shrink-0">
                  {!isLocked && !isClosingOut && (
                    <>
                      <button onClick={handleSmartSave} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold px-3 md:px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center" title="Save Changes">
                        💾 <span className="hidden md:inline ml-2">Save Changes</span>
                      </button>
                      {incomeData.length > 0 && (
                        <button 
                          onClick={() => setIsClosingOut(true)} 
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
                      >
                        ➡️ <span className="hidden md:inline ml-2">{snapshots[(parseInt(activeYear) + 1).toString()] ? `Go to ${parseInt(activeYear) + 1}` : `Start ${parseInt(activeYear) + 1} Plan`}</span>
                      </button>
                    </>
                  )}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State Tax</label>
                  <select value={stateTaxLevel} onChange={(e) => setStateTaxLevel(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-800 cursor-pointer">
                    <option value="None">None (0%)</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 shadow-sm ml-auto">
                  <strong>🧠 Smart Tax Engine Active</strong>
                </div>
              </div>

              {/* STEP 1: FOUNDATION / INVENTORY */}
              <div className={`mb-16 mt-4 ${isClosingOut ? 'ring-4 ring-red-500/20 p-6 rounded-3xl bg-red-50/10' : ''}`}>
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {isClosingOut ? `Final ${activeYear} Inventory (Dec 31st)` : `Step 1: Current Inventory`}
                  </h2>
                  <div className={`${isClosingOut ? 'text-red-500 font-bold' : 'text-gray-500'} mt-1 flex items-center`}>
                    {isClosingOut 
                      ? "Update these balances to exactly match your real-life bank and loan statements today." 
                      : "Log your exact starting asset/debt balances, and income sources as of January 1st to establish your baseline."}
                    {!isClosingOut && <Tooltip message="This represents Day 1 of your financial year." />}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <IncomeManager data={incomeData} setData={setIncomeData} isLocked={isLocked} />
                  <AssetManager data={assetData} setData={setAssetData} isClosingOut={isClosingOut} contributions={assetContributions} planSnapshot={snapshots[activeYear]?.plan} isLocked={isLocked} onOpenHomeWizard={setIsHomeWizardOpen} projectedAssets={totalProjections.projectedAssets} />
                  <DebtManager data={debtData} setData={setDebtData} assets={assetData} isClosingOut={isClosingOut} contributions={debtContributions} planSnapshot={snapshots[activeYear]?.plan} isLocked={isLocked} projectedDebts={totalProjections.projectedDebts} />
                </div>

                {isClosingOut && (
                  <div className="mt-8 bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
                    <h3 className="text-red-800 font-bold text-xl mb-2">Ready to lock in {activeYear}?</h3>
                    <p className="text-red-600 text-sm mb-6 max-w-lg">By clicking this, the balances above will be permanently saved as your Year-End Actuals, and the year will be closed.</p>
                    <div className="flex gap-4">
                       <button onClick={() => { setIsClosingOut(false); if (snapshots[activeYear]?.status === 'closed') handleLoadSnapshot(activeYear); }} className="px-6 py-3 text-red-600 font-bold hover:bg-red-100 rounded-xl transition-colors">Cancel</button>
                       <button onClick={handleInitiateCloseOut} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-md transition-all">🔒 Confirm & Close Out</button>
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
                    <div className="text-gray-500 mt-1 flex items-center">
                      Allocate your projected Net Income to expenses and investments. Goal: $0 Unallocated.
                    </div>
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

                  <NetWorthProjection 
                    totalProjections={totalProjections} 
                    liquidProjections={liquidProjections} 
                    hasRealEstate={hasRealEstate} 
                  />

                  <ActionChecklist contributions={assetContributions} setContributions={setAssetContributions} debts={debtContributions} setDebts={setDebtContributions} foundationAssets={assetData} foundationDebts={debtData} />
                  
                  <CashFlowSankey 
                    grossIncome={totalGrossIncome} netIncome={totalNetIncome} mandatory={totalMandatory} discretionary={totalDiscretionary} investments={totalInvestments} unallocated={unallocatedCashFlow}
                    incomeData={incomeData} taxReceipt={taxReceipt} spendingData={spendingData} assetContributions={assetContributions} debtContributions={debtContributions}
                  />
                </>
              )}
            </div>
          )
        )}

        {/* ========================================= */}
        {/* PAGE 3: HISTORICAL LEDGER                 */}
        {/* ========================================= */}
        {currentView === 'History' && (
          <div className="animate-fade-in pb-12">
            
            {/* The Ledger Toggle Switch */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-200/60 p-1.5 rounded-xl flex gap-1 shadow-inner border border-slate-200/80">
                <button 
                  onClick={() => setLedgerView('yoy')}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${ledgerView === 'yoy' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  📈 Year-over-Year History
                </button>
                <button 
                  onClick={() => setLedgerView('variance')}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${ledgerView === 'variance' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  ⚖️ Variance Report
                </button>
              </div>
            </div>

            {/* Render the selected view */}
            {ledgerView === 'yoy' ? (
              <div className="animate-fade-in">
                <ExecutionScorecard snapshots={snapshots} />
                <HistoryTable snapshots={snapshots} />
              </div>
            ) : (
              <VarianceReport snapshots={snapshots} />
            )}
            
          </div>
        )}

        {/* ========================================= */}
        {/* PAGE 4: THE WELCOME TOUR                  */}
        {/* ========================================= */}
        {currentView === 'Welcome' && (
          <WelcomeModal onStart={() => {
            localStorage.setItem('hasSeenWelcomeV4', 'true');
            setCurrentView('Hub');
          }} />
        )}

      </main>

      {/* --- GLOBAL FOOTER --- */}
      <footer className="mt-12 mb-8 text-center text-xs text-slate-400 max-w-3xl mx-auto flex flex-col items-center gap-4">
        <p>
          <strong>Disclaimer:</strong> This application is a personal planning tool provided for educational and informational purposes only. I am not a financial advisor.
        </p>
        <button onClick={handleNukeDatabase} className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md">
          ⚠️ Reset App & Delete All Data
        </button>
        
        {/* MODALS THAT FLOAT ABOVE EVERYTHING */}
        {auditData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl mb-4">⚠️</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Unverified Accounts</h3>
              <p className="text-slate-500 mb-6">
                The following accounts have the exact same balance as January 1st. Did you forget to update them for December 31st?
              </p>
              
              <ul className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 max-h-40 overflow-y-auto space-y-2">
                {auditData.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <span className="text-slate-400 font-mono">${(item.balance || 0).toLocaleString()}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <button onClick={() => setAuditData(null)} className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Go Back & Fix
                </button>
                <button onClick={executeCloseOut} className="flex-1 py-3 font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-colors">
                  Accept As-Is
                </button>
              </div>
            </div>
          </div>
        )}

        <YearInReviewModal 
          isOpen={showYearInReview}
          year={activeYear}
          snap={snapshots[activeYear]}
          onClose={() => setShowYearInReview(false)}
          onStartNextYear={startNextYear}
        />

        <HomeownerWizard 
          isOpen={isHomeWizardOpen} 
          onClose={() => setIsHomeWizardOpen(false)} 
          onSave={handleSaveHomeWizard} 
        />
      </footer>
    </div>
  );
}

export default App;