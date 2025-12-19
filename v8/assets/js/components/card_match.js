import { state } from "../state.js";

export function matchCard(u){
  const liked = state.liked.has(u.id);
  return `
    <div class="card swipeable" data-id="${u.id}">
      <div class="match">
        <div class="avatar" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12zm7.6 9.5a9.4 9.4 0 0 0-15.2 0" stroke="rgba(255,255,255,0.85)" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <div class="grow">
          <p class="name">${u.name} • ${u.age} <span style="color:var(--muted); font-weight:700;">(${u.district})</span></p>
          <p class="meta">${u.bio}</p>
          <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
            ${u.verified ? `<span class="badge ok">Verified</span>` : `<span class="badge">Not verified</span>`}
            ${u.vip ? `<span class="badge vip">VIP</span>` : ``}
            <span class="badge">五行：水/金（demo）</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="iconbtn like" type="button" data-action="swipeLike" data-id="${u.id}">${liked ? "Liked" : "Like"}</button>
        <button class="iconbtn chat" type="button" data-go="chat/${u.id}">Chat</button>
        <button class="iconbtn ghost" type="button" data-action="swipePass" data-id="${u.id}">✕ Pass</button>
      </div>
    </div>
  `;
}
