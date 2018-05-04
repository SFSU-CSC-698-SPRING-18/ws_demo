const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const addon = require('./build/Release/addon');

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
const miner = new WebSocket(address);

miner.on('open', (ws) => {
	console.log('connected');
});

miner.on('message', (message) => {
	const messageData = JSON.parse(message);
	const block = Block.loadBlock(messageData);
    // block.mine(packageData.difficulty);
    console.log('minining', block.getMineData());
    const minedData = addon.mine(block.getMineData());
    block.nonce = minedData.nonce;
    block.hash = minedData.hash;
    console.log(block);
    miner.send(JSON.stringify({
        command: 'MINE_COMPLETE',
        ip: clientIp,
        block,
    }))
});

miner.on('close', () => {
	console.log('connection closed');
});
