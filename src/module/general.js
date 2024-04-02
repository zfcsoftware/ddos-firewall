const axios = require('axios');
const geoip = require('fast-geoip');

const checkTurnstile = async (token, project_config) => {
    try {
        const form = new FormData();
        form.append('secret', project_config.turnstile_private_key);
        form.append('response', token);
        var check = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', form, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
        }).then((response) => {
            if (response && response.data && response.data.success === true) {
                return true
            }
            return false
        }).catch((err) => {
            return false
        });
        if (check !== true) {
            return false
        }
        return true
    } catch (e) {
        console.log(e);
        return false
    }
}

const checkIPFormat = (user_ip) => {
    try {
        return !user_ip || user_ip === undefined || (String(user_ip).indexOf('.') <= -1 && String(user_ip).indexOf(':') <= -1)
    } catch (err) {
        return false
    }
}

const getIP = (req) => {
    try {
        var user_ip = req.headers['cf-connecting-ip']
        if (checkIPFormat(user_ip)) {
            user_ip = String(req.headers['x-forwarded-for']).split(',')[0]
        }
        if (checkIPFormat(user_ip)) {
            user_ip = req.connection.remoteAddress
        }
        if (checkIPFormat(user_ip)) {
            user_ip = req.ip
        }
        if (checkIPFormat(user_ip)) {
            return false
        }
        console.log(user_ip);
        return user_ip
    } catch (err) {
        return false
    }
}

const ipCountry = async (req) => {
    try {
        if (req.headers['cf-ipcountry']) {
            return req.headers['cf-ipcountry']
        }
        const geo = await geoip.lookup(getIP(req));
        return geo.country
    } catch (err) {
        return false
    }
}

function randomHash(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const sessionToken = (req) => {
    return req.headers['cf-ray'] || randomHash(20)
}

module.exports = {
    checkTurnstile,
    getIP,
    ipCountry,
    randomHash,
    sessionToken
}