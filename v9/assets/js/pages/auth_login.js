import { renderHeader, pageHead } from "../components/header.js";
import { state, ensureCurrentUser, setCurrentUser } from "../state.js";
import { renderNav } from "../components/nav.js";
import { showToast } from "../ui/toast.js";
import { go } from "../router.js";
import { t } from "../i18n.js";

export function renderLogin(){
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        ${pageHead("login_title","")}
        <div class="card">
          <div class="form">
            <div class="field"><label>${t("email")}</label><input id="loginEmail" placeholder="demo@sifu.app" /></div>
            <div class="field"><label>${t("password")}</label><input id="loginPass" type="password" placeholder="password" /></div>
            <button class="btn primary" data-action="doLogin">${t("login_title")}</button>
            <button class="btn ghost" data-go="auth/register">${t("register_title")}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function doLogin(){
  ensureCurrentUser();
  setCurrentUser(state.currentUser);
  showToast("Logged in (demo)");
  go("home");
}
