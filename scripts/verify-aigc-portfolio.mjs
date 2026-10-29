import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname } from 'node:path';

const tvcVideos = [
  'tvc-01-ptlom-space-kit.mp4',
  'tvc-02-ptfff-leakproof.mp4',
  'tvc-03-highwall-home.mp4',
  'tvc-04-stainless-material.mp4',
];

const ugcVideos = [
  'ugc-01-dtc-short.mp4',
  'ugc-02-blackhair-creator.mp4',
  'ugc-03-slim-deepbowl-benefits.mp4',
  'ugc-04-slim-deepbowl.mp4',
];

const posters = [...tvcVideos, ...ugcVideos].map((name) => name.replace(/\.mp4$/, '.webp'));
const requiredAssets = [...tvcVideos, ...ugcVideos, ...posters];
const beltImages = [
  'belt-01-enclosed-living.webp',
  'belt-02-enclosed-white.webp',
  'belt-03-cat-exit.webp',
  'belt-04-enclosed-cat.webp',
  'belt-05-open-tray.webp',
  'belt-06-laundry-scene.webp',
  'belt-07-entry-pov.webp',
  'belt-08-covered-pair.webp',
  'belt-09-covered-living.webp',
  'belt-10-top-window.webp',
];
const heroCopy = [
  'AIGC / 产品 / 视觉叙事',
  '我以 AIGC 为核心，把产品卖点转化为能被看见、理解与记住的视觉内容。',
];
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

test('entry loads the AIGC content and style layers', () => {
  const html = readFileSync('index.html', 'utf8');
  expect(html.includes('aigc-portfolio-content.js'), 'content layer is not loaded');
  expect(html.includes('aigc-portfolio-overrides.css'), 'style layer is not loaded');
  expect(html.includes('AIGC visual creator'), 'AIGC metadata is missing');
});

test('content layer declares four TVC videos', () => {
  expect(existsSync('aigc-portfolio-content.js'), 'aigc-portfolio-content.js is missing');
  const source = readFileSync('aigc-portfolio-content.js', 'utf8');
  for (const file of tvcVideos) expect(source.includes(file), `${file} is not declared`);
});

test('content layer declares four UGC videos', () => {
  expect(existsSync('aigc-portfolio-content.js'), 'aigc-portfolio-content.js is missing');
  const source = readFileSync('aigc-portfolio-content.js', 'utf8');
  for (const file of ugcVideos) expect(source.includes(file), `${file} is not declared`);
});

test('content layer declares the approved AIGC hero copy', () => {
  const source = readFileSync('aigc-portfolio-content.js', 'utf8');
  for (const copy of heroCopy) expect(source.includes(copy), `hero copy is missing: ${copy}`);
});

test('content layer declares all ten image-belt artworks', () => {
  const source = readFileSync('aigc-portfolio-content.js', 'utf8');
  for (const file of beltImages) expect(source.includes(file), `${file} is not declared`);
});

test('all ten image-belt artworks exist', () => {
  for (const file of beltImages) {
    expect(existsSync(file), `${file} is missing`);
    expect(statSync(file).size > 8 * 1024, `${file} is unexpectedly small`);
  }
});

test('all eight videos and posters exist', () => {
  for (const file of requiredAssets) {
    expect(existsSync(file), `${file} is missing`);
    const minimum = extname(file) === '.mp4' ? 1024 * 1024 : 8 * 1024;
    expect(statSync(file).size > minimum, `${file} is unexpectedly small`);
  }
});

test('industrial work is replaced after the protected hero', () => {
  expect(existsSync('aigc-portfolio-content.js'), 'aigc-portfolio-content.js is missing');
  const source = readFileSync('aigc-portfolio-content.js', 'utf8');
  expect(source.includes('TVC COLLECTION / 品牌广告片'), 'TVC collection heading is missing');
  expect(source.includes('UGC COLLECTION / 原生内容'), 'UGC collection heading is missing');
  expect(source.includes("document.querySelector('.archive')?.remove()"), 'legacy archive is not removed');
});

test('the first-screen bundle copy remains intact', () => {
  const bundle = readFileSync('index-practice-r2.js', 'utf8');
  for (const value of ['Connect Reality,', 'Translate Information,', 'Design the Future.', 'See selected work']) {
    expect(bundle.includes(value), `protected hero copy changed: ${value}`);
  }
});

if (failures.length) {
  console.error(`\n${failures.length} contract test(s) failed.`);
  process.exit(1);
}

console.log('\nAIGC portfolio contract: PASS');
