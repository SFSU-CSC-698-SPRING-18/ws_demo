const BlockChain = require('../BlockChain.js');

const blockChain = new BlockChain(3);
blockChain.addBlock('Hello');
blockChain.addBlock('How are you?');

console.log(blockChain);
console.log('Valid hash :', blockChain.validateChain());
// mess something up on purpose
console.log('Message was compromised');
blockChain.blockChain[1].data = 'hacker changed some data on the way';
console.log('Valid hash :', blockChain.validateChain());