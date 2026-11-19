const { chromium, devices } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/v3';
const geom = () => {
  const g = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top + scrollY), b: Math.round(r.bottom + scrollY), h: Math.round(r.height) }; };
  const act = document.querySelector('.zsh-plate.is-active');
  const ar = act.getBoundingClientRect();
  return {
    hero: g('#zs-hero'), preview: g('#zs-preview'), dots: g('.zsh-dots'), cue: g('#zs-cue'),
    plate: { t: Math.round(ar.top + scrollY), b: Math.round(ar.bottom + scrollY), h: Math.round(ar.height) },
    para: g('#zs-heropara'), paraOpacity: getComputedStyle(document.getElementById('zs-heropara')).opacity,
    previewMinH: getComputedStyle(document.getElementById('zs-preview')).minHeight,
    gapPlateToCue: null
  };
};
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8787/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1600);
  const a = await p.evaluate(geom);
  await p.tap('[data-pill="lockedin"]'); await p.waitForTimeout(700);
  const c = await p.evaluate(geom);
  // scroll to bottom of hero and screenshot
  await p.evaluate(() => window.scrollTo(0, 700));
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/phone-hero-bottom.png' });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.tap('[data-pill="lineready"]'); await p.waitForTimeout(500);
  await p.evaluate(() => window.scrollTo(0, 640));
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/phone-hero-bottom-lineready.png' });
  console.log(JSON.stringify({ lineready: a, lockedin: c }, null, 1));
  await b.close();
})();
