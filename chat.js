// chat.js
// 聊天室、搜尋、設定、主題、媒體瀏覽與訊息載入。
// 請在 HTML 中先載入 main.js，再載入 chat.js。

function renderChatLayout(){
  const root = document.getElementById("appRoot") || document.body;

  ["frommChatApp", "settingsPage"].forEach(id => {
    const old = document.getElementById(id);
    if(old) old.remove();
  });

  const app = document.createElement("div");
  app.id = "frommChatApp";
  app.className = "app";
  app.style.display = "none";
  app.innerHTML = `
    <div class="header chat-header">
      <div class="header-bar" id="headerNormal">
        <button class="nav-btn back-btn" type="button" aria-label="返回" onclick="goBackFromPage()">
          <span class="back-icon">‹</span>
        </button>
        <div class="name" id="artistName">&nbsp;선우</div>

        <div class="header-actions">
          <button class="nav-btn search-btn" type="button" aria-label="搜尋" onclick="openSearch()">
            <span class="icon-search" aria-hidden="true"></span>
          </button>
          <button
            id="translationToggleBtn"
            class="nav-btn translation-btn"
            type="button"
            aria-label="切換翻譯"
            aria-pressed="false"
            onclick="toggleTranslation()"
            style="font-weight:700; opacity:.45;transform:translateY(1px)"
          >文</button>
          <button class="nav-btn menu-btn" type="button" onclick="showSettings()" aria-label="聊天室設定">☰</button>
        </div>
      </div>

      <div class="header-bar search-mode" id="headerSearch" style="display:none;">
        <button class="nav-btn back-btn" type="button" aria-label="返回" onclick="closeSearch()">
          <span class="back-icon">‹</span>
        </button>

        <div class="header-search-box">
          <span class="icon-search search-box-icon" aria-hidden="true"></span>
          <input id="searchInput" class="header-search-input" type="text" placeholder="搜尋訊息">
        </div>

        <button class="nav-btn close-btn" type="button" aria-label="關閉搜尋" onclick="closeSearch()">×</button>
      </div>
    </div>

    <div class="chat" id="chat"></div>


  `;

  //<div class="input-area">
  //    <input id="userInput" placeholder="傳送訊息" onkeydown="if(event.key==='Enter')sendUser()">
  //    <button onclick="sendUser()">送出</button>
  //  </div>
  root.appendChild(app);

  const settingsPage = document.createElement("div");
  settingsPage.id = "settingsPage";
  settingsPage.className = "settings-page";
  settingsPage.innerHTML = `
    <div class="header settings-header">
      <div class="header-bar">
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室" onclick="goBackFromPage()">
          <span class="back-icon">‹</span>
        </button>
        <div class="name">聊天室設定</div>
        <div class="header-actions placeholder-actions">
          <span class="nav-placeholder"></span>
          <span class="nav-placeholder"></span>
        </div>
      </div>
    </div>

    <div class="settings-content" id="settingsContent"></div>
  `;
  root.appendChild(settingsPage);
}

renderChatLayout();

const chat = document.getElementById("chat");
const DEFAULT_ARTIST_NAME = "선우";
const DEFAULT_NICKNAME = "더비";
let artistName = getSavedChatName(getCurrentFriend().id, getCurrentFriend().name || DEFAULT_ARTIST_NAME);
let NICKNAME = getSavedNickname(getCurrentFriend().id, DEFAULT_NICKNAME);

// 第一次使用時翻譯預設關閉；之後記住上次開關狀態。
let SHOW_TRANSLATION = localStorage.getItem("frommShowTranslation") === "true";

const DEFAULT_THEME_COLOR = "#111216";
const DEFAULT_THEME_MODE = "preset";
const DEFAULT_THEME_PRESET = "black";
const DEFAULT_CHAT_BG_IMAGE = "";

const THEME_PRESETS = {
  pink: {
      label:"粉",
      base:"#e88aac",
      //聊天畫面背景，就是訊息泡泡後面那整塊背景。
      chatBg:"#ffe4ee",
      //設定頁背景，例如聊天室設定、聊天室主題、自訂背景、預設主題頁的深色背景。
      settingsBg:"#ffe4ee",
      //照片影片 / 語音訊息頁背景。
      mediaBg:"#ffe4ee",
      //上方標題列，例如聊天室名稱那條、設定頁上方標題列。
      header:"#e88aac",
      //下方輸入區整條背景，就是輸入框和送出按鈕外面的底色。
      inputArea:"#f7bfd1",
      //輸入框本身背景，也會影響搜尋框背景。
      inputBg:"#fff3f7",
      //對方訊息框背景，也就是藝人訊息泡泡。
      artistBubble:"#ffffff",
      //自己傳的訊息框背景。
      userBubble:"#f4b6cb",
      //回覆引用框背景，也就是被回覆訊息那塊小框，還有旁邊的線。
      quoteBubble:"#f8cddd",
      //語音相關背景，語音縮圖卡片、語音點開後的播放頁背景。
      audioBg:"#f4a6c0",
      //照片影片頁的卡片底色，圖片或影片還沒載入、或語音卡片底色會用到。
      mediaCard:"#f6bfd1",
      //輔助色，之後可以拿來做色票邊框、選中狀態、提示文字之類的。
      accent:"#d982a4",
      textColor:"#111216",
      artistText:"#111216",
      userText:"#111216",
      inputText:"#111216",
      placeholderText:"#8d6875",
      //選中的字色
      mediaTab:"#c9658b",
      //沒選中的字色
      mediaTabInactive:"#b98a9a",
    },

    blue: {
      label:"藍",
      base:"#6f9fe8",
      //聊天畫面背景，就是訊息泡泡後面那整塊背景。
      chatBg:"#eaf5ff",
      //設定頁背景，例如聊天室設定、聊天室主題、自訂背景、預設主題頁的深色背景。
      settingsBg:"#eaf5ff",
      //照片影片 / 語音訊息頁背景。
      mediaBg:"#eaf5ff",
      //上方標題列，例如聊天室名稱那條、設定頁上方標題列。
      header:"#7fb0ee",
      //下方輸入區整條背景，就是輸入框和送出按鈕外面的底色。
      inputArea:"#b9d8ff",
      //輸入框本身背景，也會影響搜尋框背景。
      inputBg:"#f3f9ff",
      //對方訊息框背景，也就是藝人訊息泡泡。
      artistBubble:"#ffffff",
      //自己傳的訊息框背景。
      userBubble:"#b7d6ff",
      //回覆引用框背景，也就是被回覆訊息那塊小框，還有旁邊的線。
      quoteBubble:"#d3e6ff",
      //語音相關背景，語音縮圖卡片、語音點開後的播放頁背景。
      audioBg:"#9bc6f7",
      //照片影片頁的卡片底色，圖片或影片還沒載入、或語音卡片底色會用到。
      mediaCard:"#c4ddff",
      //輔助色，之後可以拿來做色票邊框、選中狀態、提示文字之類的。
      accent:"#5c8fd6",
      textColor:"#111216",
      artistText:"#111216",
      userText:"#111216",
      inputText:"#111216",
      placeholderText:"#65798f",
      mediaTab:"#3f659d",
      mediaTabInactive:"#7f93ad",
    },

    purple: {
      label:"紫",
      base:"#9a7be8",
      //聊天畫面背景，就是訊息泡泡後面那整塊背景。
      chatBg:"#f2ecff",
      //設定頁背景，例如聊天室設定、聊天室主題、自訂背景、預設主題頁的深色背景。
      settingsBg:"#f2ecff",
      //照片影片 / 語音訊息頁背景。
      mediaBg:"#f2ecff",
      //上方標題列，例如聊天室名稱那條、設定頁上方標題列。
      header:"#a58bed",
      //下方輸入區整條背景，就是輸入框和送出按鈕外面的底色。
      inputArea:"#d2c3ff",
      //輸入框本身背景，也會影響搜尋框背景。
      inputBg:"#faf7ff",
      //對方訊息框背景，也就是藝人訊息泡泡。
      artistBubble:"#ffffff",
      //自己傳的訊息框背景。
      userBubble:"#c9b8f4",
      //回覆引用框背景，也就是被回覆訊息那塊小框，還有旁邊的線。
      quoteBubble:"#ded3ff",
      //語音相關背景，語音縮圖卡片、語音點開後的播放頁背景。
      audioBg:"#b8a4f0",
      //照片影片頁的卡片底色，圖片或影片還沒載入、或語音卡片底色會用到。
      mediaCard:"#d6c9ff",
      //輔助色，之後可以拿來做色票邊框、選中狀態、提示文字之類的。
      accent:"#7f65c8",
      textColor:"#111216",
      artistText:"#111216",
      userText:"#111216",
      inputText:"#111216",
      placeholderText:"#76698f",
      mediaTab:"#6650a8",
      mediaTabInactive:"#8d7cac",
    },
    purple: {
      label:"pm紫",

      // 圖片中的主紫色
      base:"#7048F6",

      // 圖片背景：偏藍的淡薰衣草色
      chatBg:"#D9DCFD",

      settingsBg:"#D9DCFD",
      mediaBg:"#D9DCFD",

      // 圖片看起來標題區也是同一個淡紫底
      header:"#7048F6",

      // 輸入區
      inputArea:"#7048F6",
      inputBg:"#F5F6FF",

      // 對方訊息：圖片中的亮紫色
      artistBubble:"#7048F6",

      // 自己訊息先保留較淺色區分
      userBubble:"#FFFFFF",

      // 引用區
      quoteBubble:"#B9A9FA",

      // 語音 / 媒體
      audioBg:"#8F70F8",
      mediaCard:"#C7C5F7",

      // 輔助紫
      accent:"#7048F6",

      // 一般文字
      textColor:"#111111",

      // 圖片紫色泡泡裡是白字
      artistText:"#FFFFFF",

      // 自己的白色泡泡用黑字
      userText:"#111111",

      inputText:"#111111",
      placeholderText:"#8588A5",

      mediaTab:"#7048F6",
      mediaTabInactive:"#9699B8",
},

  black: {
    label:"黑",
    base:"#111216",

    chatBg:"#ffffff",
    settingsBg:"#111216",
    mediaBg:"#111216",

    header:"#17181c",
    inputArea:"#111216",
    inputBg:"#333741",

    artistBubble:"#eeeeF1",
    userBubble:"#2b2d35",
    quoteBubble:"#24262d",

    audioBg:"#24262d",
    mediaCard:"#24262d",
    accent:"#8f9199",
    textColor:"#ffffff",
    artistText:"#111216",
    userText:"#ffffff",
    inputText:"#ffffff",
    placeholderText:"#8f949d",
    mediaTab:"#e6e6e6",
    mediaTabInactive:"#5f5f5f",
  }
};

let themeMode = localStorage.getItem("frommThemeMode") || DEFAULT_THEME_MODE;
let themePreset = localStorage.getItem("frommThemePreset") || DEFAULT_THEME_PRESET;
let themeColor = localStorage.getItem("frommThemeColor") || DEFAULT_THEME_COLOR;
let chatBgImage = "";
let chatBgObjectUrl = "";
let allMessages = {};
let currentMediaTab = "media";
let currentMediaViewerItems = [];
let currentMediaViewerIndex = -1;
let mediaViewerSwipeBound = false;
let mediaViewerAnimating = false;

function applyCurrentFriendMeta(){
  const friend = getCurrentFriend();

  // 優先讀取這個聊天室自己保存的名稱；沒有才使用 main.js 裡的預設名稱。
  artistName = getSavedChatName(friend.id, friend.name || DEFAULT_ARTIST_NAME);

  // 每個聊天室都有自己的「我的暱稱」。
  NICKNAME = getSavedNickname(friend.id, DEFAULT_NICKNAME);

  // 這個 CSS 變數會同步控制：聊天室頭貼、語音縮圖、語音播放頁頭貼。
  document.documentElement.style.setProperty("--avatar-image", `url("${getProfileImage(friend.id, "", "", "./icons/profile.jpg")}")`);

  const artistEl = document.getElementById("artistName");
  if(artistEl) artistEl.textContent = artistName;
}

async function selectFriend(friendId){
  const friend = setCurrentFriendId(friendId);
  applyCurrentFriendMeta();

  try{
    allMessages = await loadAllMessageFiles(friend.messages);
    applyThemeColor();
    updateSettingsLabels();
    updateTranslationToggleButton();
    renderMessages(allMessages);
    setPage("chat");
  }catch(err){
    console.error(err);
    chat.innerHTML = `<div class="error-msg">messages.json 讀取失敗：${escapeHtml(err.message)}</div>`;
    setPage("chat");
  }
}

function normalizeHexColor(value){
  let color = String(value || "").trim();
  if(!color) return "";

  if(!color.startsWith("#")){
    color = "#" + color;
  }

  if(/^#[0-9a-fA-F]{3}$/.test(color)){
    color = "#" + color.slice(1).split("").map(ch => ch + ch).join("");
  }

  if(!/^#[0-9a-fA-F]{6}$/.test(color)){
    return "";
  }

  return color.toLowerCase();
}

function mixColor(hex, amount){
  const color = normalizeHexColor(hex) || DEFAULT_THEME_COLOR;
  const n = parseInt(color.slice(1), 16);

  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return `rgb(${r}, ${g}, ${b})`;
}

function getThemePalette(){
  const preset = THEME_PRESETS[themePreset] || THEME_PRESETS[DEFAULT_THEME_PRESET];

  if(themeMode === "custom"){
    const color = normalizeHexColor(themeColor) || DEFAULT_THEME_COLOR;
    themeColor = color;

    return {
      label:"自訂",
      base:color,
      chatBg:mixColor(color, 238),
      settingsBg:mixColor(color, -42),
      mediaBg:mixColor(color, -42),
      header:mixColor(color, 8),
      inputArea:mixColor(color, -18),
      inputBg:mixColor(color, 22),
      artistBubble:"#ffffff",
      userBubble:mixColor(color, 34),
      quoteBubble:mixColor(color, 18),
      audioBg:color,
      mediaCard:mixColor(color, 24),
      accent:mixColor(color, 72),
      chatBgImage:chatBgImage
    };
  }

  return {
    ...preset,
    chatBgImage:chatBgImage
  };
}

function applyThemeColor(){
  const palette = getThemePalette();

  // 外框固定深色，避免整個瀏覽器背景變主題色
  document.documentElement.style.setProperty("--theme-bg", "#111216");
  document.documentElement.style.setProperty("--theme-settings-bg", palette.settingsBg || "#111216");
  document.documentElement.style.setProperty("--theme-media-bg", palette.mediaBg || palette.settingsBg || "#111216");

  document.documentElement.style.setProperty("--theme-panel", palette.header);
  document.documentElement.style.setProperty("--theme-input-area-bg", palette.inputArea);
  document.documentElement.style.setProperty("--theme-input-bg", palette.inputBg);
  document.documentElement.style.setProperty("--theme-card", palette.userBubble);
  document.documentElement.style.setProperty("--theme-quote", palette.quoteBubble);
  document.documentElement.style.setProperty("--theme-bubble-bg", palette.artistBubble);
  document.documentElement.style.setProperty("--theme-chat-bg", palette.chatBg);
  document.documentElement.style.setProperty("--theme-audio-bg", palette.audioBg);
  document.documentElement.style.setProperty("--theme-media-card", palette.mediaCard);
  document.documentElement.style.setProperty("--theme-accent", palette.accent);
  document.documentElement.style.setProperty("--theme-media-tab", palette.mediaTab || palette.header || "#ffffff");
  document.documentElement.style.setProperty("--theme-media-tab-inactive", palette.mediaTabInactive || "rgba(255,255,255,.35)");
  document.documentElement.style.setProperty("--theme-text-color", palette.textColor || "#111216");
  document.documentElement.style.setProperty("--theme-artist-text", palette.artistText || palette.textColor || "#111216");
  document.documentElement.style.setProperty("--theme-user-text", palette.userText || palette.textColor || "#ffffff");
  document.documentElement.style.setProperty("--theme-input-text", palette.inputText || palette.textColor || "#ffffff");
  document.documentElement.style.setProperty("--theme-placeholder-text", palette.placeholderText || "#8f949d");

  document.documentElement.style.setProperty("--theme-setting-title", palette.textColor || "#d9dbe0");
  document.documentElement.style.setProperty("--theme-setting-value", palette.textColor || "#a5a8af");
  document.documentElement.style.setProperty("--theme-setting-arrow", palette.textColor || "#a5a8af");


  const image = chatBgObjectUrl || String(palette.chatBgImage || "").trim();
  const cssImage = image ? `url("${image}")` : "none";
  document.documentElement.style.setProperty("--chat-bg-image", cssImage);
}

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

  return `${y}.${m}.${d}`;
}

function addDateDivider(date){
  const div = document.createElement("div");
  div.className = "date-divider";
  div.dataset.date = date;

  const normalized = normalizeDateText(date);
  const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(match){
    div.dataset.normalizedDate = `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  }

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

function getMediaHtml(item, date = ""){
  if(!item || !item.url) return "";
  const url = escapeAttr(item.url);
  const kind = getMediaKind(item);
  const rawUrl = escapeAttr(item.url);
  const rawDate = escapeAttr(date || "");
  const rawTime = escapeAttr(item.time || "");

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
    return `
      <video
        class="chat-video chat-media-clickable"
        controls
        preload="metadata"
        src="${url}"
        data-media-url="${rawUrl}"
        data-media-kind="video"
        data-media-date="${rawDate}"
        data-media-time="${rawTime}"
      ></video>
    `;
  }

  const cls = kind === "emoticon"
    ? "emoticon-media"
    : "chat-media chat-media-clickable";

  return `
    <img
      class="${cls}"
      src="${url}"
      loading="lazy"
      data-media-url="${rawUrl}"
      data-media-kind="${escapeAttr(kind)}"
      data-media-date="${rawDate}"
      data-media-time="${rawTime}"
    >
  `;
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

let audioProgressRaf = null;

function stopAudioProgressLoop(){
  if(audioProgressRaf){
    cancelAnimationFrame(audioProgressRaf);
    audioProgressRaf = null;
  }
}

function updateAudioBubbleProgress(box, audio){
  if(!box || !audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;

  const label = box.querySelector(".audio-duration");
  const scale = Math.min(1, Math.max(0, audio.currentTime / audio.duration));

  box.style.setProperty("--audio-progress-scale", String(scale));

  if(label){
    label.textContent = secToTime(Math.max(0, audio.duration - audio.currentTime));
  }
}

function startAudioProgressLoop(box, audio){
  stopAudioProgressLoop();

  const loop = () => {
    if(audio.paused || audio.ended){
      stopAudioProgressLoop();
      return;
    }

    updateAudioBubbleProgress(box, audio);
    audioProgressRaf = requestAnimationFrame(loop);
  };

  audioProgressRaf = requestAnimationFrame(loop);
}

function resetAudioBubbleProgress(audio){
  const box = audio.closest(".audio-bubble");
  const play = box?.querySelector(".audio-play");
  const label = box?.querySelector(".audio-duration");

  if(play) play.textContent = "▶";

  if(label && Number.isFinite(audio.duration)){
    label.textContent = secToTime(audio.duration);
  }

  if(box){
    box.classList.remove("playing");
    box.style.setProperty("--audio-progress-scale", "0");
  }
}

function toggleAudio(box){
  const audio = box.querySelector("audio");
  const play = box.querySelector(".audio-play");
  if(!audio) return;

  document.querySelectorAll(".audio-bubble audio").forEach(a => {
    if(a !== audio){
      a.pause();
      resetAudioBubbleProgress(a);
    }
  });

  if(audio.paused){
    const playPromise = audio.play();

    box.classList.add("playing");
    if(play) play.textContent = "❚❚";

    updateAudioBubbleProgress(box, audio);
    startAudioProgressLoop(box, audio);

    if(playPromise && typeof playPromise.catch === "function"){
      playPromise.catch(() => {
        stopAudioProgressLoop();
        box.classList.remove("playing");
        if(play) play.textContent = "▶";
      });
    }
  }else{
    audio.pause();
    stopAudioProgressLoop();
    box.classList.remove("playing");
    if(play) play.textContent = "▶";
  }
}

function resetAudioButton(audio){
  stopAudioProgressLoop();
  resetAudioBubbleProgress(audio);
}

function updateTranslationToggleButton(){
  const btn = document.getElementById("translationToggleBtn");
  if(!btn) return;

  btn.classList.toggle("active", SHOW_TRANSLATION);
  btn.setAttribute("aria-pressed", SHOW_TRANSLATION ? "true" : "false");
  btn.style.opacity = SHOW_TRANSLATION ? "1" : ".45";
}

function rerenderMessagesKeepPosition(){
  const chatRect = chat.getBoundingClientRect();
  const children = Array.from(chat.children);

  // 記住目前畫面最上方看得到的訊息／日期，以及它相對聊天室頂端的位置。
  let anchorIndex = -1;
  let anchorOffset = 0;

  for(let i = 0; i < children.length; i++){
    const rect = children[i].getBoundingClientRect();

    if(rect.bottom > chatRect.top){
      anchorIndex = i;
      anchorOffset = rect.top - chatRect.top;
      break;
    }
  }

  // 記住目前已經渲染到哪裡，避免切翻譯後只剩前 150 筆而跳回前面。
  const oldRenderedCount = renderedItemCount;

  renderMessages(allMessages);

  // 補回切換前已載入的訊息數量。
  while(renderedItemCount < oldRenderedCount && renderedItemCount < flatRenderItems.length){
    appendNextMessageBatch();
  }

  // 讓原本畫面最上方那一則訊息維持在相同位置。
  if(anchorIndex >= 0){
    requestAnimationFrame(() => {
      const newAnchor = chat.children[anchorIndex];
      if(!newAnchor) return;

      const newChatRect = chat.getBoundingClientRect();
      const newAnchorRect = newAnchor.getBoundingClientRect();
      const delta = (newAnchorRect.top - newChatRect.top) - anchorOffset;

      chat.scrollTop += delta;
    });
  }
}

function toggleTranslation(){
  SHOW_TRANSLATION = !SHOW_TRANSLATION;
  localStorage.setItem("frommShowTranslation", SHOW_TRANSLATION ? "true" : "false");
  updateTranslationToggleButton();
  rerenderMessagesKeepPosition();
}

function addArtistMessage(item, date = ""){
  const text = displayText(typeof item === "string" ? item : item.text);
  const trans = displayText(typeof item === "string" ? "" : item.trans);
  const quote = displayText(typeof item === "string" ? "" : item.quote);
  const quoteTrans = displayText(typeof item === "string" ? "" : item.quoteTrans);
  const mediaHtml = typeof item === "string" ? "" : getMediaHtml(item, date);
  const mediaKind = typeof item === "string" ? "" : getMediaKind(item);
  const mediaOnly = mediaHtml && ["image", "video", "emoticon", "audio"].includes(mediaKind);

  const quoteHtml = quote
    ? `
      <div class="reply-wrap">
        <div class="reply-line"></div>
        <div class="quote-box">
          <div>${escapeHtml(quote)}</div>
          ${SHOW_TRANSLATION && quoteTrans ? `
            <div class="bubble-divider"></div>
            <div>${escapeHtml(quoteTrans)}</div>
          ` : ""}
        </div>
      </div>
    `
    : "";

  const showText = text && !(mediaHtml && /^\([^)]*\)$/.test(text));
  const transHtml = SHOW_TRANSLATION && trans && !mediaOnly
      ? `
        <div class="bubble-divider"></div>
        <div class="msg-text trans-text">${formatMessageText(typeof item === "string" ? "" : item.trans)}</div>

      `
      : "";

    const contentHtml = mediaOnly
      ? `<div class="media-wrap">${mediaHtml}</div>`
      : `<div class="bubble">
            ${showText ? `<div class="msg-text original-text">${formatMessageText(typeof item === "string" ? item : item.text)}</div>` : ""}
            ${mediaHtml}
            ${transHtml}
         </div>`;

  const avatarUrl = getProfileImage(getCurrentFriend().id, date, typeof item === "string" ? "" : item.time, "./icons/profile.jpg");

  const row = document.createElement("div");
  row.className = "msg-row";
  row.innerHTML = `
    <div class="avatar" style="background-image:url('${escapeAttr(avatarUrl)}')"></div>
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
  return escaped
    .replaceAll("OO", `<strong class="nickname-text">${formatNickname(NICKNAME)}</strong>`)
    .replace(/([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}])/gu, `<span class="emoji-text">$1</span>`);
}

function escapeAttr(str){
  return escapeHtml(str).replaceAll('"', '&quot;');
}


const MESSAGE_RENDER_BATCH_SIZE = 150;
let flatRenderItems = [];
let renderedItemCount = 0;
let isAppendingMessages = false;

function flattenMessagesForRender(data){
  const flat = [];

  // 一般進入聊天室時，固定依日期由舊到新排列，
  // 不使用 JSON 檔案合併後的物件插入順序。
  const dates = Object.keys(data).sort((a, b) => {
    const diff = dateSortValue(a) - dateSortValue(b);
    return diff || String(a).localeCompare(String(b));
  });

  dates.forEach(date => {
    flat.push({ type:"date", date });

    (data[date] || []).forEach(item => {
      flat.push({ type:"message", date, item });
    });
  });

  return flat;
}

function appendNextMessageBatch(){
  if(isAppendingMessages) return;
  if(renderedItemCount >= flatRenderItems.length) return;

  isAppendingMessages = true;

  const fragment = document.createDocumentFragment();
  const oldAppendChild = chat.appendChild.bind(chat);

  chat.appendChild = node => fragment.appendChild(node);

  const end = Math.min(renderedItemCount + MESSAGE_RENDER_BATCH_SIZE, flatRenderItems.length);

  for(let i = renderedItemCount; i < end; i++){
    const entry = flatRenderItems[i];

    if(entry.type === "date"){
      addDateDivider(entry.date);
    }else if(entry.type === "message"){
      addArtistMessage(entry.item, entry.date);
    }
  }

  chat.appendChild = oldAppendChild;
  chat.appendChild(fragment);

  renderedItemCount = end;
  isAppendingMessages = false;
}

function renderMessages(data){
  chat.innerHTML = "";
  flatRenderItems = flattenMessagesForRender(data);
  renderedItemCount = 0;

  appendNextMessageBatch();

  chat.scrollTop = 0;
}

chat.addEventListener("scroll", () => {
  const distanceToBottom = chat.scrollHeight - chat.scrollTop - chat.clientHeight;

  if(distanceToBottom < 600){
    appendNextMessageBatch();
  }
});

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


  normalHeader.removeAttribute("style");

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
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSearchDate(keyword){
  const raw = String(keyword || "").trim();
  if(!raw) return null;

  const digits = raw.replace(/\D/g, "");
  let m;

  // 20230302
  m = digits.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(m){
    return { year:m[1], month:m[2], day:m[3] };
  }

  // 230302
  m = digits.match(/^(\d{2})(\d{2})(\d{2})$/);
  if(m){
    return { year:"20" + m[1], month:m[2], day:m[3] };
  }

  // 202303
  m = digits.match(/^(\d{4})(\d{2})$/);
  if(m){
    return { year:m[1], month:m[2], day:"" };
  }

  // 2303 / 2406
  m = digits.match(/^(\d{2})(\d{2})$/);
  if(m && Number(m[1]) >= 20){
    return { year:"20" + m[1], month:m[2], day:"" };
  }

  // 0302 / 0715
  m = digits.match(/^(\d{2})(\d{2})$/);
  if(m){
    return { year:"", month:m[1], day:m[2] };
  }

  // 2023
  m = digits.match(/^(\d{4})$/);
  if(m && Number(m[1]) >= 1900){
    return { year:m[1], month:"", day:"" };
  }

  // 23 / 24
  m = digits.match(/^(\d{2})$/);
  if(m){
    return { year:"20" + m[1], month:"", day:"" };
  }

  const q = normalizeDateText(raw);

  // 2023-03-02
  m = q.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    return {
      year:m[1],
      month:m[2].padStart(2, "0"),
      day:m[3].padStart(2, "0")
    };
  }

  // 23-03-02
  m = q.match(/^(\d{2})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    return {
      year:"20" + m[1],
      month:m[2].padStart(2, "0"),
      day:m[3].padStart(2, "0")
    };
  }

  // 2023-03
  m = q.match(/^(\d{4})-(\d{1,2})$/);
  if(m){
    return {
      year:m[1],
      month:m[2].padStart(2, "0"),
      day:""
    };
  }

  // 23-03
  m = q.match(/^(\d{2})-(\d{1,2})$/);
  if(m){
    return {
      year:"20" + m[1],
      month:m[2].padStart(2, "0"),
      day:""
    };
  }

  // 03-02
  m = q.match(/^(\d{1,2})-(\d{1,2})$/);
  if(m){
    return {
      year:"",
      month:m[1].padStart(2, "0"),
      day:m[2].padStart(2, "0")
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

function flashDateDivider(target){
  if(!target) return;

  target.animate(
    [
      { backgroundColor:"#fff3a3", boxShadow:"0 0 0 0 rgba(255, 218, 74, .85)", transform:"scale(1)" },
      { backgroundColor:"#ffe36f", boxShadow:"0 0 0 8px rgba(255, 218, 74, .22)", transform:"scale(1.04)" },
      { backgroundColor:"#fff3a3", boxShadow:"0 0 0 0 rgba(255, 218, 74, 0)", transform:"scale(1)" },
      { backgroundColor:"", boxShadow:"", transform:"scale(1)" }
    ],
    {
      duration:900,
      iterations:2,
      easing:"ease-in-out"
    }
  );
}

function renderAllMessagesForDateJump(data){
  chat.innerHTML = "";

  const dates = Object.keys(data).sort((a, b) => {
    const diff = dateSortValue(a) - dateSortValue(b);
    return diff || String(a).localeCompare(String(b));
  });

  flatRenderItems = flattenMessagesForRender(
    dates.reduce((obj, date) => {
      obj[date] = data[date];
      return obj;
    }, {})
  );

  renderedItemCount = flatRenderItems.length;
  isAppendingMessages = false;

  dates.forEach(date => {
    addDateDivider(date);

    (data[date] || []).forEach(item => {
      addArtistMessage(item, date);
    });
  });
}

function getNormalizedDateKey(date){
  const normalized = normalizeDateText(date);
  const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(!match) return "";

  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function getDateDividerByKey(dateKey){
  const normalizedKey = getNormalizedDateKey(dateKey);

  if(normalizedKey){
    const byNormalized = document.querySelector(`[data-normalized-date="${CSS.escape(normalizedKey)}"]`);
    if(byNormalized) return byNormalized;
  }

  return document.querySelector(`[data-date="${CSS.escape(dateKey)}"]`);
}

function scrollChatToElement(target, behavior = "auto"){
  if(!target) return;

  const chatRect = chat.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const top = chat.scrollTop + targetRect.top - chatRect.top - 12;

  chat.scrollTo({
    top:Math.max(0, top),
    behavior
  });
}

function waitAndScrollToDate(targetDate, retry = 0){
  const target = getDateDividerByKey(targetDate);

  if(target){
    // 第一次先立即定位，避免太後面的日期因為大量 DOM / 圖片載入造成位置偏掉。
    scrollChatToElement(target, "auto");

    // 再連續校正幾次，等圖片、影片縮圖高度穩定後，位置才會準。
    [80, 220, 480, 900].forEach((delay, index) => {
      setTimeout(() => {
        const freshTarget = getDateDividerByKey(targetDate);
        if(!freshTarget) return;

        scrollChatToElement(freshTarget, index === 3 ? "smooth" : "auto");

        if(index === 3){
          flashDateDivider(freshTarget);
        }
      }, delay);
    });

    return;
  }

  if(retry < 30){
    setTimeout(() => waitAndScrollToDate(targetDate, retry + 1), 100);
  }
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

  // 日期可能還沒被分批渲染出來，所以點日曆跳轉時先完整渲染一次。
  renderAllMessagesForDateJump(allMessages);

  requestAnimationFrame(() => {
    waitAndScrollToDate(targetDate);
  });

  return true;
}

function searchMessages(keyword){
  const rawKeyword = String(keyword || "").trim();

  if(!rawKeyword){
    renderMessages(allMessages);
    return;
  }

  const parsedDate = parseSearchDate(rawKeyword);

  if(parsedDate){
    const filteredByDate = {};

    Object.keys(allMessages).forEach(date => {
      if(dateKeyMatches(date, parsedDate)){
        filteredByDate[date] = allMessages[date];
      }
    });

    if(Object.keys(filteredByDate).length === 0){
      chat.innerHTML = `<div class="no-result">找不到符合的日期</div>`;
      return;
    }

    renderMessages(filteredByDate);
    return;
  }

  const q = displayText(rawKeyword).toLowerCase();
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

function getMediaPageItemHtml(item, viewerIndex = -1, date = ""){
  const kind = getMediaKind(item);
  const rawUrl = escapeAttr(item.url);
  const thumbUrl = escapeAttr(getThumbUrl(item.url));
  const time = formatTime(item.time);
  const avatarUrl = getProfileImage(getCurrentFriend().id, date, item?.time || "", "./icons/profile.jpg");
  const openAction = viewerIndex >= 0
    ? `openMediaViewerByIndex(${viewerIndex})`
    : `openMediaViewer('${rawUrl}', '${escapeAttr(kind)}', '${escapeAttr(time || "")}')`;

  if(kind === "audio"){
    return `
      <div class="media-card audio-thumb-card"
           data-viewer-index="${viewerIndex}"
           onclick="${openAction}">
        <div class="audio-thumb-avatar" style="background-image:url('${escapeAttr(avatarUrl)}')"></div>

        <div class="audio-thumb-play"></div>
        ${time ? `<span class="media-time">${escapeHtml(time)}</span>` : ""}
      </div>
    `;
  }

  if(kind === "video"){
    const videoThumbUrl = escapeAttr(getVideoThumbUrl(item.url));

    return `
      <div class="media-card"
           data-viewer-index="${viewerIndex}"
           onclick="${openAction}">
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
         data-viewer-index="${viewerIndex}"
         onclick="${openAction}">
      <img src="${thumbUrl}" loading="lazy" decoding="async">
      ${time ? `<span class="media-time">${escapeHtml(time)}</span>` : ""}
    </div>
  `;
}


function buildChatMediaViewerItems(){
  const items = [];

  const dates = Object.keys(allMessages || {}).sort((a, b) => {
    const diff = dateSortValue(a) - dateSortValue(b);
    return diff || String(a).localeCompare(String(b));
  });

  dates.forEach(date => {
    (allMessages[date] || []).forEach(item => {
      if(typeof item === "string" || !item?.url) return;

      const kind = getMediaKind(item);

      // 聊天室直接點開只收照片 / 影片。
      if(kind !== "image" && kind !== "video") return;

      items.push({
        item,
        kind,
        date,
        time: formatTime(item.time)
      });
    });
  });

  return items;
}

function openChatMediaViewer(url, kind, date = "", time = ""){
  currentMediaViewerItems = buildChatMediaViewerItems();

  const index = currentMediaViewerItems.findIndex(entry => {
    return entry?.item?.url === url;
  });

  if(index >= 0){
    currentMediaViewerIndex = index;
  }else{
    // 保底：即使這筆不在 allMessages 清單，也能正常打開。
    currentMediaViewerItems = [{
      item: { url, time },
      kind,
      date,
      time: formatTime(time)
    }];
    currentMediaViewerIndex = 0;
  }

  openMediaViewer(
    url,
    kind,
    formatTime(time)
  );
}

// 聊天室內的圖片 / 影片：單擊直接打開媒體預覽。
// 使用事件委派，分批渲染後新增的訊息也自動有效。
chat.addEventListener("click", e => {
  const media = e.target.closest?.(".chat-media-clickable");
  if(!media) return;

  // 影片控制列被操作時不要攔截，讓播放/音量/全螢幕仍能正常使用。
  if(media.tagName === "VIDEO"){
    const rect = media.getBoundingClientRect();
    const yFromBottom = rect.bottom - e.clientY;

    // 瀏覽器原生控制列大約位於底部 45px。
    if(yFromBottom >= 0 && yFromBottom <= 48){
      return;
    }

    media.pause();
  }

  e.preventDefault();

  openChatMediaViewer(
    media.dataset.mediaUrl || media.currentSrc || media.src,
    media.dataset.mediaKind || (media.tagName === "VIDEO" ? "video" : "image"),
    media.dataset.mediaDate || "",
    media.dataset.mediaTime || ""
  );
});

function normalizeMediaTab(tab){
  return tab === "audio" ? "audio" : "media";
}

function getMediaTabTitle(tab){
  return normalizeMediaTab(tab) === "audio" ? "語音訊息" : "照片、影片";
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
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="goBackFromPage('media')">
          <span class="back-icon">‹</span>
        </button>
        <div class="name" id="mediaPageTitle">照片、影片</div>
        <div class="header-actions placeholder-actions">
          <span class="nav-placeholder"></span>
          <span class="nav-placeholder"></span>
        </div>
      </div>
    </div>

    <div class="media-tabs" id="mediaTabs">
      <button class="media-tab active" type="button" data-media-tab="media">照片、影片</button>
      <button class="media-tab" type="button" data-media-tab="audio">語音訊息</button>
    </div>

    <div class="media-content" id="mediaContent"></div>
  `;

  appendAppLayer(mediaPage);
  return mediaPage;
}

function renderMediaPage(tab = currentMediaTab){
  currentMediaTab = normalizeMediaTab(tab);

  const mediaContent = document.getElementById("mediaContent");
  if(!mediaContent) return;

  const titleEl = document.getElementById("mediaPageTitle");
  if(titleEl) titleEl.textContent = getMediaTabTitle(currentMediaTab);

  document.querySelectorAll(".media-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mediaTab === currentMediaTab);
  });

  const dates = Object.keys(allMessages).sort((a, b) => {
    const diff = dateSortValue(b) - dateSortValue(a);
    return diff || String(b).localeCompare(String(a));
  });

  const allowedKinds = currentMediaTab === "audio" ? ["audio"] : ["image", "video"];
  const gridClass = currentMediaTab === "audio" ? "media-grid media-grid-audio" : "media-grid";

  let html = "";
  currentMediaViewerItems = [];
  currentMediaViewerIndex = -1;

  dates.forEach(date => {
    const items = (allMessages[date] || []).filter(item => {
      if(typeof item === "string") return false;
      if(!item.url) return false;
      const kind = getMediaKind(item);
      return allowedKinds.includes(kind);
    });

    if(!items.length) return;

    const itemHtml = items.map(item => {
      const kind = getMediaKind(item);
      const viewerIndex = currentMediaViewerItems.length;
      currentMediaViewerItems.push({
        item,
        kind,
        date,
        time: formatTime(item.time)
      });

      return getMediaPageItemHtml(item, viewerIndex, date);
    }).join("");

    html += `
      <section class="media-date-section">
        <div class="media-date-title">${escapeHtml(formatDateLabel(date))}</div>
        <div class="${gridClass}">
          ${itemHtml}
        </div>
      </section>
    `;
  });

  const emptyText = currentMediaTab === "audio" ? "目前沒有語音訊息" : "目前沒有照片或影片";
  mediaContent.innerHTML = html || `<div class="media-empty">${emptyText}</div>`;
}

const PAGE_LIST = [
  "main",
  "chat",
  "settings",
  "media",
  "edit-nickname",
  "edit-chat-name",
  "edit-theme-color",
  "edit-theme-image",
  "theme-settings",
  "theme-custom",
  "theme-presets"
];

// 每一頁按「返回」後要去哪裡，之後統一改這裡。
const BACK_TARGETS = {
  chat: "main",
  settings: "chat",
  media: "settings",
  "theme-settings": "settings",
  "theme-custom": "theme-settings",
  "theme-presets": "theme-settings",
  "edit-nickname": "settings",
  "edit-chat-name": "settings",
  "edit-theme-color": "theme-custom",
  "edit-theme-image": "theme-custom"
};

let currentPage = "main";

function isMediaViewerOpen(){
  const viewer = document.getElementById("mediaViewer");
  return !!viewer && viewer.style.display !== "none" && viewer.style.display !== "";
}

function normalizePage(page){
  const value = String(page || "main").replace("#", "").trim();
  return PAGE_LIST.includes(value) ? value : "main";
}

function getCurrentPage(){
  return currentPage || normalizePage(location.hash.replace("#", "") || "main");
}

function writeHistoryPage(page, replace = false, extraState = {}){
  const nextPage = normalizePage(page);
  const method = replace ? "replaceState" : "pushState";
  history[method]({ page: nextPage, ...extraState }, "", "#" + nextPage);
}

function initHistoryPage(page){
  const initialPage = normalizePage(page);
  currentPage = initialPage;

  // 只建立目前頁面的歷史紀錄，不另外塞「保護頁」。
  // 因此手機返回鍵與左上角返回鍵都會真正離開目前頁面。
  writeHistoryPage(initialPage, true, { init: true });
}

function keepInsideCurrentPage(){
  // 保留函式名稱避免舊程式呼叫出錯，但不再額外塞 history。
}

function setPage(page, options = {}){
  const nextPage = normalizePage(page);
  const replace = options.replace === true;

  // 已經在同一頁時只重畫，不再塞一筆重複歷史。
  if(nextPage === currentPage && !replace){
    showPage(nextPage);
    return;
  }

  currentPage = nextPage;

  // 一般進入新頁面使用 pushState：
  // 主頁 → 聊天室 → 設定 → 媒體頁
  // 每一層都會保留，因此返回就是直接移除目前這一層。
  writeHistoryPage(nextPage, replace, { appPage: true });
  showPage(nextPage);
}

function goBackFromPage(){
  // 左上角返回完全等同手機 / 瀏覽器返回。
  history.back();
}

window.addEventListener("popstate", event => {
  // 如果目前開著照片 / 影片 / 語音預覽，
  // 返回時先把這個浮層真正關掉。
  if(isMediaViewerOpen()){
    closeMediaViewer(true);
  }

  const nextPage = normalizePage(
    event.state?.page ||
    location.hash.replace("#", "") ||
    "main"
  );

  currentPage = nextPage;
  showPage(nextPage);
});

function showPage(page){
  const nextPage = normalizePage(page);
  const app = document.querySelector(".app");
  const mainPage = document.getElementById("mainPage");
  const settingsPage = document.getElementById("settingsPage");
  const mediaPage = document.getElementById("mediaPage");
  const settingsEditPage = document.getElementById("settingsEditPage");
  const themeSettingsPage = document.getElementById("themeSettingsPage");
  const themeCustomPage = document.getElementById("themeCustomPage");
  const themePresetPage = document.getElementById("themePresetPage");

  if(app) app.style.display = "none";
  if(mainPage) mainPage.style.display = "none";
  if(settingsPage) settingsPage.style.display = "none";
  if(mediaPage) mediaPage.style.display = "none";
  if(settingsEditPage) settingsEditPage.style.display = "none";
  if(themeSettingsPage) themeSettingsPage.style.display = "none";
  if(themeCustomPage) themeCustomPage.style.display = "none";
  if(themePresetPage) themePresetPage.style.display = "none";


  if(nextPage === "main"){
    renderMainFriendList();
    if(mainPage) mainPage.style.display = "flex";
    return;
  }

  if(nextPage === "settings"){
    renderSettingsItems();
    if(settingsPage) settingsPage.style.display = "flex";
    return;
  }

  if(nextPage === "media"){
    const pageEl = ensureMediaPage();
    pageEl.style.display = "flex";
    renderMediaPage(currentMediaTab);
    return;
  }

  if(nextPage === "theme-settings"){
    const pageEl = ensureThemeSettingsPage();
    pageEl.style.display = "flex";
    renderThemeSettingsPage();
    return;
  }

  if(nextPage === "theme-custom"){
    const pageEl = ensureThemeCustomPage();
    pageEl.style.display = "flex";
    renderThemeCustomPage();
    return;
  }

  if(nextPage === "theme-presets"){
    const pageEl = ensureThemePresetPage();
    pageEl.style.display = "flex";
    renderThemePresetPage();
    return;
  }

  if(nextPage === "edit-nickname" || nextPage === "edit-chat-name" || nextPage === "edit-theme-color" || nextPage === "edit-theme-image"){
    const pageEl = ensureSettingsEditPage();
    pageEl.style.display = "flex";
    renderSettingsEditPage(nextPage);
    return;
  }

  setupMainCalendarButton();
  if(app) app.style.display = "flex";
}

function showMediaPage(tab = "media"){
  currentMediaTab = normalizeMediaTab(tab);
  setPage("media");
}

function showSettingsFromMedia(){
  goBackFromPage("media");
}

function showSettings(){
  setPage("settings");
}

function showChat(){
  setPage("chat");
}

function showMain(){
  setPage("main");
}

function setupMainCalendarButton(){
  const normalHeader = document.getElementById("headerNormal");
  if(!normalHeader) return;

  const headerBar = normalHeader.querySelector(".header-bar") || normalHeader;
  if(headerBar.querySelector(".calendar-btn")) return;

  let leftGroup = headerBar.querySelector(".header-left-actions");

  if(!leftGroup){
    leftGroup = document.createElement("div");
    leftGroup.className = "header-left-actions";

    const firstButton = Array.from(headerBar.children).find(el => {
      return el.matches?.("button.nav-btn, button.back-btn, button");
    });

    if(firstButton){
      headerBar.insertBefore(leftGroup, firstButton);
      leftGroup.appendChild(firstButton);
    }else{
      headerBar.insertBefore(leftGroup, headerBar.firstChild);
    }
  }

  const calendarBtn = document.createElement("button");
  calendarBtn.className = "nav-btn calendar-btn";
  calendarBtn.type = "button";
  calendarBtn.setAttribute("aria-label", "開啟日曆");
  calendarBtn.onclick = openCalendarPage;
  calendarBtn.innerHTML = `<img src="./icons/calendar1.png" alt="日曆">`;

  leftGroup.appendChild(calendarBtn);
}

function getMessageDateSet(){
  const set = new Set();

  Object.keys(allMessages || {}).forEach(date => {
    const normalized = normalizeDateText(date);
    const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if(!match) return;

    const y = match[1];
    const m = match[2].padStart(2, "0");
    const d = match[3].padStart(2, "0");
    set.add(`${y}-${m}-${d}`);
  });

  return set;
}

function getFirstMessageDateKey(){
  const keys = [...getMessageDateSet()].sort();
  return keys[0] || "";
}

function getMessageYears(){
  return [...new Set([...getMessageDateSet()].map(key => key.slice(0, 4)))].sort();
}

function getCalendarBaseDate(){
  const first = getFirstMessageDateKey();
  if(first){
    const [y, m, d] = first.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
}

let calendarPickerYear = 0;
let calendarPickerMonth = 0;

function ensureCalendarPicker(){
  let picker = document.getElementById("calendarPicker");
  if(picker) return picker;

  picker = document.createElement("div");
  picker.id = "calendarPicker";
  picker.className = "calendar-picker";
  picker.innerHTML = `
    <div class="calendar-picker-header">
      <button class="calendar-picker-nav" type="button" data-calendar-action="prev" aria-label="上個月">‹</button>
      <button class="calendar-picker-title" id="calendarPickerTitle" type="button" data-calendar-action="year" aria-label="選擇年份"></button>
      <button class="calendar-picker-nav" type="button" data-calendar-action="next" aria-label="下個月">›</button>
    </div>
    <div class="calendar-picker-year-panel" id="calendarPickerYearPanel"></div>
    <div class="calendar-picker-weekdays">
      <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
    </div>
    <div class="calendar-picker-grid" id="calendarPickerGrid"></div>
  `;

  picker.addEventListener("click", e => {
    const yearBtn = e.target.closest(".calendar-year-btn");
    if(yearBtn){
      e.preventDefault();
      e.stopPropagation();

      calendarPickerYear = Number(yearBtn.dataset.calendarYear);

      const firstDateInYear = [...getMessageDateSet()]
        .filter(d => d.startsWith(String(calendarPickerYear)))
        .sort()[0];

      if(firstDateInYear){
        calendarPickerMonth = Number(firstDateInYear.split("-")[1]) - 1;
      }

      picker.classList.remove("year-open");
      renderCalendarPicker();
      return;
    }

    const nav = e.target.closest("[data-calendar-action]");
    if(nav){
      const action = nav.dataset.calendarAction;

      if(action === "year"){
        picker.classList.toggle("year-open");
        return;
      }

      picker.classList.remove("year-open");

      if(action === "prev"){
        calendarPickerMonth -= 1;
      }else if(action === "next"){
        calendarPickerMonth += 1;
      }

      if(calendarPickerMonth < 0){
        calendarPickerMonth = 11;
        calendarPickerYear -= 1;
      }

      if(calendarPickerMonth > 11){
        calendarPickerMonth = 0;
        calendarPickerYear += 1;
      }

      renderCalendarPicker();
      return;
    }

    const dayBtn = e.target.closest("[data-date-key]");
    if(dayBtn && !dayBtn.disabled){
      const dateKey = dayBtn.dataset.dateKey;
      closeCalendarPicker();
      scrollToDate(dateKey);
    }
  });

  document.addEventListener("click", e => {
    const target = e.target;
    if(!picker.classList.contains("open")) return;
    if(target.closest?.("#calendarPicker")) return;
    if(target.closest?.(".calendar-btn")) return;
    closeCalendarPicker();
  });

  document.addEventListener("keydown", e => {
    if(e.key === "Escape") closeCalendarPicker();
  });

  document.body.appendChild(picker);
  return picker;
}

function renderCalendarPicker(){
  const picker = ensureCalendarPicker();
  const title = picker.querySelector("#calendarPickerTitle");
  const yearPanel = picker.querySelector("#calendarPickerYearPanel");
  const grid = picker.querySelector("#calendarPickerGrid");
  const messageDates = getMessageDateSet();

  const year = calendarPickerYear;
  const month = calendarPickerMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if(title){
    title.textContent = `${year}年${String(month + 1).padStart(2, "0")}月`;
  }

  if(yearPanel){
    const years = getMessageYears().sort((a,b)=>b-a);
    yearPanel.innerHTML = years.map(y => `
      <button class="calendar-year-btn ${Number(y) === year ? "active" : ""}" type="button" data-calendar-year="${y}">${y}</button>
    `).join("");
  }

  let html = "";

  for(let i = 0; i < 42; i++){
    const dayNumber = i - firstDay + 1;
    let y = year;
    let m = month;
    let d = dayNumber;
    let otherMonth = false;

    if(dayNumber <= 0){
      m = month - 1;
      if(m < 0){
        m = 11;
        y -= 1;
      }
      d = prevMonthDays + dayNumber;
      otherMonth = true;
    }else if(dayNumber > daysInMonth){
      m = month + 1;
      if(m > 11){
        m = 0;
        y += 1;
      }
      d = dayNumber - daysInMonth;
      otherMonth = true;
    }

    const dateKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const hasMessage = messageDates.has(dateKey);
    const classes = ["calendar-day"];
    if(otherMonth) classes.push("other-month");
    if(hasMessage) classes.push("has-message");
    if(dateKey === todayKey) classes.push("today");

    html += `
      <button class="${classes.join(" ")}" type="button" data-date-key="${dateKey}" ${hasMessage ? "" : "disabled"}>
        ${d}
      </button>
    `;
  }

  if(grid) grid.innerHTML = html;
}

function positionCalendarPicker(anchor){
  const picker = ensureCalendarPicker();
  const rect = anchor?.getBoundingClientRect?.();
  const appRect = document.querySelector(".app")?.getBoundingClientRect?.();

  const pickerWidth = Math.min(220, window.innerWidth - 20);
  const baseLeft = rect ? rect.left : 16;
  const baseTop = rect ? rect.bottom + 8 : 70;
  const minLeft = appRect ? appRect.left + 10 : 10;
  const maxLeft = appRect ? appRect.right - pickerWidth - 10 : window.innerWidth - pickerWidth - 10;

  let left = Math.max(minLeft, Math.min(baseLeft, maxLeft));
  let top = Math.max(10, baseTop);

  picker.style.left = `${left}px`;
  picker.style.top = `${top}px`;
}

function openCalendarPage(event){
  const picker = ensureCalendarPicker();
  const baseDate = getCalendarBaseDate();

  if(!calendarPickerYear || !Number.isFinite(calendarPickerYear)){
  calendarPickerYear = baseDate.getFullYear();
  calendarPickerMonth = baseDate.getMonth();
}

  picker.classList.remove("year-open");
  renderCalendarPicker();
  positionCalendarPicker(event?.currentTarget || document.querySelector(".calendar-btn"));
  picker.classList.add("open");
}

function closeCalendarPicker(){
  const picker = document.getElementById("calendarPicker");
  if(picker) picker.classList.remove("open");
}


function ensureMediaViewer(){
  let viewer = document.getElementById("mediaViewer");
  if(viewer) return viewer;

  viewer = document.createElement("div");
  viewer.id = "mediaViewer";
  viewer.className = "media-viewer";

  viewer.innerHTML = `
    <div class="media-viewer-header">
      <button class="viewer-btn viewer-back-btn" type="button" onclick="closeMediaViewer()">
        <span class="back-icon">‹</span>
      </button>
      <div class="media-viewer-title" id="mediaViewerTitle"></div>
      <button id="mediaDownloadBtn" class="viewer-download" type="button" onclick="downloadMediaFile(this.dataset.url)" data-url="">下載</button>
    </div>

    <div class="media-viewer-body" id="mediaViewerBody"></div>
  `;

  appendAppLayer(viewer);
  setupMediaViewerSwipe(viewer);
  return viewer;
}

function openMediaViewerByIndex(index){
  const nextIndex = Number(index);
  if(!Number.isInteger(nextIndex)) return;
  if(nextIndex < 0 || nextIndex >= currentMediaViewerItems.length) return;

  const entry = currentMediaViewerItems[nextIndex];
  if(!entry || !entry.item || !entry.item.url) return;

  currentMediaViewerIndex = nextIndex;
  openMediaViewer(entry.item.url, entry.kind, entry.time || formatTime(entry.item.time));
}

function showPrevMediaViewerItem(){
  commitMediaViewerSwipe("prev");
}

function showNextMediaViewerItem(){
  commitMediaViewerSwipe("next");
}

function getMediaViewerContentHtml(url, type, date = ""){
  const avatarUrl = getProfileImage(getCurrentFriend().id, date, "", "./icons/profile.jpg");

  if(type === "audio"){
    return `
      <div class="audio-viewer-page">
        <div class="audio-viewer-center">
          <div class="audio-viewer-avatar" style="background-image:url('${escapeAttr(avatarUrl)}')"></div>
          <div class="audio-viewer-name">${escapeHtml(artistName)}</div>
        </div>

        <div class="audio-viewer-player">
          <audio controls autoplay preload="metadata" src="${escapeAttr(url)}"></audio>
        </div>
      </div>
    `;
  }

  if(type === "image"){
    return `<img class="viewer-media" src="${escapeAttr(url)}">`;
  }

  if(type === "video"){
    return `<video class="viewer-media" controls autoplay preload="metadata" src="${escapeAttr(url)}"></video>`;
  }

  return "";
}

function setMediaViewerContent(url, type){
  const viewerBody = document.getElementById("mediaViewerBody");
  if(!viewerBody) return;
  viewerBody.innerHTML = getMediaViewerContentHtml(url, type);
  viewerBody.style.transform = "translateX(0)";
  viewerBody.style.transition = "";
}

function slideMediaViewerToIndex(nextIndex, direction){
  if(mediaViewerAnimating) return;
  if(nextIndex < 0 || nextIndex >= currentMediaViewerItems.length) return;

  const viewerBody = document.getElementById("mediaViewerBody");
  if(!viewerBody) return;

  const entry = currentMediaViewerItems[nextIndex];
  if(!entry || !entry.item || !entry.item.url) return;

  mediaViewerAnimating = true;

  const outX = direction === "next" ? "-100%" : "100%";
  const inX = direction === "next" ? "100%" : "-100%";

  viewerBody.style.transition = "transform 220ms ease";
  viewerBody.style.transform = `translateX(${outX})`;

  setTimeout(() => {
    currentMediaViewerIndex = nextIndex;

    const viewer = document.getElementById("mediaViewer");
    const downloadBtn = document.getElementById("mediaDownloadBtn");

    if(viewer){
      viewer.dataset.type = entry.kind;
      viewer.dataset.index = String(currentMediaViewerIndex);
      viewer.classList.toggle("audio-viewer-mode", entry.kind === "audio");
    }

    if(downloadBtn){
      downloadBtn.dataset.url = entry.item.url;
      downloadBtn.style.display = entry.kind === "audio" ? "none" : "block";
    }

    viewerBody.style.transition = "none";
    viewerBody.style.transform = `translateX(${inX})`;
    viewerBody.innerHTML = getMediaViewerContentHtml(entry.item.url, entry.kind, entry.date);

    requestAnimationFrame(() => {
      viewerBody.style.transition = "transform 220ms ease";
      viewerBody.style.transform = "translateX(0)";
    });

    setTimeout(() => {
      viewerBody.style.transition = "";
      viewerBody.style.transform = "";
      mediaViewerAnimating = false;
    }, 240);
  }, 220);
}

function getMediaViewerEntry(index){
  if(!currentMediaViewerItems.length) return null;
  const total = currentMediaViewerItems.length;
  const safeIndex = (index + total) % total;
  return currentMediaViewerItems[safeIndex] || null;
}

function getMediaViewerContentHtmlByEntry(entry, active = false){
  if(!entry || !entry.item || !entry.item.url) return "";

  const url = entry.item.url;
  const type = entry.kind;
  const autoplay = active ? "autoplay" : "";
  const avatarUrl = getProfileImage(getCurrentFriend().id, entry.date || "", entry.item?.time || "", "./icons/profile.jpg");

  if(type === "audio"){
    return `
      <div class="audio-viewer-page">
        <div class="audio-viewer-center">
          <div class="audio-viewer-avatar" style="background-image:url('${escapeAttr(avatarUrl)}')"></div>
          <div class="audio-viewer-name">${escapeHtml(artistName)}</div>
        </div>

        <div class="audio-viewer-player">
          <audio controls ${autoplay} preload="metadata" src="${escapeAttr(url)}"></audio>
        </div>
      </div>
    `;
  }

  if(type === "image"){
    return `<img class="viewer-media" src="${escapeAttr(url)}">`;
  }

  if(type === "video"){
    return `<video class="viewer-media" controls ${autoplay} preload="metadata" src="${escapeAttr(url)}"></video>`;
  }

  return "";
}

function updateMediaViewerHeaderByEntry(entry){
  const viewer = document.getElementById("mediaViewer");
  const downloadBtn = document.getElementById("mediaDownloadBtn");

  if(!entry || !entry.item) return;

  if(viewer){
    viewer.dataset.type = entry.kind;
    viewer.dataset.index = String(currentMediaViewerIndex);
    viewer.classList.toggle("audio-viewer-mode", entry.kind === "audio");
  }

  if(downloadBtn){
    downloadBtn.dataset.url = entry.item.url;
    downloadBtn.style.display = entry.kind === "audio" ? "none" : "block";
  }
}

function renderMediaViewerTrack(){
  const viewerBody = document.getElementById("mediaViewerBody");
  if(!viewerBody) return;

  const prevEntry = getMediaViewerEntry(currentMediaViewerIndex - 1);
  const currentEntry = getMediaViewerEntry(currentMediaViewerIndex);
  const nextEntry = getMediaViewerEntry(currentMediaViewerIndex + 1);

  updateMediaViewerHeaderByEntry(currentEntry);

  viewerBody.innerHTML = `
  <div class="media-viewer-track" id="mediaViewerTrack">
    <div class="media-viewer-slide">
      ${getMediaViewerContentHtmlByEntry(prevEntry, false)}
    </div>
    <div class="media-viewer-slide">
      ${getMediaViewerContentHtmlByEntry(currentEntry, true)}
    </div>
    <div class="media-viewer-slide">
      ${getMediaViewerContentHtmlByEntry(nextEntry, false)}
    </div>
  </div>
`;

  const track = document.getElementById("mediaViewerTrack");
  if(track){
    track.style.transition = "none";
    track.style.transform = "translateX(-100%)";
  }
}

function moveMediaViewerTrack(dx){
  const track = document.getElementById("mediaViewerTrack");
  if(!track) return;
  track.style.transition = "none";
  track.style.transform = `translateX(calc(-100% + ${dx}px))`;
}

function resetMediaViewerTrack(){
  const track = document.getElementById("mediaViewerTrack");
  if(!track) return;

  track.style.transition = "transform 180ms ease";
  track.style.transform = "translateX(-100%)";

  setTimeout(() => {
    track.style.transition = "";
  }, 190);
}

function commitMediaViewerSwipe(direction){
  if(mediaViewerAnimating) return;
  if(currentMediaViewerItems.length <= 1) return;

  const track = document.getElementById("mediaViewerTrack");
  if(!track) return;

  mediaViewerAnimating = true;

  // 往左滑：看下一張，track 往左到 -200%
  // 往右滑：看上一張，track 往右到 0%
  const targetTransform = direction === "next"
    ? "translateX(-200%)"
    : "translateX(0)";

  track.style.transition = "transform 220ms ease";
  track.style.transform = targetTransform;

  setTimeout(() => {
    if(direction === "next"){
      currentMediaViewerIndex = (currentMediaViewerIndex + 1) % currentMediaViewerItems.length;
    }else{
      currentMediaViewerIndex =
        (currentMediaViewerIndex - 1 + currentMediaViewerItems.length) % currentMediaViewerItems.length;
    }

    renderMediaViewerTrack();
    mediaViewerAnimating = false;
  }, 230);
}

function setupMediaViewerSwipe(viewer){
  if(!viewer || mediaViewerSwipeBound) return;
  mediaViewerSwipeBound = true;

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let tracking = false;
  let pointerId = null;
  let moved = false;


  viewer.style.touchAction = "pan-y";

  viewer.addEventListener("pointerdown", e => {
    if(!isMediaViewerOpen()) return;
    if(mediaViewerAnimating) return;
    if(e.pointerType === "mouse" && e.button !== 0) return;
    if(e.target.closest?.("button")) return;

    tracking = true;
    moved = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();

    try {
      viewer.setPointerCapture(pointerId);
    } catch (err) {}
  }, true);

  viewer.addEventListener("pointermove", e => {
    if(!tracking) return;
    if(pointerId !== null && e.pointerId !== pointerId) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if(Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)){
      moved = true;
      e.preventDefault();
      e.stopPropagation();

      // 這裡會讓前一張 / 後一張跟著露出來
      moveMediaViewerTrack(dx);
    }
  }, true);

  viewer.addEventListener("pointerup", e => {
    if(!tracking) return;
    if(pointerId !== null && e.pointerId !== pointerId) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const elapsed = Date.now() - startTime;

    tracking = false;
    pointerId = null;

    const horizontalEnough = Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.25;
    const quickSwipe = elapsed <= 900;

    if(horizontalEnough && quickSwipe){
      e.preventDefault();
      e.stopPropagation();

      if(dx < 0){
        commitMediaViewerSwipe("next");
      }else{
        commitMediaViewerSwipe("prev");
      }
      return;
    }

    if(moved){
      resetMediaViewerTrack();
    }
  }, true);

  viewer.addEventListener("pointercancel", () => {
    tracking = false;
    pointerId = null;
    resetMediaViewerTrack();
  }, true);

  document.addEventListener("keydown", e => {
    if(!isMediaViewerOpen()) return;

    if(e.key === "ArrowLeft"){
      e.preventDefault();
      commitMediaViewerSwipe("prev");
    }

    if(e.key === "ArrowRight"){
      e.preventDefault();
      commitMediaViewerSwipe("next");
    }
  });
}

function openMediaViewer(url, type, time = ""){
  const matchedIndex = currentMediaViewerItems.findIndex(entry => {
    return entry && entry.item && entry.item.url === url && entry.kind === type;
  });
  if(matchedIndex >= 0){
    currentMediaViewerIndex = matchedIndex;
  }

  const viewerAlreadyOpen = isMediaViewerOpen();
  const viewer = ensureMediaViewer();
  const viewerBody = document.getElementById("mediaViewerBody");
  const titleEl = document.getElementById("mediaViewerTitle");
  const downloadBtn = document.getElementById("mediaDownloadBtn");

  if(!viewerAlreadyOpen){
    // 圖片 / 影片 / 語音預覽是浮層，不是一般頁面；
    // 這裡補一筆同頁歷史，手機返回鍵才會先關閉預覽，不會直接離開。
    writeHistoryPage(getCurrentPage(), false, { viewer: true });
  }

  viewer.dataset.type = type;
  viewer.dataset.index = String(currentMediaViewerIndex);
  viewer.style.display = "flex";
  viewer.classList.toggle("audio-viewer-mode", type === "audio");

  if(downloadBtn){
    downloadBtn.dataset.url = url;
    downloadBtn.style.display = type === "audio" ? "none" : "block";
  }

  if(titleEl){
    titleEl.textContent = type === "audio" ? "" : "";
  }

  renderMediaViewerTrack();
}

function downloadMediaFile(url){
  if(!url) return;
  fetch(url)
    .then(res => {
      if(!res.ok) throw new Error("下載失敗");
      return res.blob();
    })
    .then(blob => {
      const ext = (url.split("?")[0].match(/\.([a-zA-Z0-9]+)$/) || [])[1] || "";
      const filename = "download" + (ext ? "." + ext : "");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    })
    .catch(err => {
      console.error(err);
      alert("下載失敗，請稍後再試。");
    });
}
function closeMediaViewer(fromPopstate = false){
  // 使用者點預覽頁左上角返回時，不自己指定要顯示哪頁，
  // 直接做和手機返回鍵完全相同的 history.back()。
  if(!fromPopstate){
    history.back();
    return;
  }

  const viewer = document.getElementById("mediaViewer");
  const body = document.getElementById("mediaViewerBody");

  if(body) body.innerHTML = "";

  if(viewer){
    viewer.style.display = "none";
    viewer.classList.remove("audio-viewer-mode");
    delete viewer.dataset.type;
    delete viewer.dataset.index;
  }

  currentMediaViewerIndex = -1;
}




function ensureThemeSettingsPage(){
  let page = document.getElementById("themeSettingsPage");
  if(page) return page;

  page = document.createElement("div");
  page.id = "themeSettingsPage";
  page.className = "settings-page theme-settings-page";
  page.innerHTML = `
    <div class="header settings-header">
      <div class="header-bar">
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="goBackFromPage()">
          <span class="back-icon">‹</span>
        </button>
        <div class="name">聊天室主題</div>
        <div class="header-actions placeholder-actions">
          <span class="nav-placeholder"></span>
          <span class="nav-placeholder"></span>
        </div>
      </div>
    </div>

    <div class="settings-content theme-settings-content" id="themeSettingsContent"></div>
  `;

  appendAppLayer(page);
  return page;
}

function ensureThemeCustomPage(){
  let page = document.getElementById("themeCustomPage");
  if(page) return page;

  page = document.createElement("div");
  page.id = "themeCustomPage";
  page.className = "settings-page theme-settings-page";
  page.innerHTML = `
    <div class="header settings-header">
      <div class="header-bar">
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="goBackFromPage()">
          <span class="back-icon">‹</span>
        </button>
        <div class="name">自訂背景</div>
        <div class="header-actions placeholder-actions">
          <span class="nav-placeholder"></span>
          <span class="nav-placeholder"></span>
        </div>
      </div>
    </div>

    <div class="settings-content theme-settings-content" id="themeCustomContent"></div>
  `;

  appendAppLayer(page);
  return page;
}

function ensureThemePresetPage(){
  let page = document.getElementById("themePresetPage");
  if(page) return page;

  page = document.createElement("div");
  page.id = "themePresetPage";
  page.className = "settings-page theme-settings-page";
  page.innerHTML = `
    <div class="header settings-header">
      <div class="header-bar">
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="goBackFromPage()">
          <span class="back-icon">‹</span>
        </button>
        <div class="name">預設主題</div>
        <div class="header-actions placeholder-actions">
          <span class="nav-placeholder"></span>
          <span class="nav-placeholder"></span>
        </div>
      </div>
    </div>

    <div class="settings-content theme-settings-content" id="themePresetContent"></div>
  `;

  appendAppLayer(page);
  return page;
}

function getThemeName(){
  if(themeMode === "custom") return "自訂背景";
  const preset = THEME_PRESETS[themePreset] || THEME_PRESETS.black;
  return `主題 ${preset.label}`;
}

function renderThemeSettingsPage(){
  const content = document.getElementById("themeSettingsContent");
  if(!content) return;

  const presetKeys = ["pink", "blue", "purple", "black"];

  const presetHtml = presetKeys.map(key => {
    const preset = THEME_PRESETS[key];
    const active = themeMode === "preset" && themePreset === key;

    return `
      <div class="theme-card-item ${active ? "active" : ""}" role="button" tabindex="0" data-theme-preset="${escapeAttr(key)}">
        <div class="theme-card-swatch" style="background:${escapeAttr(preset.base)}"></div>

        <div class="theme-card-main">
          <div class="theme-card-title">主題 ${escapeHtml(preset.label)}</div>
          <div class="theme-card-sub">${active ? "目前使用中" : "套用這個主題"}</div>
        </div>

        <div class="theme-card-badge">${active ? "使用中" : "套用"}</div>
      </div>
    `;
  }).join("");

  content.innerHTML = `
    <input id="chatBgFileInput" type="file" accept="image/*" style="display:none">

    <div class="theme-card-item ${chatBgImage ? "active" : ""}" role="button" tabindex="0">
      <div class="theme-card-swatch image-swatch"></div>

      <div class="theme-card-main">
        <div class="theme-card-title">自訂背景</div>
        <div class="theme-card-sub">${chatBgImage ? "已設定照片" : "選擇照片作為聊天背景"}</div>
      </div>

      <div class="theme-card-actions">
        ${chatBgImage ? `<button class="theme-card-badge" type="button" data-action="delete-bg-image">清除</button>` : ""}
        <button class="theme-card-badge" type="button" data-action="choose-bg-image">設定</button>
      </div>
    </div>

    ${presetHtml}
  `;

  const fileInput = document.getElementById("chatBgFileInput");
  if(fileInput){
    fileInput.onchange = setCustomBgImageFromFile;
  }
}

function chooseChatBgImage(){
  const input = document.getElementById("chatBgFileInput");
  if(input) input.click();
}

function openBgDB(){
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("frommBgDB", 1);

    request.onupgradeneeded = e => {
      e.target.result.createObjectStore("bg");
    };

    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
}

async function saveBgImage(dataUrl){
  const db = await openBgDB();
  const tx = db.transaction("bg", "readwrite");
  tx.objectStore("bg").put(dataUrl, "chatBgImage");
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = e => reject(e.target.error);
  });
}

async function loadBgImage(){
  const db = await openBgDB();
  const tx = db.transaction("bg", "readonly");
  const req = tx.objectStore("bg").get("chatBgImage");

  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result || "");
    req.onerror = e => reject(e.target.error);
  });
}

async function removeBgImage(){
  const db = await openBgDB();
  const tx = db.transaction("bg", "readwrite");
  tx.objectStore("bg").delete("chatBgImage");
}

function setCustomBgImageFromFile(event){
  const file = event.target.files && event.target.files[0];
  if(!file) return;

  event.target.value = "";

  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  img.onload = async () => {
    URL.revokeObjectURL(objectUrl);

    const maxW = 1080;
    const maxH = 1920;

    let w = img.width;
    let h = img.height;
    const scale = Math.min(maxW / w, maxH / h, 1);

    w = Math.round(w * scale);
    h = Math.round(h * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);

    chatBgObjectUrl = "";
    chatBgImage = dataUrl;

    try {
      await saveBgImage(dataUrl);
      localStorage.removeItem("frommChatBgImage");

      applyThemeColor();
      renderThemeSettingsPage();
      updateSettingsLabels();
      renderMessages(allMessages);
    } catch (err) {
      alert("背景圖片儲存失敗");
      console.error(err);
    }
  };

  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    alert("圖片讀取失敗，請換一張圖片。");
  };

  img.src = objectUrl;
}



async function deleteChatBgImage(){
  try {
    await removeBgImage();
    localStorage.removeItem("frommChatBgImage");
  } catch (err) {
    console.error(err);
  }

  if(chatBgObjectUrl){
    URL.revokeObjectURL(chatBgObjectUrl);
  }

  chatBgObjectUrl = "";
  chatBgImage = "";
  applyThemeColor();
  renderThemeSettingsPage();
  updateSettingsLabels();
  renderMessages(allMessages);
}

function renderThemeCustomPage(){
  const content = document.getElementById("themeCustomContent");
  if(!content) return;

  content.innerHTML = `
    <div class="setting-item" role="button" tabindex="0" data-action="edit-theme-color">
      <div class="theme-swatch custom" style="background:${escapeAttr(themeColor)}"></div>
      <div class="setting-main">
        <div class="setting-title">背景顏色</div>
        <div class="setting-value">${escapeHtml(themeColor)}</div>
      </div>
      <div class="setting-arrow" aria-hidden="true">›</div>
    </div>

    <div class="setting-item" role="button" tabindex="0" data-action="edit-theme-image">
      <div class="theme-swatch custom image-swatch"></div>
      <div class="setting-main">
        <div class="setting-title">背景圖片</div>
        <div class="setting-value">${chatBgImage ? escapeHtml(chatBgImage) : "未設定"}</div>
      </div>
      <div class="setting-arrow" aria-hidden="true">›</div>
    </div>
  `;
}

function renderThemePresetPage(){
  const content = document.getElementById("themePresetContent");
  if(!content) return;

  const presetKeys = ["pink", "blue", "purple", "black"];

  content.innerHTML = presetKeys.map(key => {
    const preset = THEME_PRESETS[key];
    const active = themeMode === "preset" && themePreset === key;

    return `
      <div class="setting-item theme-preset-item ${active ? "active" : ""}" role="button" tabindex="0" data-theme-preset="${escapeAttr(key)}">
        <div class="theme-swatch" style="background:${escapeAttr(preset.base)}"></div>
        <div class="setting-main">
          <div class="setting-title">${escapeHtml(preset.label)}</div>
          <div class="setting-value">${active ? "使用中" : "套用預設主題"}</div>
        </div>
        <div class="setting-arrow" aria-hidden="true">${active ? "✓" : "›"}</div>
      </div>
    `;
  }).join("");
}

function applyPresetTheme(key){
  if(!THEME_PRESETS[key]) return;

  themeMode = "preset";
  themePreset = key;
  themeColor = THEME_PRESETS[key].base;

  localStorage.setItem("frommThemeMode", themeMode);
  localStorage.setItem("frommThemePreset", themePreset);
  localStorage.setItem("frommThemeColor", themeColor);

  applyThemeColor();
  renderThemeSettingsPage();
  renderThemePresetPage();
  updateSettingsLabels();
  renderMessages(allMessages);
}

function backFromSettingsEdit(){
  goBackFromPage(currentSettingsEditType || getCurrentPage());
}

const SETTINGS_EDIT_CONFIG = {
  "edit-nickname": {
    title:"編輯您的暱稱",
    label:"暱稱",
    max:20,
    get:() => NICKNAME,
    set:value => {
      NICKNAME = value;
      saveNickname(getCurrentFriend().id, NICKNAME);
      renderMessages(allMessages);
    }
  },
  "edit-chat-name": {
    title:"編輯聊天室名稱",
    label:"聊天室名稱",
    max:20,
    get:() => artistName,
    set:value => {
      artistName = value;
      saveChatName(getCurrentFriend().id, artistName);

      // 同步更新主頁好友名稱，返回主頁時立刻看到新名稱。
      renderMainFriendList();
    }
  },
  "edit-theme-color": {
    title:"自訂背景顏色。",
    label:"背景色",
    max:7,
    get:() => themeColor,
    set:value => {
      const color = normalizeHexColor(value);
      if(!color) return false;

      themeMode = "custom";
      themeColor = color;
      localStorage.setItem("frommThemeMode", themeMode);
      localStorage.setItem("frommThemeColor", themeColor);
      applyThemeColor();
      renderMessages(allMessages);
      return true;
    }
  },
  "edit-theme-image": {
    title:"自訂背景圖片。",
    label:"圖片路徑",
    max:200,
    get:() => chatBgImage,
    set: async value => {
      const path = String(value || "").trim();

      chatBgImage = path;

      if(path){
        saveBgImage(chatBgImage);
        localStorage.removeItem("frommChatBgImage");
      }else{
        removeBgImage();
        localStorage.removeItem("frommChatBgImage");
      }

      applyThemeColor();
      renderMessages(allMessages);
      return true;
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
      <button class="nav-btn back-btn" type="button" aria-label="返回上一頁" onclick="backFromSettingsEdit()">
          <span class="back-icon">‹</span>
        </button>
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

  appendAppLayer(page);

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
  const allowEmpty = currentSettingsEditType === "edit-theme-image";

  count.textContent = `${len}/${config.max}`;
  saveBtn.disabled = !hasValue && !allowEmpty;
  saveBtn.classList.toggle("active", hasValue || allowEmpty);
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
  if(!value && currentSettingsEditType !== "edit-theme-image") return;

  const saved = config.set(value);
  if(saved === false) return;

  updateSettingsLabels();

  // 儲存後直接關掉目前編輯頁，回到進入它之前的頁面。
  history.back();
}

const SETTINGS_ITEMS = [
  { title:"照片、影片", value:"", page:"media", tab:"media" },
  { title:"語音訊息", value:"", page:"media", tab:"audio" },
  { title:"我的暱稱", value:() => NICKNAME, action:"edit-nickname" },
  { title:"聊天室名稱", value:() => artistName, action:"edit-chat-name" },
  { title:"聊天室主題", value:getThemeName, page:"theme-settings" },

];

function renderSettingsItems(){
  const settingsContent = document.getElementById("settingsContent");
  if(!settingsContent) return;

  settingsContent.innerHTML = SETTINGS_ITEMS.map(item => {
    const attrs = ["class=\"setting-item\"", "role=\"button\"", "tabindex=\"0\""];
    if(item.page) attrs.push(`data-page="${escapeAttr(item.page)}"`);
    if(item.tab) attrs.push(`data-tab="${escapeAttr(item.tab)}"`);
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

function editThemeColor(){
  setPage("edit-theme-color");
}

function editThemeImage(){
  setPage("edit-theme-image");
}

document.addEventListener("click", e => {
  const mediaTabBtn = e.target.closest("[data-media-tab]");
  if(mediaTabBtn){
    currentMediaTab = normalizeMediaTab(mediaTabBtn.dataset.mediaTab);
    renderMediaPage(currentMediaTab);
    return;
  }

  const mediaItem = e.target.closest('[data-page="media"]');
  if(mediaItem){
    showMediaPage(mediaItem.dataset.tab || "media");
    return;
  }

  const pageItem = e.target.closest("[data-page]");
  if(pageItem){
    const page = pageItem.dataset.page;
    if(page && page !== "media"){
      setPage(page);
      return;
    }
  }

  const presetItem = e.target.closest('[data-theme-preset]');
  if(presetItem){
    applyPresetTheme(presetItem.dataset.themePreset);
    return;
  }

  const actionItem = e.target.closest('[data-action]');
  const action = actionItem?.dataset.action;

  if(action === "choose-bg-image"){
    chooseChatBgImage();
    return;
  }

  if(action === "delete-bg-image"){
  deleteChatBgImage();
  return;
}

  if(action === "edit-nickname"){
    editNickname();
    return;
  }

  if(action === "edit-chat-name"){
    editChatName();
    return;
  }

  if(action === "edit-theme-color"){
    editThemeColor();
    return;
  }

  if(action === "edit-theme-image"){
    editThemeImage();
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

const MESSAGE_FILES = [

];

async function loadAllMessageFiles(files = MESSAGE_FILES){
  const jsonList = await Promise.all(
    files.map(async file => {
      const res = await fetch(file, { cache: "no-store" });
      if(!res.ok) throw new Error(`${file} HTTP ${res.status}`);
      return await res.json();
    })
  );

  const merged = {};

  for(const data of jsonList){
    for(const [date, messages] of Object.entries(data)){
      if(!merged[date]){
        merged[date] = [];
      }

      merged[date].push(...messages);
    }
  }

  return merged;
}

loadAllMessageFiles(getCurrentFriend().messages)
  .then(async messages => {
    allMessages = messages;
    applyCurrentFriendMeta();
    renderMainFriendList();
    try {
      chatBgImage = await loadBgImage();
    } catch (err) {
      console.error(err);
      chatBgImage = "";
    }

    applyThemeColor();
    updateSettingsLabels();
    updateTranslationToggleButton();
    renderMessages(allMessages);

    const initialPage = normalizePage(location.hash.replace("#", "") || "main");
    initHistoryPage(initialPage);
    showPage(initialPage);
    setupMainCalendarButton();

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

  // 防止手機雙指縮放、雙擊放大
(function preventMobileZoom(){
  document.addEventListener("gesturestart", e => e.preventDefault(), { passive:false });
  document.addEventListener("gesturechange", e => e.preventDefault(), { passive:false });
  document.addEventListener("gestureend", e => e.preventDefault(), { passive:false });

  let lastTouchEnd = 0;
  document.addEventListener("touchend", e => {
    const now = Date.now();
    if(now - lastTouchEnd <= 300){
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive:false });
})();
