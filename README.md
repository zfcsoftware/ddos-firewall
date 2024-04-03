<br />
<p align="center">
<h3 align="center">DDOS FIREWALL</h3>

<p align="center">
    This project is designed to help you prevent DDOS attacks. The logic of the project is to return a very small page
    resource to requests that do not meet the appropriate conditions. Attacks sent to an HTML source that is small in
    size and does not make database queries will largely not work.
</p>
</p>


<p align="center">
<h3 align="center">Demo</h3>
<p align="center">
    <a href="https://ddos-firewall-demo.zfc.com.tr/" target="_blank">LIVE DEMO (VERCEL)</a> |
    <a href="https://github.com/zfcsoftware/ddos-firewall/tree/test" target="_blank">LIVE DEMO SOURCE CODE</a> | <a href="https://www.youtube.com/watch?v=oTXEEwluc5c&t=4s&ab_channel=ZFC" target="_blank">LIVE ATTACK TEST</a>
</p>
</p>

## Recommendations and Requirements

- This library may not work efficiently in environments without Cloudflare. For this reason, you should definitely pass traffic through Cloudflare and enable proxy mode.
- Using a reverse proxy service like Nginx is not recommended. In case of an attack, the traffic will first go through Nginx, so the attack may shut down your server before it reaches your project. It is recommended to run the project on port 80 and mirror your site as in the example in the test branch of the project.
- For Cloudflare Turnstile Captcha, you need to change the information you receive with the `setConfig` function later. Even though we use Turnstile Captcha, we perform many checks in the background. Turnstile is only added for additional precaution.
- `cookie-parser` The library needs to be used.


 ![Contributors](https://img.shields.io/github/contributors/zfcsoftware/ddos-firewall?color=dark-green) ![Forks](https://img.shields.io/github/forks/zfcsoftware/ddos-firewall?style=social) ![Stargazers](https://img.shields.io/github/stars/zfcsoftware/ddos-firewall?style=social) ![Issues](https://img.shields.io/github/issues/zfcsoftware/ddos-firewall) ![License](https://img.shields.io/github/license/zfcsoftware/ddos-firewall) 


## Install

This library was a middleware available with Express.js. You can install and use it as follows.

```bash
npm install ddos-firewall
```
```js
const { checkReq, setConfig } = require('ddos-firewall')
app.use(checkReq)
```

### Usage
```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { checkReq, setConfig, getConfig } = require('ddos-firewall')
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


app.use(checkReq)

setConfig({
    protect: true,
    // turnstile_public_key: '<cloudflare-turnstile-site-key>',
    // turnstile_private_key: '<cloudflare-turnstile-secret-key>',
    // waf_private_key: 'zfc_ddos_waf',
    session_active_time: 1000 * 60 * 60 * 24, // Mili seconds
    skip_country: [],
    skip_ip: []
})


app.use(createProxyMiddleware({ target: 'https://www.google.com', changeOrigin: true }));
var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server is running on port ' + port)
});
```
In this example incoming requests are filtered and google.com is reflected for those that pass the protection. You can find this example in the test brach. you can add an additional server layer in between and filter the requests and then reflect the ip or a link.

`setConfig` The following variables can be passed to the function

You can change all of the following variables at any time using the `setConfig` function. By creating an api, you can manually activate it when an attack comes and manually stop it when the attack is over.


#### Variables

`protect` Allows you to specify whether protection is active or not. If true, waf is activated. If false is sent, no one will receive waf.

`turnstile_public_key` You must send the Site Key you received from Cloudflare Turnstile settings.

`turnstile_private_key` You must send the Secret Key you received from Cloudflare Turnstile settings.

`session_active_time` You must send the number of milliseconds in milliseconds how long a user's session will remain active after passing the captcha.

`skip_country` It checks the country location of the ip address and the WAF screen does not come to the countries you send. You should send 2-character country codes like ["TR"] in array format. If you are not using cloudflare, it queries with a local library. It is recommended to use Cloudflare. 

`skip_ip` It does not display waf to ip addresses in the array. 

## Cloudflare Settings
No settings are required to use the library, but it is recommended to do the following to filter DDOS attacks to a large extent.
(The = sign indicates that the value of that setting should be the value opposite the = sign.)

- Menu > Security > DDoS > Deploy a DDoS override > Override name (Required) = test > Ruleset action (Required) = Block > Ruleset sensitivity (Required) = High > Save
- Menu > Security > Waf > Create rule > Rule name (required) = block > Field = Threat Score > Operator = greater than > Value = 3 > Choose action = Block > Deploy 
(cf.threat_score gt 2)
- Menu > Security > Waf > Create rule > Rule name (required) = waf > Field = Threat Score > Operator = greater than > Value = 0 > Choose action = JS Challenge > Deploy 
(cf.threat_score gt 0)
- Menu > Overview > Under Attack Mode > I'm Under Attack!

When you are under attack and you make these adjustments, you will largely prevent the attack. If you include this library, the attack will probably not work.
## Support Us

This library is completely open source and is constantly being updated. Please star this repo to keep these updates coming. Starring the repo will support us to improve it.

## License

Distributed under the MIT License. See [LICENSE](https://github.com/zfcsoftware/ddos-firewall/blob/main/LICENSE.md) for more information.