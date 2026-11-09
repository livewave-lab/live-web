/* Fake rooms and chat lines for the demo. Replace with real API data in the production project.
   layout = how the streamer composed their 9:16 canvas (done in OBS, not by the website):
   "match-cam" landscape match + host camera, "match" landscape match only, "cam" host camera only. */
const ROOMS = [
  {layout:"match-cam",rank:"Hourly #3",sport:"football",host:"Minh Anh",ini:"MA",title:"Live commentary: Premier League showdown 🔥",league:"Premier League",
   home:["Man City","MC","#6cabdd"],away:["Liverpool","LIV","#c8102e"],score:"1 - 1",min:"67'",viewers:12480,likes:8800},
  {layout:"match-cam",rank:"Hourly #7",sport:"football",host:"Tuan Kiet",ini:"TK",title:"Second-half tactics breakdown, come chat!",league:"La Liga",
   home:["Real Madrid","RM","#febe10"],away:["Barcelona","FCB","#a50044"],score:"2 - 1",min:"58'",viewers:9310,likes:6120},
  {layout:"cam",rank:"Popular #12",sport:"football",host:"Ha My",ini:"HM",title:"Watch-along V.League, predict the score to win prizes",league:"V.League 1",
   home:["Hanoi FC","HN","#7b2cbf"],away:["CAHN FC","CA","#e63946"],score:"0 - 0",min:"23'",viewers:4120,likes:2210},
  {layout:"match-cam",rank:"Hourly #1",sport:"esports",host:"Gamer Long",ini:"GL",title:"LoL grand final – casting with the squad",league:"Esports · LoL",
   home:["Team A","A","#2ee6a6"],away:["Team B","B","#ffd166"],score:"1 - 2",min:"Game 4",viewers:15730,likes:11040},
  {layout:"match",rank:"Popular #5",sport:"basketball",host:"Quoc Bao",ini:"QB",title:"NBA this morning: Lakers vs Warriors",league:"NBA",
   home:["Lakers","LAL","#fdb927"],away:["Warriors","GSW","#1d428a"],score:"88 - 91",min:"Q3 04:12",viewers:6890,likes:3900}
];
const NAMES = ["Alex","Linh","Sam","Trang","Duc","Ngoc","Kai","Vy","Leo","Mia","Ben","Quan"];
const LINES = ["GOAL!!! ⚽","Great call by the host","Second half is way better","Who wins this one?","Defense looks shaky",
  "Hello everyone 👋","This match is intense","What a save!","Replay please!","Calling 2-1 final",
  "High press is working","Watching from Da Nang","🔥🔥🔥","Smart substitution","Tough one to predict"];
