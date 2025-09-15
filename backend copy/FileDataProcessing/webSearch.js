import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function searchWeb(query) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();

  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    console.log('Searching:', searchUrl);
    
    await page.goto(searchUrl, { 
      waitUntil: "networkidle2",
      timeout: 30000 
    });

    await page.waitForSelector('.b_algo', { timeout: 10000 });

    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.b_algo'))
        .slice(0, 5)
        .map((result) => {
          const titleEl = result.querySelector('h2 a');
          const snippetEl = result.querySelector('.b_caption p') || 
                           result.querySelector('.b_dList') ||
                           result.querySelector('.b_snippetBigText');
          
          if (!titleEl) return null;
          
          return {
            title: titleEl.innerText.trim(),
            url: titleEl.href,
            snippet: snippetEl ? snippetEl.innerText.trim() : ""
          };
        })
        .filter(result => result !== null);
    });

    console.log(`Found ${results.length} results`);
    return results;

  } catch (error) {
    console.error('Error during scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}