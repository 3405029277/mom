import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const checks = [
  ["index.html mounts the app", () => {
    const html = read("index.html");
    assert.match(html, /<div id="app"><\/div>/);
    assert.match(html, /src="\/src\/main\.js"/);
  }],
  ["project assets use deploy-safe English names", () => {
    for (const file of ["public/assets/anime.png", "public/assets/mom-1.jpg", "public/assets/mom-2.jpg", "public/assets/mom-3.jpg", "public/assets/bgm.mp3"]) {
      assert.ok(exists(file), `${file} should exist`);
    }
  }],
  ["source modules are split by responsibility", () => {
    for (const file of ["src/main.js", "src/styles.css", "src/audio.js", "src/slides.js", "src/particles.js", "src/scene3d.js"]) {
      assert.ok(exists(file), `${file} should exist`);
    }
  }],
  ["mobile navigation is gesture based", () => {
    const slides = read("src/slides.js");
    assert.match(slides, /touchstart/);
    assert.match(slides, /touchend/);
    assert.doesNotMatch(read("src/main.js"), /id="nextBtn"/);
  }],
  ["intro has particle countdown and blossom transition", () => {
    const particles = read("src/particles.js");
    assert.match(particles, /countdown/i);
    assert.match(particles, /blossom/i);
    assert.match(particles, /THREE\./);
  }],
  ["audio starts from explicit unlock action", () => {
    const audio = read("src/audio.js");
    const main = read("src/main.js");
    assert.match(audio, /unlockAudio/);
    assert.match(main, /开启祝福/);
    assert.doesNotMatch(audio, /DOMContentLoaded[\s\S]*play/);
  }],
  ["vite build uses relative base for static hosting", () => {
    const config = read("vite.config.js");
    assert.match(config, /base:\s*["']\.\/["']/);
    assert.match(config, /outDir:\s*["']dist["']/);
  }],
  ["intro panel does not cover countdown before ready", () => {
    const css = read("src/styles.css");
    const main = read("src/main.js");
    assert.match(css, /\.intro-panel:not\(\.is-ready\)/);
    assert.match(main, /introPanel\.classList\.add\("is-ready"\)/);
  }],
  ["photo wall images can open in a viewer", () => {
    const main = read("src/main.js");
    const css = read("src/styles.css");
    assert.match(main, /data-viewer/);
    assert.match(main, /openImageViewer/);
    assert.match(css, /\.image-viewer/);
  }],
  ["mobile layout has story path and no bottom button navigation", () => {
    const main = read("src/main.js");
    const css = read("src/styles.css");
    assert.match(main, /story-path/);
    assert.match(css, /\.story-path/);
    assert.doesNotMatch(main, /下一页|上一页|nextBtn/);
  }],
  ["background uses layered translucent gradient", () => {
    const css = read("src/styles.css");
    assert.match(css, /linear-gradient\(180deg/);
    assert.match(css, /rgba\(/);
    assert.match(css, /backdrop-filter/);
  }]
];

let failed = 0;
for (const [name, run] of checks) {
  try {
    run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error.message);
  }
}

if (failed > 0) {
  process.exit(1);
}
