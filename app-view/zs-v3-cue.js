const { chromium, devices } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/v3';
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8787/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1600);
  const info = await p.evaluate(() => {
    const c = document.getElementById('zs-cue');
    const cs = getComputedStyle(c);
    const r = c.getBoundingClientRect();
    return { opacity: cs.opacity, display: cs.display, visibility: cs.visibility, animation: cs.animationName, rect: { t: Math.round(r.top + scrollY), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) }, text: c.textContent.trim() };
  });
  console.log(JSON.stringify(info));
  await p.evaluate(() => document.getElementById('zs-cue').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(900);
  await p.screenshot({ path: OUT + '/phone-cue.png', clip: { x: 60, y: 330, width: 270, height: 180 } });
  // contrast sample
  await b.close();
})();
