const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');

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
	console.log(`broadcasting ${line}`);
	broadcast(line);
});	

server.on('connection', (ws) => {
	ws.on('message', (message) => {
		server.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
		console.log('received: %s', message);
	});
	ws.send('something');
	console.log('client connected');
});

console.log(`Listening at port ${packageData.port}`);