// Sample data for the ERP-AI demo. All companies and amounts are made up.

export type BankLine = { id: string; date: string; desc: string; amount: number };
export type LedgerLine = { id: string; date: string; desc: string; amount: number };

export const bank: BankLine[] = [
  { id: "B01", date: "03 Oct", desc: "Incoming · Alpha Trading LLC", amount: 12500 },
  { id: "B02", date: "04 Oct", desc: "Rent October · Marina Tower", amount: -18000 },
  { id: "B03", date: "05 Oct", desc: "DEWA utilities", amount: -2340.5 },
  { id: "B04", date: "07 Oct", desc: "Outgoing · Gulf Supplies", amount: -7875 },
  { id: "B05", date: "08 Oct", desc: "Incoming · Beta Holdings", amount: 9980 },
  { id: "B06", date: "10 Oct", desc: "Card settlement batch 2291", amount: 4215.3 },
  { id: "B07", date: "12 Oct", desc: "Salary transfer October", amount: -46200 },
  { id: "B08", date: "14 Oct", desc: "Incoming · Delta Co", amount: 15000 },
  { id: "B09", date: "15 Oct", desc: "SWIFT out · Nordic Parts GmbH (EUR)", amount: -3672.1 },
  { id: "B10", date: "18 Oct", desc: "Bank service charge", amount: -52.5 },
  { id: "B11", date: "20 Oct", desc: "Incoming · Omega Retail", amount: 6400 },
  { id: "B12", date: "22 Oct", desc: "Transfer to savings account", amount: -20000 },
];

export const ledger: LedgerLine[] = [
  { id: "L01", date: "03 Oct", desc: "INV-2041 Alpha Trading LLC", amount: 12500 },
  { id: "L02", date: "04 Oct", desc: "Rent expense October", amount: -18000 },
  { id: "L03", date: "05 Oct", desc: "Utilities · DEWA", amount: -2340.5 },
  { id: "L04", date: "06 Oct", desc: "PINV-88 Gulf Supplies", amount: -7875 },
  { id: "L05", date: "08 Oct", desc: "INV-2044 Beta Holdings", amount: 10000 },
  { id: "L06", date: "09 Oct", desc: "Card sales 09 Oct", amount: 4215.3 },
  { id: "L07", date: "12 Oct", desc: "Payroll October", amount: -46200 },
  { id: "L08", date: "13 Oct", desc: "INV-2047 Delta Co", amount: 8000 },
  { id: "L09", date: "13 Oct", desc: "INV-2049 Delta Co", amount: 7000 },
  { id: "L10", date: "15 Oct", desc: "PINV-311 Nordic Parts (EUR 900)", amount: -3654 },
  { id: "L11", date: "27 Oct", desc: "INV-2052 Omega Retail", amount: 6400 },
  { id: "L12", date: "22 Oct", desc: "Transfer to savings", amount: -20000 },
  { id: "L13", date: "25 Oct", desc: "Cheque #1182 Zeta Maintenance", amount: -3150 },
];

export type MatchKind = "exact" | "difference" | "composite" | "timing";
export const matches: { bank: string; ledger: string[]; kind: MatchKind; score: number }[] = [
  { bank: "B01", ledger: ["L01"], kind: "exact", score: 0.99 },
  { bank: "B02", ledger: ["L02"], kind: "exact", score: 0.98 },
  { bank: "B03", ledger: ["L03"], kind: "exact", score: 0.99 },
  { bank: "B04", ledger: ["L04"], kind: "exact", score: 0.96 },
  { bank: "B05", ledger: ["L05"], kind: "difference", score: 0.91 },
  { bank: "B06", ledger: ["L06"], kind: "exact", score: 0.94 },
  { bank: "B07", ledger: ["L07"], kind: "exact", score: 0.99 },
  { bank: "B08", ledger: ["L08", "L09"], kind: "composite", score: 0.93 },
  { bank: "B09", ledger: ["L10"], kind: "difference", score: 0.88 },
  { bank: "B11", ledger: ["L11"], kind: "timing", score: 0.86 },
  { bank: "B12", ledger: ["L12"], kind: "exact", score: 0.99 },
];

export type Exception = {
  id: string;
  ref: string;
  reason: "Bank charge" | "FX difference" | "Missing in ledger" | "Timing" | "Outstanding cheque";
  amount: number;
  explanation: string;
  fix: string;
  safe: boolean;
  slaHours: number;
};

export const exceptions: Exception[] = [
  { id: "X1", ref: "B05 ↔ L05", reason: "Bank charge", amount: -20, explanation: "Beta Holdings paid INV-2044 in full, but the bank kept AED 20 as a transfer fee, so 9,980 arrived instead of 10,000.", fix: "Post AED 20 to Bank charges", safe: true, slaHours: 41 },
  { id: "X2", ref: "B09 ↔ L10", reason: "FX difference", amount: -18.1, explanation: "The invoice was booked at the EUR rate on the invoice date. The bank converted at a slightly worse rate on the payment date.", fix: "Post AED 18.10 to FX loss", safe: false, slaHours: 30 },
  { id: "X3", ref: "B10", reason: "Missing in ledger", amount: -52.5, explanation: "A monthly bank service charge is on the statement but was never booked in the ledger.", fix: "Post AED 52.50 to Bank charges", safe: true, slaHours: 44 },
  { id: "X4", ref: "B11 ↔ L11", reason: "Timing", amount: 0, explanation: "Same amount and customer, but the ledger entry is dated 7 days after the money arrived. Probably booked late.", fix: "Confirm match and correct the ledger date", safe: false, slaHours: 22 },
  { id: "X5", ref: "L13", reason: "Outstanding cheque", amount: -3150, explanation: "Cheque #1182 is in the ledger but hasn't cleared the bank yet. This is normal at month end.", fix: "Carry forward to next month", safe: true, slaHours: 47 },
];

export const RECON_STAGES = [
  "Read and normalise both files",
  "Score candidate pairs (amount, date, text)",
  "Find one-to-one matches",
  "Find composite matches",
  "Explain the differences",
];

/* ---------- policy guardrails ---------- */

export type Rule = { id: string; name: string; weight: number; hard?: boolean };
export const RULES: Record<string, Rule> = {
  cap: { id: "cap", name: "Over category cap", weight: 30 },
  weekend: { id: "weekend", name: "Weekend spend", weight: 15 },
  receipt: { id: "receipt", name: "Missing receipt", weight: 35, hard: true },
  duplicate: { id: "duplicate", name: "Possible duplicate", weight: 40 },
  cutoff: { id: "cutoff", name: "After the 24th cut-off", weight: 10 },
  lead: { id: "lead", name: "Travel booked too late", weight: 15 },
  upgrade: { id: "upgrade", name: "Upgrade without approval", weight: 20 },
  po: { id: "po", name: "No purchase order", weight: 30, hard: true },
  mcc: { id: "mcc", name: "Merchant type not allowed", weight: 20 },
};

export type Expense = { id: string; who: string; desc: string; category: string; amount: number; date: string; receipt: boolean; rules: string[]; note: string };
export const expenses: Expense[] = [
  { id: "E-301", who: "Sara K.", desc: "Taxi to client meeting", category: "Transport", amount: 85, date: "Tue 07 Oct", receipt: true, rules: [], note: "All checks passed." },
  { id: "E-302", who: "Omar R.", desc: "Client dinner, 6 guests", category: "Entertainment", amount: 1800, date: "Sat 11 Oct", receipt: false, rules: ["cap", "weekend", "receipt"], note: "Entertainment cap is AED 1,200 (AED 800 on weekends). No receipt attached." },
  { id: "E-303", who: "Lina M.", desc: "Office supplies", category: "Office", amount: 640, date: "Wed 08 Oct", receipt: true, rules: [], note: "All checks passed." },
  { id: "E-304", who: "Omar R.", desc: "Hotel Riyadh, suite", category: "Travel", amount: 2950, date: "Mon 13 Oct", receipt: true, rules: ["lead", "upgrade"], note: "Booked 2 days ahead (policy: 7). Suite upgrade had no approval." },
  { id: "E-305", who: "Dev P.", desc: "Design software subscription", category: "Software", amount: 1240, date: "Thu 16 Oct", receipt: true, rules: ["duplicate"], note: "Same amount and vendor as E-299 two days earlier." },
  { id: "E-306", who: "Sara K.", desc: "Flight Dubai to London", category: "Travel", amount: 4800, date: "Fri 17 Oct", receipt: true, rules: [], note: "Booked 21 days ahead. All checks passed." },
  { id: "E-307", who: "Lina M.", desc: "Team lunch", category: "Entertainment", amount: 950, date: "Sun 26 Oct", receipt: true, rules: ["cutoff"], note: "Submitted after the 24th, so it moves to next month's payroll." },
  { id: "E-308", who: "Dev P.", desc: "Laptop for new hire", category: "IT equipment", amount: 6500, date: "Mon 27 Oct", receipt: true, rules: ["po"], note: "IT equipment over AED 5,000 needs a purchase order." },
];

export const riskOf = (e: Expense) => e.rules.reduce((n, r) => n + RULES[r].weight, 0);
export const statusOf = (e: Expense) => (e.rules.some((r) => RULES[r].hard) ? "HARD_BLOCK" : e.rules.length ? "SOFT_BLOCK" : "PASS");
export const bandOf = (score: number) => (score >= 70 ? "high" : score >= 40 ? "medium" : "low");

/* ---------- document extraction ---------- */

export type Field = { key: string; label: string; extracted: string; confidence: number; verified: string; ok: boolean };
export type Doc = { id: string; type: string; title: string; vendor: string; lines: [string, string][]; fields: Field[] };

export const docs: Doc[] = [
  {
    id: "inv",
    type: "invoice",
    title: "Invoice PINV-88",
    vendor: "Gulf Supplies Trading",
    lines: [["Packaging boxes (500)", "3,250.00"], ["Pallet wrap (40 rolls)", "1,800.00"], ["Delivery to Jebel Ali", "2,450.00"], ["VAT 5%", "375.00"]],
    fields: [
      { key: "vendor", label: "Vendor", extracted: "Gulf Supplies Trading", confidence: 0.99, verified: "Gulf Supplies Trading", ok: true },
      { key: "number", label: "Invoice number", extracted: "PINV-88", confidence: 0.97, verified: "PINV-88", ok: true },
      { key: "date", label: "Invoice date", extracted: "06 Oct 2025", confidence: 0.95, verified: "06 Oct 2025", ok: true },
      { key: "due", label: "Due date", extracted: "05 Nov 2025", confidence: 0.92, verified: "05 Nov 2025", ok: true },
      { key: "vat", label: "VAT", extracted: "375.00", confidence: 0.94, verified: "375.00", ok: true },
      { key: "total", label: "Total (AED)", extracted: "7,857.00", confidence: 0.81, verified: "7,875.00", ok: false },
    ],
  },
  {
    id: "rcpt",
    type: "receipt",
    title: "Receipt #44817",
    vendor: "Al Fanar Restaurant",
    lines: [["Dinner for 6", "1,620.00"], ["Service", "90.00"], ["VAT 5%", "90.00"]],
    fields: [
      { key: "vendor", label: "Merchant", extracted: "Al Fanar Restaurant", confidence: 0.98, verified: "Al Fanar Restaurant", ok: true },
      { key: "date", label: "Date", extracted: "11 Oct 2025", confidence: 0.96, verified: "11 Oct 2025", ok: true },
      { key: "vat", label: "VAT", extracted: "90.00", confidence: 0.93, verified: "90.00", ok: true },
      { key: "total", label: "Total (AED)", extracted: "1,800.00", confidence: 0.97, verified: "1,800.00", ok: true },
    ],
  },
];
