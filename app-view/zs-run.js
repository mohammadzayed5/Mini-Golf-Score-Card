const { chromium, devices } = require('playwright');
const OUT='/private/tmp/claude-501/-Users-mohammadzayed-dev-Zayed-Software-LLC/34fb4d68-092a-471a-8191-c2f8d54994ad/scratchpad/review';
const BASE='http://localhost:8787';
const PAGES=[['home','/'],['lineready','/work/lineready/'],['lockedin','/work/lockedin/'],['minigolf','/work/minigolf/'],['websites','/work/websites/'],['privacy','/privacy/']];
const log=[];
const say=(...a)=>{const s=a.join(' ');log.push(s);console.log(s);};

(async()=>{
const browser=await chromium.launch({headless:true,channel:'chrome'});
for(const width of [1440,390]){
  const ctxOpts = width===390
    ? {...devices['iPhone 13'], viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2}
    : {viewport:{width:1440,height:900}};
  const ctx=await browser.newContext(ctxOpts);
  for(const [name,url] of PAGES){
    const page=await ctx.newPage();
    const errs=[],fails=[];
    page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
    page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
    page.on('requestfailed',r=>fails.push(r.url()+' :: '+(r.failure()||{}).errorText));
    page.on('response',r=>{if(r.status()>=400)fails.push(r.status()+' '+r.url());});
    await page.goto(BASE+url,{waitUntil:'networkidle',timeout:45000});
    await page.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=600;if(y>document.body.scrollHeight+1200){clearInterval(t);window.scrollTo(0,0);r();}},60);}));
    await page.waitForTimeout(1200);
    // fonts
    const fonts=await page.evaluate(async()=>{await document.fonts.ready;return{serif:document.fonts.check('1em "Instrument Serif"'),sans:document.fonts.check('1em "Instrument Sans"')};});
    // images
    const imgs=await page.evaluate(()=>[...document.images].map(i=>({src:i.currentSrc||i.src,nw:i.naturalWidth,nh:i.naturalHeight,vis:i.getBoundingClientRect().width>0,hidden:getComputedStyle(i).display==='none'})).filter(i=>i.nw<=1));
    // overflow
    const ov=await page.evaluate(()=>{const de=document.documentElement;const r={sw:de.scrollWidth,cw:de.clientWidth,off:[]};
      if(de.scrollWidth>de.clientWidth+1){document.querySelectorAll('*').forEach(el=>{const b=el.getBoundingClientRect();if(b.right>de.clientWidth+2&&b.width>0&&getComputedStyle(el).position!=='fixed')r.off.push((el.tagName+'.'+(el.className&&el.className.baseVal===undefined?String(el.className):'')).slice(0,80)+' right='+Math.round(b.right));});}
      return r;});
    say(`[${name}@${width}] fonts serif=${fonts.serif} sans=${fonts.sans} | badImgs=${imgs.length} ${JSON.stringify(imgs)} | scrollW=${ov.sw} clientW=${ov.cw}`);
    if(ov.off.length) say(`  OVERFLOW-ELS: ${[...new Set(ov.off)].slice(0,8).join(' | ')}`);
    if(errs.length) say(`  CONSOLE-ERR[${name}@${width}]: ${JSON.stringify(errs)}`);
    if(fails.length) say(`  REQ-FAIL[${name}@${width}]: ${JSON.stringify([...new Set(fails)])}`);

    if(name==='home'){
      // canvas
      const canv=await page.evaluate(()=>{const c=document.querySelector('#zs-hero canvas, canvas');return c?{disp:getComputedStyle(c).display,w:c.width}:null;});
      say(`  CANVAS@${width}: ${JSON.stringify(canv)}`);
      // menu
      await page.click('#zs-menu-btn, [data-menu], button:has-text("Menu")').catch(async()=>{await page.getByText('Menu',{exact:true}).first().click();});
      await page.waitForTimeout(700);
      const openState=await page.evaluate(()=>{const o=document.querySelector('#zs-menu,.zs-menu,[data-overlay]');return o?{op:getComputedStyle(o).opacity,vis:getComputedStyle(o).visibility,disp:getComputedStyle(o).display}:'nomenu';});
      await page.screenshot({path:`${OUT}/${name}-menu-${width}.png`});
      await page.keyboard.press('Escape');await page.waitForTimeout(700);
      const closeState=await page.evaluate(()=>{const o=document.querySelector('#zs-menu,.zs-menu,[data-overlay]');return o?{op:getComputedStyle(o).opacity,vis:getComputedStyle(o).visibility}:'nomenu';});
      say(`  MENU open=${JSON.stringify(openState)} closed=${JSON.stringify(closeState)}`);
      // faq
      const faq=await page.evaluate(()=>{const d=[...document.querySelectorAll('.zs-faq details, details')];if(!d.length)return 'nofaq';d[0].open=true;return {count:d.length,openable:d[0].open};});
      say(`  FAQ ${JSON.stringify(faq)}`);
      // pills: desktop hover switches; touch first-tap switches (non-active only)
      const keys=['lineready','lockedin','minigolf','websites','everything'];
      const pillRes=[];
      for(const key of keys){
        if(page.url()!==BASE+'/'){ await page.goto(BASE+'/',{waitUntil:'networkidle'}); await page.waitForTimeout(1600); }
        const sel=`#zs-pills [data-pill="${key}"]`;
        if(width===390){ const cur=await page.evaluate(()=>{const a=document.querySelector('#zs-preview [data-card].is-active');return a&&a.getAttribute('data-card');});
          if(cur===key){ pillRes.push(key+'=>already-active(tap opens page, by design)'); continue; }
          await page.tap(sel); }
        else { await page.hover(sel); }
        await page.waitForTimeout(800);
        if(page.url()!==BASE+'/'){ pillRes.push(key+'=>NAVIGATED '+page.url()); continue; }
        const st=await page.evaluate(()=>{const a=document.querySelector('#zs-preview [data-card].is-active');if(!a)return{active:null};
          const r=a.getBoundingClientRect();const pil=document.querySelector('#zs-pills').getBoundingClientRect();
          return{active:a.getAttribute('data-card'),op:getComputedStyle(a).opacity,top:Math.round(r.top),h:Math.round(r.height),belowPills:r.top>=pil.bottom-8,inVP:r.top<innerHeight&&r.bottom>0};});
        pillRes.push(key+'=>'+JSON.stringify(st));
      }
      say(`  PILLS ${pillRes.join(' ; ')}`);
      if(page.url()!==BASE+'/'){ await page.goto(BASE+'/',{waitUntil:'networkidle'}); await page.waitForTimeout(1200); }
      // form
      await page.route('**/', route=>{ if(route.request().method()==='POST') return route.fulfill({status:200,contentType:'text/html',body:'ok'}); route.continue(); });
      await page.fill('form[name="contact"] input[name="name"], #zs-contact input[name="name"]','Test Person');
      await page.fill('form[name="contact"] input[name="email"], #zs-contact input[name="email"]','test@example.com');
      await page.fill('form[name="contact"] textarea[name="message"], #zs-contact textarea[name="message"]','Hello there, this is a verification submit.');
      await page.click('form[name="contact"] button[type="submit"], form[name="contact"] button');
      await page.waitForTimeout(2200);
      const fs2=await page.evaluate(()=>{const s=document.querySelector('.zs-form-status');return s?{txt:s.textContent.trim(),cls:s.className,disp:getComputedStyle(s).display,color:getComputedStyle(s).color}:'nostatus';});
      say(`  FORM ${JSON.stringify(fs2)}`);
      await page.screenshot({path:`${OUT}/${name}-form-${width}.png`});
      await page.unroute('**/');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForTimeout(800);
    }
    await page.evaluate(()=>new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=700;if(y>document.body.scrollHeight+1400){clearInterval(t);window.scrollTo(0,0);r();}},50);}));
    await page.waitForTimeout(900);
    await page.screenshot({path:`${OUT}/${name}-${width}.png`,fullPage:true});
    await page.close();
  }
  await ctx.close();
}
await browser.close();
require('fs').writeFileSync(OUT+'/runtime-log.txt',log.join('\n'));
})();
