const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});
for(const [w,opt] of [[390,{...devices['iPhone 13'],viewport:{width:390,height:844},isMobile:true,hasTouch:true}],[1440,{viewport:{width:1440,height:900}}]]){
const ctx=await b.newContext(opt);const p=await ctx.newPage();
await p.goto('http://localhost:8787/',{waitUntil:'networkidle'});
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const f=document.querySelector('.zs-site-footer');const g=f.querySelector('.zs-foot-grid')||f.firstElementChild;
 const cs=getComputedStyle(g);
 const lists=[...f.querySelectorAll('.zs-foot-list')].map(l=>{const li=[...l.children];const cl=getComputedStyle(l);
   return{gap:cl.rowGap,items:li.length,tops:li.map(x=>Math.round(x.getBoundingClientRect().top)),h:li.map(x=>Math.round(x.getBoundingClientRect().height))};});
 const meta=f.querySelector('.zs-foot-meta');
 return{gridDisp:cs.display,cols:cs.gridTemplateColumns,gap:cs.gap,rowGap:cs.rowGap,footH:Math.round(f.getBoundingClientRect().height),lists,
  metaHTML:meta?meta.innerHTML.replace(/\s+/g,' ').trim():null};});
console.log(w,JSON.stringify(r,null,1));
await ctx.close();}
await b.close();})();
