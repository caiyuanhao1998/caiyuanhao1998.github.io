const videos = document.querySelectorAll('.comparison video')

for (const video of videos) {
  const error = video.nextElementSibling
  const showError = () => { error.hidden = false }
  video.addEventListener('error', showError)
  if (video.error) showError()
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const resumeWhenVisible = new WeakSet(videos)
  const observer = new IntersectionObserver((entries) => {
    for (const { target: video, intersectionRatio } of entries) {
      const isVisible = intersectionRatio >= 0.5
      if (isVisible && resumeWhenVisible.has(video)) {
        resumeWhenVisible.delete(video)
        video.play().catch(() => {})
      } else if (!isVisible && !video.paused) {
        resumeWhenVisible.add(video)
        video.pause()
      }
    }
  }, { threshold: 0.5 })

  for (const video of videos) observer.observe(video)
}

const copyButton = document.querySelector('#copy-bibtex')
const citation = document.querySelector('#bibtex-entry')
const copyStatus = document.querySelector('#copy-status')

if (navigator.clipboard?.writeText) {
  copyButton.hidden = false
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent)
      copyButton.textContent = 'Copied'
      copyStatus.textContent = 'BibTeX copied to the clipboard.'
    } catch {
      const selection = window.getSelection()
      selection.selectAllChildren(citation)
      copyStatus.textContent = 'BibTeX selected. Use your browser’s copy command.'
    }
  })
}
