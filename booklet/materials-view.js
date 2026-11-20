(() => {
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=window.FIELD_GUIDE_DATA;
data.materials=window.MATERIAL_RECORDS.map(m=>({...m,...window.MATERIAL_ASSETS[m.id]}));
data.version='6.0-bilingual';
data.sections.find(s=>s.id==='materials').pages=Array.from({length:4},(_,i)=>({type:'materials',start:i*4}));
window.renderMaterials=start=>`${start%8===0?'<h1>Materials</h1>':'<div class="chapter-heading-space" aria-hidden="true"></div>'}<div class="material-grid">${data.materials.slice(start,start+4).map(m=>`<button type="button" data-material="${esc(m.id)}" aria-haspopup="dialog"><img src="${esc(m.image)}" alt=""><span class="material-name"><span lang="zh-Hans">${esc(m.nameZh)}</span><span lang="en">${esc(m.name)}</span></span></button>`).join('')}</div>`;
window.renderMaterialCard=m=>`<div class="material-card-layout"><div class="card-visual"><img src="${esc(m.image)}" alt="${esc(m.name)}"><h2 id="card-title" class="card-material-name"><span lang="zh-Hans">${esc(m.nameZh)}</span><span lang="en">${esc(m.name)}</span></h2></div><div class="card-information"><dl>${[['Medicinal Part',m.medicinalPart],['Traditional Nature',m.nature],['Traditional Function Category',m.functionCategory],['Game Clue',m.gameClue]].map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}<div><dt>Source</dt><dd><a href="${esc(m.source)}" target="_blank" rel="noopener">${esc(m.sourceLabel)} ↗</a></dd></div></dl></div></div>`;
})();
