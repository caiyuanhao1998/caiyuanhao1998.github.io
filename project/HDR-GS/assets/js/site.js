'use strict';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes=[...document.querySelectorAll('.scene')];
for(const scene of scenes){
 const videos=[...scene.querySelectorAll('video')];
 // Keep a scene's LDR and HDR videos aligned when using playback controls.
 let syncing=false;
 for(const video of videos){
   video.addEventListener('seeking',()=>{if(syncing)return;syncing=true;for(const other of videos)if(other!==video&&other.readyState>=2&&Math.abs(other.currentTime-video.currentTime)>.04)other.currentTime=video.currentTime;syncing=false});
   video.addEventListener('play',()=>{if(scene.dataset.visible!=='true')return;for(const other of videos)if(other!==video&&other.paused)other.play().catch(()=>{})});
   video.addEventListener('pause',()=>{for(const other of videos)if(other!==video&&!other.paused)other.pause()});
 }
 setInterval(()=>{if(scene.dataset.visible!=='true'||videos.length!==2)return;const [a,b]=videos;if(!a.paused&&!b.paused&&a.readyState>=2&&b.readyState>=2&&Math.abs(a.currentTime-b.currentTime)>.10)b.currentTime=a.currentTime},500);
 for(const video of videos){
  if(reducedMotion)video.autoplay=false;
  const error=video.parentElement.querySelector('.video-error');
  const clearError=()=>{error.hidden=true};
  const showError=()=>{if(video.error&&video.querySelector('source').hasAttribute('src'))error.hidden=false};
  video.addEventListener('loadstart',clearError);
  video.addEventListener('loadeddata',clearError);
  video.addEventListener('canplay',clearError);
  video.addEventListener('error',showError);
 }

}
const observer=new IntersectionObserver(entries=>{for(const entry of entries){const pair=[...entry.target.querySelectorAll('video')];if(entry.isIntersecting){for(const v of pair){const source=v.querySelector('source');if(!source.src){source.src=source.dataset.src;v.load()}}if(!reducedMotion){const ready=pair.map(v=>new Promise(resolve=>{if(v.readyState>=2)resolve();else v.addEventListener('loadeddata',resolve,{once:true})}));Promise.all(ready).then(()=>{if(entry.target.dataset.visible==='true')for(const v of pair)v.play().catch(()=>{})})}entry.target.dataset.visible='true'}else{entry.target.dataset.visible='false';for(const v of pair)v.pause()}}},{rootMargin:'100px 0px',threshold:.05});
scenes.forEach(s=>observer.observe(s));
document.getElementById('copy-bibtex').addEventListener('click',async()=>{const button=document.getElementById('copy-bibtex');const status=document.getElementById('copy-status');const text=document.getElementById('bibtex').textContent;try{await navigator.clipboard.writeText(text);button.textContent='Copied';status.textContent='Citation copied to clipboard.';setTimeout(()=>button.textContent='Copy',1800)}catch{const range=document.createRange();range.selectNodeContents(document.getElementById('bibtex'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Citation selected. Press Ctrl+C or Command+C to copy.'}});
