const { chromium, devices } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/v3';
const BASE = 'http://localhost:8787';
const PAGES = ['/', '/work/lineready/', '/work/lockedin/', '/work/minigolf/', '/work/websites/', '/privacy/'];

function attach(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.console.push(m.text()); });
  page.on('pageerror', e => bag.console.push('PAGEERROR ' + e.message));
  page.on('requestfailed', r => bag.failed.push(r.url() + ' :: ' + (r.failure() || {}).errorText));
  page.on('response', r => { if (r.status() >= 400) bag.failed.push(r.status() + ' ' + r.url()); });
}

async function scrollAll(page) {
  await page.evaluate(async () => {
    await new Promise(res => {
      let y = 0;
      const step = () => {
        y += 400; window.scrollTo(0, y);
        if (y < document.body.scrollHeight + 1000) setTimeout(step, 60); else { window.scrollTo(0, 0); setTimeout(res, 400); }
      };
      step();
    });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const report = { console: [], failed: [], notes: [] };

  for (const label of ['desktop', 'phone']) {
    const ctx = label === 'desktop'
      ? await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
      : await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } });
    for (const p of PAGES) {
      const bag = { console: [], failed: [] };
      const page = await ctx.newPage();
      attach(page, bag);
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await scrollAll(page);
      await page.waitForTimeout(600);
      const info = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll('img').forEach(im => {
          const r = im.getBoundingClientRect();
          const visible = getComputedStyle(im).display !== 'none' && im.offsetParent !== null;
          if (visible && (im.naturalWidth <= 1)) bad.push('BROKEN ' + im.currentSrc || im.src);
          if (visible && im.naturalWidth > 1 && r.width > 0) {
            const nat = im.naturalWidth / im.naturalHeight, ren = r.width / r.height;
            if (Math.abs(nat - ren) / nat > 0.02 && getComputedStyle(im).objectFit === 'fill')
              bad.push('SQUASH ' + (im.getAttribute('src')) + ' nat=' + nat.toFixed(3) + ' ren=' + ren.toFixed(3) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
          }
        });
        const over = [];
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
            const cs = getComputedStyle(el);
            if (cs.position !== 'fixed' && cs.overflow !== 'hidden')
              over.push(el.tagName + '.' + (el.className && el.className.toString().slice(0, 40)) + ' L' + Math.round(r.left) + ' R' + Math.round(r.right));
          }
        });
        return {
          scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
          bad, over: over.slice(0, 8),
          fonts: document.fonts.status,
          serif: (document.fonts.check("16px 'Instrument Serif'")), sans: document.fonts.check("16px 'Instrument Sans'"),
          title: document.title
        };
      });
      report.notes.push({ label, p, ...info, console: bag.console, failed: bag.failed });
      const name = label + (p === '/' ? '-home' : '-' + p.replace(/\//g, '_'));
      await page.screenshot({ path: OUT + '/' + name + '.png', fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
  console.log(JSON.stringify(report.notes, null, 1));
  await browser.close();
})();
