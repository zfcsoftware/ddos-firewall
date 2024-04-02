<h1 align="center">DDOS FIREWALL</h1>
<p>This project is designed to help you prevent DDOS attacks. The logic of the project is to return a very small page resource to requests that do not meet the appropriate conditions.</p>
<p>Attacks sent to an html source that is small in size and does not make database queries will largely not work.</p>

<h2 align="center">Demo</h2>

<p align="center"><a href="https://ddos-firewall-demo.zfc.com.tr/" target="_blank">LIVE DEMO</a> | 
<a href="https://github.com/zfcsoftware/ddos-firewall/tree/test" target="_blank">LIVE DEMO SOURCE CODE</a></p>

<p align="center"><img src="https://github.com/zfcsoftware/ddos-protection/assets/123484092/2bbb692b-c56f-4c7c-9a0e-d6c31a6ec292" /></p>

<h2 align="center">Recommendations and Requirements</h2>
<ul>
    <li>This library may not work efficiently in environments without Cloudflare. For this reason, you should definitely pass traffic through Cloudflare and enable proxy mode.</li>
    <li>Using a reverse proxy service like ngnix is not recommended. In case of an attack, the traffic will first go through ngnix, so the attack may shut down your server before it reaches your project. It is recommended to run the project on port 80 and mirror your site as in the example in the test branch of the project.</li>
    <li>For Cloudflare Turnstile Captcha, you need to change the information you receive with the setConfig function later. Even though we use Turnstile Captcha, we perform many checks in the background. Turnstile is only added for additional precaution.</li>
    <li><b>cookie-parser</b> The library needs to be used.</li>
</ul>

<h2 align="center">Install</h2>
<p>This library was a middleware available with expressjs. You can install and use it as follows.</p>
<pre><code class="language-bash">
npm install ddos-firewall
</code></pre>

<pre><code class="language-js">
const { checkReq, setConfig } = require('ddos-firewall')
app.use(checkReq)
</code></pre>

<h2 align="center">Use Cases</h2>
```js
    const express = require('express');
    const { createProxyMiddleware } = require('http-proxy-middleware');
    const { checkReq, setConfig } = require('ddos-firewall')
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
        skip_ip: []****
    })


    app.use(createProxyMiddleware({ target: 'https://www.google.com', changeOrigin: true }));
    var port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log('Server is running on port ' + port)
    });
```

<p></p>
<p align="center"></p>
<h2></h2>
<h2 align="center"></h2>
<a href="" target="_blank"></a>
<li></li>