module.exports = {
    apps: [{
        name: 'firewall',
        script: 'index.js',
        instances: 'max',
        exec_mode: 'cluster',
        interpreter: "bun",
        error_file: '/dev/null',
        out_file: '/dev/null',
        log_file: '/dev/null'
    }]
}