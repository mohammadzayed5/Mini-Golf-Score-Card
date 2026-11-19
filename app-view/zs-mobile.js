const { chromium, devices } = require('playwright');
const BASE='http://localhost:8787';
const OUT='/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review';
(async()=>{
const b=await chromium.launch({headless:true,channel:'chrome'});
const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const page=await ctx.newPage();
const fails=[];
page.on('requestfailed',r=>fails.push('FAIL '+r.url()+' '+(r.failure()||{}).errorText));
page.on('response',r=>{if(r.status()>=400)fails.push(r.status()+' '+r.url());});
await page.goto(BASE+'/',{waitUntil:'networkidle'});
// slow scroll so lazy images actually resolve
await page.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=400;if(y>document.body.scrollHeight){clearInterval(t);r();}},220);}));
await page.waitForTimeout(3000);
const bad=await page.evaluate(()=>[...document.images].map(i=>{const b=i.getBoundingClientRect();const cs=getComputedStyle(i);
 return{src:(i.currentSrc||i.src).split('/').slice(-1)[0],nw:i.naturalWidth,complete:i.complete,loading:i.loading,box:Math.round(b.width)+'x'+Math.round(b.height),disp:cs.display,op:cs.opacity,parentDisp:i.parentElement?getComputedStyle(i.parentElement).display:'-'};}).filter(i=>i.nw<=1));
console.log('BAD IMGS AFTER SLOW SCROLL:',JSON.stringify(bad,null,1));
console.log('REQ FAILS:',JSON.stringify([...new Set(fails)]));
// cover crop audit
await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(400);
const crop=await page.evaluate(()=>[...document.images].filter(i=>getComputedStyle(i).objectFit==='cover'&&i.getBoundingClientRect().width>2&&i.naturalWidth>1).map(i=>{const b=i.getBoundingClientRect();const slot=b.width/b.height,nat=i.naturalWidth/i.naturalHeight;return{src:i.currentSrc.split('/').slice(-1)[0],box:Math.round(b.width)+'x'+Math.round(b.height),slot:+slot.toFixed(3),nat:+nat.toFixed(3),cutPct:+(100*(1-Math.min(slot,nat)/Math.max(slot,nat))).toFixed(1)};}).sort((a,b)=>b.cutPct-a.cutPct));
console.log('COVER CROP @390:',JSON.stringify(crop,null,1));
// pills: tap a NON-active pill, expect card switch and no navigation
for(const key of ['lockedin','minigolf','websites','lineready','everything']){
  await page.goto(BASE+'/',{waitUntil:'networkidle'});await page.waitForTimeout(1800);
  const before=await page.evaluate(()=>{const a=document.querySelector('#zs-preview [data-card].is-active');return a?a.getAttribute('data-card'):null;});
  await page.tap(`#zs-pills [data-pill="${key}"]`);
  await page.waitForTimeout(900);
  const nav=page.url()!==BASE+'/';
  const st=nav?null:await page.evaluate(()=>{const a=document.querySelector('#zs-preview [data-card].is-active');if(!a)return{active:null};const r=a.getBoundingClientRect();const p=document.querySelector('#zs-pills').getBoundingClientRect();const im=a.querySelector('img');
   return{active:a.getAttribute('data-card'),top:Math.round(r.top),bottom:Math.round(r.bottom),h:Math.round(r.height),belowPills:r.top>=p.bottom-8,inVP:r.top<innerHeight&&r.bottom>0,imgNat:im?im.naturalWidth:null,imgBox:im?Math.round(im.getBoundingClientRect().width)+'x'+Math.round(im.getBoundingClientRect().height):null};});
  console.log(`TAP ${key}: before=${before} navigated=${nav} ${nav?page.url():JSON.stringify(st)}`);
}
await page.goto(BASE+'/',{waitUntil:'networkidle'});await page.waitForTimeout(1600);
await page.screenshot({path:OUT+'/home-hero-390.png'});
// contrast probe on key text
const con=await page.evaluate(()=>{const out=[];const pick=['.zs-chip','.zs-cap','.zs-foot-meta','.zs-foot-meta a','.zs-form-status','.zs-steps','.zs-faq summary'];
 pick.forEach(s=>{const e=document.querySelector(s);if(e){const c=getComputedStyle(e);out.push({s,color:c.color,bg:c.backgroundColor,fs:c.fontSize,td:c.textDecorationLine,fw:c.fontWeight});}});return out;});
console.log('CONTRAST PROBE:',JSON.stringify(con,null,1));
await b.close();})();
