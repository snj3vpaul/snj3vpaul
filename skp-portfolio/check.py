from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
server=ThreadingHTTPServer(('127.0.0.1',8765),partial(SimpleHTTPRequestHandler,directory='/mnt/data/sanjeev-editorial-portfolio'))
Thread(target=server.serve_forever,daemon=True).start()
from pathlib import Path
base=Path('/mnt/data/sanjeev-editorial-portfolio')
html=(base/'index.html').read_text().replace('https://raw.githubusercontent.com/snj3vpaul/snj3vpaul/main/skp-portfolio/public/portrait.webp','data:image/webp;base64,broken').replace('https://raw.githubusercontent.com/snj3vpaul/snj3vpaul/main/skp-portfolio/src/assets/beyondwork/cricket/fifer.jpeg','data:image/jpeg;base64,broken').replace('<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">','').replace('<link rel="stylesheet" href="styles.css">','<style>'+ (base/'styles.css').read_text() +'</style>').replace('<script src="script.js" defer></script>','<script>'+(base/'script.js').read_text()+'</script>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--no-proxy-server','--proxy-bypass-list=*'])
 for name,w,h in [('desktop',1440,900),('tablet',820,1024),('mobile',390,844),('narrow',320,720)]:
  page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda err: errors.append(str(err)))
  page.set_content(html, wait_until='domcontentloaded')
  page.wait_for_timeout(200)
  page.screenshot(path=f'/mnt/data/sanjeev-editorial-{name}.png', full_page=True)
  dims=page.evaluate('''() => ({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth,header:document.querySelector('.header-inner').getBoundingClientRect().height, img:document.querySelector('.portrait-img').naturalWidth, paragraphs:document.querySelectorAll('p').length})''')
  print(name,dims, 'JS errors=',errors)
  if name in ('mobile','narrow','tablet'):
   t=page.locator('.menu-toggle')
   t.click(); print('menu opened',t.get_attribute('aria-expanded'),page.locator('#mobile-nav').is_visible())
   page.locator('#mobile-nav a[href="#work"]').click();print('menu after nav',t.get_attribute('aria-expanded'))
  page.close()
 b.close()
