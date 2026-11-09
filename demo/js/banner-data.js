/* Desktop home banners (v13). In production the operations team edits these in the admin backend;
   the demo hard-codes four. Each banner has:
   kind  : "match" (shows the two teams) | "promo" (shows an emoji visual)
   match : schedule id for "match" banners (teams/time/score come from SCHEDULE)
   act   : what the button does → "watch" (open the live room) | "remind" | "apply" | "app" | "schedule"
   en/zh : the text. Vietnamese is added with the production i18n. */
const BANNERS = [
  { kind:"match", match:"m2", act:"watch",
    en:{tag:"LIVE NOW", title:"El Clásico is live", sub:"Real Madrid vs Barcelona · watch with host Tuan Kiet", cta:"Watch now"},
    zh:{tag:"正在直播", title:"國家德比直播中", sub:"皇家馬德里 vs 巴塞隆納 · 跟主播 Tuan Kiet 一起看", cta:"立即觀看"} },
  { kind:"match", match:"m6", act:"remind",
    en:{tag:"TONIGHT 23:30", title:"London derby", sub:"Arsenal vs Chelsea · get a reminder when it starts", cta:"Remind me"},
    zh:{tag:"今晚 23:30", title:"倫敦德比", sub:"阿森納 vs 切爾西 · 開賽前提醒你", cta:"開賽提醒"} },
  { kind:"promo", icon:"🎙️", color:"#fe2c55", act:"apply",
    en:{tag:"FOR HOSTS", title:"Become a Coichua host", sub:"Pick a match, go live from your phone, earn gifts from fans", cta:"Apply now"},
    zh:{tag:"主播招募", title:"成為 Coichua 主播", sub:"選一場比賽，用手機開播，粉絲送禮你就有收入", cta:"立即申請"} },
  { kind:"promo", icon:"📱", color:"#25f4ee", act:"app",
    en:{tag:"APP", title:"Never miss a goal", sub:"Get the app for kick-off alerts and live rooms on the go", cta:"Get the app"},
    zh:{tag:"APP", title:"進球一個都不漏", sub:"下載 App，開賽提醒、隨時隨地看直播", cta:"下載 App"} }
];
