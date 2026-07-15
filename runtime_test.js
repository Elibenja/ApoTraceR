require('./dom_stub.js');
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const m = content.match(/<script>([\s\S]*)<\/script>/);
const testCode = m[1] + `
console.log('Script komplett ohne Fehler durchgelaufen.');
console.log('Anzahl Medikamente:', medikamente.length);
console.log('typeof inWarenkorb (sollte undefined sein):', typeof inWarenkorb);
zeigeAnsicht('suche');
zeigeAnsicht('finder');
zeigeAnsicht('reservierungen');
console.log('Alle drei verbleibenden Ansichten ohne Fehler gewechselt.');
`;
eval(testCode);
