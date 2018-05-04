const sha256 = require('js-sha256');

// a-z
let availableItems = 26;
// max length 6 chars
let maxLength = 4;
// attack range
let attackRange = Math.pow(availableItems, maxLength);
let testPassword = 'dbcd';
let targetHash = sha256(testPassword);
console.log(`Total bruteforce combinations : ${attackRange}`);
console.log(`Attacking : ${testPassword} : ${targetHash}`);

// 36^2, 36^1, 36^0 ect
let splits = [];
for (let i = 0; i < maxLength; i++) {
    splits.push(Math.pow(availableItems, i));
}

let letterMapper;
let mappedNumber;
let basedIndex;
let mapped;
let hashed;
for (let i = 0; i < attackRange; i++) {
    // map our letter
    mappedNumber = i;
    letterMapper = [];
    for (let j = maxLength-1; j >=0; j--) {
        basedIndex = Math.floor(mappedNumber/splits[j]);
        letterMapper.push(String.fromCharCode(97 + basedIndex));
        mappedNumber = mappedNumber%splits[j];
    }
    mapped = letterMapper.join('');
    hashed = sha256(mapped);
    console.log(`${mapped} hashes to: ${hashed}`);
    if (targetHash === hashed) {
        console.log(`PASSWORD BROKEN : '${mapped}' Attempt number: ${i}`);
        break;
    }
}
