const defaultUser = {
  name: "Do",
  age: 26,
  district: "Central",
  bio: "想建立長期關係；重視尊重、節奏同承諾。",
  occupation: "Engineer",
  verified: true,
  vip: true,
};

export const state = {
  hasEntered: JSON.parse(localStorage.getItem("sifu_hasEntered") || "false"),
  disableSimReplies: JSON.parse(localStorage.getItem("sifu_disableSimReplies") || "false"),
  showSplashNext: JSON.parse(localStorage.getItem("sifu_showSplashNext") || "true"),
  language: localStorage.getItem("sifu_lang") || "zh-HK",
  accent: localStorage.getItem("sifu_accent") || "#f97316",
  currentUser: JSON.parse(localStorage.getItem("sifu_user") || "null"),
  users: [],
  chats: {},
  liked: new Set(),
  passed: new Set(),
  lastSwipe: null,
  typingTimers: {},
  adminFilters: JSON.parse(localStorage.getItem("sifu_adminFilters") || '{"query":"","status":"all","verified":"all","vip":"all"}'),
};

export function persistState(){
  localStorage.setItem("sifu_hasEntered", JSON.stringify(state.hasEntered));
  localStorage.setItem("sifu_disableSimReplies", JSON.stringify(state.disableSimReplies));
  localStorage.setItem("sifu_showSplashNext", JSON.stringify(state.showSplashNext));
  localStorage.setItem("sifu_lang", state.language);
  localStorage.setItem("sifu_accent", state.accent);
  localStorage.setItem("sifu_user", JSON.stringify(state.currentUser));
  localStorage.setItem("sifu_adminFilters", JSON.stringify(state.adminFilters));
}

export function ensureCurrentUser(){
  if(!state.currentUser){
    state.currentUser = {...defaultUser};
  }
}

export function setCurrentUser(u){
  state.currentUser = {...u};
  persistState();
}

export function setLanguage(lang){
  state.language = lang;
  persistState();
}
