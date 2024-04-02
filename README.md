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
    <a href="https://github.com/zfcsoftware/ddos-firewall/tree/test" target="_blank">LIVE DEMO SOURCE CODE</a>
</p>
<p align="center">
   <img src="https://github.com/zfcsoftware/ddos-protection/assets/123484092/2bbb692b-c56f-4c7c-9a0e-d6c31a6ec292"></img>
</p>
</p>

## Recommendations and Requirements

- This library may not work efficiently in environments without Cloudflare. For this reason, you should definitely pass traffic through Cloudflare and enable proxy mode.
- Using a reverse proxy service like Nginx is not recommended. In case of an attack, the traffic will first go through Nginx, so the attack may shut down your server before it reaches your project. It is recommended to run the project on port 80 and mirror your site as in the example in the test branch of the project.
- For Cloudflare Turnstile Captcha, you need to change the information you receive with the `setConfig` function later. Even though we use Turnstile Captcha, we perform many checks in the background. Turnstile is only added for additional precaution.
- `cookie-parser` The library needs to be used.

## Install

This library was a middleware available with Express.js. You can install and use it as follows.

```bash
npm install ddos-firewall
```