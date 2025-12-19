import { t } from "../i18n.js";

export function renderHeader(sub=""){
  return `
    <div class="topbar">
      <div class="brand">
        <div class="logo" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7-4.4-9.3-8.6C.7 8.7 2.6 6 5.6 6c1.8 0 3.3 1 4.1 2.2C10.5 7 12 6 13.8 6c3 0 4.9 2.7 2.9 6.4C19 16.6 12 21 12 21z" stroke="rgba(255,255,255,0.92)" stroke-width="1.8" />
          </svg>
        </div>
        <div class="grow">
          <h1>SIFU Love <span class="sub">Feng Shui UI • Mobile Web (v8)</span></h1>
        </div>
      </div>
      <button class="chip" data-action="toggleVIP"><span class="dot"></span><span>VIP</span><small>mode</small></button>
    </div>
  `;
}

export function pageHead(titleKey, subtitle="", rightHtml=""){
  return `
    <div class="pagehead">
      <div class="left">
        <button class="backbtn" type="button" data-action="back" title="Back">←</button>
        <div class="grow" style="min-width:0;">
          <h2>${t(titleKey)}</h2>
          ${subtitle ? `<div class="sub">${subtitle}</div>` : ``}
        </div>
      </div>
      <div class="right">${rightHtml || ""}</div>
    </div>
  `;
}
