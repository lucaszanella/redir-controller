const express     = require('express')
var bodyParser    = require('body-parser')
const fs          = require('fs');
const http        = require('http');
const https       = require('https');
const privateKey  = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const tokenFile   = require('./token.js');
const { exec }    = require('child_process');
const credentials = {key: privateKey, cert: certificate};
const express     = require('express');
const app         = express();
//app.use(bodyParser.json());
app.use(express.urlencoded());
var   socatProcess;
const token = tokenFile.token;

if (token.length()==0)
	throw Error('Token is empty, change token.js file');
else if (token.length() <= 12)
	throw Error('Token is too small and can be bruteforced. Make it random and longer than 12 characters');

listenOn: 8442;
//TODO: Verify is these regex reall match only IP, nothing more
ipRegex   = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
portRegex = /^\d{1,5}$/;

redirect = (req, res) => {
	const destinationIp    = req.body.destinationIp,
        const destinationPort  = req.body.destinationPort;
        const _token           = req.body.token;
	if (token != _token) //Authentication
		return;
	if (!ipRegex.test(destinationIp) || !portRegex.test(destinationPort)) //Injection prevention
		return;
	if (!ipRegex.test(listenOn))
		return;//this one is not really needed because it's passed by docker, not by nodejs, but there's no harm in doing this check, who knows...
	socatProcess.kill();
	socatProcess = exec(`socat tcp-listen:${listenOn},bind=0.0.0.0,reuseaddr,fork tcp:${destinationIp}:${destinationPort}`);
	res.send(`Started socat on docker's 0.0.0.0, redirecting tcp traffic from 0.0.0.0:${listenOn} to ${destinationIp}:${destinationPort}`)
}

app.get('/socat', redirect) 

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8442);
