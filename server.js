const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');
const ip = require('ip');

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
	broadcast(JSON.stringify({
		data: line,
		command: 'MESSAGE',
		ip: serverIp,
	}));
});	

server.on('connection', (ws) => {
	ws.on('message', (message) => {
		const messageData = JSON.parse(message);
		switch (messageData.command) {
			case 'OPEN':
				console.log(`${messageData.ip} has connected`);
				break;
			case 'MESSAGE':
				console.log(`${messageData.ip} sent :  ${messageData.data}`);
				server.clients.forEach((client) => {
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						client.send(message);
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