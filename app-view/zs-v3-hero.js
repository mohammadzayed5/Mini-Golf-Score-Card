const { chromium, devices } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/v3';
const BASE = 'http://localhost:8787';

const state = () => {
  const act = document.querySelector('.zsh-plate.is-active');
  const pill = [...document.querySelectorAll('[data-pill]')].find(p => p.style.background === 'rgb(245, 242, 236)');
  const dots = [...document.querySelectorAll('.zsh-dots span')].map(d => d.classList.contains('is-on') ? 1 : 0);
  const img = act && act.querySelector('img');
  const r = img && img.getBoundingClientRect();
  return {
    activeCard: act && act.getAttribute('data-card'),
    activePill: pill && pill.getAttribute('data-pill'),
    dots,
    idle: document.getElementById('zs-preview').classList.contains('is-idle'),
    img: img ? { src: img.getAttribute('src'), nw: img.naturalWidth, nh: img.naturalHeight, w: Math.round(r.width), h: Math.round(r.height), natRatio: +(img.naturalWidth / img.naturalHeight).toFixed(3), renRatio: +(r.width / r.height).toFixed(3) } : null,
    focusables: [...document.querySelectorAll('.zsh-cta')].map(a => a.tabIndex),
    capVisible: act ? getComputedStyle(act.querySelector('.zsh-cap')).visibility : null
  };
};

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const out = {};

  // ---- desktop sizes: aspect ratio of hero plate
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PE ' + e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  out.ratios = [];
  for (const [w, h] of [[901, 900], [1024, 900], [1280, 800], [1366, 768], [1440, 900], [1600, 1000], [1920, 1080]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(350);
    const s = await page.evaluate(state);
    // hero fit: does the plate + caption stay within viewport, and does headline/cue clip?
    const fit = await page.evaluate(() => {
      const pv = document.getElementById('zs-preview').getBoundingClientRect();
      const hl = document.getElementById('zs-headline').getBoundingClientRect();
      const cue = document.getElementById('zs-cue').getBoundingClientRect();
      const hero = document.getElementById('zs-hero').getBoundingClientRect();
      return { pvTop: Math.round(pv.top), pvBot: Math.round(pv.bottom), hlBot: Math.round(hl.bottom), cueTop: Math.round(cue.top), heroBot: Math.round(hero.bottom), vh: innerHeight, pvRight: Math.round(pv.right), hlRight: Math.round(hl.right) };
    });
    out.ratios.push({ vp: w + 'x' + h, img: s.img, fit });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);

  // ---- hover persistence
  const lr = page.locator('[data-pill="lineready"]');
  const li = page.locator('[data-pill="lockedin"]');
  await lr.hover(); await page.waitForTimeout(600);
  out.afterHoverLineready = await page.evaluate(state);
  await li.hover(); await page.waitForTimeout(600);
  out.afterHoverLockedin = await page.evaluate(state);
  await page.locator('#zs-headline').hover(); await page.waitForTimeout(2000);
  out.afterMoveAway = await page.evaluate(state);
  await page.screenshot({ path: OUT + '/hero-persist-1440.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // ---- keyboard tab through pills
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab'); // menu
  const tabbed = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(180);
    tabbed.push(await page.evaluate(() => {
      const a = document.activeElement;
      return (a.getAttribute('data-pill') || a.className || a.tagName) + '|' + (a.textContent || '').trim().slice(0, 24);
    }));
  }
  out.tabOrder = tabbed;
  out.afterTab = await page.evaluate(state);

  // ---- "Everything" pill idle
  await page.locator('[data-pill="everything"]').hover(); await page.waitForTimeout(700);
  out.afterEverything = await page.evaluate(state);

  // ---- tiers layout at 1440
  out.tiers1440 = await page.evaluate(() => {
    const t = [...document.querySelectorAll('.zs-tier')].map(e => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), w: Math.round(r.width) }; });
    const care = [...document.querySelectorAll('.zs-care-card, .zs-care-incl')].map(e => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), w: Math.round(r.width) }; });
    return { t, care, cols: getComputedStyle(document.querySelector('.zs-tiers')).gridTemplateColumns };
  });

  // ---- FAQ open
  await page.locator('.zs-faq summary').nth(2).click();
  await page.waitForTimeout(400);
  out.faqOpen = await page.evaluate(() => [...document.querySelectorAll('.zs-faq details')].map(d => d.open));

  // ---- form submit
  await page.route('**/', async (route, req) => {
    if (req.method() === 'POST') return route.fulfill({ status: 200, body: 'ok' });
    return route.continue();
  });
  await page.fill('#zs-f-name', 'Test Person');
  await page.fill('#zs-f-email', 'test@example.com');
  await page.fill('#zs-f-msg', 'Hello there');
  await page.click('[data-submit]');
  await page.waitForTimeout(1500);
  out.formStatus = await page.evaluate(() => {
    const el = document.querySelector('[data-form-status]');
    return { text: el.textContent.trim(), cls: el.className, visible: !!el.offsetParent };
  });

  // ---- caption CTA links
  out.ctaHrefs = await page.evaluate(() => [...document.querySelectorAll('.zsh-cta')].map(a => a.getAttribute('href')));
  await page.close(); await ctx.close();

  // ---- phone
  const pctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } });
  const pp = await pctx.newPage();
  const perrs = [];
  pp.on('console', m => { if (m.type() === 'error') perrs.push(m.text()); });
  pp.on('pageerror', e => perrs.push('PE ' + e.message));
  await pp.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pp.waitForTimeout(1600);
  out.phoneInitial = await pp.evaluate(state);
  await pp.tap('[data-pill="lockedin"]'); await pp.waitForTimeout(700);
  out.phoneAfterLockedin = await pp.evaluate(state);
  await pp.tap('[data-pill="minigolf"]'); await pp.waitForTimeout(700);
  out.phoneAfterMinigolf = await pp.evaluate(state);
  await pp.screenshot({ path: OUT + '/phone-minigolf.png' });
  await pp.tap('[data-pill="minigolf"]');
  await pp.waitForTimeout(1600);
  out.phoneAfterSecondTap = pp.url();
  await pp.goBack(); await pp.waitForTimeout(1200);
  out.tiers390 = await pp.evaluate(() => {
    const t = [...document.querySelectorAll('.zs-tier')].map(e => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), w: Math.round(r.width) }; });
    return { t, cols: getComputedStyle(document.querySelector('.zs-tiers')).gridTemplateColumns };
  });
  out.phoneErrs = perrs;
  await pp.close(); await pctx.close();

  // ---- 360x780
  const c3 = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p3 = await c3.newPage();
  const e3 = [];
  p3.on('console', m => { if (m.type() === 'error') e3.push(m.text()); });
  p3.on('pageerror', e => e3.push('PE ' + e.message));
  await p3.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p3.waitForTimeout(1500);
  out.p360 = await p3.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  out.p360state = await p3.evaluate(state);
  await p3.screenshot({ path: OUT + '/home-360.png', fullPage: false });
  out.e360 = e3;
  await p3.close(); await c3.close();

  out.desktopErrs = errs;
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
