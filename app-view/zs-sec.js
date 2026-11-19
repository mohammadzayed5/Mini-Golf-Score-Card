const { chromium, devices } = require('playwright');
const OUT='/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/t3';
const BASE='http://localhost:8787';
(async()=>{
const b=await chromium.launch({headless:true,channel:'chrome'});
for(const [w,h,tag,opt] of [[390,844,'m',{...devices['iPhone 13'],viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}],[1440,900,'d',{viewport:{width:1440,height:900},deviceScaleFactor:1}]]){
 const ctx=await b.newContext(opt);
 for(const [name,url] of [['home','/'],['lineready','/work/lineready/'],['privacy','/privacy/'],['websites','/work/websites/']]){
  const page=await ctx.newPage();
  await page.goto(BASE+url,{waitUntil:'networkidle'});
  await page.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=300;if(y>document.body.scrollHeight){clearInterval(t);r();}},130);}));
  await page.waitForTimeout(2500);
  const H=await page.evaluate(()=>document.body.scrollHeight);
  const n=Math.min(12,Math.ceil(H/h));
  for(let i=0;i<n;i++){ await page.evaluate(y=>window.scrollTo(0,y),i*h); await page.waitForTimeout(600); await page.screenshot({path:`${OUT}/${tag}-${name}-${String(i).padStart(2,'0')}.png`}); }
  await page.close();
 }
 await ctx.close();
}
await b.close();console.log('done');})();
