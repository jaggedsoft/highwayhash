'use strict';

const assert = require('assert');
const long = require('long');
const highwayhash = require('../index');

const input = Buffer.from('The quick brown fox jumped over the lazy sleeping dog');
const key = Buffer.from([
  0x55, 0xce, 0x85, 0x31, 0x06, 0x5e, 0xdc, 0x68,
  0x0b, 0x46, 0x14, 0xb6, 0x0c, 0xfe, 0x80, 0xcc,
  0x7d, 0xcf, 0x89, 0xe5, 0x83, 0xfe, 0x9a, 0xae,
  0x1c, 0x8b, 0xee, 0xeb, 0x3e, 0xe3, 0x1d, 0x1d
]);
const expectedHashUInt32Low = 1700611305;
const expectedHashUInt32High = 2515248088;

// asBuffer
const hashAsBuffer = highwayhash.asBuffer(key, input);
assert.strictEqual(true, Buffer.isBuffer(hashAsBuffer));
assert.strictEqual(expectedHashUInt32Low, hashAsBuffer.readUInt32LE(0));
assert.strictEqual(expectedHashUInt32High, hashAsBuffer.readUInt32LE(4));

// asString
const hashAsString = highwayhash.asString(key, input);
assert.strictEqual('string', typeof hashAsString);
const hashAsLong = long.fromString(hashAsString, true);
assert.strictEqual(expectedHashUInt32Low, hashAsLong.getLowBitsUnsigned());
assert.strictEqual(expectedHashUInt32High, hashAsLong.getHighBitsUnsigned());

// asHexString
const hashAsHexString = highwayhash.asHexString(key, input);
assert.strictEqual('string', typeof hashAsHexString);
assert.strictEqual(hashAsBuffer.toString('hex'), hashAsHexString);

// asUInt32Low
const hashAsUInt32Low = highwayhash.asUInt32Low(key, input);
assert.strictEqual('number', typeof hashAsUInt32Low);
assert.strictEqual(expectedHashUInt32Low, hashAsUInt32Low);

// asUInt32High
const hashAsUInt32High = highwayhash.asUInt32High(key, input);
assert.strictEqual('number', typeof hashAsUInt32High);
assert.strictEqual(expectedHashUInt32High, hashAsUInt32High);

// Invalid parameters
assert.throws(function () {
  highwayhash();
});
assert.throws(function () {
  highwayhash(1);
});
assert.throws(function () {
  highwayhash(1, 1);
});
assert.throws(function () {
  highwayhash(input, key);
});
assert.throws(function () {
  highwayhash(key, 1);
});
assert.throws(function () {
  highwayhash('str', input);
});
assert.throws(function () {
  highwayhash(key, 'str');
});

const hashesAsString = [hashAsString];
for (let i = 0; i < input.length; i++) {
  const modInput = Buffer.from(input);
  modInput[i] = ~modInput[i];
  const modHashAsString = highwayhash.asString(key, modInput);
  assert.strictEqual(true, hashesAsString.indexOf(modHashAsString) === -1);
  hashesAsString.push(modHashAsString);
}
