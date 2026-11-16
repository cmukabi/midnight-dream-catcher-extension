// Midnight Dream Catcher — Desktop Companion side panel
"use strict";

const WORKER = "https://fragrant-glitter-cd3cdreamcatcher-proxy.cmukabi.workers.dev";
const DEFAULTS = {
  provider: "local",
  openaiModel: "gpt-4o-mini",
  anthropicModel: "claude-haiku-5-5",
  pwaUrl: "https://dreamcatcherapp.co.uk"
};
const K = {
  fragments: "mdc.ext.fragments.v1",
  settings: "mdc.ext.settings.v1",
  history: "mdc.ext.symbolHistory.v1",
  deviceId: "mdc.ext.deviceId.v1",
  pendingKeys: ["pendingSymbol", "sourceUrl", "capturedAt"]
};

const $ = (id) => document.getElementById(id);
const store = {
  get: (key, fallback) => chrome.storage.local.get(key).then((r) => (r[key] === undefined ? fallback : r[key])),
  set: (key, value) => chrome.storage.local.set({ [key]: value })
};
let settings = { ...DEFAULTS };

function flash(el, msg, ms = 2200) {
  el.textContent = msg;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.textContent = ""), ms);
}
function fmtDate(ts) {
  return new Date(ts).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  Object.assign(n, props);
  for (const k of kids) n.append(k);
  return n;
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const t = el("textarea", { value: text });
    document.body.append(t); t.select();
    const ok = document.execCommand("copy"); t.remove(); return ok;
  }
}

/* ---------- Clock ---------- */
function tick() {
  $("clock").textContent = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/* ---------- Tabs ---------- */
function showTab(name) {
  document.querySelectorAll(".tab").forEach((b) => {
    const on = b.dataset.tab === name;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + name));
}

/* ---------- Tab 1: Dream Log ---------- */
async function renderFragments() {
  const list = await store.get(K.fragments, []);
  const box = $("fragments");
  box.replaceChildren();
  if (!list.length) {
    box.append(el("div", { className: "empty", textContent: "No fragments yet. Your first one goes above." }));
    return;
  }
  for (const f of list) {
    const actions = el("div", { className: "actions" },
      el("button", { textContent: "🔮", title: "Decode symbols", onclick: () => { $("symbolInput").value = f.text; showTab("symbols"); decode(); } }),
      el("button", { textContent: "📋", title: "Copy", onclick: async () => flash($("logStatus"), (await copyText(f.text)) ? "Copied" : "Copy failed") }),
      el("button", { textContent: "🗑", title: "Delete", onclick: () => deleteFragment(f.id) })
    );
    const meta = el("div", { className: "meta" }, el("span", { textContent: fmtDate(f.at) + (f.sentAt ? "  ·  sent to app" : "") }), actions);
    box.append(el("div", { className: "card" }, meta, el("div", { className: "body", textContent: f.text })));
  }
}
async function saveFragment(given) {
  const text = (given ?? $("logText").value).trim();
  if (!text) return flash($("logStatus"), "Write something first");
  const list = await store.get(K.fragments, []);
  list.unshift({ id: "frag_" + Date.now(), text, at: Date.now() });
  await store.set(K.fragments, list);
  if (given === undefined) $("logText").value = "";
  flash($("logStatus"), "Saved 🌙");
  renderFragments();
}
async function deleteFragment(id) {
  if (!confirm("Delete this fragment?")) return;
  const list = (await store.get(K.fragments, [])).filter((f) => f.id !== id);
  await store.set(K.fragments, list);
  renderFragments();
}
function fragmentsAsText(list) {
  return list.slice().reverse().map((f) => `${fmtDate(f.at)}\n${f.text}`).join("\n\n— — —\n\n");
}
async function exportJson() {
  const list = await store.get(K.fragments, []);
  if (!list.length) return flash($("logStatus"), "Nothing to export yet");
  const payload = {
    app: "Midnight Dream Catcher — Desktop Companion",
    exportedAt: new Date().toISOString(),
    fragments: list.map((f) => ({ text: f.text, timestamp: f.at }))
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const a = el("a", { href: url, download: `dream-fragments-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
async function sendToApp() {
  if (!settings.pwaUrl) { openDrawer(); $("pwaUrl").focus(); return flash($("settingsStatus"), "Add your app address first", 4000); }
  const list = await store.get(K.fragments, []);
  const unsent = list.filter((f) => !f.sentAt);
  const toSend = unsent.length ? unsent : list.slice(0, 1);
  if (!toSend.length) return flash($("logStatus"), "Nothing to send yet");

  // 1) Copy so it can be pasted into a New Dream Entry right away.
  await copyText(fragmentsAsText(toSend));

  // 2) Open the app with the fragments in the URL hash (never sent to any server).
  //    index.html can read #companion-import=… to pre-fill the editor. See README.
  const data = toSend.map((f) => ({ text: f.text, timestamp: f.at }));
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(data)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const target = new URL(settings.pwaUrl);
  target.hash = "companion-import=" + b64;
  window.open(target.toString(), "_blank", "noopener");

  const now = Date.now();
  const ids = new Set(toSend.map((f) => f.id));
  await store.set(K.fragments, list.map((f) => (ids.has(f.id) ? { ...f, sentAt: now } : f)));
  flash($("logStatus"), `Copied ${toSend.length} and opened the app`, 3500);
  renderFragments();
}

/* ---------- Tab 2: Symbol interpreter ---------- */
const SYSTEM_PROMPT =
  "You are the dream interpreter inside The Midnight Dream Catcher, a calm bedside dream journal. " +
  "Interpret the dream symbol or fragment the user gives you through the requested lens. " +
  "Be warm, grounded and concise: at most 150 words, plain text, no headings or markdown. " +
  "Offer meanings as possibilities, never certainties, and end with one gentle reflective question.";

// Same five lenses, labels and order as the web app's decoder.
const LENSES = {
  biblical:  { label: "Biblical",         guide: "Biblical",  prompt: "Biblical: scripture and Christian symbolism" },
  jungian:   { label: "Jungian",          guide: "Jungian",   prompt: "Jungian psychology: archetypes, shadow, the Self" },
  emotional: { label: "Waking Life",      guide: "Emotional", prompt: "Waking Life: what the image says about the dreamer's feelings and daily life" },
  creative:  { label: "Story Spark",      guide: "Creative",  prompt: "Story Spark: the image as inspiration for a story or creative project" },
  islamic:   { label: "Islamic / Hadith", guide: "Islamic",   prompt: "Islamic dream interpretation in the tradition of the Hadith and Tafsir al-Ahlam" }
};
const lensKey = (v) => (LENSES[v] ? v : (Object.keys(LENSES).find((k) => LENSES[k].guide === v) || "biblical"));
const lensLabel = (v) => LENSES[lensKey(v)].label;
let currentLens = "biblical";
function setLens(key) {
  currentLens = lensKey(key);
  document.querySelectorAll(".lens-pill").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.lens === currentLens)));
}

function engineLabel() {
  if (settings.provider === "openai" && settings.openaiKey) return "Using your OpenAI key";
  if (settings.provider === "anthropic" && settings.anthropicKey) return "Using your Anthropic key";
  return "Using the built-in symbol guide (offline)";
}
async function callOpenAI(text, lens) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + settings.openaiKey },
    body: JSON.stringify({
      model: settings.openaiModel || DEFAULTS.openaiModel,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: `Lens: ${LENSES[lens].prompt}\nSymbol or fragment: ${text}` }]
    })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error?.message || "OpenAI error " + r.status);
  return j.choices?.[0]?.message?.content?.trim() || "";
}
async function callAnthropic(text, lens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.anthropicKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: settings.anthropicModel || DEFAULTS.anthropicModel,
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Lens: ${LENSES[lens].prompt}\nSymbol or fragment: ${text}` }]
    })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error?.message || "Anthropic error " + r.status);
  return (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
}
function localDecode(text, lens) {
  const hits = window.MDC_lookupSymbols(text, LENSES[lens].guide);
  if (!hits.length) {
    return `No match in the offline guide for “${text}”.\n\nTry a single key image (water, door, falling, teeth…), or add an OpenAI or Anthropic key in ⚙️ Settings for a full reading.`;
  }
  return hits.map((h) => `${h.name.toUpperCase()}\n${h.core}${h.lens ? `\n${LENSES[lens].label}: ${h.lens}` : ""}`).join("\n\n");
}
let lastResult = null;
async function decode(source = "") {
  const text = $("symbolInput").value.trim();
  const lens = currentLens;
  if (!text) return;
  const out = $("symbolResult");
  const btn = $("decode");
  btn.disabled = true;
  out.textContent = "Listening to the dream…";
  let result, engine = "local";
  try {
    if (settings.provider === "openai" && settings.openaiKey) { engine = "openai"; result = await callOpenAI(text, lens); }
    else if (settings.provider === "anthropic" && settings.anthropicKey) { engine = "anthropic"; result = await callAnthropic(text, lens); }
    else result = localDecode(text, lens);
  } catch (e) {
    result = localDecode(text, lens) + `\n\n(Your AI key didn't work: ${e.message}. This reading is from the offline guide.)`;
    engine = "local";
  }
  btn.disabled = false;
  out.textContent = result;
  lastResult = { text, lens, result, engine, source, at: Date.now() };
  $("addToLog").classList.remove("hidden");
  $("copyMeaning").classList.remove("hidden");
  const hist = await store.get(K.history, []);
  hist.unshift(lastResult);
  await store.set(K.history, hist.slice(0, 20));
  renderHistory();
}
async function renderHistory() {
  const hist = await store.get(K.history, []);
  const box = $("history");
  box.replaceChildren();
  if (!hist.length) return;
  box.append(el("h3", { textContent: "Recent decodes" }));
  for (const h of hist.slice(0, 10)) {
    const meta = el("div", { className: "meta" }, el("span", { textContent: `${lensLabel(h.lens)} · ${fmtDate(h.at)}${h.source ? " · from " + h.source : ""}` }));
    const card = el("div", { className: "card" }, meta, el("div", { className: "body", textContent: `“${h.text}”` }));
    card.style.cursor = "pointer";
    card.onclick = () => { $("symbolInput").value = h.text; setLens(h.lens); $("symbolResult").textContent = h.result; lastResult = h; };
    box.append(card);
  }
}
function hostOf(url) {
  try { const u = new URL(url); return /^https?:$/.test(u.protocol) ? u.hostname.replace(/^www\./, "") : ""; }
  catch { return ""; }
}
// background.js writes { pendingSymbol, sourceUrl, capturedAt } on a right-click.
async function consumePending() {
  const r = await chrome.storage.local.get(K.pendingKeys);
  const text = typeof r.pendingSymbol === "string" ? r.pendingSymbol.trim() : "";
  if (!text) return;
  await chrome.storage.local.remove(K.pendingKeys);
  showTab("symbols");
  $("symbolInput").value = text;
  decode(hostOf(r.sourceUrl || ""));
}

/* ---------- Tab 3: Soundscapes ---------- */
let ctx = null, master = null, current = null, sleepTimer = null;
function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = $("volume").value / 100 * 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function noiseBuffer(kind) {
  const len = ctx.sampleRate * 4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "brown") { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else { // pink
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      }
    }
  }
  return buf;
}
function lfo(target, rate, depth) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.value = rate; g.gain.value = depth; o.connect(g); g.connect(target); o.start();
  return o;
}
function buildSound(kind) {
  const out = ctx.createGain(); out.gain.value = 0; out.connect(master);
  const nodes = [];
  const src = (k) => { const s = ctx.createBufferSource(); s.buffer = noiseBuffer(k); s.loop = true; s.start(); nodes.push(s); return s; };
  if (kind === "rain") {
    const s = src("pink"), hp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 400; lp.type = "lowpass"; lp.frequency.value = 6000;
    s.connect(hp); hp.connect(lp); lp.connect(out);
  } else if (kind === "brown") {
    const s = src("brown"), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    lp.type = "lowpass"; lp.frequency.value = 500; g.gain.value = 0.8;
    s.connect(lp); lp.connect(g); g.connect(out);
    nodes.push(lfo(g.gain, 0.08, 0.35)); // slow swell, like waves
  } else if (kind === "pink") {
    const s = src("pink"), bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 700; bp.Q.value = 0.7;
    s.connect(bp); bp.connect(out);
    nodes.push(lfo(bp.frequency, 0.05, 400)); // gusts
  } else if (kind === "drone") {
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.connect(out);
    [110, 164.81, 220, 277.18].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f; g.gain.value = 0.12;
      o.connect(g); g.connect(lp); o.start(); nodes.push(o);
      nodes.push(lfo(o.detune, 0.03 + i * 0.01, 6));
    });
  }
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
  return { kind, out, nodes };
}
function stopSound(fade = 1.5) {
  clearTimeout(sleepTimer);
  document.querySelectorAll(".sound").forEach((b) => b.classList.remove("playing"));
  if (!current) return;
  const c = current; current = null;
  c.out.gain.cancelScheduledValues(ctx.currentTime);
  c.out.gain.setValueAtTime(c.out.gain.value, ctx.currentTime);
  c.out.gain.linearRampToValueAtTime(0, ctx.currentTime + fade);
  setTimeout(() => { c.nodes.forEach((n) => { try { n.stop(); } catch {} }); c.out.disconnect(); }, fade * 1000 + 100);
}
function playSound(kind) {
  audio();
  const same = current && current.kind === kind;
  stopSound();
  if (same) return;
  current = buildSound(kind);
  document.querySelector(`.sound[data-sound="${kind}"]`).classList.add("playing");
  armSleepTimer();
}
function armSleepTimer() {
  clearTimeout(sleepTimer);
  const mins = +$("sleepTimer").value;
  if (mins && current) sleepTimer = setTimeout(() => stopSound(20), mins * 60000);
}

/* ---------- Tab 3: Cloud Room vault ---------- */
async function deviceId() {
  let id = await store.get(K.deviceId, "");
  if (!id) { id = "ext_" + crypto.randomUUID(); await store.set(K.deviceId, id); }
  return id;
}
// The Worker's /room returns { items: [{ url, kind, createdAt, dreamId, text }] },
// where kind is "image" | "video" | "story" (video + voice) | "audio" — the same as the app's Cloud Room.
const ROOM_KIND = {
  image: { badge: "🖼️ Frame" },
  video: { badge: "🎬 Video" },
  story: { badge: "🔊 Video + voice" },
  audio: { badge: "🎙️ Narration" }
};
function mediaKind(item, url) {
  if (ROOM_KIND[item.kind]) return item.kind;
  const u = String(url).toLowerCase().split("?")[0];
  if (/\.(mp3|wav|m4a|ogg)$/.test(u)) return "audio";
  if (/\.(png|jpe?g|webp|gif)$/.test(u)) return "image";
  return "video";
}
function playMedia(url, kind, label = "") {
  if (!/^https:\/\//i.test(url)) return;
  const v = $("videoEl"), a = $("audioEl");
  $("player").classList.remove("hidden");
  v.pause(); a.pause();
  v.removeAttribute("src"); a.removeAttribute("src");
  if (kind === "audio") { a.src = url; a.play().catch(() => {}); }
  else if (kind === "image") { window.open(url, "_blank", "noopener"); }
  else { v.src = url; v.play().catch(() => {}); }
  $("nowPlaying").textContent = label;
}
async function loadVault() {
  const box = $("vault"), note = $("vaultNote"), btn = $("refreshVault");
  btn.disabled = true;
  note.textContent = "Opening your cloud room…";
  try {
    const body = { deviceId: await deviceId() };
    if (settings.proEmail && settings.proToken) { body.email = settings.proEmail.trim().toLowerCase(); body.token = settings.proToken.trim(); }
    const r = await fetch(`${WORKER}/room`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "The cloud room said " + r.status);
    const items = (Array.isArray(j?.items) ? j.items : [])
      .filter((it) => it && /^https:\/\//i.test(it.url || ""))
      .map((it) => ({ ...it, kind: mediaKind(it, it.url) }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    box.replaceChildren();
    if (!items.length) {
      note.textContent = body.email
        ? "Nothing in your cloud room yet. Frames, videos and narrations you create in the app are saved here."
        : "Nothing here yet. Sign in with your Pro email and token in ⚙️ Settings to see the files from your phone.";
      return;
    }
    note.textContent = `${items.length} file${items.length === 1 ? "" : "s"} saved permanently in your private cloud room. Tap any file to open it.`;
    for (const it of items) {
      const { url, kind } = it;
      const snippet = (it.text || "").trim().replace(/\s+/g, " ").slice(0, 80);
      const when = it.createdAt ? fmtDate(it.createdAt) : "";
      const tile = el("button", { className: "tile", title: snippet || ROOM_KIND[kind].badge });
      if (kind === "image") tile.append(el("img", { src: url, loading: "lazy", alt: "" }));
      else if (kind === "audio") tile.append(el("div", { className: "glyph", textContent: "🎙️" }));
      else tile.append(el("video", { src: url + "#t=0.1", muted: true, preload: "metadata", playsInline: true }));
      tile.append(el("span", { className: "badge", textContent: ROOM_KIND[kind].badge }));
      tile.onclick = () => playMedia(url, kind, [ROOM_KIND[kind].badge, when, snippet && `“${snippet}${it.text.length > 80 ? "…" : ""}”`].filter(Boolean).join(" · "));
      box.append(tile);
    }
  } catch (e) {
    note.textContent = "Couldn't reach your cloud room: " + e.message;
  } finally {
    btn.disabled = false;
  }
}

/* ---------- Settings drawer ---------- */
function openDrawer() {
  $("drawer").classList.add("open"); $("drawer").setAttribute("aria-hidden", "false"); $("scrim").classList.remove("hidden");
}
function closeDrawer() {
  $("drawer").classList.remove("open"); $("drawer").setAttribute("aria-hidden", "true"); $("scrim").classList.add("hidden");
}
const SETTING_FIELDS = ["pwaUrl", "proEmail", "proToken", "provider", "openaiKey", "openaiModel", "anthropicKey", "anthropicModel"];
function fillSettings() {
  for (const f of SETTING_FIELDS) $(f).value = settings[f] || "";
  $("openPwa").href = settings.pwaUrl || "#";
  $("openPwa").classList.toggle("hidden", !settings.pwaUrl);
  $("engineNote").textContent = engineLabel();
}
async function saveSettings() {
  const next = { ...settings };
  for (const f of SETTING_FIELDS) next[f] = $(f).value.trim();
  if (next.pwaUrl && !/^https:\/\//i.test(next.pwaUrl)) return flash($("settingsStatus"), "App address must start with https://", 4000);
  if (next.provider === "openai" && !next.openaiKey) return flash($("settingsStatus"), "Add an OpenAI key, or choose the built-in guide", 4000);
  if (next.provider === "anthropic" && !next.anthropicKey) return flash($("settingsStatus"), "Add an Anthropic key, or choose the built-in guide", 4000);
  settings = next;
  await store.set(K.settings, settings);
  fillSettings();
  flash($("settingsStatus"), "Saved");
}
async function clearAll() {
  if (!confirm("Delete all fragments, decode history, settings and keys stored by this extension?")) return;
  await chrome.storage.local.clear();
  settings = { ...DEFAULTS };
  fillSettings(); renderFragments(); renderHistory();
  $("vault").replaceChildren(); $("symbolResult").textContent = "";
  flash($("settingsStatus"), "Everything deleted", 3000);
}

/* ---------- Wire up ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  tick(); setInterval(tick, 15000);
  settings = { ...DEFAULTS, ...(await store.get(K.settings, {})) };
  fillSettings();

  document.querySelectorAll(".tab").forEach((b) => (b.onclick = () => showTab(b.dataset.tab)));

  $("saveFragment").onclick = () => saveFragment();
  $("logText").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveFragment(); });
  $("exportJson").onclick = exportJson;
  $("copyAll").onclick = async () => {
    const list = await store.get(K.fragments, []);
    if (!list.length) return flash($("logStatus"), "Nothing to copy yet");
    flash($("logStatus"), (await copyText(fragmentsAsText(list))) ? `Copied ${list.length}` : "Copy failed");
  };
  $("sendToApp").onclick = sendToApp;

  $("decode").onclick = () => decode();
  document.querySelectorAll(".lens-pill").forEach((b) => (b.onclick = () => setLens(b.dataset.lens)));
  $("symbolInput").addEventListener("keydown", (e) => { if (e.key === "Enter") decode(); });
  $("addToLog").onclick = () => lastResult && saveFragment(`🔮 ${lensLabel(lastResult.lens)} reading of “${lastResult.text}”\n\n${lastResult.result}`).then(() => showTab("log"));
  $("copyMeaning").onclick = async () => lastResult && flash($("symbolStatus"), (await copyText(lastResult.result)) ? "Copied" : "Copy failed");

  document.querySelectorAll(".sound").forEach((b) => (b.onclick = () => playSound(b.dataset.sound)));
  $("stopSound").onclick = () => stopSound();
  $("volume").oninput = (e) => { if (master) master.gain.setTargetAtTime(e.target.value / 100 * 0.6, ctx.currentTime, 0.1); };
  $("sleepTimer").onchange = armSleepTimer;
  $("refreshVault").onclick = loadVault;
  $("playPasted").onclick = () => {
    const u = $("pasteUrl").value.trim();
    if (!/^https:\/\//i.test(u)) return;
    playMedia(u, mediaKind({}, u) === "audio" ? "audio" : "video", "From your link");
  };

  $("openSettings").onclick = openDrawer;
  $("closeSettings").onclick = closeDrawer;
  $("scrim").onclick = closeDrawer;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  $("saveSettings").onclick = saveSettings;
  $("clearData").onclick = clearAll;

  renderFragments();
  renderHistory();
  consumePending();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.pendingSymbol?.newValue) consumePending();
  });
});