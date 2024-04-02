# General Information
- Cloudflare usage is important. It works even if it is not used, but it gives stable results when Cloudflare is used.
- It is recommended to use the ddos-firewall Library with Cloudflare settings from the README.md file.
- Having the traffic go through this middleware layer before going through services like ngnix allows the library to work more efficiently. The recommended use is to run this application from port 80 of a server and mirror your site. If you type your server ip address or domain in the target variable in the createProxyMiddleware layer in the index.js file, it will mirror your site. 
- It is mandatory to include the cookie-parser Library in the project.

# Installation and Testing
```bash
git clone -b test https://github.com/zfcsoftware/ddos-firewall.git
cd ddos-firewall
npm install
node index
```

Run these commands and you will be able to access the project at http://localhost:3000.
