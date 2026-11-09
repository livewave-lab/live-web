/* Bottom sheet with match data tabs (Overview, Lineups, Head-to-head, Form, Standings),
   matching the tabs of the current coichua live room. Depends on i18n.js and match-data.js. */
const MatchSheet = (() => {
  let current = null;

  function tabsFor(room){
    return room.sport === "football"
      ? ["overview","lineups","h2h","form","table"]
      : ["overview","h2h","table"];
  }

  function overview(room, d){
    return d.stats.map(([k, h, a]) => {
      const total = (h + a) || 1;
      return `<div class="stat">
        <div class="stat-row"><b>${h}${k === "possession" || k === "fgPct" || k === "gold" ? "%" : ""}</b><span>${t(k)}</span><b>${a}${k === "possession" || k === "fgPct" || k === "gold" ? "%" : ""}</b></div>
        <div class="stat-bar"><i style="width:${h / total * 100}%;background:${room.home[2]}"></i><i style="width:${a / total * 100}%;background:${room.away[2]}"></i></div>
      </div>`;
    }).join("");
  }

  function lineups(room, d){
    const dots = (side, flip) => {
      const pos = d.formations[side.formation];
      const color = flip ? room.away[2] : room.home[2];
      return pos.map(([x, y], i) => {
        const Y = flip ? (100 - y) / 2 : 50 + y / 2;   // away team on the top half, home on the bottom
        return `<div class="player" style="left:${x}%;top:${Y}%;background:${color}">${side.numbers[i]}</div>`;
      }).join("");
    };
    return `<div class="formations"><span>${room.away[0]} · ${d.lineup.away.formation}</span></div>
      <div class="pitch">${dots(d.lineup.away, true)}${dots(d.lineup.home, false)}
        <i class="half"></i><i class="circle"></i><i class="box top"></i><i class="box bottom"></i></div>
      <div class="formations"><span>${room.home[0]} · ${d.lineup.home.formation}</span></div>`;
  }

  function h2h(room, d){
    return d.h2h.map(m => `<div class="match-row">
      <span class="date">${m.date}</span>
      <span class="t home">${m.home}</span><b>${m.hs} - ${m.as}</b><span class="t">${m.away}</span>
    </div>`).join("");
  }

  function form(room, d){
    const pills = arr => arr.map(r => `<i class="res ${r}">${t("res" + r)}</i>`).join("");
    return `<div class="form-team"><span>${room.home[0]}</span><div>${pills(d.form.home)}</div></div>
      <div class="form-team"><span>${room.away[0]}</span><div>${pills(d.form.away)}</div></div>
      <p class="note">${t("formNote")}</p>`;
  }

  function table(room, d){
    const rows = d.table.map((r, i) => `<tr class="${r.team === room.home[0] || r.team === room.away[0] ? "hl" : ""}">
      <td>${i + 1}</td><td class="team-cell">${r.team}</td><td>${r.p}</td><td>${r.w}-${r.d}-${r.l}</td><td>${r.gd > 0 ? "+" : ""}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join("");
    return `<table class="standings"><thead><tr><th>#</th><th class="team-cell">${t("team")}</th><th>${t("played")}</th><th>${t("wdl")}</th><th>${t("gd")}</th><th>${t("pts")}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  const RENDER = {overview, lineups, h2h, form, table};

  function open(roomEl, room, index){
    close();
    const d = MatchData.forRoom(room, index);
    const tabs = tabsFor(room);
    const el = document.createElement("div");
    el.className = "sheet";
    el.innerHTML = `
      <div class="sheet-backdrop"></div>
      <div class="sheet-panel" role="dialog" aria-label="${t("matchData")}">
        <button class="sheet-handle" aria-label="${t("close")}"><i></i></button>
        <div class="sheet-head"><b>${room.home[0]} ${room.score} ${room.away[0]}</b><span>${room.league} · ${room.min}</span></div>
        <nav class="sheet-tabs">${tabs.map((k, i) => `<button data-tab="${k}" class="${i ? "" : "on"}">${t("tab_" + k)}</button>`).join("")}</nav>
        <div class="sheet-body"></div>
      </div>`;
    const body = el.querySelector(".sheet-body");
    const show = k => {
      body.innerHTML = RENDER[k](room, d);
      el.querySelectorAll(".sheet-tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === k));
    };
    el.querySelector(".sheet-tabs").onclick = e => { const b = e.target.closest("[data-tab]"); if (b) show(b.dataset.tab); };
    el.querySelector(".sheet-backdrop").onclick = close;
    el.querySelector(".sheet-handle").onclick = close;
    show(tabs[0]);
    roomEl.appendChild(el);
    roomEl.classList.add("sheet-open");
    requestAnimationFrame(() => el.classList.add("show"));
    current = {el, roomEl};
  }

  function close(){
    if (!current) return;
    current.roomEl.classList.remove("sheet-open");
    current.el.remove(); current = null;
  }

  return {open, close};
})();
