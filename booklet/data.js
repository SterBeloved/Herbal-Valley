// Shared booklet/game registry. No names, identities or locations are inferred.
window.FIELD_GUIDE_DATA = {
  version: '1.0-framework',
  sources: [{id:'proposal', file:'AIH5571 Group1-Proposal.docx', scope:'Exhibition context only'}, {id:'map', file:'assets/valley-map.jpg', scope:'Visual reference only; no confirmed region labels'}],
  regions: Array.from({length:6}, (_,i)=>({id:`region-${i+1}`, name:null, image:null, materialIds:[], verified:false})),
  materials: [], // {id, name, image, regionId, description, source, verified}
  sections: [
    {id:'basics', title:'TCM Basics', subtitle:'A place to begin', pages:[{type:'intro'},{type:'blank'}]},
    {id:'valley', title:'The Valley', subtitle:'Find your way through the valley', pages:[{type:'regions', start:0},{type:'regions', start:3}]},
    {id:'materials', title:'Materials', subtitle:'Your pocket reference', pages:[{type:'materials'},{type:'blank'}]}
  ]
};
