export function modal(message, actions=[]){
  let modalEl = document.getElementById("modal");
  if(!modalEl){
    modalEl = document.createElement("div");
    modalEl.id = "modal";
    modalEl.className = "modal";
    modalEl.innerHTML = `<div class="inner"></div>`;
    document.body.appendChild(modalEl);
  }
  modalEl.querySelector(".inner").innerHTML = `
    <div class="p" style="margin:0;">${message}</div>
    <div class="grid2" style="margin-top:14px;">
      ${actions.map(a=>`<button class="btn ${a.primary?"primary":""}" data-action="${a.action || "closeModal"}">${a.label}</button>`).join("")}
    </div>
  `;
  modalEl.classList.add("on");
}

export function closeModal(){
  const modalEl = document.getElementById("modal");
  if(modalEl) modalEl.classList.remove("on");
}
