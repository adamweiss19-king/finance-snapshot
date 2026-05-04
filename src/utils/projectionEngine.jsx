export function calculateProjections({
  assetData = [],                // Added default []
  debtData = [],                 // Added default []
  assetContributions = [],       // Added default []
  debtContributions = [],        // Added default []
  totalNetIncome = 0,            // Added default 0
  totalSpending = 0,             // Added default 0
  totalContributionsAmount = 0   // Added default 0
}) {
  
  // --- ASSET EOY CALCULATION ---
  let totalAssetEOY = 0;
  let totalMarketGrowth = 0;
  let totalCashAddedToAssets = 0;
  const projectedAssets = []; // NEW: Array of individual predictions

  assetData.forEach(asset => {
    const growthAmount = asset.balance * ((asset.growth || 0) / 100);
    const baseEOY = asset.balance + growthAmount;
    
    const linkedContributions = assetContributions
      .filter(c => String(c.linkedId) === String(asset.id))
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    totalMarketGrowth += growthAmount;
    totalCashAddedToAssets += linkedContributions;
    
    const assetEOY = baseEOY + linkedContributions;
    totalAssetEOY += assetEOY;

    // Save the individual prediction receipt
    projectedAssets.push({ ...asset, projectedEOY: assetEOY });
  });

  const unlinkedContributions = assetContributions
    .filter(c => c.linkedId === 'new' || !c.linkedId)
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  
  totalCashAddedToAssets += unlinkedContributions;
  totalAssetEOY += unlinkedContributions;

  // --- DEBT EOY CALCULATION ---
  let totalDebtEOY = 0;
  let effectiveDebtPayments = 0; 
  const projectedDebts = []; // NEW: Array of individual predictions

  debtData.forEach(debt => {
    const baseEOY = debt.balance + (debt.balance * ((debt.interestRate || 0) / 100));
    
    const linkedPayments = debtContributions
      .filter(p => String(p.linkedId) === String(debt.id))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    let debtEOY = 0;
    if (linkedPayments > baseEOY) {
      effectiveDebtPayments += baseEOY; 
    } else {
      effectiveDebtPayments += linkedPayments;
      debtEOY = baseEOY - linkedPayments;
    }
    
    totalDebtEOY += debtEOY;

    // Save the individual prediction receipt
    projectedDebts.push({ ...debt, projectedEOY: debtEOY });
  });

  const unallocatedCashFlow = totalNetIncome - totalSpending - totalContributionsAmount - effectiveDebtPayments;
  
  const currentNetWorth = 
    assetData.reduce((acc, a) => acc + (a.balance || 0), 0) - 
    debtData.reduce((acc, d) => acc + (d.balance || 0), 0);
    
  const projectedNetWorth = totalAssetEOY - totalDebtEOY;

  return {
    totalAssetEOY,
    totalMarketGrowth,
    totalCashAddedToAssets,
    totalDebtEOY,
    effectiveDebtPayments,
    unallocatedCashFlow,
    currentNetWorth,
    projectedNetWorth,
    
    projectedAssets, // EXPOSED FOR VARIANCE REPORT & WRAPPED MODAL!
    projectedDebts   // EXPOSED FOR VARIANCE REPORT & WRAPPED MODAL!
  };
}