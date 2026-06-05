const chat = document.getElementById("chat");
const artistName = "선우";
const NICKNAME = "더비"; // 想把 OO 換成別的名字，改這裡
let allMessages = {};

function displayText(value){
  return String(value ?? "").replaceAll("OO", NICKNAME);
}

function formatTime(time){
  if(!time) return "";
  const [hh, mm] = String(time).split(":");
  let h = Number(hh);
  if(Number.isNaN(h)) return time;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${ampm} ${h}:${mm || "00"}`;
}

function formatDateLabel(date){
  const str = String(date ?? "").trim();
  const match = str.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);

  if(!match) return str;

  const y = match[1];
  const m = match[2].padStart(2, "0");
  const d = match[3].padStart(2, "0");

  return `${y}年${m}月${d}日`;
}

function addDateDivider(date){
  const div = document.createElement("div");
  div.className = "date-divider";
  div.textContent = formatDateLabel(date);
  chat.appendChild(div);
}

function getMediaKind(item){
  if(!item || !item.url) return "";
  const lower = String(item.url).toLowerCase();
  if(lower.match(/\.(mp3|wav|m4a|ogg)(\?|$)/)) return "audio";
  if(lower.match(/\.(mp4|webm|mov)(\?|$)/)) return "video";
  if(item.type === "emoticon") return "emoticon";
  return "image";
}

function getMediaHtml(item){
  if(!item || !item.url) return "";
  const url = escapeAttr(item.url);
  const kind = getMediaKind(item);

  if(kind === "audio"){
    return `
      <div class="audio-bubble" onclick="toggleAudio(this)">
        <span class="audio-play">▶</span>
        <span class="audio-duration">00:00</span>
        <audio src="${url}" preload="metadata"
          onloadedmetadata="setAudioDuration(this)"
          onended="resetAudioButton(this)"></audio>
      </div>
    `;
  }

  if(kind === "video"){
    return `<video class="chat-video" controls preload="metadata" src="${url}"></video>`;
  }

  const cls = kind === "emoticon" ? "emoticon-media" : "chat-media";
  return `<img class="${cls}" src="${url}" loading="lazy">`;
}

function secToTime(sec){
  if(!Number.isFinite(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function setAudioDuration(audio){
  const box = audio.closest(".audio-bubble");
  const label = box?.querySelector(".audio-duration");
  if(label) label.textContent = secToTime(audio.duration);
}

function toggleAudio(box){
  const audio = box.querySelector("audio");
  const play = box.querySelector(".audio-play");
  if(!audio) return;
  document.querySelectorAll("audio").forEach(a => {
    if(a !== audio){
      a.pause();
      const p = a.closest(".audio-bubble")?.querySelector(".audio-play");
      if(p) p.textContent = "▶";
    }
  });
  if(audio.paused){
    audio.play();
    if(play) play.textContent = "❚❚";
  }else{
    audio.pause();
    if(play) play.textContent = "▶";
  }
}

function resetAudioButton(audio){
  const play = audio.closest(".audio-bubble")?.querySelector(".audio-play");
  if(play) play.textContent = "▶";
}

function addArtistMessage(item){
  const text = displayText(typeof item === "string" ? item : item.text);
  const trans = displayText(typeof item === "string" ? "" : item.trans);
  const quote = displayText(typeof item === "string" ? "" : item.quote);
  const quoteTrans = displayText(typeof item === "string" ? "" : item.quoteTrans);
  const mediaHtml = typeof item === "string" ? "" : getMediaHtml(item);
  const mediaKind = typeof item === "string" ? "" : getMediaKind(item);
  const mediaOnly = mediaHtml && ["image", "video", "emoticon"].includes(mediaKind);

  const quoteHtml = quote
    ? `
      <div class="reply-wrap">
        <div class="reply-line"></div>
        <div class="quote-box">
          <div>${escapeHtml(quote)}</div>
          ${quoteTrans ? `
            <div class="bubble-divider"></div>
            <div>${escapeHtml(quoteTrans)}</div>
            <!--<div class="translation-label">Translated by Papago</div>-->
          ` : ""}
        </div>
      </div>
    `
    : "";

  const showText = text && !(mediaHtml && /^\([^)]*\)$/.test(text));
  const transHtml = trans && !mediaOnly
      ? `
        <div class="bubble-divider"></div>
        <div class="msg-text trans-text">${escapeHtml(trans)}</div>
        <div class="translation-label">Translated by Papago</div>
      `
      : "";

    const contentHtml = mediaOnly
      ? `<div class="media-wrap">${mediaHtml}</div>`
      : `<div class="bubble">
            ${showText ? `<div class="msg-text">${escapeHtml(text)}</div>` : ""}
            ${mediaHtml}
            ${transHtml}
         </div>`;

  const row = document.createElement("div");
  row.className = "msg-row";
  row.innerHTML = `
    <div class="avatar"></div>
    <div>

      ${quoteHtml}
      <div style="display:flex">
        ${contentHtml}
        <div class="time">${formatTime(typeof item === "string" ? "" : item.time)}</div>
      </div>
    </div>
  `;

  chat.appendChild(row);
}

function addUserMessage(text){
  const row = document.createElement("div");
  row.className = "user-row";
  row.innerHTML = `<div class="user-bubble">${escapeHtml(text)}</div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function sendUser(){
  const input = document.getElementById("userInput");
  if(!input.value.trim()) return;
  addUserMessage(input.value.trim());
  input.value = "";
}

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function escapeAttr(str){
  return escapeHtml(str).replaceAll('"', '&quot;');
}

function renderMessages(data){
  chat.innerHTML = "";

  Object.keys(data).forEach(date => {
    addDateDivider(date);
    data[date].forEach(item => addArtistMessage(item));
  });

  chat.scrollTop = 0;
}

function openSearch(){
  const normalHeader = document.getElementById("headerNormal");
  const searchHeader = document.getElementById("headerSearch");
  const input = document.getElementById("searchInput");

  normalHeader.style.display = "none";
  searchHeader.style.display = "flex";

  input.value = "";
  renderMessages(allMessages);

  requestAnimationFrame(() => input.focus());
}

function closeSearch(){
  const normalHeader = document.getElementById("headerNormal");
  const searchHeader = document.getElementById("headerSearch");
  const input = document.getElementById("searchInput");

  searchHeader.style.display = "none";
  normalHeader.style.display = "flex";

  input.value = "";
  renderMessages(allMessages);
}

function searchMessages(keyword){
  const q = displayText(keyword).trim().toLowerCase();

  if(!q){
    renderMessages(allMessages);
    return;
  }

  const filtered = {};

  Object.keys(allMessages).forEach(date => {
    const items = allMessages[date].filter(item => {
      if(typeof item === "string"){
        return displayText(item).toLowerCase().includes(q);
      }

      const fields = [
        item.text,
        item.trans,
        item.quote,
        item.quoteTrans
      ].map(v => displayText(v || "").toLowerCase());

      return fields.some(v => v.includes(q));
    });

    if(items.length){
      filtered[date] = items;
    }
  });

  if(Object.keys(filtered).length === 0){
    chat.innerHTML = `<div class="no-result">找不到符合的訊息</div>`;
    return;
  }

  renderMessages(filtered);
}


function dateSortValue(date){
  const t = Date.parse(String(date).replaceAll(".", "-").replaceAll("/", "-"));
  if(Number.isNaN(t)) return 0;
  return t;
}

function getThumbUrl(url){
  const str = String(url || "");

  if(str.includes("/image/upload/")){
    return str.replace(
      "/image/upload/",
      "/image/upload/c_fill,w_240,h_240,q_auto,f_auto/"
    );
  }

  if(str.includes("/video/upload/")){
    return str.replace(
      "/video/upload/",
      "/video/upload/c_fill,w_240,h_240,q_auto,f_auto/"
    );
  }

  return str;
}

function getMediaPageItemHtml(item){
  const kind = getMediaKind(item);
  const url = escapeAttr(item.url);
  const rawUrl = escapeAttr(item.url);
  const thumbUrl = escapeAttr(getThumbUrl(item.url));
  const time = formatTime(item.time);

  if(kind === "audio"){
    return `
      <div class="media-card audio-card"
           onclick="openMediaViewer('${rawUrl}', 'audio')">
        <div class="media-audio-icon">▶</div>
        <div class="media-audio-text">語音訊息</div>
        ${time ? `<span class="media-time">${escapeHtml(time)}</span>` : ""}
      </div>
    `;
  }

  if(kind === "video"){
    return `
      <div class="media-card"
           onclick="openMediaViewer('${rawUrl}', 'video')">
        <img src="${thumbUrl}" loading="lazy" decoding="async">
        <span class="media-badge">影片</span>
        ${time ? `<span class="media-time">${escapeHtml(time)}</span>` : ""}
      </div>
    `;
  }

  return `
    <div class="media-card"
         onclick="openMediaViewer('${rawUrl}', 'image')">
      <img src="${thumbUrl}" loading="lazy" decoding="async">
      ${time ? `<span class="media-time">${escapeHtml(time)}</span>` : ""}
    </div>
  `;
}

function ensureMediaPage(){
  let mediaPage = document.getElementById("mediaPage");
  if(mediaPage) return mediaPage;

  mediaPage = document.createElement("div");
  mediaPage.id = "mediaPage";
  mediaPage.className = "settings-page media-page";
  mediaPage.innerHTML = `
    <div class="header settings-header">
      <div class="header-bar">
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="showSettingsFromMedia()">‹</button>
        <div class="name">照片、影片</div>
        <div class="header-actions placeholder-actions">
          <span class="nav-placeholder"></span>
          <span class="nav-placeholder"></span>
        </div>
      </div>
    </div>

    <div class="media-content" id="mediaContent"></div>
  `;

  document.body.appendChild(mediaPage);
  return mediaPage;
}

function renderMediaPage(){
  const mediaContent = document.getElementById("mediaContent");
  if(!mediaContent) return;

  const dates = Object.keys(allMessages).sort((a, b) => {
    const diff = dateSortValue(b) - dateSortValue(a);
    return diff || String(b).localeCompare(String(a));
  });

  let html = "";

  dates.forEach(date => {
    const items = (allMessages[date] || []).filter(item => {
      if(typeof item === "string") return false;
      if(!item.url) return false;
      const kind = getMediaKind(item);
      return ["image", "video", "audio"].includes(kind);
    });

    if(!items.length) return;

    html += `
      <section class="media-date-section">
        <div class="media-date-title">${escapeHtml(formatDateLabel(date))}</div>
        <div class="media-grid">
          ${items.map(getMediaPageItemHtml).join("")}
        </div>
      </section>
    `;
  });

  mediaContent.innerHTML = html || `<div class="media-empty">目前沒有照片、影片或音訊檔</div>`;
}

function normalizePage(page){
  const value = String(page || "chat").replace("#", "").trim();
  return ["chat", "settings", "media"].includes(value) ? value : "chat";
}

function setPage(page){
  const nextPage = normalizePage(page);
  if(location.hash.replace("#", "") !== nextPage){
    location.hash = nextPage;
    return;
  }
  showPage(nextPage);
}

function showPage(page){
  const nextPage = normalizePage(page);
  const app = document.querySelector(".app");
  const settingsPage = document.getElementById("settingsPage");
  const mediaPage = document.getElementById("mediaPage");

  if(app) app.style.display = "none";
  if(settingsPage) settingsPage.style.display = "none";
  if(mediaPage) mediaPage.style.display = "none";

  if(nextPage === "settings"){
    if(settingsPage) settingsPage.style.display = "flex";
    return;
  }

  if(nextPage === "media"){
    const pageEl = ensureMediaPage();
    pageEl.style.display = "flex";
    renderMediaPage();
    return;
  }

  if(app) app.style.display = "flex";
}

function showMediaPage(){
  setPage("media");
}

function showSettingsFromMedia(){
  setPage("settings");
}

function showSettings(){
  setPage("settings");
}

function showChat(){
  setPage("chat");
}

function ensureMediaViewer(){
  let viewer = document.getElementById("mediaViewer");
  if(viewer) return viewer;

  viewer = document.createElement("div");
  viewer.id = "mediaViewer";
  viewer.className = "media-viewer";

  viewer.innerHTML = `
    <div class="media-viewer-header">
      <button class="viewer-btn" type="button" onclick="closeMediaViewer()">✕</button>
      <a id="mediaDownloadBtn" class="viewer-download" href="#" download target="_blank">下載</a>
    </div>

    <div class="media-viewer-body" id="mediaViewerBody"></div>
  `;

  document.body.appendChild(viewer);
  return viewer;
}

function openMediaViewer(url, kind){
  const viewer = ensureMediaViewer();
  const body = document.getElementById("mediaViewerBody");
  const downloadBtn = document.getElementById("mediaDownloadBtn");

  downloadBtn.href = url;

  if(kind === "video"){
    body.innerHTML = `
      <video class="viewer-media" src="${escapeAttr(url)}" controls autoplay></video>
    `;
  }else if(kind === "audio"){
    body.innerHTML = `
      <audio class="viewer-audio" src="${escapeAttr(url)}" controls autoplay></audio>
    `;
  }else{
    body.innerHTML = `
      <img class="viewer-media" src="${escapeAttr(url)}">
    `;
  }

  viewer.style.display = "flex";
}

function closeMediaViewer(){
  const viewer = document.getElementById("mediaViewer");
  const body = document.getElementById("mediaViewerBody");

  if(body) body.innerHTML = "";
  if(viewer) viewer.style.display = "none";
}

document.addEventListener("click", e => {
  const mediaItem = e.target.closest('[data-page="media"]');
  if(mediaItem) showMediaPage();
});

window.addEventListener("hashchange", () => {
  showPage(location.hash.replace("#", "") || "chat");
});

fetch("./messages.json", { cache: "no-store" })
  .then(res => {
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(messages => {
    allMessages = messages;
    renderMessages(allMessages);

    const initialPage = normalizePage(location.hash.replace("#", "") || "chat");
    showPage(initialPage);

    const searchInput = document.getElementById("searchInput");
    if(searchInput){
      searchInput.addEventListener("input", e => {
        searchMessages(e.target.value);
      });
    }
  })
  .catch(err => {
    console.error(err);
    chat.innerHTML = `<div class="error-msg">messages.json 讀取失敗：${escapeHtml(err.message)}<br>如果你是直接雙擊 HTML，請改用本機伺服器開啟。</div>`;
  });
