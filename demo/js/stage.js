/* The stream canvas is always 9:16 (vertical), like Douyin. The streamer composes it in OBS:
   "match-cam" = landscape match on top + their camera, "match" = landscape match only, "cam" = camera only.
   The website just plays the 9:16 stream full screen. These boxes are placeholders for the demo;
   production puts the Tencent Cloud player here. */
const Stage = (() => {
  function canvasHTML(room){
    const match = `
      <div class="cv-match" style="--c1:${room.home[2]};--c2:${room.away[2]}">
        <div class="cv-overlay"><i style="background:${room.home[2]}"></i>${room.home[1]} <b>${room.score}</b> ${room.away[1]}<i style="background:${room.away[2]}"></i><span>${room.min}</span></div>
        <span class="cv-label">${t("cvMatch")}</span>
      </div>`;
    const cam = big => `<div class="cv-cam ${big ? "big" : ""}"><span class="cv-label">${t("cvCam")}</span></div>`;
    const inner = room.layout === "cam" ? cam(true)
      : room.layout === "match" ? match
      : match + cam(false);
    return `<div class="canvas ${room.layout}">${inner}</div>`;
  }
  return {canvasHTML};
})();
