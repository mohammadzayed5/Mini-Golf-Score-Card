const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});
for(const [w,opt] of [[1440,{viewport:{width:1440,height:900}}],[390,{...devices['iPhone 13'],viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]){
const ctx=await b.newContext(opt);const p=await ctx.newPage();
await p.goto('http://localhost:8787/work/lineready/',{waitUntil:'networkidle'});
await p.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=350;if(y>document.body.scrollHeight){clearInterval(t);r();}},120);}));
await p.waitForTimeout(2500);
const r=await p.evaluate(()=>[...document.querySelectorAll('.zs-fig')].map(f=>{const i=f.querySelector('img');const s=f.querySelector('.zs-shot');const c=f.querySelector('.zs-cap');
 const ib=i.getBoundingClientRect(),sb=s.getBoundingClientRect();const cs=getComputedStyle(i);
 return{src:i.currentSrc.split('/').slice(-1)[0],fit:cs.objectFit,shot:Math.round(sb.width)+'x'+Math.round(sb.height),img:Math.round(ib.width)+'x'+Math.round(ib.height),nat:i.naturalWidth+'x'+i.naturalHeight,slotAR:+(sb.width/sb.height).toFixed(3),natAR:+(i.naturalWidth/i.naturalHeight).toFixed(3),cap:(c?c.textContent:'').slice(0,90),alt:i.alt};}));
console.log('W='+w,JSON.stringify(r,null,1));
// screenshot the grid
const g=await p.$('.zs-grid'); if(g){await g.scrollIntoViewIfNeeded();await p.waitForTimeout(900);await g.screenshot({path:`/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/t3/lrgrid-${w}.png`});}
await ctx.close();}
await b.close();})();
