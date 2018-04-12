const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');

const lineInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

let socket;

let host = 'localhost';
if (process.argv.length === 3) {
	host = process.argv[2];
}
const address = `ws:\/\/${host}:${packageData.port}`;
console.log(`connecting to ${address}`);
const client = new WebSocket(address);

client.on('open', (ws) => {
	console.log('connected');
	lineInterface.on('line', function(line){
		console.log(line);
		client.send(line);
	});
});

client.on('message', (message) => {
	console.log('received: %s', message);
});

client.on('close', () => {
	console.log('connection closed');
});
