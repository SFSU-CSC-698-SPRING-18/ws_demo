const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');
const BlockChain = require('./BlockChain.js');
const ip = require('ip');

const clientIp = ip.address();

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
console.log(`client ip is ${clientIp}`);
const client = new WebSocket(address);

client.on('open', (ws) => {
	console.log('connected');
	lineInterface.on('line', (line) => {
		client.send(JSON.stringify({
			data: line,
			command: 'MESSAGE',
			ip: clientIp,
		}));
	});

	client.send(JSON.stringify({
		command: 'OPEN',
		ip: clientIp,
	}));
});

client.on('message', (message) => {
	const messageData = JSON.parse(message);
	const blockChain = BlockChain.loadBlockChain(messageData);
	console.log(blockChain);
	console.log('Valid chain :', blockChain.validateChain());
	console.log('Message is ', blockChain.getMessage());
});

client.on('close', () => {
	console.log('connection closed');
});
