/* Fake match data for the "Match data" sheet. Production gets this from the TheSports API.
   Values are generated from the room index so they stay the same on every load. */
const MatchData = (() => {
  function seeded(seed){ let s = seed * 9301 + 49297; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

  const FORMATIONS = {
    "4-3-3":   [[50,92],[15,75],[38,78],[62,78],[85,75],[30,58],[50,62],[70,58],[20,38],[50,34],[80,38]],
    "4-2-3-1": [[50,92],[15,75],[38,78],[62,78],[85,75],[38,62],[62,62],[20,46],[50,44],[80,46],[50,30]]
  };

  function forRoom(room, index){
    const rnd = seeded(index + 3);
    const pick = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const football = room.sport === "football";
    const statKeys = football
      ? ["possession","shots","shotsOn","corners","fouls","yellow"]
      : room.sport === "basketball" ? ["fgPct","threes","rebounds","assists","turnovers"]
      : ["kills","towers","dragons","gold"];
    const stats = statKeys.map(k => {
      if (k === "possession" || k === "fgPct"){ const h = pick(38, 62); return [k, h, k === "possession" ? 100 - h : pick(38, 55)]; }
      if (k === "gold") return [k, pick(40, 70), pick(40, 70)];
      return [k, pick(1, 14), pick(1, 14)];
    });
    const formation = rnd() > .5 ? "4-3-3" : "4-2-3-1";
    const lineup = football ? {
      home: {formation, numbers: [1,2,4,5,3,8,6,10,7,9,11]},
      away: {formation: formation === "4-3-3" ? "4-2-3-1" : "4-3-3", numbers: [1,2,5,4,3,6,8,7,10,11,9]}
    } : null;
    const h2h = Array.from({length: 5}, (_, i) => {
      const swap = i % 2 === 1;
      return {date: `${String(pick(1, 28)).padStart(2,"0")}-${String(pick(1, 12)).padStart(2,"0")}-${2025 - Math.floor(i / 2)}`,
        home: swap ? room.away[0] : room.home[0], away: swap ? room.home[0] : room.away[0],
        hs: football ? pick(0, 3) : pick(85, 120), as: football ? pick(0, 3) : pick(85, 120)};
    });
    const form = {home: Array.from({length: 5}, () => "WDL"[pick(0, 2)]), away: Array.from({length: 5}, () => "WDL"[pick(0, 2)])};
    const others = ["Arsenal FC","Chelsea FC","Spurs FC","Newcastle FC","Villa FC","United FC"];
    const table = [room.home[0], room.away[0], ...others].map(team => {
      const w = pick(4, 10), d = pick(1, 5), l = pick(1, 6);
      return {team, p: w + d + l, w, d, l, gd: pick(-6, 14), pts: w * 3 + d};
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd);
    return {stats, lineup, h2h, form, table, formations: FORMATIONS};
  }

  return {forRoom};
})();
