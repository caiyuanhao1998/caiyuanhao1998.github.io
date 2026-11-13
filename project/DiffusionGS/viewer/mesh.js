const viewer = document.getElementById('mesh');
const status = document.getElementById('mesh-status');
const progress = document.querySelector('#progress span');
const rotation = document.getElementById('rotation');
const initialOrbit = '-45deg 70deg 120%';
const dataset = 'https://huggingface.co/datasets/CaiYuanhao/DiffusionGS/resolve/main/';

viewer.addEventListener('progress', ({detail}) => {
  progress.style.width = `${Math.round(detail.totalProgress * 100)}%`;
});
viewer.addEventListener('load', () => {
  status.hidden = true;
  document.getElementById('progress').hidden = true;
});
viewer.addEventListener('error', () => {
  status.hidden = false;
  status.textContent = 'This mesh could not be loaded. Refresh the page or download the file above.';
});
rotation.addEventListener('click', () => {
  viewer.autoRotate = !viewer.autoRotate;
  rotation.setAttribute('aria-pressed', String(viewer.autoRotate));
  rotation.textContent = viewer.autoRotate ? 'Pause rotation' : 'Resume rotation';
});
document.getElementById('reset').addEventListener('click', () => {
  viewer.cameraOrbit = initialOrbit;
  viewer.cameraTarget = 'auto auto auto';
  viewer.jumpCameraToGoal();
});

try {
  const response = await fetch('./mesh-manifest.json');
  if (!response.ok) throw new Error('Mesh index unavailable');
  const manifest = await response.json();
  const id = new URLSearchParams(location.search).get('asset');
  const asset = manifest.objects.find(item => item.id === id);
  if (!asset) throw new Error('Unknown object');
  document.getElementById('case-title').textContent = asset.id.replace('/', ' / ');
  document.title = `${asset.id} · Exported Mesh · DiffusionGS`;
  const cloud = document.getElementById('point-cloud');
  const cloudURL = new URL('./index.html', location.href);
  cloudURL.searchParams.set('url', dataset + asset.source_path);
  cloudURL.searchParams.set('is_object', 'true');
  cloud.href = cloudURL.href;
  cloud.hidden = false;
  for (const [element, path] of [['download-glb', asset.glb_path], ['download-obj', asset.obj_path]]) {
    const link = document.getElementById(element);
    link.href = dataset + path + '?download=true';
    link.hidden = false;
  }
  await customElements.whenDefined('model-viewer');
  viewer.src = dataset + asset.glb_path;
} catch (error) {
  status.hidden = false;
  status.textContent = 'This object is unavailable. Return to the DiffusionGS project page to choose a case.';
  document.getElementById('progress').hidden = true;
}
