const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');
const ip = require('ip');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

const blockChain = new BlockChain(packageData.difficulty);
const serverIp = ip.address();
let isMining = false;

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
    const messageString = `${serverIp} sent :  ${line}`;
    const block = new Block(messageString, blockChain.getLastHash());
    console.log(block);
    isMining = true;
    broadcast(JSON.stringify(block));
});	

server.on('connection', (ws) => {
	ws.on('message', (message) => {
		const messageData = JSON.parse(message);
		switch (messageData.command) {
			case 'OPEN':
				console.log(`${messageData.ip} has connected`);
				break;
			case 'MINE_COMPLETE':
				// test block
                if (isMining) {
                    const block = Block.loadBlock(messageData.block);
                    console.log(`${messageData.ip} wins`);
                    blockChain.addBlock(block);
                    console.log(blockChain);
                    isMining = false;
                }
				break;
			default:
			console.log('unknown command');
		}
	});
	console.log('client connected');
});

console.log(`Listening at  ws:\/\/${serverIp}:${packageData.port}`);