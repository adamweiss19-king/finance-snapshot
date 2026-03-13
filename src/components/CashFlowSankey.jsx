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
  spendingData = [],
  assetContributions = [],
  debtContributions = []
}) {

  const [isDetailed, setIsDetailed] = useState(false);

  // 1. Math Rounding
  const totalGross = Math.round(grossIncome);
  const totalNet = Math.round(netIncome);
  const totalMandatory = Math.round(mandatory);
  const totalDiscretionary = Math.round(discretionary);
  const totalInvestments = Math.round(investments);
  const netUnallocated = Math.round(unallocated);
  const totalTaxes = totalGross - totalNet;

  // 2. Descriptive Label Generator
  const getLabel = (name, value) => {
    const pct = totalGross > 0 ? Math.round((value / totalGross) * 100) : 0;
    return `${name}: ${formatter.format(value)} (${pct}%)`;
  };

  const lblGross = `Gross Income: ${formatter.format(totalGross)}`;
  const lblTaxes = getLabel('Taxes', totalTaxes);
  const lblNet = getLabel('Net Income', totalNet);
  const lblMandatory = getLabel('Mandatory', totalMandatory);
  const lblDiscretionary = getLabel('Discretionary', totalDiscretionary);
  const lblInvestments = getLabel('Investments', totalInvestments);
  const lblUnallocated = getLabel('Unallocated', netUnallocated > 0 ? netUnallocated : 0);
  const lblDeficit = getLabel('Deficit (Debt)', Math.abs(netUnallocated));

  // 3. Custom Tooltip String Generator (Exactly your requested format)
  const tip = (from, to) => `
      <div style="padding:12px; font-family:sans-serif; border: 1px solid #e2e8f0; background:white; border-radius:8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="font-size:10px; color:#64748b; text-transform:uppercase; font-weight:bold; letter-spacing:0.05em; margin-bottom:4px;">
          Flowing from ${from.split(':')[0]}
        </div>
        <div style="font-size:14px; color:#0f172a; font-weight:bold;">
          ${to}
        </div>
      </div>
    `;

// 4. The Bulletproof Color Map & Data Rows
  const colorMap = {};
  
  // Assign Macro Colors
  colorMap[lblGross] = '#22c55e'; // Green
  colorMap[lblNet] = '#22c55e'; // Green
  colorMap[lblTaxes] = '#f97316'; // Orange
  colorMap[lblMandatory] = '#64748b'; // Slate
  colorMap[lblDiscretionary] = '#64748b'; // Slate
  colorMap[lblInvestments] = '#0ea5e9'; // Blue
  colorMap[lblUnallocated] = '#0ea5e9'; // Blue
  colorMap[lblDeficit] = '#ef4444'; // Red

  const microDataRows = [];

  // Map Spending (Slate Gray)
  spendingData.forEach(item => {
    if (item.amount > 0) {
      const val = Math.round(item.amount);
      const lbl = getLabel(item.name || item.category || 'Unnamed Expense', val);
      colorMap[lbl] = '#64748b'; 
      microDataRows.push([lblNet, lbl, val, tip(lblNet, lbl)]);
    }
  });

  // Map Assets (Blue)
  assetContributions.forEach(item => {
    if (item.amount > 0) {
      const val = Math.round(item.amount);
      const lbl = getLabel(item.name || 'Unnamed Asset', val);
      colorMap[lbl] = '#0ea5e9'; 
      microDataRows.push([lblNet, lbl, val, tip(lblNet, lbl)]);
    }
  });

  // Map Debt (Red)
  debtContributions.forEach(item => {
    if (item.amount > 0) {
      const val = Math.round(item.amount);
      const lbl = getLabel(item.name || 'Unnamed Debt', val);
      colorMap[lbl] = '#ef4444'; 
      microDataRows.push([lblNet, lbl, val, tip(lblNet, lbl)]);
    }
  });

  const macroData = [
    ['From', 'To', 'Weight', { type: 'string', role: 'tooltip', p: { html: true } }],
    ...(totalTaxes > 0 ? [[lblGross, lblTaxes, totalTaxes, tip(lblGross, lblTaxes)]] : []),
    ...(totalNet > 0 ? [[lblGross, lblNet, totalNet, tip(lblGross, lblNet)]] : []),
    ...(totalMandatory > 0 ? [[lblNet, lblMandatory, totalMandatory, tip(lblNet, lblMandatory)]] : []),
    ...(totalDiscretionary > 0 ? [[lblNet, lblDiscretionary, totalDiscretionary, tip(lblNet, lblDiscretionary)]] : []),
    ...(totalInvestments > 0 ? [[lblNet, lblInvestments, totalInvestments, tip(lblNet, lblInvestments)]] : []),
    ...(netUnallocated > 0 ? [[lblNet, lblUnallocated, netUnallocated, tip(lblNet, lblUnallocated)]] : []),
    ...(netUnallocated < 0 ? [[lblDeficit, lblNet, Math.abs(netUnallocated), tip(lblDeficit, lblNet)]] : []),
  ];

  const microData = [
    ['From', 'To', 'Weight', { type: 'string', role: 'tooltip', p: { html: true } }],
    ...(totalTaxes > 0 ? [[lblGross, lblTaxes, totalTaxes, tip(lblGross, lblTaxes)]] : []),
    ...(totalNet > 0 ? [[lblGross, lblNet, totalNet, tip(lblGross, lblNet)]] : []),
    ...microDataRows,
    ...(netUnallocated > 0 ? [[lblNet, lblUnallocated, netUnallocated, tip(lblNet, lblUnallocated)]] : []),
    ...(netUnallocated < 0 ? [[lblDeficit, lblNet, Math.abs(netUnallocated), tip(lblDeficit, lblNet)]] : []),
  ];

  // 5. Choose Chart Data
  const finalChartData = isDetailed ? microData : macroData;

  // 6. Apply Colors based on the exact Nodes rendered
  const uniqueNodes = [];
  finalChartData.slice(1).forEach(row => {
    if (!uniqueNodes.includes(row[0])) uniqueNodes.push(row[0]);
    if (!uniqueNodes.includes(row[1])) uniqueNodes.push(row[1]);
  });

  // Pull the color directly from our map, fallback to gray if something weird happens
  const dynamicColors = uniqueNodes.map(node => colorMap[node] || '#cbd5e1');

  const options = {
    tooltip: { isHtml: true },
    sankey: {
      node: {
        colors: dynamicColors, // Plugs in our smart color array       
        label: { fontName: 'Inter, system-ui, sans-serif', fontSize: 12, bold: true },
        nodePadding: 45,
        width: 20,
      },
      link: { 
        colorMode: 'gradient',
        fillOpacity: 0.3 
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8 mb-12">
      <div className="mb-8 border-b border-gray-50 pb-4 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Financial Architecture</h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Flow Breakdown</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setIsDetailed(false)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
              !isDetailed ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Macro
          </button>
          <button 
            onClick={() => setIsDetailed(true)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
              isDetailed ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Micro
          </button>
        </div>
      </div>

      {totalGross > 0 ? (
        <div className="w-full h-[500px]">
          <Chart
            chartType="Sankey"
            width="100%"
            height="100%"
            data={finalChartData}
            options={options}
          />
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-sm">Add income sources to see your flow.</p>
        </div>
      )}
    </div>
  );
}

export default CashFlowSankey;