import { sign, decode } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import pptr from 'puppeteer';
import axios from 'axios';


const generateCoupon = async () => {
    // Launch headless Chrome.
    const browser = await pptr.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://putput.net/');
    const couponToken = sign({
        "sub": "8.8.8.8",
        "duration_type": "1_day",
        "site_type": "HDFILME.TV",
        "jti": uuidv4(),
        "exp": Math.floor(Date.now() / 1000) + (60 * 60)
    }, 'hoan_an_cac');
    console.log(couponToken)
    console.log(decode(couponToken))
    const code = await page.evaluate((couponToken) => {
        const req = new XMLHttpRequest();
        req.open('POST', 'https://api.putput.net/api/shared/claim-coupon',false)
        req.setRequestHeader('Content-Type', 'text/plain');
        req.setRequestHeader('Accept', 'application/json;text/plain;*/*');
        return req.send(JSON.stringify({ 'couponToken': couponToken }));
    }, couponToken);
    browser.close()
    return code;
}

const coupon = await generateCoupon()
console.log(`coupon: ${coupon} >`)
console.log(`${coupon.headers}, ${coupon.data}, ${coupon.status}`)
