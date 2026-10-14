// Usage: node tests/filter.test.cjs <extension folder>
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = process.argv[2];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir,'words.js'),'utf8') + fs.readFileSync(path.join(dir,'filter.js'),'utf8') + ';this.QP=QP;this.QP_TIERS=QP_TIERS;this.QP_DEFAULT_ALLOW=QP_DEFAULT_ALLOW;', ctx);
const {QP, QP_TIERS, QP_DEFAULT_ALLOW} = ctx;
const m = QP.buildMatcher({}, QP_TIERS, QP_DEFAULT_ALLOW);
const hits = t => QP.findMatches(t, m).map(h => h.text);
let fail = 0;
function eq(t, exp){ const got = hits(t); const ok = JSON.stringify(got)===JSON.stringify(exp); if(!ok){fail++;} console.log(ok?'PASS':'FAIL', JSON.stringify(t), '->', JSON.stringify(got)); }
eq('Damn it, what the hell happened?', ['Damn','hell']);
eq('Hello shell, we assess the class of Dickens.', []);
eq('That bullshit was shitty. Fuckin’ unbelievable!', ['bullshit','shitty','Fuckin’']);
eq('The motherfucker left, the asshole.', ['motherfucker','asshole']);
eq('Scunthorpe has a cocktail bar and a cockpit.', []);
eq('He was pissed and cursed: goddamn!', ['pissed','goddamn']);
eq('Oh my god, she said.', []);
eq('The cocky man pricked his finger and cocked the gun; they were dickering.', []);
eq('A half-assed, crappy job. He crapped out and was pissing mad.', ['assed','crappy','crapped','pissing']); // religious tier off by default
const m2 = QP.buildMatcher({tiers:{religious:true}, customBlock:['frak'], customAllow:['dick']}, QP_TIERS, QP_DEFAULT_ALLOW);
const h2 = t => QP.findMatches(t, m2).map(h=>h.text);
const r = h2('Oh  my God, Dick yelled. Frakking toasters!'); console.log(JSON.stringify(r)); if (JSON.stringify(r)!==JSON.stringify(['Oh  my God','Frakking'])) fail++;
const m3 = QP.buildMatcher({tiers:{mild:false,moderate:false,strong:false,religious:false}}, QP_TIERS, QP_DEFAULT_ALLOW);
console.log('all off ->', m3); if (m3!==null) fail++;
console.log(fail ? fail+' FAILED' : 'ALL PASS'); process.exit(fail?1:0);
