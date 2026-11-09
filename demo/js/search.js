/* Search page (#/search), opened by the magnifier at the top-right of the feed.
   Before typing: recent searches + trending. While typing: live rooms, matches and hosts that match.
   Demo searches the fake data in the browser; production calls server/api/search.
   Depends on i18n.js, mock-data.js, schedule-data.js, pages.js; uses openRoom(), toast(). */
const Search = (() => {
  let query = "";
  let recent = [];
  try { recent = JSON.parse(sessionStorage.getItem("demoRecent")) || []; } catch (e) {}
  const TRENDING = ["Man City", "Real Madrid", "NBA", "V.League", "Gamer Long", "LoL"];
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const esc = s => s.replace(/[<>&"]/g, "");

  function save(q){
    recent = [q, ...recent.filter(x => x !== q)].slice(0, 8);
    try { sessionStorage.setItem("demoRecent", JSON.stringify(recent)); } catch (e) {}
  }

  function results(q){
    const n = norm(q);
    const has = (...xs) => xs.some(x => norm(x).includes(n));
    const rooms = ROOMS.map((r, i) => [r, i]).filter(([r]) => has(r.host, r.title, r.league, r.home[0], r.away[0]));
    const matches = SCHEDULE.filter(m => has(m.league, m.home[0], m.away[0]));
    const room = ([r, i]) => `<button class="sr-room" data-open="${i}">
        <span class="sr-thumb" style="background:${r.home[2]}"><i>${t("live")}</i></span>
        <div><b>${r.title}</b><small>@${r.host} · ${r.league}</small></div></button>`;
    if (!rooms.length && !matches.length) return `<p class="empty">${t("noResults")} “${esc(q)}”</p>`;
    return (rooms.length ? `<h3 class="league">${t("liveNow")}</h3>${rooms.map(room).join("")}` : "") +
           (matches.length ? `<h3 class="league">${t("schTitle")}</h3>${matches.map(Pages.matchCard).join("")}` : "");
  }

  function render(page){
    page.innerHTML = `
      <header class="sr-head">
        <button class="sr-back" aria-label="${t("close")}">${Icons.chevron}</button>
        <form class="sr-form"><span>${Icons.search}</span><input type="search" placeholder="${t("searchPh")}" value="${esc(query)}" enterkeyhint="search"></form>
        <button class="sr-go">${t("search")}</button>
      </header>
      <div class="pg-body sr-body"></div>`;
    const input = page.querySelector("input");
    const body = page.querySelector(".sr-body");
    const draw = () => {
      query = input.value.trim();
      body.innerHTML = query ? results(query) : `
        ${recent.length ? `<h3 class="league">${t("recent")} <button class="sr-clear">${t("clear")}</button></h3>
          <div class="chips wrap">${recent.map(x => `<button data-q="${esc(x)}">${esc(x)}</button>`).join("")}</div>` : ""}
        <h3 class="league">${t("trending")}</h3>
        <ol class="sr-trend">${TRENDING.map((x, i) => `<li data-q="${x}"><b>${i + 1}</b>${x}</li>`).join("")}</ol>`;
    };
    const go = () => { if (input.value.trim()){ save(input.value.trim()); draw(); input.blur(); } };
    input.oninput = draw;
    page.querySelector(".sr-form").onsubmit = e => { e.preventDefault(); go(); };
    page.querySelector(".sr-go").onclick = go;
    page.querySelector(".sr-back").onclick = () => { history.length > 1 ? history.back() : (location.hash = "#/"); };
    body.onclick = e => {
      const q = e.target.closest("[data-q]"); if (q){ input.value = q.dataset.q; go(); return; }
      if (e.target.closest(".sr-clear")){ recent = []; save("x"); recent = []; try { sessionStorage.removeItem("demoRecent"); } catch (er) {} draw(); return; }
      const o = e.target.closest("[data-open]"); if (o){ save(query); openRoom(+o.dataset.open); }
    };
    draw();
    if (!document.body.classList.contains("desk")) setTimeout(() => input.focus(), 100);
  }

  Pages.register("search", () => render(document.getElementById("page")));
  /* Search from somewhere else (the desktop top bar). */
  function go(q){
    q = (q || "").trim(); if (!q) return;
    query = q; save(q);
    if (location.hash === "#/search") render(document.getElementById("page")); else location.hash = "#/search";
  }
  return {render, go};
})();
