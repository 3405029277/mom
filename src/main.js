import "./styles.css";
import { createAudioController } from "./audio.js";
import { createParticleIntro } from "./particles.js";
import { createSlideController } from "./slides.js";
import { createMemoryScene } from "./scene3d.js";

const slides = [
  {
    label: "Prologue",
    title: "亲爱的\n妈妈",
    poem: "萱草生堂阶，游子行天涯。",
    text: "今天想把这一路的成长，慢慢讲给你听。不是只说一句节日快乐，而是认真告诉你：我一直记得，你怎样把爱藏进每一个普通的日子里。",
    visual: "hero",
    sign: "爱你的儿子"
  },
  {
    label: "Chapter 01 · 小时候",
    title: "故事的开头，是你牵着我。",
    quote: "慈母手中线，游子身上衣。",
    text: "小时候，我以为长大是一件很快的事。你帮我整理衣服，提醒我吃饭，送我出门，又等我回来。那时我不懂，这些反复的日常，原来就是一个人最深的爱。",
    visual: "flower"
  },
  {
    label: "Chapter 02 · 记忆",
    title: "我记得你的样子，也记得你的操心。",
    quote: "谁言寸草心，报得三春晖。",
    text: "照片里的你，总是把笑留给别人，把辛苦放在自己心里。以前我只觉得妈妈很厉害，后来才明白，厉害的背后，是你把很多疲惫都悄悄扛了下来。",
    visual: "wall"
  },
  {
    label: "Chapter 03 · 上学",
    title: "我走向世界，你把牵挂放进口袋。",
    quote: "临行密密缝，意恐迟迟归。",
    text: "每一次上学、出门、远行，你都像没什么大事一样叮嘱我。可我知道，你的担心藏在一句句“路上小心”里，也藏在我回头时，你还站在原地的目光里。",
    visual: "flower"
  },
  {
    label: "Chapter 04 · 长大",
    title: "我慢慢长大，也慢慢更懂你。",
    text: "从前我总想着快点长大，后来真的长大了，才发现最想留住的，是你做饭时的背影，是你问我累不累的声音，是回到家就能看到你的安心。",
    visual: "hero"
  },
  {
    label: "Chapter 05 · 离家",
    title: "离家越远，越知道家有多近。",
    quote: "见面怜清瘦，呼儿问苦辛。",
    text: "有时候我在外面装得很坚强，可只要听见你的声音，就会觉得自己还是那个可以被惦记的孩子。妈妈，谢谢你一直给我一个可以回头的地方。",
    visual: "flower"
  },
  {
    label: "Chapter 06 · 懂得",
    title: "以前你照顾我，以后我也想照顾你。",
    text: "我知道一句谢谢太轻，一束花也不够表达全部。但我还是想认真说：你为我做过的每一件小事，我都记在心里。往后的日子，换我多陪你，多听你说话，多让你放心。",
    visual: "space"
  },
  {
    label: "Chapter 07 · 祝愿",
    title: "愿岁月把温柔，多留给你一些。",
    quote: "凯风自南，吹彼棘心。",
    text: "愿你每天都有好心情，有喜欢的花，有舒服的午后，有想见的人。愿你少操心，多开心；少疲惫，多自在；也愿我能成为你心里越来越踏实的依靠。",
    visual: "flower"
  },
  {
    label: "Chapter 08 · 高潮",
    title: "如果音乐走到最热烈的地方，我想你听见这一句。",
    text: "妈妈，我爱你。不是只在母亲节才想起，也不是只在今天才郑重。是每一次想家、每一次努力、每一次想变得更好时，我都知道：我的身后，一直有你。",
    visual: "hero",
    sign: "你的儿子，永远记得"
  },
  {
    label: "Finale",
    title: "母亲节快乐",
    text: "愿这束浅粉色的花，替我把想念、感谢和爱都送到你身边。谢谢你成为我的妈妈，也谢谢你把我养成今天的我。往后的路，我会更认真地爱你、陪你、守护你。",
    visual: "final",
    sign: "爱你的儿子"
  }
];

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="app-shell">
    <canvas class="intro-canvas" data-intro></canvas>
    <section class="intro-panel" data-intro-panel>
      <div class="intro-copy">
        <span>Mother's Day · 2026</span>
        <h1>给妈妈的一封花信</h1>
        <p>倒计时结束，粉色花朵绽放后，故事从这里开始。点击按钮会同时解锁手机音乐播放。</p>
        <button class="start-button" type="button" data-start>开启祝福</button>
      </div>
    </section>

    <audio src="/assets/bgm.mp3" preload="auto" loop></audio>
    <button class="music-toggle" type="button" data-music aria-label="播放背景音乐">
      <span class="music-disc"></span>
      <span data-music-label>Music</span>
    </button>

    <div class="progress" data-progress>01 / ${slides.length}</div>
    <main class="slides" data-slides>
      ${slides.map(renderSlide).join("")}
    </main>
    <div class="story-path" aria-hidden="true">
      <span></span>
      <i></i>
    </div>
    <div class="swipe-hint" data-hint>上滑或右滑继续</div>
    <div class="dots" data-dots></div>
    <div class="image-viewer" data-viewer aria-hidden="true">
      <button type="button" class="viewer-close" data-viewer-close aria-label="关闭图片">×</button>
      <img src="" alt="放大的照片" data-viewer-img>
    </div>
  </div>
`;

const audio = createAudioController("/assets/bgm.mp3");
const intro = createParticleIntro(app.querySelector("[data-intro]"));
const startButton = app.querySelector("[data-start]");
const introPanel = app.querySelector("[data-intro-panel]");
const musicButton = app.querySelector("[data-music]");
const musicLabel = app.querySelector("[data-music-label]");
let memoryScene = null;

intro.start();

window.setTimeout(() => {
  introPanel.classList.add("is-ready");
}, 3300);

startButton.addEventListener("click", async () => {
  await audio.unlockAudio();
  setMusicLabel();
  introPanel.classList.add("is-leaving");
  window.setTimeout(() => {
    app.classList.add("story-started");
  }, 900);
});

musicButton.addEventListener("click", async () => {
  await audio.toggleAudio();
  setMusicLabel();
});

const controller = createSlideController(app, {
  onChange(index) {
    app.dataset.scene = String(index + 1);
    ensureMemoryScene();
  }
});

app.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-viewer-src]");
  if (trigger) {
    openImageViewer(trigger.dataset.viewerSrc, trigger.querySelector("img")?.alt || "照片");
  }
});

app.querySelector("[data-viewer-close]").addEventListener("click", closeImageViewer);
app.querySelector("[data-viewer]").addEventListener("click", (event) => {
  if (event.target.matches("[data-viewer]")) closeImageViewer();
});

function setMusicLabel() {
  const playing = audio.isPlaying();
  musicButton.classList.toggle("is-playing", playing);
  musicLabel.textContent = playing ? "Pause" : "Music";
}

function ensureMemoryScene() {
  const canvas = app.querySelector("[data-memory-canvas]");
  if (!canvas || memoryScene) return;
  memoryScene = createMemoryScene(canvas);
  memoryScene.start();
}

function renderSlide(slide, index) {
  const titleTag = index === 0 ? "h1" : "h2";
  return `
    <section class="story-slide ${index === 0 ? "is-active" : ""}" data-page="${index + 1}" aria-hidden="${index === 0 ? "false" : "true"}">
      <div class="stage ${slide.visual === "final" ? "stage-final" : ""}">
        ${slide.visual !== "final" ? `<div class="visual">${renderVisual(slide.visual)}</div>` : ""}
        <div class="content">
          <p class="kicker">${slide.label}</p>
          <${titleTag}>${slide.title.replace(/\n/g, "<br>")}</${titleTag}>
          ${slide.poem ? `<p class="poem">${slide.poem}</p>` : ""}
          ${slide.quote ? `<div class="quote">“${slide.quote}”</div>` : ""}
          <p class="typewriter" data-type="${slide.text}"></p>
          ${slide.sign ? `<div class="signature">${slide.sign}</div>` : ""}
        </div>
      </div>
    </section>
  `;
}

function renderVisual(type) {
  if (type === "hero") {
    return `
      <figure class="hero-photo">
        <img src="/assets/anime.png" alt="我和妈妈的动漫化照片">
        <figcaption>这一张，放在故事里慢慢发光。</figcaption>
      </figure>
    `;
  }

  if (type === "wall") {
    return `
      <div class="photo-wall" aria-label="妈妈的照片墙">
        <figure data-viewer-src="/assets/mom-1.jpg"><img src="/assets/mom-1.jpg" alt="妈妈的照片一"><figcaption>温柔日常</figcaption></figure>
        <figure data-viewer-src="/assets/mom-2.jpg"><img src="/assets/mom-2.jpg" alt="妈妈的照片二"><figcaption>岁月花开</figcaption></figure>
        <figure data-viewer-src="/assets/mom-3.jpg"><img src="/assets/mom-3.jpg" alt="妈妈的照片三"><figcaption>心里有光</figcaption></figure>
      </div>
    `;
  }

  if (type === "space") {
    return `<canvas class="memory-canvas" data-memory-canvas aria-label="立体照片空间"></canvas>`;
  }

  return `
    <div class="floral-art" aria-hidden="true">
      <svg viewBox="0 0 520 520">
        <defs>
          <linearGradient id="petal" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#fff5f8"/>
            <stop offset=".58" stop-color="#f2a6ba"/>
            <stop offset="1" stop-color="#c75e7c"/>
          </linearGradient>
          <linearGradient id="leaf" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#dfead8"/>
            <stop offset="1" stop-color="#789267"/>
          </linearGradient>
        </defs>
        <path d="M255 475 C245 365 248 260 272 136" fill="none" stroke="#7f986f" stroke-width="7" stroke-linecap="round"/>
        <path d="M250 395 C185 360 152 318 132 264 C188 265 228 302 257 367" fill="url(#leaf)" opacity=".82"/>
        <path d="M269 330 C332 284 372 242 397 184 C342 184 296 226 263 295" fill="url(#leaf)" opacity=".78"/>
        <g transform="translate(260 124)">
          <path d="M0 -90 C45 -76 62 -29 26 0 C58 -5 89 25 77 67 C34 82 7 58 0 24 C-7 58 -34 82 -77 67 C-89 25 -58 -5 -26 0 C-62 -29 -45 -76 0 -90Z" fill="url(#petal)"/>
          <path d="M0 -54 C28 -43 37 -17 15 2 C37 0 56 17 49 43 C23 50 5 36 0 16 C-5 36 -23 50 -49 43 C-56 17 -37 0 -15 2 C-37 -17 -28 -43 0 -54Z" fill="#ffe8ef" opacity=".88"/>
          <circle cx="0" cy="6" r="15" fill="#bd7b68" opacity=".78"/>
        </g>
      </svg>
    </div>
  `;
}

function openImageViewer(src, alt) {
  const viewer = app.querySelector("[data-viewer]");
  const image = app.querySelector("[data-viewer-img]");
  image.src = src;
  image.alt = alt;
  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
}

function closeImageViewer() {
  const viewer = app.querySelector("[data-viewer]");
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
}

window.__story = { controller };
