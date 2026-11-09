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

  /* ---------- Me ---------- */
  function me(){
    const u = Auth.user;
    const top = u
      ? `<div class="me-top"><span class="av big" style="background:#fe2c55">${u.name[0].toUpperCase()}</span>
           <div><b>${u.name}</b><small>${u.phone}</small></div></div>
         <div class="me-stats"><div><b>${u.following.length}</b><small>${t("meFollowing")}</small></div>
           <div><b>${u.reminders.length}</b><small>${t("meReminders")}</small></div></div>`
      : `<div class="me-top"><span class="av big guest">${Icons.user}</span>
           <div><b>${t("meGuest")}</b><small>${t("meGuestSub")}</small></div></div>
         <button class="auth-btn" data-me="login">${t("loginBtn")}</button>`;
    const items = [["following","meFollowing"],["reminders","meReminders"],["history","meHistory"],
                   ["lang","meLanguage"],["settings","meSettings"],["help","meHelp"],["terms","meTerms"]];
    page.innerHTML = `<div class="pg-body me">${top}
      <div class="me-list">${items.map(([k, l]) => `<button data-me="${k}"><span>${t(l)}</span>${k === "lang" ? `<small>${lang === "zh" ? "中文" : "English"}</small>` : ""}${Icons.chevron}</button>`).join("")}</div>
      ${u ? `<button class="me-logout" data-me="logout">${t("logout")}</button>` : ""}</div>`;
  }
  function meAction(k){
    if (k === "login") return Auth.open();
    if (k === "logout") return Auth.logout();
    if (k === "lang"){ lang = lang === "en" ? "zh" : "en"; relabel(); return; }
    if (k === "following" || k === "reminders") return Auth.require(() => { if (k === "reminders"){ schDay = 0; location.hash = "#/schedule"; } else { location.hash = "#/"; setFeedTab("following"); } });
    toast(t("soon"));
  }

  const guest = msg => `<div class="pg-body guest-box"><span class="av big guest">${Icons.user}</span><p>${msg}</p>
    <button class="auth-btn" data-me="login">${t("loginBtn")}</button></div>`;

  /* ---------- router ---------- */
  const ROUTES = {schedule, inbox, me};
  function route(){
    const name = location.hash.replace(/^#\/?/, "") || "";
    const fn = ROUTES[name];
    MatchSheet.close();
    document.querySelectorAll(".nav [data-route]").forEach(b => b.classList.toggle("on", b.dataset.route === name));
    if (fn){
      if (app.classList.contains("entered")) exit();
      app.classList.add("on-page"); page.scrollTop = 0; fn();
    } else {
      app.classList.remove("on-page"); page.innerHTML = "";
    }
  }
  function refresh(){ const name = location.hash.replace(/^#\/?/, ""); if (ROUTES[name]) ROUTES[name](); }
  window.addEventListener("hashchange", route);
  Auth.onChange(refresh);

  return {route, refresh, guest};
})();
