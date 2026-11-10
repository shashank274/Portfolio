import { ImageResponse } from "next/og";

export const alt = "Shashank Kanangi · AI Engineer & Business Technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#F4F0E8", color: "#16181D", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#5B5E66", fontFamily: "sans-serif" }}>DATA SCIENTIST &amp; AI ENGINEER · MSC BIT MANAGEMENT, UVA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05 }}>I turn messy business problems</div>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05 }}>
            into AI that people&nbsp;<span style={{ color: "#D2462B", fontStyle: "italic" }}>actually</span>&nbsp;use.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #16181D", paddingTop: 24, fontFamily: "sans-serif" }}>
          <div style={{ display: "flex", fontSize: 40, fontFamily: "serif" }}>Shashank Kanangi</div>
          <div style={{ display: "flex", fontSize: 22, color: "#5B5E66" }}>Open to roles in the Netherlands and the UAE</div>
        </div>
      </div>
    ),
    size,
  );
}
