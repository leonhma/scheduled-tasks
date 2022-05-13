import pptr from 'puppeteer';


const browser = await pptr.launch({ args: ['--no-sandbox'] });
const context = browser.defaultBrowserContext();
await context.overridePermissions('https://putput.net/', ['clipboard-read'])

const hdfilme = await browser.newPage();
const putput = await browser.newPage();

await putput.goto('https://putput.net/lustig', {'referrer': 'https://www.google.com/'});
await putput.evaluate(_ => {
  window.scrollIntoViewIfNeeded('article[data-key="9"]')
});
await putput.waitForTimeout(200);
await putput.click('#core-view > div > div.pp-section-list-container > div.gift-box > div > div > div.v-responsive__content')

await Promise.all(putput.waitForTimeout(120000),
                  async () => {
                      await hdfilme.goto('https://hdfilme.tv/login/');
                      await hdfilme.type('#email', process.env.HDFILME_USER_EMAIL);
                      await hdfilme.type('#password', process.env.HDFILME_USER_PWD);
                      await hdfilme.click('button[type=submit]')
                      await hdfilme.waitForNavigation({ waitUntil: 'networkidle0' })
                  })

await putput.click('#core-view > div > div.pp-section-list-container > div.gift-box > div > div.gift-box-body > div > div.gift-box-types > div:nth-child(2) > div.v-image.v-responsive.theme--light > div.v-responsive__content')
await putput.waitForTimeout(200)
await putput.click('input[value="hdfilme.tv"]+div.v-input--selection-controls__ripple')
await putput.waitForTimeout(200)
await putput.click('button.gift-box-choose')
await putput.waitForTimeout(200);
await putput.click('input#coupon-code')
await putput.waitForTimeout(200);
const couponCode = await page.evaluate(`(async () => await navigator.clipboard.readText())()`)

await hdfilme.goto('https://hdfilme.tv/submit-coupon/')
await hdfilme.type('input#coupon_code', couponCode)
await hdfilme.click('button[type=submit]')
await hdfilme.waitForTimeout(2000)

