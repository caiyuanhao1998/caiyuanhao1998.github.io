// Match the loaded cloud against the published mesh index, including cases
// whose existing point-cloud URLs use is_object=true for scene results.
(async () => {
    const link = document.getElementById('exported-mesh');
    const download = document.getElementById('download-point-cloud');
    const cloud = new URLSearchParams(location.search).get('url');
    if (!cloud) return;

    try {
        const source = new URL(cloud, location.href);
        const dataset = new URL('https://huggingface.co/datasets/CaiYuanhao/DiffusionGS/resolve/main/');
        if (source.origin !== dataset.origin || !source.pathname.startsWith(dataset.pathname)) return;
        if (!source.pathname.endsWith('.ply')) return;

        const file = new URL(source.href);
        file.searchParams.set('download', 'true');
        file.hash = '';
        download.href = file.href;
        download.download = decodeURIComponent(source.pathname.split('/').pop());
        download.hidden = false;
        document.body.classList.add('has-cloud-download');

        const response = await fetch('./mesh-manifest.json');
        if (!response.ok) throw new Error('Mesh index unavailable');
        const manifest = await response.json();
        const path = decodeURIComponent(source.pathname.slice(dataset.pathname.length));
        const asset = manifest.objects.find(item => item.source_path === path);
        if (!asset) return;

        const destination = new URL('./mesh.html', location.href);
        destination.searchParams.set('asset', asset.id);
        link.href = destination.href;
        link.hidden = false;
        document.body.classList.add('has-exported-mesh');
    } catch (error) {
        console.warn('Mesh navigation unavailable:', error);
    }
})();
