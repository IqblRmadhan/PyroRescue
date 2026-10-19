import test from 'node:test';
import assert from 'node:assert/strict';
import { getLevel3Guidance } from '../../resources/js/game/Level3Guidance.js';
import { getPumpAnimationCycleCount } from '../../resources/js/game/Level2Challenges.js';
test('travel guidance does not give coding instructions before reaching the marker', () => {
 const travel = getLevel3Guidance(2, {step:1, atObjective:false});
 assert.match(travel.message,/Pergi/); assert.equal(travel.code,'');
 assert.doesNotMatch(travel.message,/isi_air|>=|semprot\(/);
 const arrived = getLevel3Guidance(2,{step:1,atObjective:true});
 assert.match(arrived.message,/Kamu sudah/); assert.match(arrived.code,/if isi_air/);
 assert.equal(arrived.analogy.rows[0].text,'Apakah air sama dengan atau lebih banyak dari kebutuhan?');
 assert.notEqual(travel.message,arrived.message);
});
test('water guidance distinguishes final amount from added water', () => {
 const guide=getLevel3Guidance(2,{step:2,atPump:true,water:3});
 assert.match(guide.message,/dari 3 menjadi 5 unit/); assert.match(guide.code,/isi_air = \.\.\./);
 assert.equal(guide.analogy.rows[2].text,'5, yaitu jumlah akhir di dalam tangki.');
 assert.equal(getPumpAnimationCycleCount(5,3),2);
 assert.equal(getPumpAnimationCycleCount(5,5),0);
 assert.equal(getPumpAnimationCycleCount(3,5),0);
});
test('rescue guidance explains if and else as an everyday safety decision',()=>{
 const guide=getLevel3Guidance(1,{step:4,atObjective:true});
 assert.match(guide.analogy.intro,/gerbang keselamatan/);
 assert.deepEqual(guide.analogy.rows.map((row)=>[row.label,row.text]),[
  ['Pertanyaan','Apakah api sudah padam?'],
  ['Jika YA (if)','Selamatkan bekantan.'],
  ['Jika TIDAK (else)','Mundur 1 petak.'],
 ]);
});
test('evaluation gives no scaffold',()=>{
 const guide=getLevel3Guidance(4,{step:1,atObjective:true});
 assert.equal(guide.code,''); assert.ok(guide.analogy);
 assert.match(guide.analogy.title,/Operasi/);
});
