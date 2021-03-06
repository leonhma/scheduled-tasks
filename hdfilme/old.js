import pptr from 'puppeteer';
import axios from 'axios';


const uploadScreenshot  = async (page) => {
  await axios({
    method: 'post',
    url: 'https://api.upload.io/v1/files/basic',
    data: await page.screenshot(),
    headers: {'Authorization': 'Bearer public_kW15arLAYiQwywpdkFyagRxWLrKr', 'Content-Type': 'image/png'}
  })
  .then(res => {
    console.log(`uploaded screenshot to ${res.data.fileUrl}`);
  })
  .catch(error => {
    console.error(error);
  });
}

const browser = await pptr.launch({ args: ['--no-sandbox'] });
const context = browser.defaultBrowserContext();
await context.overridePermissions('https://putput.net/', ['clipboard-read'])

const putput = await browser.newPage();

await putput.goto('https://putput.net/lustig', { 'referer': 'https://www.google.com/' });
await putput.waitForTimeout(1000);
await uploadScreenshot(putput)
await putput.evaluate(_ => {
  document.querySelector('article[data-key="9"]').scrollIntoView()
});
await putput.waitForTimeout(1000);
await uploadScreenshot(putput)
await putput.click('#core-view > div > div.pp-section-list-container > div.gift-box > div > div > div.v-responsive__content')
await uploadScreenshot(putput)
console.log('waiting 120 secs')

await putput.waitForTimeout(125000),
                  
await uploadScreenshot(putput)

await putput.click('#core-view > div > div.pp-section-list-container > div.gift-box > div > div.gift-box-body > div > div.gift-box-types > div:nth-child(2) > div.v-image.v-responsive.theme--light > div.v-responsive__content')
await putput.waitForTimeout(200)
await uploadScreenshot(putput)
await putput.click('input[value="hdfilme.tv"]+div.v-input--selection-controls__ripple')
await putput.waitForTimeout(200)
await uploadScreenshot(putput)
await putput.click('button.gift-box-choose')
await putput.waitForTimeout(1000);
await uploadScreenshot(putput)
await putput.click('input#coupon-code')
await putput.waitForTimeout(200);
await uploadScreenshot(putput)

const couponCode = await page.evaluate(`(async () => await navigator.clipboard.readText())()`)

console.log(`coupon code: ${couponCode}`)
