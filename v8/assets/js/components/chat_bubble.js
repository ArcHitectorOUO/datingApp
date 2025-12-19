export function bubbleHtml(m, idx, userId){
  const isMe = m.who === "me";
  if(m.type === "text"){
    return `<div class="bubble ${isMe ? "me":""}" data-idx="${idx}" data-type="text" data-who="${m.who}" data-id="${userId}" data-text="${escapeHtml(m.text)}">
      ${escapeHtml(m.text)}
      <div class="tiny">${m.ts || ""}</div>
    </div>`;
  }
  return `<div class="bubble ${isMe ? "me":""}" data-idx="${idx}" data-type="${m.type}" data-who="${m.who}" data-id="${userId}" data-text="${escapeHtml(m.text || m.type)}">
    <div><b>[${m.type}]</b> ${escapeHtml(m.text || m.type)}</div>
    <div class="tiny">${m.ts || ""}</div>
  </div>`;
}

function escapeHtml(s){return String(s ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
