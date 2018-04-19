const Block = require('../Block.js');

const block1 = new Block('My message', null);
const block2 = new Block('My next message', block1.hash);

console.log(block1);
console.log(block2);