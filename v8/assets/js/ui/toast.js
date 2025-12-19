export function showToast(msg){
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("on");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.remove("on"), 1700);
}
