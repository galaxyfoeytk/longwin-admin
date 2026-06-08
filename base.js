// 共用基礎 JS — 所有子頁面引用
const API = 'https://script.google.com/macros/s/AKfycbxZg8p4Aofjh_x43koax5MJfRmAWqewo6az9dEtLqImA6KM5bb6U7RvL5uPxy7Xy1Vn/exec';
const RL = {1:'系統最高管理員',2:'營運管理者',3:'店長',4:'副店長',5:'正職員工',6:'工讀生',7:'財務/會計',8:'外部顧問'};
const RC = {1:'rp-1',2:'rp-2',3:'rp-3',4:'rp-4',5:'rp-5',6:'rp-6',7:'rp-7',8:'rp-8'};
const AC = {1:'av-1',2:'av-2',3:'av-3',4:'av-4',5:'av-5',6:'av-6',7:'av-7',8:'av-8'};
var CU = null;
var today = new Date().toISOString().slice(0,10);

function getUser() {
  var s = sessionStorage.getItem('longyinUser');
  if (!s) { location.href = 'index.html'; return null; }
  try { return JSON.parse(s); } catch(e) { location.href='index.html'; return null; }
}

async function api(params) {
  var url = API + '?' + Object.entries(params).map(([k,v]) => k + '=' + encodeURIComponent(v == null ? '' : v)).join('&');
  try {
    var r = await fetch(url);
    return await r.json();
  } catch(e) { return { ok: false, error: e.message }; }
}

function toast(msg, type) {
  var el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.className = 'toast show';
  el.style.color = type==='ok'?'var(--green)':type==='er'?'var(--red)':'var(--text-m)';
  setTimeout(()=>el.classList.remove('show'), 2500);
}

function gv(id){var e=document.getElementById(id);return e?e.value:'';}
function sv(id,v){var e=document.getElementById(id);if(e)e.value=v;}

function chip(v, map) {
  // map: {value: [bg, fg, label]}
  if(map && map[v]) {
    var m = map[v];
    return `<span style="font-size:11px;padding:2px 8px;border-radius:20px;font-weight:500;background:${m[0]};color:${m[1]}">${m[2]||v}</span>`;
  }
  return `<span style="font-size:11px;padding:2px 8px;border-radius:20px;background:#F1EFE8;color:#5F5E5A">${v}</span>`;
}

function empty(tbody, cols, msg) {
  tbody.innerHTML = `<tr><td colspan="${cols}" style="text-align:center;color:#A09E99;padding:24px">${msg||'尚無記錄'}</td></tr>`;
}

function buildSubHeader(title, subtitle) {
  var u = getUser(); if(!u) return;
  CU = u;
  var av = document.getElementById('tav');
  if(av){ av.textContent=(u.name||'?')[0]; av.className='ua '+(AC[u.role]||'av-5'); }
  var tnm = document.getElementById('tnm'); if(tnm) tnm.textContent = u.name;
  var trl = document.getElementById('trl');
  if(trl){ trl.textContent=RL[u.role]||u.label||'員工'; trl.className='rp '+(RC[u.role]||'rp-5'); }
  var pt = document.getElementById('page-title'); if(pt) pt.textContent=title||'';
  var ps = document.getElementById('page-sub'); if(ps) ps.textContent=subtitle||'';
  return u;
}

function doLogout() {
  sessionStorage.removeItem('longyinUser');
  location.href = 'index.html';
}

function goHome() {
  location.href = 'index.html';
}
