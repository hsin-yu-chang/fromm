const chat = document.getElementById("chat");
const DEFAULT_ARTIST_NAME = "선우";
const DEFAULT_NICKNAME = "더비";
let artistName = localStorage.getItem("frommChatName") || DEFAULT_ARTIST_NAME;
let NICKNAME = localStorage.getItem("frommNickname") || DEFAULT_NICKNAME;
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
  const mediaOnly = mediaHtml && ["image", "video", "emoticon", "audio"].includes(mediaKind);

  const quoteHtml = quote
    ? `
      <div class="reply-wrap">
        <div class="reply-line"></div>
        <div class="quote-box">
          <div>${escapeHtml(quote)}</div>
          ${quoteTrans ? `
            <div class="bubble-divider"></div>
            <div>${escapeHtml(quoteTrans)}</div>
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

  Object.keys(data).forEach(date => {
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
      addArtistMessage(entry.item);
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

function getMediaPageItemHtml(item, viewerIndex = -1){
  const kind = getMediaKind(item);
  const rawUrl = escapeAttr(item.url);
  const thumbUrl = escapeAttr(getThumbUrl(item.url));
  const time = formatTime(item.time);
  const openAction = viewerIndex >= 0
    ? `openMediaViewerByIndex(${viewerIndex})`
    : `openMediaViewer('${rawUrl}', '${escapeAttr(kind)}', '${escapeAttr(time || "")}')`;

  if(kind === "audio"){
    return `
      <div class="media-card audio-thumb-card"
           data-viewer-index="${viewerIndex}"
           onclick="${openAction}">
        <div class="audio-thumb-avatar"></div>

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

  document.body.appendChild(mediaPage);
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

      return getMediaPageItemHtml(item, viewerIndex);
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

let currentPage = "chat";

function isMediaViewerOpen(){
  const viewer = document.getElementById("mediaViewer");
  return !!viewer && viewer.style.display !== "none" && viewer.style.display !== "";
}

function normalizePage(page){
  const value = String(page || "chat").replace("#", "").trim();
  return PAGE_LIST.includes(value) ? value : "chat";
}

function getCurrentPage(){
  return currentPage || normalizePage(location.hash.replace("#", "") || "chat");
}

function writeHistoryPage(page, replace = false, extraState = {}){
  const nextPage = normalizePage(page);
  const method = replace ? "replaceState" : "pushState";
  history[method]({ page: nextPage, ...extraState }, "", "#" + nextPage);
}

function initHistoryPage(page){
  const initialPage = normalizePage(page);
  currentPage = initialPage;

  // 手機返回鍵如果剛好在第一筆歷史紀錄，瀏覽器會直接離開 PWA / 網頁，
  // 所以啟動時先補一筆同頁面的保護紀錄，讓第一次返回一定會被 popstate 接住。
  writeHistoryPage(initialPage, true, { init: true });
  writeHistoryPage(initialPage, false, { guard: true });
}

function keepInsideCurrentPage(){
  const page = getCurrentPage();
  writeHistoryPage(page, false, { guard: true });
}

function setPage(page, options = {}){
  const nextPage = normalizePage(page);
  currentPage = nextPage;

  // APP 內部換頁一律用 replace，不再 push 新歷史紀錄。
  // 這樣左上角返回後，手機返回鍵不會把剛剛經過的頁面又倒放一次。
  writeHistoryPage(nextPage, true, { appPage: true });
  showPage(nextPage);
}

function goBackFromPage(page = getCurrentPage()){
  if(isMediaViewerOpen()){
    closeMediaViewer();
    keepInsideCurrentPage();
    return;
  }

  const fromPage = normalizePage(page);
  const targetPage = BACK_TARGETS[fromPage] || "chat";

  // 返回是「回到指定頁」，不要再新增一堆瀏覽器歷史，避免手機返回鍵亂跳。
  setPage(targetPage, { replace: true });
}

window.addEventListener("popstate", () => {
  // 手機實體返回鍵 / 瀏覽器返回鍵：
  // 先補回目前頁面的保護紀錄，避免某些情況直接跳出 PWA / 網頁。
  // 接著執行跟左上角返回按鈕一樣的邏輯。
  const fromPage = getCurrentPage();
  keepInsideCurrentPage();

  if(isMediaViewerOpen()){
    closeMediaViewer();
    showPage(fromPage);
    return;
  }

  if(fromPage === "chat"){
    showPage("chat");
    return;
  }

  goBackFromPage(fromPage);
});

function showPage(page){
  const nextPage = normalizePage(page);
  const app = document.querySelector(".app");
  const settingsPage = document.getElementById("settingsPage");
  const mediaPage = document.getElementById("mediaPage");
  const settingsEditPage = document.getElementById("settingsEditPage");
  const themeSettingsPage = document.getElementById("themeSettingsPage");
  const themeCustomPage = document.getElementById("themeCustomPage");
  const themePresetPage = document.getElementById("themePresetPage");

  if(app) app.style.display = "none";
  if(settingsPage) settingsPage.style.display = "none";
  if(mediaPage) mediaPage.style.display = "none";
  if(settingsEditPage) settingsEditPage.style.display = "none";
  if(themeSettingsPage) themeSettingsPage.style.display = "none";
  if(themeCustomPage) themeCustomPage.style.display = "none";
  if(themePresetPage) themePresetPage.style.display = "none";

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

  document.body.appendChild(viewer);
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

function getMediaViewerContentHtml(url, type){
  if(type === "audio"){
    return `
      <div class="audio-viewer-page">
        <div class="audio-viewer-center">
          <div class="audio-viewer-avatar"></div>
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
    viewerBody.innerHTML = getMediaViewerContentHtml(entry.item.url, entry.kind);

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

  if(type === "audio"){
    return `
      <div class="audio-viewer-page">
        <div class="audio-viewer-center">
          <div class="audio-viewer-avatar"></div>
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
function closeMediaViewer(){
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

  document.body.appendChild(page);
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

  document.body.appendChild(page);
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

  document.body.appendChild(page);
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
      localStorage.setItem("frommNickname", NICKNAME);
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
      localStorage.setItem("frommChatName", artistName);
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
  if(currentSettingsEditType === "edit-theme-color" || currentSettingsEditType === "edit-theme-image"){
    setPage("theme-custom");
    return;
  }
  setPage("settings");
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
  "./messages/messages.json",
  "./messages/fromm_messages.json",
];

async function loadAllMessageFiles(){
  const jsonList = await Promise.all(
    MESSAGE_FILES.map(async file => {
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

loadAllMessageFiles()
  .then(async messages => {
    allMessages = messages;
    try {
      chatBgImage = await loadBgImage();
    } catch (err) {
      console.error(err);
      chatBgImage = "";
    }

    applyThemeColor();
    updateSettingsLabels();
    renderMessages(allMessages);

    const initialPage = normalizePage(location.hash.replace("#", "") || "chat");
    initHistoryPage(initialPage);
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