/* Pages reached from the bottom menu, using hash routes so the browser Back button works:
   #/ (live feed, the home page) · #/schedule · #/inbox · #/me
   There is no separate "home page": Home is the live feed, like Douyin.
   Depends on i18n.js, schedule-data.js, mock-data.js, auth.js, match-sheet.js; uses toast() and openRoom() from app.js. */
const Pages = (() => {
  const page = document.getElementById("page");
  let schDay = 0, schSport = "all";

  /* ---------- Schedule ---------- */
  function dayLabel(d){
    if (d === -1) return [t("yesterday"), ""];
    if (d === 0) return [t("today"), ""];
    if (d === 1) return [t("tomorrow"), ""];
    const dt = new Date(); dt.setDate(dt.getDate() + d);
    return [dt.toLocaleDateString(lang === "zh" ? "zh-TW" : "en-US", {weekday: "short"}), dt.getDate() + "/" + (dt.getMonth() + 1)];
  }
  const team = (tm, score, win) => `<div class="mc-team ${win ? "win" : ""}"><i style="background:${tm[2]}">${tm[1]}</i><span>${tm[0]}</span><b>${score}</b></div>`;
  function matchCard(m){
    const [hs = "", as = ""] = m.score.split(" - ");
    const done = m.status === "ft";
    const left = m.status === "live" ? `<span class="mc-live">${t("live")}</span><small>${m.min}</small>`
      : done ? `<span>${t("ft")}</span><small>${m.time}</small>` : `<span>${m.time}</span>`;
    const reminded = Auth.user && Auth.user.reminders.includes(m.id);
    let right = "";
    if (m.status === "live"){
      const avs = m.rooms.map(i => `<span class="av" style="background:${ROOMS[i].home[2]}">${ROOMS[i].ini}</span>`).join("");
      right = `<button class="mc-watch" data-watch="${m.roomIndex}"><span class="stack">${avs}</span>${t("watch")}</button>`;
    } else if (!done){
      right = `<button class="mc-remind ${reminded ? "on" : ""}" data-remind="${m.id}">🔔 ${reminded ? t("reminded") : t("remind")}</button>`;
    }
    return `<div class="mc" data-match="${m.id}">
      <div class="mc-time">${left}</div>
      <div class="mc-teams">${team(m.home, hs, done && +hs > +as)}${team(m.away, as, done && +as > +hs)}</div>
      <div class="mc-act">${right}</div></div>`;
  }
  function schedule(){
    const days = [-1, 0, 1, 2, 3];
    const sports = [["all","all"],["football","catFootball"],["basketball","catBasketball"],["esports","catEsports"]];
    const list = SCHEDULE.filter(m => m.day === schDay && (schSport === "all" || m.sport === schSport));
    const order = {live: 0, upcoming: 1, ft: 2};
    list.sort((a, b) => order[a.status] - order[b.status]);
    const groups = {};
    list.forEach(m => (groups[m.league] = groups[m.league] || []).push(m));
    page.innerHTML = `
      <header class="pg-head"><h1>${t("schTitle")}</h1></header>
      <div class="days">${days.map(d => { const [a, b] = dayLabel(d);
        return `<button data-day="${d}" class="${d === schDay ? "on" : ""}"><b>${a}</b>${b ? `<small>${b}</small>` : ""}</button>`; }).join("")}</div>
      <div class="chips">${sports.map(([k, l]) => `<button data-sport="${k}" class="${k === schSport ? "on" : ""}">${t(l)}</button>`).join("")}</div>
      <div class="pg-body">${list.length ? Object.entries(groups).map(([lg, ms]) =>
        `<h3 class="league">${lg}</h3>${ms.map(matchCard).join("")}`).join("") : `<p class="empty">${t("noMatches")}</p>`}</div>`;
  }
  page.addEventListener("click", e => {
    const d = e.target.closest("[data-day]"); if (d){ schDay = +d.dataset.day; schedule(); return; }
    const s = e.target.closest("[data-sport]"); if (s){ schSport = s.dataset.sport; schedule(); return; }
    const w = e.target.closest("[data-watch]"); if (w){ openRoom(+w.dataset.watch); return; }
    const r = e.target.closest("[data-remind]");
    if (r){
      const id = r.dataset.remind;
      Auth.require(() => {
        Auth.update(u => { u.reminders = u.reminders.includes(id) ? u.reminders.filter(x => x !== id) : [...u.reminders, id]; });
        if (Auth.user.reminders.includes(id)) toast(t("reminderToast"));
        schedule();
      });
      return;
    }
    const card = e.target.closest("[data-match]");
    if (card){   // tap a match card: match data sheet (same sheet as inside the live room)
      const m = SCHEDULE.find(x => x.id === card.dataset.match);
      MatchSheet.open(app, m, SCHEDULE.indexOf(m));   // on the app so it stays on screen while the list scrolls
    }
    const act = e.target.closest("[data-me]"); if (act) meAction(act.dataset.me);
  });

  /* ---------- Inbox ---------- */
  function inbox(){
    const head = `<header class="pg-head"><h1>${t("inboxTitle")}</h1></header>`;
    if (!Auth.user){ page.innerHTML = head + guest(t("inboxGuest")); return; }
    const rows = [
      [`<span class="av sys">C</span>`, t("ibSystem"), t("ibSystemText"), "09:00"],
      ...ROOMS.slice(0, 3).map(r => [`<span class="av" style="background:${r.home[2]}">${r.ini}</span>`, r.host, `${t("ibLive")}: ${r.title}`, t("today")]),
      [`<span class="av sys">🔔</span>`, "Arsenal vs Chelsea", t("ibRemind"), "23:15"]
    ];
    page.innerHTML = head + `<div class="pg-body">${rows.map(([av, a, b, c]) =>
      `<div class="ib-row">${av}<div><b>${a}</b><p>${b}</p></div><small>${c}</small></div>`).join("")}</div>`;
  }

  /* ---------- Me: personal profile page (Douyin style) ---------- */
  let meTab = "following";
  function hostRow(i){
    const r = ROOMS[i];
    return `<button class="host-row" data-open="${i}"><span class="av" style="background:${r.home[2]}">${r.ini}</span>
      <div><b>${r.host}</b><small>${r.title}</small></div><span class="mc-live">${t("live")}</span></button>`;
  }
  function meTabBody(){
    const u = Auth.user;
    if (meTab === "history"){
      return HISTORY.length ? HISTORY.map(hostRow).join("") : `<p class="empty">${t("historyEmpty")}</p>`;
    }
    if (!u) return `<p class="empty">${t("meGuestSub")}</p>`;
    if (meTab === "following")
      return u.following.length ? u.following.map(hostRow).join("") : `<p class="empty">${t("followEmpty")}</p>`;
    const ms = SCHEDULE.filter(m => u.reminders.includes(m.id));
    return ms.length ? ms.map(matchCard).join("") : `<p class="empty">${t("remindEmpty")}</p>`;
  }
  /* Tools depend on the account type: members get member tools; streamers also get the streamer centre.
     Streamer functions are placeholders: the streamer backend is planned but not built yet. */
  function tools(u){
    const tile = (k, icon, label) => `<button data-tool="${k}"><span>${icon}</span><small>${t(label)}</small></button>`;
    const member = `<h3 class="me-sec">${t("memberTools")}</h3><div class="me-grid">
        ${tile("inbox", "✉️", "nInbox")}${tile("reminders", "🔔", "meReminders")}${tile("history", "🕘", "meHistory")}
        ${u.role === "host" ? tile("wallet", "💰", "wallet") : tile("apply", "🎙️", "becomeHost")}</div>`;
    const host = u.role === "host" ? `<h3 class="me-sec">${t("hostTools")} <span class="host-tag">${t("hostBadge")}</span></h3><div class="me-grid">
        ${tile("golive", "🔴", "goLiveBtn")}${tile("pickmatch", "⚽", "pickMatch")}${tile("obs", "🔑", "streamKey")}
        ${tile("stats", "📊", "liveStats")}${tile("fans", "👥", "fans")}${tile("rules", "📄", "hostRules")}</div>` : "";
    return host + member + `<button class="demo-switch" data-tool="switch">${t(u.role === "host" ? "demoAsMember" : "demoAsHost")}</button>`;
  }
  function me(){
    const u = Auth.user;
    const id = u ? "@" + u.name.toLowerCase() : "";
    const tabs = [["following","meFollowing"],["reminders","meReminders"],["history","meHistory"]];
    page.innerHTML = `
      <div class="me">
        <div class="me-cover">
          <button class="me-ic" data-me="share" aria-label="${t("share")}">${Icons.share}</button>
          <button class="me-ic" data-me="menu" aria-label="${t("menu")}">${Icons.menu}</button>
        </div>
        <div class="me-head">
          ${u ? `<span class="av big" style="background:#fe2c55">${u.name[0].toUpperCase()}</span>`
              : `<span class="av big guest">${Icons.user}</span>`}
          <h2>${u ? u.name : t("meGuest")}</h2>
          <small>${u ? `${id} · ${u.phone}` : t("meGuestSub")}</small>
          <div class="me-stats">
            <div><b>${u ? u.following.length : 0}</b><small>${t("meFollowing")}</small></div>
            <div><b>0</b><small>${t("followers")}</small></div>
            <div><b>${u ? u.reminders.length : 0}</b><small>${t("meReminders")}</small></div>
          </div>
          ${u ? `<div class="me-btns"><button data-me="edit">${t("editProfile")}</button><button data-me="share">${t("shareProfile")}</button></div>`
              : `<button class="auth-btn" data-me="login">${t("loginBtn")}</button>`}
        </div>
        ${u ? tools(u) : ""}
        <nav class="me-tabs">${tabs.map(([k, l]) => `<button data-metab="${k}" class="${k === meTab ? "on" : ""}">${t(l)}</button>`).join("")}</nav>
        <div class="me-body">${meTabBody()}</div>
      </div>`;
  }
  page.addEventListener("click", e => {
    const tb = e.target.closest("[data-metab]"); if (tb){ meTab = tb.dataset.metab; me(); return; }
    const o = e.target.closest("[data-open]"); if (o) openRoom(+o.dataset.open);
    const tl = e.target.closest("[data-tool]"); if (tl) toolAction(tl.dataset.tool);
  });
  function toolAction(k){
    if (k === "switch"){ Auth.update(u => { u.role = u.role === "host" ? "member" : "host"; }); return; }
    if (k === "inbox"){ location.hash = "#/inbox"; return; }
    if (k === "reminders" || k === "history"){ showMeTab(k); return; }
    if (k === "apply"){ toast(t("applyNote")); return; }
    toast(t("hostSoon"));   // streamer centre: backend not built yet
  }
  function showMeTab(k){
    meTab = k;
    if (location.hash !== "#/me") location.hash = "#/me"; else me();
    setTimeout(() => { const b = page.querySelector(".me-tabs"); if (b) page.scrollTo({top: b.offsetTop - 8, behavior: "smooth"}); }, 80);
  }
  function meAction(k){
    if (k === "login") return Auth.open();
    if (k === "logout") return Auth.logout();
    if (k === "menu") return Drawer.open();
    if (k === "share"){ toast(t("copied")); return; }
    toast(t("soon"));
  }

  const guest = msg => `<div class="pg-body guest-box"><span class="av big guest">${Icons.user}</span><p>${msg}</p>
    <button class="auth-btn" data-me="login">${t("loginBtn")}</button></div>`;

  /* ---------- router ---------- */
  const ROUTES = {schedule, inbox, me};
  function route(){
    let name = location.hash.replace(/^#\/?/, "") || "";
    if (name === "login"){ history.replaceState(null, "", "#/me"); name = "me"; setTimeout(() => Auth.open(), 50); }   // shareable link straight to the login sheet
    const [base, arg] = name.split("/");          // e.g. "live/2" -> base "live", arg "2"
    Drawer.close();
    MatchSheet.close();
    if (base === "live" && !ROUTES.live){          // phone: #/live/2 opens that room in the feed (shareable room link)
      history.replaceState(null, "", "#/"); app.classList.remove("on-page"); page.innerHTML = "";
      setTimeout(() => openRoom(+arg || 0), 50); return;
    }
    const fn = ROUTES[base];
    document.querySelectorAll(".nav [data-route], .d-side [data-route]").forEach(b => b.classList.toggle("on", b.dataset.route === base));
    page.classList.toggle("room-mode", base === "live");
    if (fn){
      if (app.classList.contains("entered")) exit();
      app.classList.add("on-page"); page.scrollTop = 0; fn(arg);
    } else {
      app.classList.remove("on-page"); page.innerHTML = "";
    }
    window.dispatchEvent(new CustomEvent("routed", {detail: base}));
  }
  function refresh(){
    const [base, arg] = location.hash.replace(/^#\/?/, "").split("/");
    if (ROUTES[base] && base !== "live") ROUTES[base](arg);
  }
  window.addEventListener("hashchange", route);
  Auth.onChange(refresh);

  return {route, refresh, guest, matchCard, showMeTab, register: (name, fn) => { ROUTES[name] = fn; }};
})();
