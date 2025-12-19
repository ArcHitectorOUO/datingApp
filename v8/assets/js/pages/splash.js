import { renderHeader } from "../components/header.js";
import { t } from "../i18n.js";
import { state, persistState } from "../state.js";
import { renderNav } from "../components/nav.js";
import { showToast } from "../ui/toast.js";
import { go } from "../router.js";

export function renderSplash(){
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="app nav-hidden">
      <svg class="bg-bagua" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="88" fill="none" stroke="url(#g)" stroke-width="8"/>
      </svg>
      ${renderHeader()}
      <div class="content">
        <div class="splash">
          <div class="logo" aria-hidden="true"></div>
          <h1>SIFU Love</h1>
          <p>${t("splash_tagline")}</p>
          <div style="width:100%;max-width:280px;margin-top:18px;display:flex;flex-direction:column;gap:10px;">
            <button class="btn primary" data-action="enterApp">${t("splash_enter")}</button>
            <button class="btn ghost" data-go="auth/login">${t("login_title")}</button>
            <button class="btn ghost" data-go="auth/register">${t("register_title")}</button>
          </div>
        </div>
      </div>
    </div>
  `;
  attachEvents();
}

function attachEvents(){
  document.getElementById("root").querySelectorAll("[data-action='enterApp']").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.hasEntered = true;
      persistState();
      showToast("Welcome");
      go("auth/login");
    });
  });
}
