// main.js
// 主頁、好友清單、頭貼設定
// 請把下面空字串換成 Cloudinary 回傳的完整 https://res.cloudinary.com/... URL。

// 頭貼改成「依日期區間」設定。
// 新增頭貼時，只要再加一筆 { start, end, url }。
// 聊天訊息會依 JSON 的日期自動選對應頭貼；主頁好友清單則顯示最新一筆頭貼。
const PROFILE_IMAGES = {
  me: [
    {
      start:"0000-01-01",
      end:"9999-12-31",
      url:""
    }
  ],

  sunwoo_test: [
    {
      start:"0000-01-01",
      end:"9999-12-31",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786346137/profile_dtf4gw.jpg"
    }
    // 範例：
    // ,{
    //   start:"2022-01-01",
    //   end:"2022-12-31",
    //   url:"https://res.cloudinary.com/.../新的頭貼.jpg"
    // }
  ],

  sunwoo_universe: [
    {
      start:"2021-01-31",
      end:"2021-02-04",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1785313349/210331-3_ny06nv.jpg"
    },
    {
      start:"2021-02-05",
      end:"2021-08-04",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1785313349/210331-3_ny06nv.jpg"
    },
    {
      start:"2021-08-05",
      end:"2021-08-04",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786346137/profile_dtf4gw.jpg"
    },
  ],

  sunwoo_bubble: [
    {
      start:"0000-01-01",
      end:"9999-12-31",
      url:""
    }
  ]
};

function normalizeProfileDate(value){
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
  if(!match) return "";

  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function getProfileImage(key, date = "", fallback = "./icons/profile.jpg"){
  const entries = Array.isArray(PROFILE_IMAGES[key]) ? PROFILE_IMAGES[key] : [];
  const validEntries = entries
    .map(item => ({
      start: normalizeProfileDate(item?.start) || "0000-01-01",
      end: normalizeProfileDate(item?.end) || "9999-12-31",
      url: String(item?.url || "").trim()
    }))
    .filter(item => item.url)
    .sort((a, b) => a.start.localeCompare(b.start));

  if(!validEntries.length) return fallback;

  const normalizedDate = normalizeProfileDate(date);

  if(normalizedDate){
    const matched = validEntries
      .filter(item => normalizedDate >= item.start && normalizedDate <= item.end)
      .at(-1);

    // 如果有「預設全期間」和較新的特定日期區間重疊，會優先使用開始日期較新的那張。
    if(matched) return matched.url;

    // 日期沒有剛好落在設定區間時，優先沿用該日期之前最近的一張頭貼。
    const previous = [...validEntries]
      .reverse()
      .find(item => item.start <= normalizedDate);

    if(previous) return previous.url;
  }

  // 主頁沒有指定日期時顯示最新一筆頭貼。
  return validEntries[validEntries.length - 1].url || fallback;
}

const FROMM_FRIENDS = [
  {
    id:"sunwoo_test",
    name:"선우",
    subtitle:"😚",
    likes:"+412",
    messages:["./messages/text.json"]
  },
  {
    id:"sunwoo_universe",
    name:"선우",
    subtitle:"😚",
    likes:"+412",
    messages:["./messages/text.json","./messages/sw_universe.json"]
  },
  {
    id:"sunwoo_bubble",
    name:"선우",
    subtitle:"😚",
    likes:"+412",
    messages:["./messages/sw_bubble.json"]
  }
];

function getCurrentFriend(){
  const savedId = localStorage.getItem("frommCurrentFriendId") || FROMM_FRIENDS[0].id;
  return FROMM_FRIENDS.find(friend => friend.id === savedId) || FROMM_FRIENDS[0];
}

function setCurrentFriendId(friendId){
  const friend = FROMM_FRIENDS.find(item => item.id === friendId) || FROMM_FRIENDS[0];
  localStorage.setItem("frommCurrentFriendId", friend.id);
  return friend;
}

function mainEscapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function mainEscapeAttr(str){
  return mainEscapeHtml(str).replaceAll('"', '&quot;');
}

function renderMainLayout(){
  const root = document.getElementById("appRoot") || document.body;

  let mainPage = document.getElementById("mainPage");
  if(mainPage) mainPage.remove();

  mainPage = document.createElement("div");
  mainPage.id = "mainPage";
  mainPage.className = "main-page";
  mainPage.innerHTML = `
    <div class="main-header">
      <div class="main-title">THE BOYZ</div>
      <div class="main-actions">
        <button class="main-icon-btn" type="button" aria-label="新增好友">♙</button>
        <button class="main-icon-btn" type="button" aria-label="設定">◎</button>
      </div>
    </div>

    <div class="main-profile" role="button" tabindex="0" onclick="selectFriend(getCurrentFriend().id)">
      <div class="main-profile-avatar" style="background-image:url('${mainEscapeAttr(getProfileImage("me", "", "./icons/profile.jpg"))}')"></div>
      <div class="main-profile-name">더비</div>
    </div>

    <div class="main-section-title">時期 <span id="mainFriendCount">0</span></div>
    <div class="main-friend-list" id="mainFriendList"></div>

    <div class="main-section-divider"></div>

    <div class="main-bottom-nav">
      <button class="main-bottom-item active" type="button">☆</button>
      <button class="main-bottom-item" type="button">💬</button>
      <button class="main-bottom-item" type="button">▣</button>
      <button class="main-bottom-item" type="button">•••</button>
    </div>
  `;

  root.prepend(mainPage);
}

function appendAppLayer(element){
  const root = document.getElementById("appRoot") || document.body;
  root.appendChild(element);
}

function renderMainFriendList(){
  const list = document.getElementById("mainFriendList");
  const count = document.getElementById("mainFriendCount");
  if(count) count.textContent = String(FROMM_FRIENDS.length);
  if(!list) return;

  list.innerHTML = FROMM_FRIENDS.map(friend => `
    <div class="main-friend-item" role="button" tabindex="0" onclick="selectFriend('${mainEscapeAttr(friend.id)}')">
      <div class="main-friend-avatar" style="background-image:url('${mainEscapeAttr(getProfileImage(friend.id, '', './icons/profile.jpg'))}')"></div>
      <div class="main-friend-main">
        <div class="main-friend-name">${mainEscapeHtml(friend.name)}</div>
        <div class="main-friend-sub">${mainEscapeHtml(friend.subtitle || "")}</div>
      </div>
      <div class="main-heart">❤ ${mainEscapeHtml(friend.likes || "")}</div>
    </div>
  `).join("");
}

function injectMainPageStyle(){
  if(document.getElementById("mainPageStyle")) return;
  const style = document.createElement("style");
  style.id = "mainPageStyle";
  style.textContent = `
    #appRoot{
      width:100%;
      max-width:430px;
      height:100dvh;
      position:relative;
    }

    #appRoot > .settings-page,
    #appRoot > .media-viewer{
      width:100%;
      max-width:430px;
    }
    #appRoot > .media-viewer{
      left:50%;
      right:auto;
      transform:translateX(-50%);
      z-index:99999;
    }
    .main-page{
      width:100%;
      max-width:430px;
      height:100dvh;
      display:flex;
      flex-direction:column;
      overflow:hidden;
      background:#17181c;
      color:#d9dbe0;
      border-left:1px solid #333;
      border-right:1px solid #333;
      font-family:"kr", "cn", system-ui, sans-serif;
      position:relative;
    }
    .main-header{
      flex-shrink:0;
      height:82px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:0 26px;
      background:#17181c;
    }
    .main-title{
      font-size:20px;
      letter-spacing:6px;
      color:#f0f1f4;
      white-space:nowrap;
    }
    .main-actions{
      display:flex;
      align-items:center;
      gap:22px;
    }
    .main-icon-btn{
      all:unset;
      width:42px;
      height:42px;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#d9dbe0;
      font-size:28px;
      cursor:pointer;
    }
    .main-profile{
      flex-shrink:0;
      display:flex;
      align-items:center;
      gap:28px;
      padding:6px 32px 42px;
      cursor:pointer;
    }
    .main-profile-avatar,
    .main-friend-avatar{
      border-radius:50%;
      background-size:cover;
      background-position:center;
      background-repeat:no-repeat;
      flex-shrink:0;
    }
    .main-profile-avatar{
      width:72px;
      height:72px;
    }
    .main-profile-name{
      color:#d9dbe0;
      font-size:20px;
      line-height:1;
    }
    .main-section-title{
      flex-shrink:0;
      padding:0 26px 18px;
      color:#d9dbe0;
      font-size:20px;
      font-weight:700;
    }
    .main-section-title span{
      color:#60636c;
      font-weight:400;
    }
    .main-friend-list{
      flex:1;
      min-height:0;
      overflow-y:auto;
      padding:0 26px 18px;
      -webkit-overflow-scrolling:touch;
      scrollbar-width:none;
    }
    .main-friend-list::-webkit-scrollbar{ display:none; }
    .main-friend-item{
      min-height:88px;
      display:grid;
      grid-template-columns:72px minmax(0, 1fr) auto;
      align-items:center;
      gap:22px;
      cursor:pointer;
    }
    .main-friend-item:active{ opacity:.72; }
    .main-friend-avatar{
      width:66px;
      height:66px;
    }
    .main-friend-name{
      color:#f0f1f4;
      font-size:18px;
      line-height:1.1;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .main-friend-sub{
      margin-top:7px;
      color:#747781;
      font-size:17px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .main-heart{
      color:#ff3f45;
      font-size:18px;
      white-space:nowrap;
    }
    .main-section-divider{
      height:1px;
      margin:0 26px 22px;
      background:rgba(255,255,255,.08);
    }
    .main-bottom-panel{
      flex-shrink:0;
      height:74px;
      display:flex;
      align-items:center;
      padding:0 26px;
      background:#111216;
    }
    .main-interest-title{
      width:100%;
      display:flex;
      justify-content:space-between;
      color:#d9dbe0;
      font-size:18px;
    }
    .main-bottom-nav{
      flex-shrink:0;
      height:64px;
      display:grid;
      grid-template-columns:repeat(5, 1fr);
      background:#262830;
      border-top:1px solid rgba(255,255,255,.06);
    }
    .main-bottom-item{
      all:unset;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#686b76;
      font-size:24px;
      cursor:pointer;
    }
    .main-bottom-item.active{
      color:#f0f1f4;
      font-weight:700;
    }
    @media (max-width:430px){
      #appRoot,
      .main-page{
        max-width:none;
        width:100%;
        border:0;
      }
      .main-header{
        height:calc(82px + env(safe-area-inset-top));
        padding-top:env(safe-area-inset-top);
      }
      .main-bottom-nav{
        height:calc(64px + env(safe-area-inset-bottom));
        padding-bottom:env(safe-area-inset-bottom);
      }
    }
  `;
  document.head.appendChild(style);
}


injectMainPageStyle();
renderMainLayout();
renderMainFriendList();
