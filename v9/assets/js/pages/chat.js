import { renderHeader } from "../components/header.js";
import { renderNav } from "../components/nav.js";
import { state, persistState } from "../state.js";
import { bubbleHtml } from "../components/chat_bubble.js";
import { showToast } from "../ui/toast.js";
import { replyPool } from "../data.js";
import { openSheet } from "../ui/sheet.js";

export function renderChatPage(userId){
  const root = document.getElementById("root");
  const uid = userId || "u1";
  const u = state.users.find(x=>x.id===uid) || state.users[0];
  const msgs = state.chats[uid] || [];
  root.innerHTML = `
    <div class="app nav-hidden">
      ${renderHeader()}
      <div class="chatroom on">
        <div class="chat-top">
          <button class="back" type="button" data-action="back">←</button>
          <div class="row grow" style="gap:10px;">
            <div class="avatar" style="width:40px;height:40px;border-radius:14px;"></div>
            <div class="grow">
              <div style="font-weight:800; font-size:14px;">${u.name} • ${u.age}</div>
              <div style="font-size:12px; color:var(--muted);">${u.district} • ${u.verified ? "Verified" : "Not verified"}</div>
            </div>
          </div>
          <div class="badge">Focus</div>
        </div>
        <div class="thread">
          <div class="day-divider"><span>Today</span></div>
          ${msgs.map((m,i)=>bubbleHtml(m,i,uid)).join("")}
          <div class="typing" id="typingRow" style="display:none;">${u.name} 正在輸入...</div>
        </div>
        <div class="composer">
          <button class="attach" data-toast="示意：Add attachment">＋</button>
          <input id="msgInput" placeholder="輸入訊息…" />
          <button class="coach-btn" data-action="openCoach">Coach</button>
          <button class="voice" data-toast="示意：Voice">🎙</button>
          <button class="send" id="sendBtn" data-id="${uid}">➤</button>
        </div>
      </div>
    </div>
  `;
  attachEvents(uid);
}

function attachEvents(uid){
  const container = document.querySelector(".thread");
  container.querySelectorAll(".bubble").forEach(b=>attachBubbleMenu(b, uid));
  document.getElementById("sendBtn").addEventListener("click", ()=>sendMsg(uid));
  document.getElementById("msgInput").addEventListener("keydown",(e)=>{if(e.key==="Enter"){e.preventDefault();sendMsg(uid);}});
}

function sendMsg(uid){
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if(!text) return;
  state.chats[uid] = state.chats[uid] || [];
  state.chats[uid].push({who:"me", type:"text", text, ts:"now"});
  input.value = "";
  renderChatPage(uid);
  if(!state.disableSimReplies) simulateReply(uid, text);
}

function simulateReply(uid, text){
  const typing = document.getElementById("typingRow");
  typing.style.display = "block";
  clearTimeout(state.typingTimers[uid]);
  const delay = 800 + Math.random()*800;
  state.typingTimers[uid] = setTimeout(()=>{
    typing.style.display = "none";
    const reply = pickReply(text);
    state.chats[uid].push({who:"them", type:"text", text:reply, ts:"now"});
    renderChatPage(uid);
  }, delay);
}

function pickReply(text){
  const lower = text.toLowerCase();
  const bucket = lower.includes("meet") ? replyPool.plan :
    lower.includes("value") ? replyPool.values :
    lower.includes("coffee") ? replyPool.hobbies :
    replyPool.greeting;
  return bucket[Math.floor(Math.random()*bucket.length)];
}

function attachBubbleMenu(el, userId){
  let timer = null;
  const openMenu = (e)=>{
    e.preventDefault();
    const idx = parseInt(el.dataset.idx,10);
    const type = el.dataset.type;
    const who = el.dataset.who;
    const opts = [];
    if(type === "text") opts.push({ title:"Copy text", sub:"複製", action:"copyBubble" });
    if(who === "me") opts.push({ title:"Delete", sub:"刪除自己訊息", action:"deleteBubble", id:userId, idx });
    opts.push({ title:"Report", sub:"舉報", action:"openReport" });
    openSheet("Message actions", opts);
    document.querySelector(".sheet").dataset.ctx = JSON.stringify({userId, idx});
  };
  const clear = ()=>{ if(timer){ clearTimeout(timer); timer=null; } };
  el.addEventListener("contextmenu", openMenu);
  el.addEventListener("pointerdown", (e)=>{ timer = setTimeout(()=>openMenu(e), 520); });
  ["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev, clear));
}
