const chat = document.getElementById("chat");
const DEFAULT_ARTIST_NAME = "선우";
const DEFAULT_NICKNAME = "더비";
let artistName = localStorage.getItem("frommChatName") || DEFAULT_ARTIST_NAME;
let NICKNAME = localStorage.getItem("frommNickname") || DEFAULT_NICKNAME;
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
  div.dataset.date = date;
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
        <div class="msg-text trans-text">${formatMessageText(typeof item === "string" ? "" : item.trans)}</div>
        <div class="translation-label">Translated by Papago</div>
      `
      : "";

    const contentHtml = mediaOnly
      ? `<div class="media-wrap">${mediaHtml}</div>`
      : `<div class="bubble">
            ${showText ? `<div class="msg-text original-text">${formatMessageText(typeof item === "string" ? item : item.text)}</div>` : ""}
            ${mediaHtml}
            ${transHtml}
         </div>`;

  const row = document.createElement("div");
  row.className = "msg-row";
  row.innerHTML = `
    <div class="avatar"></div>
    <div class="message-body">
    <div class="artist-name">${escapeHtml(artistName)}</div>

    ${quoteHtml}
    <div class="message-line">
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

function formatNickname(value){
  const text = String(value ?? "");

  return [...text].map(ch => {
    const escaped = escapeHtml(ch);

    // 中文
    if(/[\u3400-\u4DBF\u4E00-\u9FFF]/.test(ch)){
      return `<span class="nickname-cn">${escaped}</span>`;
    }

    // 韓文、英文、數字、其他
    return `<span class="nickname-ko-en">${escaped}</span>`;
  }).join("");
}

function formatMessageText(value){
  const escaped = escapeHtml(value);
  return escaped.replaceAll("OO", `<strong class="nickname-text">${formatNickname(NICKNAME)}</strong>`);
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

function normalizeDateText(value){
  return String(value || "")
    .trim()
    .replaceAll("年", "-")
    .replaceAll("月", "-")
    .replaceAll("日", "")
    .replaceAll("/", "-")
    .replaceAll(".", "-")
    .replace(/\s+/g, "");
}

function parseSearchDate(keyword){
  const raw = String(keyword || "").trim();
  if(!raw) return null;

  // 只取數字，用來支援 2023 / 202307 / 20230715 / 0715
  const digits = raw.replace(/\D/g, "");

  // 20230715
  let m = digits.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(m){
    return {
      year: m[1],
      month: m[2],
      day: m[3]
    };
  }

  // 202307
  m = digits.match(/^(\d{4})(\d{2})$/);
  if(m){
    return {
      year: m[1],
      month: m[2],
      day: ""
    };
  }

  // 2023
  m = digits.match(/^(\d{4})$/);
  if(m){
    return {
      year: m[1],
      month: "",
      day: ""
    };
  }

  // 0715
  m = digits.match(/^(\d{2})(\d{2})$/);
  if(m){
    return {
      year: "",
      month: m[1],
      day: m[2]
    };
  }

  // 把中文日期、斜線、點號、空白都轉成 -
  const q = raw
    .replaceAll("年", "-")
    .replaceAll("月", "-")
    .replaceAll("日", "")
    .replaceAll("/", "-")
    .replaceAll(".", "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 2023-07-15 / 2023 07 15 / 2023年07月15日
  m = q.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    return {
      year: m[1],
      month: m[2].padStart(2, "0"),
      day: m[3].padStart(2, "0")
    };
  }

  // 2023-07 / 2023 07 / 2023年07月
  m = q.match(/^(\d{4})-(\d{1,2})$/);
  if(m){
    return {
      year: m[1],
      month: m[2].padStart(2, "0"),
      day: ""
    };
  }

  // 07-15 / 7-15 / 07月15日
  m = q.match(/^(\d{1,2})-(\d{1,2})$/);
  if(m){
    return {
      year: "",
      month: m[1].padStart(2, "0"),
      day: m[2].padStart(2, "0")
    };
  }

  return null;
}

function dateKeyMatches(dateKey, parsed){
  const normalized = normalizeDateText(dateKey);
  const m = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(!m) return false;

  const y = m[1];
  const mo = m[2].padStart(2, "0");
  const d = m[3].padStart(2, "0");

  if(parsed.year && parsed.year !== y) return false;
  if(parsed.month && parsed.month !== mo) return false;
  if(parsed.day && parsed.day !== d) return false;

  return true;
}

function scrollToDate(keyword){
  const parsed = parseSearchDate(keyword);
  if(!parsed) return false;

  const matchedDates = Object.keys(allMessages)
    .filter(date => dateKeyMatches(date, parsed))
    .sort((a, b) => {
      const diff = dateSortValue(a) - dateSortValue(b);
      return diff || String(a).localeCompare(String(b));
    });

  if(!matchedDates.length) return false;

  const targetDate = matchedDates[0];

  renderMessages(allMessages);

  requestAnimationFrame(() => {
    const target = document.querySelector(`[data-date="${CSS.escape(targetDate)}"]`);

    if(target){
      chat.scrollTop = Math.max(0, target.offsetTop - chat.offsetTop - 12);
    }
  });

  return true;
}

function searchMessages(keyword){
  if(scrollToDate(keyword)){
    return;
  }

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

  return str;
}

function getVideoThumbUrl(url){
  const str = String(url || "");

  if(str.includes("/video/upload/")){
    return str
      .replace(
        "/video/upload/",
        "/video/upload/c_fill,w_240,h_240,q_auto,f_jpg/"
      )
      .replace(/\.(mp4|webm|mov)(\?.*)?$/i, ".jpg");
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
        <div class="media-audio-text">&nbsp;&nbsp;語音訊息</div>
        ${time ? `<span class="media-time">${escapeHtml(time)}</span>` : ""}
      </div>
    `;
  }

  if(kind === "video"){
    const videoThumbUrl = escapeAttr(getVideoThumbUrl(item.url));

    return `
      <div class="media-card"
           onclick="openMediaViewer('${rawUrl}', 'video')">
        <img src="${videoThumbUrl}" loading="lazy" decoding="async">
        <div class="media-play-overlay">
          <div class="media-play-icon">▶</div>
        </div>
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
  return ["chat", "settings", "media", "edit-nickname", "edit-chat-name"].includes(value) ? value : "chat";
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
  const settingsEditPage = document.getElementById("settingsEditPage");

  if(app) app.style.display = "none";
  if(settingsPage) settingsPage.style.display = "none";
  if(mediaPage) mediaPage.style.display = "none";
  if(settingsEditPage) settingsEditPage.style.display = "none";

  if(nextPage === "settings"){
    renderSettingsItems();
    if(settingsPage) settingsPage.style.display = "flex";
    return;
  }

  if(nextPage === "media"){
    const pageEl = ensureMediaPage();
    pageEl.style.display = "flex";
    renderMediaPage();
    return;
  }

  if(nextPage === "edit-nickname" || nextPage === "edit-chat-name"){
    const pageEl = ensureSettingsEditPage();
    pageEl.style.display = "flex";
    renderSettingsEditPage(nextPage);
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



const SETTINGS_EDIT_CONFIG = {
  "edit-nickname": {
    title:"編輯您的暱稱。",
    label:"暱稱",
    max:20,
    get:() => NICKNAME,
    set:value => {
      NICKNAME = value;
      localStorage.setItem("frommNickname", NICKNAME);
      renderMessages(allMessages);
    }
  },
  "edit-chat-name": {
    title:"編輯聊天室名稱。",
    label:"聊天室名稱",
    max:20,
    get:() => artistName,
    set:value => {
      artistName = value;
      localStorage.setItem("frommChatName", artistName);
    }
  }
};

let currentSettingsEditType = "";

function ensureSettingsEditPage(){
  let page = document.getElementById("settingsEditPage");
  if(page) return page;

  page = document.createElement("div");
  page.id = "settingsEditPage";
  page.className = "settings-page settings-edit-page";
  page.innerHTML = `
    <div class="header settings-edit-header">
      <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="showSettings()">‹</button>
      <button class="settings-save-btn" id="settingsEditSaveBtn" type="button" onclick="saveSettingsEdit()">儲存</button>
    </div>

    <div class="settings-edit-content">
      <div class="settings-edit-title" id="settingsEditTitle"></div>

      <div class="settings-edit-field">
        <label class="settings-edit-label" id="settingsEditLabel" for="settingsEditInput"></label>
        <div class="settings-edit-input-row">
          <input class="settings-edit-input" id="settingsEditInput" type="text" autocomplete="off" spellcheck="false">
          <button class="settings-edit-clear" id="settingsEditClearBtn" type="button" aria-label="清除" onclick="clearSettingsEditInput()">×</button>
        </div>
      </div>

      <div class="settings-edit-count" id="settingsEditCount"></div>
    </div>
  `;

  document.body.appendChild(page);

  const input = page.querySelector("#settingsEditInput");
  input.addEventListener("input", updateSettingsEditState);
  input.addEventListener("keydown", e => {
    if(e.key === "Enter"){
      e.preventDefault();
      saveSettingsEdit();
    }
  });

  return page;
}

function renderSettingsEditPage(type){
  currentSettingsEditType = type;
  const config = SETTINGS_EDIT_CONFIG[type];
  if(!config) return;

  const page = ensureSettingsEditPage();
  const title = page.querySelector("#settingsEditTitle");
  const label = page.querySelector("#settingsEditLabel");
  const input = page.querySelector("#settingsEditInput");

  title.textContent = config.title;
  label.textContent = config.label;
  input.maxLength = config.max;
  input.value = config.get();

  updateSettingsEditState();
  requestAnimationFrame(() => input.focus());
}

function updateSettingsEditState(){
  const config = SETTINGS_EDIT_CONFIG[currentSettingsEditType];
  const input = document.getElementById("settingsEditInput");
  const count = document.getElementById("settingsEditCount");
  const saveBtn = document.getElementById("settingsEditSaveBtn");
  const clearBtn = document.getElementById("settingsEditClearBtn");
  if(!config || !input || !count || !saveBtn) return;

  const rawValue = input.value || "";
  const value = rawValue.trim();
  const len = [...rawValue].length;
  const hasValue = value.length > 0;

  count.textContent = `${len}/${config.max}`;
  saveBtn.disabled = !hasValue;
  saveBtn.classList.toggle("active", hasValue);
  if(clearBtn) clearBtn.style.visibility = rawValue ? "visible" : "hidden";
}

function clearSettingsEditInput(){
  const input = document.getElementById("settingsEditInput");
  if(!input) return;
  input.value = "";
  updateSettingsEditState();
  input.focus();
}

function saveSettingsEdit(){
  const config = SETTINGS_EDIT_CONFIG[currentSettingsEditType];
  const input = document.getElementById("settingsEditInput");
  if(!config || !input) return;

  const value = input.value.trim();
  if(!value) return;

  config.set(value);
  updateSettingsLabels();
  setPage("settings");
}

const SETTINGS_ITEMS = [
  { title:"照片、影片", value:"", page:"media" },
  { title:"語音訊息", value:"" },
  { title:"我的暱稱", value:() => NICKNAME, action:"edit-nickname" },
  { title:"聊天室名稱", value:() => artistName, action:"edit-chat-name" },
  { title:"聊天室背景設定", value:"" },

];

function renderSettingsItems(){
  const settingsContent = document.getElementById("settingsContent");
  if(!settingsContent) return;

  settingsContent.innerHTML = SETTINGS_ITEMS.map(item => {
    const attrs = ["class=\"setting-item\"", "role=\"button\"", "tabindex=\"0\""];
    if(item.page) attrs.push(`data-page="${escapeAttr(item.page)}"`);
    if(item.action) attrs.push(`data-action="${escapeAttr(item.action)}"`);

    const value = typeof item.value === "function" ? item.value() : item.value;

    return `
      <div ${attrs.join(" ")}>
        <div class="setting-main">
          <div class="setting-title">${escapeHtml(item.title)}</div>
          ${value ? `<div class="setting-value">${escapeHtml(value)}</div>` : ""}
        </div>
        <div class="setting-arrow" aria-hidden="true">›</div>
      </div>
    `;
  }).join("");
}

function updateSettingsLabels(){
  const artistEl = document.getElementById("artistName");
  if(artistEl) artistEl.textContent = artistName;
  renderSettingsItems();
}

function editNickname(){
  setPage("edit-nickname");
}

function editChatName(){
  setPage("edit-chat-name");
}

document.addEventListener("click", e => {
  const mediaItem = e.target.closest('[data-page="media"]');
  if(mediaItem){
    showMediaPage();
    return;
  }

  const actionItem = e.target.closest('[data-action]');
  const action = actionItem?.dataset.action;

  if(action === "edit-nickname"){
    editNickname();
    return;
  }

  if(action === "edit-chat-name"){
    editChatName();
    return;
  }
});

document.addEventListener("keydown", e => {
  const item = e.target.closest?.(".setting-item");
  if(!item) return;
  if(e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  item.click();
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
    updateSettingsLabels();
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
