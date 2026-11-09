(function () {
  'use strict';
  if (typeof main === 'undefined' || typeof go !== 'function') return;

  const oldGo = go;
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
  function sceneIcon(name) {
    const art={
      greenhouse:'<path d="M31 54V31" fill="none"/><path d="M31 36C13 37 10 21 14 13c15-1 21 7 17 23ZM32 31c0-15 8-22 21-20 1 13-7 22-21 20Z" fill="#a7d184"/><path d="M17 56h28" fill="none"/>',
      drawer:'<rect x="9" y="10" width="46" height="45" rx="7" fill="#eab993"/><path d="M7 13h50"/><rect x="14" y="20" width="36" height="13" rx="3" fill="#f6dbb6"/><rect x="14" y="37" width="36" height="13" rx="3" fill="#f6dbb6"/><path d="M29 26h6M29 43h6"/>',
      tree:'<path d="M30 56V25M30 39 16 29M30 32l14-15" fill="none"/><path d="M15 31c-9-2-10-12-2-18 11-1 15 7 10 15M33 25c-6-10 2-22 14-18 8 9 3 20-9 22M32 38c9-11 20-8 23 2-3 11-15 12-22 4" fill="#a3cf7b"/><path d="M17 56h27"/>',
      pond:'<path d="M7 46q11-7 23 0t27 0M8 54q11-7 23 0t26 0" fill="none" stroke="#599d9e"/><path d="M12 37Q25 20 40 33L29 42Q19 47 12 37Z" fill="#9fcf85"/><circle cx="44" cy="27" r="7" fill="#f8d99c"/>',
      mailbox:'<rect x="7" y="16" width="50" height="35" rx="7" fill="#f8d5c2"/><path d="m10 19 22 18 22-18" fill="none"/><path d="M31 26c-8-9-13 6 1 12 14-6 9-21-1-12Z" fill="#e58b93"/>',
      mood:'<circle cx="24" cy="26" r="12" fill="#f7d67c"/><path d="M24 6v6M24 40v6M4 26h6M38 26h6M9 11l4 4M35 37l4 4" fill="none"/><path d="M27 47c-10-10 5-18 12-11 9-8 20 4 12 12Z" fill="#f8f8ed"/>',
      release:'<path d="M7 37h50L46 51H18Z" fill="#f2d3a8"/><path d="M31 14v23L14 34ZM32 14l18 20-18 3Z" fill="#fef9e7"/><path d="M12 56q7-4 14 0t15 0t14 0" fill="none" stroke="#5a9c9a"/>',
      plane:'<path d="M6 33 58 8 39 57 28 39Z" fill="#fbefd2"/><path d="M28 39 58 8 36 43 39 57" fill="#acd3b1"/><path d="M6 33 28 39"/><path d="M5 51q9-5 15-1" stroke="#639da0"/>',
      fire:'<path d="M16 50q-4-14 11-27 1 10 8 5 2-9 1-19 28 19 18 41-7 13-20 11-13-1-18-11Z" fill="#f59b5e"/><path d="M28 51q-2-8 9-17 11 13 4 19-4 6-13-2Z" fill="#f8d986"/><path d="m17 58 30-8M47 58 17 50" stroke="#8d693f"/>',
      help:'<path d="M32 54C9 40 4 26 12 15c7-9 16-7 20 0 7-11 20-9 24 2 5 14-10 27-24 37Z" fill="#f3c8b8"/><path d="M32 22v17M24 31h16" stroke="#fffaf0" stroke-width="5"/>',
      records:'<path d="M8 14q13-5 24 2 11-7 24-2v39q-13-5-24 2-11-7-24-2Z" fill="#f7efd5"/><path d="M32 16v39M14 24q6-2 12 1M14 33q6-2 12 1M39 25q6-2 11-1M39 34q6-2 11-1" fill="none"/>',
      sun:'<circle cx="32" cy="32" r="15" fill="#f8d477"/><path d="M32 4v9M32 51v9M4 32h9M51 32h9M12 12l7 7M45 45l7 7M52 12l-7 7M19 45l-7 7"/>',
      cloud:'<path d="M14 46C1 43 6 25 20 25c5-19 28-18 32 1 15 0 17 23-1 23H17Z" fill="#e7eee3"/>',
      rain:'<path d="M12 38C0 33 8 18 20 20c6-17 28-14 31 1 15 1 14 19-1 19H14Z" fill="#dceae6"/><path d="m18 47-5 11M34 47l-5 11M49 47l-5 11" stroke="#5ca1b0"/>',
      storm:'<path d="M12 34C0 29 7 15 20 17c7-16 27-13 31 2 15 1 14 18-1 18H14Z" fill="#b5c3bc"/><path d="m34 36-9 15h9l-5 11 19-21H36Z" fill="#f6d36f"/>',
      unsure:'<path d="M32 5c16 0 26 11 26 25S47 55 32 55 7 44 7 30 17 5 32 5Z" fill="#d7e9cb"/><path d="M24 22c1-10 17-10 17 1 0 6-9 7-9 14M32 45v1" fill="none"/>'
    };
    return `<svg class="story-icon" viewBox="0 0 64 64" fill="none" stroke="#514334" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${art[name]||art.greenhouse}</svg>`;
  }
  const weatherArt = {'맑아요':'sun','구름이 있어요':'cloud','비가 와요':'rain','천둥이 쳐요':'storm','잘 모르겠어요':'unsure'};
  function illustratedWeather(art) {
    return `<img src="./art/weather-${art}-v9.png" alt="" loading="eager" decoding="async">`;
  }
  function weatherScene(name) {
    const art=weatherArt[name]||'sun';
    return `<div class="weather-story-scene weather-${art}" aria-hidden="true"><div class="weather-detail-art">${illustratedWeather(art)}</div></div>`;
  }
  function weatherResponse() {
    return selectedWeather?`${weatherScene(selectedWeather)}<small>오늘 나에게 필요한 말</small><h2>${weather[selectedWeather]}</h2>${weatherNextButton()}`:'오늘 내 마음에 가까운 것을 골라 봐요.';
  }
  const places = [
    ['greenhouse','오늘 내 마음','🌤️','마음의 날씨 알아보기'],
    ['drawer','마음 서랍','🗄️','복잡한 생각 잠깐 놓기'],
    ['release','마음 놓아주기','🛶','종이배·비행기·모닥불'],
    ['tree','나를 데우는 말','🌳','다정한 말 만나기'],
    ['pond','숨 쉬는 연못','💧','1분간 숨 고르기'],
    ['mailbox','나에게 1도 편지','💌','나에게 편지 쓰기']
  ];
  const weather = {
    '맑아요':'기쁜 마음을 마음껏 느껴도 괜찮아.',
    '구름이 있어요':'흐린 날도 있어. 천천히 살펴보자.',
    '비가 와요':'속상한 마음도 내 마음이야. 쉬어 가도 괜찮아.',
    '천둥이 쳐요':'화가 날 땐 잠깐 멈춰 봐도 좋아.',
    '잘 모르겠어요':'마음에 꼭 이름을 붙이지 않아도 돼.'
  };
  const sayings = [
    '오늘 여기까지 해낸 나도 충분히 애썼어.', '속도가 달라도 괜찮아.',
    '내 마음을 살펴본 것만으로도 잘했어.', '쉬었다가 다시 시작해도 돼.',
    '모든 일을 한 번에 잘할 필요는 없어.', '도움을 청하는 건 용기야.',
    '오늘의 실수가 나의 전부는 아니야.', '나는 내 마음을 소중히 대할 수 있어.',
    '조금 두려워도 한 걸음 내디딜 수 있어.', '잘 안 되는 날도 나에게 친절하자.',
    '다른 친구와 나의 속도는 달라도 돼.', '오늘 작은 즐거움을 하나 찾아보자.',
    '나는 천천히 배워 가는 중이야.', '나에게도 편안한 시간이 필요해.',
    '꼭 웃지 않아도 내 마음은 소중해.', '어려운 마음을 어른에게 이야기해도 좋아.'
  ];
  const examples = {
    past:['그때 많이 떨렸지. 그래도 잘 버텼어.','그때의 나도 최선을 다했어.'],
    today:['오늘도 애썼어. 이제 잠깐 쉬어도 돼.','잘 안 된 일만 있었던 건 아니야.'],
    future:['앞으로도 너의 속도로 자라 가길 바라.','어려운 날엔 도움을 부탁해도 돼.']
  };
  const sendKinds = [
    {id:'boat',label:'종이배 띄우기',help:'물길을 따라 멀리 보내요.',icon:'⛵'},
    {id:'plane',label:'종이비행기 날리기',help:'바람을 따라 날려 보내요.',icon:'🛩️'},
    {id:'fire',label:'모닥불에 보내기',help:'작은 빛으로 변하는 걸 바라봐요.',icon:'🔥'}
  ];
  const weatherDestinations = {
    '맑아요': {action:'tree', label:'나를 데우는 말 만나기 →'},
    '구름이 있어요': {action:'drawer', label:'마음 서랍에 적어 보기 →'},
    '비가 와요': {action:'drawer', label:'마음 서랍에 적어 보기 →'},
    '천둥이 쳐요': {action:'release', label:'마음 놓아주기 해 보기 →'},
    '잘 모르겠어요': {action:'pond', label:'연못에서 숨 고르기 →'}
  };
  // These positions align with the twelve visible branch-tip buds in the garden illustration.
  // The final number rotates each new leaf from its bud into the open space beyond the twig.
  const leafSpots = [[52,9,-25],[31,15,-85],[71,15,7],[21,27,-95],[75,28,8],[56,19,-12],[31,36,-55],[65,40,12],[10,38,-100],[88,29,13],[13,49,-75],[91,48,23]];
  let latestWord = sayings[0], selectedWeather = '', letterTo = 'today', selectedLeafId = '', freshLeafId = '';
  let sendKind = 'boat', unwrittenFeeling = '', sendTimeout = null;
  let breathTimer = null, breathSeconds = 0, breathRunning = false;

  function stopTimers() {
    if (sendTimeout) clearTimeout(sendTimeout);
    if (breathTimer) clearInterval(breathTimer);
    sendTimeout = null; breathTimer = null; breathRunning = false;
  }
  function flash(message) {
    $('.student-toast')?.remove();
    const n = document.createElement('div'); n.className = 'student-toast'; n.textContent = message;
    n.setAttribute('role','status'); document.body.appendChild(n);
    setTimeout(() => n.remove(), 2800);
  }
  function nav(active) {
    document.querySelectorAll('[data-garden-nav]').forEach(b => {
      const on = b.dataset.gardenNav === active;
      b.classList.toggle('is-current', on);
      if (on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
    });
  }
  function paint(page, html, group = 'garden') {
    if (state.page === 'release' && page !== 'release') unwrittenFeeling = '';
    stopTimers();
    state.page = page; main.classList.add('garden-mode','student-view'); main.innerHTML = html;
    nav(group); window.scrollTo({top:0,behavior:'instant'});
    window.dispatchEvent(new CustomEvent('mindtemp:scene',{detail:{page,kind:sendKind}}));
  }
  function head(place, title, message) {
    return `<header class="student-page-head"><button type="button" class="student-back" data-garden="garden">← 정원으로 돌아가기</button><p class="garden-eyebrow">${place}</p><h1>${title}</h1><p>${message}</p></header>`;
  }
  const returnButton = '<button type="button" class="garden-button secondary" data-garden="garden">정원으로 돌아가기</button>';
  function storeRecord(type, name, text, extra = {}) {
    try {
      const key = 'mindtemp_' + type;
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const list = Array.isArray(current) ? current : [];
      list.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),date:new Date().toLocaleString('ko-KR'),type,name,text,...extra});
      localStorage.setItem(key, JSON.stringify(list.slice(0,100)));
      flash('이 기기에만 보관했어요.'); return true;
    } catch {flash('이 기기에 저장할 수 없어요.'); return false;}
  }
  function savedLeaves() {
    try {
      const records=JSON.parse(localStorage.getItem('mindtemp_tool')||'[]');
      return Array.isArray(records)?records.filter(r=>r && (r.kind==='leaf'||r.name==='나의 말잎')):[];
    } catch { return []; }
  }
  function weatherNextButton() {
    const destination=weatherDestinations[selectedWeather];
    return destination?`<button type="button" class="garden-button" data-garden="weather-next">${destination.label}</button>`:'';
  }
  function showGarden() {
    paint('garden',`<section class="garden-wrap student-garden">
      <div class="garden-intro"><p class="garden-eyebrow">오늘도 1도 · 초등 마음온도</p><h1>마음이 쉬어 가는<br><em>작은 정원에 오세요.</em></h1><p>잠깐 정원을 바라보고,<br>오늘 나에게 필요한 시간을 골라 보세요.</p></div>
      <div class="garden-scene-frame"><img class="garden-scene-image" src="./art/garden-bean-flat-v4.png" alt="콩싹이 달린 작은 콩알 캐릭터가 연못과 나무, 우체통이 있는 정원을 산책하는 그림"></div>
      <div class="student-choose-head"><span>정원에서 하고 싶은 일</span><h2>어디에서 잠깐 쉬어 갈까요?</h2><p>아래에서 한 가지를 골라 보세요.</p></div>
      <div class="student-paths">${places.map(([id,name,emoji,desc],index) => `<button type="button" data-garden="${id}"><span class="student-path-art" aria-hidden="true">${sceneIcon(id)}<small>${String(index+1).padStart(2,'0')}</small></span><span><strong>${name}</strong><small>${desc}</small></span><span class="student-path-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
      <p class="student-home-note">맞고 틀린 마음은 없어요. 글을 쓰지 않아도 괜찮아요. <strong>쓴 글은 자동 저장하거나 선생님에게 보내지지 않아요.</strong></p>
    </section>`);
  }
  function showMood() {
    paint('mood',`<section class="student-page mood-scene">${head('온실 · 내 마음 알아보기','오늘 마음은 어떤 날씨인가요?','맑은 날도 흐린 날도 모두 내 마음이에요.')}
      <div class="student-card"><div class="student-weather-grid">${Object.keys(weatherArt).map(text => `<button type="button" data-garden="weather" data-value="${text}" aria-pressed="${selectedWeather===text}" class="${selectedWeather===text?'chosen':''}"><span class="student-weather-art" aria-hidden="true">${illustratedWeather(weatherArt[text])}</span><span class="student-weather-name">${text}</span></button>`).join('')}</div>
      <div id="weather-response" class="student-mood-response" aria-live="polite">${weatherResponse()}</div></div></section>`,'mood');
  }
  function chooseWeather(button) {
    selectedWeather = button.dataset.value;
    if (!weather[selectedWeather]) return;
    main.querySelectorAll('.student-weather-grid button').forEach(b => {
      const chosen = b.dataset.value===selectedWeather;
      b.classList.toggle('chosen',chosen); b.setAttribute('aria-pressed',String(chosen));
    });
    $('#weather-response').innerHTML = weatherResponse();
  }
  function showDrawer() {
    paint('drawer',`<section class="student-page drawer-scene">${head('서랍 · 내 마음 표현하기','마음 서랍','복잡한 마음은 잠깐 꺼내 놓아도 괜찮아요.')}
      <div class="student-card student-drawer-layout"><div><label class="student-label" for="student-worry">지금 어떤 생각이 마음을 무겁게 하나요?</label><textarea class="preview-field" id="student-worry" maxlength="250" placeholder="한 문장만 적어도, 쓰지 않아도 괜찮아요."></textarea>
      <div class="student-actions"><button type="button" class="garden-button secondary" data-garden="drawer-save">서랍에 접어 두기</button><button type="button" class="garden-button" data-garden="drawer-release">여기서 놓아주기 →</button></div>
      <p class="student-privacy">공용 태블릿이라면 저장하지 않는 것을 추천해요. 보관하기를 눌렀을 때만 이 기기에 남아요.</p><p id="drawer-message" role="status" class="student-feedback"></p></div>
      <div class="student-drawer-side"><button type="button" data-garden="drawer-toggle" class="student-drawer-picture" aria-label="두 칸짜리 마음 서랍 열고 닫기" aria-expanded="false"><span class="student-drawer-note" id="drawer-note">내가 적은 말이<br>여기에 나타나요.</span><span class="student-drawer-case"><span class="student-drawer-top-surface"></span><span class="student-drawer-upper"><span class="student-drawer-handle"></span></span><span class="student-drawer-lower"><span class="student-drawer-handle"></span></span><span class="student-drawer-foot left"></span><span class="student-drawer-foot right"></span></span></button><p class="student-drawer-caption">위쪽 서랍을 열면 쪽지가 나타나요.</p><p class="student-drawer-written" id="drawer-written" aria-live="polite"></p></div></div></section>`);
  }
  function drawerAction(keep) {
    const input = $('#student-worry'); const text = input.value.trim();
    if (keep) {
      if (!text) return flash('접어 둘 글을 한 줄 적어 주세요.');
      if (!storeRecord('tool','마음 서랍',text)) return;
      $('#drawer-note').textContent=text;
      $('#drawer-written').textContent=text;
      input.value=''; $('#drawer-message').textContent='서랍에 잠깐 접어 두었어요. 내 기록에서 다시 꺼내 볼 수 있어요.';
      $('.student-drawer-picture').classList.add('open');
      $('.student-drawer-picture').setAttribute('aria-expanded','true');
    } else { unwrittenFeeling=text; input.value=''; showRelease(); }
  }
  function showRelease() {
    sendKind='boat';
    paint('release',`<section class="student-page release-scene">${head('잠깐 쉬어 가는 시간','마음 놓아주기','꼭 지금 해결하지 않아도 괜찮아요. 보내고 싶은 모습을 골라 보세요.')}
      <div class="student-card"><label for="release-feeling" class="student-label">지금 내려놓고 싶은 마음이 있나요? (선택)</label><textarea id="release-feeling" class="preview-field" maxlength="250" placeholder="한 줄만 적어도 좋고, 아무것도 쓰지 않아도 괜찮아요.">${esc(unwrittenFeeling)}</textarea><p class="student-privacy">이 글은 애니메이션이 시작되면 화면에서 지워지고, 기록에 남지 않아요.</p>
      <div class="release-choices" role="group" aria-label="보내는 모습 선택">${sendKinds.map(m=>`<button type="button" data-garden="release-choice" data-value="${m.id}" aria-pressed="${m.id===sendKind}" class="${m.id===sendKind?'chosen':''}"><span class="release-option-icon" aria-hidden="true">${sceneIcon(m.id==='boat'?'release':m.id)}</span><strong>${m.label}</strong><small>${m.help}</small></button>`).join('')}</div>
      <div id="release-stage" class="release-stage release-boat"><div class="release-sun"></div><div class="release-cloud"></div><div class="release-water"></div><div class="release-fold-note" aria-hidden="true"><div class="release-fold-paper"><span id="release-fold-text" class="release-fold-text"></span><span class="release-fold-side left"></span><span class="release-fold-side right"></span><span class="release-fold-crease"></span></div></div><div class="release-craft" aria-hidden="true"><img src="./art/paper-boat-bean-v6.png" alt=""></div><div class="release-paper-plane" aria-hidden="true"><img src="./art/paper-plane-bean-v6.png" alt=""></div><img class="release-fire-illustration" src="./art/campfire-bean-flat-v4.png" alt="" aria-hidden="true"/><span class="release-paper" aria-hidden="true"></span><span class="release-sparks" aria-hidden="true">✦ ✧ ✦</span><p id="release-stage-label" class="release-stage-label">쓴 말을 종이배로 접어 띄워 볼까요?</p></div>
      <div class="release-control"><button type="button" class="garden-button" data-garden="release-send" id="release-send">종이배 보내기</button><p id="fire-safety" class="student-fire-safety" hidden>이것은 화면 속 모닥불이에요. 실제 불을 피우거나 종이를 태우지 마세요.</p><p class="student-privacy">이 활동에서 쓴 글은 저장하거나 전송하지 않아요. 마음이 바로 가벼워지지 않아도 괜찮아요.</p></div>
      <div class="release-result" id="release-result" hidden role="status"><h2>잠깐 내려놓았어요.</h2><p>그대로인 마음도 괜찮아요. 혼자 감당하기 어렵다면 어른에게 이야기해 주세요.</p><div class="student-actions">${returnButton}<button type="button" class="garden-button" data-garden="release-again">다른 모습으로 보내기</button></div></div>
      </div></section>`);
  }
  function chooseSend(button) {
    if (!sendKinds.some(m=>m.id===button.dataset.value)) return;
    sendKind=button.dataset.value;
    const stage=$('#release-stage');
    stage.className='release-stage release-'+sendKind;
    $('#release-stage-label').textContent=({boat:'쓴 말을 종이배로 접어 띄워 볼까요?',plane:'쓴 말을 종이비행기로 접어 날려 볼까요?',fire:'모닥불 곁에 종이를 놓아요.'})[sendKind];
    $('#release-send').textContent=({boat:'종이배 보내기',plane:'종이비행기 날리기',fire:'모닥불에 보내기'})[sendKind];
    $('#fire-safety').hidden = sendKind !== 'fire';
    main.querySelectorAll('.release-choices button').forEach(b=>{const chosen=b.dataset.value===sendKind;b.classList.toggle('chosen',chosen);b.setAttribute('aria-pressed',String(chosen));});
    window.dispatchEvent(new CustomEvent('mindtemp:scene',{detail:{page:'release',kind:sendKind}}));
  }
  function send() {
    const btn=$('#release-send');if(!btn || btn.disabled)return;
    const written=$('#release-feeling').value.trim();
    $('#release-fold-text').textContent=written;
    $('#release-feeling').value='';unwrittenFeeling='';
    btn.disabled=true;
    main.querySelectorAll('.release-choices button').forEach(b=>b.disabled=true);
    const stage=$('#release-stage'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const complete=()=>{
      if(!$('#release-stage'))return;
      $('#release-stage').classList.add('is-sent');
      $('#release-result').hidden=false;
      $('#release-stage-label').textContent='여기까지 해도 충분해요.';
      $('#release-fold-text').textContent='';
      unwrittenFeeling='';sendTimeout=null;
    };
    const fly=()=>{
      if(!$('#release-stage'))return;
      stage.classList.remove('is-folding');stage.classList.add('is-sending');
      $('#release-stage-label').textContent=({boat:'내 마음을 담은 배가 멀어지고 있어요…',plane:'내 마음을 담은 비행기가 날아가요…',fire:'종이가 작은 빛으로 변하고 있어요…'})[sendKind];
      sendTimeout=setTimeout(complete,reduced?150:2600);
    };
    if(sendKind==='fire'||reduced){fly();return;}
    stage.classList.add('is-folding');
    $('#release-stage-label').textContent=written?'내가 쓴 말이 종이로 접히고 있어요…':'빈 종이를 천천히 접고 있어요…';
    sendTimeout=setTimeout(fly,1750);
  }
  function randomWord() {
    const pool=sayings.filter(s=>s!==latestWord);
    latestWord=pool[Math.floor(Math.random()*pool.length)];
    if ($('#warm-word'))$('#warm-word').textContent='“'+latestWord+'”';
  }
  function showTree(refreshWord=true) {
    if(refreshWord)randomWord();
    const leaves=savedLeaves(), displayed=leaves.slice(0,leafSpots.length).reverse();
    const active=leaves.find(r=>String(r.id)===String(selectedLeafId));
    paint('tree',`<section class="student-page tree-scene">${head('나무 아래 · 나에게 건네는 말','다정한 말 나무','나를 데우는 말을 담을 때마다 나무에 작은 잎이 하나씩 자라요.')}
    <div class="student-card tree-card"><p class="garden-eyebrow">오늘 나에게 건네는 말</p><blockquote id="warm-word">“${esc(latestWord)}”</blockquote><div class="student-actions"><button type="button" class="garden-button secondary" data-garden="word-next">다른 말 만나기 ↻</button><button type="button" class="garden-button" data-garden="word-save">이 말을 잎으로 달기 🌿</button></div>
    <div class="leaf-grow-layout"><div class="leaf-tree-panel"><div class="leaf-tree-meta"><strong>나의 다정한 말 나무</strong><span>모인 잎 ${leaves.length}장</span></div><div class="leaf-tree" role="group" aria-label="보관한 문장이 잎이 되는 나무">
      <img class="leaf-tree-illustration" src="./art/kind-words-tree-v10.png" alt="작은 봉오리가 달린 손그림 나무. 저장한 다정한 말이 가지 끝의 잎으로 펼쳐져요." loading="eager">
      ${displayed.map((r,i)=>{const p=leafSpots[i];const isSelected=String(r.id)===String(selectedLeafId);return `<button class="tree-leaf ${isSelected?'selected':''} ${String(r.id)===String(freshLeafId)?'is-new':''}" type="button" data-garden="leaf-open" data-value="${esc(r.id)}" style="--leaf-x:${p[0]}%;--leaf-y:${p[1]}%;--leaf-rotate:${p[2]}deg" aria-label="${i+1}번째 잎의 말 읽기" aria-pressed="${isSelected}" title="잎을 눌러 쓴 말을 읽어 보세요"><svg viewBox="0 0 80 70" aria-hidden="true"><path d="M14 54Q20 50 29 42" fill="none" stroke="#426b42" stroke-width="5" stroke-linecap="round"/><path d="M27 45Q31 17 70 7Q68 45 35 51Q29 51 27 45Z" fill="${i%3===0?'#c5dc8e':i%3===1?'#a1ca80':'#a9d79e'}" stroke="#426b42" stroke-width="4" stroke-linejoin="round"/><path d="M31 46Q48 32 64 17" stroke="#719b64" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg></button>`;}).join('')}
      </div><p class="leaf-tree-hint">${leaves.length?'잎을 누르면 담아 둔 말을 다시 읽을 수 있어요.':'나무가 첫 번째 다정한 말을 기다리고 있어요.'}</p><p class="leaf-story" id="leaf-story" role="status">${active?`“${esc(active.text)}”`:leaves.length?'어떤 잎에 어떤 말이 적혀 있을까요?':'작은 말부터 시작해도 괜찮아요.'}</p></div>
    <div class="leaf-write"><label class="student-label" for="leaf-input">내 말로 잎 하나 달기</label><textarea id="leaf-input" class="preview-field" maxlength="180" placeholder="예: 오늘 용기 내어 손을 들었어. 수고했어!"></textarea><button type="button" class="garden-button" data-garden="leaf-create">내 말을 잎으로 달기 🌿</button><p class="student-privacy">잎은 보관하기를 눌러야 생겨요. 기록은 이 기기에만 남으니 공용 태블릿에서는 주의해 주세요.</p></div></div></div></section>`);
  }
  function saveLeaf(text) {
    if(!text)return flash('잎에 적을 말을 먼저 써 주세요.');
    if(!storeRecord('tool','나의 말잎',text,{kind:'leaf'}))return;
    selectedLeafId=savedLeaves()[0]?.id||'';
    freshLeafId=selectedLeafId;
    showTree(false);
    freshLeafId='';
    flash('가지 끝에 다정한 말잎이 펼쳐졌어요! 🌿');
  }
  function showLetter() {
    paint('mailbox',`<section class="student-page letter-scene">${head('우체통 · 나에게 쓰는 편지','나에게 1도 편지','과거의 나, 오늘의 나, 미래의 나에게 한마디 건네 봐요.')}
      <div class="student-card"><div class="letter-targets">${[['past','과거의 나'],['today','오늘의 나'],['future','미래의 나']].map(([id,title])=>`<button type="button" data-garden="letter-target" data-value="${id}" class="${letterTo===id?'chosen':''}" aria-pressed="${letterTo===id}">${title}</button>`).join('')}</div>
      <div class="letter-envelope-scene"><button type="button" data-garden="letter-toggle" id="letter-envelope" class="letter-envelope" aria-label="편지 봉투 열고 닫기" aria-expanded="true"><span class="letter-paper"><small id="letter-paper-to">오늘의 나에게</small><span id="letter-preview-text">나에게 편지를 적으면<br>이곳에 나타나요.</span></span><span class="envelope-pocket"></span><span class="envelope-flap"></span><span class="envelope-heart" aria-hidden="true">♥</span></button><p id="letter-full-message" class="letter-full-message" aria-live="polite">글을 적고 버튼을 누르면 편지가 봉투 안으로 들어가요.</p></div>
      <p class="student-label">이렇게 시작해도 좋아요.</p><div class="letter-examples" id="letter-examples"></div><label for="student-letter" class="student-label">내가 나에게 하고 싶은 말</label><textarea id="student-letter" maxlength="300" class="preview-field" placeholder="오늘 나에게 해 주고 싶은 말은…"></textarea><div class="student-actions"><button type="button" class="garden-button" data-garden="letter-send">봉투에 편지 넣어 보기</button><button type="button" class="garden-button secondary" data-garden="letter-save">이 기기에 보관하기</button></div><p id="letter-message" role="status" class="student-feedback"></p><p class="student-privacy">편지는 실제로 전송되지 않아요. 보관하기를 누르지 않으면 남지 않아요.</p></div></section>`,'mailbox');
    showExamples();
  }
  function showExamples() {
    $('#letter-examples').innerHTML=examples[letterTo].map(t=>`<button type="button" data-garden="letter-example" data-value="${esc(t)}">${esc(t)}</button>`).join('');
    main.querySelectorAll('.letter-targets button').forEach(b=>{const on=b.dataset.value===letterTo;b.classList.toggle('chosen',on);b.setAttribute('aria-pressed',String(on));});
    $('#letter-paper-to').textContent=({past:'과거의 나에게',today:'오늘의 나에게',future:'미래의 나에게'})[letterTo];
  }
  function letterAction(keep) {
    const input=$('#student-letter'),text=input.value.trim();
    if(!text)return flash('한마디를 적거나 예시를 골라 주세요.');
    if(keep&&!storeRecord('letter','나에게 1도 편지',text,{to:letterTo}))return;
    $('#letter-preview-text').textContent=text;
    $('#letter-full-message').textContent='편지가 봉투 안에 들어갔어요. 봉투를 누르면 다시 꺼내 읽을 수 있어요.';
    $('#letter-envelope').classList.remove('open');
    $('#letter-envelope').classList.add('sealed');
    $('#letter-envelope').setAttribute('aria-expanded','false');
    if(keep)input.value='';
    $('#letter-message').textContent=keep?'봉투에 넣은 편지를 이 기기의 기록에도 보관했어요.':'편지를 봉투 안으로 넣었어요. 기록은 남기지 않았어요.';
  }
  function showBreath() {
    breathSeconds=0;
    paint('pond',`<section class="student-page pond-scene">${head('연못 · 잠깐 쉬어 가기','연못에서 숨 고르기','연못의 물결을 바라보며 편하게 숨 쉬어 봐요. 꼭 박자를 맞추지 않아도 돼요.')}
      <div class="pond-landscape"><img src="./art/pond-bean-flat-v4.png" class="pond-art" alt="연잎과 수련이 떠 있고 둥근 돌과 수초로 둘러싸인 푸른 연못. 가장자리에는 작은 콩알 캐릭터가 앉아 있어요."><div class="pond-breath-circle" id="breath-circle"><strong id="breath-word">준비되면 시작해요.</strong><small id="breath-count">나에게 편한 속도로</small></div></div>
      <div class="pond-controls"><p id="breath-time" aria-live="polite">0초 / 60초</p><div class="student-actions"><button type="button" class="garden-button" id="breath-toggle" data-garden="breath-toggle">1분 숨 고르기 시작</button>${returnButton}</div><p class="student-privacy">어지럽거나 불편하면 바로 멈춰도 돼요. 숨을 참지 않아도 괜찮아요.</p></div></section>`);
  }
  function stepBreath() {
    const inside=breathSeconds%6<3;
    $('#breath-circle').classList.toggle('in',inside);
    $('#breath-circle').classList.toggle('out',!inside);
    $('#breath-word').textContent=inside?'편안히 들이마셔요':'천천히 내쉬어요';
    $('#breath-count').textContent=(3-breathSeconds%3)+'초';
    $('#breath-time').textContent=breathSeconds+'초 / 60초';
  }
  function toggleBreath() {
    if(breathRunning){stopTimers();$('#breath-toggle').textContent='다시 시작하기';$('#breath-word').textContent='잠깐 쉬고 있어요.';$('#breath-circle').classList.remove('in','out');return;}
    breathSeconds=0;breathRunning=true;$('#breath-toggle').textContent='잠시 멈추기';stepBreath();
    breathTimer=setInterval(()=>{breathSeconds++;if(breathSeconds===60){stopTimers();$('#breath-circle').classList.remove('in','out');$('#breath-word').textContent='잠시 쉬었어요 🌱';$('#breath-count').textContent='여기까지 해도 충분해요';$('#breath-time').textContent='60초 / 60초';$('#breath-toggle').textContent='한 번 더 하기';}else stepBreath();},1000);
  }
  function allRecords() {
    const output=[];
    ['mindtemp_mood','mindtemp_tool','mindtemp_letter'].forEach(key=>{
      try{const arr=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(arr))arr.forEach(r=>output.push({...r,storageKey:key}));}catch{}
    });
    return output.sort((a,b)=>String(b.id).localeCompare(String(a.id))).slice(0,100);
  }
  function showRecords() {
    const records=allRecords();
    paint('records',`<section class="student-page records-scene">${head('보관하기를 누른 글만','나의 작은 기록','남겨 두고 싶은 말만 보관해도 괜찮아요.')}
      <div class="student-card"><p class="student-privacy strong">🔒 기록은 이 기기의 브라우저에만 남아요. <strong>공용 태블릿에서는 다른 사람도 읽을 수 있어요.</strong></p>
      ${records.length?`<div class="student-record-list">${records.map(r=>`<article class="student-record"><div><small>${esc(r.date||'')}</small><button type="button" data-garden="delete" data-key="${esc(r.storageKey)}" data-value="${esc(r.id)}">삭제</button></div><h2>${esc(r.name||'마음기록')}</h2><p>${esc(r.text||[r.weather,r.emotion].filter(Boolean).join(' · '))}</p></article>`).join('')}</div><div class="student-actions">${returnButton}<button type="button" class="garden-button secondary" data-garden="clear">모든 기록 지우기</button></div>`:`<div class="student-empty">🌱<h2>아직 보관한 기록이 없어요.</h2><p>기록하지 않아도 괜찮아요.</p></div>${returnButton}`}</div></section>`,'records');
  }
  function deleteRecord(button) {
    const key=button.dataset.key,id=button.dataset.value;
    if(!['mindtemp_tool','mindtemp_mood','mindtemp_letter'].includes(key)||!confirm('이 기록을 지울까요? 되돌릴 수 없어요.'))return;
    try{const arr=JSON.parse(localStorage.getItem(key)||'[]');localStorage.setItem(key,JSON.stringify(arr.filter(r=>String(r.id)!==id)));}catch{}
    showRecords();
  }
  function clearRecords() {
    if(!confirm('이 기기의 마음기록을 모두 지울까요? 되돌릴 수 없어요.'))return;
    ['mindtemp_tool','mindtemp_mood','mindtemp_letter'].forEach(key=>localStorage.removeItem(key));showRecords();
  }
  function showHelp() {
    paint('help',`<section class="student-page help-scene">${head('마음이 너무 힘들 때','도움을 말하는 것도 용기예요.','혼자 다 해결하지 않아도 돼요. 믿을 만한 어른에게 알려 주세요.')}
      <div class="student-card help-card"><h2>이렇게 말해도 괜찮아요.</h2><div class="help-phrases">${['요즘 마음이 너무 힘들어요. 제 이야기를 들어 주세요.','혼자 해결하기 어려워요. 도와주세요.','지금은 자세히 말하기 어렵지만 곁에 있어 주세요.'].map(t=>`<button type="button" data-garden="help-phrase" data-value="${esc(t)}">${esc(t)}</button>`).join('')}</div><p id="help-message" role="status">문장을 누르면 크게 볼 수 있어요.</p><p class="student-privacy">부모님, 선생님, 상담 선생님처럼 믿을 수 있는 어른에게 말해 보세요. 위험한 일이 일어나고 있다면 바로 가까운 어른에게 알려 주세요. 이 사이트는 상담이나 치료를 대신하지 않아요.</p></div></section>`,'help');
  }
  function configureChrome() {
    document.title='오늘도 1도 마음온도 | 초등 마음정원';
    $('.header-mode')?.remove();$('.mobile-menu-button')?.remove();
    $('.brand-mark')?.setAttribute('data-garden','garden');
    const items=[['garden','마음정원','greenhouse'],['mood','마음 날씨','mood'],['release','마음 놓아주기','release'],['mailbox','나에게 편지','mailbox'],['records','내 기록','records'],['help','도움','help']];
    $('.app-nav').innerHTML=items.map(([id,label,art])=>`<button type="button" data-garden="${id}" data-garden-nav="${id}"><span class="nav-art">${sceneIcon(art)}</span><span>${label}</span></button>`).join('');
    $('.mobile-tabbar').innerHTML=items.map(([id,label,art])=>`<button type="button" data-garden="${id}" data-garden-nav="${id}"><span class="tab-art">${sceneIcon(art)}</span><small>${({'garden':'정원','mood':'마음','release':'놓아주기','mailbox':'편지','records':'기록','help':'도움'})[id]}</small></button>`).join('');
    $('.crisis-float').dataset.garden='help';$('.crisis-float').textContent='♡ 도움이 필요할 때';
    $('.site-footer').innerHTML='<span>오늘도 1도 · 마음온도</span><span>초등학생을 위한 작은 마음정원</span>';
  }
  function route(action, button) {
    switch(action) {
      case 'garden': case 'home': case 'open': return showGarden();
      case 'greenhouse': case 'mood': return showMood();
      case 'drawer': return showDrawer();
      case 'tree': return showTree();
      case 'pond': return showBreath();
      case 'mailbox': return showLetter();
      case 'release': case 'release-again': return showRelease();
      case 'records': return showRecords();
      case 'help': return showHelp();
      case 'weather': return chooseWeather(button);
      case 'weather-next': return route(weatherDestinations[selectedWeather]?.action||'garden');
      case 'drawer-toggle':{const open=button.classList.toggle('open');button.setAttribute('aria-expanded',String(open));return;}
      case 'drawer-save': return drawerAction(true);
      case 'drawer-release': return drawerAction(false);
      case 'release-choice': return chooseSend(button);
      case 'release-send': return send();
      case 'word-next': return randomWord();
      case 'word-save': return saveLeaf(latestWord);
      case 'leaf-create': return saveLeaf($('#leaf-input')?.value.trim()||'');
      case 'leaf-open': {
        const record=savedLeaves().find(r=>String(r.id)===String(button.dataset.value));
        if(!record)return;
        selectedLeafId=record.id;
        main.querySelectorAll('.tree-leaf').forEach(el=>{
          const selected=el.dataset.value===String(selectedLeafId);
          el.classList.toggle('selected',selected);
          el.setAttribute('aria-pressed',String(selected));
        });
        $('#leaf-story').textContent='“'+record.text+'”';return;
      }
      case 'letter-target': letterTo=button.dataset.value;return showExamples();
      case 'letter-example': $('#student-letter').value=button.dataset.value;return;
      case 'letter-save': return letterAction(true);
      case 'letter-send': return letterAction(false);
      case 'letter-toggle': {
        const envelope=$('#letter-envelope');
        if(!envelope?.classList.contains('sealed'))return flash('먼저 편지를 적고 봉투에 넣어 보세요.');
        const open=envelope.classList.toggle('open');envelope.setAttribute('aria-expanded',String(open));
        $('#letter-full-message').textContent=open?'내가 쓴 편지를 다시 읽어 보세요.':'편지가 봉투 안에 들어 있어요.';
        return;
      }
      case 'breath-toggle': return toggleBreath();
      case 'delete': return deleteRecord(button);
      case 'clear': return clearRecords();
      case 'help-phrase': $('#help-message').textContent=button.dataset.value;return;
    }
  }
  configureChrome();
  go=function(name){ if(name==='friend'||name==='practice'){stopTimers();legacyMode();oldGo(name);}else route(name);};
  function legacyMode(){ main.classList.remove('garden-mode','student-view');}
  document.addEventListener('click',event=>{
    const b=event.target.closest('button[data-garden]');
    if(!b)return;
    event.preventDefault();event.stopImmediatePropagation();
    route(b.dataset.garden,b);
  },true);
  document.addEventListener('input',event=>{
    if(event.target.id==='student-worry') {
      const note=$('#drawer-note');
      if(note && !$('.student-drawer-picture')?.classList.contains('open'))note.textContent=event.target.value.trim()||'내가 적은 말이 여기에 나타나요.';
    }
    if(event.target.id==='student-letter') {
      const envelope=$('#letter-envelope');
      if(envelope){envelope.classList.remove('open','sealed');envelope.setAttribute('aria-expanded','true');}
      if($('#letter-preview-text'))$('#letter-preview-text').textContent=event.target.value.trim()||'나에게 편지를 적으면 이곳에 나타나요.';
    }
  });
  showGarden();
})();
