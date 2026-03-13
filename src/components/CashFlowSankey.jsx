import React, { useState } from 'react';
import { Chart } from 'react-google-charts';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function CashFlowSankey({ 
  grossIncome, 
  netIncome, 
  mandatory, 
  discretionary, 
  investments, 
  unallocated, 
  incomeData = [], 
  spendingData = [],
  assetContributions = [],
  debtContributions = [],
  taxReceipt = {}
}) {
  const [isDetailed, setIsDetailed] = useState(false);

  // 1. Math & Labels (Keep these, they work well)
  const totalGross = Math.round(grossIncome);
  const totalNet = Math.round(netIncome);
  const totalTaxes = totalGross - totalNet;
  const netUnallocated = Math.round(unallocated);

  const getLabel = (name, value) => {
    const pct = totalGross > 0 ? Math.round((value / totalGross) * 100) : 0;
    return `${name}: ${formatter.format(value)} (${pct}%)`;
  };

  const lblGross = `Gross Income: ${formatter.format(totalGross)}`;
  const lblTaxes = getLabel('Taxes', totalTaxes);
  const lblNet = getLabel('Net Income', totalNet);
  
  const lblFedTax = getLabel('Federal Tax', taxReceipt.federalTax || 0);
  const lblStateTax = getLabel('State Tax', taxReceipt.stateTax || 0);
  const lblFicaTax = getLabel('FICA Tax', taxReceipt.ficaTax || 0);

  const lblMandatory = getLabel('Mandatory', Math.round(mandatory));
  const lblDiscretionary = getLabel('Discretionary', Math.round(discretionary));
  const lblInvestments = getLabel('Investments', Math.round(investments));
  const lblUnallocated = getLabel('Unallocated', netUnallocated > 0 ? netUnallocated : 0);
  const lblDeficit = getLabel('Deficit (Debt)', Math.abs(netUnallocated));

  // 2. Custom Tooltip
  const tip = (from, to) => `
    <div style="padding:12px; font-family:sans-serif; border: 1px solid #e2e8f0; background:white; border-radius:8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="font-size:10px; color:#64748b; text-transform:uppercase; font-weight:bold; letter-spacing:0.05em; margin-bottom:4px;">
        Flowing from ${from.split(':')[0]}
      </div>
      <div style="font-size:14px; color:#0f172a; font-weight:bold;">${to}</div>
    </div>
  `;

  // 3. The Color Map (Your favorites)
  const colorMap = {
    [lblGross]: '#22c55e',
    [lblNet]: '#22c55e',
    [lblTaxes]: '#f97316',
    [lblFedTax]: '#f97316',
    [lblStateTax]: '#fb923c',
    [lblFicaTax]: '#fdba74',
    [lblMandatory]: '#64748b',
    [lblDiscretionary]: '#64748b',
    [lblInvestments]: '#0ea5e9',
    [lblUnallocated]: '#0ea5e9',
    [lblDeficit]: '#ef4444'
  };

  // 4. Building the Connections (The "Standard" Way)
  const rows = [];

  if (isDetailed) {
    // Left: Income Sources -> Gross
    incomeData.forEach(item => {
      if (item.gross > 0) {
        const lbl = `${item.name || item.type}: ${formatter.format(item.gross)}`;
        colorMap[lbl] = '#22c55e';
        rows.push([lbl, lblGross, Math.round(item.gross), tip(lbl, lblGross)]);
      }
    });

    // Middle: Gross -> Tax Splits
    if (taxReceipt.federalTax > 0) rows.push([lblGross, lblFedTax, Math.round(taxReceipt.federalTax), tip(lblGross, lblFedTax)]);
    if (taxReceipt.stateTax > 0) rows.push([lblGross, lblStateTax, Math.round(taxReceipt.stateTax), tip(lblGross, lblStateTax)]);
    if (taxReceipt.ficaTax > 0) rows.push([lblGross, lblFicaTax, Math.round(taxReceipt.ficaTax), tip(lblGross, lblFicaTax)]);
    
    // Middle: Gross -> Net
    if (totalNet > 0) rows.push([lblGross, lblNet, totalNet, tip(lblGross, lblNet)]);

    // Right: Net -> Outflows
    debtContributions.forEach(item => {
      if (item.amount > 0) {
        const lbl = getLabel(item.name || 'Debt', item.amount);
        colorMap[lbl] = '#ef4444';
        rows.push([lblNet, lbl, Math.round(item.amount), tip(lblNet, lbl)]);
      }
    });

    assetContributions.forEach(item => {
      if (item.amount > 0) {
        const lbl = getLabel(item.name || 'Asset', item.amount);
        colorMap[lbl] = '#0ea5e9';
        rows.push([lblNet, lbl, Math.round(item.amount), tip(lblNet, lbl)]);
      }
    });

    spendingData.forEach(item => {
      if (item.amount > 0) {
        const lbl = getLabel(item.name || item.category || 'Expense', item.amount);
        colorMap[lbl] = '#64748b';
        rows.push([lblNet, lbl, Math.round(item.amount), tip(lblNet, lbl)]);
      }
    });

  } else {
    // Macro Flow (Flat/Standard)
    if (totalTaxes > 0) rows.push([lblGross, lblTaxes, totalTaxes, tip(lblGross, lblTaxes)]);
    if (totalNet > 0) rows.push([lblGross, lblNet, totalNet, tip(lblGross, lblNet)]);
    if (Math.round(mandatory) > 0) rows.push([lblNet, lblMandatory, Math.round(mandatory), tip(lblNet, lblMandatory)]);
    if (Math.round(discretionary) > 0) rows.push([lblNet, lblDiscretionary, Math.round(discretionary), tip(lblNet, lblDiscretionary)]);
    if (Math.round(investments) > 0) rows.push([lblNet, lblInvestments, Math.round(investments), tip(lblNet, lblInvestments)]);
  }

  // Handle Unallocated/Deficit for both views
  if (netUnallocated > 0) rows.push([lblNet, lblUnallocated, netUnallocated, tip(lblNet, lblUnallocated)]);
  if (netUnallocated < 0) rows.push([lblDeficit, lblNet, Math.abs(netUnallocated), tip(lblDeficit, lblNet)]);

  const chartData = [
    ['From', 'To', 'Weight', { type: 'string', role: 'tooltip', p: { html: true } }],
    ...rows
  ];

  // 5. Dynamic Node Colors (Extracted from final data)
  const uniqueNodes = [];
  chartData.slice(1).forEach(row => {
    if (!uniqueNodes.includes(row[0])) uniqueNodes.push(row[0]);
    if (!uniqueNodes.includes(row[1])) uniqueNodes.push(row[1]);
  });
  const dynamicColors = uniqueNodes.map(node => colorMap[node] || '#cbd5e1');

  const options = {
    tooltip: { isHtml: true },
    sankey: {
      node: {
        colors: dynamicColors,
        label: { fontName: 'Inter, sans-serif', fontSize: 11, bold: true },
        nodePadding: 30, // Healthy spacing
        width: 15,
      },
      link: { colorMode: 'gradient', fillOpacity: 0.25 }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8 mb-12">
      <div className="mb-8 border-b border-gray-50 pb-4 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Financial Architecture</h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1 italic">
            {isDetailed ? 'Detailed View' : 'Macro View'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setIsDetailed(false)} className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all ${!isDetailed ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>Macro</button>
          <button onClick={() => setIsDetailed(true)} className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all ${isDetailed ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>Micro</button>
        </div>
      </div>

      {totalGross > 0 ? (
        <div className="w-full h-[600px]">
          <Chart chartType="Sankey" width="100%" height="100%" data={chartData} options={options} />
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm">
          Add income sources to see your architecture.
        </div>
      )}
    </div>
  );
}

export default CashFlowSankey;