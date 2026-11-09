/* 오늘도 1도 마음온도 — optional, recorded acoustic piano performance.
   No generated notes, synthetic chimes, nature sounds, or autoplay. */
(() => {
  'use strict';

  const header = document.querySelector('.header-actions');
  if (!header) return;

  header.insertAdjacentHTML('beforeend', `
    <div class="ambience-control" aria-label="마음정원 피아노 음악">
      <button type="button" class="ambience-toggle" id="ambience-toggle" aria-pressed="false" aria-label="피아노 음악 켜기" title="잔잔한 피아노 음악 듣기">
        <svg class="ambience-speaker" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round">
          <path d="M4 9h4l5-4v14l-5-4H4z"/><path class="ambience-wave" d="M16 9q4 3 0 6M19 6q7 6 0 12"/>
        </svg>
        <span class="ambience-label">음악 켜기</span>
      </button>
      <button type="button" class="ambience-settings-button" id="ambience-settings-button" aria-label="피아노 음악 음량 조절" aria-controls="ambience-panel" aria-expanded="false" title="음량 조절">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="#f8f7e9"/><circle cx="16" cy="12" r="2" fill="#f8f7e9"/><circle cx="11" cy="17" r="2" fill="#f8f7e9"/></svg>
      </button>
      <div class="ambience-panel" id="ambience-panel" hidden>
        <strong>마음정원의 피아노</strong>
        <p>사람이 실제 피아노로 연주한 잔잔한 곡이에요. 자연음과 전자 효과음은 없어요.</p>
        <label for="ambience-volume">음량 <output id="ambience-volume-value">70%</output></label>
        <input type="range" id="ambience-volume" min="0" max="100" step="5" value="70" aria-label="피아노 음악 음량">
        <small id="ambience-status" role="status" aria-live="polite">음악은 꺼져 있어요. 음악 켜기를 누르면 시작돼요.</small>
        <small>소리가 작다면 휴대폰의 <strong>미디어 음량</strong>도 확인해 주세요.</small>
        <small class="ambience-credit">곡: 에릭 사티 〈짐노페디 1번〉 · 연주: Robin Alciatore (Musopen, 공개 음원) <a href="https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg" target="_blank" rel="noopener noreferrer">음원 정보</a></small>
      </div>
      <audio id="ambience-piano-track" preload="metadata" loop playsinline src="./art/gymnopedie-acoustic-piano-v14.mp3"></audio>
    </div>`);

  const toggle = document.getElementById('ambience-toggle');
  const settingsButton = document.getElementById('ambience-settings-button');
  const panel = document.getElementById('ambience-panel');
  const slider = document.getElementById('ambience-volume');
  const volumeValue = document.getElementById('ambience-volume-value');
  const soundStatus = document.getElementById('ambience-status');
  const track = document.getElementById('ambience-piano-track');
  let starting = false;

  const VOLUME_KEY = 'mindtemp_piano_volume_v14';
  let volume = 70;
  try {
    const preference = localStorage.getItem(VOLUME_KEY);
    const value = Number(preference);
    if (preference !== null && Number.isFinite(value) && value >= 0 && value <= 100) {
      volume = value;
    }
  } catch { /* Remembering a preference is optional. */ }

  function applyVolume() {
    track.volume = Math.pow(volume / 100, 0.70);
    slider.value = String(volume);
    volumeValue.textContent = `${volume}%`;
  }

  function updateControls() {
    const playing = !track.paused && !track.ended;
    toggle.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? '피아노 음악 끄기' : '피아노 음악 켜기');
    toggle.title = playing ? '피아노 음악 잠시 끄기' : '잔잔한 피아노 음악 듣기';
    toggle.querySelector('.ambience-label').textContent = playing ? '음악 끄기' : '음악 켜기';
    soundStatus.textContent = playing
      ? '잔잔한 피아노를 재생하고 있어요.'
      : '음악은 꺼져 있어요. 음악 켜기를 누르면 시작돼요.';
  }

  applyVolume();
  updateControls();

  toggle.addEventListener('click', () => {
    if (starting) return;
    if (!track.paused) {
      track.pause();
      updateControls();
      return;
    }
    starting = true;
    soundStatus.textContent = '피아노 음악을 불러오고 있어요…';
    // Call play() directly inside the user's click for Android/iOS audio permissions.
    const playRequest = track.play();
    if (!playRequest || typeof playRequest.then !== 'function') {
      starting = false;
      updateControls();
      return;
    }
    playRequest.then(() => {
      starting = false;
      updateControls();
    }).catch(() => {
      starting = false;
      updateControls();
      soundStatus.textContent = '음악을 시작하지 못했어요. 인터넷 연결과 휴대폰 미디어 음량을 확인해 주세요.';
    });
  });

  slider.addEventListener('input', () => {
    volume = Number(slider.value);
    applyVolume();
    try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch { /* optional */ }
    if (volume === 0) soundStatus.textContent = '음량이 0%예요. 슬라이더를 올려 주세요.';
    else updateControls();
  });

  function closePanel() {
    panel.hidden = true;
    settingsButton.setAttribute('aria-expanded', 'false');
  }

  settingsButton.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    settingsButton.setAttribute('aria-expanded', String(!panel.hidden));
  });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !event.target.closest('.ambience-control')) closePanel();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePanel();
  });

  track.addEventListener('play', updateControls);
  track.addEventListener('pause', updateControls);
  track.addEventListener('error', () => {
    updateControls();
    soundStatus.textContent = '피아노 음악 파일을 불러오지 못했어요. 연결 상태를 확인한 뒤 다시 눌러 주세요.';
  });

  document.addEventListener('visibilitychange', () => {
    // A quiet, private pause when the child leaves the site.
    if (document.hidden && !track.paused) track.pause();
  });
})();
