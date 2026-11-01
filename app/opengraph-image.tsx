import { ImageResponse } from "next/og";

export const alt = "Shashank Kanangi · Data Scientist & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#101012",
          color: "#F2F0EB",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#FFB547" }}>run_id: shashank-kanangi · status: building</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>Shashank Kanangi</div>
          <div style={{ display: "flex", fontSize: 40, color: "#C9C6BF" }}>Data Scientist &amp; AI Engineer · Amsterdam</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#A3A09A" }}>
          <span style={{ border: "2px solid #FFB547", color: "#F2F0EB", padding: "8px 16px", borderRadius: 6 }}>Multi-agent platforms</span>
          <span style={{ border: "2px solid #3A3A40", padding: "8px 16px", borderRadius: 6 }}>Document AI</span>
          <span style={{ border: "2px solid #3A3A40", padding: "8px 16px", borderRadius: 6 }}>Finance automation</span>
        </div>
      </div>
    ),
    size,
  );
}
