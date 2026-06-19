const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:8080/index.html...');
  await page.goto('http://localhost:8080/index.html');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Inspecting nav scrolled class...');
  await page.evaluate(() => {
    window.scrollTo(0, 200);
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const hasScrolledClass = await page.evaluate(() => {
    return document.querySelector('nav').classList.contains('scrolled');
  });
  console.log('Has nav got scrolled class at 200px scroll:', hasScrolledClass);

  await browser.close();
})();
