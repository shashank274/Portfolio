// Sample data for the Hoistra demo. Everything here is made up.

export const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const buildings = [
  { name: "Harbour House", city: "Amsterdam", type: "Office", area: 12400, assets: 86 },
  { name: "Canal Point", city: "Rotterdam", type: "Mixed use", area: 9800, assets: 64 },
  { name: "Riverside Lab", city: "Utrecht", type: "Laboratory", area: 6100, assets: 51 },
  { name: "Westpark Offices", city: "Amsterdam", type: "Office", area: 7300, assets: 29 },
  { name: "Dockside Depot", city: "Rotterdam", type: "Warehouse", area: 15200, assets: 18 },
];

export const certificates = [
  { building: "Canal Point", type: "Fire alarm inspection", vendor: "Brandwacht Services", expires: 9, doc: "CP-FA-2025.pdf" },
  { building: "Harbour House", type: "Legionella risk assessment", vendor: "AquaSafe NL", expires: 16, doc: "HH-LEG-2024.pdf" },
  { building: "Westpark Offices", type: "Lift inspection (LOLER)", vendor: "LiftCare BV", expires: 23, doc: "WP-LIFT-Q3.pdf" },
  { building: "Riverside Lab", type: "Fume cupboard test", vendor: "LabAir Testing", expires: 48, doc: "RL-FUME-2025.pdf" },
  { building: "Dockside Depot", type: "Sprinkler service", vendor: "Brandwacht Services", expires: 71, doc: "DD-SPR-2025.pdf" },
  { building: "Harbour House", type: "Electrical installation (EICR)", vendor: "VoltCheck", expires: -6, doc: "HH-EICR-2021.pdf" },
];

export const workOrders = [
  { id: "WO-1042", building: "Harbour House", issue: "Chiller 2 tripping on high pressure", priority: "High", vendor: "CoolTech HVAC", status: "In progress", slaHours: 6 },
  { id: "WO-1047", building: "Canal Point", issue: "Fire door not closing on level 3", priority: "High", vendor: "SecureDoors", status: "Assigned", slaHours: -3 },
  { id: "WO-1051", building: "Riverside Lab", issue: "Fume cupboard airflow alarm", priority: "High", vendor: "LabAir Testing", status: "Waiting approval", slaHours: 18 },
  { id: "WO-1055", building: "Westpark Offices", issue: "Lift 1 out of service", priority: "Medium", vendor: "LiftCare BV", status: "In progress", slaHours: 30 },
  { id: "WO-1058", building: "Dockside Depot", issue: "Loading bay door sensor fault", priority: "Low", vendor: "SecureDoors", status: "Open", slaHours: 70 },
];

export const vendors = [
  { name: "CoolTech HVAC", sla: 94, accreditation: "Valid", blocked: false },
  { name: "SecureDoors", sla: 71, accreditation: "Expired", blocked: true },
  { name: "LabAir Testing", sla: 88, accreditation: "Valid", blocked: false },
  { name: "LiftCare BV", sla: 82, accreditation: "Valid", blocked: false },
  { name: "VoltCheck", sla: 90, accreditation: "Expired", blocked: true },
  { name: "Brandwacht Services", sla: 97, accreditation: "Valid", blocked: false },
];

export const energy = [
  { building: "Harbour House", eui: 241, benchmark: 215, note: "Weekend HVAC running at 80% load" },
  { building: "Canal Point", eui: 188, benchmark: 215, note: "Within range" },
  { building: "Riverside Lab", eui: 402, benchmark: 380, note: "Fume extract left on overnight twice" },
  { building: "Westpark Offices", eui: 176, benchmark: 215, note: "Within range" },
  { building: "Dockside Depot", eui: 64, benchmark: 70, note: "Within range" },
];

export type StepKind = "route" | "agent" | "llm" | "db" | "doc" | "answer";
export type Step = { kind: StepKind; label: string; detail: string; ms: number; agent?: string };
export type Script = {
  id: string;
  q: string;
  keywords: string[];
  agents: string[];
  steps: Step[];
  answer: () => { text: string; cols: string[]; rows: string[][]; footer?: string; sources: string[] };
};

export const AGENTS = ["compliance", "contracts", "energy", "work orders", "doc-rag", "migration", "database reader"];

export const scripts: Script[] = [
  {
    id: "certs",
    q: "Which buildings have certificates expiring this month?",
    keywords: ["certificate", "certificates", "expir", "compliance", "cert"],
    agents: ["compliance", "doc-rag", "database reader"],
    steps: [
      { kind: "route", label: "Classify question", detail: "topics: compliance, documents · picked 3 agents", ms: 412 },
      { kind: "agent", agent: "compliance", label: "compliance agent", detail: "loads the NL country pack", ms: 96 },
      { kind: "db", agent: "compliance", label: "SELECT certificates", detail: "expiry between today and +30 days · 3 rows", ms: 38 },
      { kind: "agent", agent: "doc-rag", label: "doc-rag agent", detail: "checks each certificate PDF for its real expiry date", ms: 120 },
      { kind: "doc", agent: "doc-rag", label: "Read 3 documents", detail: "hybrid search · dates match the database", ms: 640 },
      { kind: "agent", agent: "database reader", label: "database reader", detail: "joins vendor contact details", ms: 51 },
      { kind: "llm", label: "Write combined answer", detail: "claude · 1,840 tokens in / 312 out", ms: 1290 },
      { kind: "answer", label: "Answer ready", detail: "3 certificates, 3 sources", ms: 0 },
    ],
    answer: () => {
      const rows = certificates
        .filter((c) => c.expires >= 0 && c.expires <= 30)
        .map((c) => [c.building, c.type, day(c.expires), c.vendor]);
      return {
        text: `${rows.length} certificates expire in the next 30 days. The fire alarm inspection at Canal Point is the most urgent. Separately, the electrical certificate at Harbour House has already expired and needs action now.`,
        cols: ["Building", "Certificate", "Expires", "Vendor"],
        rows,
        footer: "Renewal emails can be sent to each vendor from the Compliance page.",
        sources: certificates.filter((c) => c.expires >= 0 && c.expires <= 30).map((c) => c.doc),
      };
    },
  },
  {
    id: "energy",
    q: "Is energy use at Harbour House above benchmark?",
    keywords: ["energy", "benchmark", "eui", "kwh", "consumption", "harbour"],
    agents: ["energy", "database reader"],
    steps: [
      { kind: "route", label: "Classify question", detail: "topics: energy · picked 2 agents", ms: 388 },
      { kind: "agent", agent: "energy", label: "energy agent", detail: "12 months of meter readings", ms: 84 },
      { kind: "db", agent: "energy", label: "SELECT meter_readings", detail: "Harbour House · 3 meters · 26,280 readings", ms: 210 },
      { kind: "agent", agent: "energy", label: "Compare with CIBSE TM46", detail: "general office benchmark", ms: 22 },
      { kind: "agent", agent: "energy", label: "Anomaly check", detail: "weekend load pattern flagged", ms: 140 },
      { kind: "agent", agent: "database reader", label: "database reader", detail: "building area and occupancy", ms: 33 },
      { kind: "llm", label: "Write combined answer", detail: "claude · 1,210 tokens in / 268 out", ms: 1040 },
      { kind: "answer", label: "Answer ready", detail: "1 anomaly, 2 sources", ms: 0 },
    ],
    answer: () => ({
      text: "Yes. Harbour House used 241 kWh per m² over the last 12 months, about 12% above the TM46 benchmark for a general office. Most of the extra use comes from the HVAC running at around 80% load on weekends, when the building is mostly empty.",
      cols: ["Building", "Energy use (kWh/m²)", "Benchmark", "Difference", "Note"],
      rows: energy.filter((e) => e.building === "Harbour House").map((e) => [e.building, String(e.eui), String(e.benchmark), `+${Math.round(((e.eui - e.benchmark) / e.benchmark) * 100)}%`, e.note]),
      footer: "Suggested action: check the weekend HVAC schedule with the building manager.",
      sources: ["meter_readings (3 meters)", "CIBSE TM46 benchmarks"],
    }),
  },
  {
    id: "wo",
    q: "Show open high-priority work orders and how their vendors are performing",
    keywords: ["work order", "work orders", "high", "priority", "vendor", "sla", "open", "repair"],
    agents: ["work orders", "contracts", "database reader"],
    steps: [
      { kind: "route", label: "Classify question", detail: "topics: work orders, vendor performance · picked 3 agents", ms: 401 },
      { kind: "agent", agent: "work orders", label: "work orders agent", detail: "filters open, high priority", ms: 72 },
      { kind: "db", agent: "work orders", label: "SELECT work_orders", detail: "priority = High, status != Closed · 3 rows", ms: 41 },
      { kind: "agent", agent: "contracts", label: "contracts agent", detail: "SLA scorecards per vendor", ms: 95 },
      { kind: "db", agent: "contracts", label: "SELECT vendor_scorecards", detail: "last 90 days · 3 vendors", ms: 36 },
      { kind: "agent", agent: "database reader", label: "database reader", detail: "joins work orders to vendors", ms: 48 },
      { kind: "llm", label: "Write combined answer", detail: "claude · 2,020 tokens in / 344 out", ms: 1180 },
      { kind: "answer", label: "Answer ready", detail: "3 work orders, 1 SLA breach", ms: 0 },
    ],
    answer: () => {
      const rows = workOrders
        .filter((w) => w.priority === "High")
        .map((w) => {
          const v = vendors.find((x) => x.name === w.vendor)!;
          return [w.id, w.building, w.issue, w.vendor, `${v.sla}%`, w.slaHours < 0 ? `breached ${-w.slaHours}h ago` : `${w.slaHours}h left`];
        });
      return {
        text: "There are 3 open high-priority work orders. The fire door at Canal Point has already missed its SLA, and its vendor, SecureDoors, has the weakest SLA score of the three (71%) and an expired accreditation.",
        cols: ["ID", "Building", "Issue", "Vendor", "Vendor SLA", "SLA"],
        rows,
        footer: "Consider reassigning WO-1047 to an accredited vendor.",
        sources: ["work_orders", "vendor_scorecards"],
      };
    },
  },
  {
    id: "blocked",
    q: "Which vendors are blocked because their accreditation expired?",
    keywords: ["blocked", "accreditation", "accredited", "vendor", "vendors", "supplier"],
    agents: ["compliance", "contracts"],
    steps: [
      { kind: "route", label: "Classify question", detail: "topics: vendor compliance · picked 2 agents", ms: 356 },
      { kind: "agent", agent: "compliance", label: "compliance agent", detail: "checks vendor accreditations", ms: 88 },
      { kind: "db", agent: "compliance", label: "SELECT vendor_accreditations", detail: "status = expired · 2 rows", ms: 29 },
      { kind: "agent", agent: "contracts", label: "contracts agent", detail: "finds open jobs for those vendors", ms: 77 },
      { kind: "db", agent: "contracts", label: "SELECT work_orders", detail: "by vendor · 2 rows", ms: 31 },
      { kind: "llm", label: "Write combined answer", detail: "claude · 1,330 tokens in / 241 out", ms: 960 },
      { kind: "answer", label: "Answer ready", detail: "2 vendors blocked", ms: 0 },
    ],
    answer: () => ({
      text: "Two vendors are blocked from new work until they renew their accreditation. SecureDoors still has 2 open work orders, so those jobs are at risk.",
      cols: ["Vendor", "Accreditation", "SLA score", "Open work orders"],
      rows: vendors.filter((v) => v.blocked).map((v) => [v.name, v.accreditation, `${v.sla}%`, String(workOrders.filter((w) => w.vendor === v.name).length)]),
      footer: "Hoistra can email each vendor a renewal request with their vendor passport attached.",
      sources: ["vendor_accreditations", "work_orders"],
    }),
  },
];

export function matchScript(text: string): Script | null {
  const t = text.toLowerCase();
  let best: Script | null = null;
  let bestScore = 0;
  for (const s of scripts) {
    const score = s.keywords.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      best = s;
      bestScore = score;
    }
  }
  return best;
}

export const legacyColumns = [
  { source: "AssetNo", sample: "HH-CH-002", target: "asset_code", confidence: 0.98 },
  { source: "Desc", sample: "Chiller 2 (roof)", target: "asset_name", confidence: 0.95 },
  { source: "Loc", sample: "HH / Roof / Plant", target: "location_path", confidence: 0.91 },
  { source: "InstallDt", sample: "14/03/2016", target: "install_date", confidence: 0.93 },
  { source: "Crit", sample: "A", target: "criticality", confidence: 0.62 },
  { source: "Mfr", sample: "Daikin", target: "manufacturer", confidence: 0.97 },
  { source: "SvcCo", sample: "CoolTech", target: "vendor_name", confidence: 0.58 },
  { source: "PPMFreq", sample: "Q", target: "ppm_frequency", confidence: 0.84 },
];

export const targetFields = [
  "asset_code", "asset_name", "location_path", "install_date", "criticality", "condition_score",
  "manufacturer", "vendor_name", "contract_ref", "ppm_frequency", "(skip column)",
];
