/**
 * scraper-puppeteer-basic-auth.ts
 * To run this script, copy and paste `npx ts-node scraper-puppeteer-basic-auth.ts` in the terminal
 */
declare global {
    interface Window {
      jQuery: any;
    }
  }
import dotenv from 'dotenv';
import * as puppeteer from 'puppeteer';
dotenv.config();
(async () => {
  // Launch the browser in non-headless mode
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Set up HTTP Basic Authentication
  const port = process.env.PORT;
  console.log(port);
  const basicAuthUrl = process.env.URL||'';
  
  // Navigate to the login page with Basic Authentication
  await page.goto(basicAuthUrl);

  // Enter login credentials and submit the form
  await page.type('input[name="staff[email]"]', process.env.EMAIL||'');
  await page.type('input[name="staff[password]"]', process.env.PASSWORD||'');
  await page.click('input[type="submit"]');

  // Wait for navigation to the user's dashboard
  await page.waitForNavigation();
//   await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.6.0.min.js'});

  // Scrape the required data from the dashboard using jQuery
  const result = await page.evaluate(() => {
    // Ensure jQuery is available
    if (!window.jQuery) {
      return { error: 'jQuery is not available on the page' };
    }

    const applicants_no = $('.ibox').first().find('.ibox-content h1').text();

    return { applicants_no };
  });

  console.log(result);

  // Close the browser
  await browser.close();
})();
