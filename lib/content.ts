// All site copy lives here so it can be edited in one place.
// Rule for this file: only facts Shashank has confirmed. No invented numbers.

export const site = {
  name: "Shashank Kanangi",
  shortName: "S. Kanangi",
  role: "Data Scientist & AI Engineer",
  location: "Amsterdam, Netherlands",
  email: "shashank.kanangi@hotmail.com",
  linkedin: "https://www.linkedin.com/in/shashankkanangi",
  github: "https://github.com/shashank274",
  // Put the PDF in /public and set this to "/resume.pdf". While null, the button is hidden.
  resumeUrl: null as string | null,
  headline: "Production AI, built end to end.",
  intro:
    "I'm Shashank, a Data Scientist and AI Engineer. I build multi-agent platforms, document AI and finance automation, and I care about how people actually check and trust what AI does. MSc student at the University of Amsterdam.",
  introShort:
    "I'm Shashank, a Data Scientist and AI Engineer. I build multi-agent platforms, document AI and finance automation. MSc student at the University of Amsterdam.",
  description:
    "Shashank Kanangi, Data Scientist & AI Engineer in Amsterdam. Multi-agent platforms, document AI and finance automation.",
};

export type DiagramNode = { label: string; note?: string; highlight?: boolean };
export type Project = {
  slug: string;
  step: string;
  name: string;
  kind: string;
  agentLabel: string;
  cardText: string;
  facts: { label: string; value: string }[];
  outcome?: string;
  summary: string;
  meta: { label: string; value: string }[];
  problem: string[];
  howIntro: string;
  diagram: { layers: DiagramNode[][]; caption: string };
  flow: { title: string; text: string }[];
  pieces: { title: string; text: string }[];
  stack: { label: string; value: string }[];
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "hoistra",
    demo: "/demos/hoistra",
    step: "01",
    name: "Hoistra",
    kind: "Multi-agent platform",
    agentLabel: "agent: orchestrator · built almost entirely by me",
    cardText:
      "An AI platform for facilities teams. You ask a question in plain English and one orchestrator sends it to specialist agents for compliance, contracts, energy and work orders, then combines their answers into one reply.",
    facts: [
      { label: "stack", value: "LangGraph, Claude, FastAPI" },
      { label: "data", value: "PostgreSQL + pgvector, Redis" },
      { label: "ui", value: "React + Vite" },
      { label: "ops", value: "OpenTelemetry, Grafana" },
    ],
    outcome: "7 specialist agents, 1 orchestrator",
    summary:
      "An AI platform for facilities teams. Ask a question in plain English, and one orchestrator sends it to the right specialist agents and combines their answers into one reply.",
    meta: [
      { label: "my role", value: "Built almost all of it myself" },
      { label: "where", value: "Plenum Technologies, Dubai" },
      { label: "scale", value: "7 agents, 7+ services, 1 address" },
      { label: "core stack", value: "Python, LangGraph, Claude, React" },
    ],
    problem: [
      "Facilities and property teams keep their data in many places: assets, work orders, vendor contracts, compliance certificates and energy meters. A simple question like \"which buildings have certificates expiring this month\" means digging through several tools.",
      "Moving a customer onto a new system is hard too. Every company's old maintenance software exports its data in a different shape.",
    ],
    howIntro:
      "Everything runs behind one web address. The browser only ever talks to one gateway, which passes each request on to the right service. All services share one PostgreSQL database.",
    diagram: {
      layers: [
        [{ label: "browser" }],
        [{ label: "gateway (nginx)", note: "one address" }],
        [
          { label: "orchestrator", note: "routes questions to agents", highlight: true },
          { label: "ops intelligence", note: "compliance, contracts, energy" },
          { label: "work orders", note: "lifecycle and approvals" },
          { label: "schema mapper", note: "migrates old system data" },
          { label: "doc RAG", note: "answers from documents" },
          { label: "connectors", note: "imports from source systems" },
          { label: "database reader", note: "search across any table" },
        ],
        [{ label: "PostgreSQL 16 + pgvector" }, { label: "Redis job queues" }],
      ],
      caption: "Hoistra's architecture, simplified",
    },
    flow: [
      { title: "question", text: "A user asks something in plain English." },
      { title: "route", text: "The orchestrator works out which areas the question touches and picks the agents for it." },
      { title: "run", text: "The agents run in parallel, each reading the data it owns." },
      { title: "answer", text: "Their results are combined into one reply." },
    ],
    pieces: [
      { title: "One file per agent", text: "Each agent is defined by a single skill file. The orchestrator uses it to pick the agent, and the agent runs with it as its instructions, so the two can never get out of sync." },
      { title: "People approve migrations", text: "When a customer's old data is moved in, the process stops at four checkpoints so a person can approve the mapping before anything changes." },
      { title: "Any old system, one format", text: "An AI schema mapper built on LangGraph turns CSV, Excel or live Fiix exports into Hoistra's own data format." },
      { title: "Compliance by country", text: "Country packs for the UK (54 certificate types), the UAE and the US, with coverage per building, renewal emails and evidence packs." },
      { title: "Energy benchmarks", text: "Meter readings compared against CIBSE TM46 benchmarks, with anomaly detection and monthly reports." },
      { title: "Every run is traced", text: "OpenTelemetry, Prometheus and Grafana across all services, plus a tracker for LLM cost. Trace Lab builds on these traces." },
    ],
    stack: [
      { label: "frontend", value: "React 18, Vite" },
      { label: "backend", value: "Python 3.12, FastAPI, SQLAlchemy, Alembic" },
      { label: "ai", value: "Claude, OpenAI, LangChain, LangGraph, LangSmith" },
      { label: "data", value: "PostgreSQL 16 + pgvector, Redis 7, Azure Blob Storage" },
      { label: "integrations", value: "Fiix CMMS, Microsoft Graph (Outlook)" },
      { label: "delivery", value: "Docker, nginx, Azure DevOps, Azure Container Registry" },
    ],
  },
  {
    slug: "erp-ai",
    demo: "/demos/erp-ai",
    step: "02",
    name: "ERP-AI suite",
    kind: "Finance automation",
    agentLabel: "agent: finance · Microsoft Dynamics 365 · built by me",
    cardText:
      "AI services for finance teams. They read invoices and bank statements, check expenses against company policy, and match bank lines to the ledger, explaining any differences they find.",
    facts: [
      { label: "stack", value: "FastAPI, Azure Doc Intelligence" },
      { label: "ai", value: "RAG, GPT-4o-mini" },
      { label: "data", value: "PostgreSQL, Power BI" },
    ],
    outcome: "80% less manual reconciliation",
    summary:
      "Five AI services for finance teams on Microsoft Dynamics 365. Together they follow a finance document from the moment it arrives to a closed reconciliation.",
    meta: [
      { label: "my role", value: "Built the suite myself" },
      { label: "where", value: "Plenum Technologies, Dubai" },
      { label: "result", value: "80% less manual reconciliation" },
      { label: "core stack", value: "Python, FastAPI, Azure AI" },
    ],
    problem: [
      "Finance teams spend a lot of time on manual work. They type data from invoices and bank statements into the ERP, check expenses against company policy by hand, and match bank lines to ledger entries one at a time.",
      "I built the matching engine together with business stakeholders and the ERP teams, so it fitted how the finance team actually closes the books.",
    ],
    howIntro:
      "Each service does one job and saves its results in a shared PostgreSQL schema, so the next service can pick them up.",
    diagram: {
      layers: [
        [{ label: "invoices, receipts, bank statements" }],
        [{ label: "document extraction", note: "Azure Document Intelligence", highlight: true }],
        [
          { label: "policy guardrails", note: "14 rules, risk score" },
          { label: "transaction matching", note: "receipts to card spend" },
          { label: "reconciliation assistant", note: "bank lines to ledger", highlight: true },
          { label: "HR policy assistant", note: "answers with citations" },
        ],
        [{ label: "PostgreSQL (erp_ai)" }, { label: "Dynamics 365 / Business Central" }],
      ],
      caption: "The ERP-AI suite, simplified",
    },
    flow: [
      { title: "read", text: "A document comes in and its fields are extracted and cleaned up." },
      { title: "check", text: "Expenses and invoices are checked against company policy and given a risk score." },
      { title: "match", text: "Bank lines are matched to ledger entries, including one-to-many matches." },
      { title: "close", text: "Differences are explained and safe fixes are suggested for the team to apply." },
    ],
    pieces: [
      { title: "80% less manual work", text: "The reconciliation matching engine cut manual reconciliation effort by 80%." },
      { title: "A second check on extraction", text: "A separate RAG agent reads the same documents to double-check amounts, dates and invoice numbers. When the two disagreed, I checked the source myself." },
      { title: "Policy checks before payment", text: "14 rules, from spending caps and missing receipts to weekend spend and duplicates. Each item gets PASS, SOFT_BLOCK or HARD_BLOCK and a risk score, and every decision is logged." },
      { title: "Confident matches only", text: "An LLM scores each possible receipt match. 0.90 and above is matched automatically, and 0.75 to 0.90 goes to a person to review." },
      { title: "Differences explained", text: "The assistant classifies why amounts differ (bank charges, FX, rounding, timing), suggests fixes, and tracks each item against a 48-hour SLA." },
      { title: "HR answers with sources", text: "A RAG assistant over HR policy PDFs answers with numbered citations and a confidence score, even on messy two-column documents." },
    ],
    stack: [
      { label: "backend", value: "Python, FastAPI, SQLAlchemy (async), asyncpg" },
      { label: "ai", value: "Azure AI Document Intelligence, Azure AI Search, OpenAI" },
      { label: "data", value: "PostgreSQL, pandas, RapidFuzz" },
      { label: "erp", value: "Microsoft Dynamics 365, Business Central" },
      { label: "reporting", value: "Power BI" },
    ],
  },
  {
    slug: "pearity",
    demo: "/demos/pearity",
    step: "03",
    name: "Pearity.ai",
    kind: "Live product · backend",
    agentLabel: "agent: production · live product · backend",
    cardText:
      "A live AI content platform for agencies. I worked mainly on the backend: generation across many AI providers, automatic failover when one runs out of credit, brand credit budgets and OCR brand checks.",
    facts: [
      { label: "stack", value: "Go, PostgreSQL" },
      { label: "ai", value: "GPT-4o, Gemini, Kling, OCR" },
      { label: "cloud", value: "Azure Container Apps" },
    ],
    outcome: "95%+ brand validation accuracy",
    summary:
      "A live AI content platform for agencies. Teams research, brief, generate images and video, then review and approve the work, inside a workspace that keeps each brand on track. I worked mainly on the backend.",
    meta: [
      { label: "my role", value: "Backend, mainly" },
      { label: "where", value: "Plenum Technologies, Dubai" },
      { label: "status", value: "Live in production" },
      { label: "core stack", value: "Go, PostgreSQL, Azure" },
    ],
    problem: [
      "Agencies making content for brands need to stay on-brand, keep costs under control and get work approved, while using many different AI image, video and audio tools.",
      "Each of those tools has its own API, its own pricing and its own way of failing.",
    ],
    howIntro:
      "The browser talks to one address. The web app passes API calls to the Go backend, which runs every generation, charges the brand's credit pool and talks to the AI providers.",
    diagram: {
      layers: [
        [{ label: "browser" }],
        [{ label: "web app (Next.js)" }],
        [{ label: "Go API", note: "jobs, credits, brand checks", highlight: true }],
        [
          { label: "PostgreSQL" },
          { label: "image & video providers", note: "with failover" },
          { label: "OpenAI / Gemini" },
          { label: "OCR brand validation", highlight: true },
        ],
      ],
      caption: "Pearity's backend, simplified",
    },
    flow: [
      { title: "request", text: "A team member picks a model and writes a prompt." },
      { title: "check", text: "The backend checks the brand's credit pool and the provider's balance." },
      { title: "generate", text: "The job runs with the provider, or a backup provider if the first is out of credit." },
      { title: "validate", text: "Results are checked against the real brand, and failed jobs are refunded once." },
    ],
    pieces: [
      { title: "Brand checks at 95%+", text: "Uploaded images build a brand profile, and work is checked against the real brand details with OCR, at over 95% accuracy." },
      { title: "One engine, many providers", text: "Image, video, audio and text generation across many AI providers, behind one job system." },
      { title: "Automatic failover", text: "If one video provider runs out of credit, eligible jobs move to a backup provider so the team can keep working." },
      { title: "Credits per brand", text: "Each brand has its own credit pool. Admins move credits between the organisation and its brands, and failed jobs are refunded exactly once." },
      { title: "Ops answers without an LLM", text: "Common admin questions are answered straight from the database, so they still work if the AI providers are down." },
      { title: "One health email a day", text: "A 09:00 note with uptime, response times, failed jobs and spend, sent by only one of the running servers." },
    ],
    stack: [
      { label: "backend", value: "Go, PostgreSQL" },
      { label: "ai", value: "GPT-4o, Gemini, Kling and other generation providers, OCR" },
      { label: "cloud", value: "Azure Container Apps, Azure Files" },
      { label: "mail", value: "Microsoft Graph" },
      { label: "frontend (team)", value: "Next.js, React, TypeScript" },
    ],
  },
  {
    slug: "trace-lab",
    demo: "/demos/trace-lab",
    step: "04",
    name: "Trace Lab",
    kind: "AI evaluation",
    agentLabel: "agent: reviewer · human in the loop · built by me",
    cardText:
      "A review tool for checking Hoistra's AI answers step by step. Experts mark each step right or wrong, and those labels become test sets and automated judges.",
    facts: [
      { label: "stack", value: "FastAPI, React" },
      { label: "evals", value: "golden sets, LLM judges" },
      { label: "data", value: "PostgreSQL (read-only on Hoistra)" },
    ],
    summary:
      "A review tool for checking AI answers step by step. Experts see every step an answer was built from, mark it right or wrong, and those labels become test sets and automated judges.",
    meta: [
      { label: "my role", value: "Built it myself" },
      { label: "where", value: "Plenum Technologies, Dubai" },
      { label: "works with", value: "Hoistra" },
      { label: "core stack", value: "Python, FastAPI, React" },
    ],
    problem: [
      "When an AI system answers business questions, someone has to check whether the answers are actually right, and find where in the chain of steps things go wrong.",
      "Looking only at the final answer hides most of the mistakes.",
    ],
    howIntro:
      "Trace Lab sits next to Hoistra. It reads Hoistra's questions and answers without ever changing them, and keeps its own labels in a separate database.",
    diagram: {
      layers: [
        [{ label: "Hoistra runs", note: "read-only" }],
        [{ label: "Trace Lab service", note: "timeline of every step", highlight: true }],
        [
          { label: "reviewers", note: "right / wrong / not sure" },
          { label: "golden sets", note: "test cases" },
          { label: "LLM judges", note: "one per failure type", highlight: true },
          { label: "run comparison" },
        ],
        [{ label: "Trace Lab database" }, { label: "CSV export" }],
      ],
      caption: "How Trace Lab fits with Hoistra",
    },
    flow: [
      { title: "trace", text: "Every step of an answer is shown: the agent, each model call, each database read." },
      { title: "label", text: "A reviewer highlights any part of a step and marks it Right, Wrong or Not sure, with a note." },
      { title: "collect", text: "Labels are gathered in one place with who gave each one, and can be exported." },
      { title: "judge", text: "Labels feed golden sets and LLM judges that check future runs." },
    ],
    pieces: [
      { title: "Every step visible", text: "A timeline of each answer: which agent ran, every model call, every database read, and the final answer." },
      { title: "Label any piece", text: "Select any text in a step, or a whole step, and mark it Right, Wrong or Not sure with a note." },
      { title: "Golden sets", text: "Labelled cases become test sets, so new versions can be compared run against run." },
      { title: "Judges per failure", text: "LLM judges for each type of failure, with readiness checks and cost estimates before they run." },
      { title: "Never touches Hoistra", text: "It reads Hoistra's data read-only and keeps its own records in a separate database." },
      { title: "Access by role", text: "Domain experts, testers, admins and users, managed from Hoistra, with every change audited." },
    ],
    stack: [
      { label: "backend", value: "Python, FastAPI, SQLAlchemy (async), asyncpg" },
      { label: "frontend", value: "React 18, Vite" },
      { label: "data", value: "PostgreSQL" },
      { label: "runtime", value: "Docker, nginx" },
    ],
  },
];

export const moreProjects = [
  { name: "Agentic AI platform", text: "My first big build at Plenum: finance, HR and legal agents with LangGraph, AutoGen and an MCP server, with tracing on every run. Built in full, shelved before use." },
  { name: "Stock analysis chatbot", text: "GPT-3.5 function calling on Yahoo Finance data, with SMA, EMA, RSI and MACD. Built in Streamlit." },
  { name: "Fraud detection", text: "Logistic regression on a 578:1 imbalanced dataset, 92.39% test accuracy." },
  { name: "Pill dispensing system", text: "IoT and blockchain capstone. Best Poster Award, AEIT Research Colloquium." },
];

export const about = [
  "I was born and brought up in Dubai, and moved to Amsterdam in 2026 for an MSc in Business IT Management at the University of Amsterdam, on the Amsterdam Merit Scholarship.",
  "Before that I spent just over a year at Plenum Technologies as a Data Scientist and AI Engineer. I built AI systems for real business problems: a multi-agent platform for facilities teams, finance automation on Microsoft Dynamics 365, and the backend of a live content platform.",
  "What interests me most is the human side of AI: how organisations adopt it, and how people can check and trust what it does. That's why I'm drawn to both AI engineering and tech consulting.",
];

export const experience = [
  { when: "Apr 2025 – May 2026", role: "Data Scientist & AI Engineer", org: "Plenum Technologies, Dubai", text: "Built Hoistra, Trace Lab and the ERP-AI suite, and worked on the backend of Pearity.ai. Agents, RAG, document AI and finance automation, deployed on Azure." },
  { when: "Oct 2024 – Jun 2025", role: "Treasurer", org: "IEEE Women in Engineering, Dubai" },
  { when: "Jul – Aug 2024", role: "Data Science Intern", org: "Redington Gulf FZE, Dubai", text: "Cleaned and prepared an enterprise sales dataset, then used K-Means customer segmentation and market basket analysis to give marketing recommendations." },
  { when: "2026 – now", role: "Student Ambassador", org: "University of Amsterdam, Faculty of Economics and Business" },
];

export const education = [
  { when: "Sep 2026 – Jul 2027 (expected)", degree: "MSc Business IT Management", school: "University of Amsterdam", text: "Amsterdam Merit Scholarship: full tuition plus a living allowance. Courses include Data Science and AI for Business, Digital Transformation, and Change Management and Consultancy." },
  { when: "Sep 2022 – 2025", degree: "BSc Information Systems & Management", school: "Manipal Academy of Higher Education, Dubai", text: "CGPA 9.15 out of 10, top 5% of my cohort. Focus on AI and machine learning. Best Poster Award for my capstone, and 2nd place nationally in the MakeX Robotics Competition." },
];

export const skills = [
  { group: "AI & LLMs", items: "LangChain, LangGraph, AutoGen, RAG, MCP, function calling, pgvector, GPT-4o, Gemini, Claude" },
  { group: "Languages & backend", items: "Python, Go, SQL, Java, FastAPI, REST APIs, microservices, async processing" },
  { group: "Cloud & DevOps", items: "Azure Container Apps, Azure DevOps CI/CD, Azure AI Services, Document Intelligence, Docker, Git" },
  { group: "Data & ML", items: "PostgreSQL, Redis, pandas, scikit-learn, TensorFlow, ETL, clustering, classification, NLP" },
  { group: "Monitoring & BI", items: "OpenTelemetry, Prometheus, Grafana, Power BI, Tableau, Streamlit" },
  { group: "Microsoft", items: "Dynamics 365, Power Automate, Power Apps, Copilot Studio" },
];
