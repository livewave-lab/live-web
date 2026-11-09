/* Fake schedule for the demo. Production gets fixtures from the TheSports API.
   day: -1 yesterday, 0 today, 1 tomorrow, 2, 3.  status: "live" | "upcoming" | "ft".
   rooms: indexes into ROOMS for matches someone is streaming (Watch opens that live room). */
const SCHEDULE = [
  // today: live (these are the matches in the demo live rooms)
  {id:"m1",day:0,status:"live",sport:"football",league:"Premier League",time:"22:00",home:["Man City","MC","#6cabdd"],away:["Liverpool","LIV","#c8102e"],score:"1 - 1",min:"67'",rooms:[0],roomIndex:0},
  {id:"m2",day:0,status:"live",sport:"football",league:"La Liga",time:"22:15",home:["Real Madrid","RM","#febe10"],away:["Barcelona","FCB","#a50044"],score:"2 - 1",min:"58'",rooms:[1],roomIndex:1},
  {id:"m3",day:0,status:"live",sport:"football",league:"V.League 1",time:"19:15",home:["Hanoi FC","HN","#7b2cbf"],away:["CAHN FC","CA","#e63946"],score:"0 - 0",min:"23'",rooms:[2],roomIndex:2},
  {id:"m4",day:0,status:"live",sport:"esports",league:"Esports · LoL",time:"20:00",home:["Team A","A","#2ee6a6"],away:["Team B","B","#ffd166"],score:"1 - 2",min:"Game 4",rooms:[3],roomIndex:3},
  {id:"m5",day:0,status:"live",sport:"basketball",league:"NBA",time:"08:30",home:["Lakers","LAL","#fdb927"],away:["Warriors","GSW","#1d428a"],score:"88 - 91",min:"Q3 04:12",rooms:[4],roomIndex:4},
  // today: upcoming
  {id:"m6",day:0,status:"upcoming",sport:"football",league:"Premier League",time:"23:30",home:["Arsenal","ARS","#ef0107"],away:["Chelsea","CHE","#034694"],score:"",min:""},
  {id:"m7",day:0,status:"upcoming",sport:"football",league:"Serie A",time:"02:45",home:["Inter","INT","#0068a8"],away:["Juventus","JUV","#cccccc"],score:"",min:""},
  {id:"m8",day:0,status:"upcoming",sport:"football",league:"Bundesliga",time:"00:30",home:["Bayern","FCB","#dc052d"],away:["Dortmund","BVB","#fde100"],score:"",min:""},
  // today: finished
  {id:"m9",day:0,status:"ft",sport:"football",league:"V.League 1",time:"17:00",home:["Hai Phong","HP","#1f6feb"],away:["Nam Dinh","ND","#2ea043"],score:"2 - 2",min:""},
  {id:"m10",day:0,status:"ft",sport:"basketball",league:"NBA",time:"06:00",home:["Celtics","BOS","#007a33"],away:["Heat","MIA","#98002e"],score:"112 - 104",min:""},
  // yesterday
  {id:"m11",day:-1,status:"ft",sport:"football",league:"Premier League",time:"21:00",home:["Tottenham","TOT","#ffffff"],away:["Newcastle","NEW","#241f20"],score:"3 - 1",min:""},
  {id:"m12",day:-1,status:"ft",sport:"football",league:"La Liga",time:"03:00",home:["Atletico","ATM","#cb3524"],away:["Sevilla","SEV","#d71920"],score:"1 - 0",min:""},
  {id:"m13",day:-1,status:"ft",sport:"esports",league:"Esports · LoL",time:"19:00",home:["Team C","C","#7cd4ff"],away:["Team D","D","#ff7ab6"],score:"3 - 1",min:""},
  // tomorrow and later
  {id:"m14",day:1,status:"upcoming",sport:"football",league:"Champions League",time:"03:00",home:["PSG","PSG","#004170"],away:["Man United","MUN","#da291c"],score:"",min:""},
  {id:"m15",day:1,status:"upcoming",sport:"football",league:"V.League 1",time:"18:00",home:["Viettel","VT","#d62828"],away:["HAGL","HAG","#f2c14e"],score:"",min:""},
  {id:"m16",day:1,status:"upcoming",sport:"basketball",league:"NBA",time:"09:00",home:["Nuggets","DEN","#0e2240"],away:["Suns","PHX","#e56020"],score:"",min:""},
  {id:"m17",day:2,status:"upcoming",sport:"esports",league:"Esports · LoL",time:"16:00",home:["Team A","A","#2ee6a6"],away:["Team C","C","#7cd4ff"],score:"",min:""},
  {id:"m18",day:3,status:"upcoming",sport:"football",league:"Premier League",time:"21:00",home:["Liverpool","LIV","#c8102e"],away:["Arsenal","ARS","#ef0107"],score:"",min:""}
];
