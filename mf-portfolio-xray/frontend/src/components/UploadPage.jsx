import React, { useState, useRef } from "react";

export default function UploadPage({ onUpload, loading, error }) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.goldBar} />
        <div style={styles.headerContent}>
          <span style={styles.badge}>ET AI HACKATHON 2026 · PS9 · AI MONEY MENTOR</span>
          <h1 style={styles.title}>MF Portfolio X-Ray</h1>
          <p style={styles.subtitle}>
            Upload your CAMS or KFintech statement.<br />
            Get your complete portfolio health report in <span style={{ color: "#F5A623" }}>10 seconds</span>.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { val: "14 Cr+", lbl: "Demat Accounts in India" },
          { val: "₹18,000", lbl: "Avg Annual Loss (Overlap)" },
          { val: "10 sec", lbl: "Analysis Time" },
          { val: "Free", lbl: "No Login Required" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statVal}>{s.val}</div>
            <div style={styles.statLbl}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Upload box */}
      <div style={styles.uploadSection}>
        <div
          style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneDrag : {}) }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={styles.uploadIcon}>📄</div>
          {selectedFile ? (
            <>
              <p style={styles.fileName}>✅ {selectedFile.name}</p>
              <p style={styles.dropHint}>Click to change file</p>
            </>
          ) : (
            <>
              <p style={styles.dropText}>Drag & drop your CAMS / KFintech PDF here</p>
              <p style={styles.dropHint}>or click to browse · PDF only</p>
            </>
          )}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{
            ...styles.submitBtn,
            opacity: selectedFile && !loading ? 1 : 0.5,
            cursor: selectedFile && !loading ? "pointer" : "not-allowed",
          }}
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
        >
          {loading ? "⏳ Analyzing your portfolio..." : "🔍 Analyze My Portfolio"}
        </button>

        <p style={styles.note}>
          💡 Don't have a CAMS statement? Download it free from{" "}
          <a href="https://www.camsonline.com" target="_blank" rel="noreferrer" style={{ color: "#F5A623" }}>
            camsonline.com
          </a>
        </p>
      </div>

      {/* Features */}
      <div style={styles.featuresRow}>
        {[
          { icon: "📈", title: "True XIRR", desc: "Annualized return vs Nifty 50 benchmark" },
          { icon: "🔁", title: "Overlap Detection", desc: "Find duplicate holdings across all funds" },
          { icon: "💸", title: "Expense Drag", desc: "Exact ₹ lost to fees every year" },
          { icon: "🤖", title: "AI Rebalancing", desc: "Specific moves from Claude AI" },
          { icon: "🎯", title: "Health Score", desc: "6-dimension portfolio score" },
          { icon: "⚡", title: "10 Seconds", desc: "No login, no subscription" },
        ].map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <div style={styles.featureTitle}>{f.title}</div>
            <div style={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0A1628", paddingBottom: 60 },
  header: { position: "relative", background: "#112240", padding: "48px 40px 40px", borderBottom: "1px solid rgba(245,166,35,0.2)" },
  goldBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "#F5A623" },
  headerContent: { maxWidth: 800 },
  badge: { fontSize: 11, color: "#F5A623", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" },
  title: { fontSize: 52, fontWeight: 800, color: "#FFFFFF", marginTop: 8, lineHeight: 1.1 },
  subtitle: { fontSize: 18, color: "#8896A8", marginTop: 12, lineHeight: 1.6 },
  statsRow: { display: "flex", gap: 16, padding: "28px 40px", background: "#0A1628" },
  statCard: { flex: 1, background: "#1E3A5F", borderRadius: 10, padding: "16px 20px", textAlign: "center" },
  statVal: { fontSize: 24, fontWeight: 800, color: "#F5A623" },
  statLbl: { fontSize: 12, color: "#8896A8", marginTop: 4 },
  uploadSection: { maxWidth: 600, margin: "0 auto", padding: "32px 40px" },
  dropzone: {
    border: "2px dashed rgba(245,166,35,0.4)", borderRadius: 16, padding: "48px 24px",
    textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: "#112240",
  },
  dropzoneDrag: { border: "2px dashed #F5A623", background: "#1E3A5F" },
  uploadIcon: { fontSize: 48, marginBottom: 16 },
  dropText: { fontSize: 16, color: "#E2E8F0", fontWeight: 600 },
  dropHint: { fontSize: 13, color: "#8896A8", marginTop: 6 },
  fileName: { fontSize: 15, color: "#00C48C", fontWeight: 600 },
  submitBtn: {
    width: "100%", marginTop: 20, padding: "16px", background: "#F5A623",
    color: "#0A1628", border: "none", borderRadius: 10, fontSize: 17,
    fontWeight: 800, cursor: "pointer", transition: "all 0.2s",
  },
  error: { color: "#FF4757", fontSize: 14, marginTop: 10, textAlign: "center" },
  note: { fontSize: 13, color: "#8896A8", textAlign: "center", marginTop: 16 },
  featuresRow: {
    display: "flex", flexWrap: "wrap", gap: 16, padding: "0 40px",
    maxWidth: 1000, margin: "0 auto",
  },
  featureCard: {
    flex: "1 1 140px", background: "#112240", borderRadius: 12,
    padding: "20px 16px", textAlign: "center",
    border: "1px solid rgba(245,166,35,0.1)",
  },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 13, fontWeight: 700, color: "#F5A623" },
  featureDesc: { fontSize: 11, color: "#8896A8", marginTop: 4 },
};
