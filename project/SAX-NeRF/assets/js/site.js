const button=document.getElementById('copy-bibtex');
button.addEventListener('click',async()=>{const text=document.getElementById('bibtex').textContent;try{await navigator.clipboard.writeText(text);button.textContent='Copied';}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.getElementById('bibtex'));selection.removeAllRanges();selection.addRange(range);button.textContent='Select & copy';}setTimeout(()=>button.textContent='Copy',1800);});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const observer=new IntersectionObserver(entries=>{for(const {target,isIntersecting} of entries){if(isIntersecting&&!reduced.matches){target.play().catch(()=>{});}else target.pause();}},{rootMargin:'100px'});
for(const video of document.querySelectorAll('video'))observer.observe(video);
