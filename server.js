const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');
const ip = require('ip');
const BlockChain = require('./BlockChain.js');

const blockChain = new BlockChain(3);
const serverIp = ip.address();

const lineInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const server = new WebSocket.Server({ 
	port: packageData.port 
});

const broadcast = (data) => {
	server.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

lineInterface.on('line', (line) => {
	if (line === 'hack') {
		blockChain.blockChain[1].data = 'hack yo data';
		console.log(blockChain);
		console.log('Valid hash :', blockChain.validateChain());
	} else {
		const messageString = `${serverIp} sent :  ${line}`;
		blockChain.addBlock(messageString);
		console.log(blockChain);
		broadcast(JSON.stringify(blockChain));
	}
});	

server.on('connection', (ws) => {
	ws.on('message', (message) => {
		const messageData = JSON.parse(message);
		switch (messageData.command) {
			case 'OPEN':
				console.log(`${messageData.ip} has connected`);
				break;
			case 'MESSAGE':
				const messageString = `${messageData.ip} sent :  ${messageData.data}`;
				console.log(messageString);
				blockChain.addBlock(messageString);
				console.log(blockChain);
				server.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(blockChain));
					}
				});
				break;
			default:
			console.log('unknown command');
		}
	});
	console.log('client connected');
});

console.log(`Listening at  ws:\/\/${serverIp}:${packageData.port}`);