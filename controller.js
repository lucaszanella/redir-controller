const express     = require('express')
const bodyParser  = require('body-parser')
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
import redir, {shortStrng} from './redir';

app.use(express.urlencoded());
const token = tokenFile.token;
var   redirections = new Map();

if (token.length()==0)
	throw Error('Token is empty, change token.js file');
else if (token.length() <= 12)
	throw Error('Token is too small and can be bruteforced. Make it random and longer than 12 characters');

//TODO: Be 100% sure that these regex really match only IP and ports, nothing more
ipRegex   = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
portRegex = /^\d{1,5}$/;

id = (sourceIp, sourcePort, destinationIp, destinationPort) => sourceIp + ':' + sourcePort + '-' + destinationIp + ':' + destinationPort;

redirect = (req, res) => {
	const sourceIp         = req.body.sourceIp,
	const sourcePort       = req.body.sourcePort,
	const destinationIp    = req.body.destinationIp,
    const destinationPort  = req.body.destinationPort;
    const _token           = req.body.token;

	if (token != _token) //Authentication
		return;
	if (!ipRegex.test(sourceIp) || !ipRegex.test(destinationIp) || !portRegex.test(sourcePort) || !portRegex.test(destinationPort)) //Injection prevention
		return;
	//if (socatProcesses.has())
	//socatProcess.kill();
	//socatProcess = exec(`socat tcp-listen:${sourcePort},bind=${sourceIp},reuseaddr,fork tcp:${destinationIp}:${destinationPort}`);

	res.send(`Started socat, redirecting tcp traffic from ${sourceIp}:${sourcePort} to ${destinationIp}:${destinationPort}`)
}

app.get('/socat', redirect) 

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8442);
