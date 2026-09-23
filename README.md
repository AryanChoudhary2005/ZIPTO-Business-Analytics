# ZIPTO — Business Analytics Dashboard

> **Turning messy dark-store operations data into clear, decision-ready insights.**

ZIPTO is an interactive **Business Analytics Dashboard** built to analyse dark-store performance across **store profitability, delivery operations, products, and promotions**.

The project combines cleaned business datasets, analytical thinking, interactive visualisations, and a web-based dashboard into one decision-support experience.

---

## 🌐 Live Dashboard

**Website:**  
https://zipto-business-analytics.vercel.app/

**GitHub:**  
https://github.com/AryanChoudhary2005/ZIPTO-Business-Analytics

> If the live URL changes after deployment, replace the website link above with the final Vercel URL.

---

## 🎯 What This Project Answers

Instead of simply showing charts, ZIPTO is designed around three business questions:

### 01 — Store Performance
**Which stores make money, and which stores lose it?**

Analyse:
- Store orders
- Store contribution
- Profitability
- Return rates
- Store-level performance

### 02 — Delivery & Fulfilment
**Are we delivering what we say we deliver?**

Analyse:
- On-time delivery
- Late deliveries
- Return rates
- Average delivery time
- Store-level delivery performance
- Daily delivery trends

### 03 — Product & Promotions
**What are we selling, and what are discounts costing us?**

Analyse:
- Product categories
- Units sold
- Gross revenue
- Profit margins
- Promotional codes
- Discount costs
- Store and category performance

---

## 📊 Dashboard Overview

| Dashboard | Business Focus | Key Areas |
|---|---|---|
| 🏪 Store Performance | Profitability | Orders, P&L, Contribution, Returns |
| 🚚 Delivery & Fulfilment | Operations | On-time %, Late Orders, Delivery Time, Returns |
| 🛒 Product & Promotions | Revenue & Pricing | Products, Categories, Revenue, Discounts |

Each dashboard contains interactive filters, visual analysis, KPI summaries, and business insights.

---

## 💡 Key Business Insights

The dashboard is designed to surface operational problems rather than just display numbers.

### Store Performance
- Identifies profitable and loss-making stores.
- Highlights stores with unusually high return rates.
- Compares store contribution against operational costs such as rent.
- Helps identify locations that require operational investigation.

### Delivery & Fulfilment
- Highlights stores with weaker on-time delivery performance.
- Compares delivery time and return behaviour across stores.
- Quantifies the potential contribution recovery associated with reducing excess returns.
- Tracks delivery performance trends over time.

### Product & Promotions
- Shows which categories generate volume and revenue.
- Compares category profitability.
- Measures the cost of promotional discounts.
- Helps identify where promotions may be affecting contribution.

---

## 🧩 What Makes It More Than a Dashboard?

The project follows a simple analytics workflow:

```text
Raw Business Data
       ↓
Data Cleaning & Preparation
       ↓
Exploratory Analysis
       ↓
Business Metrics
       ↓
Interactive Visualisations
       ↓
Insights & Recommendations
       ↓
Decision Support
```

The goal is to move from:

**"What happened?" → "Why does it matter?" → "What should be investigated?"**

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Data & Analytics
- Microsoft Excel
- Excel Pivot Tables
- Business KPI analysis
- Data cleaning
- Aggregation and segmentation

### Visualisation
- Interactive charts
- KPI cards
- Donut / pie visualisations
- Store-level comparisons
- Trend analysis

### Version Control & Deployment
- Git
- GitHub
- Vercel

---

## 📁 Project Structure

```text
ZIPTO-Business-Analytics/
│
├── index.html
├── app.js
├── data.js
├── styles.css
├── package.json
├── README.md
│
└── data/
    ├── store_performance_dataset_clean.xlsx
    ├── Delivery_and_fulfilment.xlsx
    ├── Product_and_Promotions.xlsx
    └── dashboardData.json
```

---

## 📦 Dataset Sources

The dashboard uses three cleaned business datasets covering different parts of the dark-store operation.

### Store Performance

```text
store_performance_dataset_clean.xlsx
```

Covers store-level operational and financial performance.

### Delivery & Fulfilment

```text
Delivery_and_fulfilment.xlsx
```

Covers delivery trips, delivery partners, timing, status and store-level fulfilment performance.

### Product & Promotions

```text
Product_and_Promotions.xlsx
```

Covers products, categories, orders, promotional codes, revenue and discount information.

The source workbooks are included in the repository and can also be accessed through the dashboard's **Download Source Data** controls.

---

## 📈 Dashboard Features

### Interactive KPI Cards
Quickly understand the most important business metrics.

### Store Filters
Explore performance for individual stores instead of relying only on network-level averages.

### Business-Focused Charts
Charts are structured around actual business questions rather than generic visualisations.

### Detailed Tables
Inspect the underlying dashboard metrics at a more granular level.

### Source Data Downloads
The original analysis workbooks used for the dashboards are available directly from the website.

### Responsive UI
The interface is designed to remain usable across different screen sizes.

---

## 🔍 Example Analytical Questions

The project can be used to investigate questions such as:

- Which stores are profitable?
- Which stores are generating losses?
- Which stores have the highest return rates?
- Where are delivery delays concentrated?
- Which stores have the longest average delivery time?
- How does on-time delivery vary by store?
- Which categories sell the most units?
- Which categories generate the most revenue?
- Where are profit margins strongest?
- Which promotional codes generate the highest discount cost?
- Where could operational improvements potentially recover contribution?

---

## 🚀 Run the Project Locally

Because this is a static web application, no backend server or database is required.

### 1. Clone the repository

```bash
git clone https://github.com/AryanChoudhary2005/ZIPTO-Business-Analytics.git
```

### 2. Enter the project directory

```bash
cd ZIPTO-Business-Analytics
```

### 3. Start a local server

Using Python:

```bash
python -m http.server 5500
```

Or using `serve`:

```bash
npx serve .
```

### 4. Open the dashboard

For Python:

```text
http://localhost:5500
```

For `serve`:

```text
http://localhost:3000
```

---

## ☁️ Deployment

The project is designed for static hosting and can be deployed through services such as Vercel.

### Vercel Deployment Flow

```text
GitHub Repository
        ↓
     Vercel
        ↓
 Static Deployment
        ↓
   Live Dashboard
```

For a static HTML/CSS/JavaScript project, no backend configuration is required.

---

## 🧠 Skills Demonstrated

This project demonstrates practical experience in:

- Business Analytics
- Data Cleaning
- Exploratory Data Analysis
- KPI Development
- Excel
- Pivot Tables
- Data Visualisation
- Dashboard Design
- Business Problem Solving
- JavaScript
- Git & GitHub
- Deployment

---

## 🎓 Project Context

**Project Type:** Business Analytics / Dashboard Project  
**Domain:** Dark Store / Quick Commerce Operations  
**Focus:** Operational Performance, Delivery, Revenue & Promotions

Built as a practical analytics project to demonstrate how raw operational data can be transformed into an interactive business intelligence experience.

---

## 🔮 Future Improvements

Potential extensions include:

- [ ] Advanced date-range filtering
- [ ] Store-to-store comparison mode
- [ ] Automated data refresh
- [ ] Additional profitability metrics
- [ ] Product-level drill-down
- [ ] Promotion effectiveness analysis
- [ ] More advanced operational forecasting
- [ ] Mobile dashboard optimisation
- [ ] Automated reporting

---

## 👨‍💻 Author

### Aryan Choudhary

**B.Tech — Information Technology**

Interested in **Data Analytics, Business Intelligence, Software Development, and Data-driven Problem Solving.**

**GitHub:**  
https://github.com/AryanChoudhary2005

---

## ⭐ Project

If you find the project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

### ZIPTO

**Raw Data → Analysis → Visualisation → Insight → Decision**
