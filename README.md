# General Information
- Can be used with Vercel, Google Cloud Run, vps or any hosting service. Recommended for use with Vercel. 
- If you use it with a vps, you should run the Docker image.
- Definitely recommended to be used with Cloudflare. Attacks can be prevented without Cloudflare, but with Cloudflare you can easily mitigate the attack and block it with WAF.
  
## Using with Docker

```bash
sudo docker run zfcsoftware/ddos-firewall \
-e PORT=80 \
-e TARGET=https://www.google.com \
-e protect=true \
-e turnstile_public_key=3x00000000000000000000FF \
-e turnstile_private_key=1x0000000000000000000000000000000AA \
-e waf_private_key=Hy0BGgcbHrkEHn0HBNC5NrsN7wkkciqnRvvlFUQ8bW0fymmCKw \
-e session_active_time=86400000 \
-e skip_country=[] \
-e skip_ip=[] \
```
`PORT` The default is 80.  If 80 is used, it is automatically linked to the domain when a record is added.
`TARGET` You must include a link to your site or server. Example for site: https://wmaster.net Example for server: http://188.132.139.10:80
`protect` Indicates the protection status. If true, waf is activated. Since it does not allow bots such as Google bots, it is recommended to turn it on as the attack comes.
`turnstile_public_key` You should create a turnstile project from your Cloudflare account and add the site key code. Not only Cloudflare control is done. We do many checks. This is an additional measure.
`turnstile_private_key` You should create a turnstile project from your Cloudflare account and add the secret key code. Not only Cloudflare control is done. We do many checks. This is an additional measure.
`waf_private_key` Used for JWT Encryption. It is strongly recommended to replace it.
`session_active_time` Specifies how many milliseconds WAF will be removed for users who pass WAF. 86400000 is 1 Day.
`skip_country` It can be entered as ["TR", "DE"]. WAF is not shown for the country codes you enter.
`skip_ip` ["188.132.139.61"] Format. WAF is not shown to these ip addresses.

# Installation and Testing
```bash
git clone -b test https://github.com/zfcsoftware/ddos-firewall.git
cd ddos-firewall
npm install
node index
```
