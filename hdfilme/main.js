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
    const { code } = await page.evaluate(async (couponToken) => {
        const res = await fetch("https://api.putput.net/api/shared/claim-coupon",
            {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                'body': JSON.stringify({ 'couponToken': couponToken })
            });
        console.log(res);
        return res.json();
    }, couponToken);
    browser.close()
    return code;
}

console.log(await generateCoupon())
