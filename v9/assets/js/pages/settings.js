import { renderHeader, pageHead } from "../components/header.js";
import { renderNav } from "../components/nav.js";
import { state, setLanguage, persistState } from "../state.js";
import { t } from "../i18n.js";

export function renderSettings(){
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        ${pageHead("settings_title","")}
        <div class="card settings-list">
          <div class="rowitem">
            <div class="grow">
              <div class="title">${t("language")}</div>
              <div class="desc">即時切換</div>
            </div>
            <select id="langSelect">
              <option value="zh-HK" ${state.language==="zh-HK"?"selected":""}>繁中</option>
              <option value="en" ${state.language==="en"?"selected":""}>English</option>
            </select>
          </div>
          <div class="rowitem">
            <div class="grow"><div class="title">${t("disable_sim")}</div><div class="desc">Send 後不自動回覆</div></div>
            <button class="chip ${state.disableSimReplies?"":"off"}" data-action="toggleSim">
              <span class="dot"></span><span>${state.disableSimReplies?"ON":"OFF"}</span>
            </button>
          </div>
          <div class="rowitem">
            <div class="grow"><div class="title">${t("show_splash")}</div><div class="desc">下次啟動時顯示</div></div>
            <button class="chip ${state.showSplashNext?"":"off"}" data-action="toggleSplashNext">
              <span class="dot"></span><span>${state.showSplashNext?"ON":"OFF"}</span>
            </button>
          </div>
          <div class="rowitem" data-action="logout">
            <div class="badge">⎋</div>
            <div class="grow"><div class="title">${t("logout")}</div><div class="desc">返回 Splash/Login</div></div>
            <div class="chev">›</div>
          </div>
        </div>
      </div>
      ${renderNav("profile")}
    </div>
  `;
  document.getElementById("langSelect").addEventListener("change",(e)=>{
    setLanguage(e.target.value); persistState(); import("../router.js").then(m=>m.render && m.render());
  });
}
