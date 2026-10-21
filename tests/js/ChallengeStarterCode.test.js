import test from 'node:test';
import assert from 'node:assert/strict';
import { getChallengeStarterCode as starter } from '../../resources/js/game/ChallengeStarterCode.js';

test('evaluations never provide scaffolds even at coding markers', () => {
    for (const level of [1,2,3]) for (const step of [0,1,2,3,4,5]) {
        assert.equal(starter(level,4,{step,atLocation:true,atPump:true,atFire:true,atObjective:true}),null);
    }
});
test('training scaffolds appear at coding locations, with blanks for player answers', () => {
    for (const level of [1,2,3]) assert.equal(starter(level,1,{}),null);
    for (const challenge of [1,2,3]) {
        assert.match(starter(1,challenge,{atLocation:true}).code,/\.\.\./);
        assert.match(starter(2,challenge,{atFire:true}).code,/\.\.\./);
    }
    for (const [challenge,steps] of [[1,[1,2,3,4]],[2,[1,2,3,4]],[3,[1,3,4]]]) {
        for (const step of steps) assert.match(starter(3,challenge,{step,atObjective:true}).code,/\.\.\./);
    }
});
test('pump and fire or successive decisions have distinct keys', () => {
    assert.notEqual(starter(2,1,{atPump:true}).key,starter(2,1,{atFire:true}).key);
    assert.notEqual(starter(3,1,{step:3,atObjective:true}).key,starter(3,1,{step:4,atObjective:true}).key);
    assert.equal(starter(2,2,{atFire:true,fireOut:true}),null);
    assert.equal(starter(3,1,{step:5,atObjective:true}),null);
});
