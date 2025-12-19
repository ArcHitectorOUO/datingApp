const overlay = document.getElementById("overlay");
const sheet = document.getElementById("sheet");

export function openSheet(title, options){
  overlay.classList.add("on");
  sheet.classList.add("on");
  sheet.innerHTML = `
    <h3>${title}</h3>
    ${options.map(opt=>`
      <div class="opt" data-action="${opt.action}" ${opt.disabled ? 'data-toast="VIP only"' : ''}>
        <div class="t">${opt.icon || ""} ${opt.title}</div>
        <div class="s">${opt.sub || ""}</div>
        <div class="r">${opt.disabled ? "🔒" : "›"}</div>
      </div>
    `).join("")}
    <div class="opt" data-action="closeSheet"><div class="t">Cancel</div><div class="s">關閉</div><div class="r">×</div></div>
  `;
}

export function closeSheet(){
  overlay.classList.remove("on");
  sheet.classList.remove("on");
  sheet.innerHTML = "";
}

overlay.addEventListener("click", closeSheet);
