// main.js
// 主頁、好友清單、頭貼設定
// 請把下面空字串換成 Cloudinary 回傳的完整 https://res.cloudinary.com/... URL。

// 頭貼改成「依日期區間」設定。
// 新增頭貼時，只要再加一筆 { start, end, url }。
// 聊天訊息會依 JSON 的日期自動選對應頭貼；主頁好友清單則顯示最新一筆頭貼。
const PROFILE_IMAGES = {


  sunwoo: [
    {
      start:"2021-01-31",
      end:"2021-02-02",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786684691/1a0827fd2f376f2dc82e1c1388e7a-01_lx6gka.jpg"
    },
    {
      start:"2021-02-03",
      end:"2021-02-05",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786599423/EtMhhb8VcAAXcfP_ytqin2.jpg"
    },
    {
      start:"2021-02-06",
      end:"2021-08-04",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1785313349/210331-3_ny06nv.jpg"
    },
    {
      start:"2021-08-05",
      end:"2021-12-31",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786346137/profile_dtf4gw.jpg"
    },
    {
      start:"2023-02-17",
      end:"2023-05-06",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/230217_xursxc.jpg"
    },
    {
      start:"2023-05-07",
      end:"2023-08-24",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/230507_thntdc.webp"
    },
    {
      start:"2023-08-25",
      end:"2023-09-03",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103229/230825_romcsa.png"
    },
    {
      start:"2023-09-04",
      end:"2023--",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/230904_oiaab4.jpg"
    },
    {
      start:"2024-02-05",
      end:"2024-07-14",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/240205_otihpu.jpg"
    },
    {
      start:"2024-07-15",
      end:"2024-12-20",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103226/240715_lq5hnc.jpg"
    }
  ],

  sunwoo_universe: [
    {
      start:"2021-01-31",
      end:"2021-02-02",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786684691/1a0827fd2f376f2dc82e1c1388e7a-01_lx6gka.jpg"
    },
    {
      start:"2021-02-03",
      end:"2021-02-05",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786599423/EtMhhb8VcAAXcfP_ytqin2.jpg"
    },
    {
      start:"2021-02-06",
      end:"2021-08-04",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1785313349/210331-3_ny06nv.jpg"
    },
    {
      start:"2021-08-05",
      end:"2021-12-31",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1786346137/profile_dtf4gw.jpg"
    },

  ],

  sunwoo_bubble: [
    {
      start:"2023-02-17",
      end:"2023-05-06",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/230217_xursxc.jpg"
    },
    {
      start:"2023-05-07",
      end:"2023-08-24",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/230507_thntdc.webp"
    },
    {
      start:"2023-08-25",
      end:"2023-09-03",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103229/230825_romcsa.png"
    },
    {
      start:"2023-09-04",
      end:"2023--",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/230904_oiaab4.jpg"
    },
    {
      start:"2024-02-05",
      end:"2024-07-14",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103227/240205_otihpu.jpg"
    },
    {
      start:"2024-07-15",
      end:"2024-12-20",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787103226/240715_lq5hnc.jpg"
    }
  ],
  hyunjae_universe:[
    {
      start:"2021-01-29",
      end:"2023-02-15",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787116387/230217_eid4wf.jpg"
    }
  ],
  hyunjae:[
    {
      start:"2023-02-17 16:47",
      end:"2023-08-13 21:20:00",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787116387/230217_eid4wf.jpg"
    },
    {
      start:"2023-08-13 21:20:20",
      end:"2023-09-24 05:53",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787116387/230813_d716o6.jpg"
    },
    {
      start:"2023-09-24 05:54",
      end:"2024-01-04",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787116386/230924_nieht6.jpg"
    },
    {
      start:"2024-01-04",
      end:"2024-07-07 21:51",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787114277/240104_wkrxox.jpg"
    },
    {
      start:"2024-07-07 21:53",
      end:"2024-12-05",
      url:"https://res.cloudinary.com/dhre1enum/image/upload/v1787114277/240707_teuh3w.jpg"
    },
  ]
};

function normalizeProfileDateTime(value, defaultTime = "00:00:00"){
  const raw = String(value || "").trim();

  const match = raw.match(
    /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/
  );

  if(!match) return "";

  const y = match[1];
  const m = match[2].padStart(2, "0");
  const d = match[3].padStart(2, "0");

  let hh = match[4];
  let mm = match[5];
  let ss = match[6];

  if(hh == null || mm == null){
    const t = String(defaultTime || "00:00:00").split(":");
    hh = t[0] || "00";
    mm = t[1] || "00";
    ss = t[2] || "00";
  }

  return `${y}-${m}-${d} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss || "00").padStart(2, "0")}`;
}

function normalizeProfileMessageTime(value){
  const raw = String(value || "").trim();
  if(!raw) return "00:00:00";

  // 24 小時制：21:53 / 21:53:30
  let m = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if(m){
    return `${m[1].padStart(2,"0")}:${m[2]}:${(m[3] || "00").padStart(2,"0")}`;
  }

  // 韓文時間：오전 12:43 / 오후 09:53
  m = raw.match(/^(오전|오후)\s*(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if(m){
    let h = Number(m[2]);

    if(m[1] === "오전"){
      if(h === 12) h = 0;
    }else{
      if(h !== 12) h += 12;
    }

    return `${String(h).padStart(2,"0")}:${m[3]}:${(m[4] || "00").padStart(2,"0")}`;
  }

  return "00:00:00";
}

function getProfileImage(key, date = "", time = "", fallback = "./icons/profile.jpg"){
  const entries = Array.isArray(PROFILE_IMAGES[key]) ? PROFILE_IMAGES[key] : [];

  const validEntries = entries
    .map(item => ({
      // 只有日期時：start 視為當天 00:00:00；end 視為當天 23:59:59
      start: normalizeProfileDateTime(item?.start, "00:00:00") || "0000-01-01 00:00:00",
      end: normalizeProfileDateTime(item?.end, "23:59:59") || "9999-12-31 23:59:59",
      url: String(item?.url || "").trim()
    }))
    .filter(item => item.url)
    .sort((a, b) => a.start.localeCompare(b.start));

  if(!validEntries.length) return fallback;

  const normalizedDate = String(date || "").trim();
  const normalizedTime = normalizeProfileMessageTime(time);

  let normalizedDateTime = "";
  if(normalizedDate){
    normalizedDateTime = normalizeProfileDateTime(
      `${normalizedDate} ${normalizedTime}`,
      "00:00:00"
    );
  }

  if(normalizedDateTime){
    const matched = validEntries
      .filter(item => normalizedDateTime >= item.start && normalizedDateTime <= item.end)
      .at(-1);

    if(matched) return matched.url;

    const previous = [...validEntries]
      .reverse()
      .find(item => item.start <= normalizedDateTime);

    if(previous) return previous.url;
  }

  // 主頁沒有日期 / 時間時，顯示最新一筆頭貼。
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
    id:"sunwoo",
    name:"선우",
    subtitle:"😚",
    likes:"+412",
    messages:["./messages/sw_universe.json","./messages/sw_bubble.json"]
  },
  {
    id:"hyunjae",
    name:"현재",
    subtitle:"",
    likes:"+913",
    messages:["./messages/hj_universe.json","./messages/hj_bubble.json"]
  },
];

/*
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
    messages:["./messages/sw_universe.json"]
  },
  {
    id:"sunwoo_bubble",
    name:"선우",
    subtitle:"😚",
    likes:"+412",
    messages:["./messages/sw_bubble.json"]
  },
  {
    id:"hyunjae_universe",
    name:"현재",
    subtitle:"",
    likes:"+913",
    messages:["./messages/hj_universe.json"]
  },
  {
    id:"hyunjae_bubble",
    name:"현재",
    subtitle:"",
    likes:"+913",
    messages:["./messages/hj_bubble.json"]
  }
*/

function getCurrentFriend(){
  const savedId = localStorage.getItem("frommCurrentFriendId") || FROMM_FRIENDS[0].id;
  return FROMM_FRIENDS.find(friend => friend.id === savedId) || FROMM_FRIENDS[0];
}

function setCurrentFriendId(friendId){
  const friend = FROMM_FRIENDS.find(item => item.id === friendId) || FROMM_FRIENDS[0];
  localStorage.setItem("frommCurrentFriendId", friend.id);
  return friend;
}

// 每個聊天室名稱分開保存，避免切換好友或重新整理後又被預設名稱覆蓋。
function getSavedChatName(friendId, fallback = ""){
  const key = `frommChatName_${friendId}`;
  return localStorage.getItem(key) || fallback;
}

function saveChatName(friendId, name){
  const key = `frommChatName_${friendId}`;
  localStorage.setItem(key, name);
}

// 每個聊天室的「我的暱稱」也分開保存。
function getSavedNickname(friendId, fallback = ""){
  const key = `frommNickname_${friendId}`;
  return localStorage.getItem(key) || fallback;
}

function saveNickname(friendId, nickname){
  const key = `frommNickname_${friendId}`;
  localStorage.setItem(key, nickname);
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
      <div class="main-profile-avatar" style="background-image:url('${mainEscapeAttr(getProfileImage("me", "", "", "./icons/profile.jpg"))}')"></div>
      <div class="main-profile-name">더비</div>
    </div>

    <div class="main-section-title">FRIENDS <span id="mainFriendCount">0</span></div>
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
      <div class="main-friend-avatar" style="background-image:url('${mainEscapeAttr(getProfileImage(friend.id, '', '', './icons/profile.jpg'))}')"></div>
      <div class="main-friend-main">
        <div class="main-friend-name">${mainEscapeHtml(getSavedChatName(friend.id, friend.name))}</div>
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
