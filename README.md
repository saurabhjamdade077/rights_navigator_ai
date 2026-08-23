# ⚖️ Rights Navigator AI - Indian Citizen Legal Rights & RTI Assistant

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini_/_OpenAI-4285F4.svg?style=flat&logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Empowering Indian citizens to understand their statutory rights, resolve everyday legal grievances, and generate ready-to-file RTI applications without initial expensive legal fees.**

---

## 📌 Overview

**Rights Navigator AI** is an intelligent, RAG-grounded citizen empowerment platform built specifically for Indian law. Everyday citizens frequently face issues like withheld rental security deposits, e-commerce refund denials, unpaid full-and-final (FnF) salaries, or civic infrastructure delays. 

Instead of dealing with complex legal jargon, users simply describe their situation in plain language. Rights Navigator cross-references verified Indian statutory provisions, explains legal rights in simple terms, provides step-by-step resolution roadmaps, and automatically drafts formal Legal Demand Notices and Section 6(1) RTI applications.

---

## ✨ Key Features

- 🏛️ **Plain-Language Statutory Explanations**: Translates complex sections into accessible, easy-to-understand rights.
- 📋 **Concrete 2-3 Actionable Steps**: Step-by-step roadmap tailored to the dispute with specific timelines and authority routing.
- ✉️ **One-Click Legal Demand Notice Generator**: Auto-drafts formal notice templates that users can copy or download as `.txt`.
- 📜 **Auto-Filled Section 6(1) RTI Applications**: Generates structured Right to Information applications with competent Public Authority designations, fee guidelines (₹10 / BPL exempt), and 30-day mandate rules.
- 💬 **Interactive AI Follow-up Assistant**: Grounded conversational assistant to answer case-specific questions, penalty clauses, and court procedures.
- 📚 **Searchable Indian Legal Knowledge Base**: Built-in repository of statutory codices, rules, and enforceable remedies.
- 🎨 **Modern Legal-Tech UI/UX with Law Backdrops**: Dynamic law photo backgrounds (Scales of Justice, Supreme Pillars, Law Library, Courtroom Gavel) with custom opacity controls and glassmorphic card design.

---

## ⚖️ Core Legal Frameworks Covered

| Domain | Statutory Framework | Key Covered Topics |
| :--- | :--- | :--- |
| 🏠 **Tenant Rights** | **Model Tenancy Act, 2021** & State Rent Acts | Security deposit refunds, unlawful lockouts, notice periods, 24-hour entry notice rules. |
| 🛍️ **Consumer Protection** | **Consumer Protection Act, 2019 (CPA)** | Defective products, e-commerce refund refusals, misleading ads, e-Daakhil filing, 2-year limitation. |
| 💼 **Workplace & Labour** | **Payment of Wages Act, 1936** & Labour Codes | Withheld FnF salary, delayed relieving letters, unlawful termination, POSH protections. |
| 📄 **Civic & RTI** | **Right to Information Act, 2005** | Public works tenders, road repairs, pending pensions, exam answer sheets, PIO 30-day deadlines. |

---

## 🏗️ System Architecture

```
rights_navigator_ai/
├── backend/
│   ├── data/                      # Codified Indian statutory provisions (JSON)
│   │   ├── consumer_protection_india.json
│   │   ├── rti_act_india.json
│   │   ├── tenant_rights_india.json
│   │   └── workplace_rights_india.json
│   ├── llm/                       # LLM abstraction layer (Gemini / OpenAI / Mock)
│   │   ├── factory.py
│   │   ├── gemini_client.py
│   │   ├── openai_client.py
│   │   └── mock_client.py
│   ├── config.py                  # Environment & app configuration
│   ├── main.py                    # FastAPI application & API routes
│   ├── models.py                  # Pydantic data schemas
│   ├── navigator_service.py       # Core dispute analysis & prompt orchestration
│   ├── retriever.py               # Keyword & semantic statutory retriever
│   └── test_backend.py            # Automated backend integration tests
├── frontend/
│   ├── src/
│   │   ├── components/            # React UI components
│   │   │   ├── DisclaimerBanner.jsx
│   │   │   ├── DisputeForm.jsx
│   │   │   ├── FollowUpChat.jsx
│   │   │   ├── KnowledgeDrawer.jsx
│   │   │   ├── KnowledgeExplorer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NextStepsTimeline.jsx
│   │   │   ├── RTIDraftCard.jsx
│   │   │   └── RightsAnalysisView.jsx
│   │   ├── App.jsx                # Main application view & backdrop manager
│   │   ├── index.css              # Custom glassmorphism & Tailwind styles
│   │   └── main.jsx               # React entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json                # Vercel proxy & rewrite configuration
│   └── vite.config.js
├── render.yaml                    # Render Blueprint configuration
├── requirements.txt               # Root Python dependencies
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

### 1. Clone the Repository
```bash
git clone https://github.com/saurabhjamdade077/rights_navigator_ai.git
cd rights_navigator_ai
```

### 2. Backend Setup
```bash
# Create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `.env` to configure your preferred LLM provider:
```env
LLM_PROVIDER=gemini       # Options: gemini | openai | mock
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the FastAPI server:
```bash
uvicorn backend.main:app --reload --port 8000
```
Backend will be live at `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

Run the comprehensive test suite to verify data loading, category detection, RAG retrieval, and LLM orchestration:
```bash
python backend/test_backend.py
```

---

## 🌐 Deployment Guide

### Deploy Backend to [Render](https://render.com)
1. Create a new **Web Service** on Render and link your repository.
2. Set **Root Directory** to `.` (or leave empty).
3. Set **Runtime** to `Python 3`.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable: `GEMINI_API_KEY` (and set `LLM_PROVIDER=gemini`).

### Deploy Frontend to [Vercel](https://vercel.com)
1. Import your repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Update `frontend/vercel.json` with your Render backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://<your-render-app-name>.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
5. Click **Deploy**.

---

## 👨‍💻 Author & Connect

**Saurabh Jamdade**
- 💼 **LinkedIn**: [![LinkedIn](https://img.shields.io/badge/LinkedIn-Saurabh_Jamdade-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/saurabh-jamdade-b98259373/)
- 🐙 **GitHub**: [![GitHub](https://img.shields.io/badge/GitHub-saurabhjamdade077-181717?style=flat&logo=github)](https://github.com/saurabhjamdade077/)

---

## 🛡️ Legal Disclaimer

> **IMPORTANT**: Rights Navigator AI is an automated educational platform designed to empower citizens by translating Indian statutory provisions into plain language. It does **not** constitute formal legal advice, client-attorney privilege, or formal representation before courts of law. For formal litigation or legal representation, please consult an advocate enrolled with the Bar Council of India.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
