'use strict';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes=[...document.querySelectorAll('.scene')];
for(const scene of scenes){
 const videos=[...scene.querySelectorAll('video')];
 for(const video of videos){
  if(reducedMotion)video.autoplay=false;
  video.addEventListener('error',()=>{video.parentElement.querySelector('.video-error').hidden=false});
  video.querySelector('source').addEventListener('error',()=>{video.parentElement.querySelector('.video-error').hidden=false});
 }

}
const observer=new IntersectionObserver(entries=>{for(const entry of entries){const pair=[...entry.target.querySelectorAll('video')];if(entry.isIntersecting){for(const v of pair){const source=v.querySelector('source');if(!source.src){source.src=source.dataset.src;v.load()}}if(!reducedMotion){const ready=pair.map(v=>new Promise(resolve=>{if(v.readyState>=2)resolve();else v.addEventListener('loadeddata',resolve,{once:true})}));Promise.all(ready).then(()=>{if(entry.target.dataset.visible==='true')for(const v of pair)v.play().catch(()=>{})})}entry.target.dataset.visible='true'}else{entry.target.dataset.visible='false';for(const v of pair)v.pause()}}},{rootMargin:'100px 0px',threshold:.05});
scenes.forEach(s=>observer.observe(s));
document.getElementById('copy-bibtex').addEventListener('click',async()=>{const button=document.getElementById('copy-bibtex');const status=document.getElementById('copy-status');const text=document.getElementById('bibtex').textContent;try{await navigator.clipboard.writeText(text);button.textContent='Copied';status.textContent='Citation copied to clipboard.';setTimeout(()=>button.textContent='Copy',1800)}catch{const range=document.createRange();range.selectNodeContents(document.getElementById('bibtex'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Citation selected. Press Ctrl+C or Command+C to copy.'}});
