const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
for(const s of ['lineready','lockedin','minigolf','websites']){
 await p.goto('http://localhost:8787/work/'+s+'/',{waitUntil:'networkidle'});
 await p.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=350;if(y>document.body.scrollHeight){clearInterval(t);r();}},110);}));
 await p.waitForTimeout(2200);
 const r=await p.evaluate(()=>[...document.querySelectorAll('.zs-media img, .zs-full img')].map(i=>{const b=i.getBoundingClientRect();
   const chosen=i.currentSrc.split('/').slice(-1)[0];
   return{chosen,box:Math.round(b.width)+'x'+Math.round(b.height),declaredW:i.getAttribute('width'),sizes:i.getAttribute('sizes')||'-',hasSrcset:!!i.getAttribute('srcset'),cssW:Math.round(b.width)};}));
 console.log('== '+s, JSON.stringify(r,null,1));
}
await b.close();})();
