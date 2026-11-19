const { chromium, devices } = require('playwright');
const OUT='/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/v3';
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});
for (const [w,h,tag] of [[390,844,'phone'],[1440,900,'desk']]) {
const ctx= tag==='phone'? await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:844}}) : await b.newContext({viewport:{width:w,height:h}});
const p=await ctx.newPage();await p.goto('http://localhost:8787/',{waitUntil:'networkidle'});await p.waitForTimeout(1700);
const d=await p.evaluate(()=>{
 const c=document.getElementById('zs-cue');
 const out={};
 const cs=getComputedStyle(c);
 out.cue={pos:cs.position,z:cs.zIndex,op:cs.opacity,disp:cs.display,animName:cs.animationName};
 out.kids=[...c.children].map(s=>{const k=getComputedStyle(s);const r=s.getBoundingClientRect();return {tag:s.tagName,text:s.textContent,color:k.color,fs:k.fontSize,bg:k.background.slice(0,40),w:Math.round(r.width),h:Math.round(r.height),t:Math.round(r.top),vis:k.visibility,op:k.opacity};});
 const r=c.getBoundingClientRect();
 out.rect={t:Math.round(r.top),l:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height)};
 // what is on top at the cue's centre?
 const el=document.elementFromPoint(r.left+r.width/2, Math.min(innerHeight-2,Math.max(2,r.top+8)));
 out.topEl=el? el.tagName+'#'+el.id+'.'+el.className : null;
 return out;});
console.log(tag, JSON.stringify(d,null,1));
await p.close();await ctx.close();}
await b.close();})();
