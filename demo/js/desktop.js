/* Desktop layout (screens 1024px and wider), copied from live.douyin.com:
   left sidebar · top search bar · Home = featured live player + "Following" + live cards + "More live" grid ·
   live room page (#/live/N) = stream in the middle with blurred sides, viewers + chat panel on the right.
   Phones and tablets keep the phone layout. Pages (Schedule, Me, Inbox, Search) are shared with the phone version.
   Depends on everything else; loaded after pages.js / drawer.js / search.js, before main.js. */
const Desktop = (() => {
  const isDesk = () => window.matchMedia("(min-width: 1024px)").matches;
  if (!isDesk()) {
    let was = false;
    window.addEventListener("resize", () => { if (isDesk() && !was){ was = true; location.reload(); } });
    return {on: false};
  }
  document.body.classList.add("desk");
  window.addEventListener("resize", () => { if (!isDesk()) location.reload(); });

  const CATS = [["all","all"],["football","catFootball"],["basketball","catBasketball"],["esports","catEsports"],["entertainment","catEnt"],["chat","catChat"]];
  let cat = "all";

  /* ---------- shell: sidebar + top bar ---------- */
  const side = document.createElement("aside");
  side.className = "d-side";
  const top = document.createElement("header");
  top.className = "d-top";
  const home = document.createElement("main");
  home.className = "d-home";
  app.append(side, top, home);

  function renderShell(){
    const u = Auth.user;
    side.innerHTML = `
      <img class="d-logo" src="img/logo.png" alt="Coichua">
      <button class="d-getapp" data-do="app">📱 ${t("getApp")}</button>
      <nav class="d-nav">
        <button data-route="" class="on"><span>${Icons.home}</span>${t("nHome")}</button>
        <button data-route="following"><span>${Icons.user}</span>${t("following")}</button>
        <button data-route="schedule"><span>${Icons.calendar}</span>${t("nSchedule")}</button>
        <i></i>
        <button data-route="inbox"><span>${Icons.bell || "🔔"}</span>${t("nInbox")}</button>
        <button data-route="me"><span>${Icons.user}</span>${t("nMe")}</button>
      </nav>
      <div class="d-foot">© 2026 Coichua · demo<br><button data-do="lang">${lang === "zh" ? "English" : "中文"}</button></div>`;
    top.innerHTML = `
      <form class="d-search"><input type="search" placeholder="${t("searchPh")}"><button>${Icons.search}${t("search")}</button></form>
      <div class="d-actions">
        <button data-do="app"><span>⬇</span><small>${t("downloadApp")}</small></button>
        <button data-route="inbox"><span>🔔<i class="dot3">3</i></span><small>${t("nInbox")}</small></button>
        <button data-do="golive"><span>⊕</span><small>${t("goLiveBtn")}</small></button>
        ${u ? `<button class="d-me" data-route="me"><span class="av" style="background:#fe2c55">${u.name[0].toUpperCase()}</span></button>`
            : `<button class="d-login" data-do="login">${t("loginBtn")}</button>`}
      </div>`;
    top.querySelector(".d-search").onsubmit = e => { e.preventDefault(); Search.go(e.target.querySelector("input").value); };
    markRoute();
  }
  function markRoute(){
    const base = (location.hash.replace(/^#\/?/, "") || "").split("/")[0];
    side.querySelectorAll("[data-route]").forEach(b => b.classList.toggle("on", b.dataset.route === base));
  }
  app.addEventListener("click", e => {
    const r = e.target.closest(".d-side [data-route], .d-top [data-route]");
    if (r){ location.hash = "#/" + r.dataset.route; return; }
    const d = e.target.closest(".d-side [data-do], .d-top [data-do]");
    if (!d) return;
    const k = d.dataset.do;
    if (k === "login") Auth.open();
    if (k === "golive") toast(t("goLive"));
    if (k === "app") toast(t("soon"));
    if (k === "lang"){ lang = lang === "en" ? "zh" : "en"; relabel(); renderShell(); renderHome(); }
  });

  /* ---------- cards ---------- */
  const canvasBox = (r, cls = "") => `<div class="d-canvas ${cls}">${Stage.canvasHTML(r)}</div>`;
  const viewersIcon = n => `<span class="d-vw">👤 ${fmt(n)}</span>`;
  function liveCard(i){
    const r = ROOMS[i];
    return `<button class="d-card" data-room="${i}">
      ${canvasBox(r)}
      <span class="d-card-tag">${t("live")}</span>
      <div class="d-card-info"><small>${r.title}</small><b>@${r.host}</b>${viewersIcon(r.viewers)}</div></button>`;
  }
  const inCat = i => cat === "all" || ROOMS[i].sport === cat;

  /* ---------- Home ---------- */
  function renderHome(){
    const all = ROOMS.map((r, i) => i);
    const list = all.filter(inCat);
    const feat = list[0] ?? 0;
    const fr = ROOMS[feat];
    const u = Auth.user;
    const followed = u ? u.following : [];
    const followBox = !u ? `<div class="d-follow-empty">${t("followGuest")} <button data-do2="login">${t("loginBtn")}</button></div>`
      : followed.length ? `<div class="d-follow-row">${followed.map(i => `<button data-room="${i}"><span class="ring"><span class="av" style="background:${ROOMS[i].home[2]}">${ROOMS[i].ini}</span></span><small>${ROOMS[i].host}</small></button>`).join("")}</div>`
      : `<div class="d-follow-empty">${t("noFollowLive")}</div>`;
    const side3 = list.filter(i => i !== feat).slice(0, 3);
    const today = SCHEDULE.filter(m => m.day === 0 && m.status !== "ft").sort((a, b) => (a.status === "live" ? 0 : 1) - (b.status === "live" ? 0 : 1));
    home.innerHTML = `
      <nav class="d-cats">${CATS.map(([k, l]) => `<button data-cat="${k}" class="${k === cat ? "on" : ""}">${t(l)}</button>`).join("")}</nav>
      <section class="d-hero">
        <button class="d-feature" data-room="${feat}">
          ${canvasBox(fr, "tall")}
          <div class="d-feature-info">
            ${fr.league ? `<div class="p-match">${SPORT_ICON[fr.sport] || ""} ${fr.league} · ${scoreHTML(fr)} · <span class="mn">${fr.min}</span></div>` : ""}
            <div class="d-feature-host"><span class="av" style="background:${fr.home[2]}">${fr.ini}</span>${fr.host}<span class="live-tag">${t("live")}</span></div>
            <b>${fr.title}</b>
          </div>
          <span class="d-enter">${Icons.bars} ${t("enter")}</span>
        </button>
        <div class="d-hero-side">
          <h3>${t("myFollowing")}</h3>
          ${followBox}
          <div class="d-cards3">${side3.map(liveCard).join("")}</div>
        </div>
      </section>
      ${cat === "all" || ["football","basketball","esports"].includes(cat) ? `
      <section class="d-sec">
        <h3>${t("todayMatches")} <button data-route2="schedule">${t("viewSchedule")} ›</button></h3>
        <div class="d-matches">${today.filter(m => cat === "all" || m.sport === cat).map(Pages.matchCard).join("")}</div>
      </section>` : ""}
      <section class="d-sec">
        <h3>${t("moreLive")}</h3>
        <div class="d-grid">${list.map(liveCard).join("") || `<p class="empty">${t("noMatches")}</p>`}</div>
      </section>`;
  }
  home.addEventListener("click", e => {
    const c = e.target.closest("[data-cat]"); if (c){ cat = c.dataset.cat; renderHome(); return; }
    if (e.target.closest("[data-do2=login]")){ Auth.open(); return; }
    const rt = e.target.closest("[data-route2]"); if (rt){ location.hash = "#/" + rt.dataset.route2; return; }
    const w = e.target.closest("[data-watch]"); if (w){ openRoom(+w.dataset.watch); return; }
    const rm = e.target.closest("[data-remind]");
    if (rm){ const id = rm.dataset.remind; Auth.require(() => { Auth.update(u => { u.reminders = u.reminders.includes(id) ? u.reminders.filter(x => x !== id) : [...u.reminders, id]; }); if (Auth.user.reminders.includes(id)) toast(t("reminderToast")); renderHome(); }); return; }
    const mc = e.target.closest("[data-match]"); if (mc){ const m = SCHEDULE.find(x => x.id === mc.dataset.match); MatchSheet.open(app, m, SCHEDULE.indexOf(m)); return; }
    const r = e.target.closest("[data-room]"); if (r) openRoom(+r.dataset.room);
  });

  /* ---------- Following page ---------- */
  Pages.register("following", () => {
    const pg = document.getElementById("page");
    const u = Auth.user;
    if (!u){ pg.innerHTML = `<header class="pg-head"><h1>${t("following")}</h1></header>` + Pages.guest(t("followGuest")); return; }
    pg.innerHTML = `<header class="pg-head"><h1>${t("following")}</h1></header>
      <div class="d-grid wide">${u.following.map(liveCard).join("") || `<p class="empty">${t("followEmpty")}</p>`}</div>`;
  });

  /* ---------- Live room page ---------- */
  let timer = null, roomIdx = 0;
  function stopRoom(){ clearInterval(timer); timer = null; }
  function renderRoom(arg){
    stopRoom();
    const i = Math.max(0, Math.min(ROOMS.length - 1, +arg || 0));
    roomIdx = i;
    const r = ROOMS[i];
    const pg = document.getElementById("page");
    const u = Auth.user;
    const followed = u && u.following.includes(i);
    const stack = [0, 1, 2].map(k => `<li><span class="av" style="background:${AV_COLORS[(i + k) % AV_COLORS.length]}">${NAMES[(i * 3 + k) % NAMES.length][0]}</span>${NAMES[(i * 3 + k) % NAMES.length]}<i>⚡${30 - k * 7}</i></li>`).join("");
    pg.innerHTML = `
      <div class="d-room room" data-i="${i}">
        <div class="d-stage" style="--c1:${r.home[2]};--c2:${r.away[2]}">
          ${canvasBox(r, "tall")}
          <div class="d-stage-top">
            <button class="d-back" data-r="back" aria-label="${t("close")}">${Icons.chevron}</button>
            <div class="host-pill"><span class="av" style="background:${r.home[2]}">${r.ini}</span>
              <div class="meta"><b>${r.host}</b><small>${fmt(r.likes)} ${t("likes")}</small></div>
              <button class="follow ${followed ? "done" : ""}" data-r="follow">${followed ? t("following1") : t("follow")}</button></div>
            <span class="d-rank">${r.rank}</span>
          </div>
          ${r.league ? `<button class="score-bar" data-r="data"><i style="background:${r.home[2]}"></i>${scoreHTML(r)}<i style="background:${r.away[2]}"></i><span class="mn">${r.min}</span>${Icons.chevron}</button>` : ""}
          <div class="d-nav-arrows"><button data-r="prev" aria-label="Previous">▲</button><button data-r="next" aria-label="Next">▼</button></div>
          <div class="d-controls"><button data-r="soon">❚❚</button><button data-r="soon">↻</button><span></span>
            <button data-r="soon">${t("quality")}</button><button data-r="soon">🔊</button><button data-r="soon">⛶</button></div>
          <div class="d-title"><b>${r.title}</b><small>${r.league || t("catChat")}</small></div>
        </div>
        <aside class="d-panel">
          <div class="d-viewers"><h4>${t("onlineViewers")} · <span class="vw">${fmt(r.viewers)}</span></h4><ul>${stack}</ul></div>
          ${r.league ? `<button class="d-matchcard" data-r="data"><span>${SPORT_ICON[r.sport] || ""} ${r.league}</span>
              <b>${r.home[0]} <em class="sc">${r.score}</em> ${r.away[0]}</b><small class="mn">${r.min}</small><u>${t("matchData")} ›</u></button>` : ""}
          <div class="chat"></div>
          <div class="d-compose">${u
            ? `<form class="composer"><input maxlength="80" placeholder="${t("say")}"></form><button class="ib" data-r="like">${Icons.heart}</button>`
            : `<button class="d-login-chat" data-r="login">${t("loginToChat")}</button>`}</div>
        </aside>
      </div>`;
    const roomEl = pg.querySelector(".d-room");
    addMsg(roomEl, t("notice"), "notice");
    for (let k = 0; k < 6; k++) addMsg(roomEl, userMsg(rand(NAMES), rand(LINES)));
    let tick = 0;
    timer = setInterval(() => {
      if (!document.body.contains(roomEl)) return stopRoom();
      if (++tick % 9 === 0 && r.league) return matchEvent(roomEl, r);
      if (Math.random() < .2) addMsg(roomEl, `<b>${rand(NAMES)}</b>${t("joined")}`, "sys");
      else addMsg(roomEl, userMsg(rand(NAMES), rand(LINES)));
      r.viewers += Math.floor(Math.random() * 9) - 3;
      roomEl.querySelector(".vw").textContent = fmt(r.viewers);
    }, 1300);
    remember(i);
  }
  Pages.register("live", renderRoom);
  const page = document.getElementById("page");
  page.addEventListener("click", e => {
    const b = e.target.closest(".d-room [data-r]"); if (!b) return;
    const roomEl = b.closest(".d-room"), r = ROOMS[roomIdx], k = b.dataset.r;
    if (k === "back"){ history.length > 1 ? history.back() : (location.hash = "#/"); }
    if (k === "prev" || k === "next") location.hash = "#/live/" + ((roomIdx + (k === "next" ? 1 : ROOMS.length - 1)) % ROOMS.length);
    if (k === "data") MatchSheet.open(roomEl.querySelector(".d-panel"), r, roomIdx);
    if (k === "login") Auth.open();
    if (k === "soon") toast(t("soon"));
    if (k === "like"){ const s = roomEl.querySelector(".d-stage"), a = s.getBoundingClientRect(); heart(s, a.width / 2, a.height * .7); r.likes++; }
    if (k === "follow") Auth.require(() => {
      if (!Auth.user.following.includes(roomIdx)) Auth.update(u => u.following.push(roomIdx));
      b.classList.add("done"); b.textContent = t("following1"); toast(t("followed"));
    });
  });
  page.addEventListener("dblclick", e => {
    const s = e.target.closest(".d-stage"); if (!s || e.target.closest("button")) return;
    const a = s.getBoundingClientRect(); heart(s, e.clientX - a.left, e.clientY - a.top); ROOMS[roomIdx].likes++;
  });
  page.addEventListener("submit", e => {
    if (!e.target.closest(".d-room")) return;
    e.preventDefault(); const inp = e.target.querySelector("input"); const v = inp.value.trim(); if (!v) return;
    addMsg(e.target.closest(".d-room"), userMsg(Auth.user.name, v.replace(/[<>&]/g, "")), "me"); inp.value = "";
  });
  document.addEventListener("keydown", e => {
    if (!page.classList.contains("room-mode") || document.activeElement.tagName === "INPUT") return;
    if (e.key === "ArrowDown") location.hash = "#/live/" + ((roomIdx + 1) % ROOMS.length);
    if (e.key === "ArrowUp") location.hash = "#/live/" + ((roomIdx + ROOMS.length - 1) % ROOMS.length);
    if (e.key === "Escape") location.hash = "#/";
  });

  /* Rooms open as their own page on desktop. */
  window.openRoom = i => { location.hash = "#/live/" + i; };
  window.addEventListener("routed", e => { if (e.detail !== "live") stopRoom(); markRoute(); });
  Auth.onChange(() => {
    renderShell(); renderHome();
    if (page.classList.contains("room-mode")) renderRoom(roomIdx);
  });

  renderShell();
  renderHome();
  return {on: true};
})();
