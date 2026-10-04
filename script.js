const defaultState = {
  points: 120,
  requests: [
    {id:1,name:'Sarah N.',area:'Kawempe',material:'PET Plastic',weight:18,time:'Morning',status:'Open'},
    {id:2,name:'Kampala Fresh Mart',area:'Nakawa',material:'Cardboard',weight:42,time:'Afternoon',status:'Open'},
    {id:3,name:'David K.',area:'Makindye',material:'Metal',weight:9,time:'Evening',status:'Open'}
  ],
  completed: 37,
  recovered: 684,
  agents: 24
};

let state = JSON.parse(localStorage.getItem('cleanloopState')) || defaultState;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function save(){localStorage.setItem('cleanloopState',JSON.stringify(state));}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function showView(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'});renderAll()}

document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-view]'); if(nav){showView(nav.dataset.view);return}
  const go=e.target.closest('[data-go]'); if(go){showView(go.dataset.go);return}
  const accept=e.target.closest('[data-accept]'); if(accept){const r=state.requests.find(x=>x.id===+accept.dataset.accept);if(r){r.status='Accepted';save();toast('Request accepted by Green Agent.');renderAll();}}
  const complete=e.target.closest('[data-complete]'); if(complete){const r=state.requests.find(x=>x.id===+complete.dataset.complete);if(r&&r.status!=='Completed'){r.status='Completed';state.completed++;state.recovered+=Number(r.weight);state.points+=Math.round(Number(r.weight)*2);save();toast('Collection completed and recovery recorded.');renderAll();}}
  if(e.target.id==='resetDemo'){state=JSON.parse(JSON.stringify(defaultState));save();toast('Demo data reset.');renderAll()}
});

$('#collectionForm').addEventListener('submit',e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());
  const req={id:Date.now(),name:data.name,area:data.area,material:data.material,weight:Number(data.weight),time:data.time,status:'Open'};
  state.requests.unshift(req);state.points+=10;save();
  $('#collectionResult').innerHTML=`<strong>✓ Request CL-${String(req.id).slice(-5)} created.</strong><br>Your ${req.weight} kg of ${req.material} is ready for collection in ${req.area}. A Green Agent can now accept the request.`;
  $('#collectionResult').classList.remove('hidden');e.target.reset();toast('+10 Green Points earned');renderAll();
});

function renderStats(){
  const stats=[['Recovered',''+state.recovered.toFixed(1)+' kg','↑ diverted from disposal'],['Green Agents',''+state.agents,'active network'],['Collections',''+state.completed,'completed'],['Green Points',''+state.points,'community rewards']];
  $('#homeStats').innerHTML=stats.map(s=>`<div class="stat"><span class="label">${s[0]}</span><strong>${s[1]}</strong><small>${s[2]}</small></div>`).join('');
  $('#agentStats').innerHTML=[['Open Requests',state.requests.filter(r=>r.status==='Open').length,'waiting for pickup'],['Accepted',state.requests.filter(r=>r.status==='Accepted').length,'in progress'],['Completed',state.completed,'recovery records'],['Recovered',state.recovered.toFixed(1)+' kg','material verified']].map(s=>`<div class="stat"><span class="label">${s[0]}</span><strong>${s[1]}</strong><small>${s[2]}</small></div>`).join('');
  $('#impactStats').innerHTML=[['Waste Recovered',state.recovered.toFixed(1)+' kg','and growing'],['Youth Agents',state.agents,'green livelihood opportunities'],['Collections',state.completed,'traceable handovers'],['Green Points',state.points,'behaviour incentives']].map(s=>`<div class="stat"><span class="label">${s[0]}</span><strong>${s[1]}</strong><small>${s[2]}</small></div>`).join('');
  $('#pointsTop').textContent=state.points;
}
function renderHome(){
  $('#hotspots').innerHTML=[['Kawempe','High activity','high'],['Makindye','Collection due','medium'],['Nakawa','Recovery hub active','low'],['Rubaga','Community clean-up','low']].map(x=>`<div class="hotspot"><div><strong>${x[0]}</strong><small>${x[1]}</small></div><span class="severity ${x[2]}">${x[2].toUpperCase()}</span></div>`).join('');
  $('#scheduleList').innerHTML=[['Makindye','Tomorrow • 8:00 AM'],['Kawempe','Monday • 9:00 AM'],['Nakawa','Tuesday • 10:00 AM'],['Rubaga','Wednesday • 8:30 AM']].map(x=>`<div class="schedule-row"><div><strong>${x[0]}</strong><small>Scheduled collection</small></div><strong>${x[1]}</strong></div>`).join('');
}
function renderRequests(){
  const list=state.requests;
  $('#requestsList').innerHTML=list.length?list.map(r=>`<div class="request"><div><strong>${r.material} • ${r.weight} kg</strong><small>${r.name} • ${r.area} • ${r.time}</small></div><div class="request-actions"><span class="badge ${r.status==='Completed'?'green':''}">${r.status}</span>${r.status==='Open'?`<button class="accept" data-accept="${r.id}">Accept</button>`:''}${r.status==='Accepted'?`<button class="complete" data-complete="${r.id}">Complete pickup</button>`:''}</div></div>`).join(''):'<p class="muted">No requests yet.</p>';
}
function renderMarket(){
  const materials=[['🧴','PET Plastic','286 kg','UGX 900/kg'],['📦','Paper / Cardboard','214 kg','UGX 350/kg'],['🥫','Metal','84 kg','UGX 2,400/kg'],['🫙','Glass','41 kg','UGX 200/kg'],['🪴','Organic Waste','920 kg','Compost pathway'],['♻️','Other Plastic','136 kg','Processor quote']];
  $('#marketGrid').innerHTML=materials.map(m=>`<article class="material"><div class="material-icon">${m[0]}</div><h3>${m[1]}</h3><div class="kg">${m[2]}</div><p>Aggregated recovery supply</p><span class="price">${m[3]}</span></article>`).join('');
}
function renderImpact(){
  const bars=[['PET Plastic',286,100],['Paper / Cardboard',214,75],['Metal',84,40],['Organic Waste',920,100],['Other Plastic',136,55]];
  $('#materialBars').innerHTML=bars.map(b=>`<div class="material-bar"><div class="bar-head"><span>${b[0]}</span><strong>${b[1]} kg</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,b[2])}%"></div></div></div>`).join('');
  $('#scoreValue').textContent=Math.min(100,Math.round(75+state.points/30));
  const last=state.requests.find(r=>r.status==='Completed');$('#certificateTitle').textContent=last?`Recovery CL-${String(last.id).slice(-5)}`:'CleanLoop Recovery Record';$('#certificateText').textContent=last?`${last.weight} kg of ${last.material} collected in ${last.area} and recorded as a completed recovery handover.`:'Verified material handovers create a traceable chain from collection to recovery.';
}
function renderAll(){renderStats();renderHome();renderRequests();renderMarket();renderImpact()}
renderAll();
