import { t } from "../i18n.js";

export function renderNav(active="home"){
  const tabs = [
    {id:"home", label:t("home_title")},
    {id:"match", label:t("match_title")},
    {id:"chat", label:t("chat_title")},
    {id:"profile", label:t("profile_title")},
  ];
  return `
    <div class="nav">
      ${tabs.map(tab=>`
        <div class="tab ${active===tab.id?"active":""}" data-go="${tab.id}">
          <span>${tab.label}</span>
        </div>
      `).join("")}
    </div>
  `;
}
