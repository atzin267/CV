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
  black: "#1c0a10",        // near-black guinda backdrop
  panel: "#fbfafa",        // bright white panel
  titlebar: "#8a0f2e",     // intense guinda red
  ink: "#241f20",          // dark text on white
  blue: "#8a0f2e",         // links -> guinda red
  blueKey: "#b01540",      // keys -> brighter guinda
  green: "#8a0f2e",        // headings -> guinda red
  grey: "#6b6b6b",
  border: "#5e0a20",       // deep guinda border
};

// ---------- PDF GENERATION ----------
function generatePDF() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const M = 48;
  const W = doc.internal.pageSize.getWidth();
  let y = M;

  const navy = [138, 15, 46];
  const accent = [176, 21, 64];
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

// ---------- NAV KEYS ----------
// [F-label, button label, command, isAccent]
const NAV_KEYS = [
  ["F1", "About", "about", false],
  ["F2", "Experience", "experience", false],
  ["F3", "Skills", "skills", false],
  ["F4", "Projects", "projects", false],
  ["F5", "Contact", "contact", false],
  ["F6", "PDF ↓", "pdf", false],
  ["F7", "LinkedIn", "linkedin", false],
  ["F8", "Snake 🐍", "snake", false],
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

// ---------- typing hook (per-character reveal) ----------
function useTyped(text, speed = 22, start = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    setOut(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return [out, done];
}

const Cursor = () => (
  <span style={{
    display: "inline-block", width: 9, height: 16, background: C.titlebar,
    marginLeft: 2, verticalAlign: -2, animation: "blink 1s steps(1) infinite",
  }} />
);

// A block of text that types itself out, then "highlights" when finished.
function TypeBlock({ text, speed = 8, onDone, style }) {
  const [out, done] = useTyped(text, speed, true);
  useEffect(() => { if (done && onDone) onDone(); }, [done, onDone]);
  return (
    <span className={done ? "typed-done" : ""} style={style}>
      {out}{!done && <Cursor />}
    </span>
  );
}

// ====================================================================
//  SNAKE GAME
// ====================================================================
function Snake() {
  const COLS = 22, ROWS = 16, CELL = 18;
  const [snake, setSnake] = useState([[8, 8], [7, 8], [6, 8]]);
  const [dir, setDir] = useState([1, 0]);
  const [food, setFood] = useState([14, 8]);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  dirRef.current = dir;
  snakeRef.current = snake;

  const randFood = useCallback((sn) => {
    let f;
    do { f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)]; }
    while (sn.some(([x, y]) => x === f[0] && y === f[1]));
    return f;
  }, []);

  const reset = useCallback(() => {
    setSnake([[8, 8], [7, 8], [6, 8]]);
    setDir([1, 0]); dirRef.current = [1, 0];
    setFood([14, 8]); setDead(false); setScore(0); setStarted(true);
  }, []);

  // keyboard control
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      const cur = dirRef.current;
      if (k === "ArrowUp" && cur[1] !== 1) { e.preventDefault(); setDir([0, -1]); }
      else if (k === "ArrowDown" && cur[1] !== -1) { e.preventDefault(); setDir([0, 1]); }
      else if (k === "ArrowLeft" && cur[0] !== 1) { e.preventDefault(); setDir([-1, 0]); }
      else if (k === "ArrowRight" && cur[0] !== -1) { e.preventDefault(); setDir([1, 0]); }
      else if (k === " ") { e.preventDefault(); if (dead || !started) reset(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dead, started, reset]);

  // game loop
  useEffect(() => {
    if (!started || dead) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const [dx, dy] = dirRef.current;
        const head = [prev[0][0] + dx, prev[0][1] + dy];
        // wall collision
        if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS) { setDead(true); return prev; }
        // self collision
        if (prev.some(([x, y]) => x === head[0] && y === head[1])) { setDead(true); return prev; }
        const ate = head[0] === food[0] && head[1] === food[1];
        const next = [head, ...prev];
        if (ate) { setScore((s) => s + 1); setFood(randFood(next)); }
        else next.pop();
        return next;
      });
    }, 110);
    return () => clearInterval(id);
  }, [started, dead, food, randFood]);

  return (
    <div style={{ margin: "4px 0" }}>
      <Title>Snake — mini game</Title>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{
          position: "relative", width: COLS * CELL, height: ROWS * CELL,
          background: "#fff", border: `2px solid ${C.border}`, borderRadius: 4,
          backgroundImage: `linear-gradient(${C.panel} 1px,transparent 1px),linear-gradient(90deg,${C.panel} 1px,transparent 1px)`,
          backgroundSize: `${CELL}px ${CELL}px`,
        }}>
          {snake.map(([x, y], i) => (
            <div key={i} style={{
              position: "absolute", left: x * CELL, top: y * CELL, width: CELL, height: CELL,
              background: i === 0 ? C.titlebar : C.blueKey, borderRadius: i === 0 ? 4 : 2,
              boxShadow: i === 0 ? `0 0 6px ${C.titlebar}` : "none",
            }} />
          ))}
          <div style={{
            position: "absolute", left: food[0] * CELL + 3, top: food[1] * CELL + 3,
            width: CELL - 6, height: CELL - 6, background: "#ffd400", borderRadius: "50%",
            boxShadow: "0 0 6px #ffd400",
          }} />
          {(!started || dead) && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(28,10,16,.78)", color: "#fff", textAlign: "center", padding: 12,
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#ffd0dc" }}>
                {dead ? `Game Over — score ${score}` : "🐍 Snake"}
              </div>
              <div style={{ fontSize: 12.5, opacity: .9 }}>Use arrow keys to move.</div>
              <button className="keycap" style={{ minWidth: 0, padding: "6px 14px", background: "linear-gradient(180deg,#fff,#f1eef0)", border: "1px solid #4a0818" }} onClick={reset}>
                <span className="klabel" style={{ color: "#8a0f2e" }}>{dead ? "Play again" : "Start"} (Space)</span>
              </button>
            </div>
          )}
        </div>
        <div style={{ color: C.ink, fontSize: 13.5, maxWidth: 220 }}>
          <div style={{ fontWeight: 700, color: C.blueKey, marginBottom: 4 }}>Score: {score}</div>
          <div style={{ color: C.grey, lineHeight: 1.6 }}>
            Controls: arrow keys to steer, <b>Space</b> to start / restart.<br /><br />
            Eat the yellow dots, avoid the walls and your own tail. Type <b>clear</b> to exit.
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
//  MAIN APP
// ====================================================================
export default function App() {
  const [phase, setPhase] = useState("boot");
  const [bootIdx, setBootIdx] = useState(0);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (phase !== "boot") return;
    if (bootIdx < BOOT_LINES.length) {
      const t = setTimeout(() => setBootIdx((i) => i + 1), 360);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhase("shell");
      setHistory([
        { cmd: null, node: <WelcomeBanner /> },
        { cmd: null, node: <Section name="summary" typed /> },
      ]);
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
    else if (cmd === "about" || cmd === "summary" || cmd === "whoami") node = <Section name="summary" typed />;
    else if (cmd === "experience" || cmd === "exp" || cmd === "work") node = <Section name="experience" typed />;
    else if (cmd === "skills") node = <Section name="skills" typed />;
    else if (cmd === "projects" || cmd === "git") node = <Section name="projects" typed />;
    else if (cmd === "education" || cmd === "edu") node = <Section name="education" typed />;
    else if (cmd === "languages" || cmd === "lang" || cmd === "locale") node = <Section name="languages" typed />;
    else if (cmd === "all" || cmd === "cat cv") node = <FullCV />;
    else if (cmd === "contact") node = <Contact />;
    else if (cmd === "snake" || cmd === "play") node = <Snake />;
    else if (cmd === "pdf" || cmd === "download") { generatePDF(); node = <Ok>Generating PDF… check your downloads.</Ok>; }
    else if (cmd === "linkedin") { window.open(CV.linkedin, "_blank"); node = <Ok>Opening LinkedIn…</Ok>; }
    else if (cmd === "email" || cmd === "mail") { window.location.href = `mailto:${CV.email}`; node = <Ok>Opening mail client…</Ok>; }
    else if (cmd === "whatsapp" || cmd === "wa") { window.open(CV.whatsapp, "_blank"); node = <Ok>Opening WhatsApp…</Ok>; }
    else if (cmd === "clear" || cmd === "cls") { setHistory([]); setInput(""); return; }
    else node = <Err>command not found: {raw.trim()} — type <b>help</b></Err>;
    setHistory((h) => [...h, { cmd: raw.trim(), node }]);
    setInput("");
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const map = {
        F1: "about", F2: "experience", F3: "skills", F4: "projects",
        F5: "contact", F6: "pdf", F7: "linkedin", F8: "snake", Escape: "clear",
      };
      if (map[e.key]) { e.preventDefault(); run(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run]);

  return (
    <div style={{
      height: "100vh", width: "100vw", background: C.black, padding: "10px",
      fontFamily: "'DejaVu Sans Mono', ui-monospace, 'Courier New', monospace",
      color: "#ddd", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes blink{50%{opacity:0}}
        @keyframes fadein{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @keyframes hl{from{background:rgba(138,15,46,.28)}to{background:transparent}}
        .fade{animation:fadein .25s ease both}
        .typed-done{animation:hl 1.1s ease forwards;border-radius:3px}
        .keycap{
          font-family:inherit;cursor:pointer;
          display:inline-flex;flex-direction:column;align-items:center;justify-content:center;
          gap:2px;min-width:84px;padding:7px 12px 8px;
          background:linear-gradient(180deg,#a8163c 0%,#8a0f2e 60%,#6e0a24 100%);
          color:#fff;border:1px solid #4a0818;border-radius:8px;
          box-shadow:0 1px 0 #c4254f inset,0 -2px 3px rgba(0,0,0,.35) inset,0 4px 0 #4a0818,0 6px 9px rgba(0,0,0,.45);
          transition:transform .06s ease,box-shadow .06s ease,filter .12s ease;user-select:none;
        }
        .keycap:hover{filter:brightness(1.12)}
        .keycap:focus{outline:none}
        .keycap:focus:not(:active){transform:none}
        .keycap:active,.keycap.pressed{transform:translateY(4px);
          box-shadow:0 1px 0 #c4254f inset,0 -1px 2px rgba(0,0,0,.35) inset,0 0 0 #4a0818,0 1px 2px rgba(0,0,0,.5);}
        .keycap .fkey{font-size:10px;font-weight:700;letter-spacing:.5px;color:#ffc9d8;line-height:1}
        .keycap .klabel{font-size:12.5px;font-weight:700;line-height:1;color:#fff}
        .keycap.accent{}
        .keycap.accent .klabel{color:#fff}
        .keycap.accent .fkey{color:#ffc9d8}
        a{color:${C.blue};text-decoration:none}
        a:hover{text-decoration:underline}
        .cmdline{background:transparent;border:none;outline:none;color:${C.ink};
          font-family:inherit;font-size:15px;flex:1;caret-color:${C.titlebar}}
      `}</style>

      <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{
          background: C.panel, border: "2px solid #fff",
          boxShadow: `0 0 0 2px ${C.border}, 0 18px 50px -10px rgba(0,0,0,.8)`,
          flex: 1, display: "flex", flexDirection: "column", minHeight: 0, borderRadius: 4,
        }}>
          {/* titlebar */}
          <div style={{
            background: `linear-gradient(180deg,${C.titlebar},#6e0a24)`, color: "#fff",
            fontWeight: 700, padding: "5px 12px", borderBottom: `2px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
          }}>
            <span>atzin@dev: ~/cv — résumé shell</span>
            <span style={{ fontSize: 12, opacity: .85 }}>{phase === "boot" ? "booting…" : "online"}</span>
          </div>

          {/* keycap action bar */}
          {phase === "shell" && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 14px",
              borderBottom: `2px solid ${C.border}`,
              background: "linear-gradient(180deg,#3a0612,#2a0610)",
            }}>
              {NAV_KEYS.map(([fkey, label, cmd, accent]) => (
                <button key={cmd} className={`keycap${accent ? " accent" : ""}`} onClick={(e) => { e.currentTarget.blur(); run(cmd); }}>
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
                        <span style={{ color: "#b5557a" }}>~/cv</span>
                        <span style={{ color: C.grey }}>$ </span>
                        <span style={{ color: C.ink, fontWeight: 400 }}>{h.cmd}</span>
                      </div>
                    )}
                    {h.node}
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center" }}
                  onClick={() => inputRef.current && inputRef.current.focus()}>
                  <span style={{ color: C.blue, fontWeight: 700 }}>atzin@dev</span>
                  <span style={{ color: C.grey }}>:</span>
                  <span style={{ color: "#b5557a", fontWeight: 700 }}>~/cv</span>
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

        <div style={{ textAlign: "center", padding: "8px 4px 2px", fontSize: 12, color: "#caa", flex: "0 0 auto" }}>
          Tip: click a key, press <b style={{ color: "#ffc9d8" }}>F1–F8</b>, or type a command. Try <b style={{ color: "#ffc9d8" }}>snake</b>!
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
        <div key={i} className="fade" style={{ color: i === BOOT_LINES.length - 1 ? C.titlebar : "#7a3a4a", fontWeight: i === BOOT_LINES.length - 1 ? 700 : 400 }}>{l}</div>
      ))}
      {idx < BOOT_LINES.length && <div style={{ color: C.ink }}>_<Cursor /></div>}
    </div>
  );
}

function WelcomeBanner() {
  const [typed, done] = useTyped("whoami", 60);
  return (
    <div>
      <div style={{ color: C.green, fontWeight: 700, marginBottom: 6 }}>
        <span style={{ color: C.blue }}>atzin@dev</span>
        <span style={{ color: C.grey }}>:</span>
        <span style={{ color: "#b5557a" }}>~/cv</span>
        <span style={{ color: C.grey }}>$ </span>
        <span style={{ color: C.ink, fontWeight: 400 }}>{typed}{!done && <Cursor />}</span>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.ink, margin: "2px 0", lineHeight: 1.15 }}>{CV.name}</h1>
      <div style={{ color: C.blue, fontWeight: 700, fontSize: 15 }}>{CV.role}</div>
      <div style={{ marginTop: 6, color: C.ink, fontSize: 13.5 }}>
        {CV.location} &nbsp;·&nbsp; <a href={CV.whatsapp}>{CV.phone}</a> &nbsp;·&nbsp;
        <a href={`mailto:${CV.email}`}>{CV.email}</a> &nbsp;·&nbsp;
        <a href={CV.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <div style={{ marginTop: 8, color: C.grey, fontSize: 13 }}>Type <b style={{ color: C.blueKey }}>help</b> to list commands, or use the keys above.</div>
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
const Ok = ({ children }) => <div style={{ color: C.green, fontWeight: 600 }}>{children}</div>;
const Err = ({ children }) => <div style={{ color: "#c0152f" }}>{children}</div>;

function Section({ name, typed }) {
  const T = ({ text, style }) => typed
    ? <TypeBlock text={text} speed={6} style={style} />
    : <span style={style}>{text}</span>;

  if (name === "summary") return (
    <div><Title>Professional Summary</Title><div style={{ color: C.ink }}><T text={CV.summary} /></div></div>
  );
  if (name === "experience") return (
    <div><Title>Professional Experience</Title>
      {CV.experience.map((j, i) => (
        <div key={i} style={{ margin: "8px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span><b style={{ color: C.ink }}>{j.title}</b> <span style={{ color: "#5a4a4e" }}>— {j.company}</span></span>
            {j.date && <span style={{ color: C.grey, fontSize: 13 }}>{j.date}</span>}
          </div>
          {j.bullets.map((b, k) => <Bullet key={k}><T text={b} /></Bullet>)}
        </div>
      ))}
    </div>
  );
  if (name === "skills") return (
    <div><Title>Technical Skills</Title>
      {CV.skills.map(([k, v], i) => (
        <div key={i} style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "4px 0" }}>
          <span style={{ color: C.blueKey, fontWeight: 700, minWidth: 175 }}>{k}</span>
          <span style={{ flex: 1, color: C.ink }}><T text={v} /></span>
        </div>
      ))}
    </div>
  );
  if (name === "projects") return (
    <div><Title>Projects</Title>
      {CV.projects.map(([n, d], i) => (
        <div key={i} style={{ margin: "5px 0", color: C.ink }}><b style={{ color: C.blueKey }}>{n}</b> — <T text={d} /></div>
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
          <div style={{ color: "#5a4a4e", fontSize: 13.5 }}><T text={s} /></div>
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
    ["snake / play", "play a game of Snake 🐍"],
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
