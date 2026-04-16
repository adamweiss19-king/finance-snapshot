/**
 * PROJECTION ENGINE
 * Handles the Year-End (EOY) mathematical forecasting for Assets, Debts, 
 * and overall Net Worth.
 */

// ============================================================
// SECTION 1: CORE PROJECTION CALCULATOR
// ============================================================

/**
 * Calculates the projected financial state of the user at Dec 31st.
 * * Formula for Assets: $$EOY = Balance \times (1 + \frac{Growth}{100}) + Contributions$$
 * Formula for Debt:   $$EOY = \max(0, Balance \times (1 + \frac{Interest}{100}) - Payments)$$
 * * @param {Object} params - The current financial state
 * @returns {Object} A "Receipt" of all projected totals
 */
export function calculateProjections({
  assetData,
  debtData,
  assetContributions,
  debtContributions,
  totalNetIncome,
  totalSpending,
  totalContributionsAmount
}) {
  
  // --- ASSET EOY CALCULATION ---
  let totalAssetEOY = 0;
  let totalMarketGrowth = 0;
  let totalCashAddedToAssets = 0;

  assetData.forEach(asset => {
    // Calculate organic growth based on starting balance
    const growthAmount = asset.balance * ((asset.growth || 0) / 100);
    const baseEOY = asset.balance + growthAmount;
    
    // Find cash flow specifically assigned to this account
    const linkedContributions = assetContributions
      .filter(c => String(c.linkedId) === String(asset.id))
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    totalMarketGrowth += growthAmount;
    totalCashAddedToAssets += linkedContributions;
    totalAssetEOY += baseEOY + linkedContributions;
  });

  // Include contributions not yet linked to a specific Foundation asset
  const unlinkedContributions = assetContributions
    .filter(c => c.linkedId === 'new' || !c.linkedId)
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  
  totalCashAddedToAssets += unlinkedContributions;
  totalAssetEOY += unlinkedContributions;

  // --- DEBT EOY CALCULATION ---
  let totalDebtEOY = 0;
  let effectiveDebtPayments = 0; 

  debtData.forEach(debt => {
    // Project the balance after interest accrual
    const baseEOY = debt.balance + (debt.balance * ((debt.interestRate || 0) / 100));
    
    // Total payments assigned to this debt
    const linkedPayments = debtContributions
      .filter(p => String(p.linkedId) === String(debt.id))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Floor logic: Ensure payments don't result in a "negative debt"
    if (linkedPayments > baseEOY) {
      effectiveDebtPayments += baseEOY; 
      totalDebtEOY += 0;                
    } else {
      effectiveDebtPayments += linkedPayments;
      totalDebtEOY += (baseEOY - linkedPayments);
    }
  });

  // ============================================================
  // SECTION 2: FINAL NET WORTH & CASH FLOW SUMMARY
  // ============================================================

  // Unallocated: Money left over after taxes, spending, and all plan contributions
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
    projectedNetWorth
  };
}