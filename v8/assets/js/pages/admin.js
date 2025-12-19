import { renderHeader, pageHead } from "../components/header.js";
import { renderNav } from "../components/nav.js";
import { state } from "../state.js";

export function renderAdmin(){
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="app">
      ${renderHeader()}
      <div class="content">
        ${pageHead("admin","Demo filters")}
        <div class="card">
          <div class="field"><label>Search</label><input id="adminSearch" value="${state.adminFilters?.query||""}" /></div>
          <div class="grid2" style="margin-top:10px;">
            <div class="field"><label>Status</label>
              <select id="afStatus">
                <option value="all" ${state.adminFilters.status==="all"?"selected":""}>All</option>
                <option value="active" ${state.adminFilters.status==="active"?"selected":""}>Active</option>
                <option value="pending" ${state.adminFilters.status==="pending"?"selected":""}>Pending</option>
                <option value="banned" ${state.adminFilters.status==="banned"?"selected":""}>Banned</option>
              </select>
            </div>
            <div class="field"><label>Verified</label>
              <select id="afVerified">
                <option value="all" ${state.adminFilters.verified==="all"?"selected":""}>All</option>
                <option value="verified" ${state.adminFilters.verified==="verified"?"selected":""}>Verified</option>
                <option value="not" ${state.adminFilters.verified==="not"?"selected":""}>Not verified</option>
              </select>
            </div>
          </div>
          <div class="grid2" style="margin-top:10px;">
            <div class="field"><label>VIP</label>
              <select id="afVip">
                <option value="all" ${state.adminFilters.vip==="all"?"selected":""}>All</option>
                <option value="vip" ${state.adminFilters.vip==="vip"?"selected":""}>VIP</option>
                <option value="non" ${state.adminFilters.vip==="non"?"selected":""}>Non-VIP</option>
              </select>
            </div>
            <div class="field"><label>&nbsp;</label><button class="btn primary" data-action="applyAdminFilters">Apply</button></div>
          </div>
        </div>
        <div class="list" style="margin-top:12px;">
          ${filterUsers().map(u=>`
            <div class="rowitem" data-toast="Open ${u.name}">
              <div class="badge">${u.status}</div>
              <div class="grow"><div class="title">${u.name} • ${u.age}</div><div class="desc">${u.district}</div></div>
              <div class="chev">›</div>
            </div>
          `).join("")}
        </div>
      </div>
      ${renderNav()}
    </div>
  `;
}

function filterUsers(){
  const {query="",status="all",verified="all",vip="all"} = state.adminFilters || {};
  const norm = query.toLowerCase();
  return state.users.filter(u=>{
    if(status!=="all" && u.status!==status) return false;
    if(verified==="verified" && !u.verified) return false;
    if(verified==="not" && u.verified) return false;
    if(vip==="vip" && !u.vip) return false;
    if(vip==="non" && u.vip) return false;
    if(norm && !`${u.name} ${u.district}`.toLowerCase().includes(norm)) return false;
    return true;
  });
}
