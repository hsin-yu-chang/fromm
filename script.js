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

    artistBubble:"#f1f1f3",
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
let chatBgImage = localStorage.getItem("frommChatBgImage") || DEFAULT_CHAT_BG_IMAGE;
let allMessages = {};
let currentMediaTab = "media";

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
    chatBgImage:""
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


  const image = String(palette.chatBgImage || "").trim();
  const cssImage = image ? `url("${image.replaceAll('"', '\"')}")` : "none";
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
      <div class="media-card audio-thumb-card"
           onclick="openMediaViewer('${rawUrl}', 'audio', '${escapeAttr(time || "")}')">
        <div class="audio-thumb-avatar"></div>
        <div class="audio-thumb-name">${escapeHtml(artistName)}</div>
        <div class="audio-thumb-play">▶</div>
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
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="showSettingsFromMedia()">‹</button>
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

  dates.forEach(date => {
    const items = (allMessages[date] || []).filter(item => {
      if(typeof item === "string") return false;
      if(!item.url) return false;
      const kind = getMediaKind(item);
      return allowedKinds.includes(kind);
    });

    if(!items.length) return;

    html += `
      <section class="media-date-section">
        <div class="media-date-title">${escapeHtml(formatDateLabel(date))}</div>
        <div class="${gridClass}">
          ${items.map(getMediaPageItemHtml).join("")}
        </div>
      </section>
    `;
  });

  const emptyText = currentMediaTab === "audio" ? "目前沒有語音訊息" : "目前沒有照片或影片";
  mediaContent.innerHTML = html || `<div class="media-empty">${emptyText}</div>`;
}

function normalizePage(page){
  const value = String(page || "chat").replace("#", "").trim();
  return ["chat", "settings", "media", "edit-nickname", "edit-chat-name", "edit-theme-color", "edit-theme-image", "theme-settings", "theme-custom", "theme-presets"].includes(value) ? value : "chat";
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
      <button class="viewer-btn viewer-back-btn" type="button" onclick="closeMediaViewer()">‹</button>
      <div class="media-viewer-title" id="mediaViewerTitle"></div>
      <a id="mediaDownloadBtn" class="viewer-download" href="#" download target="_blank">下載</a>
    </div>

    <div class="media-viewer-body" id="mediaViewerBody"></div>
  `;

  document.body.appendChild(viewer);
  return viewer;
}

function openMediaViewer(url, type, time = ""){
  const viewer = ensureMediaViewer();
  const viewerBody = document.getElementById("mediaViewerBody");
  const titleEl = document.getElementById("mediaViewerTitle");
  const downloadBtn = document.getElementById("mediaDownloadBtn");

  viewer.dataset.type = type;
  viewer.style.display = "flex";
  viewer.classList.toggle("audio-viewer-mode", type === "audio");

  if(downloadBtn){
    downloadBtn.href = url;
    downloadBtn.style.display = type === "audio" ? "none" : "block";
  }

  if(titleEl){
    titleEl.textContent = type === "audio" ? "" : "";
  }

  if(type === "audio"){
    viewerBody.innerHTML = `
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
    return;
  }

  if(type === "image"){
    viewerBody.innerHTML = `
      <img class="viewer-media" src="${escapeAttr(url)}">
    `;
    return;
  }

  if(type === "video"){
    viewerBody.innerHTML = `
      <video class="viewer-media" controls autoplay preload="metadata" src="${escapeAttr(url)}"></video>
    `;
    return;
  }
}
function closeMediaViewer(){
  const viewer = document.getElementById("mediaViewer");
  const body = document.getElementById("mediaViewerBody");

  if(body) body.innerHTML = "";
  if(viewer){
    viewer.style.display = "none";
    viewer.classList.remove("audio-viewer-mode");
    delete viewer.dataset.type;
  }
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
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="showSettings()">‹</button>
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
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室主題" onclick="setPage('theme-settings')">‹</button>
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
        <button class="nav-btn back-btn" type="button" aria-label="返回聊天室主題" onclick="setPage('theme-settings')">‹</button>
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

    <div class="theme-card-item ${themeMode === "custom" ? "active" : ""}" role="button" tabindex="0" data-action="choose-bg-image">
      <div class="theme-card-swatch image-swatch"></div>

      <div class="theme-card-main">
        <div class="theme-card-title">自訂背景</div>
        <div class="theme-card-sub">${chatBgImage ? "已設定照片" : "選擇照片作為聊天背景"}</div>
      </div>

      <div class="theme-card-badge">${themeMode === "custom" ? "使用中" : "選擇"}</div>
    </div>

    ${presetHtml}
  `;

  const fileInput = document.getElementById("chatBgFileInput");
  if(fileInput){
    fileInput.addEventListener("change", setCustomBgImageFromFile);
  }
}

function chooseChatBgImage(){
  const input = document.getElementById("chatBgFileInput");
  if(input) input.click();
}

function setCustomBgImageFromFile(event){
  const file = event.target.files && event.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    const dataUrl = e.target.result;

    themeMode = "custom";
    chatBgImage = dataUrl;

    localStorage.setItem("frommThemeMode", themeMode);
    localStorage.setItem("frommChatBgImage", chatBgImage);

    applyThemeColor();
    renderThemeSettingsPage();
    updateSettingsLabels();
    renderMessages(allMessages);
  };

  reader.readAsDataURL(file);
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
  chatBgImage = "";

  localStorage.setItem("frommThemeMode", themeMode);
  localStorage.setItem("frommThemePreset", themePreset);
  localStorage.setItem("frommThemeColor", themeColor);
  localStorage.removeItem("frommChatBgImage");

  applyThemeColor();
  renderThemeSettingsPage();
  renderThemePresetPage();
  updateSettingsLabels();
  renderMessages(allMessages);
}

function backFromSettingsEdit(){
  if(currentSettingsEditType === "edit-theme-color" || currentSettingsEditType === "edit-theme-image"){
    setPage("theme-custom");
    return;
  }
  showSettings();
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
    set:value => {
      const path = String(value || "").trim();

      themeMode = "custom";
      chatBgImage = path;
      localStorage.setItem("frommThemeMode", themeMode);

      if(path){
        localStorage.setItem("frommChatBgImage", chatBgImage);
      }else{
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
      <button class="nav-btn back-btn" type="button" aria-label="返回聊天室設定" onclick="backFromSettingsEdit()">‹</button>
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

window.addEventListener("hashchange", () => {
  showPage(location.hash.replace("#", "") || "chat");
});

const MESSAGE_FILES = [
  "./messages.json",
  "./fromm_messages.json",
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
  .then(messages => {
    allMessages = messages;
    applyThemeColor();
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
