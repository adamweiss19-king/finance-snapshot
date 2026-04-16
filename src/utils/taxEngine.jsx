/**
 * TAX ENGINE
 * Estimates Federal, State, and FICA taxes using progressive bracket logic
 * and Long-Term Capital Gains stacking.
 */

// ============================================================
// SECTION 1: TAX CONSTANTS (2024/2025 ESTIMATES)
// ============================================================

const FEDERAL_BRACKETS = {
  'Single': [
    { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 }, { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 }, { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],
  'Married Filing Jointly': [
    { limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 }, { limit: 201050, rate: 0.22 },
    { limit: 383900, rate: 0.24 }, { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ]
};

const STANDARD_DEDUCTION = { 'Single': 14600, 'Married Filing Jointly': 29200 };

const STATE_BRACKETS = {
  'None': [ { limit: Infinity, rate: 0.00 } ],
  'Low': [ { limit: 50000, rate: 0.02 }, { limit: Infinity, rate: 0.03 } ],
  'Medium': [ { limit: 50000, rate: 0.03 }, { limit: 100000, rate: 0.05 }, { limit: Infinity, rate: 0.065 } ],
  'High': [ { limit: 50000, rate: 0.04 }, { limit: 100000, rate: 0.06 }, { limit: 250000, rate: 0.09 }, { limit: Infinity, rate: 0.11 } ]
};

const LTCG_BRACKETS = {
  'Single': [ { limit: 47025, rate: 0.00 }, { limit: 518900, rate: 0.15 }, { limit: Infinity, rate: 0.20 } ],
  'Married Filing Jointly': [ { limit: 94050, rate: 0.00 }, { limit: 583750, rate: 0.15 }, { limit: Infinity, rate: 0.20 } ]
};

// ============================================================
// SECTION 2: CALCULATION HELPERS
// ============================================================

/**
 * Loops through a bracket array to calculate total tax for a given income level.
 */
function calculateProgressiveTax(income, brackets) {
  let tax = 0;
  let previousLimit = 0;
  
  for (const bracket of brackets) {
    if (income > previousLimit) {
      const taxableInThisBracket = Math.min(income - previousLimit, bracket.limit - previousLimit);
      tax += taxableInThisBracket * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      break;
    }
  }
  return tax;
}

// ============================================================
// SECTION 3: PRIMARY TAX CALCULATOR
// ============================================================

export function calculateTaxes(incomeData, filingStatus = 'Single', stateLevel = 'Medium') {
  let w2Income = 0;
  let selfEmployedIncome = 0;
  let passiveIncome = 0;
  let stcgIncome = 0; 
  let ltcgIncome = 0; 

  // --- 1. SORT INCOME INTO BUCKETS ---
  incomeData.forEach(income => {
    if (!income.isTaxable) return;
    const amount = Number(income.gross) || 0;
    if (income.type === 'W-2 Salary' || income.type === 'W-2 Bonus') w2Income += amount;
    else if (income.type === 'Self-Employment (1099)') selfEmployedIncome += amount;
    else if (income.type === 'Short Term Capital Gains') stcgIncome += amount;
    else if (income.type === 'Long Term Capital Gains') ltcgIncome += amount;
    else passiveIncome += amount; 
  });

  // --- 2. CALCULATE FICA (Social Security & Medicare) ---
  const totalFica = (w2Income * 0.0765) + (selfEmployedIncome * 0.153);

  // --- 3. FEDERAL ORDINARY INCOME TAX ---
  const ordinaryIncome = w2Income + selfEmployedIncome + passiveIncome + stcgIncome;
  const deduction = STANDARD_DEDUCTION[filingStatus] || STANDARD_DEDUCTION['Single'];
  let taxableOrdinary = Math.max(0, ordinaryIncome - deduction);
  
  const fedBrackets = FEDERAL_BRACKETS[filingStatus] || FEDERAL_BRACKETS['Single'];
  let federalTax = calculateProgressiveTax(taxableOrdinary, fedBrackets);

  // --- 4. LONG TERM CAPITAL GAINS (STACKING METHOD) ---
  // LTCG rates are applied to gains sitting on top of ordinary income.
  const ltcgBracketsToUse = LTCG_BRACKETS[filingStatus] || LTCG_BRACKETS['Single'];
  let ltcgTax = 0;
  let ltcgRemaining = ltcgIncome;
  let incomeBaseForLtcg = taxableOrdinary; 

  for (const bracket of ltcgBracketsToUse) {
    if (ltcgRemaining <= 0) break; 
    if (incomeBaseForLtcg < bracket.limit) {
      const roomInBracket = bracket.limit - incomeBaseForLtcg;
      const amountToTaxInThisBracket = Math.min(ltcgRemaining, roomInBracket);
      ltcgTax += amountToTaxInThisBracket * bracket.rate;
      ltcgRemaining -= amountToTaxInThisBracket;
      incomeBaseForLtcg += amountToTaxInThisBracket;
    }
  }
  federalTax += ltcgTax;

  // --- 5. STATE TAX ---
  const totalGrossForState = ordinaryIncome + ltcgIncome;
  const stateBrackets = STATE_BRACKETS[stateLevel] || STATE_BRACKETS['Medium'];
  const stateTax = calculateProgressiveTax(totalGrossForState, stateBrackets);

  // --- 6. GENERATE RECEIPT ---
  const totalTax = federalTax + stateTax + totalFica;
  const effectiveRate = totalGrossForState > 0 ? (totalTax / totalGrossForState) * 100 : 0;

  return {
    totalTax: Math.round(totalTax),
    federalTax: Math.round(federalTax),
    stateTax: Math.round(stateTax),
    ficaTax: Math.round(totalFica),
    effectiveRate: effectiveRate.toFixed(1)
  };
}