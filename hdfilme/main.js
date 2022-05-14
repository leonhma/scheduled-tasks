import { sign } from "jsonwebtoken";
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
        "duration_type": "2_day",
        "site_type": "HDFILME.TV",
        "iat": 1652518238,
        "jti": uuidv4(),
        "exp": 9999999999
    },
        'hoan_an_cac', { 'algorithm': 'HS256' });
    return await page.evaluate(_ => {
        fetch("https://api.putput.net/api/shared/claim-coupon",
            {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({ couponToken: couponToken })
            }).then(res => res.json())
    });
}

console.log(await generateCoupon())
