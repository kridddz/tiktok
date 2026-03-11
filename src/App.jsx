import { useState, useEffect } from "react";

const PILLARS = [
  { label: "Educational", pct: 40, color: "#FF2D55", emoji: "🧠" },
  { label: "Entertainment", pct: 30, color: "#00F2EA", emoji: "🎭" },
  { label: "Inspirational", pct: 20, color: "#FF6B35", emoji: "✨" },
  { label: "Promotional", pct: 10, color: "#FFFC00", emoji: "📣" },
];
const HOOKS_LIB = [
  { type: "Curiosity Gap", formula: '"Wait until you see this…"', score: 94 },
  { type: "Pattern Interrupt", formula: '"Nobody talks about this but…"', score: 91 },
  { type: "Relatability Bomb", formula: '"POV: You just discovered…"', score: 88 },
  { type: "Bold Claim", formula: '"This changed everything for me"', score: 86 },
  { type: "Tutorial Hook", formula: '"3-second trick that took me years"', score: 83 },
];
const CREATOR_TIERS = [
  { tier: "Nano", range: "1K–10K", roi: "5.2x", fill: 52 },
  { tier: "Micro", range: "10K–100K", roi: "4.1x", fill: 41 },
  { tier: "Mid-Tier", range: "100K–1M", roi: "3.3x", fill: 33 },
  { tier: "Macro", range: "1M+", roi: "2.1x", fill: 21 },
];
const METRICS = [
  { label: "Engagement Rate", value: "8.2%", target: "8%+", good: true },
  { label: "View Completion", value: "73%", target: "70%+", good: true },
  { label: "Follower Growth", value: "14.8%", target: "15%/mo", good: false },
  { label: "CTR to Site", value: "12.4%", target: "12%+", good: true },
  { label: "Shop CVR", value: "3.1%", target: "3%+", good: true },
  { label: "Creator ROI", value: "4.3x", target: "4:1", good: true },
];
const TRENDING = ["#BookTok","#CleanTok","#FoodTok","#GymTok","#StudyTok","#CraftTok","#SkinTok","#PlantTok","#TechTok","#ThriftTok"];

function PulsingDot({ color }) {
  return (
    <span style={{ position:"relative",display:"inline-block",width:10,height:10 }}>
      <span style={{ position:"absolute",inset:0,borderRadius:"50%",background:color,animation:"ping 1.5s ease-in-out infinite",opacity:.6 }}/>
      <span style={{ position:"absolute",inset:"2px",borderRadius:"50%",background:color }}/>
    </span>
  );
}

function AnimatedBar({ pct, color, delay=0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 300 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ background:"#1a1a2e",borderRadius:999,height:8,overflow:"hidden" }}>
      <div style={{ height:"100%",borderRadius:999,background:color,width:`${w}%`,transition:"width 1s cubic-bezier(.17,.67,.35,1)",boxShadow:`0 0 8px ${color}99` }}/>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:14,padding:"36px 0" }}>
      <div style={{ width:40,height:40,borderRadius:"50%",border:"3px solid #ffffff10",borderTop:"3px solid #FF2D55",animation:"spin 0.8s linear infinite" }}/>
      <span style={{ fontSize:12,color:"#ffffff44",letterSpacing:2 }}>CLAUDE IS THINKING…</span>
    </div>
  );
}

async function askClaude(system, user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// ── Hook Writer ───────────────────────────────────────────────────────────────
function HookWriter() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [style, setStyle] = useState("Curiosity Gap");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const hookStyles = ["Curiosity Gap","Pattern Interrupt","Relatability Bomb","Bold Claim","Tutorial Hook","Controversy Bait","Transformation Story"];

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setResult(null);
    const sys = `You are an elite TikTok viral content strategist. You write scroll-stopping hooks that capture attention in 3 seconds. Respond ONLY with valid JSON, no markdown fences, no extra text. Format exactly: {"hooks":[{"text":"...","type":"...","why":"...","viralScore":95}],"bestPick":0,"proTip":"..."}`;
    const usr = `Generate 4 viral TikTok hooks for:
Topic: ${topic}
Niche: ${niche || "general"}
Style: ${style}
Rules: Under 12 words each. Must make viewer NEED to watch. Use pattern interrupts, emotional triggers, or open loops. Give each a viralScore 70-99.`;
    try {
      const raw = await askClaude(sys, usr);
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch { setResult({ error: true }); }
    setLoading(false);
  };

  const copy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ animation:"slide-in 0.35s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
          <div style={{ fontSize:22,fontWeight:800,color:"#fff" }}>Hook Writer</div>
          <span style={{ fontSize:10,background:"linear-gradient(135deg,#FF2D55,#ff6b35)",color:"#fff",padding:"3px 10px",borderRadius:99,letterSpacing:2,fontWeight:700 }}>AI</span>
        </div>
        <div style={{ fontSize:13,color:"#ffffff55" }}>Generate scroll-stopping 3-second hooks powered by Claude</div>
      </div>

      <div style={{ display:"grid",gap:12,marginBottom:16 }}>
        <div>
          <label style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:7 }}>Your Topic *</label>
          <input
            value={topic} onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="e.g. morning skincare routine, passive income tips, gym mistakes…"
            style={{ width:"100%",background:"#ffffff0a",border:"1px solid #ffffff18",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s" }}
          />
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div>
            <label style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:7 }}>Niche</label>
            <input
              value={niche} onChange={e => setNiche(e.target.value)}
              placeholder="e.g. fitness, finance, beauty"
              style={{ width:"100%",background:"#ffffff0a",border:"1px solid #ffffff18",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:7 }}>Hook Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)}
              style={{ width:"100%",background:"#0d0d20",border:"1px solid #ffffff18",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}>
              {hookStyles.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button onClick={generate} disabled={loading || !topic.trim()} style={{
        width:"100%",padding:"15px",borderRadius:12,border:"none",
        background: topic.trim() ? "linear-gradient(135deg,#FF2D55,#ff6b35)" : "#ffffff0f",
        color: topic.trim() ? "#fff" : "#ffffff33",
        fontSize:13,fontWeight:700,fontFamily:"inherit",
        cursor: topic.trim() ? "pointer" : "default",
        letterSpacing:2,textTransform:"uppercase",transition:"opacity 0.2s",
        boxShadow: topic.trim() ? "0 4px 24px #FF2D5540" : "none"
      }}>
        {loading ? "Writing…" : "⚡ Generate Hooks"}
      </button>

      {loading && <Spinner />}

      {result && !result.error && (
        <div style={{ marginTop:24,animation:"slide-in 0.4s ease" }}>
          <div style={{ fontSize:11,color:"#FF2D55",letterSpacing:2,marginBottom:14,textTransform:"uppercase" }}>Generated Hooks</div>
          <div style={{ display:"grid",gap:10 }}>
            {result.hooks?.map((hook, i) => (
              <div key={i} style={{
                background: i === result.bestPick ? "#FF2D5510" : "#ffffff07",
                border: `1px solid ${i === result.bestPick ? "#FF2D5550" : "#ffffff12"}`,
                borderRadius:13,padding:"18px 18px 14px",position:"relative",
                transition:"transform 0.15s",cursor:"default"
              }}>
                {i === result.bestPick && (
                  <span style={{ position:"absolute",top:-1,left:16,fontSize:10,color:"#FF2D55",letterSpacing:1,background:"#FF2D55",padding:"2px 10px",borderRadius:"0 0 8px 8px",fontWeight:700,color:"#fff" }}>
                    ⭐ BEST PICK
                  </span>
                )}
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop: i===result.bestPick?8:0 }}>
                  <div style={{ flex:1,marginRight:12 }}>
                    <div style={{ fontSize:16,color:"#fff",fontWeight:600,marginBottom:6,lineHeight:1.4 }}>"{hook.text}"</div>
                    <div style={{ fontSize:11,color:"#ffffff33",marginBottom:4,letterSpacing:1 }}>{hook.type?.toUpperCase()}</div>
                    <div style={{ fontSize:12,color:"#ffffff55",fontStyle:"italic",lineHeight:1.5 }}>{hook.why}</div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
                    <div style={{ textAlign:"center",background:hook.viralScore>=90?"#FF2D5520":"#ffffff0a",border:`1px solid ${hook.viralScore>=90?"#FF2D5540":"#ffffff12"}`,borderRadius:8,padding:"6px 10px",minWidth:48 }}>
                      <div style={{ fontSize:18,fontWeight:800,color:hook.viralScore>=90?"#FF2D55":"#ffffffaa",lineHeight:1 }}>{hook.viralScore}</div>
                      <div style={{ fontSize:9,color:"#ffffff33",letterSpacing:1,marginTop:2 }}>SCORE</div>
                    </div>
                    <button onClick={() => copy(hook.text, i)} style={{
                      background: copied===i?"#00F2EA20":"#ffffff0a",
                      border:`1px solid ${copied===i?"#00F2EA44":"#ffffff15"}`,
                      borderRadius:7,padding:"5px 10px",cursor:"pointer",
                      fontSize:10,color:copied===i?"#00F2EA":"#ffffff55",fontFamily:"inherit",
                      letterSpacing:1,transition:"all 0.2s"
                    }}>
                      {copied===i?"✓ COPIED":"COPY"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {result.proTip && (
            <div style={{ marginTop:16,background:"#FFFC0010",border:"1px solid #FFFC0025",borderRadius:12,padding:"14px 18px" }}>
              <div style={{ fontSize:10,color:"#FFFC00",letterSpacing:2,marginBottom:6,textTransform:"uppercase" }}>⚡ Pro Tip</div>
              <div style={{ fontSize:13,color:"#ffffffaa",lineHeight:1.65 }}>{result.proTip}</div>
            </div>
          )}
        </div>
      )}
      {result?.error && (
        <div style={{ marginTop:18,background:"#FF6B3510",border:"1px solid #FF6B3530",borderRadius:10,padding:14,textAlign:"center",fontSize:13,color:"#FF6B35" }}>
          Something went wrong — check your connection and try again.
        </div>
      )}
    </div>
  );
}

// ── Content Brief Generator ───────────────────────────────────────────────────
function BriefGenerator() {
  const [brand, setBrand] = useState("");
  const [goal, setGoal] = useState("Brand Awareness");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const goals = ["Brand Awareness","Drive Sales","Grow Followers","Launch Product","Go Viral","Educate Audience"];

  const generate = async () => {
    if (!brand.trim()) return;
    setLoading(true); setResult(null);
    const sys = `You are a world-class TikTok content strategist. Respond ONLY with valid JSON, no markdown fences. Format exactly: {"title":"...","pillar":"...","concept":"...","hook":"...","script":["scene 1 desc","scene 2 desc","scene 3 desc","scene 4 desc"],"audio":"...","hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6"],"cta":"...","estimatedViews":"...","whyItWillWork":"..."}`;
    const usr = `Create a full TikTok content brief:
Brand/Creator: ${brand}
Goal: ${goal}
Target Audience: ${audience || "Gen Z & Millennials"}
Trending now: skincare, wellness, productivity hacks, sustainability, AI tools
Make it highly specific, viral-optimized, and platform-native. Each script scene should be a punchy 1-sentence action. estimatedViews should be a realistic range like "200K–800K".`;
    try {
      const raw = await askClaude(sys, usr);
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch { setResult({ error: true }); }
    setLoading(false);
  };

  const pillarColor = (p="") => {
    if (p.includes("Edu")) return "#FF2D55";
    if (p.includes("Ent")) return "#00F2EA";
    if (p.includes("Ins")) return "#FF6B35";
    return "#FFFC00";
  };

  return (
    <div style={{ animation:"slide-in 0.35s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
          <div style={{ fontSize:22,fontWeight:800,color:"#fff" }}>Content Brief Generator</div>
          <span style={{ fontSize:10,background:"linear-gradient(135deg,#00F2EA,#0088ff)",color:"#000",padding:"3px 10px",borderRadius:99,letterSpacing:2,fontWeight:700 }}>AI</span>
        </div>
        <div style={{ fontSize:13,color:"#ffffff55" }}>Full production briefs for your next viral TikTok</div>
      </div>

      <div style={{ display:"grid",gap:12,marginBottom:16 }}>
        <div>
          <label style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:7 }}>Brand / Creator Name *</label>
          <input
            value={brand} onChange={e => setBrand(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="e.g. Glossier, @fitnessguru, TechStartupXYZ"
            style={{ width:"100%",background:"#ffffff0a",border:"1px solid #ffffff18",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}
          />
        </div>
        <div>
          <label style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:7 }}>Campaign Goal</label>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {goals.map(g => (
              <button key={g} onClick={() => setGoal(g)} style={{
                padding:"8px 14px",borderRadius:99,
                border:`1px solid ${goal===g?"#00F2EA":"#ffffff18"}`,
                background: goal===g?"#00F2EA15":"transparent",
                color: goal===g?"#00F2EA":"#ffffff55",
                fontSize:12,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s"
              }}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:7 }}>Target Audience</label>
          <input
            value={audience} onChange={e => setAudience(e.target.value)}
            placeholder="e.g. women 18–25 into wellness, college students, small business owners"
            style={{ width:"100%",background:"#ffffff0a",border:"1px solid #ffffff18",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}
          />
        </div>
      </div>

      <button onClick={generate} disabled={loading || !brand.trim()} style={{
        width:"100%",padding:"15px",borderRadius:12,border:"none",
        background: brand.trim() ? "linear-gradient(135deg,#00F2EA,#0088ff)" : "#ffffff0f",
        color: brand.trim() ? "#000" : "#ffffff33",
        fontSize:13,fontWeight:700,fontFamily:"inherit",
        cursor: brand.trim() ? "pointer" : "default",
        letterSpacing:2,textTransform:"uppercase",transition:"all 0.2s",
        boxShadow: brand.trim() ? "0 4px 24px #00F2EA30" : "none"
      }}>
        {loading ? "Generating Brief…" : "📋 Generate Brief"}
      </button>

      {loading && <Spinner />}

      {result && !result.error && (
        <div style={{ marginTop:24,animation:"slide-in 0.4s ease" }}>
          {/* Title row */}
          <div style={{ background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:14,padding:"18px 20px",marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
              <div>
                <div style={{ fontSize:18,fontWeight:800,color:"#fff",marginBottom:8,lineHeight:1.3 }}>{result.title}</div>
                <span style={{ fontSize:11,color:pillarColor(result.pillar),background:pillarColor(result.pillar)+"15",padding:"3px 12px",borderRadius:99,letterSpacing:1 }}>{result.pillar}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11,color:"#ffffff33",letterSpacing:1,marginBottom:4 }}>EST. REACH</div>
                <div style={{ fontSize:20,fontWeight:800,color:"#00F2EA" }}>{result.estimatedViews}</div>
              </div>
            </div>
          </div>

          {/* Concept */}
          <div style={{ background:"#ffffff07",border:"1px solid #ffffff10",borderRadius:12,padding:"16px 18px",marginBottom:10 }}>
            <div style={{ fontSize:10,color:"#ffffff33",letterSpacing:2,textTransform:"uppercase",marginBottom:7 }}>Concept</div>
            <div style={{ fontSize:14,color:"#ffffffcc",lineHeight:1.65 }}>{result.concept}</div>
          </div>

          {/* Hook */}
          <div style={{ background:"#FF2D5510",border:"1px solid #FF2D5530",borderRadius:12,padding:"16px 18px",marginBottom:10 }}>
            <div style={{ fontSize:10,color:"#FF2D55",letterSpacing:2,textTransform:"uppercase",marginBottom:7 }}>⚡ Hook (0–3s)</div>
            <div style={{ fontSize:16,color:"#fff",fontWeight:700,lineHeight:1.4 }}>"{result.hook}"</div>
          </div>

          {/* Script */}
          <div style={{ background:"#ffffff07",border:"1px solid #ffffff10",borderRadius:12,padding:"16px 18px",marginBottom:10 }}>
            <div style={{ fontSize:10,color:"#ffffff33",letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>🎬 Script Scenes</div>
            <div style={{ display:"grid",gap:8 }}>
              {result.script?.map((scene, i) => (
                <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                  <span style={{ fontSize:11,color:"#ffffff33",background:"#ffffff0a",borderRadius:6,padding:"3px 9px",flexShrink:0,marginTop:1,letterSpacing:1 }}>S{i+1}</span>
                  <span style={{ fontSize:13,color:"#ffffffaa",lineHeight:1.55 }}>{scene}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audio + CTA side by side */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <div style={{ background:"#ffffff07",border:"1px solid #ffffff10",borderRadius:12,padding:"14px 16px" }}>
              <div style={{ fontSize:10,color:"#ffffff33",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>🎵 Audio</div>
              <div style={{ fontSize:13,color:"#ffffffaa",lineHeight:1.55 }}>{result.audio}</div>
            </div>
            <div style={{ background:"#FFFC0010",border:"1px solid #FFFC0025",borderRadius:12,padding:"14px 16px" }}>
              <div style={{ fontSize:10,color:"#FFFC00",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>🎯 CTA</div>
              <div style={{ fontSize:13,color:"#ffffffcc",fontWeight:600,lineHeight:1.55 }}>{result.cta}</div>
            </div>
          </div>

          {/* Hashtags */}
          <div style={{ background:"#ffffff07",border:"1px solid #ffffff10",borderRadius:12,padding:"14px 18px",marginBottom:10 }}>
            <div style={{ fontSize:10,color:"#ffffff33",letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>#️⃣ Hashtags</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
              {result.hashtags?.map((tag, i) => (
                <span key={i} style={{ fontSize:12,color:"#FF2D55",background:"#FF2D5515",border:"1px solid #FF2D5525",padding:"4px 12px",borderRadius:99 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Why it'll work */}
          {result.whyItWillWork && (
            <div style={{ background:"#00F2EA08",border:"1px solid #00F2EA25",borderRadius:12,padding:"14px 18px" }}>
              <div style={{ fontSize:10,color:"#00F2EA",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>💡 Why This Will Work</div>
              <div style={{ fontSize:13,color:"#ffffffaa",lineHeight:1.65 }}>{result.whyItWillWork}</div>
            </div>
          )}
        </div>
      )}
      {result?.error && (
        <div style={{ marginTop:18,background:"#FF6B3510",border:"1px solid #FF6B3530",borderRadius:10,padding:14,textAlign:"center",fontSize:13,color:"#FF6B35" }}>
          Something went wrong — check your connection and try again.
        </div>
      )}
    </div>
  );
}

// ── Static tabs ───────────────────────────────────────────────────────────────
function StrategyTab() {
  return (
    <div style={{ animation:"slide-in 0.35s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>Content Mix Framework</div>
        <div style={{ fontSize:22,fontWeight:700,color:"#fff" }}>40/30/20/10 Pillar Model</div>
      </div>
      <div style={{ display:"grid",gap:14 }}>
        {PILLARS.map((p,i)=>(
          <div key={p.label} style={{ background:"#ffffff08",border:`1px solid ${p.color}33`,borderRadius:12,padding:"16px 20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:20 }}>{p.emoji}</span>
                <span style={{ fontSize:15,fontWeight:600,color:"#ffffffcc" }}>{p.label}</span>
              </div>
              <span style={{ fontSize:22,fontWeight:800,color:p.color,textShadow:`0 0 20px ${p.color}66` }}>{p.pct}%</span>
            </div>
            <AnimatedBar pct={p.pct} color={p.color} delay={i*150}/>
          </div>
        ))}
      </div>
      <div style={{ marginTop:24,background:"#ffffff06",border:"1px solid #00F2EA33",borderRadius:12,padding:20 }}>
        <div style={{ fontSize:11,color:"#00F2EA",letterSpacing:2,marginBottom:12,textTransform:"uppercase" }}>🎵 Algorithm Checklist</div>
        {["Hook viewer in first 3 seconds","Use trending audio (top 50 chart)","5–8 hashtag mix: trending + niche + branded","Post during peak: 6–10pm local time","Reply to every comment in first hour","Create a loop — end mirrors the start"].map((item,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<5?"1px solid #ffffff08":"none" }}>
            <span style={{ width:18,height:18,borderRadius:"50%",background:"#00F2EA22",border:"1px solid #00F2EA66",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#00F2EA",flexShrink:0 }}>✓</span>
            <span style={{ fontSize:13,color:"#ffffffaa" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HooksLibTab() {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ animation:"slide-in 0.35s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>Viral Formula Library</div>
        <div style={{ fontSize:22,fontWeight:700,color:"#fff" }}>3-Second Hook Arsenal</div>
      </div>
      <div style={{ display:"grid",gap:10 }}>
        {HOOKS_LIB.map((hook,i)=>(
          <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{ background:hovered===i?"#ffffff0f":"#ffffff08",border:`1px solid ${hovered===i?"#FF2D5566":"#ffffff12"}`,borderRadius:12,padding:"18px 20px",transition:"all 0.2s" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:12,color:"#FF2D55",letterSpacing:1,marginBottom:4 }}>{hook.type.toUpperCase()}</div>
                <div style={{ fontSize:16,color:"#ffffffdd",fontStyle:"italic" }}>{hook.formula}</div>
              </div>
              <div style={{ minWidth:52,textAlign:"center",background:hook.score>90?"#FF2D5522":"#ffffff0a",border:`1px solid ${hook.score>90?"#FF2D5544":"#ffffff15"}`,borderRadius:8,padding:"6px 10px" }}>
                <div style={{ fontSize:18,fontWeight:700,color:hook.score>90?"#FF2D55":"#ffffffaa" }}>{hook.score}</div>
                <div style={{ fontSize:9,color:"#ffffff44",letterSpacing:1 }}>SCORE</div>
              </div>
            </div>
            {hovered===i&&<div style={{ marginTop:12 }}><AnimatedBar pct={hook.score} color="#FF2D55"/></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatorsTab() {
  return (
    <div style={{ animation:"slide-in 0.35s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>Partnership Strategy</div>
        <div style={{ fontSize:22,fontWeight:700,color:"#fff" }}>Creator Tier Playbook</div>
      </div>
      <div style={{ display:"grid",gap:12 }}>
        {CREATOR_TIERS.map((tier,i)=>(
          <div key={i} style={{ background:"#ffffff08",border:"1px solid #ffffff12",borderRadius:12,padding:"18px 20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <div>
                <span style={{ fontSize:13,fontWeight:700,color:"#fff",background:i===0?"#00F2EA22":"#ffffff0a",border:`1px solid ${i===0?"#00F2EA44":"#ffffff15"}`,padding:"2px 10px",borderRadius:99 }}>{tier.tier}</span>
                <span style={{ marginLeft:10,fontSize:12,color:"#ffffff55" }}>{tier.range} followers</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:20,fontWeight:800,color:i===0?"#00F2EA":"#ffffffcc" }}>{tier.roi} ROI</div>
              </div>
            </div>
            <AnimatedBar pct={tier.fill} color={i===0?"#00F2EA":"#ffffff44"} delay={i*100}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsTab() {
  return (
    <div style={{ animation:"slide-in 0.35s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11,color:"#ffffff44",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>Performance Dashboard</div>
        <div style={{ fontSize:22,fontWeight:700,color:"#fff" }}>KPI Health Monitor</div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {METRICS.map((m,i)=>(
          <div key={i} style={{ background:m.good?"#00F2EA08":"#FF6B3508",border:`1px solid ${m.good?"#00F2EA33":"#FF6B3533"}`,borderRadius:12,padding:"16px 18px" }}>
            <div style={{ fontSize:11,color:"#ffffff44",letterSpacing:1,marginBottom:8,textTransform:"uppercase" }}>{m.label}</div>
            <div style={{ fontSize:28,fontWeight:800,color:m.good?"#00F2EA":"#FF6B35",lineHeight:1 }}>{m.value}</div>
            <div style={{ marginTop:8,display:"flex",alignItems:"center",gap:6 }}>
              <PulsingDot color={m.good?"#00F2EA":"#FF6B35"}/>
              <span style={{ fontSize:11,color:"#ffffff44" }}>Target: {m.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("strategy");

  const tabs = [
    { id:"strategy",  label:"Strategy", icon:"🎯" },
    { id:"hooks-lib", label:"Hooks",    icon:"⚡" },
    { id:"creators",  label:"Creators", icon:"🤝" },
    { id:"metrics",   label:"Metrics",  icon:"📊" },
    { id:"hook-ai",   label:"Hook Writer",   icon:"✍️",  ai:true, aiColor:"#FF2D55" },
    { id:"brief-ai",  label:"Brief Gen",     icon:"📋",  ai:true, aiColor:"#00F2EA" },
  ];

  return (
    <div style={{ minHeight:"100vh",background:"#0a0a14",fontFamily:"'Courier New',monospace",color:"#e0e0ff",paddingBottom:48 }}>
      <style>{`
        @keyframes ping{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(2);opacity:0}}
        @keyframes slide-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus,select:focus{border-color:#ffffff35 !important;box-shadow:0 0 0 2px #ffffff08}
        button:active{opacity:.85}
      `}</style>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0d0d1f,#1a0a2e 50%,#0a1628)",borderBottom:"1px solid #ffffff12",padding:"24px 24px 0" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:6 }}>
          <div style={{ width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#FF2D55,#00F2EA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:"bold",color:"#000",flexShrink:0 }}>♪</div>
          <div>
            <div style={{ fontSize:19,fontWeight:800,letterSpacing:"-0.5px",color:"#fff" }}>TikTok Growth Engine</div>
            <div style={{ fontSize:10,color:"#ffffff44",letterSpacing:3,textTransform:"uppercase" }}>Viral Strategy Dashboard</div>
          </div>
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:7 }}>
            <PulsingDot color="#00F2EA"/>
            <span style={{ fontSize:10,color:"#00F2EA",letterSpacing:2 }}>LIVE</span>
          </div>
        </div>

        <div style={{ display:"flex",gap:1,marginTop:18,overflowX:"auto" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: activeTab===tab.id ? "#ffffff12" : "transparent",
              border:"none",
              borderBottom: activeTab===tab.id ? `2px solid ${tab.aiColor||"#FF2D55"}` : "2px solid transparent",
              color: activeTab===tab.id ? "#fff" : "#ffffff44",
              padding:"10px 13px",cursor:"pointer",fontSize:12,fontFamily:"inherit",
              letterSpacing:.5,transition:"all 0.2s",borderRadius:"6px 6px 0 0",
              whiteSpace:"nowrap",flexShrink:0,display:"flex",alignItems:"center",gap:5
            }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.ai && <span style={{ fontSize:9,background:tab.aiColor,color: tab.aiColor==="#00F2EA"?"#000":"#fff",padding:"1px 5px",borderRadius:99,letterSpacing:1,fontWeight:700 }}>AI</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background:"#FF2D5518",borderBottom:"1px solid #FF2D5530",overflow:"hidden",padding:"6px 0" }}>
        <div style={{ display:"flex",animation:"ticker 20s linear infinite",whiteSpace:"nowrap" }}>
          {[...TRENDING,...TRENDING].map((tag,i)=>(
            <span key={i} style={{ marginRight:32,fontSize:11,color:"#FF2D55",letterSpacing:1 }}>🔥 {tag}</span>
          ))}
        </div>
      </div>

      <div style={{ padding:"28px 24px",maxWidth:640,margin:"0 auto" }} key={activeTab}>
        {activeTab==="strategy"  && <StrategyTab/>}
        {activeTab==="hooks-lib" && <HooksLibTab/>}
        {activeTab==="creators"  && <CreatorsTab/>}
        {activeTab==="metrics"   && <MetricsTab/>}
        {activeTab==="hook-ai"   && <HookWriter/>}
        {activeTab==="brief-ai"  && <BriefGenerator/>}
      </div>
    </div>
  );
}
