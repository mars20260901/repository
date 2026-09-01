const posts = [
  {
    id: 1,
    category: "设计",
    date: "2026.08.28",
    read: "6 MIN",
    title: "当界面不再只是界面",
    excerpt: "空间计算正在改变我们与数字世界建立关系的方式。设计的边界，也许正从屏幕边缘消失。",
    art: "interface",
    lead: "好的界面从不抢夺注意力，它只在正确的时刻出现，然后安静地退场。",
    body: ["过去十年，我们把越来越多的生活压缩进一块发光的矩形。如今，空间计算让像素重新回到真实世界：信息可以拥有距离、方向和重量。", "这并不意味着设计师需要制造更多悬浮窗口。恰恰相反，新的挑战是决定什么不该出现。未来的界面不是更壮观的界面，而是更懂得克制的环境。"],
    subhead: "从控件到环境",
  },
  {
    id: 2,
    category: "城市",
    date: "2026.08.16",
    read: "4 MIN",
    title: "凌晨两点的城市协议",
    excerpt: "当白天的噪声褪去，城市真正的操作系统才开始显现。",
    art: "city",
    lead: "深夜不是城市的暂停键，而是另一套系统的登录界面。",
    body: ["便利店的冷光、清扫车的低频轰鸣、写字楼里最后一排亮着的窗。它们共同组成一张不在旅游手册里的城市地图。", "城市的韧性，往往来自这些不可见的维护者。观察深夜，就是观察一座城市如何照顾它仍然醒着的人。"],
    subhead: "隐形的基础设施",
  },
  {
    id: 3,
    category: "科技",
    date: "2026.08.02",
    read: "8 MIN",
    title: "与 AI 共写之后，我保留了什么",
    excerpt: "效率之外，真正值得讨论的是我们如何重新定义创作中的判断力。",
    art: "ai",
    lead: "工具可以补全句子，但它不能替你决定什么值得说。",
    body: ["AI 降低了表达的摩擦，却没有消除选择的成本。当所有人都能快速生成十个答案，最稀缺的能力反而变成了删除九个答案的勇气。", "我逐渐把 AI 当成一面高带宽的镜子。它负责展开可能性，我负责辨认哪一种可能性真正属于我。"],
    subhead: "判断力才是作者身份",
  },
  {
    id: 4,
    category: "随笔",
    date: "2026.07.21",
    read: "3 MIN",
    title: "给无聊留一个入口",
    excerpt: "持续在线的年代，无聊也许是一种需要被主动保护的创造性资源。",
    art: "quiet",
    lead: "当每一秒都可以被填满，空白就成了一种奢侈品。",
    body: ["我们习惯在电梯门关闭前掏出手机，在红灯亮起时查看通知。那些几秒钟的缝隙本来没有目的，却曾是念头自由游荡的地方。", "我开始练习不立刻填满等待。不是为了变得更高效，而是为了让意识重新拥有未经安排的角落。"],
    subhead: "重新拥有空白",
  },
];

const postsNode = document.querySelector("#posts");
const emptyState = document.querySelector("#emptyState");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const modal = document.querySelector("#articleModal");
const modalContent = document.querySelector("#modalContent");
const searchPanel = document.querySelector("#searchPanel");
const searchInput = document.querySelector("#searchInput");
let activeFilter = "全部";
let searchTerm = "";

function renderPosts() {
  const filtered = posts.filter((post) => {
    const inCategory = activeFilter === "全部" || post.category === activeFilter;
    const haystack = `${post.title}${post.excerpt}${post.category}`.toLowerCase();
    return inCategory && haystack.includes(searchTerm.toLowerCase());
  });

  postsNode.innerHTML = filtered.map((post) => `
    <article class="post reveal is-visible" tabindex="0" data-id="${post.id}" aria-label="阅读文章：${post.title}">
      <div class="post__art art--${post.art}"></div>
      <div class="post__body">
        <div class="post__meta"><span>${post.category.toUpperCase()}</span><span>${post.date} · ${post.read}</span></div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
      </div>
    </article>
  `).join("");
  emptyState.style.display = filtered.length ? "none" : "block";

  document.querySelectorAll(".post").forEach((card) => {
    card.addEventListener("click", () => openArticle(Number(card.dataset.id)));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openArticle(Number(card.dataset.id));
    });
  });
}

function openArticle(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;
  modalContent.innerHTML = `
    <div class="modal-hero post__art art--${post.art}"></div>
    <article class="modal-article">
      <span>${post.category.toUpperCase()} · ${post.date} · ${post.read}</span>
      <h2>${post.title}</h2>
      <p class="lead">${post.lead}</p>
      <p>${post.body[0]}</p>
      <h3>${post.subhead}</h3>
      <p>${post.body[1]}</p>
    </article>`;
  modal.showModal();
  document.body.style.overflow = "hidden";
}

function closeArticle() {
  modal.close();
  document.body.style.overflow = "";
}

function toggleSearch(force) {
  const open = force ?? !searchPanel.classList.contains("is-open");
  searchPanel.classList.toggle("is-open", open);
  searchPanel.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) setTimeout(() => searchInput.focus(), 100);
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  filterButtons.forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  activeFilter = button.dataset.filter;
  renderPosts();
}));

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderPosts();
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    toggleSearch(false);
    document.querySelector("#journal").scrollIntoView();
  }
});
document.querySelector("#searchToggle").addEventListener("click", () => toggleSearch());
document.querySelector("#mobileSearch").addEventListener("click", () => toggleSearch(true));
document.querySelector("#searchClose").addEventListener("click", () => toggleSearch(false));
searchPanel.addEventListener("click", (event) => { if (event.target === searchPanel) toggleSearch(false); });
document.querySelector("#modalClose").addEventListener("click", closeArticle);
modal.addEventListener("click", (event) => { if (event.target === modal) closeArticle(); });

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("nav a[href^='#']")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%" });
sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  document.querySelector("#topbar").classList.toggle("is-hidden", current > lastScroll && current > 180);
  lastScroll = current;
}, { passive: true });

function updateTime() {
  const now = new Date();
  document.querySelector("#clock").textContent = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  document.querySelector("#localTime").textContent = `${now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })} · GMT+08:00`;
}
document.querySelector("#year").textContent = new Date().getFullYear();
updateTime();
setInterval(updateTime, 30000);
renderPosts();
