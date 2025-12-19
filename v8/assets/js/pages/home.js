import { renderHeader } from "../components/header.js";
import { renderNav } from "../components/nav.js";
import { swipeDeck } from "../components/swipe_deck.js";
import { matchCard } from "../components/card_match.js";
import { state } from "../state.js";
import { t } from "../i18n.js";
import { replyPool } from "../data.js";

export function renderHome(){
  const root = document.getElementById("root");
  const picks = computeMatches();
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        <div class="hero">
          <div class="row" style="align-items:flex-start;">
            <div class="grow">
              <div class="pill">Balanced • 五行 • 留白</div>
              <h2 class="h2">今日 ${picks.length} 個配對</h2>
              <p class="p">只保留單一滾動容器；切換畫面不會重疊。</p>
            </div>
            <div class="badge ${state.currentUser?.vip ? "vip":""}">
              ${state.currentUser?.vip ? "VIP" : "Normal"}
            </div>
          </div>
          <div class="divider"></div>
          <button class="btn primary" type="button" data-go="match">${t("match_title")}</button>
          <div class="waterline"></div>
        </div>

        <div class="section-title">Stories</div>
        <div class="card">
          <div class="story-rail">
            ${state.users.slice(0,6).map(u=>`
              <div class="story"><div class="ring"><div class="inner"></div></div><div class="name">${u.name}</div></div>
            `).join("")}
          </div>
        </div>

        <div class="section-title">Swipe Deck</div>
        ${swipeDeck(picks)}

        <div class="section-title">Cards</div>
        ${picks.map(matchCard).join("")}
      </div>
      ${renderNav("home")}
    </div>
  `;
  window.attachSwipeables && window.attachSwipeables();
}

function computeMatches(){
  return state.users.filter(u=>u.status==="active" && !state.passed.has(u.id)).slice(0,3);
}
