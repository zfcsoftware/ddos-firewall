const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { checkReq, setConfig } = require('ddos-firewall')
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(checkReq)

setConfig({
    protect: process.env.protect || true,
    turnstile_public_key: (process.env.turnstile_public_key || '3x00000000000000000000FF'), // '<cloudflare-turnstile-site-key>'
    turnstile_private_key: (process.env.turnstile_private_key || '1x0000000000000000000000000000000AA'), //'<cloudflare-turnstile-secret-key>'
    waf_private_key: (process.env.waf_private_key || 'Hy0BGgcbHrkEHn0HBNC5NrsN7wkkciqnRvvlFUQ8bW0fymmCKw'), // you must change
    session_active_time: process.env.session_active_time || 86400000, // Mili seconds
    skip_country: process.env.skip_country || [],
    skip_ip: process.env.skip_ip || []
})


app.use(createProxyMiddleware({ target: (process.env.TARGET || 'https://www.google.com'), changeOrigin: true }));
var port = process.env.PORT || 80
app.listen(port, () => {
    console.log('Server is running on port ' + port)
});
