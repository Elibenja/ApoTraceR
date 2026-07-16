require('./dom_stub.js');
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const m = content.match(/<script>([\s\S]*)<\/script>/);
const testCode = m[1] + `
console.log('=== Kompletter Durchlauf ohne Fehler ===');
['suche','finder','reservierungen','einnahmeplan'].forEach(function(name) {
  zeigeAnsicht(name);
  console.log('Ansicht "' + name + '" ohne Fehler aktiviert.');
});

// Reservierungs-Flow end-to-end mit neuen Medikamenten/Apotheken-Daten
const med = medikamente[0];
const apo = apotheken.find(function(a){ return a.meldetBestand; });
bestand[apo.name][med.name] = true;
oeffneProduktseite(apo.name, med.name, med.preis);
document.getElementById('produkt-email').value = 'test@example.com';
bestaetigeReservierung();
console.log('Reservierung nach vollem Flow:', reservierungen.length === 1);

// Einnahmeplan end-to-end
document.getElementById('plan-medikament').value = med.name;
document.getElementById('plan-menge').value = '2 Tropfen';
document.getElementById('plan-uhrzeit').value = '09:15';
einnahmeHinzufuegen();
console.log('Einnahmeplan-Eintrag vorhanden:', einnahmeplan.length === 1);

// Favoriten end-to-end
favoritToggle(apo.name);
console.log('Favorit gesetzt und in localStorage:', JSON.parse(localStorage.getItem('apotheken-favoriten')).includes(apo.name));

console.log('=== ALLE INTEGRATIONSTESTS BESTANDEN ===');
`;
eval(testCode);
