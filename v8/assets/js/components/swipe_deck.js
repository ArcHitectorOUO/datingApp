import { state } from "../state.js";

export function swipeDeck(cards){
  const c = cards.slice(0,3);
  return `
    <div class="swipe-undo"><button class="btn ghost" type="button" data-action="undoSwipe">Undo</button></div>
    <div class="swipe-deck">
      ${c.map((u,i)=>`
        <div class="swipe-card" data-id="${u.id}" style="z-index:${c.length-i};">
          <div class="row" style="gap:10px;">
            <div class="avatar" style="width:60px;height:60px;border-radius:20px;"></div>
            <div class="grow">
              <div style="font-size:18px;font-weight:950;">${u.name} • ${u.age}</div>
              <div class="meta">${u.district} • ${u.verified ? "Verified" : "未認證"}</div>
              <div class="row" style="gap:6px;flex-wrap:wrap;">
                ${u.vip ? `<span class="badge vip">VIP</span>` : ``}
                <span class="badge">安全</span>
              </div>
            </div>
          </div>
          <div class="p">${u.bio}</div>
          <div class="swipe-actions">
            <button class="swipe-btn danger" type="button" data-action="swipePass" data-id="${u.id}">✕</button>
            <button class="swipe-btn primary" type="button" data-action="swipeLike" data-id="${u.id}">❤ Like</button>
            <button class="swipe-btn alt" type="button" data-toast="Super Like（示意）">★</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}
