/* Login / sign-up as a bottom sheet (Douyin style): no separate page.
   Guests can watch and swipe. Chat, follow, reminders and Inbox ask to log in first.
   Flow: Vietnamese phone number -> 6-digit SMS code -> nickname (new users).
   Phone verification is also what Vietnam's Decree 147/2024 requires for accounts.
   DEMO ONLY: no SMS is sent; the code is always 123456 and nothing leaves the browser.
   Production: server/api/auth sends the SMS and issues the session. Depends on i18n.js. */
const Auth = (() => {
  let user = null;
  try { user = JSON.parse(sessionStorage.getItem("demoUser")); } catch (e) {}
  const listeners = [];
  let pending = null;

  function save(){ try { user ? sessionStorage.setItem("demoUser", JSON.stringify(user)) : sessionStorage.removeItem("demoUser"); } catch (e) {} }
  function changed(){ save(); listeners.forEach(f => f(user)); }

  /* Run fn now if logged in, otherwise open the login sheet and run fn after login. */
  function require(fn){ if (user){ fn && fn(); return; } pending = fn; open(); }

  function open(){
    close();
    const el = document.createElement("div");
    el.className = "auth";
    el.innerHTML = `<div class="auth-backdrop"></div><div class="auth-panel" role="dialog" aria-label="${t("loginTitle")}">
      <button class="auth-x" aria-label="${t("close")}">${Icons.close}</button><div class="auth-body"></div></div>`;
    document.getElementById("app").appendChild(el);
    el.querySelector(".auth-backdrop").onclick = close;
    el.querySelector(".auth-x").onclick = close;
    stepPhone(el.querySelector(".auth-body"));
    requestAnimationFrame(() => el.classList.add("show"));
  }
  function close(){ const el = document.querySelector(".auth"); if (el) el.remove(); clearInterval(close.timer); }

  function stepPhone(body){
    body.innerHTML = `
      <img class="auth-logo" src="img/logo.png" alt="Coichua">
      <h2>${t("loginTitle")}</h2><p class="auth-sub">${t("loginSub")}</p>
      <form class="auth-form">
        <label class="phone-row"><span class="cc">🇻🇳 +84</span><input type="tel" inputmode="numeric" maxlength="11" placeholder="${t("phone")}" autocomplete="off"></label>
        <label class="agree"><input type="checkbox"> <span>${t("agree")}</span></label>
        <button class="auth-btn" type="submit">${t("getCode")}</button>
      </form>
      <div class="auth-or"><span>${t("orWith")}</span></div>
      <button class="auth-alt" data-google>G&nbsp;&nbsp;${t("google")}</button>`;
    const inp = body.querySelector("input[type=tel]");
    setTimeout(() => inp.focus(), 250);
    body.querySelector("[data-google]").onclick = () => toast(t("soon"));
    body.querySelector("form").onsubmit = e => {
      e.preventDefault();
      const digits = inp.value.replace(/\D/g, "").replace(/^0/, "");
      if (!body.querySelector(".agree input").checked) return toast(t("agreeFirst"));
      if (!/^[35789]\d{8}$/.test(digits)) return toast(t("badPhone"));
      stepCode(body, digits);
    };
  }

  function stepCode(body, phone){
    const masked = "+84 " + phone.slice(0, 2) + "*****" + phone.slice(-2);
    body.innerHTML = `
      <h2>${t("codeTitle")}</h2><p class="auth-sub">${t("codeSent")} ${masked}</p>
      <form class="auth-form">
        <input class="code" inputmode="numeric" maxlength="6" placeholder="••••••" autocomplete="one-time-code">
        <p class="demo-code">${t("demoCode")}</p>
        <button class="auth-btn" type="submit">${t("done")}</button>
      </form>
      <button class="auth-link" disabled></button>`;
    const inp = body.querySelector(".code");
    setTimeout(() => inp.focus(), 50);
    const link = body.querySelector(".auth-link");
    let left = 60;
    const tick = () => { link.textContent = left > 0 ? `${t("resendIn")} ${left}s` : t("resend"); link.disabled = left > 0; left--; };
    tick(); clearInterval(close.timer); close.timer = setInterval(tick, 1000);
    link.onclick = () => { left = 60; tick(); };
    const check = () => {
      if (inp.value.length < 6) return;
      if (inp.value !== "123456"){ toast(t("wrongCode")); inp.value = ""; return; }
      clearInterval(close.timer); stepNick(body, masked);
    };
    inp.oninput = () => { inp.value = inp.value.replace(/\D/g, ""); check(); };
    body.querySelector("form").onsubmit = e => { e.preventDefault(); check(); };
  }

  function stepNick(body, masked){
    const suggestion = "fan" + Math.floor(1000 + Math.random() * 9000);
    body.innerHTML = `
      <h2>${t("nickTitle")}</h2><p class="auth-sub">${t("nickHint")}</p>
      <form class="auth-form">
        <input class="nick" maxlength="20" value="${suggestion}">
        <button class="auth-btn" type="submit">${t("done")}</button>
      </form>`;
    const inp = body.querySelector(".nick");
    setTimeout(() => inp.select(), 50);
    body.querySelector("form").onsubmit = e => {
      e.preventDefault();
      const name = inp.value.trim().replace(/[<>&"]/g, "") || suggestion;
      user = {name, phone: masked, role: "member", following: [], reminders: []};   // role: "member" or "host" (streamer)
      changed(); close(); toast(`${t("welcome")}, ${name}!`);
      const fn = pending; pending = null; fn && fn();
    };
  }

  function logout(){ user = null; changed(); toast(t("loggedOut")); }
  function update(f){ if (user){ f(user); changed(); } }

  return {require, open, close, logout, update, get user(){ return user; }, onChange: f => listeners.push(f)};
})();
