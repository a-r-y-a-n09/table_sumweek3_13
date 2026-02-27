const { chromium } = require('playwright');

async function run() {
  console.log("Starting Playwright scraping...\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (let seed = 47; seed <= 56; seed++) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    console.log(`Visiting seed ${seed}...`);

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait until at least one table cell exists
    await page.waitForSelector('td');

    const pageSum = await page.$$eval('td', cells => {
      return cells
        .map(td => parseFloat(td.textContent.trim()))
        .filter(num => !isNaN(num))
        .reduce((a, b) => a + b, 0);
    });

    console.log(`Seed ${seed} sum: ${pageSum}`);
    grandTotal += pageSum;
  }

  console.log("\n=================================");
  console.log(`FINAL TOTAL: ${grandTotal}`);
  console.log("=================================\n");

  await browser.close();
}

run().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
