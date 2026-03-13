// utils/projectionEngine.js

export function calculateProjections({
  assetData,
  debtData,
  assetContributions,
  debtContributions,
  totalNetIncome,
  totalSpending,
  totalContributionsAmount
}) {
  // 1. Asset EOY Calculation
  let totalAssetEOY = 0;
  let totalMarketGrowth = 0;
  let totalCashAddedToAssets = 0;

  assetData.forEach(asset => {
    const growthAmount = asset.balance * ((asset.growth || 0) / 100);
    const baseEOY = asset.balance + growthAmount;
    
    const linkedContributions = assetContributions
      .filter(c => String(c.linkedId) === String(asset.id))
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    totalMarketGrowth += growthAmount;
    totalCashAddedToAssets += linkedContributions;
    totalAssetEOY += baseEOY + linkedContributions;
  });

  const unlinkedContributions = assetContributions
    .filter(c => c.linkedId === 'new' || !c.linkedId)
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  
  totalCashAddedToAssets += unlinkedContributions;
  totalAssetEOY += unlinkedContributions;

  // 2. Debt EOY Calculation
  let totalDebtEOY = 0;
  let effectiveDebtPayments = 0; 

  debtData.forEach(debt => {
    const baseEOY = debt.balance + (debt.balance * ((debt.interestRate || 0) / 100));
    const linkedPayments = debtContributions
      .filter(p => String(p.linkedId) === String(debt.id))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    if (linkedPayments > baseEOY) {
      effectiveDebtPayments += baseEOY; 
      totalDebtEOY += 0;                
    } else {
      effectiveDebtPayments += linkedPayments;
      totalDebtEOY += (baseEOY - linkedPayments);
    }
  });

  // 3. Final Net Worth & Cash Flow
  const unallocatedCashFlow = totalNetIncome - totalSpending - totalContributionsAmount - effectiveDebtPayments;
  
  const currentNetWorth = 
    assetData.reduce((acc, a) => acc + (a.balance || 0), 0) - 
    debtData.reduce((acc, d) => acc + (d.balance || 0), 0);
    
  const projectedNetWorth = totalAssetEOY - totalDebtEOY;

  // Return the "Receipt"
  return {
    totalAssetEOY,
    totalMarketGrowth,
    totalCashAddedToAssets,
    totalDebtEOY,
    effectiveDebtPayments,
    unallocatedCashFlow,
    currentNetWorth,
    projectedNetWorth
  };
}