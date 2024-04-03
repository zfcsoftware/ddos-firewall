const general = require('./module/general.js');
var jwt = require('jsonwebtoken');

var project_config = {
    protect: true,
    waf_private_key: general.randomHash(50),
    turnstile_public_key: "3x00000000000000000000FF",
    turnstile_private_key: "1x0000000000000000000000000000000AA",
    session_active_time: 1000 * 60 * 60 * 24,
    skip_country: [],
    skip_ip: []
}
console.log('DDOS Firewall Config: ', project_config);
const setConfig = (config) => {
    project_config = {
        ...project_config,
        ...config
    }
    console.log('DDOS Firewall Config: ', project_config);
    return true;
}
const getConfig = () => {
    return project_config
}


const waf = (res) => {
    return res.status(403).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>One Moment Please...</title><link href="https://e7.pngegg.com/pngimages/115/529/png-clipart-denial-of-service-attack-computer-icons-ddos-mitigation-anti-computer-network-cdr-thumbnail.png" rel="icon" type="image/x-icon"></head><body><script src="https://cdnjs.cloudflare.com/ajax/libs/devtools-detector/2.0.16/devtools-detector.js" integrity="sha512-3lXCTuKilhgjrsncB/3VJ1udp8qIDpaE8hfdiEVQepRBE/n2xjZnxx5vSyuayJKtLp3m8U0MSGInzFdH8ClkGQ==" crossorigin="anonymous" referrerpolicy="no-referrer" onerror='window.location.href="https://innovationnorway.github.io/cloudflare-error-pages/waf_block.html"'></script><script src="https://cdn.jsdelivr.net/npm/ddos-firewall@1.0.2/src/waf/cdn.js" onerror='window.location.href="https://innovationnorway.github.io/cloudflare-error-pages/waf_block.html"'></script><script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_turnstileCb" onerror='window.location.href="https://innovationnorway.github.io/cloudflare-error-pages/waf_block.html"' defer="defer"></script></body></html>`)
}


const checkSessionToken = async (req, res, next) => {
    try {
        var user_ip = general.getIP(req)
        var user_ip_country = await general.ipCountry(req)
        if (project_config.skip_country.length > 0) {
            if (project_config.skip_country.find(x => String(x).toUpperCase() === String(user_ip_country).toUpperCase())) {
                return next()
            }
        }

        if (project_config.skip_ip.length > 0) {
            if (project_config.skip_ip.find(x => x === user_ip)) {
                return next()
            }
        }

        var data = req.cookies
        if (!data || !data["zfc_ddos_waf_session"]) {
            return waf(res)
        }
        var session = data["zfc_ddos_waf_session"]
        var decoded = jwt.verify(session, project_config.waf_private_key);


        if (!decoded || !decoded.ip || !decoded.expire) {
            return waf(res)
        }
        if (decoded.ip != user_ip || decoded.expire < Date.now() || !decoded.agent || decoded.agent !== req.headers['user-agent']) {
            return waf(res)
        }
        return next()
    } catch (err) {
        // console.log(err);
        return waf(res)
    }
}


const createSession = async (req, res, next) => {
    try {
        var data = req.cookies
        if (!data || !data["zfc_session"]) {
            return waf(res)
        }
        var session = data["zfc_session"]
        session = 'ey' + session
        var buff = Buffer.from(session, 'base64');
        buff = JSON.parse(buff)
        if (!buff || !buff.p2 || !buff.t) {
            return waf(res)
        }
        var t_rep = String(buff.t).replace(/[^a-zA-Z0-9]/g, '')
        if (t_rep != buff.p2) {
            return waf(res)
        }
        var check_layer = await general.checkTurnstile(buff.t, project_config)
        if (check_layer !== true) {
            return waf(res)
        }
        var user_ip = general.getIP(req)
        var user_ip_country = await general.ipCountry(req)

        var skip_data = {
            created: Date.now(),
            agent: req.headers['user-agent'],
            ip: user_ip,
            country: user_ip_country,
            expire: Date.now() + Number(project_config.session_active_time),
            session_token: general.sessionToken(req)
        }
        var ck = jwt.sign(skip_data, project_config.waf_private_key, {
            expiresIn: (Number(project_config.session_active_time) / 1000),
        });
        res.cookie('zfc_ddos_waf_session', ck, { httpOnly: true, expires: new Date(skip_data.expire), secure: true })
        res.status(200).send()
    } catch (e) {
        // console.log(e.message)
        return waf(res)
    }
}


const checkReq = (req, res, next) => {
    try {
        if (project_config.protect === false) {
            return next()
        }
        var path = req.path
        if (path.indexOf("zfc-key") > -1) {
            return res.status(200).json({
                key: project_config.turnstile_public_key
            })
        }

        if (path.indexOf("zfc-ping") > -1) {
            return createSession(req, res, next)
        }
        return checkSessionToken(req, res, next)
    } catch (e) {
        // console.log(e)
        return waf(res)
    }
}

module.exports = {
    checkReq,
    setConfig,
    getConfig,
    checkSessionToken,
    createSession,
    waf
}