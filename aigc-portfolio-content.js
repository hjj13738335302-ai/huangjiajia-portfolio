const tvcReels = [
  {
    number: '01', title: 'COMPLETE KIT', titleCn: '全套组合卖点片',
    note: 'Full-kit product story / 按压太空全包款', duration: '00:16',
    video: 'tvc-01-ptlom-space-kit.mp4', poster: 'tvc-01-ptlom-space-kit.webp',
  },
  {
    number: '02', title: 'DEEP & LEAKPROOF', titleCn: '带盖深盆防漏尿',
    note: 'Problem-led product proof / 痛点与功能证明', duration: '00:21',
    video: 'tvc-02-ptfff-leakproof.mp4', poster: 'tvc-02-ptfff-leakproof.webp',
  },
  {
    number: '03', title: 'HIGH WALL, WARM HOME', titleCn: '高边温馨家居风',
    note: 'Home-led hook film / 家居场景与开场钩子', duration: '00:15',
    video: 'tvc-03-highwall-home.mp4', poster: 'tvc-03-highwall-home.webp',
  },
  {
    number: '04', title: 'STAINLESS BY NATURE', titleCn: '不锈钢材质表达',
    note: 'Material-focused visual / 材质价值与质感', duration: '00:16',
    video: 'tvc-04-stainless-material.mp4', poster: 'tvc-04-stainless-material.webp',
  },
];

const ugcReels = [
  {
    number: '01', title: 'DTC SOCIAL SHORT', titleCn: '独立站原生短片',
    note: 'Fast social storytelling / 竖屏节奏与视觉钩子', duration: '00:30',
    video: 'ugc-01-dtc-short.mp4', poster: 'ugc-01-dtc-short.webp',
  },
  {
    number: '02', title: 'CREATOR REVIEW', titleCn: '真人体验型 UGC',
    note: 'Problem to solution / 从痛点进入产品体验', duration: '00:31',
    video: 'ugc-02-blackhair-creator.mp4', poster: 'ugc-02-blackhair-creator.webp',
  },
  {
    number: '03', title: 'BENEFIT STORY', titleCn: '综合卖点竖屏片',
    note: 'Benefit-led structure / 综合卖点与节奏设计', duration: '00:29',
    video: 'ugc-03-slim-deepbowl-benefits.mp4', poster: 'ugc-03-slim-deepbowl-benefits.webp',
  },
  {
    number: '04', title: 'UNBOX & USE', titleCn: '开箱与使用场景',
    note: 'Native creator language / 开箱、演示与结果证明', duration: '00:32',
    video: 'ugc-04-slim-deepbowl.mp4', poster: 'ugc-04-slim-deepbowl.webp',
  },
];

const waitFor = (selector, timeout = 8000) => new Promise((resolve, reject) => {
  const ready = document.querySelector(selector);
  if (ready) {
    resolve(ready);
    return;
  }

  const observer = new MutationObserver(() => {
    const node = document.querySelector(selector);
    if (node) {
      observer.disconnect();
      resolve(node);
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => {
    observer.disconnect();
    reject(new Error(`Timed out waiting for ${selector}`));
  }, timeout);
});

const setText = (root, selector, value) => {
  const node = root?.querySelector(selector);
  if (node) node.textContent = value;
};

const setSectionTitle = (root, title, accent, english) => {
  const node = root?.querySelector('h2');
  if (!node) return;
  node.innerHTML = `${title}<br><i>${accent}</i><small lang="en">${english}</small>`;
};

const makeReelTile = (reel, kind) => `
  <article class="reel-tile reel-tile--${kind}">
    <div class="reel-media">
      <video preload="metadata" playsinline poster="${reel.poster}" aria-label="${reel.title} / ${reel.titleCn}">
        <source src="${reel.video}" type="video/mp4">
        Your browser does not support video playback.
      </video>
      <button class="reel-play" type="button" aria-label="Play ${reel.title}">
        <span class="reel-play__icon" aria-hidden="true">▶</span>
        <span class="reel-play__label">PLAY FILM</span>
      </button>
      <span class="reel-duration">${reel.duration}</span>
    </div>
    <div class="reel-meta">
      <span>${reel.number}</span>
      <div>
        <h4>${reel.title}<small lang="zh-CN">${reel.titleCn}</small></h4>
        <p>${reel.note}</p>
      </div>
    </div>
  </article>`;

const bindReelControls = (root) => {
  const videos = [...root.querySelectorAll('.reel-media video')];
  videos.forEach((video) => {
    const tile = video.closest('.reel-tile');
    const button = tile.querySelector('.reel-play');
    const label = tile.querySelector('.reel-play__label');
    const icon = tile.querySelector('.reel-play__icon');

    const sync = () => {
      const playing = !video.paused && !video.ended;
      tile.classList.toggle('is-playing', playing);
      label.textContent = playing ? 'PAUSE' : 'PLAY FILM';
      icon.textContent = playing ? 'Ⅱ' : '▶';
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${video.getAttribute('aria-label')}`);
      video.controls = playing;
    };

    const toggle = () => {
      if (video.paused || video.ended) {
        videos.forEach((other) => {
          if (other !== video) other.pause();
        });
        video.play().catch(sync);
      } else {
        video.pause();
      }
    };

    button.addEventListener('click', toggle);
    video.addEventListener('click', () => {
      if (!video.controls) toggle();
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    video.addEventListener('error', () => tile.classList.add('has-media-error'));
  });
};

const updateImageBelt = () => {
  const posters = [...tvcReels, ...ugcReels].map((item) => item.poster);
  document.querySelectorAll('.belt img').forEach((image, index) => {
    image.src = posters[index % posters.length];
    image.alt = '';
  });
  document.querySelector('.belt')?.setAttribute('aria-label', 'AIGC TVC and UGC key frames');
};

const updatePractice = () => {
  const root = document.querySelector('.practice');
  if (!root) return;
  setText(root, '.section-label', 'CREATIVE STATEMENT / 创作宣言');
  setSectionTitle(root, '从一个想法，', '到一支让人停留的影片。', 'FROM AN IDEA TO A FILM WORTH WATCHING.');

  const copy = root.querySelector('.practice-copy');
  if (copy) {
    copy.innerHTML = `
      <span lang="zh-CN">我从传播目标开始，把产品卖点转化为可被看见、理解与记住的镜头。从创意策略、脚本与分镜，到 AI 视觉生成、剪辑与后期，我独立完成从概念到成片的完整制作。</span>
      <small lang="en">I turn product truths into images people can see, understand and remember — from concept, script and storyboard to AI generation, editing and finishing.</small>`;
    copy.setAttribute('aria-label', copy.textContent.trim());
  }

  const principles = [
    '01 / CONCEPT & SCRIPT / 创意与脚本',
    '02 / AI VISUAL & MOTION / AI 视觉与动态',
    '03 / EDIT & FINISH / 剪辑与后期',
  ];
  root.querySelectorAll('.principles span').forEach((node, index) => {
    node.textContent = principles[index];
  });

  const images = root.querySelectorAll('.practice-image');
  if (images[0]) Object.assign(images[0], { src: tvcReels[0].poster, alt: 'AIGC TVC key frame' });
  if (images[1]) Object.assign(images[1], { src: ugcReels[1].poster, alt: 'AIGC UGC key frame' });
};

const updateCapabilities = () => {
  const root = document.querySelector('.capabilities');
  if (!root) return;
  setText(root, '.section-label', 'CAPABILITIES / 核心能力');
  setSectionTitle(root, '让每个想法，', '都有自己的镜头语言。', 'GIVE EVERY IDEA ITS OWN VISUAL LANGUAGE.');

  const items = [
    ['TVC & CAMPAIGN FILMS / 品牌 TVC 与电商广告', '从传播目标、脚本与分镜出发，以 AI 生成和后期完成具有品牌气质的产品影片。', 'Brand-led product films built from strategy to final cut.'],
    ['UGC & SOCIAL CONTENT / UGC 与社媒短视频', '围绕开场钩子、真实场景、痛点演示与购买理由，制作适配社媒节奏的内容。', 'Native social stories shaped around hooks, proof and real use.'],
    ['AI VISUAL & KEY ART / AI 产品视觉与主视觉', '建立统一的产品世界、材质质感与视觉风格，为视频与电商内容提供关键画面。', 'Consistent product worlds, material detail and campaign-ready imagery.'],
  ];

  root.querySelectorAll('.capability').forEach((row, index) => {
    const item = items[index];
    if (!item) return;
    setText(row, 'h3', item[0]);
    const paragraph = row.querySelector('p');
    if (paragraph) paragraph.innerHTML = `${item[1]}<small lang="en">${item[2]}</small>`;
  });
};

const updateAbout = () => {
  const root = document.querySelector('.about-me');
  if (!root) return;
  setText(root, '.section-label', 'ABOUT / 关于我');
  setSectionTitle(root, '从创意出发，', '用 AI 完成每一个镜头。', 'IDEA FIRST. AI THROUGH EVERY FRAME.');

  const paragraphs = root.querySelectorAll('.about-me__intro > div > p:not(.section-label)');
  if (paragraphs[0]) paragraphs[0].textContent = '我是黄佳佳，一名以生成式 AI 为核心的视觉创作者。我独立完成创意策略、脚本、分镜、AI 生图与视频、剪辑和后期，把一个想法推进为可以直接呈现的商业内容。';
  if (paragraphs[1]) paragraphs[1].textContent = 'I am Huang Jiajia, an AI-first visual creator working across concept, script, storyboard, image and video generation, editing and finishing.';

  const tags = ['Concept', 'Script & Storyboard', 'AI Image & Video', 'Editing & Finishing'];
  root.querySelectorAll('.about-me__tags span').forEach((node, index) => {
    node.textContent = tags[index];
  });

  const image = root.querySelector('.about-me__image img');
  if (image) Object.assign(image, { src: tvcReels[3].poster, alt: 'Stainless steel product TVC key frame' });
  setText(root, '.about-me__image > span', 'AIGC VISUAL CREATOR / 2026');
};

const updateProducts = () => {
  const root = document.querySelector('.products');
  if (!root) return;

  root.innerHTML = `
    <span id="spatial" class="anchor-sentinel" aria-hidden="true"></span>
    <p class="section-label"><span class="section-dot" aria-hidden="true"></span> SELECTED WORK / 精选作品</p>
    <h2>为品牌，<br><i>制造值得停留的一秒。</i><small lang="en">CREATING THE SECOND THAT MAKES PEOPLE STOP.</small></h2>
    <div class="reel-stack">
      <section class="reel-collection reel-collection--tvc" aria-labelledby="tvc-title">
        <header class="reel-collection__header">
          <span class="reel-collection__number">01</span>
          <div><p>TVC COLLECTION / 品牌广告片</p><h3 id="tvc-title">PRODUCT FILMS<em>Four commercial cuts</em></h3></div>
        </header>
        <p class="reel-collection__intro">围绕产品卖点、材质与家居场景，用 AI 完成从创意、脚本、分镜到剪辑后期的完整广告片制作。<small lang="en">Four AI-assisted product films shaped from concept to final cut.</small></p>
        <div class="reel-grid reel-grid--tvc">${tvcReels.map((reel) => makeReelTile(reel, 'tvc')).join('')}</div>
      </section>
      <section class="reel-collection reel-collection--ugc" aria-labelledby="ugc-title">
        <header class="reel-collection__header">
          <span class="reel-collection__number">02</span>
          <div><p>UGC COLLECTION / 原生内容</p><h3 id="ugc-title">SOCIAL STORIES<em>Four native vertical cuts</em></h3></div>
        </header>
        <p class="reel-collection__intro">以社媒原生语气组织开场钩子、真实痛点、使用过程与结果证明，让内容更接近用户正在观看的生活。<small lang="en">Four vertical stories built around hooks, proof and real-use rhythm.</small></p>
        <div class="reel-grid reel-grid--ugc">${ugcReels.map((reel) => makeReelTile(reel, 'ugc')).join('')}</div>
      </section>
    </div>`;

  bindReelControls(root);
};

const updateFooter = () => {
  const root = document.querySelector('.footer');
  if (!root) return;
  setText(root, '.section-label', 'OPEN TO AIGC OPPORTUNITIES / 寻找 AIGC 创意机会');
  const heading = root.querySelector('h2');
  if (heading) heading.innerHTML = '<span class="footer-lets">LET\'S</span><br><i>CREATE.</i>';
};

const applyPortfolio = async () => {
  await waitFor('.products');
  updateImageBelt();
  updatePractice();
  updateCapabilities();
  updateAbout();
  updateProducts();
  updateFooter();

  const products = document.querySelector('.products');
  const about = document.querySelector('.about-me');
  if (products && about) about.before(products);
  document.querySelector('.archive')?.remove();

  document.documentElement.dataset.aigcPortfolio = 'ready';
};

applyPortfolio().catch((error) => {
  console.error('AIGC portfolio content failed to load', error);
});
