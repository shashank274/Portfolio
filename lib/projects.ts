// All site copy for the projects. Rule: only facts Shashank has confirmed. No invented numbers.

export type Lens = "business" | "technical";

export type Project = {
  slug: string;
  number: string;
  name: string;
  sector: string;
  tagline: string;
  demo: string;
  summary: Record<Lens, string>;
  business: { problem: string; who: string; did: string; changed: string };
  technical: {
    architecture: string[][]; // rows of boxes, top to bottom
    steps: string[];
    pieces: { title: string; text: string }[];
    stack: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "hoistra",
    number: "01",
    name: "Hoistra",
    sector: "Facilities management",
    tagline: "AI platform for facilities management",
    demo: "/demos/hoistra",
    summary: {
      business:
        "Facilities and property teams keep their data scattered across many tools. Hoistra lets them ask in plain English and get one answer, with human sign-off on every data migration step. I built almost all of it myself.",
      technical:
        "A \"Single Door\" orchestrator routes each question to 7 specialist agents, runs them in parallel and combines the answers. A LangGraph schema mapper brings in old data with 4 human approval gates.",
    },
    business: {
      problem:
        "Facilities and property teams keep their data scattered across many tools: assets, work orders, vendor contracts, compliance certificates, energy meters. Answering a simple question like \"which buildings have certificates expiring this month\" meant digging through several systems.",
      who: "Facilities and property teams who look after buildings, their contracts, their compliance and their energy use.",
      did: "I built almost all of it myself: one place to ask questions in plain English, and a way to move a new customer's old data in where a person approves every step.",
      changed:
        "Teams ask in plain English and get one answer instead of searching several systems. Moving a new customer's old data in has human approval at every step, so nothing changes without a person signing off.",
    },
    technical: {
      architecture: [
        ["Question in plain English"],
        ["Single Door orchestrator"],
        ["Compliance", "Contracts", "Energy", "Work orders", "Document RAG", "Data migration", "DB reader"],
        ["PostgreSQL + pgvector", "Redis", "OpenTelemetry · Prometheus · Grafana"],
      ],
      steps: [
        "The Single Door orchestrator reads the question and picks which of the 7 specialist agents should answer it.",
        "The chosen agents run in parallel. Each one is defined by a single skill file that is both its routing description and its instructions.",
        "Agents read from PostgreSQL and pgvector, apply country compliance packs or energy benchmarks, and return their part of the answer.",
        "The orchestrator combines the parts into one answer, and every step is traced with OpenTelemetry.",
      ],
      pieces: [
        { title: "Schema mapper", text: "An AI mapper on LangGraph converts CSV, Excel or live Fiix exports into Hoistra's format, with 4 human approval gates." },
        { title: "Compliance packs", text: "Country packs for the UK (54 certificate types), the UAE and the US." },
        { title: "Energy benchmarking", text: "Buildings are benchmarked against CIBSE TM46, with anomaly detection." },
        { title: "Document RAG", text: "Retrieval over documents on pgvector, linked back to the assets they describe." },
        { title: "Observability", text: "Full tracing with OpenTelemetry, Prometheus and Grafana, plus an LLM cost tracker." },
      ],
      stack: ["Python", "FastAPI", "LangChain", "LangGraph", "Claude", "OpenAI", "PostgreSQL + pgvector", "Redis", "React", "Docker", "Azure DevOps"],
    },
  },
  {
    slug: "erp-ai",
    number: "02",
    name: "ERP-AI suite",
    sector: "Finance",
    tagline: "Finance automation on Microsoft Dynamics 365",
    demo: "/demos/erp-ai",
    summary: {
      business:
        "Finance teams were typing invoices into the ERP, checking expenses and matching bank lines by hand. I built the services that automate this, and the reconciliation engine together with the business and the ERP team. Manual reconciliation work dropped by 80%.",
      technical:
        "Five services: document extraction with Azure Document Intelligence, a RAG agent that double-checks it, a 14-rule policy guardrails engine, LLM-scored receipt matching and a reconciliation assistant.",
    },
    business: {
      problem:
        "Finance teams were typing invoice data into the ERP by hand, checking expenses against policy by hand, and matching bank lines to the ledger one at a time.",
      who: "Finance teams working in Microsoft Dynamics 365 / Business Central, plus the business stakeholders and the ERP team who run it.",
      did: "I built the five services myself. The reconciliation matching engine I built together with the business stakeholders and the ERP team, so it fitted how they actually close the books.",
      changed:
        "The reconciliation matching engine cut manual reconciliation work by 80%. Every expense is checked against company policy before it's paid, and every decision is logged for audit.",
    },
    technical: {
      architecture: [
        ["Invoices", "Receipts", "Bank statements", "IDs"],
        ["Azure Document Intelligence", "RAG double-check agent"],
        ["Policy guardrails", "Receipt matching", "Reconciliation assistant", "HR policy RAG"],
        ["Dynamics 365 / Business Central", "Power BI"],
      ],
      steps: [
        "Azure Document Intelligence extracts data from invoices, receipts, bank statements and IDs.",
        "A separate RAG agent re-reads the same documents to double-check amounts, dates and invoice numbers. When they disagreed, I checked the source myself.",
        "A policy guardrails engine with 14 rules returns PASS, SOFT_BLOCK or HARD_BLOCK with a risk score before anything is paid.",
        "Receipts are matched with an LLM score (0.90+ auto-match, 0.75 to 0.90 human review), and the reconciliation assistant matches bank lines to the ledger.",
      ],
      pieces: [
        { title: "Guardrails engine", text: "14 policy rules, three outcomes (PASS / SOFT_BLOCK / HARD_BLOCK) and a risk score." },
        { title: "Receipt matching", text: "LLM-scored. 0.90 and above auto-matches, 0.75 to 0.90 goes to a person." },
        { title: "Reconciliation assistant", text: "One-to-many matching, variance explanations (bank charges, FX, rounding, timing) and a 48-hour SLA." },
        { title: "HR policy assistant", text: "A RAG assistant over HR policy PDFs that answers with citations." },
      ],
      stack: ["Python", "FastAPI", "Azure AI Document Intelligence", "Azure AI Search", "OpenAI", "PostgreSQL", "Dynamics 365 / Business Central", "Power BI"],
    },
  },
  {
    slug: "pearity",
    number: "03",
    name: "Pearity.ai",
    sector: "Marketing & agencies",
    tagline: "AI content platform for agencies, live in production",
    demo: "/demos/pearity",
    summary: {
      business:
        "Agencies need content that stays on-brand, AI costs under control and work approved. Pearity gives each brand its own workspace and credit budget and checks work against the brand. Live in production; I worked mainly on the backend.",
      technical:
        "A Go API behind a Next.js app on Azure Container Apps: a generation engine with provider failover, a per-brand credit ledger and OCR brand checks at over 95% accuracy.",
    },
    business: {
      problem:
        "Agencies creating content for brands need to stay on-brand, keep AI costs under control and get work approved.",
      who: "Agencies producing image, video and audio content for the brands they work with.",
      did: "I worked mainly on the backend: the engine that runs every generation, the credit budgets and the brand checks.",
      changed:
        "Each brand has its own workspace and credit budget, and work is checked against the real brand before it reaches the client. The brand checks run at over 95% accuracy, and the platform is live in production.",
    },
    technical: {
      architecture: [
        ["Next.js app"],
        ["Go API on Azure Container Apps"],
        ["Generation engine", "Credit ledger", "OCR brand checks", "Daily health report"],
        ["OpenAI", "Gemini", "Kling", "PostgreSQL"],
      ],
      steps: [
        "A user in a brand workspace asks for an image, video or audio piece through the web app.",
        "The Go API checks the brand's credit ledger and funds the job.",
        "The production engine sends the job to an AI provider and fails over to a backup provider when one runs out of credit.",
        "The result is checked against the brand with OCR. If a job fails, the brand is refunded exactly once.",
      ],
      pieces: [
        { title: "Provider failover", text: "Automatic switch to a backup provider when one runs out of credit." },
        { title: "Credit ledger", text: "Per brand, with fund / defund and refunds exactly once per failed job." },
        { title: "OCR brand validation", text: "Work is checked against the real brand at over 95% accuracy." },
        { title: "Daily health report", text: "Sent at 09:00 by only one of the running servers." },
      ],
      stack: ["Go", "PostgreSQL", "Azure Container Apps", "OpenAI", "Gemini", "Kling", "OCR"],
    },
  },
  {
    slug: "trace-lab",
    number: "04",
    name: "Trace Lab",
    sector: "AI quality & trust",
    tagline: "Making AI answers checkable",
    demo: "/demos/trace-lab",
    summary: {
      business:
        "Before a business can trust an AI system, someone has to check its answers. Trace Lab lets domain experts review every step and mark it right or wrong, and those reviews become tests for every new release. I built it myself.",
      technical:
        "Reads Hoistra's runs read-only and shows a timeline of every agent, model call and database read. Reviewer labels feed golden sets, LLM judges per failure type and run-to-run comparison.",
    },
    business: {
      problem:
        "Before a business can trust an AI system, someone has to check that its answers are right and find where it goes wrong. Looking only at the final answer hides most of the mistakes.",
      who: "Domain experts who know what a right answer looks like, and the team releasing new versions of the AI.",
      did: "I built it myself, as a companion to Hoistra.",
      changed:
        "Domain experts can review every step behind an answer and mark it right or wrong. Those reviews become test sets that check every new version before release.",
    },
    technical: {
      architecture: [
        ["Hoistra runs (read-only)"],
        ["Answer timeline: agent · model calls · DB reads"],
        ["Reviewer labels: Right / Wrong / Not sure"],
        ["Golden sets", "LLM judges per failure type", "Run-to-run comparison"],
      ],
      steps: [
        "Trace Lab reads Hoistra's runs read-only and never changes them.",
        "Each answer is shown as a timeline: the agent, every model call, every database read.",
        "Reviewers highlight any text and label it Right, Wrong or Not sure, with a note.",
        "Labels feed golden sets, LLM judges per failure type, and comparison between runs, so each new version is checked before release.",
      ],
      pieces: [
        { title: "Timeline view", text: "Every step behind an answer, in order." },
        { title: "Span labelling", text: "Highlight any text and mark it Right / Wrong / Not sure with a note." },
        { title: "Golden sets", text: "Reviewed answers become test sets." },
        { title: "LLM judges", text: "One judge per failure type, plus run-to-run comparison." },
      ],
      stack: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "React"],
    },
  },
];

export const earlierWork = [
  { name: "Agentic AI platform", text: "My first big build at Plenum: finance, HR and legal agents with LangGraph, AutoGen and an MCP server. Built in full, shelved before it went into use." },
  { name: "Customer segmentation & market basket analysis", text: "K-Means segments, RFM scoring and association rules on retail data.", href: "https://github.com/shashank274/Data-Science-Analytics" },
  { name: "Stock analysis chatbot", text: "GPT function calling on live market data.", href: "https://github.com/shashank274/Financial_Stock_Assistant_Chatbot" },
  { name: "Credit card fraud detection", text: "92.39% test accuracy on a 578:1 imbalanced dataset.", href: "https://github.com/shashank274/CreditCard_Fraud_Detection" },
  { name: "Pill dispensing system", text: "IoT and blockchain capstone. Best Poster Award at the AEIT Research Colloquium." },
];

export const LINKS = {
  email: "shashank.kanangi@hotmail.com",
  linkedin: "https://www.linkedin.com/in/shashankkanangi",
  github: "https://github.com/shashank274",
};
