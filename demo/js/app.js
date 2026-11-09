/* Feed, preview/entered states, chat simulation and interactions (Douyin live room behaviour).
   Preview: browsing the feed. Full canvas, host and title, "Tap to enter". No chat, no viewer count, no actions.
   Entered: tabs and bottom menu hide; live room UI appears. Swiping keeps you inside, moving to the next room.
   Depends on icons.js, i18n.js, mock-data.js, match-data.js, stage.js and match-sheet.js. */

const app = document.getElementById("app");
const feed = document.getElementById("feed");
const fmt = n => n >= 10000 ? (n / 1000).toFixed(1).replace(".0", "") + "K" : n.toLocaleString("en-US");
const AV_COLORS = ["#5b6cff","#ff8a3d","#2bb673","#c45bff","#ff5b8a"];

function roomHTML(r, i){
  const viewersStack = [0, 1, 2].map(k =>
    `<span class="av" style="background:${AV_COLORS[(i + k) % AV_COLORS.length]}">${NAMES[(i * 3 + k) % NAMES.length][0]}</span>`).join("");
  return `
  <section class="room" data-i="${i}">
    ${Stage.canvasHTML(r)}

    <div class="preview-ui">
      <button class="enter-pill" data-act="enter">${Icons.bars}${t("enter")}</button>
      <div class="p-info">
        <span class="live-tag">${t("live")}</span>
        <div class="p-host">@${r.host}</div>
        <div class="p-title">${r.title}</div>
      </div>
    </div>

    <div class="live-ui">
      <div class="shade"></div>
      <header class="lr-head">
        <div class="host-pill">
          <span class="av" style="background:${r.home[2]}">${r.ini}</span>
          <div class="meta"><b>${r.host}</b><small>${fmt(r.likes)} ${t("likes")}</small></div>
          <button class="follow" data-act="follow">${t("follow")}</button>
        </div>
        <div class="viewers">
          <span class="stack">${viewersStack}</span>
          <span class="count vw">${fmt(r.viewers)}</span>
          <button class="exit" data-act="exit" aria-label="${t("close")}">${Icons.close}</button>
        </div>
      </header>
      <div class="lr-sub"><span>${r.rank}</span><span>${t("square")} ${Icons.chevron}</span></div>
      <div class="chat"></div>
      <div class="lr-bar">
        <form class="composer"><input maxlength="80" enterkeyhint="send" placeholder="${t("say")}"></form>
        <button class="ib" data-act="emoji" aria-label="${t("emoji")}">${Icons.emoji}</button>
        <button class="ib" data-act="data" aria-label="${t("data")}">${Icons.chart}</button>
        <button class="ib" data-act="like" aria-label="${t("like")}">${Icons.heart}</button>
        <button class="ib" data-act="share" aria-label="${t("share")}">${Icons.share}</button>
      </div>
    </div>
  </section>`;
}

function render(){
  feed.innerHTML = ROOMS.map(roomHTML).join("");
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  observe();
}

/* ---------- entering and leaving ---------- */
let active = 0;
function enter(){ app.classList.remove("discover-open"); app.classList.add("entered"); startChat(active); hideHint(); }
function exit(){ MatchSheet.close(); app.classList.remove("entered"); stopChat(); }

/* ---------- chat simulation: only inside the entered room ---------- */
let timer = null;
function addMsg(room, html, cls = ""){
  const box = room.querySelector(".chat");
  const d = document.createElement("div");
  d.className = "msg " + cls; d.innerHTML = html;
  box.appendChild(d);
  while (box.children.length > 24) box.firstChild.remove();
}
const rand = a => a[Math.floor(Math.random() * a.length)];
const userMsg = (name, text) => `<span class="lv">⚡${5 + Math.floor(Math.random() * 30)}</span><b>${name}:</b>${text}`;
function stopChat(){ clearInterval(timer); }
function startChat(i){
  stopChat();
  const room = feed.children[i]; if (!room) return;
  if (!room.dataset.started){
    room.dataset.started = "1";
    addMsg(room, t("notice"), "notice");
    for (let k = 0; k < 5; k++) addMsg(room, userMsg(rand(NAMES), rand(LINES)));
  }
  timer = setInterval(() => {
    if (Math.random() < .2) addMsg(room, `<b>${rand(NAMES)}</b>${t("joined")}`, "sys");
    else addMsg(room, userMsg(rand(NAMES), rand(LINES)));
    const r = ROOMS[i]; r.viewers += Math.floor(Math.random() * 9) - 3;
    room.querySelector(".vw").textContent = fmt(r.viewers);
  }, 1300);
}

let io;
function observe(){
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio > .6){
      const i = +e.target.dataset.i;
      if (active !== i) MatchSheet.close();
      active = i;
      if (app.classList.contains("entered")) startChat(i);
      if (i > 0) hideHint();
    }
  }), {root: feed, threshold: [.6]});
  [...feed.children].forEach(s => io.observe(s));
}

/* ---------- interactions ---------- */
function toast(msg){
  const el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 1200);
}
function heart(room, x, y){
  const h = document.createElement("div"); h.className = "heart"; h.textContent = "♥";
  h.style.left = (x - 13) + "px"; h.style.top = (y - 13) + "px"; h.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
  room.appendChild(h); setTimeout(() => h.remove(), 1100);
}
function like(room, x, y){
  const r = ROOMS[+room.dataset.i]; r.likes++;
  room.querySelector(".meta small").textContent = `${fmt(r.likes)} ${t("likes")}`;
  if (x === undefined){
    const b = room.querySelector('[data-act="like"]').getBoundingClientRect(), a = room.getBoundingClientRect();
    x = b.left - a.left + 18; y = b.top - a.top;
  }
  heart(room, x, y);
}
feed.addEventListener("click", e => {
  const btn = e.target.closest("[data-act]");
  const room = e.target.closest(".room"); if (!room) return;
  const i = +room.dataset.i;
  if (!btn){ if (!app.classList.contains("entered")) enter(); return; }   // tapping the preview enters the room
  const act = btn.dataset.act;
  if (act === "enter") enter();
  if (act === "exit") exit();
  if (act === "like") like(room);
  if (act === "data") MatchSheet.open(room, ROOMS[i], i);
  if (act === "emoji") toast(t("soon"));
  if (act === "follow"){ btn.classList.add("done"); btn.textContent = t("following1"); toast(t("followed")); }
  if (act === "share"){
    try { navigator.clipboard.writeText(location.href.split("#")[0] + "#room-" + i).catch(() => {}); } catch (err) {}
    toast(t("copied"));
  }
});
feed.addEventListener("dblclick", e => {
  if (!app.classList.contains("entered")) return;
  const room = e.target.closest(".room"); if (!room || e.target.closest("button,form,.lr-head")) return;
  const a = room.getBoundingClientRect(); like(room, e.clientX - a.left, e.clientY - a.top);
});
feed.addEventListener("submit", e => {
  e.preventDefault(); const inp = e.target.querySelector("input"); const v = inp.value.trim(); if (!v) return;
  addMsg(e.target.closest(".room"), userMsg(t("me"), v.replace(/[<>&]/g, "")), "me"); inp.value = "";
});
document.querySelectorAll(".top [data-icon]").forEach(b => b.insertAdjacentHTML("afterbegin", Icons[b.dataset.icon]));

/* "Live discovery" panel: live hosts row + category chips (Douyin's pull-down) */
const discover = document.getElementById("discover");
function renderDiscover(){
  document.getElementById("dcHosts").innerHTML = ROOMS.map((r, i) => `
    <button class="dc-host" data-room="${i}"><span class="ring"><span class="av" style="background:${r.home[2]}">${r.ini}</span></span>
      <span class="dc-live">${t("live")}</span><small>${r.host}</small></button>`).join("") +
    `<button class="dc-host more"><span class="ring plain">···</span><small>${t("history")}</small></button>`;
  document.getElementById("dcChips").innerHTML = ["catFeatured","catFollowing","catFootball","catBasketball","catEsports","catChat"]
    .map((k, i) => `<button class="${i ? "" : "on"}">${t(k)}</button>`).join("");
}
document.getElementById("discoverToggle").onclick = () => app.classList.toggle("discover-open");
discover.addEventListener("click", e => {
  const h = e.target.closest("[data-room]");
  if (h){ app.classList.remove("discover-open"); feed.scrollTo({top: +h.dataset.room * feed.clientHeight, behavior: "smooth"}); return; }
  const c = e.target.closest(".dc-chips button");
  if (c){ discover.querySelectorAll(".dc-chips button").forEach(b => b.classList.remove("on")); c.classList.add("on"); }
});
feed.addEventListener("pointerdown", () => app.classList.remove("discover-open"));
renderDiscover();
document.querySelectorAll("[data-soon]").forEach(b => b.onclick = () => toast(t("soon")));
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.remove("on")); b.classList.add("on");
});
document.addEventListener("keydown", e => {
  if (document.activeElement.tagName === "INPUT") return;
  if (e.key === "Escape" && app.classList.contains("entered")) exit();
  if (e.key === "ArrowDown" || e.key === "ArrowUp"){
    e.preventDefault();
    const n = Math.max(0, Math.min(ROOMS.length - 1, active + (e.key === "ArrowDown" ? 1 : -1)));
    feed.scrollTo({top: n * feed.clientHeight, behavior: "smooth"});
  }
});
function hideHint(){ document.getElementById("hint").style.opacity = 0; }
setTimeout(hideHint, 4000);

render();
