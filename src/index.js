const general = require('./module/general.js');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

var project_config = {
    protect: true,
    waf_private_key: general.randomHash(50),
    turnstile_public_key: "3x00000000000000000000FF",
    turnstile_private_key: "1x0000000000000000000000000000000AA",
    session_active_time: 1000 * 60 * 60 * 24,
    skip_country: [],
    skip_ip: []
}
console.log('Config: ', project_config);
const setConfig = (config) => {
    project_config = {
        ...project_config,
        ...config
    }
    return true;
}
const getConfig = () => {
    return project_config
}


const waf = (res) => {
    return res.status(403).sendFile(__dirname + '/waf/en.html');
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
            console.log('a1');
            return waf(res)
        }
        var session = data["zfc_ddos_waf_session"]
        var decoded = jwt.verify(session, project_config.waf_private_key);


        if (!decoded || !decoded.ip || !decoded.expire) {
            console.log('a2');
            return waf(res)
        }
        if (decoded.ip != user_ip || decoded.expire < Date.now() || !decoded.agent || decoded.agent !== req.headers['user-agent']) {
            console.log('a3');
            return waf(res)
        }
        console.log('next');

        return next()

    } catch (err) {
        console.log(err);
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
        console.log('set cookie');
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