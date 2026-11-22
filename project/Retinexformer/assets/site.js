const videos = document.querySelectorAll('.comparison video')

for (const video of videos) {
  const error = video.nextElementSibling
  const showError = () => { error.hidden = false }
  video.addEventListener('error', showError)
  if (video.error) showError()
}

const comparisons = document.querySelectorAll('.comparison')

function connectComparison(comparison) {
  const raw = comparison.querySelector('.low-light')
  const enhanced = comparison.querySelector('.enhanced')
  raw.controls = false
  let prepared = false
  let following = false

  function prepareRaw() {
    if (prepared) return
    prepared = true
    raw.preload = 'auto'
    if (!raw.readyState) raw.load()
  }

  function align(force = false) {
    if (!raw.readyState) return
    if (force || Math.abs(raw.currentTime - enhanced.currentTime) > 0.1) {
      raw.currentTime = enhanced.currentTime
    }
  }

  function startRaw() {
    if (!following || enhanced.paused || enhanced.seeking) return
    align()
    if (raw.paused) raw.play().catch(() => {})
  }

  function stopRaw() {
    following = false
    raw.pause()
  }

  enhanced.addEventListener('play', prepareRaw)
  enhanced.addEventListener('playing', () => {
    following = true
    startRaw()
  })
  enhanced.addEventListener('pause', stopRaw)
  enhanced.addEventListener('waiting', stopRaw)
  enhanced.addEventListener('seeking', () => {
    prepareRaw()
    stopRaw()
    align(true)
  })
  enhanced.addEventListener('seeked', () => {
    align(true)
    if (enhanced.readyState >= 3 && !enhanced.paused) {
      following = true
      startRaw()
    }
  })
  enhanced.addEventListener('timeupdate', () => align())
  enhanced.addEventListener('ratechange', () => { raw.playbackRate = enhanced.playbackRate })
  enhanced.addEventListener('error', () => { raw.controls = true })
  raw.addEventListener('loadedmetadata', () => align(true))
  raw.addEventListener('canplay', startRaw)
  return enhanced
}

const players = new Map(Array.from(comparisons, comparison => [comparison, connectComparison(comparison)]))
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const resumeWhenVisible = new WeakSet(comparisons)
  const observer = new IntersectionObserver((entries) => {
    for (const { target: comparison, intersectionRatio } of entries) {
      const video = players.get(comparison)
      const visible = intersectionRatio >= 0.45
      if (visible && resumeWhenVisible.has(comparison)) {
        resumeWhenVisible.delete(comparison)
        video.play().catch(() => {})
      } else if (!visible && !video.paused) {
        resumeWhenVisible.add(comparison)
        video.pause()
      }
    }
  }, { threshold: 0.45 })

  for (const comparison of comparisons) observer.observe(comparison)
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
