import { renderHeader, pageHead } from "../components/header.js";
import { renderNav } from "../components/nav.js";
import { matchCard } from "../components/card_match.js";
import { state } from "../state.js";
import { showToast } from "../ui/toast.js";

export function renderMatch(){
  const root = document.getElementById("root");
  const picks = state.users.filter(u=>u.status==="active" && !state.passed.has(u.id));
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        ${pageHead("match_title","Swipe 或按鈕 Like / Pass", `<button class="mini" data-action="undoSwipe">Undo</button>`)}
        ${picks.length ? picks.map(matchCard).join("") : `<div class="card"><div class="p">No matches</div></div>`}
      </div>
      ${renderNav("match")}
    </div>
  `;
  window.attachSwipeables && window.attachSwipeables();
}
