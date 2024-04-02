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
    skip_ip: []
})


app.use(createProxyMiddleware({ target: 'https://www.google.com', changeOrigin: true }));
var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server is running on port ' + port)
});
