import { BADGES, REPO_BASE_URL } from '../data/index.js';
import {
  getState,
  getCurrentRank,
  getCompletionSummary,
  getUnlockedBadges,
  exportProgressCode,
  importProgressCode,
  resetProgress
} from '../state/store.js';
import { escapeHtml, showToast } from '../utils/dom.js';

export function renderProfileView(container) {
  function render() {
    const st = getState();
    const { current: rank, next: nextRank } = getCurrentRank(st.xp);
    const summary = getCompletionSummary(st);
    const unlockedSet = new Set(getUnlockedBadges(st).map((b) => b.id));
    const syncCode = exportProgressCode();

    container.innerHTML = `
      <section aria-labelledby="profile-heading" style="display:flex;flex-direction:column;gap:18px;">
        <div class="section-header" style="margin-bottom:0;">
          <div class="section-eyebrow">Profile & PWA Sync · 學習戰績與手機安裝指南</div>
          <h1 id="profile-heading" class="page-title">成就徽章與跨裝置進度同步</h1>
          <p class="page-subtitle">
            隨時把這個學習網「加入手機主畫面」當成原生 App 使用，並可透過進度碼無縫轉移紀錄。
          </p>
        </div>

        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
            <div>
              <div style="font-size:1.3rem;font-weight:800;">${rank.emoji} ${escapeHtml(rank.title)}</div>
              <div style="font-size:0.86rem;color:var(--text-secondary);">
                累積經驗值：<strong>${st.xp} XP</strong> · 連續學習：<strong>🔥 ${st.streak} 天</strong> · 已通關：<strong>${summary.passed}/${summary.total} 課</strong>
              </div>
            </div>
            <span class="tag-pill">解鎖徽章 ${unlockedSet.size} / ${BADGES.length}</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${summary.percent}%"></div>
          </div>
          ${
            nextRank
              ? `<p style="margin:8px 0 0;font-size:0.8rem;color:var(--text-muted);">
                  距離下一階稱號「${nextRank.emoji} ${escapeHtml(nextRank.title)}」還差 ${nextRank.minXp - st.xp} XP！
                </p>`
              : ''
          }
        </div>

        <div class="card">
          <div class="section-eyebrow">🏅 12 枚技能成就徽章櫃</div>
          <h2 style="margin:0 0 12px;font-size:1.12rem;">完成模擬器、架構決策與章節測驗即可點亮</h2>
          <div class="badge-grid">
            ${BADGES.map((b) => {
              const unlocked = unlockedSet.has(b.id);
              return `
                <div class="badge-card ${unlocked ? '' : 'is-locked'}">
                  <span class="badge-emoji">${b.emoji}</span>
                  <div style="font-weight:800;font-size:0.88rem;margin-bottom:4px;">${escapeHtml(b.name)}</div>
                  <div style="font-size:0.75rem;color:var(--text-secondary);">${escapeHtml(b.desc)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <div class="section-eyebrow">📱 手機「加入主畫面」全螢幕 App 指南（PWA）</div>
          <h2 style="margin:0 0 10px;font-size:1.12rem;">三秒鐘安裝到手機桌面，通勤離線也能開！</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">
            <div style="padding:13px;border-radius:var(--radius-md);background:var(--bg-subtle);">
              <strong>🍎 iPhone / iPad (Safari)</strong>
              <ol style="margin:8px 0 0;padding-left:18px;font-size:0.86rem;color:var(--text-secondary);">
                <li>用 Safari 打開本網站網址</li>
                <li>點選底部中間的「<strong>分享</strong>（方框向上箭頭）」圖示</li>
                <li>往下滑點選「<strong>加入主畫面</strong>」→ 右上角按新增！</li>
              </ol>
            </div>
            <div style="padding:13px;border-radius:var(--radius-md);background:var(--bg-subtle);">
              <strong>🤖 Android (Chrome / Edge)</strong>
              <ol style="margin:8px 0 0;padding-left:18px;font-size:0.86rem;color:var(--text-secondary);">
                <li>用 Chrome 打開本網站網址</li>
                <li>點選右上角「<strong>⋮</strong>」選單</li>
                <li>點選「<strong>安裝應用程式</strong>」或「<strong>加到主畫面</strong>」即可！</li>
              </ol>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-eyebrow">🔄 App 同步更新與進度備份碼（v1.1.0）</div>
          <h2 style="margin:0 0 8px;font-size:1.12rem;">保留進度自動更新 ＋ 跨裝置備份碼</h2>
          <p style="margin:0 0 10px;font-size:0.85rem;color:var(--text-secondary);">
            版本更新只會刷新介面與課程圖表快取，你的 XP、連續天數與通關紀錄皆安全保存在本機 <code>localStorage</code>（請勿移除桌面 App 圖示）。若想跨裝置轉移，可使用下方備份碼。
          </p>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <button type="button" id="check-pwa-update-btn" class="btn btn--sm">🔄 檢查最新版本</button>
            <button type="button" id="copy-sync-code-btn" class="btn btn--primary btn--sm">📋 一鍵複製目前進度備份碼</button>
          </div>

          <label for="import-sync-textarea" style="display:block;font-size:0.83rem;font-weight:700;margin-bottom:6px;">
            貼上進度備份碼還原紀錄：
          </label>
          <textarea
            id="import-sync-textarea"
            rows="2"
            placeholder="在此貼上 AQTW1:... 開頭的進度備份碼"
            style="width:100%;padding:10px;border-radius:var(--radius-sm);border:1.5px solid var(--border-strong);background:var(--bg-canvas);font-family:var(--font-mono);font-size:0.78rem;"
          ></textarea>

          <div style="display:flex;justify-content:space-between;gap:10px;margin-top:10px;flex-wrap:wrap;">
            <button type="button" id="import-sync-btn" class="btn btn--sm">📥 匯入並套用進度碼</button>
            <button type="button" id="reset-progress-btn" class="btn btn--sm" style="color:var(--coral-text);">🗑️ 重置本機進度</button>
          </div>

          <details style="margin-top:12px;font-size:0.8rem;color:var(--text-muted);">
            <summary style="cursor:pointer;">檢視我的原始備份碼字串（供手動選取複製）</summary>
            <pre style="white-space:pre-wrap;word-break:break-all;background:var(--bg-sunken);padding:10px;border-radius:8px;margin-top:6px;">${escapeHtml(syncCode)}</pre>
          </details>
        </div>

        <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
          <div>
            <strong>📂 原始 GitHub 專案課程庫</strong>
            <div style="font-size:0.83rem;color:var(--text-secondary);">想回電腦下載完整 Python 3.12 範例與 .env.example？</div>
          </div>
          <a href="${REPO_BASE_URL}" target="_blank" rel="noopener noreferrer" class="btn btn--sm">前往 GitHub Repo ↗</a>
        </div>
      </section>
    `;

    container.querySelector('#check-pwa-update-btn')?.addEventListener('click', async () => {
      if (!('serviceWorker' in navigator)) {
        window.location.reload();
        return;
      }
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) {
          window.location.reload();
          return;
        }
        await reg.update();
        if (reg.installing || reg.waiting) {
          showToast('🚀 發現新版本，正在自動更新並保留學習進度…');
        } else {
          showToast('✅ 目前已是最新版本（v1.1.0），學習進度完整保留！');
        }
      } catch {
        showToast('⚠️ 無法連線檢查更新，請確認網路後再試。');
      }
    });

    container.querySelector('#copy-sync-code-btn')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(syncCode);
        showToast('✅ 已複製進度備份碼！可直接貼到手機主畫面 App 匯入。');
      } catch {
        showToast('請展開下方「檢視原始備份碼字串」手動長按複製！');
      }
    });

    container.querySelector('#import-sync-btn')?.addEventListener('click', () => {
      const val = container.querySelector('#import-sync-textarea')?.value || '';
      try {
        importProgressCode(val);
        showToast('🎉 進度備份碼匯入成功！學習紀錄已完整還原！');
        render();
      } catch (err) {
        showToast(`⚠️ 匯入失敗：${err.message}`);
      }
    });

    container.querySelector('#reset-progress-btn')?.addEventListener('click', () => {
      if (window.confirm('確定要清空目前瀏覽器的學習進度與 XP 嗎？（建議先複製備份碼保存）')) {
        resetProgress();
        showToast('已重置本機學習紀錄');
        render();
      }
    });
  }

  render();
}
