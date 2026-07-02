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
  { key: "head",  label: "Head",  obj: "femalehead", thumb: "./assets/picker/head.png",  ambCmy: 0.6,  ambRgb: 0.9, spread: 0.8,  ox: 0.55, oy: -0.10, scale: 1.3 },
  { key: "fist",  label: "Fist",  obj: "fist",       thumb: "./assets/picker/fist.png",  ambCmy: 0.29, ambRgb: 0.29, spread: 0.98, ox: 0.45, oy: -0.10, scale: 1.3 },
  { key: "eye",   label: "Eye",   obj: "eye",        thumb: "./assets/picker/eye.png",   ambCmy: 0.6,  ambRgb: 0.5, spread: 0.8,  ox: 0.5,  oy: -0.08, scale: 1.25 },
  { key: "hand",  label: "Hand",  obj: "hand",       thumb: "./assets/picker/hand.png",  ambCmy: 0.6,  ambRgb: 0.9, spread: 0.8,  ox: 0.45, oy: -0.08, scale: 1.2 },
  { key: "mouth", label: "Mouth", obj: "mouth",      thumb: "./assets/picker/mouth.png", ambCmy: 0.7,  ambRgb: 0.9, spread: 0.2,  spreadRgb: 0.5, ox: 0.55, oy: 0.0, scale: 1.3 },
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
              <button key={m.key} type="button" onClick={() => setModelIdx(i)}
                style={{ flex: 1, aspectRatio: "1", padding: 0, cursor: "pointer", borderRadius: 10, overflow: "hidden",
                  background: sel ? "var(--ink)" : "var(--sand-soft)",
                  border: sel ? "2px solid var(--ink)" : "1px solid var(--sand)" }}>
                <img src={m.thumb} alt={m.label} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
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
        <StoryField className="cmy-heading" heading={"Add\nYour Story"} value={story} onChange={(e) => setStory(e.target.value)} rows={11} />
      </div>
    </div>
  );
}

// ---- Screen 3 : Instagram mockup of their post ----
function Mockup({ issueIdx, modelIdx, mode, setMode, story, shared, uploading, postUrl, err }) {
  const issue = ISSUES[issueIdx];
  const caption = story && story.trim() ? story.trim() : issue.caption;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 8px" }}>
        <div style={{ background: "var(--white)", border: "1px solid var(--sand)", borderRadius: 12, overflow: "hidden", height: "100%", position: "static" }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", height: 32 }}>
            <Avatar size={34} />
            <span style={{ font: "var(--fw-bold) 14px/1 var(--font-sans)", color: "var(--ink)" }}>you</span>
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
              <strong style={{ fontWeight: 700 }}>you</strong>{" "}
              <span style={{ color: "var(--ink-700)" }}>{caption}</span>
            </div>
            {(uploading || postUrl || err) && (
              <div style={{ marginTop: 2, font: "var(--fw-medium) 12px/1.35 var(--font-sans)" }}>
                {uploading && <span style={{ color: "var(--ink-500)" }}>Uploading to Instagram…</span>}
                {!uploading && postUrl && (
                  <a href={postUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "underline" }}>Posted to Instagram · view post »</a>
                )}
                {!uploading && !postUrl && err && <span style={{ color: "var(--like-red)" }}>Couldn't post — {err}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Bottom navigation bar — 3-zone grid keeps the progress always centered ----
function BottomBar({ step, setStep, shared, uploading, onShare }) {
  const bar = { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "10px 14px 14px", flexShrink: 0 };
  const left = { justifySelf: "start" };
  const right = { justifySelf: "end" };
  const center = { justifySelf: "center" };

  const back = (to) => <NavButton variant="ghost" onClick={() => setStep(to)}>« Back</NavButton>;
  const next = (to) => <NavButton variant="solid" onClick={() => setStep(to)}>Next »</NavButton>;

  return (
    <div style={bar}>
      <div style={left}>{step > 0 ? back(step - 1) : null}</div>
      <div style={center}></div>
      <div style={right}>
        {step < 2
          ? next(step + 1)
          : shared
            ? <NavButton variant="ghost" onClick={() => setStep(0)}>Done</NavButton>
            : <ShareButton onClick={uploading ? undefined : onShare} style={{ background: "var(--ink)", color: "var(--paper)", imageRendering: "auto", minWidth: 120, padding: "11px 22px", fontSize: 13, border: "1px solid var(--ink)", opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? "none" : "auto" }}>{uploading ? "Posting…" : "SHARE »"}</ShareButton>}
      </div>
    </div>
  );
}

function Creator2() {
  const [step, setStep] = useState(0);
  const [issueIdx, setIssueIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [mode, setMode] = useState("light");
  const [story, setStory] = useState("");
  const [shared, setShared] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [postUrl, setPostUrl] = useState(null);
  const [err, setErr] = useState(null);

  // Leaving the mockup resets the post state so re-sharing starts clean.
  useEffect(() => { if (step < 2) { setShared(false); setPostUrl(null); setErr(null); } }, [step]);

  // Publish the two-video carousel (light + dark poster) to Instagram through
  // the /api/publish serverless function. Caption = the user's story (or the
  // issue default); the two clips are chosen server-side from issue + model.
  const publish = async () => {
    setErr(null); setUploading(true);
    try {
      const issue = ISSUES[issueIdx];
      const caption = story && story.trim() ? story.trim() : issue.caption;
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: issueKey(issue), model: MODELS[modelIdx].key, caption }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || ("Request failed (" + res.status + ")"));
      setPostUrl(data.permalink || null);
      setShared(true);
    } catch (e) {
      setErr((e && e.message) || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  let screen;
  if (step === 0) screen = <Creator issueIdx={issueIdx} setIssueIdx={setIssueIdx} modelIdx={modelIdx} setModelIdx={setModelIdx} mode={mode} setMode={setMode} />;
  else if (step === 1) screen = <Story story={story} setStory={setStory} />;
  else screen = <Mockup issueIdx={issueIdx} modelIdx={modelIdx} mode={mode} setMode={setMode} story={story} shared={shared} uploading={uploading} postUrl={postUrl} err={err} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-screen)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box" }}>
      <PhoneFrame width={372} height={740} screen="var(--paper)">
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
          <TopBar step={step} />
          <div style={{ flex: 1, minHeight: 0 }}>{screen}</div>
          <BottomBar step={step} setStep={setStep} shared={shared} uploading={uploading} onShare={publish} />
        </div>
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
