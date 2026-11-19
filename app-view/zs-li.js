const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto('http://localhost:8787/work/lockedin/',{waitUntil:'networkidle'});
await p.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=350;if(y>document.body.scrollHeight){clearInterval(t);r();}},110);}));
await p.waitForTimeout(2200);
const g=await p.$('.zs-grid'); await g.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
await g.screenshot({path:'/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/t3/ligrid-1440.png'});
// also a normal viewport view of it
await p.evaluate(()=>{const e=document.querySelector('.zs-grid');window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-60);});
await p.waitForTimeout(800);
await p.screenshot({path:'/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/t3/ligrid-vp-1440.png'});
await b.close();})();
