import { state, setLanguage, persistState } from "./state.js";

const dict = {
  "zh-HK": {
    home_title: "Home",
    match_title: "配對",
    chat_title: "聊天室",
    profile_title: "個人檔案",
    settings_title: "設定",
    splash_enter: "Tap to Enter",
    login_title: "登入",
    register_title: "註冊",
    logout: "登出",
    language: "語言",
    disable_sim: "停用模擬回覆",
    show_splash: "下次啟動顯示封面",
    save: "儲存",
    submit: "送出",
    name: "名字",
    age: "年齡",
    district: "地區",
    email: "Email / 電話",
    password: "密碼（示意）",
    create_account: "建立帳戶",
    start_with_coach: "Coach 開場",
    undo: "還原",
    splash_tagline: "五行平衡 • 沉穩玻璃感 • 慢熱配對",
    admin: "Admin",
  },
  en: {
    home_title: "Home",
    match_title: "Match",
    chat_title: "Chat",
    profile_title: "Profile",
    settings_title: "Settings",
    splash_enter: "Tap to Enter",
    login_title: "Login",
    register_title: "Register",
    logout: "Logout",
    language: "Language",
    disable_sim: "Disable simulated replies",
    show_splash: "Show splash on next launch",
    save: "Save",
    submit: "Submit",
    name: "Name",
    age: "Age",
    district: "District",
    email: "Email / Phone",
    password: "Password (demo)",
    create_account: "Create account",
    start_with_coach: "Start with Coach",
    undo: "Undo",
    splash_tagline: "Fengshui balance • Calm glass • Slow dating",
    admin: "Admin",
  }
};

export function t(key){
  const lang = state.language in dict ? state.language : "zh-HK";
  return dict[lang][key] || key;
}

export function switchLang(lang){
  if(!dict[lang]) return;
  setLanguage(lang);
  persistState();
}
