const Block = require('./Block.js');

class BlockChain {
	constructor(difficulty = 1) {
		this.blockChain = [];
		this.difficulty = difficulty;
		this.target = new Array(difficulty + 1).join('0');
	}
	addBlock(block) {
		this.blockChain.push(block);
	}
	getLastHash() {
        let lastHash = '0'; // starting hash
        if (this.blockChain.length > 0) {
            lastHash = this.blockChain[this.blockChain.length - 1].hash;
        }
        return lastHash;
    }
	validateChain() {
		// make sure there are at least 2 for this to work
		// todo: catch all corner cases
		let currentBlock;
		let previousBlock;
		for (let i = 1; i < this.blockChain.length; i++) {
			currentBlock = this.blockChain[i];
			previousBlock = this.blockChain[i - 1];
			if (currentBlock.hash !== currentBlock.generateHash()) {
				console.log(currentBlock.hash);
				console.log(currentBlock.generateHash());
				console.log('current hash is wrong at block', i);
				return false;
			}

			if (previousBlock.hash !== currentBlock.previousHash) {
                console.log('last hash is wrong at block', i);
				return false;
			}

			if (currentBlock.hash.substring(0, this.difficulty) !== this.target) {
				console.log('block was not mined at', i);
				return false;
			}
		}
		return true;
	}
	getMessage() {
		if (this.blockChain.length > 0) {
			return this.blockChain[this.blockChain.length - 1].data;
		}
		return null;
	}
	static loadBlockChain(chainData) {
		const blockChain = new BlockChain(chainData.difficulty);
		blockChain.blockChain = chainData.blockChain.map(blockData => {
			return Block.loadBlock(blockData);
		});
		return blockChain;
	}
}

module.exports = BlockChain;
