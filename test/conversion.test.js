import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseAmount,convert} from '../public/conversion.js';
test('accept decimal comma and zero; reject malformed and negative amounts',()=>{
 assert.equal(parseAmount('100,50'),100.5);assert.equal(parseAmount('0'),0);
 for(const value of ['','-1','1abc','Infinity','1,2,3','1000000000001'])assert.throws(()=>parseAmount(value));
});
test('cross rates and reverse conversion preserve amount',()=>{
 const rates={USD:1,EUR:0.8,RUB:90};assert.equal(convert(100,'EUR','RUB',rates),11250);
 assert.equal(convert(11250,'RUB','EUR',rates),100);assert.equal(convert(10,'USD','USD',null),10);
 assert.throws(()=>convert(10,'USD','JPY',rates));
});
