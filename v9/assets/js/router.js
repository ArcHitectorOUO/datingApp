import { state, persistState } from "./state.js";
import { renderSplash } from "./pages/splash.js";
import { renderHome } from "./pages/home.js";
import { renderMatch } from "./pages/match.js";
import { renderChatPage } from "./pages/chat.js";
import { renderProfile } from "./pages/profile.js";
import { renderSettings } from "./pages/settings.js";
import { renderLogin } from "./pages/auth_login.js";
import { renderRegister } from "./pages/auth_register.js";
import { renderAdmin } from "./pages/admin.js";

const routes = {
  "splash": renderSplash,
  "auth/login": renderLogin,
  "auth/register": renderRegister,
  "home": renderHome,
  "match": renderMatch,
  "chat": renderChatPage,
  "profile": renderProfile,
  "settings": renderSettings,
  "admin": renderAdmin,
};

export function parseHash(){
  const raw = (location.hash || "#/splash").replace(/^#\/?/,"");
  const parts = raw.split("/").filter(Boolean);
  const route = parts[0] || "splash";
  const id = parts[1] || null;
  return { route, id };
}

export function guard(route){
  if(!state.hasEntered && route !== "splash") return "splash";
  if(!state.currentUser && !route.startsWith("auth") && route!=="splash") return "auth/login";
  return route;
}

export function go(route){
  const current = parseHash().route;
  if(current === route.split("/")[0] && location.hash === `#/${route}`) render();
  else location.hash = `#/${route}`;
}

export function render(){
  const {route,id} = parseHash();
  const guarded = guard(route);
  if(guarded !== route){
    location.hash = `#/${guarded}`;
    return;
  }
  const fn = routes[guarded] || renderHome;
  fn(id);
}

window.addEventListener("hashchange", render);
