import '../vendor/model-viewer.min.js';
const response=await fetch(new URL('../scene-manifest.json',import.meta.url));if(!response.ok)throw new Error('CT mesh index unavailable');const manifest=await response.json();
for(const viewer of document.querySelectorAll('.ct-card model-viewer')){
 const entry=manifest.scenes.find(s=>s.scene===viewer.dataset.scene);if(!entry)continue;const card=viewer.closest('.ct-card'),progress=viewer.querySelector('.card-progress'),error=card.querySelector('.card-error');
 viewer.cameraOrbit=entry.mesh_orbit||`${entry.yaw}deg ${entry.pitch}deg 155%`;
 const load=()=>{progress.hidden=true;error.hidden=true;};viewer.addEventListener('load',load);viewer.addEventListener('progress',e=>{progress.firstElementChild.style.width=`${Math.round(e.detail.totalProgress*100)}%`;});viewer.addEventListener('error',()=>{progress.hidden=true;error.hidden=false;});
 card.querySelector('.retry').addEventListener('click',()=>{error.hidden=true;progress.hidden=false;const source=viewer.src;viewer.src='';requestAnimationFrame(()=>viewer.src=source);});
 viewer.src=manifest.asset_base+entry.mesh_path;
 if(entry.poster)viewer.poster=new URL(entry.poster,new URL('../',import.meta.url)).href;
 if(viewer.loaded)load();
}
