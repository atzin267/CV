import React, { useState, useEffect, useRef, useCallback } from "react";
import { jsPDF } from "jspdf";

/* ============================================================
   Atzin Emiliano Guerrero Leyva — Interactive Terminal CV
   A React single-file app styled after a Linux boot screen.
   Features: animated boot sequence, typed prompt, runnable
   commands, reactive section navigation, keyboard shortcuts,
   and on-the-fly PDF generation (jsPDF).
   ============================================================ */

// ---------- CV DATA (single source of truth) ----------
const CV = {
  name: "Atzin Emiliano Guerrero Leyva",
  role: "Software, Automation & Cloud Developer",
  location: "Ciudad de México",
  phone: "+52 563 591 6063",
  whatsapp: "https://wa.me/525635916063",
  email: "atzin267@gmail.com",
  linkedin: "https://www.linkedin.com/in/atzin-guerrero-leyva/",
  summary:
    "Automation Developer who designs and builds automation solutions across multiple banking channels, replacing manual workflows with reliable tools that save the team significant time. Hands-on experience with Java and JavaScript automation, API integrations and process orchestration (Postman, orchestrators), and has created serverless applications on Google Cloud and Microsoft Azure. Comfortable with Google Apps Script and Python for scripting, and with Git and Bitbucket for collaboration. Backed by a Systems Technician foundation in Linux/Windows administration and networking, and focused on efficient automation that connects systems and removes manual work.",
  experience: [
    {
      title: "Automation Developer",
      company: "CDA",
      date: "Feb 2025 – Present",
      bullets: [
        "Designed and delivered multiple automation projects across different banking channels using Java and JavaScript, replacing manual workflows with reliable, reusable automated solutions.",
        "Proactively developed programs to automate time tracking, reducing manual data entry and administrative overhead.",
        "Developed tools that automatically organize and file evidence and documentation, eliminating a previously manual, error-prone process.",
        "Created management and operational support tools that streamlined internal processes and saved the team significant time.",
        "Managed code and collaboration with Git and Bitbucket, applying version control and code review across projects.",
      ],
    },
    {
      title: "Network Administration Technician",
      company: "Complete Control",
      date: "4 months",
      bullets: [
        "Administered network infrastructure and managed network protocols to ensure optimal performance.",
        "Troubleshot and resolved network and system issues, maintaining reliable connectivity and uptime.",
      ],
    },
    {
      title: "Research Collaborator",
      company: "Centro de Investigación en Computación (CIC), IPN",
      date: "",
      bullets: [
        "Applied tools such as MATLAB and Assembly for data analysis and system optimization.",
        "Expanded expertise in advanced computing concepts through research-focused tasks.",
      ],
    },
  ],
  skills: [
    ["Cloud & Serverless", "Google Cloud Platform, Microsoft Azure, serverless functions, system integrations"],
    ["Automation & Integration", "Process automation, API integrations, Postman, process orchestrators, Google Apps Script"],
    ["Programming", "Java, JavaScript, TypeScript, Python, C++, C, SQL"],
    ["Tools & Systems", "Git, Bitbucket, GitHub, Linux / Windows administration, networking, Excel (advanced)"],
    ["Soft Skills", "Problem-solving, teamwork, communication, adaptability"],
  ],
  projects: [
    ["AENETA", "Full thesis registration system built from scratch to manage and streamline submission and review of academic theses."],
    ["Compiler", "Compiler developed with lexical, syntactic and semantic analysis for programming languages."],
    ["AQUALOGGER", "Real-time water-resource monitoring system that collects and analyzes aquatic data (thesis project)."],
    ["Perceptron", "AI model for image recognition that identifies and classifies visual patterns."],
  ],
  education: [
    ["Ingeniería en Sistemas Computacionales", "2020 – 2025", "Instituto Politécnico Nacional (IPN) – ESCOM. Degree completed; titulation in progress (thesis)."],
    ["Técnico en Mantenimiento de Sistemas", "2016 – 2019", "Instituto Politécnico Nacional (IPN) – CECyT 8."],
  ],
  languages: [
    ["Spanish", "Native"],
    ["English", "B2"],
  ],
};

// ---------- THEME ----------
const C = {
  black: "#000000",
  panel: "#c9c9bd",
  titlebar: "#b85c1e",
  ink: "#1a1a1a",
  blue: "#1f4fd6",
  blueKey: "#2a3fb0",
  green: "#1f7a3d",
  grey: "#555",
  border: "#5c5c54",
};

// ---------- PDF GENERATION ----------
function generatePDF() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const M = 48;
  const W = doc.internal.pageSize.getWidth();
  let y = M;

  const navy = [31, 56, 100];
  const accent = [46, 117, 182];
  const grey = [90, 90, 90];

  const checkBreak = (h) => {
    if (y + h > doc.internal.pageSize.getHeight() - M) {
      doc.addPage();
      y = M;
    }
  };

  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...navy);
  doc.text(CV.name, M, y); y += 18;
  doc.setFontSize(12).setTextColor(...accent);
  doc.text(CV.role, M, y); y += 14;
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...grey);
  doc.text(`${CV.location}  •  ${CV.phone}  •  ${CV.email}  •  LinkedIn`, M, y);
  y += 16;

  const section = (t) => {
    checkBreak(28);
    y += 6;
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...navy);
    doc.text(t.toUpperCase(), M, y); y += 4;
    doc.setDrawColor(...accent).setLineWidth(1).line(M, y, W - M, y); y += 12;
  };
  const para = (t, opts = {}) => {
    const size = opts.size || 9.5;
    doc.setFont("helvetica", opts.bold ? "bold" : "normal").setFontSize(size).setTextColor(...(opts.color || [25, 25, 25]));
    const lines = doc.splitTextToSize(t, W - 2 * M - (opts.indent || 0));
    lines.forEach((ln) => { checkBreak(size + 3); doc.text(ln, M + (opts.indent || 0), y); y += size + 3; });
  };

  section("Professional Summary");
  para(CV.summary);

  section("Professional Experience");
  CV.experience.forEach((j) => {
    checkBreak(20);
    doc.setFont("helvetica", "bold").setFontSize(10.5).setTextColor(25, 25, 25);
    doc.text(`${j.title} — ${j.company}`, M, y);
    if (j.date) {
      doc.setFont("helvetica", "italic").setFontSize(9).setTextColor(...grey);
      doc.text(j.date, W - M, y, { align: "right" });
    }
    y += 13;
    j.bullets.forEach((b) => {
      checkBreak(12);
      doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(25, 25, 25);
      doc.text("•", M + 4, y);
      const lines = doc.splitTextToSize(b, W - 2 * M - 16);
      lines.forEach((ln, i) => { if (i) checkBreak(12); doc.text(ln, M + 16, y); y += 12; });
    });
    y += 4;
  });

  section("Technical Skills");
  CV.skills.forEach(([k, v]) => {
    checkBreak(14);
    doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(25, 25, 25);
    doc.text(`${k}:`, M, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(v, W - 2 * M - 130);
    lines.forEach((ln, i) => { if (i) checkBreak(12); doc.text(ln, M + 130, y); y += 12; });
    y += 2;
  });

  section("Projects");
  CV.projects.forEach(([n, d]) => {
    checkBreak(14);
    doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(25, 25, 25);
    const head = `${n} — `;
    doc.text(head, M, y);
    const hw = doc.getTextWidth(head);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(d, W - 2 * M - hw);
    lines.forEach((ln, i) => { if (i) { checkBreak(12); doc.text(ln, M, y); } else { doc.text(ln, M + hw, y); } y += 12; });
    y += 2;
  });

  section("Education");
  CV.education.forEach(([t, dt, s]) => {
    checkBreak(24);
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(25, 25, 25);
    doc.text(t, M, y);
    doc.setFont("helvetica", "italic").setFontSize(9).setTextColor(...grey);
    doc.text(dt, W - M, y, { align: "right" }); y += 12;
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...grey);
    doc.text(s, M, y); y += 14;
  });

  section("Languages");
  para(`Spanish: Native     English: B2`);

  doc.save("CV_Guerrero_Leyva_Atzin_Emiliano.pdf");
}

// ---------- BOOT LINES ----------
// nav keycaps: [F-label, button label, command, isAccent]
const NAV_KEYS = [
  ["F1", "About", "about", false],
  ["F2", "Experience", "experience", false],
  ["F3", "Skills", "skills", false],
  ["F4", "Projects", "projects", false],
  ["F5", "Contact", "contact", false],
  ["F6", "PDF ↓", "pdf", true],
  ["F7", "LinkedIn", "linkedin", false],
  ["esc", "Clear", "clear", false],
];

const BOOT_LINES = [
  "[  0.000000] Initializing atzin@dev résumé kernel ...",
  "[  0.184913] Loading profile: Software, Automation & Cloud Developer",
  "[  0.402551] Mounting /experience ... done",
  "[  0.661048] Mounting /skills ... done",
  "[  0.820772] Starting interactive shell ...",
  "[  0.991337] Ready.",
];

// ---------- typing hook ----------
function useTyped(text, speed = 22, start = true) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start) return;
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return out;
}

const Cursor = () => (
  <span style={{
    display: "inline-block", width: 9, height: 16, background: C.ink,
    marginLeft: 2, verticalAlign: -2, animation: "blink 1s steps(1) infinite",
  }} />
);

// ---------- main component ----------
export default function App() {
  const [phase, setPhase] = useState("boot"); // boot -> shell
  const [bootIdx, setBootIdx] = useState(0);
  const [history, setHistory] = useState([]); // {cmd, node}
  const [input, setInput] = useState("");
  const [open, setOpen] = useState({}); // collapsible sections
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // boot animation
  useEffect(() => {
    if (phase !== "boot") return;
    if (bootIdx < BOOT_LINES.length) {
      const t = setTimeout(() => setBootIdx((i) => i + 1), 360);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhase("shell");
      setHistory([{ cmd: null, node: <WelcomeBanner /> }, { cmd: null, node: <Section name="summary" /> }]);
    }, 500);
    return () => clearTimeout(t);
  }, [phase, bootIdx]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, bootIdx]);

  const run = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    let node = null;
    if (cmd === "") node = null;
    else if (cmd === "help" || cmd === "ls") node = <Help />;
    else if (cmd === "about" || cmd === "summary" || cmd === "whoami") node = <Section name="summary" />;
    else if (cmd === "experience" || cmd === "exp" || cmd === "work") node = <Section name="experience" />;
    else if (cmd === "skills") node = <Section name="skills" />;
    else if (cmd === "projects" || cmd === "git") node = <Section name="projects" />;
    else if (cmd === "education" || cmd === "edu") node = <Section name="education" />;
    else if (cmd === "languages" || cmd === "lang" || cmd === "locale") node = <Section name="languages" />;
    else if (cmd === "all" || cmd === "cat cv") node = <FullCV />;
    else if (cmd === "contact") node = <Contact />;
    else if (cmd === "pdf" || cmd === "download") { generatePDF(); node = <Ok>Generating PDF… check your downloads.</Ok>; }
    else if (cmd === "linkedin") { window.open(CV.linkedin, "_blank"); node = <Ok>Opening LinkedIn…</Ok>; }
    else if (cmd === "email" || cmd === "mail") { window.location.href = `mailto:${CV.email}`; node = <Ok>Opening mail client…</Ok>; }
    else if (cmd === "whatsapp" || cmd === "wa") { window.open(CV.whatsapp, "_blank"); node = <Ok>Opening WhatsApp…</Ok>; }
    else if (cmd === "clear" || cmd === "cls") { setHistory([]); setInput(""); return; }
    else node = <Err>command not found: {raw.trim()} — type <b>help</b></Err>;
    setHistory((h) => [...h, { cmd: raw.trim(), node }]);
    setInput("");
  }, []);

  // keyboard shortcuts matching the keycaps
  useEffect(() => {
    const onKey = (e) => {
      const map = {
        F1: "about", F2: "experience", F3: "skills", F4: "projects",
        F5: "contact", F6: "pdf", F7: "linkedin", Escape: "clear",
      };
      if (map[e.key]) { e.preventDefault(); run(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run]);

  return (
    <div style={{
      height: "100vh", background: C.black, padding: "16px 16px",
      fontFamily: "'DejaVu Sans Mono', ui-monospace, 'Courier New', monospace",
      color: "#ddd", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes blink{50%{opacity:0}}
        @keyframes fadein{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        .fade{animation:fadein .25s ease both}
        /* physical keyboard keycap */
        .keycap{
          font-family:inherit;cursor:pointer;
          display:inline-flex;flex-direction:column;align-items:center;justify-content:center;
          gap:2px;min-width:84px;padding:7px 12px 8px;
          background:linear-gradient(180deg,#3a3f45 0%,#2b2f34 60%,#23262b 100%);
          color:#cfe0ee;
          border:1px solid #15171a;
          border-radius:8px;
          box-shadow:
            0 1px 0 #4a5057 inset,
            0 -2px 3px rgba(0,0,0,.4) inset,
            0 4px 0 #15171a,
            0 6px 9px rgba(0,0,0,.55);
          transition:transform .06s ease, box-shadow .06s ease, filter .12s ease;
          user-select:none;
        }
        .keycap:hover{filter:brightness(1.18)}
        .keycap:active,.keycap.pressed{
          transform:translateY(4px);
          box-shadow:
            0 1px 0 #4a5057 inset,
            0 -1px 2px rgba(0,0,0,.4) inset,
            0 0 0 #15171a,
            0 1px 2px rgba(0,0,0,.5);
        }
        .keycap .fkey{font-size:10px;font-weight:700;letter-spacing:.5px;color:#5cc8ff;line-height:1}
        .keycap .klabel{font-size:12.5px;font-weight:700;line-height:1;color:#e8f1f8}
        .keycap.accent .klabel{color:#ffd9b0}
        .keycap.accent .fkey{color:#ffb066}
        a{color:${C.blue};text-decoration:none}
        a:hover{text-decoration:underline}
        .cmdline{background:transparent;border:none;outline:none;color:${C.ink};
          font-family:inherit;font-size:15px;flex:1;caret-color:${C.ink}}
      `}</style>

      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* panel */}
        <div style={{
          background: C.panel, border: "2px solid #efefe6",
          boxShadow: `0 0 0 2px ${C.border}, 0 18px 50px -10px rgba(0,0,0,.8)`,
          flex: 1, display: "flex", flexDirection: "column", minHeight: 0,
        }}>
          {/* titlebar */}
          <div style={{
            background: `linear-gradient(180deg,${C.titlebar},#a04e16)`, color: "#fff",
            fontWeight: 700, padding: "5px 12px", borderBottom: `2px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
          }}>
            <span>atzin@dev: ~/cv — résumé shell</span>
            <span style={{ fontSize: 12, opacity: .85 }}>{phase === "boot" ? "booting…" : "online"}</span>
          </div>

          {/* single clear action bar — keyboard keycaps (only in shell) */}
          {phase === "shell" && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 14px",
              borderBottom: `2px solid ${C.border}`,
              background: "linear-gradient(180deg,#1a1c1f,#15171a)",
            }}>
              {NAV_KEYS.map(([fkey, label, cmd, accent]) => (
                <button key={cmd} className={`keycap${accent ? " accent" : ""}`} onClick={() => run(cmd)}>
                  <span className="fkey">{fkey}</span>
                  <span className="klabel">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* screen */}
          <div ref={scrollRef} style={{
            padding: "16px 18px", color: C.ink,
            flex: phase === "boot" ? "0 0 auto" : 1, minHeight: 0,
            overflowY: "auto", fontSize: 14.5, lineHeight: 1.5,
          }}>
            {phase === "boot" ? (
              <BootSequence idx={bootIdx} />
            ) : (
              <>
                {history.map((h, i) => (
                  <div key={i} className="fade" style={{ marginBottom: 10 }}>
                    {h.cmd != null && (
                      <div style={{ color: C.green, fontWeight: 700 }}>
                        <span style={{ color: C.blue }}>atzin@dev</span>
                        <span style={{ color: C.grey }}>:</span>
                        <span style={{ color: "#8a5a1e" }}>~/cv</span>
                        <span style={{ color: C.grey }}>$ </span>
                        <span style={{ color: C.ink, fontWeight: 400 }}>{h.cmd}</span>
                      </div>
                    )}
                    {h.node}
                  </div>
                ))}
                {/* live prompt */}
                <div style={{ display: "flex", alignItems: "center" }}
                  onClick={() => inputRef.current && inputRef.current.focus()}>
                  <span style={{ color: C.blue, fontWeight: 700 }}>atzin@dev</span>
                  <span style={{ color: C.grey }}>:</span>
                  <span style={{ color: "#8a5a1e", fontWeight: 700 }}>~/cv</span>
                  <span style={{ color: C.grey, fontWeight: 700, marginRight: 6 }}>$</span>
                  <input ref={inputRef} className="cmdline" autoFocus value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") run(input); }}
                    placeholder="type 'help'…" spellCheck={false} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* subtle hint line */}
        <div style={{ textAlign: "center", padding: "8px 4px 0", fontSize: 12, color: "#777", flex: "0 0 auto" }}>
          Tip: click a key above, press <b style={{ color: "#9fd3f5" }}>F1–F7</b> on your keyboard, or type a command in the shell.
        </div>
      </div>
    </div>
  );
}

// ---------- sub components ----------
function BootSequence({ idx }) {
  return (
    <div style={{ fontFamily: "inherit" }}>
      {BOOT_LINES.slice(0, idx).map((l, i) => (
        <div key={i} className="fade" style={{ color: i === BOOT_LINES.length - 1 ? C.green : "#3a3a32" }}>{l}</div>
      ))}
      {idx < BOOT_LINES.length && <div style={{ color: C.ink }}>_<Cursor /></div>}
    </div>
  );
}

function WelcomeBanner() {
  const typed = useTyped("whoami", 60);
  return (
    <div>
      <div style={{ color: C.green, fontWeight: 700, marginBottom: 6 }}>
        <span style={{ color: C.blue }}>atzin@dev</span>
        <span style={{ color: C.grey }}>:</span>
        <span style={{ color: "#8a5a1e" }}>~/cv</span>
        <span style={{ color: C.grey }}>$ </span>
        <span style={{ color: C.ink, fontWeight: 400 }}>{typed}<Cursor /></span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: C.ink, margin: "2px 0", lineHeight: 1.15 }}>{CV.name}</h1>
      <div style={{ color: C.blue, fontWeight: 700, fontSize: 15 }}>{CV.role}</div>
      <div style={{ marginTop: 6, color: C.ink, fontSize: 13.5 }}>
        {CV.location} &nbsp;·&nbsp; <a href={CV.whatsapp}>{CV.phone}</a> &nbsp;·&nbsp;
        <a href={`mailto:${CV.email}`}>{CV.email}</a> &nbsp;·&nbsp;
        <a href={CV.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <div style={{ marginTop: 8, color: C.grey, fontSize: 13 }}>Type <b style={{ color: C.blueKey }}>help</b> to list commands, or use the buttons above.</div>
    </div>
  );
}

const Title = ({ children }) => (
  <div style={{ color: C.green, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", fontSize: 13.5, margin: "2px 0 4px", borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>{children}</div>
);
const Bullet = ({ children }) => (
  <div style={{ position: "relative", paddingLeft: 22, margin: "4px 0", color: C.ink }}>
    <span style={{ position: "absolute", left: 0, color: C.blue, fontWeight: 700, fontSize: 12 }}>&lt;*&gt;</span>{children}
  </div>
);
const Ok = ({ children }) => <div style={{ color: C.green }}>{children}</div>;
const Err = ({ children }) => <div style={{ color: "#b03030" }}>{children}</div>;

function Section({ name }) {
  if (name === "summary") return (
    <div><Title>Professional Summary</Title><div style={{ color: C.ink }}>{CV.summary}</div></div>
  );
  if (name === "experience") return (
    <div><Title>Professional Experience</Title>
      {CV.experience.map((j, i) => (
        <div key={i} style={{ margin: "8px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span><b style={{ color: C.ink }}>{j.title}</b> <span style={{ color: "#3a3a32" }}>— {j.company}</span></span>
            {j.date && <span style={{ color: C.grey, fontSize: 13 }}>{j.date}</span>}
          </div>
          {j.bullets.map((b, k) => <Bullet key={k}>{b}</Bullet>)}
        </div>
      ))}
    </div>
  );
  if (name === "skills") return (
    <div><Title>Technical Skills</Title>
      {CV.skills.map(([k, v], i) => (
        <div key={i} style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "4px 0" }}>
          <span style={{ color: C.blueKey, fontWeight: 700, minWidth: 175 }}>{k}</span>
          <span style={{ flex: 1, color: C.ink }}>{v}</span>
        </div>
      ))}
    </div>
  );
  if (name === "projects") return (
    <div><Title>Projects</Title>
      {CV.projects.map(([n, d], i) => (
        <div key={i} style={{ margin: "5px 0", color: C.ink }}><b style={{ color: C.blueKey }}>{n}</b> — {d}</div>
      ))}
    </div>
  );
  if (name === "education") return (
    <div><Title>Education</Title>
      {CV.education.map(([t, dt, s], i) => (
        <div key={i} style={{ margin: "6px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <b style={{ color: C.ink }}>{t}</b><span style={{ color: C.grey, fontSize: 13 }}>{dt}</span>
          </div>
          <div style={{ color: "#3a3a32", fontSize: 13.5 }}>{s}</div>
        </div>
      ))}
    </div>
  );
  if (name === "languages") return (
    <div><Title>Languages</Title>
      {CV.languages.map(([k, v], i) => (
        <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0" }}>
          <span style={{ color: C.blueKey, fontWeight: 700, minWidth: 120 }}>{k}</span>
          <span style={{ color: C.ink }}>{v}</span>
        </div>
      ))}
    </div>
  );
  return null;
}

function FullCV() {
  return (
    <div>
      {["summary", "experience", "skills", "projects", "education", "languages"].map((s) => (
        <div key={s} style={{ marginBottom: 10 }}><Section name={s} /></div>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <div><Title>Contact</Title>
      <div style={{ color: C.ink }}>📍 {CV.location}</div>
      <div>📱 <a href={CV.whatsapp} target="_blank" rel="noopener noreferrer">{CV.phone}</a> (WhatsApp)</div>
      <div>✉ <a href={`mailto:${CV.email}`}>{CV.email}</a></div>
      <div>🔗 <a href={CV.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/atzin-guerrero-leyva</a></div>
    </div>
  );
}

function Help() {
  const cmds = [
    ["about / whoami", "professional summary"],
    ["experience", "work history"],
    ["skills", "technical skills"],
    ["projects", "projects log"],
    ["education", "studies"],
    ["languages", "spoken languages"],
    ["contact", "contact info"],
    ["all", "print the full CV"],
    ["pdf", "download CV as PDF"],
    ["linkedin / email / whatsapp", "open link"],
    ["clear", "clear the screen"],
  ];
  return (
    <div><Title>Available commands</Title>
      {cmds.map(([c, d], i) => (
        <div key={i} style={{ display: "flex", gap: 8, margin: "2px 0" }}>
          <span style={{ color: C.blueKey, fontWeight: 700, minWidth: 230 }}>{c}</span>
          <span style={{ color: C.grey }}>{d}</span>
        </div>
      ))}
    </div>
  );
}
