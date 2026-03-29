# 📊 MF Portfolio X-Ray — ET AI Hackathon 2026

> **PS 9 — AI Money Mentor** | Built by Rakesh Banoth

An AI-powered Mutual Fund portfolio analyzer that transforms a CAMS/KFintech statement into a complete investment health report — in under 10 seconds.

---

## 🚀 What It Does

Upload your CAMS or KFintech PDF → Get instant:

| Feature | Description |
|---|---|
| 📈 **True XIRR** | Actual annualized returns vs benchmark |
| 🔁 **Overlap Analysis** | Detect duplicate holdings across funds |
| 💸 **Expense Ratio Drag** | See how much fees are costing you yearly |
| 🤖 **AI Rebalancing Plan** | Plain-English advice powered by Claude AI |
| 📊 **Portfolio Score** | 6-dimension financial health score |

---

## 🏗️ Architecture

```
User uploads CAMS PDF
        ↓
[Spring Boot Backend - Port 8080]
  ├── PDF Parser (Apache PDFBox)
  ├── Fund Data Extractor
  └── XIRR Calculator
        ↓
[Data Enrichment]
  └── AMFI Public API (live NAV, expense ratios)
        ↓
[Claude AI Layer]
  └── Overlap detection + rebalancing narrative
        ↓
[React Frontend]
  └── Dashboard with charts + AI report
```

---

## 🛠️ Tech Stack

- **Backend:** Java 17, Spring Boot 3.x
- **PDF Parsing:** Apache PDFBox
- **AI/LLM:** Claude claude-sonnet-4-20250514 API
- **Fund Data:** AMFI India Public API
- **Frontend:** React + Chart.js
- **Database:** PostgreSQL (optional, H2 for dev)
- **Cloud:** AWS EC2 + S3

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL (or use H2 for local dev)
- Claude API Key (get from console.anthropic.com)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/rakeshbanoth/mf-portfolio-xray
cd mf-portfolio-xray/backend

# Set your Claude API key
export CLAUDE_API_KEY=your_api_key_here

# Run the Spring Boot app
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend starts at `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/portfolio/upload` | Upload CAMS/KFintech PDF |
| GET | `/api/portfolio/{id}/analysis` | Get full analysis |
| GET | `/api/portfolio/{id}/xirr` | Get XIRR calculation |
| GET | `/api/portfolio/{id}/overlap` | Get fund overlap matrix |
| GET | `/api/portfolio/{id}/rebalance` | Get AI rebalancing plan |

---

## 📊 Sample Output

```json
{
  "portfolioScore": 72,
  "xirr": 14.3,
  "benchmarkXirr": 12.1,
  "totalExpenseDrag": 18400,
  "overlapScore": "HIGH - 68% overlap between HDFC Flexi Cap & Mirae Large Cap",
  "aiRecommendation": "You hold 7 funds but 4 are large-cap heavy with significant overlap. Consolidate to 3-4 funds. Switch ₹1.2L from HDFC Top 100 to a mid-cap fund to improve diversification.",
  "dimensions": {
    "diversification": 58,
    "costEfficiency": 81,
    "returnVsBenchmark": 78,
    "riskAdjusted": 65,
    "goalAlignment": 70,
    "rebalanceNeeded": 60
  }
}
```

---

## 💡 Business Impact

- **14 crore+** demat account holders in India
- Average investor overpays **₹18,000/year** in overlapping expense ratios
- Financial advisors charge **₹25,000+/year** — this does it free in 10 seconds
- Target: **1% adoption = 1.4M users**, saving **₹2,520 crore annually**

---

## 📁 Project Structure

```
mf-portfolio-xray/
├── backend/
│   ├── src/main/java/com/etai/portfolioxray/
│   │   ├── controller/PortfolioController.java
│   │   ├── service/
│   │   │   ├── PdfParserService.java
│   │   │   ├── XirrCalculatorService.java
│   │   │   ├── OverlapAnalysisService.java
│   │   │   ├── AmfiApiService.java
│   │   │   └── ClaudeAiService.java
│   │   └── model/
│   │       ├── Portfolio.java
│   │       └── FundHolding.java
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UploadPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── RebalancePlan.jsx
    │   └── App.jsx
    └── package.json
```

---

## 🎥 Demo

[Watch 3-minute demo video  ](#) | [Live Demo](#)

---

## 👤 Author

**Rakesh Banoth** | rakeshrake461@gmail.com | B.Tech CS 2026
