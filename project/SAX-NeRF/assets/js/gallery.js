import '../vendor/model-viewer.min.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const response=await fetch(new URL('../scene-manifest.json?v=sax-full-100',import.meta.url));
if(!response.ok)throw new Error('CT mesh index unavailable');
const manifest=await response.json();
const visibility=new IntersectionObserver(entries=>{for(const {target,isIntersecting} of entries)target.autoRotate=isIntersecting&&!reduce.matches;},{rootMargin:'80px'});
for(const viewer of document.querySelectorAll('model-viewer')){
 const entry=manifest.scenes.find(s=>s.scene===viewer.dataset.scene);if(!entry)continue;
 const card=viewer.closest('.ct-card'),progress=viewer.querySelector('.card-progress'),error=card.querySelector('.card-error');
 viewer.cameraOrbit=entry.orbit||'-35deg 65deg 155%';
 const ready=()=>{viewer.dismissPoster();viewer.resetTurntableRotation(0);viewer.jumpCameraToGoal();progress.hidden=true;error.hidden=true;};
 viewer.addEventListener('load',ready);
 viewer.addEventListener('progress',e=>{progress.firstElementChild.style.width=`${Math.round(e.detail.totalProgress*100)}%`;});
 viewer.addEventListener('error',()=>{progress.hidden=true;error.hidden=false;});
 card.querySelector('.retry').addEventListener('click',()=>{error.hidden=true;progress.hidden=false;const source=viewer.src;viewer.src='';requestAnimationFrame(()=>viewer.src=source);});
 viewer.src=new URL('../../'+entry.mesh_path,import.meta.url).href;
 visibility.observe(viewer);
 if(viewer.loaded)ready();
}
