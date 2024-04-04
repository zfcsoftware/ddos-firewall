module.exports = {
    apps: [{
        name: 'firewall',
        script: 'index.js',
        instances: '10',
        exec_mode: 'cluster',
    }]
}