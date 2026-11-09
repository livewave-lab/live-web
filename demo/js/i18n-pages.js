/* UI text for the pages added in v9: schedule, login/sign-up, Me, Inbox, in-room match info.
   Merged into I18N from i18n.js. */
Object.assign(I18N.en, {
  // schedule
  schTitle:"Schedule", yesterday:"Yesterday", today:"Today", tomorrow:"Tomorrow", all:"All",
  watch:"Watch", hostsLive:"hosts live", remind:"Remind me", reminded:"Reminder set", ft:"FT", noMatches:"No matches on this day",
  reminderToast:"We'll notify you before kick-off",
  // auth
  loginTitle:"Log in or sign up", loginSub:"Chat, follow hosts and get match reminders",
  phone:"Phone number", getCode:"Get code", agree:"I agree to the Terms of Service and Privacy Policy",
  agreeFirst:"Please agree to the terms first", badPhone:"Enter a valid Vietnamese phone number",
  codeTitle:"Enter the 6-digit code", codeSent:"Code sent to", demoCode:"Demo code: 123456", wrongCode:"Wrong code",
  resend:"Resend", resendIn:"Resend in", nickTitle:"Choose a nickname", nickHint:"Shown in chat. You can change it later.",
  done:"Done", orWith:"or continue with", google:"Continue with Google", welcome:"Welcome", loggedOut:"Logged out",
  // me / inbox
  meGuest:"Not logged in", meGuestSub:"Log in to chat, follow hosts and get reminders", loginBtn:"Log in / Sign up",
  meFollowing:"Following", meReminders:"Reminders", meHistory:"Watch history", meLanguage:"Language", meSettings:"Settings",
  meHelp:"Help & feedback", logout:"Log out", meTerms:"Terms & privacy",
  inboxTitle:"Inbox", inboxGuest:"Log in to see messages and reminders",
  ibSystem:"System notice", ibSystemText:"Welcome to Coichua! Read the community rules before chatting.",
  ibLive:"is live now", ibRemind:"Kick-off in 15 minutes",
  followGuest:"Log in to see the hosts you follow", followEmpty:"You're not following anyone yet. Tap Follow in a live room.",
  goLive:"Going live is for verified hosts (ID check required). Coming soon.",
  // in-room match info
  goal:"GOAL", yellowCard:"Yellow card", corner:"Corner", sub:"Substitution", threePt:"3-pointer", kill:"Takedown",
  tapData:"Tap for match data",
  // v10: drawer, search, profile
  menu:"Menu", followingLive:"Following · live now", downloadApp:"Download the app", followers:"Followers",
  editProfile:"Edit profile", shareProfile:"Share profile", historyEmpty:"Rooms you watch will show up here", remindEmpty:"No reminders yet. Tap Remind me on the Schedule.",
  search:"Search", searchPh:"Search hosts, teams, leagues", recent:"Recent", clear:"Clear", trending:"Trending", liveNow:"Live now", noResults:"No results for",
  memberTools:"My tools", hostTools:"Streamer centre", hostBadge:"Streamer", becomeHost:"Become a streamer", wallet:"Earnings",
  goLiveBtn:"Go live", pickMatch:"Pick a match", streamKey:"OBS stream key", liveStats:"Live data", fans:"Fans", hostRules:"Streamer rules",
  demoAsHost:"Demo: view as a streamer", demoAsMember:"Demo: view as a member",
  applyNote:"Apply with your ID. The team reviews it, then the Streamer centre unlocks. (Coming later)",
  hostSoon:"Streamer backend: planned for a later version",
  // v11: desktop
  noMatchData:"This room isn't tied to a match", catEnt:"Entertainment", getApp:"Get the app", myFollowing:"Following",
  noFollowLive:"Nobody you follow is live right now", moreLive:"More live", todayMatches:"Today's matches", viewSchedule:"Full schedule",
  onlineViewers:"Online viewers", loginToChat:"Log in to start chatting", quality:"Original",
  qrTitle:"Scan to log in", qrNote:"Open the Coichua app and scan the code (app coming later)"
});
Object.assign(I18N.zh, {
  schTitle:"賽程", yesterday:"昨天", today:"今天", tomorrow:"明天", all:"全部",
  watch:"觀看", hostsLive:"位主播在播", remind:"提醒我", reminded:"已設提醒", ft:"完場", noMatches:"這天沒有比賽",
  reminderToast:"開賽前會通知你",
  loginTitle:"登入或註冊", loginSub:"登入後可以留言、追蹤主播、設定比賽提醒",
  phone:"手機號碼", getCode:"取得驗證碼", agree:"我同意服務條款和隱私政策",
  agreeFirst:"請先同意條款", badPhone:"請輸入正確的越南手機號碼",
  codeTitle:"輸入 6 位數驗證碼", codeSent:"驗證碼已傳送到", demoCode:"Demo 驗證碼：123456", wrongCode:"驗證碼錯誤",
  resend:"重新傳送", resendIn:"重新傳送", nickTitle:"設定暱稱", nickHint:"會顯示在聊天室，之後可以改。",
  done:"完成", orWith:"或使用", google:"用 Google 繼續", welcome:"歡迎", loggedOut:"已登出",
  meGuest:"尚未登入", meGuestSub:"登入後可以留言、追蹤主播、設定提醒", loginBtn:"登入／註冊",
  meFollowing:"追蹤中", meReminders:"比賽提醒", meHistory:"觀看紀錄", meLanguage:"語言", meSettings:"設定",
  meHelp:"幫助與回饋", logout:"登出", meTerms:"條款與隱私",
  inboxTitle:"消息", inboxGuest:"登入後查看消息和提醒",
  ibSystem:"系統通知", ibSystemText:"歡迎來到 Coichua！留言前請先看社群規範。",
  ibLive:"正在直播", ibRemind:"15 分鐘後開賽",
  followGuest:"登入後查看你追蹤的主播", followEmpty:"還沒有追蹤任何主播。在直播間按「追蹤」。",
  goLive:"開播只限通過身分驗證的主播，之後開放。",
  goal:"進球", yellowCard:"黃牌", corner:"角球", sub:"換人", threePt:"三分球", kill:"擊殺",
  tapData:"點擊看比賽數據",
  menu:"選單", followingLive:"追蹤中 · 正在直播", downloadApp:"下載 App", followers:"粉絲",
  editProfile:"編輯資料", shareProfile:"分享主頁", historyEmpty:"看過的直播間會出現在這裡", remindEmpty:"還沒有提醒。到賽程頁按「提醒我」。",
  search:"搜尋", searchPh:"搜尋主播、球隊、聯賽", recent:"最近搜尋", clear:"清除", trending:"熱門搜尋", liveNow:"正在直播", noResults:"找不到",
  memberTools:"我的功能", hostTools:"主播中心", hostBadge:"主播", becomeHost:"成為主播", wallet:"收益",
  goLiveBtn:"開始直播", pickMatch:"選擇賽事", streamKey:"OBS 推流金鑰", liveStats:"直播數據", fans:"粉絲", hostRules:"主播規範",
  demoAsHost:"Demo：切換成主播帳號看看", demoAsMember:"Demo：切換成一般會員",
  applyNote:"上傳身分證申請，營運審核通過後開啟主播中心。（之後的版本）",
  hostSoon:"主播後台：之後的版本會做",
  noMatchData:"這個直播間沒有綁比賽", catEnt:"娛樂", getApp:"下載 App", myFollowing:"我的關注",
  noFollowLive:"暫時沒有關注的人在直播", moreLive:"更多直播", todayMatches:"今日賽事", viewSchedule:"完整賽程",
  onlineViewers:"在線觀眾", loginToChat:"登入後才能開始聊天", quality:"原畫",
  qrTitle:"掃碼登入", qrNote:"打開 Coichua App 掃描（App 之後推出）"
});
