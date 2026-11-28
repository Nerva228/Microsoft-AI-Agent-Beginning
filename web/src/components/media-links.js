import { escapeHtml } from '../utils/dom.js';

export function renderVideoSectionHtml(videos, selectedVideoIdx = 0) {
  if (!videos || videos.length === 0) {
    return `
      <div class="card" style="background:var(--bg-subtle);margin-top:14px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.35rem;">📘</span>
          <div style="font-size:0.88rem;color:var(--text-secondary);">
            <strong>圖文與實作導向課程：</strong>本課官方以互動架構圖與 Jupyter Notebook 實戰為主（無附短片），可搭配上方重點卡與切至「模擬器／程式碼／延伸資源」分頁深入體驗！
          </div>
        </div>
      </div>
    `;
  }

  const vid = videos[selectedVideoIdx] || videos[0];
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid.youtubeId)}?rel=0&playsinline=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(vid.youtubeId)}`;

  return `
    <div class="video-card" aria-label="本課教學影片">
      <div class="section-eyebrow">🎬 官方教學影片（支援頁內觀看或開啟 YouTube App）</div>
      ${
        videos.length > 1
          ? `<div class="chip-scroller" style="padding-bottom:10px;">
              ${videos
                .map(
                  (v, idx) => `
                <button
                  type="button"
                  id="video-switch-btn-${idx}"
                  class="filter-chip ${idx === selectedVideoIdx ? 'is-selected' : ''}"
                  data-vid-idx="${idx}"
                >影片 ${idx + 1}</button>`
                )
                .join('')}
            </div>`
          : ''
      }
      <h3 style="margin:0 0 8px;font-size:1.02rem;">${escapeHtml(vid.title)}</h3>
      <div class="video-ratio">
        <iframe
          src="${embedUrl}"
          title="${escapeHtml(vid.title)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;">
        <span style="font-size:0.8rem;color:var(--text-muted);">${escapeHtml(vid.note)}</span>
        <a
          href="${watchUrl}"
          target="_blank"
          rel="noopener noreferrer"
          id="open-youtube-external-btn"
          class="btn btn--sm"
        >📺 在 YouTube 開啟（開自動繁中字幕／倍速）↗</a>
      </div>
    </div>
  `;
}

export function renderResourcesHtml(resources) {
  return `
    <div class="resource-list">
      ${resources
        .map(
          (r, idx) => `
        <a
          href="${escapeHtml(r.url)}"
          target="_blank"
          rel="noopener noreferrer"
          id="resource-link-${idx}"
          class="resource-item"
        >
          <div style="min-width:0;">
            <span class="resource-type">${escapeHtml(r.type)}</span>
            <div style="font-weight:800;font-size:0.93rem;word-break:break-word;">${escapeHtml(r.title)}</div>
            ${
              r.note
                ? `<div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px;">${escapeHtml(r.note)}</div>`
                : ''
            }
          </div>
          <span style="font-weight:800;color:var(--brand-text);flex-shrink:0;">開啟 ↗</span>
        </a>`
        )
        .join('')}
    </div>
  `;
}
