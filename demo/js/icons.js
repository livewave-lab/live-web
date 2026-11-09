/* Icons (inline SVG, 24×24). Line icons use currentColor; heart and gift copy Douyin's filled pink style. */
const Icons = (() => {
  const line = d => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const fill = (d, c) => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="${c}" d="${d}"/></svg>`;
  return {
    emoji: line('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2"/><circle cx="9" cy="10" r=".6" fill="currentColor"/><circle cx="15" cy="10" r=".6" fill="currentColor"/>'),
    heart: fill("M12 20.5s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z", "#fe2c55"),
    chart: line('<path d="M5 19V11M12 19V5M19 19v-6"/>'),
    share: fill("M13 5v3.6C7.5 9.3 4.6 12.8 4 18.5c1.9-2.8 4.6-4.2 9-4.2V18l7-6.5z", "#ffffff"),
    close: line('<path d="M6 6l12 12M18 6L6 18"/>'),
    chevron: line('<path d="M9 6l6 6-6 6"/>'),
    menu: line('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    search: line('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>'),
    bars: line('<path d="M7 17V11M12 17V7M17 17v-4"/>'),
    home: line('<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'),
    calendar: line('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
    compass: line('<circle cx="12" cy="12" r="8"/><path d="M15 9l-2 4-4 2 2-4z"/>'),
    user: line('<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>')
  };
})();
