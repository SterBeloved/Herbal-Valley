(() => {
'use strict';
const data=window.FIELD_GUIDE_DATA, $=s=>document.querySelector(s), pages=$('#pages'), dialog=$('#card');
const mobile=matchMedia('(max-width:760px)'), systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
let saved={};try{saved=JSON.parse(localStorage.getItem('herbal-guide')||'{}')}catch{}
let positions=saved.positions||{}, section='basics', opener=null, animationTimer, activeMaterialId=null, resizePending=false, bookClosed=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(src,alt)=>src?`<img src="${esc(src)}" alt="${esc(alt)}">`:'<span class="image-slot" aria-hidden="true"></span>';
function persist(){try{localStorage.setItem('herbal-guide',JSON.stringify({positions,motion:$('#motion').checked}))}catch{}}
function body(page){
 if(page.type==='basics')return window.renderBasics(page.unit);
 if(page.type==='intro')return '<h1>TCM Basics</h1><p class="subtitle">A place to begin</p><div class="rule"></div><p class="empty">Content will be added in a future edition.</p>';
 if(page.type==='blank')return '<div class="blank-area"><p>Reserved for field notes</p></div>';
 if(page.type==='regions')return window.renderValley(page.start||0);
 if(page.type==='materials')return window.renderMaterials(page.start||0);
 return '';
}
function setBookClosed(closed,animate=true){
 if(dialog.open)return;
 clearTimeout(animationTimer);$('#book').querySelectorAll('.turning-leaf').forEach(e=>e.remove());
 bookClosed=closed;$('#book').classList.toggle('is-closed',closed);$('.book-wrap').classList.toggle('is-closed',closed);
 pages.hidden=closed;$('.chapter-tabs').hidden=closed;$('#cover').hidden=!closed;$('.navigation').hidden=closed;$('#close-book').hidden=closed;
 $('#book').classList.remove('book-opening','book-closing');
 if(animate&&!$('#motion').checked&&!systemMotion.matches){void $('#book').offsetWidth;$('#book').classList.add(closed?'book-closing':'book-opening')}
 if(animate)(closed?$('#open-book'):$('#close-book')).focus();
}
$('#open-book').onclick=()=>setBookClosed(false);$('#close-book').onclick=()=>setBookClosed(true);
function render(animate=false,direction=1){
 const oldLeaf=animate&&!bookClosed?pages.querySelector(direction>0?'.page:last-child':'.page:first-child')?.cloneNode(true):null;
 const s=data.sections.find(s=>s.id===section), total=s.pages.length;
 let index=Math.max(0,Math.min(total-1,Number(positions[section])||0));positions[section]=index;
 const start=mobile.matches?index:Math.floor(index/2)*2,count=mobile.matches?1:2;
 pages.innerHTML=s.pages.slice(start,start+count).map((p,i)=>{const n=data.sections.slice(0,data.sections.indexOf(s)).reduce((a,v)=>a+v.pages.length,0)+start+i+1;return `<article class="page ${p.type==='basics'?'basics-page':''}" aria-label="${esc(s.title)}, page ${n}"><div class="running"><span>Herbal Valley</span><span>${String(data.sections.indexOf(s)+1).padStart(2,'0')}</span></div><div class="page-content ${p.type==='basics'?'basics-content':''}" tabindex="0" aria-label="${esc(s.title)} reading content">${body(p)}</div><div class="folio"><span>${esc(s.title)}</span><span>${String(n).padStart(2,'0')}</span></div></article>`}).join('');
 $('.chapter-tabs').innerHTML=data.sections.map(s=>`<button data-section="${s.id}" ${s.id===section?'aria-current="page"':''}>${esc(s.title)}</button>`).join('');
 $('#position').textContent=`${s.title} · ${mobile.matches?`Page ${start+1} of ${total}`:`Pages ${start+1}–${Math.min(start+2,total)} of ${total}`}`;
 $('#previous').disabled=false;$('#next').disabled=section==='materials'&&start+count>=total;
 if(oldLeaf&&!$('#motion').checked&&!systemMotion.matches){
  $('#book').querySelectorAll('.turning-leaf').forEach(e=>e.remove());
  oldLeaf.classList.add('turning-leaf',direction<0?'turn-back':'turn-forward');oldLeaf.setAttribute('aria-hidden','true');oldLeaf.inert=true;
  $('#book').append(oldLeaf);clearTimeout(animationTimer);animationTimer=setTimeout(()=>oldLeaf.remove(),720);
 }
 persist();
}
function go(id,animate=true){if(dialog.open)return;if(!data.sections.some(s=>s.id===id))return;section=id;setBookClosed(false,false);render(animate);}
function navigate(direction){if(dialog.open)return;if(direction<0&&section==='basics'&&(mobile.matches?(positions.basics||0):Math.floor((positions.basics||0)/2)*2)===0){setBookClosed(true);return;}const s=data.sections.find(s=>s.id===section),step=mobile.matches?1:2,start=mobile.matches?positions[section]:Math.floor(positions[section]/2)*2,next=start+direction*step;if(next>=0&&next<s.pages.length){positions[section]=next;render(true,direction)}else{const target=data.sections[data.sections.indexOf(s)+direction];if(target)go(target.id)}}
function openMaterial(id){if(dialog.open)return false;const m=data.materials.find(m=>m.id===id);if(!m)return false;activeMaterialId=id;opener=document.activeElement;$('#card-body').innerHTML=window.renderMaterialCard(m);dialog.showModal();document.body.classList.add('card-open');return true}

$('.chapter-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-section]');if(b){go(b.dataset.section);$('.chapter-tabs [aria-current]').focus()}});
pages.addEventListener('click',e=>{if(e.target.closest('[data-valley]')){go('valley');$('.chapter-tabs [aria-current]').focus();return;}const b=e.target.closest('[data-material]');if(b)openMaterial(b.dataset.material)});
$('#previous').onclick=()=>navigate(-1);$('#next').onclick=()=>navigate(1);
$('#quick').onclick=()=>{go('materials');$('.chapter-tabs [aria-current]').focus()};
$('.close').onclick=()=>dialog.close();$('#card-done').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.classList.remove('card-open');if(resizePending){if(section==='materials')positions.materials=Math.floor(data.materials.findIndex(m=>m.id===activeMaterialId)/4);render();resizePending=false;opener=pages.querySelector(`[data-material="${activeMaterialId}"]`)}if(opener?.isConnected)opener.focus()});
$('#motion').checked=typeof saved.motion==='boolean'?saved.motion:systemMotion.matches;$('#motion').onchange=()=>{document.body.classList.toggle('reduced',$('#motion').checked);persist()};document.body.classList.toggle('reduced',$('#motion').checked);
mobile.addEventListener('change',()=>{if(dialog.open)resizePending=true;else render()});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)));
const params=new URLSearchParams(location.search);go(params.get('mode')==='quick'?'materials':location.hash.slice(1)||'basics',false);
if(!location.hash&&!params.has('mode'))setBookClosed(true,false);
window.HerbalGuide={openBook:()=>setBookClosed(false),closeBook:()=>setBookClosed(true),openMaterials:()=>go('materials'),openMaterial,dataVersion:data.version};
})();
