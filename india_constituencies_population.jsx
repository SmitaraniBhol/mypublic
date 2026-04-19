import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, LineChart, Line, ReferenceLine, Legend } from "recharts";

const rawData = [
  { state: "Uttar Pradesh", seats: 80, projSeats: 89, pop1971: 83849, pop2011: 199812, pop2026: 243466, region: "North" },
  { state: "Maharashtra", seats: 48, projSeats: 48, pop1971: 50412, pop2011: 112374, pop2026: 129584, region: "West" },
  { state: "West Bengal", seats: 42, projSeats: 40, pop1971: 44312, pop2011: 91276, pop2026: 100631, region: "East" },
  { state: "Bihar", seats: 40, projSeats: 46, pop1971: 42126, pop2011: 104099, pop2026: 132850, region: "North" },
  { state: "Tamil Nadu", seats: 39, projSeats: 32, pop1971: 41199, pop2011: 72147, pop2026: 77582, region: "South" },
  { state: "Madhya Pradesh", seats: 29, projSeats: 33, pop1971: 30017, pop2011: 72627, pop2026: 89965, region: "Central" },
  { state: "Karnataka", seats: 28, projSeats: 25, pop1971: 29299, pop2011: 61095, pop2026: 69074, region: "South" },
  { state: "Gujarat", seats: 26, projSeats: 26, pop1971: 26697, pop2011: 60440, pop2026: 74343, region: "West" },
  { state: "Andhra Pradesh", seats: 25, projSeats: 22, pop1971: 43503, pop2011: 49577, pop2026: 53740, region: "South" },
  { state: "Rajasthan", seats: 25, projSeats: 30, pop1971: 25766, pop2011: 68548, pop2026: 83879, region: "North" },
  { state: "Odisha", seats: 21, projSeats: 19, pop1971: 21945, pop2011: 41974, pop2026: 47221, region: "East" },
  { state: "Kerala", seats: 20, projSeats: 15, pop1971: 21347, pop2011: 33406, pop2026: 36239, region: "South" },
  { state: "Punjab", seats: 13, projSeats: 12, pop1971: 13551, pop2011: 27743, pop2026: 31370, region: "North" },
  { state: "Assam", seats: 14, projSeats: 13, pop1971: 14625, pop2011: 31206, pop2026: 36815, region: "NE" },
  { state: "Telangana", seats: 17, projSeats: 16, pop1971: 0, pop2011: 35004, pop2026: 38665, region: "South" },
  { state: "Jharkhand", seats: 14, projSeats: 15, pop1971: 14227, pop2011: 32988, pop2026: 41108, region: "East" },
  { state: "Chhattisgarh", seats: 11, projSeats: 12, pop1971: 11637, pop2011: 25545, pop2026: 31311, region: "Central" },
  { state: "Haryana", seats: 10, projSeats: 11, pop1971: 10036, pop2011: 25351, pop2026: 31409, region: "North" },
  { state: "Uttarakhand", seats: 5, projSeats: 5, pop1971: 4493, pop2011: 10086, pop2026: 12028, region: "North" },
  { state: "Himachal Pradesh", seats: 4, projSeats: 3, pop1971: 3460, pop2011: 6865, pop2026: 7588, region: "North" },
  { state: "Tripura", seats: 2, projSeats: 2, pop1971: 1556, pop2011: 3674, pop2026: 4268, region: "NE" },
  { state: "Manipur", seats: 2, projSeats: 2, pop1971: 1073, pop2011: 2856, pop2026: 3318, region: "NE" },
  { state: "Meghalaya", seats: 2, projSeats: 2, pop1971: 1012, pop2011: 2967, pop2026: 3447, region: "NE" },
  { state: "Arunachal Pradesh", seats: 2, projSeats: 2, pop1971: 468, pop2011: 1384, pop2026: 1608, region: "NE" },
  { state: "Goa", seats: 2, projSeats: 2, pop1971: 795, pop2011: 1459, pop2026: 1601, region: "West" },
  { state: "Nagaland", seats: 1, projSeats: 1, pop1971: 516, pop2011: 1979, pop2026: 2299, region: "NE" },
  { state: "Mizoram", seats: 1, projSeats: 1, pop1971: 332, pop2011: 1097, pop2026: 1275, region: "NE" },
  { state: "Sikkim", seats: 1, projSeats: 1, pop1971: 210, pop2011: 611, pop2026: 709, region: "NE" },
];

const REGION_COLORS = {
  North: "#f97316",
  South: "#06b6d4",
  East: "#a78bfa",
  West: "#34d399",
  Central: "#fbbf24",
  NE: "#f472b6",
};

const SHORT = {
  "Uttar Pradesh": "UP", "Maharashtra": "MH", "West Bengal": "WB", "Bihar": "BR",
  "Tamil Nadu": "TN", "Madhya Pradesh": "MP", "Karnataka": "KA", "Gujarat": "GJ",
  "Andhra Pradesh": "AP", "Rajasthan": "RJ", "Odisha": "OD", "Kerala": "KL",
  "Punjab": "PB", "Assam": "AS", "Telangana": "TS", "Jharkhand": "JH",
  "Chhattisgarh": "CG", "Haryana": "HR", "Uttarakhand": "UK", "Himachal Pradesh": "HP",
  "Tripura": "TR", "Manipur": "MN", "Meghalaya": "ML", "Arunachal Pradesh": "AR",
  "Goa": "GA", "Nagaland": "NL", "Mizoram": "MZ", "Sikkim": "SK",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const popGrowth1971to2026 = d.pop1971 > 0 ? (((d.pop2026 - d.pop1971) / d.pop1971) * 100).toFixed(0) : "N/A";
  const seatChange = d.projSeats - d.seats;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#e2e8f0", minWidth: 220 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#f8fafc" }}>{d.state}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
        <span style={{ color: "#94a3b8" }}>Region</span><span style={{ color: REGION_COLORS[d.region] }}>{d.region}</span>
        <span style={{ color: "#94a3b8" }}>Current seats</span><span>{d.seats}</span>
        <span style={{ color: "#94a3b8" }}>Projected seats</span>
        <span style={{ color: seatChange > 0 ? "#4ade80" : seatChange < 0 ? "#f87171" : "#94a3b8" }}>
          {d.projSeats} {seatChange > 0 ? `(+${seatChange})` : seatChange < 0 ? `(${seatChange})` : "(=)"}
        </span>
        {d.pop1971 > 0 && <><span style={{ color: "#94a3b8" }}>Pop 1971</span><span>{(d.pop1971 / 1000).toFixed(1)}M</span></>}
        <span style={{ color: "#94a3b8" }}>Pop 2011</span><span>{(d.pop2011 / 1000).toFixed(1)}M</span>
        <span style={{ color: "#94a3b8" }}>Pop 2026</span><span>{(d.pop2026 / 1000).toFixed(1)}M</span>
        {d.pop1971 > 0 && <><span style={{ color: "#94a3b8" }}>Growth '71→'26</span><span style={{ color: "#fb923c" }}>+{popGrowth1971to2026}%</span></>}
      </div>
    </div>
  );
};

const TABS = ["Overview", "Population Growth", "Equity Analysis"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [sort, setSort] = useState("seats");
  const [highlight, setHighlight] = useState(null);

  const sorted = useMemo(() => {
    return [...rawData].sort((a, b) => b[sort] - a[sort]);
  }, [sort]);

  const equityData = useMemo(() => {
    return rawData
      .filter(d => d.pop1971 > 0)
      .map(d => ({
        ...d,
        popGrowthPct: ((d.pop2026 - d.pop1971) / d.pop1971 * 100),
        seatChange: d.projSeats - d.seats,
        popPerSeat2011: Math.round(d.pop2011 / d.seats),
        popPerSeat2026: Math.round(d.pop2026 / d.seats),
      }))
      .sort((a, b) => b.popGrowthPct - a.popGrowthPct);
  }, []);

  const southNorthSummary = [
    { label: "Southern States", current: 129, projected: 103, change: -26, color: "#06b6d4" },
    { label: "Northern States", current: 145, projected: 175, change: +30, color: "#f97316" },
  ];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "0 0 40px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #1e3a5f 0%, #0f2a44 100%)",
        borderBottom: "2px solid #f97316",
        padding: "28px 32px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#f97316", textTransform: "uppercase", marginBottom: 6 }}>
          Electoral Cartography of India
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#f8fafc", lineHeight: 1.2 }}>
          Constituencies · Population · Delimitation
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8", maxWidth: 600 }}>
          State-wise seats frozen since 1971 Census. A comparison across 55 years — 
          and the failed Delimitation Bill 2026 that would have redrawn the map.
        </p>
        {/* North-South callout */}
        <div style={{
          display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap",
        }}>
          {[
            { label: "Total Lok Sabha seats", val: "543", sub: "Frozen since 1971" },
            { label: "South loses (2011 basis)", val: "−26", sub: "129 → 103 seats", color: "#06b6d4" },
            { label: "North gains (2011 basis)", val: "+30", sub: "145 → 175 seats", color: "#f97316" },
            { label: "Bill 2026 result", val: "Defeated", sub: "298/352 votes needed", color: "#f87171" },
          ].map(c => (
            <div key={c.label} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 14px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: c.color || "#f8fafc" }}>{c.val}</div>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 32px", borderBottom: "1px solid #1e293b", background: "#0f172a" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: "14px 22px", background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: tab === i ? "#f97316" : "#64748b",
            borderBottom: tab === i ? "2px solid #f97316" : "2px solid transparent",
            fontFamily: "inherit", letterSpacing: 0.5, transition: "color 0.2s",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* ── TAB 0: OVERVIEW ── */}
        {tab === 0 && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Sort by:</span>
              {[["seats", "Current seats"], ["projSeats", "Projected seats"], ["pop2026", "2026 population"], ["pop2011", "2011 population"]].map(([k, l]) => (
                <button key={k} onClick={() => setSort(k)} style={{
                  padding: "5px 12px", borderRadius: 20, border: "1px solid",
                  borderColor: sort === k ? "#f97316" : "#334155",
                  background: sort === k ? "rgba(249,115,22,0.15)" : "transparent",
                  color: sort === k ? "#f97316" : "#94a3b8", cursor: "pointer", fontSize: 11,
                  fontFamily: "inherit",
                }}>{l}</button>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {Object.entries(REGION_COLORS).map(([r, c]) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{r}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={520}>
              <BarChart data={sorted} margin={{ top: 10, right: 10, bottom: 80, left: 0 }}
                onMouseLeave={() => setHighlight(null)}>
                <XAxis dataKey="state" tick={{ fontSize: 9.5, fill: "#64748b" }}
                  angle={-55} textAnchor="end" interval={0}
                  tickFormatter={s => SHORT[s] || s} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="seats" name="Current Seats (1971 basis)" radius={[3, 3, 0, 0]}
                  onMouseEnter={(_, i) => setHighlight(i)}>
                  {sorted.map((d, i) => (
                    <Cell key={i}
                      fill={REGION_COLORS[d.region]}
                      opacity={highlight === null || highlight === i ? 1 : 0.3}
                    />
                  ))}
                </Bar>
                <Bar dataKey="projSeats" name="Projected (2011 Census)" radius={[3, 3, 0, 0]}
                  fill="transparent"
                  stroke="#f8fafc" strokeWidth={1.5}
                  strokeDasharray="4 2">
                  {sorted.map((d, i) => (
                    <Cell key={i}
                      fill="transparent"
                      stroke={d.projSeats > d.seats ? "#4ade80" : d.projSeats < d.seats ? "#f87171" : "#64748b"}
                      strokeWidth={1.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 8, fontSize: 11, color: "#475569", display: "flex", gap: 24 }}>
              <span><span style={{ color: "#f97316" }}>■</span> Solid bars = current seats (1971 frozen)</span>
              <span><span style={{ color: "#4ade80" }}>▭ dashed green</span> = projected gain</span>
              <span><span style={{ color: "#f87171" }}>▭ dashed red</span> = projected loss</span>
            </div>
          </div>
        )}

        {/* ── TAB 1: POPULATION GROWTH ── */}
        {tab === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "#f8fafc", fontWeight: 600 }}>
                Population Growth: 1971 → 2011 → 2026
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                Seats were fixed in 1971. Population has grown 2–5× since then — but not equally across states.
              </p>
            </div>

            {/* Population bars side by side */}
            <ResponsiveContainer width="100%" height={480}>
              <BarChart
                data={[...rawData].filter(d => d.pop1971 > 0).sort((a, b) => b.pop2026 - a.pop2026)}
                margin={{ top: 10, right: 10, bottom: 80, left: 10 }}>
                <XAxis dataKey="state" tick={{ fontSize: 9.5, fill: "#64748b" }}
                  angle={-55} textAnchor="end" interval={0}
                  tickFormatter={s => SHORT[s] || s} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}M`} />
                <Tooltip formatter={(v, n) => [`${(v / 1000).toFixed(1)}M`, n]} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 16 }} />
                <Bar dataKey="pop1971" name="1971 Census" fill="#475569" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pop2011" name="2011 Census" fill="#6366f1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pop2026" name="2026 Estimate" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Population growth % cards for key states */}
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14, textTransform: "uppercase", letterSpacing: 2 }}>
                Population Growth 1971 → 2026 — Seats unchanged
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                {equityData.map(d => {
                  const pct = d.popGrowthPct.toFixed(0);
                  const bar = Math.min(100, d.popGrowthPct / 4);
                  return (
                    <div key={d.state} style={{
                      background: "rgba(255,255,255,0.04)", borderRadius: 8,
                      padding: "12px 14px", border: "1px solid rgba(255,255,255,0.07)",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{SHORT[d.state] || d.state}</span>
                        <span style={{ fontSize: 11, color: REGION_COLORS[d.region] }}>{d.region}</span>
                      </div>
                      <div style={{
                        height: 4, background: "#1e293b", borderRadius: 2, marginBottom: 6,
                      }}>
                        <div style={{
                          height: "100%", width: `${bar}%`,
                          background: d.popGrowthPct > 250 ? "#f97316" : d.popGrowthPct > 180 ? "#fbbf24" : "#06b6d4",
                          borderRadius: 2,
                        }} />
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: d.popGrowthPct > 250 ? "#f97316" : "#94a3b8" }}>
                        +{pct}%
                      </div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{d.seats} seats (frozen)</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: EQUITY ANALYSIS ── */}
        {tab === 2 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "#f8fafc", fontWeight: 600 }}>
                The North–South Representation Divide
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                States that controlled their population growth now face losing seats. The democratic paradox of the freeze.
              </p>
            </div>

            {/* South vs North summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Southern States (AP, KA, KL, TN, TS)", current: 129, projected: 103, delta: -26, color: "#06b6d4",
                  states: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana"] },
                { label: "Northern States (UP, BR, RJ, MP, HR, UK)", current: 159, projected: 188, delta: +29, color: "#f97316",
                  states: ["Uttar Pradesh", "Bihar", "Rajasthan", "Madhya Pradesh", "Haryana", "Uttarakhand"] },
              ].map(g => (
                <div key={g.label} style={{
                  background: `linear-gradient(135deg, ${g.color}18 0%, transparent 100%)`,
                  border: `1px solid ${g.color}40`, borderRadius: 12, padding: 20,
                }}>
                  <div style={{ fontSize: 11, color: g.color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
                    {g.label}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc" }}>{g.current}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>current seats</div>
                    </div>
                    <div style={{ fontSize: 28, color: "#475569" }}>→</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: g.color }}>{g.projected}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>projected seats</div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: 12, padding: "6px 12px", borderRadius: 6,
                    background: `${g.color}20`, display: "inline-block",
                    fontSize: 14, fontWeight: 700, color: g.color,
                  }}>
                    {g.delta > 0 ? `+${g.delta}` : g.delta} seats
                  </div>
                </div>
              ))}
            </div>

            {/* Scatter: Population growth vs seat change */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                Population growth vs projected seat change — the equity story
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                States that grew faster gain seats; states that controlled growth lose representation.
              </div>
            </div>

            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                <XAxis dataKey="popGrowthPct" name="Population Growth %" type="number"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{ value: "Population Growth 1971→2026 (%)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 12 }} />
                <YAxis dataKey="seatChange" name="Projected Seat Change"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{ value: "Seat Change (2011 delimitation)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>{d.state}</div>
                      <div style={{ color: "#94a3b8" }}>Pop growth: <span style={{ color: "#f97316" }}>+{d.popGrowthPct?.toFixed(0)}%</span></div>
                      <div style={{ color: "#94a3b8" }}>Seat change: <span style={{ color: d.seatChange > 0 ? "#4ade80" : "#f87171" }}>{d.seatChange > 0 ? "+" : ""}{d.seatChange}</span></div>
                      <div style={{ color: "#94a3b8" }}>Region: <span style={{ color: REGION_COLORS[d.region] }}>{d.region}</span></div>
                    </div>
                  );
                }} />
                <ReferenceLine x={200} stroke="#334155" strokeDasharray="4 2" />
                <ReferenceLine y={0} stroke="#334155" strokeDasharray="4 2" />
                <Scatter data={equityData} shape={(props) => {
                  const { cx, cy, payload } = props;
                  const label = SHORT[payload.state] || payload.state.slice(0, 2);
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={20} fill={REGION_COLORS[payload.region]} opacity={0.2} />
                      <circle cx={cx} cy={cy} r={8} fill={REGION_COLORS[payload.region]} opacity={0.85} />
                      <text x={cx} y={cy - 13} textAnchor="middle" fill="#94a3b8" fontSize={9}>{label}</text>
                    </g>
                  );
                }} />
              </ScatterChart>
            </ResponsiveContainer>

            {/* ── AVG POPULATION PER SEAT BAR CHART ── */}
            <div style={{ marginTop: 36 }}>
              <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                Average population per Lok Sabha seat (2026 estimate)
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 16 }}>
                Sorted highest → lowest. Each bar = how many people one MP represents. The gap between Bihar (33.2L) and Kerala (18.1L) is the democratic deficit.
              </div>

              {/* Highlight callout row */}
              {(() => {
                const dispData = [...rawData]
                  .map(d => ({ ...d, avgPerSeat: Math.round(d.pop2026 / d.seats) }))
                  .sort((a, b) => b.avgPerSeat - a.avgPerSeat);
                const maxVal = dispData[0].avgPerSeat;
                const minVal = dispData[dispData.length - 1].avgPerSeat;
                return (
                  <>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                      {[
                        { label: "Highest burden", state: dispData[0].state, val: dispData[0].avgPerSeat, color: "#f97316" },
                        { label: "National avg", state: "India", val: Math.round(rawData.reduce((s,d)=>s+d.pop2026,0)/543), color: "#fbbf24" },
                        { label: "Lowest burden", state: dispData[dispData.length-1].state, val: dispData[dispData.length-1].avgPerSeat, color: "#06b6d4" },
                        { label: "Kerala", state: "Kerala", val: Math.round(36239/20)*1000, color: "#22d3ee" },
                      ].map(c => (
                        <div key={c.label} style={{ background: `${c.color}18`, border: `1px solid ${c.color}40`, borderRadius: 8, padding: "10px 16px" }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: c.color }}>{(c.val/100000).toFixed(1)}L</div>
                          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.state}</div>
                        </div>
                      ))}
                    </div>

                    {/* Horizontal bar chart */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {dispData.map((d, i) => {
                        const pct = (d.avgPerSeat / maxVal) * 100;
                        const isKerala = d.state === "Kerala";
                        const barColor = d.avgPerSeat > 3000000 ? "#f97316"
                          : d.avgPerSeat > 2500000 ? "#fbbf24"
                          : d.avgPerSeat > 2000000 ? "#a78bfa"
                          : "#06b6d4";
                        return (
                          <div key={d.state} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 90, fontSize: 11, textAlign: "right",
                              color: isKerala ? "#22d3ee" : "#94a3b8",
                              fontWeight: isKerala ? 700 : 400,
                              flexShrink: 0,
                            }}>
                              {SHORT[d.state] || d.state}
                            </div>
                            <div style={{ flex: 1, position: "relative", height: 18 }}>
                              <div style={{
                                height: "100%", width: `${pct}%`,
                                background: isKerala ? "#22d3ee" : barColor,
                                borderRadius: 3,
                                opacity: isKerala ? 1 : 0.75,
                                border: isKerala ? "1px solid #22d3ee" : "none",
                                transition: "width 0.3s",
                              }} />
                            </div>
                            <div style={{
                              width: 70, fontSize: 11, flexShrink: 0,
                              color: isKerala ? "#22d3ee" : d.avgPerSeat > 3000000 ? "#f97316" : "#64748b",
                              fontWeight: isKerala ? 700 : 400,
                            }}>
                              {(d.avgPerSeat / 100000).toFixed(1)}L
                            </div>
                            <div style={{ width: 16, flexShrink: 0 }}>
                              <span style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: `${REGION_COLORS[d.region]}25`, color: REGION_COLORS[d.region] }}>
                                {d.region}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Ratio callout */}
                    <div style={{
                      marginTop: 20, padding: "14px 20px", borderRadius: 10,
                      background: "linear-gradient(90deg, rgba(249,115,22,0.1) 0%, rgba(6,182,212,0.1) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                    }}>
                      <div>
                        <span style={{ fontSize: 28, fontWeight: 700, color: "#f97316" }}>{(dispData[0].avgPerSeat / Math.round(36239000/20)).toFixed(1)}×</span>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Bihar vs Kerala disparity ratio</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", maxWidth: 400, lineHeight: 1.6 }}>
                        A voter in <span style={{ color: "#f97316" }}>{dispData[0].state}</span> shares their MP with <span style={{ color: "#f97316" }}>{(dispData[0].avgPerSeat/100000).toFixed(1)} lakh</span> people,
                        while a voter in <span style={{ color: "#22d3ee" }}>Kerala</span> shares theirs with just <span style={{ color: "#22d3ee" }}>{(Math.round(36239000/20)/100000).toFixed(1)} lakh</span>.
                        Same one vote. Vastly unequal representation.
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* People per seat detail table */}
            <div style={{ marginTop: 36 }}>
              <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
                Full breakdown — People per Lok Sabha seat (2026 estimate)
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      {["State", "Seats", "2026 Pop (M)", "People/Seat", "Region", "Seat change (proj)"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", color: "#64748b", textAlign: "left", fontWeight: 400, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...equityData].sort((a, b) => b.popPerSeat2026 - a.popPerSeat2026).map((d, i) => (
                      <tr key={d.state} style={{ borderBottom: "1px solid #0f172a", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <td style={{ padding: "8px 12px", color: d.state === "Kerala" ? "#22d3ee" : "#e2e8f0", fontWeight: d.state === "Kerala" ? 700 : 400 }}>{d.state}</td>
                        <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{d.seats}</td>
                        <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{(d.pop2026 / 1000).toFixed(1)}M</td>
                        <td style={{ padding: "8px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: Math.min(80, d.popPerSeat2026 / 5000), height: 8, background: d.popPerSeat2026 > 4000000 ? "#f97316" : d.popPerSeat2026 > 2500000 ? "#fbbf24" : "#06b6d4", borderRadius: 2 }} />
                            <span style={{ color: d.state === "Kerala" ? "#22d3ee" : d.popPerSeat2026 > 4000000 ? "#f97316" : "#94a3b8", fontWeight: d.state === "Kerala" ? 700 : 400 }}>
                              {(d.popPerSeat2026 / 1000000).toFixed(2)}M
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, background: `${REGION_COLORS[d.region]}20`, color: REGION_COLORS[d.region] }}>{d.region}</span>
                        </td>
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: d.seatChange > 0 ? "#4ade80" : d.seatChange < 0 ? "#f87171" : "#64748b" }}>
                          {d.seatChange > 0 ? `+${d.seatChange}` : d.seatChange === 0 ? "—" : d.seatChange}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ padding: "0 32px", borderTop: "1px solid #1e293b", paddingTop: 16, marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: 11, color: "#334155" }}>
          Sources: Census of India (1971, 2011) · Population Projection Report 2011–2036 (MoHFW) · PRS India (Delimitation Bill 2026 analysis) · Wikipedia Lok Sabha Constituencies · findeasy.in 2026 estimates.
          Projected seats based on 2011 Census proportional allocation. Telangana formed in 2014, pop 1971 not available. Delimitation Bill 2026 defeated in Lok Sabha on April 17, 2026.
        </p>
      </div>
    </div>
  );
}
