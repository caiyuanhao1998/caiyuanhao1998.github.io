const viewer = document.getElementById('mesh');
const status = document.getElementById('mesh-status');
const progress = document.querySelector('#progress span');
const rotation = document.getElementById('rotation');
let initialOrbit = '-35deg 65deg 135%';
viewer.addEventListener('progress', ({detail}) => {
  progress.style.width = `${Math.round(detail.totalProgress * 100)}%`;
});
viewer.addEventListener('load', () => {
  status.hidden = true;
  document.getElementById('progress').hidden = true;
});
viewer.addEventListener('error', () => {
  status.hidden = false;
  status.textContent = 'Unable to load the mesh. Refresh the page or download the GLB above.';
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
  const response = await fetch(new URL('../assets/scene-manifest.json', import.meta.url));
  if (!response.ok) throw new Error('Scene index unavailable');
  const manifest = await response.json();
  const scene = new URLSearchParams(location.search).get('scene') || 'head';
  const entry = manifest.scenes.find(item => item.scene === scene);
  if (!entry) throw new Error('Unknown scene');
  document.getElementById('case-title').textContent = `${entry.name} · Exported Mesh`;
  document.title = `${entry.name} · Exported Mesh · X-Gaussian`;
  viewer.setAttribute('aria-label', `Interactive ${entry.name} CT mesh`);
  const xray = document.getElementById('xray');
  xray.href = `index.html?scene=${encodeURIComponent(entry.scene)}`;
  xray.hidden = false;
  const source = manifest.asset_base + entry.mesh_path;
  const download = document.getElementById('download-glb');
  download.href = source + '?download=true';
  download.hidden = false;
  await customElements.whenDefined('model-viewer');
  initialOrbit = entry.mesh_orbit || `${entry.yaw}deg ${entry.pitch}deg 135%`;
  viewer.cameraOrbit = initialOrbit;
  viewer.src = source;
} catch (error) {
  status.hidden = false;
  status.textContent = 'Unable to open this mesh: ' + error.message;
  document.getElementById('progress').hidden = true;
}
