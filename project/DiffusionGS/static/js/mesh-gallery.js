import '../vendor/model-viewer.min.js';

for (const viewer of document.querySelectorAll('#exported-mesh model-viewer')) {
  const progress = viewer.querySelector('.mesh-gallery-progress');
  const errorMessage = viewer.closest('.mesh-result').querySelector('.mesh-gallery-error');
  viewer.addEventListener('progress', ({detail}) => {
    progress.firstElementChild.style.width = `${Math.round(detail.totalProgress * 100)}%`;
  });
  const loaded = () => { progress.hidden = true; };
  viewer.addEventListener('load', loaded);
  viewer.addEventListener('error', () => {
    if (!viewer.isConnected) return;
    progress.hidden = true;
    errorMessage.hidden = false;
  });
  if (viewer.loaded) loaded();
}
