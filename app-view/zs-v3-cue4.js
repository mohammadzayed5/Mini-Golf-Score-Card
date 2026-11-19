const { chromium, devices } = require('playwright');
const OUT='/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review/v3';
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});
const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:844}});
const p=await ctx.newPage();await p.goto('http://localhost:8787/',{waitUntil:'networkidle'});await p.waitForTimeout(1700);
await p.addStyleTag({content:'#zs-cue{animation:none!important;opacity:1!important}'});
await p.evaluate(()=>window.scrollTo(0,700));await p.waitForTimeout(600);
await p.locator('#zs-cue').screenshot({path:OUT+'/phone-cue-noanim.png'});
console.log('ok');await b.close();})();
