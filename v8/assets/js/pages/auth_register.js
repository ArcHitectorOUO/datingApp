import { renderHeader, pageHead } from "../components/header.js";
import { setCurrentUser, state } from "../state.js";
import { showToast } from "../ui/toast.js";
import { go } from "../router.js";
import { t } from "../i18n.js";

export function renderRegister(){
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        ${pageHead("register_title","Demo form")}
        <div class="card">
          <div class="form">
            <div class="field"><label>${t("name")}</label><input id="rName" placeholder="Do" /></div>
            <div class="grid2">
              <div class="field"><label>${t("age")}</label><input id="rAge" type="number" min="18" max="60" value="26"/></div>
              <div class="field"><label>${t("district")}</label><input id="rDist" placeholder="Central"/></div>
            </div>
            <div class="field"><label>${t("email")}</label><input id="rEmail" placeholder="demo@sifu.app"/></div>
            <div class="field"><label>${t("password")}</label><input id="rPass" type="password" placeholder="password (demo)"/></div>
            <button class="btn primary" data-action="doRegister">${t("create_account")}</button>
            <button class="btn ghost" data-go="auth/login">${t("login_title")}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function doRegister(){
  const user = {
    name: document.getElementById("rName").value || "Do",
    age: parseInt(document.getElementById("rAge").value || "26",10),
    district: document.getElementById("rDist").value || "Central",
    email: document.getElementById("rEmail").value || "",
    vip: true,
    verified: false,
    bio: "新用戶（demo）",
    occupation: "User",
  };
  setCurrentUser(user);
  // add to local demo list
  user.id = "me";
  user.status = "active";
  user.tags = ["new","demo"];
  user.vip = true;
  user.verified = false;
  user.bio = user.bio || "新用戶（demo）";
  // store in memory list
  const idx = state.users.findIndex(u=>u.id==="me");
  if(idx>=0) state.users[idx]=user;
  else state.users.unshift(user);
  showToast("Account created (demo)");
  go("home");
}
