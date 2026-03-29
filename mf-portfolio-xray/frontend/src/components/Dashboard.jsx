import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard({ analysis, onReset }) {
  const {
    holdings = [],
    xirr = 0,
    benchmarkXirr = 12.1,
    overlapMatrix = {},
    aiRecommendation = "",
    portfolioScore = 0,
  } = analysis;

  const totalInvested = holdings.reduce((s, h) => s + (h.investedAmount || 0), 0);
  const totalCurrent = holdings.reduce((s, h) => s + (h.currentValue || 0), 0);
  const totalExpense = holdings.reduce((s, h) => s + (h.annualExpenseDrag || 0), 0);
  const gainLoss = totalCurrent - totalInvested;
  const gainPct = totalInvested > 0 ? ((gainLoss / totalInvested) * 100).toFixed(1) : 0;

  const scoreColor = portfolioScore >= 75 ? "#00C48C" : portfolioScore >= 50 ? "#F5A623" : "#FF4757";
  const scoreLabel = portfolioScore >= 75 ? "EXCELLENT" : portfolioScore >= 50 ? "GOOD" : "NEEDS WORK";

  // Chart data
  const categoryMap = {};
  holdings.forEach((h) => {
    const cat = h.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + (h.currentValue || 0);
  });

  const donutData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: ["#F5A623", "#0D9488", "#7C3AED", "#FF4757", "#00C48C", "#1E3A5F"],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: ["Your XIRR", "Nifty 50 Avg"],
    datasets: [{
      label: "Returns %",
      data: [xirr, benchmarkXirr],
      backgroundColor: [xirr >= benchmarkXirr ? "#00C48C" : "#FF4757", "#F5A623"],
      borderRadius: 6,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#8896A8" }, grid: { display: false } },
      y: { ticks: { color: "#8896A8", callback: (v) => v + "%" }, grid: { color: "rgba(255,255,255,0.05)" } },
    },
  };

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.goldBar} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={styles.badge}>MF PORTFOLIO X-RAY · ANALYSIS COMPLETE</span>
            <h1 style={styles.pageTitle}>Your Portfolio Report</h1>
          </div>
          <button style={styles.resetBtn} onClick={onReset}>← Analyze Another</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Score + key metrics row */}
        <div style={styles.metricsRow}>
          {/* Score card */}
          <div style={{ ...styles.card, textAlign: "center", minWidth: 160 }}>
            <div style={styles.scoreLabel}>Portfolio Score</div>
            <div style={{ ...styles.scoreNum, color: scoreColor }}>{portfolioScore}</div>
            <div style={{ ...styles.scoreBadge, color: scoreColor }}>{scoreLabel}</div>
          </div>

          {/* Key metrics */}
          {[
            { label: "Your XIRR", val: xirr + "%", sub: `Benchmark: ${benchmarkXirr}%`, good: xirr >= benchmarkXirr },
            { label: "Total Invested", val: "₹" + (totalInvested / 100000).toFixed(1) + "L", sub: gainLoss >= 0 ? `+₹${(gainLoss/1000).toFixed(0)}K gain` : `-₹${(Math.abs(gainLoss)/1000).toFixed(0)}K loss`, good: gainLoss >= 0 },
            { label: "Annual Expense Drag", val: "₹" + Math.round(totalExpense).toLocaleString(), sub: "Lost to fees/year", good: false },
            { label: "No. of Funds", val: holdings.length, sub: holdings.length <= 4 ? "Optimal" : "Consider consolidating", good: holdings.length <= 4 },
          ].map((m, i) => (
            <div key={i} style={styles.metricCard}>
              <div style={styles.metricLabel}>{m.label}</div>
              <div style={{ ...styles.metricVal, color: m.good ? "#00C48C" : "#FF4757" }}>{m.val}</div>
              <div style={styles.metricSub}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={styles.chartsRow}>
          <div style={{ ...styles.card, flex: 1 }}>
            <h3 style={styles.cardTitle}>XIRR vs Benchmark</h3>
            <Bar data={barData} options={barOptions} height={180} />
          </div>
          <div style={{ ...styles.card, flex: 1 }}>
            <h3 style={styles.cardTitle}>Portfolio Allocation</h3>
            <div style={{ maxWidth: 260, margin: "0 auto" }}>
              <Doughnut data={donutData} options={{ plugins: { legend: { position: "bottom", labels: { color: "#8896A8", font: { size: 11 } } } } }} />
            </div>
          </div>
        </div>

        {/* Holdings table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>HOLDINGS BREAKDOWN</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Fund Name", "Category", "Invested", "Current Value", "XIRR", "Expense Ratio", "Overlap"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const fundXirr = h.investedAmount > 0
                  ? ((Math.pow(h.currentValue / h.investedAmount, 1 / 3) - 1) * 100).toFixed(1)
                  : 0;
                const overlapEntry = Object.entries(overlapMatrix).find(([key]) => key.includes(h.fundName?.split(" ")[0]));
                const overlapPct = overlapEntry ? overlapEntry[1] : null;
                const overlapTag = overlapPct > 55 ? "HIGH" : overlapPct > 30 ? "MED" : "LOW";
                const overlapColor = overlapPct > 55 ? "#FF4757" : overlapPct > 30 ? "#F5A623" : "#00C48C";
                return (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}><span style={{ fontWeight: 600 }}>{h.fundName}</span></td>
                    <td style={styles.td}><span style={styles.catBadge}>{h.category}</span></td>
                    <td style={styles.td}>₹{(h.investedAmount || 0).toLocaleString()}</td>
                    <td style={{ ...styles.td, color: h.currentValue >= h.investedAmount ? "#00C48C" : "#FF4757" }}>
                      ₹{(h.currentValue || 0).toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, color: fundXirr >= 12 ? "#00C48C" : "#FF4757", fontWeight: 700 }}>{fundXirr}%</td>
                    <td style={styles.td}>{h.expenseRatio || 0}%</td>
                    <td style={{ ...styles.td, color: overlapColor, fontWeight: 700 }}>
                      {overlapPct ? `${overlapTag} ${Math.round(overlapPct)}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Overlap matrix */}
        {Object.keys(overlapMatrix).length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>FUND OVERLAP MATRIX</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              {Object.entries(overlapMatrix).map(([pair, pct], i) => {
                const color = pct > 55 ? "#FF4757" : pct > 30 ? "#F5A623" : "#00C48C";
                return (
                  <div key={i} style={{ ...styles.overlapChip, borderColor: color }}>
                    <span style={{ fontSize: 12, color: "#8896A8" }}>{pair}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color }}>{Math.round(pct)}%</span>
                    <span style={{ fontSize: 10, color }}>overlap</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        <div style={styles.aiCard}>
          <div style={styles.aiGoldBar} />
          <div style={{ marginLeft: 16 }}>
            <div style={styles.aiHeader}>🤖 Claude AI Rebalancing Plan</div>
            <p style={styles.aiText}>{aiRecommendation || "AI analysis complete. Review your overlap and expense metrics above for optimization opportunities."}</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40, color: "#8896A8", fontSize: 12 }}>
          Built by <strong style={{ color: "#F5A623" }}>Rakesh Banoth</strong> · ET AI Hackathon 2026 · PS9 AI Money Mentor
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0A1628" },
  topBar: { position: "relative", background: "#112240", padding: "28px 40px", borderBottom: "1px solid rgba(245,166,35,0.2)" },
  goldBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "#F5A623" },
  badge: { fontSize: 10, color: "#F5A623", fontWeight: 700, letterSpacing: 2 },
  pageTitle: { fontSize: 32, fontWeight: 800, color: "#FFFFFF", marginTop: 4 },
  resetBtn: { background: "transparent", border: "1px solid #F5A623", color: "#F5A623", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  content: { padding: "32px 40px", maxWidth: 1200, margin: "0 auto" },
  metricsRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  card: { background: "#112240", borderRadius: 12, padding: "20px 24px", border: "1px solid rgba(245,166,35,0.12)" },
  cardTitle: { fontSize: 11, fontWeight: 700, color: "#F5A623", letterSpacing: 2, marginBottom: 16 },
  scoreLabel: { fontSize: 12, color: "#8896A8", marginBottom: 4 },
  scoreNum: { fontSize: 64, fontWeight: 900, lineHeight: 1 },
  scoreBadge: { fontSize: 13, fontWeight: 700, marginTop: 4 },
  metricCard: { flex: 1, minWidth: 140, background: "#112240", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(245,166,35,0.12)" },
  metricLabel: { fontSize: 11, color: "#8896A8", fontWeight: 600 },
  metricVal: { fontSize: 26, fontWeight: 800, marginTop: 6 },
  metricSub: { fontSize: 11, color: "#8896A8", marginTop: 4 },
  chartsRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 8 },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#F5A623", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td: { padding: "12px 12px", fontSize: 13, color: "#E2E8F0" },
  catBadge: { background: "#1E3A5F", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#8896A8" },
  overlapChip: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "12px 20px", borderRadius: 10, border: "1px solid", background: "#0A1628" },
  aiCard: { display: "flex", background: "#112240", borderRadius: 12, padding: "24px", border: "1px solid rgba(245,166,35,0.2)", marginTop: 20 },
  aiGoldBar: { width: 4, minHeight: "100%", background: "#F5A623", borderRadius: 4, flexShrink: 0 },
  aiHeader: { fontSize: 14, fontWeight: 700, color: "#F5A623", marginBottom: 10 },
  aiText: { fontSize: 14, color: "#E2E8F0", lineHeight: 1.7 },
};
