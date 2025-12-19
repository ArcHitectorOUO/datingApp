import { state, persistState, ensureCurrentUser, setCurrentUser } from "./state.js";
import { demoUsers, demoChats } from "./data.js";
import { render } from "./router.js";
import { showToast } from "./ui/toast.js";
import { closeSheet } from "./ui/sheet.js";
import { closeModal } from "./ui/modal.js";
import { switchLang, t } from "./i18n.js";
import { doLogin } from "./pages/auth_login.js";
import { doRegister } from "./pages/auth_register.js";
import { go, parseHash } from "./router.js";
import { renderChatPage } from "./pages/chat.js";

function init(){
  document.documentElement.dataset.js="on";
  window.state = state;
  ensureCurrentUser();
  state.users = demoUsers;
  state.chats = JSON.parse(JSON.stringify(demoChats));
  if(state.showSplashNext){
    state.hasEntered = false;
    state.showSplashNext = false;
    persistState();
  }
  applyAccent(state.accent);
  window.attachSwipeables = attachSwipeables;
  render();
  attachGlobalHandlers();
}

function attachGlobalHandlers(){
  document.body.addEventListener("click",(e)=>{
    const el = e.target.closest("[data-go],[data-action],[data-toast]");
    if(!el) return;
    if(el.dataset.toast){ showToast(el.dataset.toast); return; }
    if(el.dataset.go){ go(el.dataset.go); return; }
    if(el.dataset.action){
      const action = el.dataset.action;
      if(actions[action]) actions[action](el);
      else showToast(`No action: ${action}`);
    }
  });
  document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeSheet(); });
  document.addEventListener("input",(e)=>{
    if(e.target.id === "adminSearch"){
      state.adminFilters.query = e.target.value || "";
      persistState();
      render();
    }
  });
  document.addEventListener("change",(e)=>{
    if(["afStatus","afVerified","afVip"].includes(e.target.id)){
      state.adminFilters[e.target.id === "afStatus" ? "status" : e.target.id === "afVerified" ? "verified" : "vip"] = e.target.value;
      persistState();
      render();
    }
  });
}

function applyAccent(c){
  state.accent = c;
  document.documentElement.style.setProperty("--accent", c);
  persistState();
}

function toggleVIP(){
  state.currentUser.vip = !state.currentUser.vip;
  setCurrentUser(state.currentUser);
  showToast(state.currentUser.vip?"VIP":"Normal");
  render();
}

function doSwipe(id, type){
  if(!id) return;
  const u = state.users.find(x=>x.id===id);
  state.lastSwipe = { id, prevLiked: state.liked.has(id), prevPassed: state.passed.has(id) };
  if(type==="like"){ state.liked.add(id); state.passed.delete(id); showToast(`Liked ${u?.name||""}`); }
  else { state.passed.add(id); showToast(`Passed ${u?.name||""}`); }
  render();
}

function undoSwipe(){
  const last = state.lastSwipe;
  if(!last){ showToast("No action to undo"); return; }
  if(last.prevLiked) state.liked.add(last.id); else state.liked.delete(last.id);
  if(last.prevPassed) state.passed.add(last.id); else state.passed.delete(last.id);
  state.lastSwipe=null;
  render();
}

function copyBubble(){
  const ctxRaw = document.querySelector(".sheet")?.dataset.ctx;
  if(!ctxRaw) return;
  const ctx = JSON.parse(ctxRaw);
  const msg = (state.chats[ctx.userId]||[])[ctx.idx];
  if(msg?.text){
    navigator.clipboard?.writeText(msg.text).then(()=>showToast("Copied"));
  }
  closeSheet();
}

function deleteBubble(el){
  const ctxRaw = document.querySelector(".sheet")?.dataset.ctx;
  if(!ctxRaw) return;
  const ctx = JSON.parse(ctxRaw);
  const list = state.chats[ctx.userId] || [];
  list.splice(ctx.idx,1);
  showToast("Deleted");
  closeSheet();
  renderChatPage(ctx.userId);
}

function enterApp(){
  state.hasEntered = true;
  persistState();
  go("auth/login");
}

function toggleSim(){
  state.disableSimReplies = !state.disableSimReplies;
  persistState();
  render();
}

function toggleSplashNext(){
  state.showSplashNext = !state.showSplashNext;
  persistState();
  showToast(state.showSplashNext ? "Will show splash next launch" : "Skip splash next launch");
  render();
}

function logout(){
  state.currentUser = null;
  state.hasEntered = false;
  persistState();
  go("splash");
}

function setAccent(el){
  applyAccent(el.dataset.color);
  render();
}

function applyAdminFilters(){
  state.adminFilters = {
    query: document.getElementById("adminSearch")?.value || "",
    status: document.getElementById("afStatus")?.value || "all",
    verified: document.getElementById("afVerified")?.value || "all",
    vip: document.getElementById("afVip")?.value || "all",
  };
  persistState();
  render();
}

function openCoach(){ showToast("Coach sheet (demo)"); }
function openReport(){ showToast("Report (demo)"); }

const actions = {
  back(){ history.back(); },
  toggleVIP,
  enterApp,
  doLogin,
  doRegister,
  sendMsg(){}, // handled inline in chat page
  swipeLike:(el)=>doSwipe(el.dataset.id,"like"),
  swipePass:(el)=>doSwipe(el.dataset.id,"pass"),
  undoSwipe,
  copyBubble,
  deleteBubble,
  openCoach,
  openReport,
  applyAdminFilters,
  toggleSim,
  toggleSplashNext,
  logout,
  setAccent,
};

function attachSwipeables(){
  const cards = document.querySelectorAll(".swipe-card, .swipeable");
  cards.forEach(card=>{
    const id = card.dataset.id;
    let active = false, startX = 0, dx = 0;
    card.addEventListener("pointerdown", (e)=>{
      active = true; startX = e.clientX; dx = 0;
      card.setPointerCapture(e.pointerId);
      card.style.transition = "transform .1s ease";
    });
    card.addEventListener("pointermove", (e)=>{
      if(!active) return;
      dx = e.clientX - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx/40}deg)`;
      card.classList.toggle("gesture-like", dx > 60);
      card.classList.toggle("gesture-pass", dx < -60);
    });
    const end = ()=>{
      if(!active) return;
      active = false;
      card.style.transition = "";
      const liked = dx > 80;
      const passed = dx < -80;
      card.style.transform = "";
      card.classList.remove("gesture-like","gesture-pass");
      if(liked) doSwipe(id,"like");
      else if(passed) doSwipe(id,"pass");
    };
    ["pointerup","pointercancel","pointerleave"].forEach(ev=>card.addEventListener(ev, end));
  });
}

init();
