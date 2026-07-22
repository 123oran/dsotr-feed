/* global React */
const { useState, useRef, useEffect } = React;

const DS = window.DarkSideOfTheRainbowDesignSystem_939f41 || {};
const {
  PhoneFrame, IssueTab, NavButton, NavDots, ShareButton,
  StoryField, Avatar, ActionBar, StatBlock, Icon,
} = DS;

const ISSUES = window.DSOTR_POSTERS || [];

// ---- The five 3D models, with the per-model viewer params from the
// original sketch. The issue (text) and the model (geometry) are chosen
// independently so users can mix & match. ----
const MODELS = [
  { key: "head",  label: "Head",  obj: "femalehead", thumb: "./assets/picker/head.svg",  ambCmy: 0.6,  ambRgb: 0.9, spread: 0.8,  ox: 0.55, oy: -0.10, scale: 1.3 },
  { key: "fist",  label: "Fist",  obj: "fist",       thumb: "./assets/picker/fist.svg",  ambCmy: 0.29, ambRgb: 0.29, spread: 0.98, ox: 0.45, oy: -0.10, scale: 1.3 },
  { key: "eye",   label: "Eye",   obj: "eye",        thumb: "./assets/picker/eye.svg",   ambCmy: 0.6,  ambRgb: 0.5, spread: 0.8,  ox: 0.5,  oy: -0.08, scale: 1.25 },
  { key: "hand",  label: "Hand",  obj: "hand",       thumb: "./assets/picker/hand.svg",  ambCmy: 0.6,  ambRgb: 0.9, spread: 0.8,  ox: 0.45, oy: -0.08, scale: 1.2 },
  { key: "mouth", label: "Mouth", obj: "mouth",      thumb: "./assets/picker/mouth.svg", ambCmy: 0.7,  ambRgb: 0.9, spread: 0.8,  ox: 0.55, oy: 0.0, scale: 1.3 },
];

const VIEWER = "https://cmyk-stack-viewer.vercel.app/";
function modelURL(m, mode) {
  const amb = mode === "light" ? m.ambCmy : m.ambRgb;
  const spread = mode === "dark" && m.spreadRgb != null ? m.spreadRgb : m.spread;
  const color = mode === "light" ? "cmy" : "rgb";
  const objs = encodeURIComponent(JSON.stringify([{ type: m.obj }]));
  return (
    VIEWER +
    "?embed=1&slices=14&contrast=0.97&light=1.80&rotateSpeed=0.8&camera=diagonal" +
    "&spread=" + spread + "&ambient=" + amb + "&color=" + color +
    "&offsetX=" + m.ox + "&offsetY=" + m.oy + "&scale=" + m.scale +
    "&objects=" + objs
  );
}

function TopBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px", flexShrink: 0 }}>
      <span style={{ font: "var(--fw-bold) 11px/1 var(--font-sans)", letterSpacing: "0.06em", color: "var(--ink)" }}>DSOTR</span>
      <NavDots count={3} index={step} variant="pill" />
    </div>
  );
}

// ---- The live poster: viewer iframe (provides cream/black bg + the
// prismatic model) with the issue text laid over it. ----
function LivePoster({ issue, model, mode, rounded = 0, compact = false }) {
  const dark = mode === "dark";
  const ink = dark ? "var(--white)" : "var(--ink)";
  const bg = dark ? "#0C0D10" : "#F6F1E7";
  const titleSize = compact ? 15 : 19;
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, borderRadius: rounded, overflow: "hidden" }}>
      <iframe
        title="poster"
        src={modelURL(model, mode)}
        loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: bg, pointerEvents: "none" }}
      />
      {/* Tagline */}
      <div style={{ position: "absolute", left: compact ? 16 : 20, top: compact ? 14 : 20, zIndex: 2, pointerEvents: "none" }}>
        <div style={{ font: `var(--fw-black) ${titleSize}px/1.03 var(--font-sans)`, letterSpacing: "-0.02em", color: ink }}>Dark Side of The Rainbow</div>
        <div style={{ font: "var(--fw-medium) 10px/1.3 var(--font-sans)", color: ink, marginTop: 3 }}>Mental Health Struggles of LGBTQ+ Youth</div>
      </div>
      {/* Body */}
      {!dark ? (
        <div style={{ position: "absolute", left: compact ? 16 : 20, bottom: compact ? 14 : 25, right: compact ? 14 : 18, zIndex: 2, pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "flex-end", lineHeight: 0.82, color: ink }}>
            <span style={{ font: `var(--fw-black) ${compact ? 54 : 80}px/0.82 var(--font-sans)`, letterSpacing: 0 }}>{issue.stat}</span>
            <span style={{ font: `var(--fw-bold) ${compact ? 26 : 30}px/1 var(--font-sans)`, marginTop: compact ? 6 : 8, marginLeft: 3 }}>{issue.unit}</span>
          </div>
          <p style={{ margin: `${compact ? 8 : 10}px ${compact ? 0 : 60}px ${compact ? 0 : 45}px 0`, font: `var(--fw-regular) ${compact ? 11.5 : 12}px/${compact ? "1.4" : "16px"} var(--font-sans)`, color: ink, textWrap: "pretty" }}>
            {issue.problem.map((s, i) => (s.b ? <strong key={i} style={{ fontWeight: 700 }}>{s.t}</strong> : <span key={i}>{s.t}</span>))}
          </p>
          <div style={{ marginTop: compact ? 10 : 14, font: `var(--fw-bold) ${compact ? 15 : 18}px/1 var(--font-sans)`, color: ink, display: "flex", gap: 4 }}>
            {issue.cta} <span aria-hidden="true">{"\u203A\u203A"}</span>
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: compact ? 16 : 20, top: compact ? 60 : 189, right: compact ? 14 : 18, bottom: compact ? 14 : 25, zIndex: 2, display: "flex", flexDirection: "column", pointerEvents: "none" }}>
          <div style={{ font: `var(--fw-regular) ${compact ? 14 : 16}px/1.2 var(--font-sans)`, color: ink }}>{issue.lead}</div>
          <div style={{ font: `var(--fw-bold) ${compact ? 32 : 38}px/0.95 var(--font-sans)`, color: ink, whiteSpace: "pre-line", marginTop: 6, letterSpacing: "-0.01em" }}>{issue.support}</div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", lineHeight: 0.82, color: ink }}>
            <span style={{ font: `var(--fw-black) ${compact ? 50 : 80}px/0.82 var(--font-sans)`, letterSpacing: 0 }}>{issue.stat2}</span>
            <span style={{ font: `var(--fw-bold) ${compact ? 24 : 28}px/1 var(--font-sans)`, marginTop: compact ? 5 : 7, marginLeft: 3 }}>{issue.unit2}</span>
          </div>
          <p style={{ margin: "8px 0 0", font: `var(--fw-regular) ${compact ? 13 : 15}px/1.35 var(--font-sans)`, color: ink, textWrap: "pretty" }}>
            {issue.closing.map((s, i) => (s.b ? <strong key={i} style={{ fontWeight: 700 }}>{s.t}</strong> : <span key={i}>{s.t}</span>))}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Reusable swipeable poster: two panels (light|dark) on a sliding track ----
function SwipePreview({ issueIdx, modelIdx, mode, setMode, compact = false, rounded = 5, style }) {
  const drag = useRef(null);
  const onDown = (e) => { drag.current = (e.touches ? e.touches[0].clientX : e.clientX); };
  const onUp = (e) => {
    if (drag.current == null) return;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dx = x - drag.current;
    if (Math.abs(dx) > 40) setMode(dx < 0 ? "dark" : "light");
    drag.current = null;
  };
  return (
    <div
      onMouseDown={onDown} onMouseUp={onUp} onTouchStart={onDown} onTouchEnd={onUp}
      style={{ position: "relative", overflow: "hidden", cursor: "grab", userSelect: "none", ...style }}
    >
      {/* Sliding track holds both light & dark posters side by side */}
      <div style={{ position: "absolute", inset: 0, display: "flex", width: "200%", transform: mode === "dark" ? "translateX(-50%)" : "translateX(0)", transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <div style={{ position: "relative", width: "50%", height: "100%" }}>
          <LivePoster issue={ISSUES[issueIdx]} model={MODELS[modelIdx]} mode="light" rounded={rounded} compact={compact} />
        </div>
        <div style={{ position: "relative", width: "50%", height: "100%" }}>
          <LivePoster issue={ISSUES[issueIdx]} model={MODELS[modelIdx]} mode="dark" rounded={rounded} compact={compact} />
        </div>
      </div>
      {/* swipe affordance */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 3, pointerEvents: "none" }}>
        <button type="button" onClick={() => setMode("light")} style={{ all: "unset", cursor: "pointer", pointerEvents: "auto", width: 8, height: 8, borderRadius: 999, background: mode === "light" ? (mode === "dark" ? "#fff" : "var(--ink)") : "rgba(140,140,140,0.55)" }} />
        <button type="button" onClick={() => setMode("dark")} style={{ all: "unset", cursor: "pointer", pointerEvents: "auto", width: 8, height: 8, borderRadius: 999, background: mode === "dark" ? "#fff" : "rgba(140,140,140,0.55)" }} />
      </div>
    </div>
  );
}

// ---- Screen 1 : Creator — pick issue + model, swipe the preview ----
function Creator({ issueIdx, setIssueIdx, modelIdx, setModelIdx, mode, setMode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Issue tabs — two filled rows (3 + 2), matching the model picker */}
      <div style={{ padding: "0 16px 8px", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        {[ISSUES.slice(0, 3), ISSUES.slice(3)].map((row, r) => (
          <div key={r} style={{ display: "flex", gap: 6 }}>
            {row.map((it) => {
              const i = ISSUES.indexOf(it);
              return (
                <IssueTab
                  key={it.name}
                  active={i === issueIdx}
                  onClick={() => setIssueIdx(i)}
                  style={{ flex: 1, display: "flex", justifyContent: "center", padding: "9px 8px",
                    background: i === issueIdx ? "var(--ink)" : "var(--sand-soft)" }}
                >
                  {it.name}
                </IssueTab>
              );
            })}
          </div>
        ))}
      </div>

      {/* Live preview — swipe left/right to flip light ↔ dark */}
      <SwipePreview
        issueIdx={issueIdx} modelIdx={modelIdx} mode={mode} setMode={setMode} rounded={5}
        style={{ flex: 1, margin: "0 16px", border: "1px solid var(--sand)", borderRadius: 6 }}
      />

      {/* Model picker */}
      <div style={{ flexShrink: 0, padding: "10px 16px 6px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {MODELS.map((m, i) => {
            const sel = i === modelIdx;
            return (
              <button key={m.key} type="button" onClick={() => setModelIdx(i)} aria-label={m.label} title={m.label}
                style={{ flex: 1, aspectRatio: "1", display: "grid", placeItems: "center", padding: 0, cursor: "pointer", borderRadius: 10, overflow: "hidden",
                  background: sel ? "var(--ink)" : "var(--sand-soft)",
                  border: sel ? "2px solid var(--ink)" : "1px solid var(--sand)" }}>
                {/* Monochrome model icon, recoloured via CSS mask: ink on sand, paper on ink. */}
                <span aria-hidden="true" style={{ width: "76%", aspectRatio: "1",
                  background: sel ? "var(--paper)" : "var(--ink)",
                  WebkitMaskImage: `url("${m.thumb}")`, maskImage: `url("${m.thumb}")`,
                  WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center", maskPosition: "center",
                  WebkitMaskSize: "contain", maskSize: "contain" }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Screen 2 : Add Your Story ----
function Story({ story, setStory }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: "10px 20px" }}>
        <StoryField heading={"Add\nYour Story"} value={story} onChange={(e) => setStory(e.target.value)} rows={11} />
      </div>
    </div>
  );
}

// ---- Connection status / "connect your own Instagram" control ----
function ConnectBar({ account, authMsg, onConnect, onDisconnect }) {
  const link = { all: "unset", cursor: "pointer", color: "var(--ink)", textDecoration: "underline", fontWeight: 700 };
  const strong = { color: "var(--ink)", fontWeight: 700 };
  const note = { connected: "Connected — you'll post to your own account.", disconnected: "Disconnected.", denied: "Instagram login was cancelled." }[authMsg] || (authMsg ? "Couldn't connect — try again." : null);
  return (
    <div style={{ padding: "0 16px 6px", flexShrink: 0, font: "var(--fw-medium) 11.5px/1.4 var(--font-sans)", color: "var(--ink-500)" }}>
      {note && <div style={{ color: authMsg === "connected" ? "var(--ink)" : "var(--ink-500)", marginBottom: 2 }}>{note}</div>}
      {account && account.source === "session"
        ? <span>Posting as <strong style={strong}>@{account.username || "you"}</strong> · <button type="button" onClick={onDisconnect} style={link}>Disconnect</button></span>
        : account && account.canPost
          ? <span>Posting to {account.username ? <strong style={strong}>@{account.username}</strong> : "the default account"} · <button type="button" onClick={onConnect} style={link}>Connect your Instagram »</button></span>
          : <button type="button" onClick={onConnect} style={link}>Connect Instagram to post »</button>}
    </div>
  );
}

// ---- Screen 3 : Instagram mockup of their post ----
function Mockup({ issueIdx, modelIdx, mode, setMode, story, shared, err, account, authMsg, onConnect, onDisconnect }) {
  const issue = ISSUES[issueIdx];
  const caption = story && story.trim() ? story.trim() : issue.caption;
  // Show the handle we'll actually post as (connected account, else the default), "you" as a last resort.
  const name = (account && account.username) || "you";
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 8px" }}>
        <div style={{ background: "var(--white)", border: "1px solid var(--sand)", borderRadius: 12, overflow: "hidden", minHeight: "100%", position: "static" }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", height: 32 }}>
            <Avatar size={34} />
            <span style={{ font: "var(--fw-bold) 14px/1 var(--font-sans)", color: "var(--ink)" }}>{name}</span>
            {shared && <span style={{ font: "var(--fw-medium) 11px/1 var(--font-sans)", color: "var(--ink-500)" }}>· just now</span>}
            <span style={{ marginLeft: "auto", color: "var(--ink)", display: "inline-flex" }}><Icon name="dots" size={16} /></span>
          </div>
          {/* poster */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1.5" }}>
            <SwipePreview issueIdx={issueIdx} modelIdx={modelIdx} mode={mode} setMode={setMode} rounded={5} style={{ position: "absolute", inset: 0 }} />
          </div>
          {/* actions + caption */}
          <div style={{ padding: "10px 14px 12px" }}>
            <ActionBar likes={shared ? 1 : 0} comments={0} shares={0} />
            <div style={{ marginTop: 6, marginBottom: 6, font: "var(--fw-regular) 13px/1.4 var(--font-sans)", color: "var(--ink)" }}>
              <strong style={{ fontWeight: 700 }}>{name}</strong>{" "}
              <span style={{ color: "var(--ink-700)" }}>{caption}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Always keep the connect control reachable — an error must never hide the
          one button that fixes it (you can't post until an account is connected). */}
      {err && (
        <div style={{ padding: "4px 16px 2px", flexShrink: 0, font: "var(--fw-bold) 12.5px/1.35 var(--font-sans)" }}>
          <span style={{ color: "var(--like-red)" }}>Couldn't post — <span style={{ fontWeight: 500 }}>{err}</span></span>
        </div>
      )}
      <ConnectBar account={account} authMsg={authMsg} onConnect={onConnect} onDisconnect={onDisconnect} />
    </div>
  );
}

// ---- Success screen — shown after the post publishes (styled like "Add Your Story") ----
function Success({ username }) {
  const handle = username ? "@" + username : "your account";
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px 24px" }}>
        <div aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 999, background: "var(--ink)", color: "var(--paper)", font: "var(--fw-bold) 24px/1 var(--font-sans)", marginBottom: 22 }}>{"✓"}</div>
        <h2 style={{ margin: 0, font: "var(--fw-black) 33px/1.08 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--ink)" }}>
          Your post was successfully uploaded to {handle}
        </h2>
      </div>
    </div>
  );
}

// ---- Bottom navigation bar — 3-zone grid keeps the progress always centered ----
function BottomBar({ step, setStep, onExitToHome, shared, postUrl, onShare, onStartOver, onViewPost }) {
  const bar = { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "10px 14px 14px", flexShrink: 0 };
  const left = { justifySelf: "start" };
  const right = { justifySelf: "end" };
  const center = { justifySelf: "center" };

  const back = (to) => <NavButton variant="ghost" onClick={() => setStep(to)}>« Back</NavButton>;
  const next = (to) => <NavButton variant="solid" onClick={() => setStep(to)}>Next »</NavButton>;

  // After a successful post: Start over ↔ View post
  if (shared) {
    return (
      <div style={bar}>
        <div style={left}><NavButton variant="ghost" onClick={onStartOver}>« Start over</NavButton></div>
        <div style={center}></div>
        <div style={right}>
          <NavButton variant="solid" onClick={onViewPost}
            style={{ opacity: postUrl ? 1 : 0.5, pointerEvents: postUrl ? "auto" : "none" }}>View post »</NavButton>
        </div>
      </div>
    );
  }

  return (
    <div style={bar}>
      {/* On the first step "Back" leaves to the landing page; afterwards it steps back. */}
      <div style={left}>{step > 0 ? back(step - 1) : <NavButton variant="ghost" onClick={onExitToHome}>« Back</NavButton>}</div>
      <div style={center}></div>
      <div style={right}>
        {step < 2
          ? next(step + 1)
          : <ShareButton onClick={onShare} style={{ background: "var(--ink)", color: "var(--paper)", imageRendering: "auto", minWidth: 120, padding: "11px 22px", fontSize: 13, border: "1px solid var(--ink)" }}>SHARE »</ShareButton>}
      </div>
    </div>
  );
}

// ---- Landing screen — brand hero + Start ----
function Home({ onStart, account, onConnect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      <div style={{ padding: "12px 16px 8px", flexShrink: 0 }}>
        <span style={{ font: "var(--fw-bold) 11px/1 var(--font-sans)", letterSpacing: "0.06em", color: "var(--ink)" }}>DSOTR</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
        <h1 style={{ margin: 0, font: "var(--fw-black) 44px/1.0 var(--font-sans)", letterSpacing: "-0.03em", color: "var(--ink)" }}>
          <span style={{ display: "block", whiteSpace: "nowrap" }}>Dark Side of</span>
          <span style={{ display: "block", whiteSpace: "nowrap" }}>The Rainbow</span>
        </h1>
        <div style={{ marginTop: 16, font: "var(--fw-medium) 15px/1.35 var(--font-sans)", color: "var(--ink)" }}>
          Mental Health Struggles of LGBTQ+ Youth
        </div>
        <p style={{ margin: "14px 0 0", maxWidth: 290, font: "var(--fw-regular) 13px/1.5 var(--font-sans)", color: "var(--ink-500)" }}>
          Turn the hard statistics on LGBTQ+ youth mental health into an Instagram poster. Pick an issue and a model, add your story, and share it.
        </p>
      </div>
      <div style={{ padding: "0 24px 30px", flexShrink: 0 }}>
        <button type="button" onClick={onStart} style={{
          all: "unset", display: "block", boxSizing: "border-box", width: "100%", textAlign: "center", cursor: "pointer",
          background: "var(--ink)", color: "var(--paper)", border: "1px solid var(--ink)", borderRadius: 6,
          font: "var(--fw-bold) 15px/1 var(--font-sans)", padding: "15px 22px",
        }}>Start »</button>
        <div style={{ marginTop: 12, textAlign: "center", font: "var(--fw-medium) 12px/1.4 var(--font-sans)", color: "var(--ink-500)" }}>
          {account && account.source === "session"
            ? <span>Connected as <strong style={{ color: "var(--ink)", fontWeight: 700 }}>@{account.username}</strong></span>
            : <button type="button" onClick={onConnect} style={{ all: "unset", cursor: "pointer", color: "var(--ink)", textDecoration: "underline", fontWeight: 700 }}>Connect your Instagram »</button>}
        </div>
      </div>
    </div>
  );
}

function Creator2() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [issueIdx, setIssueIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [mode, setMode] = useState("light");
  const [story, setStory] = useState("");
  const [shared, setShared] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);   // which publish phase we're on
  const [postUrl, setPostUrl] = useState(null);
  const [postUser, setPostUser] = useState(null);   // the handle the post actually went to
  const [err, setErr] = useState(null);
  const [account, setAccount] = useState(null);   // { connected, username, source, canPost }
  const [authMsg, setAuthMsg] = useState(null);
  // Read the phone/desktop split synchronously so a real phone never flashes the
  // desktop device frame on its first paint before the effect can correct it.
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(max-width: 640px)").matches);
  const busyRef = useRef(false);   // guards publish() against re-entrant (double / keyboard) triggers
  const bodyRef = useRef(null);    // the app body — made inert while a post uploads

  // On a phone, the app IS the screen — render it full-bleed, no PhoneFrame chrome.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsPhone(mq.matches);
    apply();
    mq.addEventListener ? mq.addEventListener("change", apply) : mq.addListener(apply);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", apply) : mq.removeListener(apply); };
  }, []);

  // Fully disable the app (pointer AND keyboard/focus) while a post uploads — the
  // dimming veil only blocks the mouse, so `inert` closes the keyboard path too.
  useEffect(() => { if (bodyRef.current) bodyRef.current.inert = uploading; }, [uploading]);

  // Leaving the mockup resets the post state so re-sharing starts clean.
  useEffect(() => { if (step < 2) { setShared(false); setPostUrl(null); setErr(null); } }, [step]);

  // On load: restore the poster if we're returning from the Instagram OAuth
  // redirect, read the ?ig= result, and find out which account we'll post as.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("dsotr_state");
      if (saved) {
        sessionStorage.removeItem("dsotr_state");
        const s = JSON.parse(saved);
        if (s.started) setStarted(true);
        if (typeof s.step === "number") setStep(s.step);
        if (typeof s.issueIdx === "number") setIssueIdx(s.issueIdx);
        if (typeof s.modelIdx === "number") setModelIdx(s.modelIdx);
        if (s.mode) setMode(s.mode);
        if (typeof s.story === "string") setStory(s.story);
      }
    } catch (e) {}
    const ig = new URLSearchParams(window.location.search).get("ig");
    if (ig) {
      setAuthMsg(ig);
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    }
    fetch("/api/auth/session").then((r) => r.json()).then(setAccount).catch(() => setAccount(null));
  }, []);

  // Persist the built poster across the full-page OAuth redirect, then navigate.
  const goAuth = (path) => {
    try { sessionStorage.setItem("dsotr_state", JSON.stringify({ started, step, issueIdx, modelIdx, mode, story })); } catch (e) {}
    window.location.href = path;
  };
  const connect = () => goAuth("/api/auth/login");
  const disconnect = () => goAuth("/api/auth/logout");

  // Return to the opening screen + clear the post state ("Start over" on the success
  // screen uses this). Keeps the connected account.
  const reset = () => { setStarted(false); setStep(0); setShared(false); setPostUrl(null); setPostUser(null); setProgress(null); setErr(null); setStory(""); };

  // Publish the two-video carousel (light + dark poster) to Instagram through
  // the /api/publish serverless function. Caption = the user's story (or the
  // issue default); the two clips are chosen server-side from issue + model.
  // Instagram ingests each ~55s HD clip asynchronously — too slow to wait out
  // inside one serverless call (Vercel Hobby caps functions at 60s). So we drive
  // the publish as a small state machine: create the two video containers, poll
  // until Instagram has processed them, bundle them into a carousel, poll that,
  // then publish. Each /api/publish call returns in a second or two.
  const post = async (payload) => {
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || ("Request failed (" + res.status + ")"));
    return data;
  };
  // Poll the given container id(s) until Instagram reports them FINISHED.
  const waitReady = async (ids) => {
    const deadline = Date.now() + 180000;             // 3-min client-side ceiling
    await new Promise((r) => setTimeout(r, 6000));    // videos need a beat before the first check
    for (;;) {
      const { ready, error } = await post({ phase: "status", ids });
      if (error) throw new Error(error);
      if (ready) return;
      if (Date.now() > deadline) throw new Error("Instagram is still processing — give it a moment and press Share again.");
      await new Promise((r) => setTimeout(r, 5000));
    }
  };
  const publish = async () => {
    if (busyRef.current) return;   // ignore re-entrant triggers (double-click, keyboard Enter behind the veil)
    busyRef.current = true;
    setErr(null); setPostUrl(null); setUploading(true); setProgress("Uploading the videos…");
    try {
      const issue = ISSUES[issueIdx];
      const caption = story && story.trim() ? story.trim() : issue.caption;
      // 1 · create a container per carousel video item
      const { containers } = await post({ phase: "create", issue: issueKey(issue), model: MODELS[modelIdx].key });
      // 2 · wait for both clips to finish processing on Instagram's side
      setProgress("Instagram is processing the videos…");
      await waitReady(containers);
      // 3 · bundle them into a carousel container, then wait for it too
      setProgress("Almost there — building the post…");
      const { carousel } = await post({ phase: "carousel", containers, caption });
      await waitReady([carousel]);
      // 4 · publish
      setProgress("Publishing…");
      const done = await post({ phase: "publish", carousel });
      setPostUrl(done.permalink || null);
      setPostUser(done.account || (account && account.username) || null);
      setShared(true);
    } catch (e) {
      setErr((e && e.message) || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
      busyRef.current = false;
    }
  };

  let screen;
  if (shared) screen = <Success username={postUser} />;
  else if (step === 0) screen = <Creator issueIdx={issueIdx} setIssueIdx={setIssueIdx} modelIdx={modelIdx} setModelIdx={setModelIdx} mode={mode} setMode={setMode} />;
  else if (step === 1) screen = <Story story={story} setStory={setStory} />;
  else screen = <Mockup issueIdx={issueIdx} modelIdx={modelIdx} mode={mode} setMode={setMode} story={story} shared={shared} err={err} account={account} authMsg={authMsg} onConnect={connect} onDisconnect={disconnect} />;

  const viewPost = () => { if (postUrl) window.open(postUrl, "_blank", "noopener,noreferrer"); };

  // The app body — landing screen OR the 3-step flow. Identical markup whether it
  // sits inside the desktop device frame or runs full-bleed on a phone.
  const body = !started ? (
    <Home onStart={() => setStarted(true)} account={account} onConnect={connect} />
  ) : (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      <TopBar step={step} />
      <div style={{ flex: 1, minHeight: 0 }}>{screen}</div>
      <BottomBar step={step} setStep={setStep} onExitToHome={() => setStarted(false)}
        shared={shared} postUrl={postUrl} onShare={publish} onStartOver={reset} onViewPost={viewPost} />
    </div>
  );

  // While a post uploads, disable the whole app behind a dimming veil (it captures
  // every click) so nothing can be pressed until it finishes.
  const veil = uploading ? (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(246,241,231,0.82)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 28, textAlign: "center" }}>
      <div className="dsotr-spin" style={{ width: 34, height: 34, borderRadius: 999, border: "3px solid var(--sand)", borderTopColor: "var(--ink)" }} />
      <div style={{ font: "var(--fw-bold) 14px/1.4 var(--font-sans)", color: "var(--ink)", maxWidth: 260 }}>{progress || "Posting to Instagram…"}</div>
    </div>
  ) : null;

  const stage = (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={bodyRef} style={{ width: "100%", height: "100%" }}>{body}</div>
      {veil}
    </div>
  );

  // Phone: the app IS the screen — no device mockup, no grey chrome.
  if (isPhone) {
    return (
      <div style={{ height: "100dvh", width: "100%", background: "var(--paper)", overflow: "hidden" }}>
        {stage}
      </div>
    );
  }
  // Desktop: float the app inside the black device frame on the grey chrome.
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-screen)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box" }}>
      <PhoneFrame width={372} height={740} screen="var(--paper)">
        {stage}
      </PhoneFrame>
    </div>
  );
}

window.DSOTRFeed = Creator2;

// Stable, filename-safe key per issue — matches the media/ clip names and the
// /api/publish whitelist: "Suicide" -> "suicide", etc. (hoisted, so the
// publish() handler above can use it).
function issueKey(issue) { return (issue && issue.name ? issue.name : "").toLowerCase(); }

// Expose the poster renderer + data so the offline batch renderer
// (render/poster.html) can draw any issue × model × mode exactly like the
// in-app preview. Unused by the app UI itself.
window.DSOTR_RENDER = { LivePoster, MODELS, ISSUES, modelURL, issueKey };
