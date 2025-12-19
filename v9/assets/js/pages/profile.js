import { renderHeader, pageHead } from "../components/header.js";
import { renderNav } from "../components/nav.js";
import { state } from "../state.js";
import { t } from "../i18n.js";
import { showToast } from "../ui/toast.js";

export function renderProfile(){
  const u = state.currentUser || {};
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        ${pageHead("profile_title","個人檔案","")}
        <div class="card">
          <div class="row" style="align-items:flex-start;">
            <div class="avatar" style="width:54px;height:54px;border-radius:20px;"></div>
            <div class="grow">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <div style="font-size:16px; font-weight:950;">${u.name || "Guest"} • ${u.age || "--"}</div>
                ${u.vip ? `<span class="badge vip">VIP</span>` : `<span class="badge">Normal</span>`}
                ${u.verified ? `<span class="badge ok">Verified</span>` : `<span class="badge">Not verified</span>`}
              </div>
              <div class="meta" style="margin-top:6px;">${u.district || ""} • ${u.occupation || ""}</div>
              <div class="hint">${u.bio || ""}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="row">
            <div class="grow">
              <div style="font-weight:900;">VIP 主題色</div>
              <div class="meta">示意：點擊套用</div>
              <div class="accent-row" style="margin-top:12px;">
                ${["#f97316","#0ea5e9","#a855f7","#22c55e","#f43f5e"].map(c=>`
                  <button class="accent-chip ${state.accent===c?"active":""}" type="button" data-action="setAccent" data-color="${c}" style="--accent:${c};">
                    <span class="glow"></span>
                  </button>
                `).join("")}
              </div>
            </div>
            <div class="badge vip">VIP</div>
          </div>
        </div>

        <div class="card">
          <div class="row"><div class="badge">Coach</div><div class="grow"></div><button class="btn ghost" data-action="openCoach">Start</button></div>
        </div>

        <div class="list" style="margin-top:12px;">
          <div class="rowitem" data-go="settings">
            <div class="badge">⚙</div>
            <div class="grow"><div class="title">${t("settings_title")}</div><div class="desc">${t("language")} / ${t("disable_sim")}</div></div>
            <div class="chev">›</div>
          </div>
        </div>
      </div>
      ${renderNav("profile")}
    </div>
  `;
}
