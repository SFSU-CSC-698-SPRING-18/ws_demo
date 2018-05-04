const sha256 = require('js-sha256');

class Block {
	constructor(data, previousHash) {
		this.data = data;
		this.previousHash = previousHash;
		this.timeStamp = Date.now();
		this.nonce = 0;
		this.hash = this.generateHash();
	}
	generateHash() {
		return sha256(this.previousHash + this.timeStamp + this.data + this.nonce);
	}
	getMineData() {
		return this.previousHash + this.timeStamp + this.data;
	}
	mine(difficulty) {
		const target = new Array(difficulty + 1).join('0'); // 0000
		while (this.hash.substring(0, difficulty) !== target) {
			this.nonce++; // keep trying different nonce until you get a hit
			this.hash = this.generateHash();
		}
	}
	static loadBlock(blockData) {
		const block = new Block('', '');
		block.data = blockData.data;
		block.previousHash = blockData.previousHash;
		block.timeStamp = blockData.timeStamp;
		block.nonce = blockData.nonce;
		block.hash = blockData.hash;
		return block;
	}
}

module.exports = Block;
