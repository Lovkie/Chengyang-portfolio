(() => {
  const drawer = document.querySelector('#navigation');
  const toggle = document.querySelector('.menu-toggle');
  const viewer = document.querySelector('.image-dialog');
  function unlock() { if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open'); }
  toggle.addEventListener('click', () => { drawer.showModal(); document.body.classList.add('modal-open'); toggle.setAttribute('aria-expanded', 'true'); });
  drawer.querySelector('.menu-close').addEventListener('click', () => drawer.close());
  drawer.addEventListener('close', () => { toggle.setAttribute('aria-expanded', 'false'); unlock(); });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.close()));
  [drawer, viewer].forEach(dialog => dialog.addEventListener('click', e => { if (e.target !== dialog) return; const b = dialog.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close(); }));
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', unlock);
  document.querySelectorAll('.case-content img').forEach(img => {
    const existingLink = img.closest('a');
    if (existingLink) {
      existingLink.addEventListener('click', e => { e.preventDefault(); openImage(img); });
    } else {
      img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', '放大查看：' + img.alt);
      img.addEventListener('click', () => openImage(img));
      img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openImage(img); } });
    }
  });
  function openImage(img) { viewer.querySelector('img').src = img.src; viewer.querySelector('img').alt = img.alt; viewer.querySelector('p').textContent = img.alt; viewer.showModal(); document.body.classList.add('modal-open'); }
  const videos = [...document.querySelectorAll('video')];
  videos.forEach(video => {
    video.setAttribute('playsinline', '');
    if (video.dataset.src) {
      video.src = video.dataset.src; video.hidden = false;
      const card = video.closest('figure');
      if (card) { const empty = card.querySelector('.mfa-empty'); if (empty) empty.hidden = true; const status = card.querySelector('.mfa-status'); if (status) { status.textContent = '点击播放'; video.addEventListener('error', () => { status.textContent = '暂时无法播放，请稍后重试'; }); } }
    }
    video.addEventListener('play', () => videos.forEach(other => { if (video !== other) other.pause(); }));
  });
  document.querySelectorAll('[data-w]').forEach(el => { el.style.width = el.dataset.w + '%'; });
})();
// Video pages offer a direct source when remote loading is slow or fails.
document.querySelectorAll('.film-player video').forEach(video => {
  const status = document.querySelector('.video-status');
  const timer = setTimeout(() => { if (video.readyState < 1) status.textContent = '视频加载较慢，请检查网络，或点击下方链接单独打开。'; }, 12000);
  video.addEventListener('loadedmetadata', () => { clearTimeout(timer); status.textContent = '声音是作品的一部分，建议佩戴耳机观看。'; });
  video.addEventListener('error', () => { clearTimeout(timer); status.textContent = '视频暂时无法加载，请稍后重试，或点击下方链接单独打开。'; });
});
