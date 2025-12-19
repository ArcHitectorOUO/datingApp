// v7: production-style router, gestures, admin filters, coach flow
  document.documentElement.dataset.js = "on";

  // ---------- State ----------
  const state = {
    vip: true,
    adminMode: false,
    adminAuthed: false,
    adminPasscode: "8888",

    dailyMatches: 3,
    pausedMatching: false,
    hiddenProfile: true,
    verified: true,

    // matching filters
    filters: { verifiedOnly: false, vipOnly: false, district: "", ageMin: 20, ageMax: 35 },

    // navigation
    route: "home",
    stack: ["home"],

    // data
    me: { name: "Do", age: 26, district: "Tiong Bahru", bio: "想建立長期關係；重視尊重、節奏同承諾。", occupation: "Engineer" },
    accentColor: "#f97316",
    accentPresets: ["#f97316", "#0ea5e9", "#a855f7", "#22c55e", "#f43f5e"],

    users: [
      { id:"u1", name:"Alicia", age:27, district:"Central", verified:true, vip:false, bio:"喜歡慢跑、煮飯。想搵一個長期伴侶。", tags:["steady","family","fitness"], status:"active" },
      { id:"u2", name:"Carmen", age:29, district:"TST", verified:false, vip:true, bio:"藝術/設計。更重視溝通與價值觀。", tags:["art","deep talk"], status:"active" },
      { id:"u3", name:"Iris", age:25, district:"Causeway Bay", verified:true, vip:false, bio:"金融。週末鍾意行山同咖啡。", tags:["hiking","coffee"], status:"active" },
      { id:"u4", name:"Yuki", age:28, district:"Wan Chai", verified:false, vip:false, bio:"教育。想建立穩定家庭節奏。", tags:["teacher","calm"], status:"active" },
      { id:"u5", name:"Mina", age:30, district:"Sheung Wan", verified:true, vip:true, bio:"市場營銷。細水長流型。", tags:["marketing","steady"], status:"active" },
      { id:"u6", name:"Joyce", age:26, district:"Kowloon Tong", verified:true, vip:false, bio:"重視誠實、界線同安全感。", tags:["honest","boundaries"], status:"pending" }, // for admin approval demo
      { id:"u7", name:"Ken", age:24, district:"Tsuen Wan", verified:false, vip:false, bio:"新用戶（待審批示意）。", tags:["new"], status:"pending" },
      { id:"u8", name:"Spammer123", age:22, district:"Unknown", verified:false, vip:false, bio:"(flagged)", tags:["spam"], status:"banned" },
    ],

    liked: new Set(["u1"]),
    passed: new Set(),
    lastSwipe: null, // {id,type}
    notifications: [
      { id:"n1", title:"今日配對已更新", body:"你今日有 3 個新配對。", read:false },
      { id:"n2", title:"安全提示", body:"避免轉帳/分享敏感資料。", read:true },
    ],

    reports: [
      { id:"r1", cat:"Fake profile", who:"Carmen", status:"open", detail:"疑似假相片，要求轉帳。" },
      { id:"r2", cat:"Scam / Fraud", who:"Spammer123", status:"open", detail:"向多名用戶索取金錢。" },
    ],

    chats: {
      u1: [
        { who:"them", type:"text", text:"Hi 👋 我係 Alicia。今日嘅配對好自然～想慢慢了解你。", ts:"11:21" },
        { who:"me", type:"text", text:"我都係～我哋可以先喺度傾下，之後再決定要唔要轉 WhatsApp。", ts:"11:22" },
        { who:"them", type:"image", text:"Sunset photo", ts:"11:23" },
        { who:"me", type:"text", text:"好靚！👍", ts:"11:24" },
      ],
      u2: [
        { who:"them", type:"text", text:"你鍾意行山定海邊？", ts:"Yesterday" }
      ]
    },

    currentChat: null,
    matchDetailId: null,
    adminFocusUserId: null,
    reportDetailId: null,
    onboarding: {
      stage: "Reviewing",
      steps: [
        { id: "profile", label: "填寫個人檔案", status: "done" },
        { id: "kyc", label: "身份驗證（HKID）", status: "in-progress" },
        { id: "safety", label: "安全守則簽署", status: "todo" },
        { id: "payment", label: "付款 / VIP 選項", status: "todo" },
      ],
      notes: "團隊會在 24 小時內完成審核，期間保持電話暢通。",
    },
    adminFilters: { query:"", status:"all", verified:"all", vip:"all" },
    coach: { intent:"serious", tone:"sincere" },
    currentBubble: null,
  };

  // ---------- DOM ----------
  const phone = document.getElementById("phone");
  const content = document.getElementById("content");
  const nav = document.getElementById("nav");
  const tabs = [...document.querySelectorAll(".tab")];

  const modeChip = document.getElementById("modeChip");
  const modeText = document.getElementById("modeText");
  const retentionText = document.getElementById("retentionText");
  const toast = document.getElementById("toast");

  const overlay = document.getElementById("overlay");
  const sheet = document.getElementById("sheet");

  const chatroom = document.getElementById("chatroom");
  const backBtn = document.getElementById("backBtn");
  const attachBtn = document.getElementById("attachBtn");
  const voiceBtn = document.getElementById("voiceBtn");
  const coachBtn = document.getElementById("coachBtn");
  const sendBtn = document.getElementById("sendBtn");
  const msg = document.getElementById("msg");
  const thread = document.getElementById("thread");
  const chatTitle = document.getElementById("chatTitle");
  const chatSubtitle = document.getElementById("chatSubtitle");
  const chatRetentionBadge = document.getElementById("chatRetentionBadge");

  // ---------- Helpers ----------
  const icons = {
    spark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.6 6.2L20 10l-6.4 1.8L12 18l-1.6-6.2L4 10l6.4-1.8L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    shield:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3 20 7v6c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    lock:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    tick:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 7 10 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cog:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4z" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a8 8 0 0 0 .1-6l-2.2.3a6.2 6.2 0 0 0-1.5-1.5l.3-2.2a8 8 0 0 0-6-.1l.3 2.2a6.2 6.2 0 0 0-1.5 1.5L6.7 9a8 8 0 0 0-.1 6l2.2-.3a6.2 6.2 0 0 0 1.5 1.5l-.3 2.2a8 8 0 0 0 6 .1l-.3-2.2a6.2 6.2 0 0 0 1.5-1.5l2.2.3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    crown:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 9l4 3 4-6 4 6 4-3v10H4V9z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    bell:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    chevron:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    back:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6 9 12l6 6" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    alert:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 9v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M10.3 4.2a2 2 0 0 1 3.4 0l8 13.8a2 2 0 0 1-1.7 3H4a2 2 0 0 1-1.7-3l8-13.8z" stroke="currentColor" stroke-width="1.4"/></svg>`,
    image:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.8"/><path d="M8 11l3 3 5-5 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
    mic:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z" stroke="currentColor" stroke-width="2"/><path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  };

  function applyAccent(color){
    const c = color || state.accentColor || "#f97316";
    state.accentColor = c;
    document.documentElement.style.setProperty("--accent", c);
  }

  function hashFor(route, params={}){
    const parts = [route];
    if(params.id) parts.push(params.id);
    return "#/" + parts.join("/");
  }

  function parseHash(){
    const raw = (location.hash || "#/home").replace(/^#\/?/,"");
    const [route, id] = raw.split("/");
    return { route: route || "home", id: id || null };
  }

  function showToast(t){
    toast.textContent = t;
    toast.classList.add("on");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toast.classList.remove("on"), 1700);
  }

  function setVIP(v){
    state.vip = v;
    modeText.textContent = v ? "VIP" : "Normal";
    retentionText.textContent = v ? "1 month" : "3–7 days";
    modeChip.classList.toggle("off", !v);

    chatRetentionBadge.textContent = v ? "VIP retention: 1 month" : "Normal retention: 3–7 days";
    chatRetentionBadge.className = "badge " + (v ? "vip" : "");

    // voice button lock state
    if(v){
      voiceBtn.classList.remove("locked");
      voiceBtn.title = "Voice";
    }else{
      voiceBtn.classList.add("locked");
      voiceBtn.title = "Voice (VIP only)";
    }
    applyAccent();
  }

  function canGoBack(){ return window.history.length > 1; }

  function pageHead(title, subtitle, rightHtml=""){
    return `
      <div class="pagehead">
        <div class="left">
          ${canGoBack() ? `<button class="backbtn" type="button" data-action="back" title="Back">${icons.back}</button>` : ``}
          <div class="grow" style="min-width:0;">
            <h2>${title}</h2>
            ${subtitle ? `<div class="sub">${subtitle}</div>` : ``}
          </div>
        </div>
        <div class="right">${rightHtml || ""}</div>
      </div>
    `;
  }

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function getUser(id){ return state.users.find(u=>u.id===id); }

  function passFilters(u){
    if(u.status !== "active") return false;
    const f = state.filters;
    if(f.verifiedOnly && !u.verified) return false;
    if(f.vipOnly && !u.vip) return false;
    if(f.district && !u.district.toLowerCase().includes(f.district.toLowerCase())) return false;
    if(u.age < f.ageMin || u.age > f.ageMax) return false;
    return true;
  }

  function computeTodayMatches(){
    const pool = state.users.filter(passFilters).filter(u=>!state.passed.has(u.id));
    // stable pseudo-random: just take first N for demo
    return pool.slice(0, clamp(state.dailyMatches, 1, 10));
  }

  function doSwipe(id, type){
    if(!id) return;
    const u = getUser(id);
    state.lastSwipe = { id, type, prevLiked: state.liked.has(id), prevPassed: state.passed.has(id) };
    if(type === "like"){
      state.liked.add(id);
      state.passed.delete(id);
      showToast(`Liked ${u?.name || ""}`);
    }else{
      state.passed.add(id);
      showToast(`Passed ${u?.name || ""}`);
    }
    const {route, id: rid} = parseHash();
    renderRoute(route, {id:rid});
  }

  function retentionFor(type){
    if(type === "text") return null;
    if(state.vip) return "30 days";
    return "7 days";
  }

  // ---------- Overlay & Sheet ----------
  function openSheet(title, options){
    overlay.classList.add("on");
    sheet.classList.add("on");
    sheet.innerHTML = `
      <h3>${title}</h3>
      ${options.map(opt=>`
        <div class="opt" data-action="${opt.action}" ${opt.disabled ? 'data-toast="VIP only"' : ''}>
          <div style="display:flex; flex-direction:column;">
            <div class="t">${opt.icon || ""} ${opt.title}</div>
            <div class="s">${opt.sub || ""}</div>
          </div>
          <div class="r">${opt.disabled ? "🔒" : "›"}</div>
        </div>
      `).join("")}
      <div class="opt" data-action="closeSheet">
        <div style="display:flex; flex-direction:column;">
          <div class="t">Cancel</div>
          <div class="s">關閉</div>
        </div>
        <div class="r">×</div>
      </div>
    `;
  }
  function closeSheet(){
    overlay.classList.remove("on");
    sheet.classList.remove("on");
    sheet.innerHTML = "";
  }
  overlay.addEventListener("click", closeSheet);

  // ---------- Chatroom ----------
  function renderChatThread(userId){
    const u = getUser(userId);
    const msgs = state.chats[userId] || [];
    const tip = state.vip
      ? "文字訊息永久保留；圖片/語音最長保留 1 個月。請避免分享敏感資料。"
      : "文字訊息永久保留；圖片/語音一般保留 3–7 日。請避免分享敏感資料。";

    thread.innerHTML = `
      <div class="thread-banner" id="threadBanner">
        <div class="thread-title">Tips</div>
        <div class="thread-sub">${tip}</div>
      </div>
      <div class="day-divider"><span>Today</span></div>
      ${msgs.map((m,i)=>{
        const isMe = m.who === "me";
        if(m.type === "text"){
          return `<div class="bubble ${isMe ? "me":""}" data-idx="${i}" data-type="text" data-who="${m.who}" data-id="${userId}" data-text="${escapeAttr(m.text)}">
                    ${escapeHtml(m.text)}
                    <div class="tiny">${m.ts || ""}</div>
                  </div>`;
        }
        if(m.type === "image"){
          const exp = retentionFor("image");
          return `<div class="bubble ${isMe ? "me":""}" data-idx="${i}" data-type="image" data-who="${m.who}" data-id="${userId}" data-text="${escapeAttr(m.text || "Photo")}">
                    <div><b>[Image]</b> ${escapeHtml(m.text || "Photo")}</div>
                    <div class="tiny">Image expires in ${exp}</div>
                    <div class="tiny">${m.ts || ""}</div>
                  </div>`;
        }
        if(m.type === "audio"){
          const exp = retentionFor("audio");
          return `<div class="bubble ${isMe ? "me":""}" data-idx="${i}" data-type="audio" data-who="${m.who}" data-id="${userId}" data-text="Voice">
                    <div><b>[Voice]</b> 0:12 (demo)</div>
                    <div class="tiny">Audio expires in ${exp}</div>
                    <div class="tiny">${m.ts || ""}</div>
                  </div>`;
        }
        return "";
      }).join("")}
    `;
    setTimeout(()=>{ thread.scrollTop = thread.scrollHeight; }, 0);
    chatTitle.textContent = `${u.name} • (demo)`;
    chatSubtitle.innerHTML = `${u.district} • ${u.verified ? "Verified <span style='color:var(--ok)'>●</span>" : "Not verified"}`;
    thread.querySelectorAll(".bubble").forEach(b=>attachBubbleMenu(b, userId));
  }

  function openChat(userId){
    state.currentChat = userId;
    chatroom.classList.add("on");
    phone.classList.add("in-chat");
    nav.classList.add("hidden");
    renderChatThread(userId);
    showToast(`進入聊天室：${getUser(userId).name}`);
  }

  function closeChat(){
    chatroom.classList.remove("on");
    phone.classList.remove("in-chat");
    nav.classList.remove("hidden");
    state.currentChat = null;
    showToast("返回 Chat list");
  }

  backBtn.addEventListener("click", ()=>history.back());

  sendBtn.addEventListener("click", ()=>{
    const t = msg.value.trim();
    if(!t || !state.currentChat) return;
    state.chats[state.currentChat] = state.chats[state.currentChat] || [];
    state.chats[state.currentChat].push({ who:"me", type:"text", text:t, ts:"now" });
    msg.value = "";
    renderChatThread(state.currentChat);
  });

  msg.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      sendBtn.click();
    }
  });

  attachBtn.addEventListener("click", ()=>{
    if(!state.currentChat) return;
    openSheet("Attach", [
      { title:"Send Photo", sub:"Demo image bubble", action:"attachPhoto", icon:icons.image },
      { title:"Send Voice", sub:"VIP-only voice message", action:"attachVoice", icon:icons.mic, disabled: !state.vip },
      { title:"Send Sticker", sub:"Just for fun (demo)", action:"attachSticker", icon:icons.spark },
    ]);
  });

  voiceBtn.addEventListener("click", ()=>{
    if(!state.currentChat) return;
    if(!state.vip){ showToast("VIP only"); return; }
    actions.attachVoice();
  });

  function attachBubbleMenu(el, userId){
    let timer = null;
    const openMenu = (e)=>{
      e.preventDefault();
      const idx = parseInt(el.dataset.idx,10);
      const type = el.dataset.type;
      const who = el.dataset.who;
      state.currentBubble = { userId, idx, type, who };
      const opts = [];
      if(type === "text"){
        opts.push({ title:"Copy text", sub:"複製訊息", action:"copyBubble" });
      }else{
        opts.push({ title:"Save (demo)", sub:"保存媒體", action:"saveBubble" });
        opts.push({ title:"View retention", sub:"過期提醒", action:"viewRetention" });
      }
      if(who === "me") opts.push({ title:"Delete", sub:"只刪除自己訊息", action:"deleteBubble" });
      opts.push({ title:"Report", sub:"開啟舉報流程", action:"reportBubble" });
      openSheet("Message actions", opts);
    };
    const clear = ()=>{ if(timer){ clearTimeout(timer); timer=null; } };
    el.addEventListener("contextmenu", openMenu);
    el.addEventListener("pointerdown", (e)=>{ timer = setTimeout(()=>openMenu(e), 520); });
    ["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev, clear));
  }

  function coachPayload(){
    const key = `${state.coach.intent}-${state.coach.tone}`;
    const presets = {
      "serious-sincere": {
        suggestions: [
          "我想慢慢了解你，尤其係價值觀同日常節奏，可以分享下你理想嘅關係嗎？",
          "我欣賞你重視穩定，平日放工你最想點樣充電？",
          "我都想搵長期伴侶，你覺得相處入面最重要嘅底線係乜？"
        ],
        warning: "避免急於落定結論或問太多私隱（財務、地址）。"
      },
      "serious-funny": {
        suggestions: [
          "我哋都走慢熱路線，不如由『最 chill 嘅週末』開始講？",
          "想搵長期伴侶，但可以先由笑點同步開始：最近有冇睇到好笑嘅 meme？",
          "我覺得幽默感可以化解尷尬，你覺得拍拖入面幽默重要嗎？"
        ],
        warning: "幽默唔好變成自嘲太多，避免踩界。"
      },
      "serious-calm": {
        suggestions: [
          "我鍾意先聽對方嘅故事，有冇一段人際關係令你學到好深嘅嘢？",
          "慢慢傾，唔趕時間。如果有啲界線想講，可以話我知。",
          "我重視安全感，同理心對我好重要，你覺得呢？"
        ],
        warning: "避免過度審問式發問，保持對話節奏。"
      },
      "casual-sincere": {
        suggestions: [
          "我想先了解你平時最 enjoy 嘅活動，可能我哋可以一齊試。",
          "你覺得最放鬆嘅夜晚係點？我哋可以由呢度搵共通點。",
          "可以分享最近令你開心嘅小事嗎？"
        ],
        warning: "避免即刻要求見面／去私人地方。"
      },
      "casual-funny": {
        suggestions: [
          "想搵輕鬆 vibe，可以由『最無厘頭嘅興趣』開始講！",
          "如果要用一個表情符號形容今日心情，你會揀邊個？",
          "我有啲冷笑話，但想先確定你接受到 😂"
        ],
        warning: "幽默要顧及對方界線，避免冒犯題材。"
      },
      "casual-calm": {
        suggestions: [
          "我鍾意慢慢傾，唔急，想知你最近有冇咩小目標？",
          "如果有一個空白嘅星期日，你會點安排？",
          "可以先講講你最自在嘅社交場景，我都分享返。"
        ],
        warning: "避免突然消失；講清楚期待。"
      },
      "friend-first-sincere": {
        suggestions: [
          "我想先由朋友開始，了解下你嘅興趣同價值觀可以嗎？",
          "朋友模式：有冇一本書／podcast 令你印象深刻？",
          "我著重互相尊重同安全感，你覺得朋友之間嘅底線係乜？"
        ],
        warning: "避免用朋友名義但行為太親密，清晰界線。"
      },
      "friend-first-funny": {
        suggestions: [
          "朋友模式開啟！你嘅『尷尬又好笑』故事有冇？",
          "如果要組隊打怪，你會負責邊個角色？",
          "我哋可以由分享最奇怪嘅小習慣開始，公平交換 😆"
        ],
        warning: "保持尊重，玩笑唔好踩底線。"
      },
      "friend-first-calm": {
        suggestions: [
          "想先做朋友，傾下日常節奏同價值觀可以嗎？",
          "平時想要空間定陪伴？我哋可以講清楚彼此習慣。",
          "我欣賞慢節奏同尊重，你覺得朋友間最好嘅相處方式係點？"
        ],
        warning: "避免模糊訊號，坦白期望。"
      },
    };
    return presets[key] || presets["serious-sincere"];
  }

  function openCoachSheet(){
    const data = coachPayload();
    overlay.classList.add("on");
    sheet.classList.add("on");
    sheet.innerHTML = `
      <h3>Conversation Coach</h3>
      <div class="coach-grid">
        ${["serious","casual","friend-first"].map(k=>`
          <div class="coach-opt ${state.coach.intent===k ? "active":""}" data-action="coachSetIntent" data-value="${k}">
            <div style="font-weight:850;text-transform:capitalize;">${k.replace("-"," ")}</div>
            <div class="s">Intent</div>
          </div>
        `).join("")}
      </div>
      <div class="coach-grid">
        ${["sincere","funny","calm"].map(k=>`
          <div class="coach-opt ${state.coach.tone===k ? "active":""}" data-action="coachSetTone" data-value="${k}">
            <div style="font-weight:850;text-transform:capitalize;">${k}</div>
            <div class="s">Tone</div>
          </div>
        `).join("")}
      </div>
      <div class="coach-suggestions">
        ${data.suggestions.map(s=>`<button class="btn" type="button" data-action="coachUse" data-text="${escapeAttr(s)}">${escapeHtml(s)}</button>`).join("")}
      </div>
      <div class="coach-warning">⚠️ ${escapeHtml(data.warning)}</div>
      <div class="divider"></div>
      <button class="btn ghost" type="button" data-action="closeSheet">Close</button>
    `;
  }

  // ---------- Screens ----------
  function storyRail(){
    return `
      <div class="story-rail" aria-label="Stories">
        ${state.users.slice(0,6).map(u=>`
          <div class="story" title="${escapeHtml(u.name)}">
            <div class="ring">
              <div class="inner">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12zm7.6 9.5a9.4 9.4 0 0 0-15.2 0" stroke="rgba(255,255,255,0.85)" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
            </div>
            <div class="name">${escapeHtml(u.name)}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function swipeDeck(){
    const cards = computeTodayMatches().slice(0,3);
    return `
      <div class="swipe-undo"><button class="btn ghost" type="button" data-action="undoSwipe">Undo swipe</button></div>
      <div class="swipe-deck">
        ${cards.map((u,i)=>`
          <div class="swipe-card" style="z-index:${cards.length-i};">
            <div class="row" style="gap:10px;">
              <div class="avatar" style="width:60px;height:60px;border-radius:20px;"></div>
              <div class="grow">
                <div style="font-size:18px;font-weight:950;">${escapeHtml(u.name)} • ${u.age}</div>
                <div class="meta">${escapeHtml(u.district)} • ${u.verified ? "Verified" : "未認證"}</div>
                <div class="tags">
                  ${u.vip ? `<span class="badge vip">${icons.crown} VIP</span>` : ``}
                  <span class="badge">${icons.shield} 安全指引</span>
                  <span class="badge">${icons.spark} 慢熱</span>
                </div>
              </div>
            </div>
            <div class="hint">${escapeHtml(u.bio)}</div>
            <div class="swipe-actions">
              <button class="swipe-btn danger" type="button" data-toast="Noped（示意）">✕ Nope</button>
              <button class="swipe-btn primary" type="button" data-action="openChat" data-id="${u.id}">❤ Like & Chat</button>
              <button class="swipe-btn alt" type="button" data-toast="Super Like（示意）">★ Super</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function hero(){
    return `
      <div class="hero">
        <div class="row" style="align-items:flex-start;">
          <div class="grow">
            <div class="pill">Balanced • 五行 • 留白</div>
            <h2 class="h2">今日 ${state.dailyMatches} 個配對（慢慢了解）</h2>
            <p class="p">Chat 進聊天室後會隱藏底部 nav，畫面更乾淨；所有按鈕都有互動（toast/跳頁/改狀態）。</p>
          </div>
          <div class="badge ${state.vip ? "vip":""}">
            ${state.vip ? icons.crown : icons.spark}
            ${state.vip ? "VIP" : "Normal"}
          </div>
        </div>
        <div class="divider"></div>
        <button class="btn primary" type="button" data-go="match">查看今日配對</button>
        <div class="waterline"></div>
      </div>
    `;
  }

  function screenHome(){
    const unread = state.notifications.filter(n=>!n.read).length;
    const right = `
      <button class="mini" type="button" data-go="notifications" title="Notifications">
        ${icons.bell} ${unread ? `<span class="badge ok" style="padding:2px 6px; font-size:11px;">${unread}</span>` : ``}
      </button>
    `;
    return `
      ${pageHead("Home", "風水感：平衡、對稱、沉穩", right)}
      ${hero()}

      <div class="section-title">Stories • Explore (Instagram 風格)</div>
      <div class="card">
        ${storyRail()}
        <div class="divider"></div>
        <p class="p">小紅圈＝新故事，保留 IG 熟悉感，快速睇到生活面。</p>
      </div>

      <div class="section-title">Quick Actions</div>
      <div class="grid2">
        <button class="btn" type="button" data-go="likes">Liked List</button>
        <button class="btn" type="button" data-go="safety">Safety Center</button>
        <button class="btn ghost" type="button" data-go="onboarding">新用戶申請流程</button>
      </div>

      <div class="section-title">Swipe Deck（Tinder 風格）</div>
      ${swipeDeck()}

      <div class="card">
        <div class="row">
          <div class="badge" style="border-color: rgba(197,167,106,0.55); background: rgba(197,167,106,0.14);">${icons.shield} Admin / Cifu</div>
          <div class="grow"></div>
          <button class="chip admin ${state.adminMode ? "" : "off"}" type="button" data-action="adminEntry">
            <span class="dot"></span><span>${state.adminMode ? "Admin" : "User"}</span><small>mode</small>
          </button>
        </div>
        <p class="p" style="margin-top:10px;">Admin 入口有 Passcode gate（demo：${state.adminPasscode}）。</p>
        <button class="btn" type="button" data-action="adminEntry">${state.adminMode ? "Go Admin Dashboard" : "Admin Login"}</button>
      </div>

      <div class="card">
        <div class="row">
          <div class="badge">${icons.spark} Feng Shui Touch</div>
          <div class="grow"></div>
          <div class="pill">木 • 火 • 土 • 金 • 水</div>
        </div>
        <p class="p" style="margin-top:10px;">保持「乾淨分區」：卡片、列表、聊天室分層，避免資訊互相穿透造成混亂。</p>
        <div class="divider"></div>
        <button class="btn" type="button" data-go="faq">Help / FAQ</button>
      </div>
    `;
  }

  function matchCard(u){
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
              ${u.verified ? `<span class="badge ok">${icons.tick} Verified</span>` : `<span class="badge">Not verified</span>`}
              ${u.vip ? `<span class="badge vip">${icons.crown} VIP</span>` : ``}
              <span class="badge">五行：水/金（demo）</span>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="iconbtn like" type="button" data-action="swipeLike" data-id="${u.id}">${icons.spark} ${liked ? "Liked" : "Like"}</button>
          <button class="iconbtn chat" type="button" data-action="openChat" data-id="${u.id}">${icons.shield} Chat</button>
          <button class="iconbtn ghost" type="button" data-action="swipePass" data-id="${u.id}">✕ Pass</button>
        </div>
        <div class="grid2" style="margin-top:10px;">
          <button class="btn" type="button" data-action="openMatchDetail" data-id="${u.id}">View Profile</button>
          <button class="btn ghost" type="button" data-toast="示意：Request counsellor guidance">Ask Cifu</button>
        </div>
      </div>
    `;
  }

  function screenMatch(){
    const picks = computeTodayMatches();
    const activeFilterCount = ["verifiedOnly","vipOnly","district"].filter(k=>{
      const v = state.filters[k];
      return (typeof v === "boolean") ? v : !!v;
    }).length + ((state.filters.ageMin !== 20 || state.filters.ageMax !== 35) ? 1 : 0);

    const right = `
      <button class="mini" type="button" data-go="match_filters">${icons.cog} Filters ${activeFilterCount ? `<span class="badge ok" style="padding:2px 6px; font-size:11px;">${activeFilterCount}</span>`:""}</button>
    `;
    return `
      ${pageHead("Matching", `Today picks: ${picks.length} (Admin 可改)`, right)}
      <div class="swipe-undo"><button class="btn ghost" type="button" data-action="undoSwipe">Undo swipe</button></div>
      ${picks.length ? picks.map(matchCard).join("") : `
        <div class="card">
          <h2 class="h2">No matches</h2>
          <p class="p">可能 filters 太嚴格。試下放寬條件。</p>
          <button class="btn" type="button" data-go="match_filters">Adjust Filters</button>
        </div>
      `}
    `;
  }

  function screenMatchFilters(){
    const f = state.filters;
    const seg = (on, actionOn, actionOff) => `
      <div class="seg">
        <button class="${on ? "on":""}" type="button" data-action="${actionOn}">ON</button>
        <button class="${!on ? "on":""}" type="button" data-action="${actionOff}">OFF</button>
      </div>
    `;
    return `
      ${pageHead("Filters", "更清晰嘅配對池", "")}
      <div class="card">
        <div class="row">
          <div class="grow">
            <div style="font-weight:900;">Verified only</div>
            <div class="meta">只顯示已驗證用戶</div>
          </div>
          ${seg(f.verifiedOnly, "f_verified_on", "f_verified_off")}
        </div>

        <div class="divider"></div>

        <div class="row">
          <div class="grow">
            <div style="font-weight:900;">VIP only</div>
            <div class="meta">只顯示 VIP（demo）</div>
          </div>
          ${seg(f.vipOnly, "f_vip_on", "f_vip_off")}
        </div>

        <div class="divider"></div>

        <div class="field">
          <label>District keyword</label>
          <input id="fDistrict" placeholder="e.g. Central" value="${escapeAttr(f.district)}" />
        </div>

        <div class="grid2">
          <div class="field"><label>Age min</label><input id="fMin" type="number" value="${f.ageMin}" min="18" max="60" /></div>
          <div class="field"><label>Age max</label><input id="fMax" type="number" value="${f.ageMax}" min="18" max="60" /></div>
        </div>

        <div class="divider"></div>
        <div class="grid2">
          <button class="btn primary" type="button" data-action="applyFilters">Apply</button>
          <button class="btn" type="button" data-action="resetFilters">Reset</button>
        </div>
      </div>
    `;
  }

  function screenMatchDetail(opts={}){
    if(opts.id) state.matchDetailId = opts.id;
    const u = getUser(state.matchDetailId);
    if(!u) return `${pageHead("Profile", "", "")}<div class="card"><p class="p">Not found</p></div>`;
    return `
      ${pageHead(`${u.name} • ${u.age}`, `${u.district} • ${u.verified ? "Verified" : "Not verified"}`, `
        <button class="mini" type="button" data-action="openChat" data-id="${u.id}">${icons.shield} Chat</button>
      `)}
      <div class="card">
        <div class="row">
          <span class="badge">${icons.spark} Compatibility</span>
          <div class="grow"></div>
          <span class="pill">水/金：穩定（demo）</span>
        </div>
        <div class="divider"></div>
        <p class="p" style="margin:0;">${escapeHtml(u.bio)}</p>
        <div class="divider"></div>
        <div class="row" style="flex-wrap:wrap;">
          ${(u.tags||[]).map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>

      <div class="grid2">
        <button class="btn ${state.liked.has(u.id) ? "metal":""}" type="button" data-action="toggleLike" data-id="${u.id}">
          ${icons.spark} ${state.liked.has(u.id) ? "Unlike" : "Like"}
        </button>
        <button class="btn" type="button" data-toast="示意：Share profile">Share</button>
      </div>

      <div class="card">
        <h2 class="h2">Boundaries & Safety</h2>
        <p class="p">建議：先喺 app 內傾熟先，再考慮轉 WhatsApp。</p>
        <div class="divider"></div>
        <button class="btn" type="button" data-action="openReportFromDetail">Report / Block</button>
      </div>
    `;
  }

  function screenLikes(){
    const ids = [...state.liked];
    return `
      ${pageHead("Liked List", `${ids.length} people`, "")}
      <div class="list">
        ${ids.length ? ids.map(id=>{
          const u = getUser(id);
          return `
            <div class="rowitem" data-action="openMatchDetail" data-id="${u.id}">
              <div class="avatar" aria-hidden="true"></div>
              <div class="grow">
                <div class="title">${u.name} • ${u.age}</div>
                <div class="desc">${u.district} • ${u.verified ? "Verified" : "Not verified"}</div>
              </div>
              <div class="chev">${icons.chevron}</div>
            </div>
          `;
        }).join("") : `<div class="card"><p class="p">No likes yet. Go Matching and press Like.</p><button class="btn" type="button" data-go="match">Go Matching</button></div>`}
      </div>
    `;
  }

  function screenChat(){
    const items = Object.keys(state.chats).map(id=>{
      const u = getUser(id);
      const msgs = state.chats[id] || [];
      const last = msgs[msgs.length-1];
      const lastText = last ? (last.type === "text" ? last.text : last.type === "image" ? "[Image]" : "[Voice]") : "";
      return { u, lastText };
    }).filter(x=>x.u && x.u.status !== "banned");
    return `
      ${pageHead("Chat", "進入聊天室後會隱藏底部 nav（乾淨）", "")}
      <div class="card">
        <div class="row">
          <div class="badge ${state.vip ? "vip":""}">${state.vip ? icons.crown : icons.spark} Retention</div>
          <div class="grow"></div>
          <div class="pill">${state.vip ? "Images/Audio: up to 1 month" : "Images/Audio: 3–7 days"}</div>
        </div>
        <p class="p" style="margin-top:10px;">圖片/語音到期提示會顯示喺 bubble 內。文字永久保留。</p>
      </div>

      <div class="chatlist" style="margin-top:12px;">
        ${items.map(x=>`
          <div class="item" data-action="openChat" data-id="${x.u.id}">
            <div class="avatar" aria-hidden="true"></div>
            <div class="grow">
              <div style="font-weight:900;">${x.u.name}</div>
              <div class="meta">${escapeHtml(x.lastText)}</div>
            </div>
            <div class="right">
              <div>${x.u.id === "u1" ? "11:24" : "Yesterday"}</div>
              <div style="color:${x.u.verified ? "var(--ok)" : "var(--muted2)"};">${x.u.verified ? "● Verified" : "○"}</div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="divider"></div>
      <button class="btn" type="button" data-toast="示意：New chat is created by matching">How chats are created?</button>
    `;
  }

  function screenNotifications(){
    const unread = state.notifications.filter(n=>!n.read).length;
    return `
      ${pageHead("Notifications", `${unread} unread`, `<button class="mini" type="button" data-action="markAllRead">Mark all read</button>`)}
      <div class="list">
        ${state.notifications.map(n=>`
          <div class="rowitem" data-action="openNotification" data-id="${n.id}">
            <div class="badge ${n.read ? "" : "ok"}">${icons.bell} ${n.read ? "Read" : "New"}</div>
            <div class="grow">
              <div class="title">${escapeHtml(n.title)}</div>
              <div class="desc">${escapeHtml(n.body)}</div>
            </div>
            <div class="chev">${icons.chevron}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function screenSafety(){
    return `
      ${pageHead("Safety Center", "防騙/界線/舉報", "")}
      <div class="card">
        <div class="row">
          <div class="badge">${icons.alert} Anti-scam</div>
          <div class="grow"></div>
          <div class="pill">Stay safe</div>
        </div>
        <ul style="margin:10px 0 0; padding-left: 18px; color: var(--muted); line-height: 1.6; font-size:13px;">
          <li>避免轉帳、投資、借錢要求</li>
          <li>避免即刻轉去外部平台</li>
          <li>有可疑立即 Report</li>
        </ul>
        <div class="divider"></div>
        <button class="btn" type="button" data-go="report">Report an issue</button>
      </div>

      <div class="card">
        <h2 class="h2">Block list (demo)</h2>
        <p class="p">目前：0</p>
        <button class="btn" type="button" data-toast="示意：No blocked users">View</button>
      </div>
    `;
  }

  function screenFAQ(){
    return `
      ${pageHead("Help / FAQ", "常見問題", "")}
      <div class="list">
        <div class="rowitem" data-toast="配對每日預設 3 個，可由 Admin 設定。">
          <div class="badge">${icons.spark}</div>
          <div class="grow"><div class="title">Why only 3 matches per day?</div><div class="desc">Slow dating style（示意）</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>
        <div class="rowitem" data-toast="Chat 進聊天室後會隱藏列表/底部 nav，避免混亂。">
          <div class="badge">${icons.shield}</div>
          <div class="grow"><div class="title">Why chat looks like full screen?</div><div class="desc">Focus mode</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>
        <div class="rowitem" data-go="legal_terms">
          <div class="badge">${icons.lock}</div>
          <div class="grow"><div class="title">Terms</div><div class="desc">Legal (demo)</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>
        <div class="rowitem" data-go="legal_privacy">
          <div class="badge">${icons.lock}</div>
          <div class="grow"><div class="title">Privacy</div><div class="desc">Legal (demo)</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>
      </div>
    `;
  }

  function legalPage(kind){
    const title = kind === "terms" ? "Terms" : "Privacy Policy";
    return `
      ${pageHead(title, "Demo legal text", "")}
      <div class="card">
        <h2 class="h2">${title}</h2>
        <p class="p">（示意）本文件為 prototype 文字，後續可換成正式條款。</p>
        <div class="divider"></div>
        <p class="p">1) 資料用途：配對/安全/客服。</p>
        <p class="p">2) Retention：文字永久；圖片/語音按會員到期。</p>
        <p class="p">3) 舉報/封禁：對詐騙零容忍。</p>
      </div>
    `;
  }

  function screenOnboarding(){
    const stage = state.onboarding.stage;
    const badgeCls = stage === "Approved" ? "ok" : stage === "Reviewing" ? "" : "vip";
    return `
      ${pageHead("新用戶申請流程", "表單 + KYC + 付款（示意）", "")}

      <div class="card">
        <div class="row" style="align-items:center;">
          <div class="badge ${badgeCls}">${icons.shield} ${escapeHtml(stage)}</div>
          <div class="grow"></div>
          <button class="mini" type="button" data-action="resetOnboarding">重設示意</button>
        </div>
        <p class="p" style="margin-top:10px;">${escapeHtml(state.onboarding.notes)}</p>
        <div class="divider"></div>
        <div class="list">
          ${state.onboarding.steps.map(step=>`
            <div class="rowitem" data-action="completeStep" data-id="${step.id}">
              <div class="badge">${icons.spark}</div>
              <div class="grow">
                <div class="title">${escapeHtml(step.label)}</div>
                <div class="desc">${step.status === "done" ? "已完成" : step.status === "in-progress" ? "進行中" : "待填寫"}</div>
              </div>
              <div class="chev">${step.status === "done" ? icons.tick : icons.chevron}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <h3>提示</h3>
        <p class="p">流程：提交個人檔案 → 上傳身份證 → 填安全問卷 → 選擇 VIP / 付款。每一步都有狀態。</p>
        <div class="grid2" style="margin-top:12px;">
          <button class="btn primary" type="button" data-toast="示意：上傳身份證">上傳文件</button>
          <button class="btn ghost" type="button" data-toast="示意：預約視像面談">預約面談</button>
        </div>
      </div>
    `;
  }

  function screenProfile(){
    const lockBadge = `<span class="badge lock" title="VIP only">${icons.lock} VIP</span>`;
    return `
      ${pageHead("Profile", "Settings 放入 Profile tab（更少 tab）", "")}

      <div class="card">
        <div class="row" style="align-items:flex-start;">
          <div class="avatar" aria-hidden="true" style="width:54px;height:54px;border-radius:20px;"></div>
          <div class="grow">
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <div style="font-size:16px; font-weight:950;">${escapeHtml(state.me.name)} • ${state.me.age}</div>
              ${state.vip ? `<span class="badge vip">${icons.crown} VIP</span>` : `<span class="badge">${icons.spark} Normal</span>`}
              ${state.verified ? `<span class="badge ok">${icons.tick} Verified</span>` : `<span class="badge">Not verified</span>`}
            </div>
            <div class="meta" style="margin-top:6px;">${escapeHtml(state.me.district)} • ${escapeHtml(state.me.occupation)}</div>
            <div class="hint">${escapeHtml(state.me.bio)}</div>
          </div>
        </div>

        <div class="divider"></div>
        <div class="grid2">
          <button class="btn" type="button" data-go="edit_profile">${icons.cog} Edit Profile</button>
          <button class="btn" type="button" data-go="photos">${icons.image} Photos</button>
        </div>
      </div>

      <div class="section-title">Settings</div>

      <div class="card">
        <div class="row">
          <div class="grow">
            <div style="font-weight:900;">Pause Matching</div>
            <div class="meta">暫停配對：不會喺 matching pool 出現</div>
          </div>
          <button class="chip ${state.pausedMatching ? "" : "off"}" type="button" data-action="togglePause">
            <span class="dot"></span><span>${state.pausedMatching ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="row">
          <div class="grow">
            <div style="font-weight:900;">Hide Profile (VIP) ${!state.vip ? lockBadge : ""}</div>
            <div class="meta">Not visible to public, only visible to Cifu</div>
          </div>
          <button class="chip ${state.hiddenProfile ? "" : "off"}" type="button" ${state.vip ? 'data-action="toggleHidden"' : 'data-toast="VIP only"'}>
            <span class="dot"></span><span>${state.hiddenProfile ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="row" style="align-items:flex-start; gap:12px;">
          <div class="grow">
            <div style="font-weight:900;">VIP 主題色（自定義）</div>
            <div class="meta">取材 IG / Tinder 的高飽和漸層；VIP 才可套用</div>
            <div class="accent-row" style="margin-top:12px;">
              ${state.accentPresets.map(c=>`
                <button class="accent-chip ${state.accentColor===c ? "active":""}" type="button" data-action="setAccent" data-color="${c}" style="--accent:${c};">
                  <span class="glow"></span>
                </button>
              `).join("")}
            </div>
            <div class="divider"></div>
            <button class="btn ghost" type="button" data-action="openCoach">${icons.spark} Start with Coach</button>
          </div>
          <div class="badge vip">${icons.crown}</div>
        </div>
      </div>

      <div class="list" style="margin-top:10px;">
        <div class="rowitem" data-go="verification">
          <div class="badge">${icons.shield}</div>
          <div class="grow"><div class="title">Verification</div><div class="desc">KYC / HKID（demo）</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>

        <div class="rowitem" data-go="notifications">
          <div class="badge">${icons.bell}</div>
          <div class="grow"><div class="title">Notifications</div><div class="desc">Inbox</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>

        <div class="rowitem" data-go="vip">
          <div class="badge vip">${icons.crown}</div>
          <div class="grow"><div class="title">VIP & Billing</div><div class="desc">${state.vip ? "Manage VIP" : "Upgrade"}</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>

        <div class="rowitem" data-go="credits">
          <div class="badge">${icons.spark}</div>
          <div class="grow"><div class="title">Credits</div><div class="desc">Per-question credits (demo)</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>

        <div class="rowitem" data-go="safety">
          <div class="badge">${icons.alert}</div>
          <div class="grow"><div class="title">Safety Center</div><div class="desc">Report / Block</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>

        <div class="rowitem" data-go="faq">
          <div class="badge">${icons.cog}</div>
          <div class="grow"><div class="title">Help / FAQ</div><div class="desc">Support</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>

        <div class="rowitem" data-toast="示意：Logout">
          <div class="badge">${icons.lock}</div>
          <div class="grow"><div class="title">Logout</div><div class="desc">End session</div></div>
          <div class="chev">${icons.chevron}</div>
        </div>
      </div>
    `;
  }

  function screenEditProfile(){
    const right = `<button class="mini" type="button" data-action="saveProfile">Save</button>`;
    return `
      ${pageHead("Edit Profile", "所有欄位都可互動（示意）", right)}
      <div class="card">
        <div class="field"><label>Name</label><input id="pName" value="${escapeAttr(state.me.name)}" /></div>
        <div class="grid2">
          <div class="field"><label>Age</label><input id="pAge" type="number" min="18" max="60" value="${state.me.age}" /></div>
          <div class="field"><label>District</label><input id="pDistrict" value="${escapeAttr(state.me.district)}" /></div>
        </div>
        <div class="field"><label>Occupation</label><input id="pOcc" value="${escapeAttr(state.me.occupation)}" /></div>
        <div class="field"><label>Bio</label><textarea id="pBio">${escapeHtml(state.me.bio)}</textarea></div>
        <div class="divider"></div>
        <button class="btn primary" type="button" data-action="saveProfile">Save Changes</button>
      </div>
    `;
  }

  function screenPhotos(){
    const max = 10;
    const count = state.me.photos ? state.me.photos.length : 3;
    // demo placeholders
    return `
      ${pageHead("Photos", `${count}/${max} (demo)`, `<button class="mini" type="button" data-action="addPhoto">${icons.image} Add</button>`)}
      <div class="card">
        <div class="photo-grid">
          ${Array.from({length:9}).map((_,i)=>`
            <div class="ph" data-action="viewPhoto" data-id="${i}">
              <div style="color:var(--muted); font-weight:900;">Photo ${i+1}</div>
              <div class="x" data-action="removePhoto" data-id="${i}" title="Remove">×</div>
            </div>
          `).join("")}
        </div>
        <div class="hint">示意：點 Photo 會彈 toast；Add/Remove 有互動。</div>
      </div>
    `;
  }

  function screenVerification(){
    return `
      ${pageHead("Verification", "KYC / HKID（demo flow）", "")}
      <div class="card">
        <div class="row">
          <div class="badge ${state.verified ? "ok":""}">${icons.shield} Status</div>
          <div class="grow"></div>
          <div class="pill">${state.verified ? "Verified" : "Not verified"}</div>
        </div>
        <div class="divider"></div>
        <div class="list">
          <div class="rowitem" data-toast="Step 1: Upload HKID (demo)">
            <div class="badge">${icons.image}</div>
            <div class="grow"><div class="title">Upload HKID</div><div class="desc">Front + Back</div></div>
            <div class="chev">${icons.chevron}</div>
          </div>
          <div class="rowitem" data-toast="Step 2: Selfie verification (demo)">
            <div class="badge">${icons.spark}</div>
            <div class="grow"><div class="title">Selfie Check</div><div class="desc">Liveness</div></div>
            <div class="chev">${icons.chevron}</div>
          </div>
          <div class="rowitem" data-action="toggleVerified">
            <div class="badge ok">${icons.tick}</div>
            <div class="grow"><div class="title">Toggle Verified (demo)</div><div class="desc">For prototype testing</div></div>
            <div class="chev">${icons.chevron}</div>
          </div>
        </div>
      </div>
    `;
  }

  function screenVIP(){
    return `
      ${pageHead("VIP & Billing", state.vip ? "Manage VIP" : "Upgrade", "")}
      <div class="card">
        <div class="row">
          <div class="badge vip">${icons.crown} VIP</div>
          <div class="grow"></div>
          <div class="pill">${state.vip ? "Active" : "Not active"}</div>
        </div>
        <p class="p" style="margin-top:10px;">VIP：更多配對、語音、優先回覆、Hide profile、延長圖片/語音保留期（最多 1 個月）。</p>
        <div class="divider"></div>
        <div class="col">
          <div class="badge vip">${icons.spark} More matching quota</div>
          <div class="badge vip">${icons.mic} Voice message</div>
          <div class="badge lock">${icons.lock} Hide profile</div>
          <div class="badge vip">${icons.cog} Extended retention</div>
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn metal" type="button" data-action="buyVIP">${state.vip ? "Manage VIP (demo)" : "Monthly HKD 300 (demo)"}</button>
          <button class="btn" type="button" data-action="toggleVIP">${state.vip ? "Switch to Normal" : "Switch to VIP"}</button>
        </div>
      </div>
    `;
  }

  function screenCredits(){
    return `
      ${pageHead("Credits", "Per-question credits (demo)", "")}
      <div class="card">
        <div class="kpi">
          <div class="box"><div class="k">Current credits</div><div class="v">12</div></div>
          <div class="box"><div class="k">Used this month</div><div class="v">3</div></div>
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn" type="button" data-toast="Bought 10 credits (demo)">Buy 10</button>
          <button class="btn" type="button" data-toast="Bought 50 credits (demo)">Buy 50</button>
        </div>
        <div class="hint">示意：credits 可以用嚟問 Cifu 問題。</div>
      </div>
    `;
  }

  function screenReport(){
    return `
      ${pageHead("Report", "舉報/問題回報", "")}
      <div class="card">
        <h2 class="h2">Report scammers / issues</h2>
        <p class="p">只可登入後提交；Admin 後台可處理（demo）。</p>
        <div class="field">
          <label>Category</label>
          <select id="repCat">
            <option>Scam / Fraud</option>
            <option>Harassment</option>
            <option>Fake profile</option>
            <option>Other</option>
          </select>
        </div>
        <div class="field">
          <label>Details</label>
          <textarea id="repDetail" placeholder="請描述發生咩事…"></textarea>
        </div>
        <div class="divider"></div>
        <button class="btn primary" type="button" data-action="submitReport">Submit Report</button>
      </div>
    `;
  }

  // ---------- Admin Screens ----------
  function screenAdminGate(){
    return `
      ${pageHead("Admin Login", "Enter passcode to continue", "")}
      <div class="card">
        <div class="field">
          <label>Passcode (demo)</label>
          <input id="adminCode" placeholder="e.g. 8888" />
          <div class="hint">提示：Demo passcode = ${state.adminPasscode}</div>
        </div>
        <div class="divider"></div>
        <button class="btn primary" type="button" data-action="adminLogin">Login</button>
        <button class="btn" type="button" data-action="adminLogout">Cancel</button>
      </div>
    `;
  }

  function screenAdmin(){
    const pending = state.users.filter(u=>u.status==="pending").length;
    const openReports = state.reports.filter(r=>r.status==="open").length;
    return `
      ${pageHead("Admin Dashboard", "Cifu operations", `<button class="mini" type="button" data-action="adminLogout">Logout</button>`)}
      <div class="card">
        <div class="kpi">
          <div class="box"><div class="k">Pending approvals</div><div class="v">${pending}</div></div>
          <div class="box"><div class="k">Open reports</div><div class="v">${openReports}</div></div>
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn" type="button" data-go="admin_approval">Approval Queue</button>
          <button class="btn" type="button" data-go="admin_users">User Management</button>
          <button class="btn" type="button" data-go="admin_match">Manual Matching</button>
          <button class="btn" type="button" data-go="admin_reports">Reports</button>
          <button class="btn" type="button" data-go="admin_monitor">Monitoring</button>
          <button class="btn" type="button" data-go="admin_config">System Config</button>
          <button class="btn" type="button" data-go="admin_audit">Audit Log</button>
          <button class="btn ghost" type="button" data-action="adminLogout">Back to user</button>
        </div>
      </div>
    `;
  }

  function screenAdminApproval(){
    const pend = state.users.filter(u=>u.status==="pending");
    return `
      ${pageHead("Approval Queue", `${pend.length} pending`, "")}
      <div class="list">
        ${pend.map(u=>`
          <div class="rowitem" data-action="adminOpenUser" data-id="${u.id}">
            <div class="badge">${icons.shield}</div>
            <div class="grow"><div class="title">${u.name} • ${u.age}</div><div class="desc">KYC submitted • district: ${u.district}</div></div>
            <div class="chev">${icons.chevron}</div>
          </div>
        `).join("")}
        ${pend.length ? "" : `<div class="card"><p class="p">No pending users.</p></div>`}
      </div>
    `;
  }

  function screenAdminUserDetail(){
    const u = getUser(state.adminFocusUserId);
    if(!u) return `${pageHead("User", "", "")}<div class="card"><p class="p">Not found</p></div>`;
    return `
      ${pageHead("User Detail", `${u.name} • ${u.status}`, "")}
      <div class="card">
        <div class="row">
          <div class="badge">${icons.shield} KYC</div>
          <div class="grow"></div>
          <div class="pill">${u.verified ? "Verified" : "Not verified"}</div>
        </div>
        <div class="divider"></div>
        <p class="p"><b>Bio:</b> ${escapeHtml(u.bio)}</p>
        <p class="p"><b>Tags:</b> ${(u.tags||[]).map(t=>escapeHtml(t)).join(", ")}</p>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn primary" type="button" data-action="adminApprove" data-id="${u.id}">Approve</button>
          <button class="btn" type="button" data-action="adminReject" data-id="${u.id}">Reject</button>
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn" type="button" data-action="adminBan" data-id="${u.id}">Ban</button>
          <button class="btn" type="button" data-toast="示意：Edit user profile">Edit</button>
        </div>
      </div>
    `;
  }

  function screenAdminUsers(){
    const {query,status,verified,vip} = state.adminFilters;
    const norm = (query||"").toLowerCase();
    const list = state.users
      .filter(u=>{
        if(status!=="all" && u.status !== status) return false;
        if(verified==="verified" && !u.verified) return false;
        if(verified==="not" && u.verified) return false;
        if(vip==="vip" && !u.vip) return false;
        if(vip==="non" && u.vip) return false;
        if(norm && !`${u.name} ${u.district}`.toLowerCase().includes(norm)) return false;
        return true;
      });
    return `
      ${pageHead("User Management", `${list.length} users`, `<button class=\\"mini\\" type=\\"button\\" data-action=\\"resetAdminFilters\\">Reset</button>`)}
      <div class="card">
        <div class="field"><label>Search</label><input id="adminSearch" placeholder="Name keyword…" value="${escapeAttr(state.adminFilters.query)}" /></div>
        <div class="grid2" style="margin-top:10px;">
          <div class="field"><label>Status</label>
            <select id="afStatus">
              <option value="all" ${status==="all"?"selected":""}>All</option>
              <option value="active" ${status==="active"?"selected":""}>Active</option>
              <option value="pending" ${status==="pending"?"selected":""}>Pending</option>
              <option value="banned" ${status==="banned"?"selected":""}>Banned</option>
            </select>
          </div>
          <div class="field"><label>Verified</label>
            <select id="afVerified">
              <option value="all" ${verified==="all"?"selected":""}>All</option>
              <option value="verified" ${verified==="verified"?"selected":""}>Verified</option>
              <option value="not" ${verified==="not"?"selected":""}>Not verified</option>
            </select>
          </div>
        </div>
        <div class="grid2" style="margin-top:10px;">
          <div class="field"><label>VIP</label>
            <select id="afVip">
              <option value="all" ${vip==="all"?"selected":""}>All</option>
              <option value="vip" ${vip==="vip"?"selected":""}>VIP only</option>
              <option value="non" ${vip==="non"?"selected":""}>Non-VIP</option>
            </select>
          </div>
          <div class="field"><label>&nbsp;</label><button class="btn primary" type="button" data-action="applyAdminFilters">Apply</button></div>
        </div>
      </div>
      <div class="list" style="margin-top:12px;">
        ${list.map(u=>`
          <div class="rowitem" data-action="adminOpenUser" data-id="${u.id}">
            <div class="badge">${u.status==="banned" ? icons.alert : icons.shield}</div>
            <div class="grow"><div class="title">${u.name} • ${u.age}</div><div class="desc">${u.status} • ${u.district}</div></div>
            <div class="chev">${icons.chevron}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function screenAdminMatch(){
    return `
      ${pageHead("Manual Matching", "Filters + Match create (demo)", "")}
      <div class="card">
        <div class="grid2">
          <div class="field"><label>District</label><input id="amDist" placeholder="Central"/></div>
          <div class="field"><label>Age range</label><input id="amAge" placeholder="25-32"/></div>
        </div>
        <div class="field"><label>Remark keyword</label><input id="amRemark" placeholder="steady"/></div>
        <div class="divider"></div>
        <button class="btn primary" type="button" data-toast="Search results (demo)">Search</button>
      </div>

      <div class="card">
        <h2 class="h2">Results</h2>
        <div class="divider"></div>
        <div class="rowitem" data-toast="Match created (demo)">
          <div class="badge">${icons.spark}</div>
          <div class="grow"><div class="title">Do ↔ Alicia</div><div class="desc">Reason: steady + district close</div></div>
          <div class="chev">Create</div>
        </div>
      </div>
    `;
  }

  function screenAdminReports(){
    return `
      ${pageHead("Reports", `${state.reports.length} items`, "")}
      <div class="list">
        ${state.reports.map(r=>`
          <div class="rowitem" data-action="openReportDetail" data-id="${r.id}">
            <div class="badge ${r.status==="open" ? "ok":""}">${icons.alert}</div>
            <div class="grow"><div class="title">${escapeHtml(r.cat)}</div><div class="desc">${escapeHtml(r.who)} • ${escapeHtml(r.status)}</div></div>
            <div class="chev">${icons.chevron}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function screenAdminReportDetail(){
    const r = state.reports.find(x=>x.id===state.reportDetailId);
    if(!r) return `${pageHead("Report", "", "")}<div class="card"><p class="p">Not found</p></div>`;
    return `
      ${pageHead("Report Detail", r.id, "")}
      <div class="card">
        <div class="row">
          <div class="badge ${r.status==="open" ? "ok":""}">${icons.alert} ${escapeHtml(r.cat)}</div>
          <div class="grow"></div>
          <div class="pill">${escapeHtml(r.status)}</div>
        </div>
        <div class="divider"></div>
        <p class="p"><b>Who:</b> ${escapeHtml(r.who)}</p>
        <p class="p"><b>Details:</b> ${escapeHtml(r.detail)}</p>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn primary" type="button" data-action="resolveReport" data-id="${r.id}">Resolve</button>
          <button class="btn" type="button" data-action="banFromReport" data-id="${r.id}">Ban user</button>
        </div>
      </div>
    `;
  }

  function screenAdminMonitor(){
    return `
      ${pageHead("Monitoring", "System stats (demo)", "")}
      <div class="card">
        <div class="kpi">
          <div class="box"><div class="k">CPU</div><div class="v">23%</div></div>
          <div class="box"><div class="k">Memory</div><div class="v">61%</div></div>
          <div class="box"><div class="k">Online users</div><div class="v">87</div></div>
          <div class="box"><div class="k">Storage</div><div class="v">12.4 GB</div></div>
        </div>
        <div class="divider"></div>
        <button class="btn" type="button" data-toast="Export metrics (demo)">Export</button>
      </div>
    `;
  }

  function screenAdminConfig(){
    return `
      ${pageHead("System Config", "All buttons interactive", "")}
      <div class="card">
        <h2 class="h2">Daily matches</h2>
        <div class="field">
          <label>Matches per day</label>
          <input id="cfgMatches" type="number" min="1" max="10" value="${state.dailyMatches}" />
        </div>
        <div class="divider"></div>
        <h2 class="h2">Admin passcode</h2>
        <div class="field">
          <label>Passcode</label>
          <input id="cfgPass" value="${escapeAttr(state.adminPasscode)}" />
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <button class="btn primary" type="button" data-action="saveConfig">Save</button>
          <button class="btn" type="button" data-toast="Rollback (demo)">Reset</button>
        </div>
      </div>
    `;
  }

  function screenAdminAudit(){
    return `
      ${pageHead("Audit Log", "Demo", "")}
      <div class="card">
        <div class="list">
          <div class="rowitem" data-toast="Viewed user u1">
            <div class="badge">${icons.cog}</div>
            <div class="grow"><div class="title">View user</div><div class="desc">Admin opened Alicia</div></div>
            <div class="chev">now</div>
          </div>
          <div class="rowitem" data-toast="Approved user u7">
            <div class="badge ok">${icons.tick}</div>
            <div class="grow"><div class="title">Approve</div><div class="desc">Ken approved</div></div>
            <div class="chev">1m</div>
          </div>
          <div class="rowitem" data-toast="Resolved report r2">
            <div class="badge">${icons.alert}</div>
            <div class="grow"><div class="title">Resolve report</div><div class="desc">r2 closed</div></div>
            <div class="chev">8m</div>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- Routes ----------
  const routes = {
    home: screenHome,
    match: screenMatch,
    match_filters: screenMatchFilters,
    match_detail: screenMatchDetail,
    likes: screenLikes,
    chat: screenChat,
    chat_user: screenChat,
    notifications: screenNotifications,
    profile: screenProfile,
    edit_profile: screenEditProfile,
    photos: screenPhotos,
    verification: screenVerification,
    onboarding: screenOnboarding,
    safety: screenSafety,
    faq: screenFAQ,
    legal_terms: ()=>legalPage("terms"),
    legal_privacy: ()=>legalPage("privacy"),
    vip: screenVIP,
    credits: screenCredits,
    report: screenReport,

    admin_gate: screenAdminGate,
    admin: screenAdmin,
    admin_approval: screenAdminApproval,
    admin_users: screenAdminUsers,
    admin_match: screenAdminMatch,
    admin_reports: screenAdminReports,
    admin_report_detail: screenAdminReportDetail,
    admin_monitor: screenAdminMonitor,
    admin_config: screenAdminConfig,
    admin_audit: screenAdminAudit,
    admin_user_detail: screenAdminUserDetail,
  };

  function tabFor(route){
    if(route.startsWith("admin")) return null;
    if(route.startsWith("match")) return "match";
    if(route === "likes") return "match";
    if(route.startsWith("chat")) return "chat";
    if(route.startsWith("profile") || route.startsWith("edit_") || route === "photos" || route === "verification" || route === "vip" || route === "credits") return "profile";
    if(route === "onboarding") return "home";
    return "home";
  }

  function renderRoute(name, params={}){
    if(!routes[name]) name = "home";
    state.route = name;

    if(name.startsWith("admin")){
      nav.classList.add("hidden");
    }else{
      nav.classList.remove("hidden");
    }

    const t = tabFor(name);
    tabs.forEach(x=>x.classList.toggle("active", x.dataset.tab === t));

    if(params.id){
      if(name === "match_detail") state.matchDetailId = params.id;
      if(name === "admin_user_detail") state.adminFocusUserId = params.id;
      if(name === "chat_user") state.currentChat = params.id;
      if(name === "admin_report_detail") state.reportDetailId = params.id;
    }

    if(name === "chat_user" && params.id){
      openChat(params.id);
    }else{
      closeChat();
      content.innerHTML = routes[name](params);
      content.scrollTop = 0;
      attachSwipeables();
    }
    closeSheet();
  }

  function go(name, params={}, opts={push:true}){
    const hash = hashFor(name, params);
    if(opts.push){
      if(location.hash === hash){
        renderRoute(name, params);
      }else{
        location.hash = hash;
      }
    }else{
      const url = new URL(location.href);
      url.hash = hash;
      history.replaceState(null, "", url);
      renderRoute(name, params);
    }
  }

  function back(){
    history.back();
  }

  function attachSwipeables(){
    const cards = content.querySelectorAll(".swipe-card, .swipeable");
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

  // ---------- Actions ----------
  const actions = {
    back,

    toggleVIP(){ setVIP(!state.vip); showToast(state.vip ? "切換：VIP" : "切換：Normal"); go(state.route, {}, {push:false}); },

    togglePause(){ state.pausedMatching = !state.pausedMatching; showToast(state.pausedMatching ? "已暫停配對" : "已恢復配對"); go("profile"); },

    toggleHidden(){
      if(!state.vip){ showToast("VIP only"); return; }
      state.hiddenProfile = !state.hiddenProfile;
      showToast(state.hiddenProfile ? "Profile 已隱藏（只見於 Cifu）" : "Profile 已公開");
      go("profile");
    },

    toggleVerified(){ state.verified = !state.verified; showToast(state.verified ? "Verified" : "Not verified"); go("verification", {}, {push:false}); },

    toggleLike(el){
      const id = el.dataset.id;
      if(state.liked.has(id)){ state.liked.delete(id); showToast("Unliked"); }
      else { state.liked.add(id); showToast("Liked"); }
      if(state.route === "match_detail") go("match_detail", {}, {push:false});
      else go(state.route, {}, {push:false});
    },

    openMatchDetail(el){
      const id = el.dataset.id;
      state.matchDetailId = id;
      go("match_detail", {id});
    },

    setAccent(el){
      if(!state.vip){ showToast("VIP only"); return; }
      const c = el.dataset.color;
      if(!c) return;
      applyAccent(c);
      showToast("已套用主題色");
      go(state.route, {}, {push:false});
    },

    completeStep(el){
      const id = el.dataset.id;
      const step = state.onboarding.steps.find(s=>s.id===id);
      if(step){
        step.status = "done";
        const next = state.onboarding.steps.find(s=>s.status === "todo");
        if(next) next.status = "in-progress";
        state.onboarding.stage = state.onboarding.steps.every(s=>s.status==="done") ? "Approved" : "Reviewing";
        showToast(`已完成：${step.label}`);
      }
      go("onboarding", {}, {push:false});
    },

    resetOnboarding(){
      state.onboarding = {
        stage: "Reviewing",
        steps: [
          { id: "profile", label: "填寫個人檔案", status: "done" },
          { id: "kyc", label: "身份驗證（HKID）", status: "in-progress" },
          { id: "safety", label: "安全守則簽署", status: "todo" },
          { id: "payment", label: "付款 / VIP 選項", status: "todo" },
        ],
        notes: "團隊會在 24 小時內完成審核，期間保持電話暢通。",
      };
      showToast("已重設流程");
      go("onboarding", {}, {push:false});
    },

    openChat(el){
      const id = el.dataset.id;
      go("chat_user", {id});
    },

    swipeLike(el){
      const id = el?.dataset.id;
      doSwipe(id, "like");
    },

    swipePass(el){
      const id = el?.dataset.id;
      doSwipe(id, "pass");
    },

    undoSwipe(){
      if(!state.lastSwipe){ showToast("No action to undo"); return; }
      const {id, prevLiked, prevPassed} = state.lastSwipe;
      if(prevLiked) state.liked.add(id); else state.liked.delete(id);
      if(prevPassed) state.passed.add(id); else state.passed.delete(id);
      showToast("Undo swipe");
      state.lastSwipe = null;
      const {route,id:rid} = parseHash();
      renderRoute(route, {id:rid});
    },

    openCoach(){
      openCoachSheet();
    },

    coachSetIntent(el){
      state.coach.intent = el.dataset.value;
      openCoachSheet();
    },

    coachSetTone(el){
      state.coach.tone = el.dataset.value;
      openCoachSheet();
    },

    coachUse(el){
      const text = el.dataset.text || "";
      msg.value = text;
      closeSheet();
      msg.focus();
      showToast("已填入建議");
    },

    copyBubble(){
      const ctx = state.currentBubble;
      if(!ctx) return;
      const m = (state.chats[ctx.userId]||[])[ctx.idx];
      if(!m || m.type!=="text") return;
      const t = m.text || "";
      if(navigator.clipboard?.writeText){
        navigator.clipboard.writeText(t).then(()=>showToast("Copied"), ()=>showToast("Copy failed"));
      }else{
        showToast("Copy not available");
      }
      closeSheet();
    },

    deleteBubble(){
      const ctx = state.currentBubble;
      if(!ctx) return;
      const list = state.chats[ctx.userId] || [];
      const m = list[ctx.idx];
      if(!m || m.who !== "me") { showToast("只能刪除自己訊息"); return; }
      list.splice(ctx.idx,1);
      showToast("已刪除");
      closeSheet();
      renderChatThread(ctx.userId);
    },

    reportBubble(){
      closeSheet();
      go("report");
    },

    saveBubble(){
      showToast("Saved (demo)");
      closeSheet();
    },

    viewRetention(){
      const ctx = state.currentBubble;
      if(!ctx) return;
      const msgObj = (state.chats[ctx.userId]||[])[ctx.idx];
      const exp = retentionFor(msgObj?.type || "text");
      showToast(exp ? `Expires in ${exp}` : "Text: no expiry");
      closeSheet();
    },

    applyFilters(){
      const d = document.getElementById("fDistrict");
      const min = document.getElementById("fMin");
      const max = document.getElementById("fMax");
      state.filters.district = d ? d.value.trim() : state.filters.district;
      state.filters.ageMin = clamp(parseInt(min?.value || state.filters.ageMin,10), 18, 60);
      state.filters.ageMax = clamp(parseInt(max?.value || state.filters.ageMax,10), 18, 60);
      if(state.filters.ageMin > state.filters.ageMax){
        const tmp = state.filters.ageMin; state.filters.ageMin = state.filters.ageMax; state.filters.ageMax = tmp;
      }
      showToast("Filters applied");
      go("match");
    },

    resetFilters(){
      state.filters = { verifiedOnly:false, vipOnly:false, district:"", ageMin:20, ageMax:35 };
      showToast("Filters reset");
      go("match_filters", {}, {push:false});
    },

    f_verified_on(){ state.filters.verifiedOnly = true; go("match_filters", {}, {push:false}); },
    f_verified_off(){ state.filters.verifiedOnly = false; go("match_filters", {}, {push:false}); },
    f_vip_on(){ state.filters.vipOnly = true; go("match_filters", {}, {push:false}); },
    f_vip_off(){ state.filters.vipOnly = false; go("match_filters", {}, {push:false}); },

    openNotification(el){
      const n = state.notifications.find(x=>x.id===el.dataset.id);
      if(n){ n.read = true; showToast("Marked as read"); }
      go("notifications", {}, {push:false});
    },

    markAllRead(){
      state.notifications.forEach(n=>n.read=true);
      showToast("All read");
      go("notifications", {}, {push:false});
    },

    saveProfile(){
      const n = document.getElementById("pName");
      const a = document.getElementById("pAge");
      const d = document.getElementById("pDistrict");
      const o = document.getElementById("pOcc");
      const b = document.getElementById("pBio");
      state.me.name = (n?.value || state.me.name).trim() || state.me.name;
      state.me.age = clamp(parseInt(a?.value || state.me.age,10), 18, 60);
      state.me.district = (d?.value || state.me.district).trim() || state.me.district;
      state.me.occupation = (o?.value || state.me.occupation).trim() || state.me.occupation;
      state.me.bio = (b?.value || state.me.bio).trim() || state.me.bio;
      showToast("Saved");
      go("profile");
    },

    addPhoto(){ showToast("Add photo (demo)"); },
    removePhoto(el){ showToast(`Removed photo ${parseInt(el.dataset.id,10)+1} (demo)`); },
    viewPhoto(el){ showToast(`View photo ${parseInt(el.dataset.id,10)+1} (demo)`); },

    submitReport(){
      const cat = document.getElementById("repCat")?.value || "Other";
      const det = document.getElementById("repDetail")?.value || "";
      state.reports.unshift({ id:"r"+Math.floor(Math.random()*9999), cat, who:"(from user)", status:"open", detail: det || "(no detail)" });
      showToast("Report submitted");
      go("home");
    },

    openReportFromDetail(){
      showToast("Open report form");
      go("report");
    },

    buyVIP(){ showToast(state.vip ? "Manage VIP (demo)" : "Paid HKD 300 (demo)"); },

    // sheet actions
    closeSheet,
    attachPhoto(){
      closeSheet();
      if(!state.currentChat) return;
      state.chats[state.currentChat] = state.chats[state.currentChat] || [];
      state.chats[state.currentChat].push({ who:"me", type:"image", text:"Photo (demo)", ts:"now" });
      renderChatThread(state.currentChat);
      showToast("Photo sent");
    },
    attachVoice(){
      closeSheet();
      if(!state.currentChat) return;
      if(!state.vip){ showToast("VIP only"); return; }
      state.chats[state.currentChat] = state.chats[state.currentChat] || [];
      state.chats[state.currentChat].push({ who:"me", type:"audio", text:"Voice", ts:"now" });
      renderChatThread(state.currentChat);
      showToast("Voice sent");
    },
    attachSticker(){
      closeSheet();
      if(!state.currentChat) return;
      state.chats[state.currentChat] = state.chats[state.currentChat] || [];
      state.chats[state.currentChat].push({ who:"me", type:"text", text:"✨ (sticker demo)", ts:"now" });
      renderChatThread(state.currentChat);
      showToast("Sticker sent");
    },

    // admin entry / auth
    adminEntry(){
      if(state.adminMode){
        if(!state.adminAuthed){ go("admin_gate"); return; }
        go("admin");
        return;
      }
      go("admin_gate");
    },

    adminLogin(){
      const code = (document.getElementById("adminCode")?.value || "").trim();
      if(code !== state.adminPasscode){
        showToast("Wrong passcode");
        return;
      }
      state.adminMode = true;
      state.adminAuthed = true;
      showToast("Admin mode enabled");
      go("admin");
    },

    adminLogout(){
      state.adminMode = false;
      state.adminAuthed = false;
      showToast("Back to user mode");
      go("home");
    },

    adminOpenUser(el){
      state.adminFocusUserId = el.dataset.id;
      go("admin_user_detail", {id: el.dataset.id});
    },

    adminApprove(el){
      const id = el.dataset.id;
      const u = getUser(id);
      if(u){ u.status="active"; u.verified=true; showToast("Approved"); }
      go("admin_approval", {}, {push:false});
    },

    adminReject(el){
      const id = el.dataset.id;
      const u = getUser(id);
      if(u){ u.status="rejected"; showToast("Rejected"); }
      go("admin_approval", {}, {push:false});
    },

    adminBan(el){
      const id = el.dataset.id;
      const u = getUser(id);
      if(u){ u.status="banned"; showToast("Banned"); }
      go("admin_users", {}, {push:false});
    },

    adminSearch(){
      const val = document.getElementById("adminSearch")?.value || "";
      state.adminFilters.query = val;
      go("admin_users", {}, {push:false});
      showToast(val ? `Search "${val}"` : "Showing all");
    },

    openReportDetail(el){
      state.reportDetailId = el.dataset.id;
      go("admin_report_detail", {id: el.dataset.id});
    },

    resolveReport(el){
      const r = state.reports.find(x=>x.id===el.dataset.id);
      if(r){ r.status="closed"; showToast("Resolved"); }
      go("admin_reports", {}, {push:false});
    },

    banFromReport(el){
      const r = state.reports.find(x=>x.id===el.dataset.id);
      if(r){
        const who = r.who;
        const u = state.users.find(x=>x.name===who);
        if(u){ u.status="banned"; }
        r.status="closed";
        showToast("User banned + report closed");
      }
      go("admin_reports", {}, {push:false});
    },

    saveConfig(){
      const m = document.getElementById("cfgMatches");
      const p = document.getElementById("cfgPass");
      state.dailyMatches = clamp(parseInt(m?.value || state.dailyMatches,10), 1, 10);
      const pass = (p?.value || state.adminPasscode).trim();
      state.adminPasscode = pass || state.adminPasscode;
      showToast("Config saved");
      go("admin_config", {}, {push:false});
    },

    applyAdminFilters(){
      const q = document.getElementById("adminSearch")?.value || "";
      const status = document.getElementById("afStatus")?.value || "all";
      const verified = document.getElementById("afVerified")?.value || "all";
      const vip = document.getElementById("afVip")?.value || "all";
      state.adminFilters = { query:q, status, verified, vip };
      go("admin_users", {}, {push:false});
      showToast("Filters applied");
    },

    resetAdminFilters(){
      state.adminFilters = { query:"", status:"all", verified:"all", vip:"all" };
      go("admin_users", {}, {push:false});
      showToast("Filters reset");
    },
  };

  // ---------- Click handling (event delegation) ----------
  function findActionTarget(e){
    return e.target.closest("[data-go],[data-action],[data-toast]");
  }

  content.addEventListener("click", (e)=>{
    const el = findActionTarget(e);
    if(!el) return;

    if(el.dataset.toast){
      showToast(el.dataset.toast);
      return;
    }
    if(el.dataset.go){
      go(el.dataset.go);
      return;
    }
    if(el.dataset.action){
      const fn = actions[el.dataset.action];
      if(typeof fn === "function") fn(el);
      else showToast("Action not implemented: " + el.dataset.action);
      return;
    }
  });

  content.addEventListener("input", (e)=>{
    if(e.target.id === "adminSearch"){
      state.adminFilters.query = e.target.value || "";
      go("admin_users", {}, {push:false});
    }
  });
  content.addEventListener("change", (e)=>{
    if(["afStatus","afVerified","afVip"].includes(e.target.id)){
      state.adminFilters[e.target.id === "afStatus" ? "status" : e.target.id === "afVerified" ? "verified" : "vip"] = e.target.value;
      go("admin_users", {}, {push:false});
    }
  });

  // nav tabs
  tabs.forEach(t=>{
    t.addEventListener("click", ()=>{
      if(state.adminMode){ showToast("Exit admin to use tabs"); return; }
      go(t.dataset.tab);
    });
  });

  // VIP chip toggle always works
  modeChip.addEventListener("click", ()=>actions.toggleVIP());

  // global: allow ESC to close sheet
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){ closeSheet(); }
  });
  window.addEventListener("hashchange", ()=>{
    const {route,id} = parseHash();
    renderRoute(route, {id});
  });

  // ---------- Utils ----------
  function escapeHtml(s){
    return String(s ?? "").replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g, "&quot;"); }

  // init
  applyAccent(state.accentColor);
  setVIP(state.vip);
  const start = parseHash();
  renderRoute(start.route, {id:start.id});
