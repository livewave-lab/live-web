/* Side menu opened by the ☰ button (top-left of the feed, and on the Me page), like Douyin's side drawer.
   Logged out: a Log in / Sign up button at the top. Logged in: avatar, name and shortcuts.
   The red number on ☰ is unread notices (demo: 3). Depends on i18n.js, icons.js, auth.js; uses toast(), relabel(), openRoom(). */
const Drawer = (() => {
  const el = document.createElement("div");
  el.className = "drawer";
  el.innerHTML = `<div class="drawer-backdrop"></div><aside class="drawer-panel" role="dialog"></aside>`;
  document.getElementById("app").appendChild(el);
  const panel = el.querySelector(".drawer-panel");

  function render(){
    const u = Auth.user;
    const liveFollowed = u ? u.following : [];
    const head = u
      ? `<button class="dr-user" data-go="me"><span class="av" style="background:#fe2c55">${u.name[0].toUpperCase()}</span>
           <div><b>${u.name}</b><small>${u.phone}</small></div>${Icons.chevron}</button>`
      : `<div class="dr-guest"><span class="av guest">${Icons.user}</span><p>${t("meGuestSub")}</p>
           <button class="auth-btn" data-do="login">${t("loginBtn")}</button></div>`;
    const followRow = liveFollowed.length ? `<h4>${t("followingLive")}</h4><div class="dr-hosts">${liveFollowed.map(i =>
      `<button data-room="${i}"><span class="ring"><span class="av" style="background:${ROOMS[i].home[2]}">${ROOMS[i].ini}</span></span><small>${ROOMS[i].host}</small></button>`).join("")}</div>` : "";
    const item = (k, label, extra = "") => `<button class="dr-item" data-do="${k}"><span>${t(label)}</span>${extra}${Icons.chevron}</button>`;
    panel.innerHTML = `
      ${head}
      ${followRow}
      <div class="dr-group">
        ${item("inbox", "nInbox", `<i class="dr-badge">3</i>`)}
        ${item("history", "meHistory")}
        ${item("reminders", "meReminders")}
        ${item("schedule", "schTitle")}
      </div>
      <div class="dr-group">
        ${item("app", "downloadApp")}
        ${item("lang", "meLanguage", `<small>${lang === "zh" ? "中文" : "English"}</small>`)}
        ${item("settings", "meSettings")}
        ${item("help", "meHelp")}
        ${item("terms", "meTerms")}
      </div>
      ${u ? `<button class="me-logout" data-do="logout">${t("logout")}</button>` : ""}
      <p class="dr-ver">Coichua · demo v10</p>`;
  }

  function open(){ render(); el.classList.add("show"); }
  function close(){ el.classList.remove("show"); }

  el.querySelector(".drawer-backdrop").onclick = close;
  panel.addEventListener("click", e => {
    const r = e.target.closest("[data-room]"); if (r){ close(); openRoom(+r.dataset.room); return; }
    const g = e.target.closest("[data-go]"); if (g){ close(); location.hash = "#/" + g.dataset.go; return; }
    const b = e.target.closest("[data-do]"); if (!b) return;
    const k = b.dataset.do;
    if (k === "login"){ close(); Auth.open(); return; }
    if (k === "logout"){ close(); Auth.logout(); return; }
    if (k === "lang"){ lang = lang === "en" ? "zh" : "en"; relabel(); render(); return; }
    if (k === "inbox" || k === "schedule"){ close(); location.hash = "#/" + k; return; }
    if (k === "history" || k === "reminders"){ close(); Pages.showMeTab(k); return; }
    toast(t("soon"));
  });
  Auth.onChange(() => { if (el.classList.contains("show")) render(); });

  return {open, close};
})();
