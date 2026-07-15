
    // ---- Modul 4: Daten der Medikamente (ein Array von Objekten) ----
    const medikamente = [
      { name: "Ibuprofen 400mg", beschreibung: "Schmerz- und Entzündungshemmer", preis: 4.95 },
      { name: "Paracetamol 500mg", beschreibung: "Schmerzmittel, fiebersenkend", preis: 3.50 },
      { name: "Aspirin 500mg", beschreibung: "Schmerzmittel, blutverdünnend", preis: 5.20 },
      { name: "Nasenspray Xylometazolin", beschreibung: "Abschwellend bei Schnupfen", preis: 2.99 },
      { name: "Hustensaft", beschreibung: "Lindert Husten und Reizhusten", preis: 6.80 },
      { name: "Vitamin C Brausetabletten", beschreibung: "Nahrungsergänzung", preis: 4.10 }
    ];

    // Zeigt eine Liste von Medikamenten im HTML an – inkl. Live-Verfügbarkeit im Umkreis
    function zeigeMedikamente(liste) {
      const container = document.getElementById('such-ergebnisse');
      container.innerHTML = ''; // vorherigen Inhalt leeren

      if (liste.length === 0) {
        container.innerHTML = '<p>Keine Treffer gefunden.</p>';
        return;
      }

      liste.forEach(function(med) {
        const karte = document.createElement('div');
        karte.className = 'card';
        karte.innerHTML =
          '<strong>' + med.name + '</strong><br>' +
          med.beschreibung + '<br>' +
          med.preis.toFixed(2) + ' €' +
          '<div class="bestand-liste">' + verfuegbarkeitImUmkreis(med) + '</div>';
        container.appendChild(karte);
      });
    }

    // Kernstück: für ein Medikament alle Apotheken durchgehen, nach Entfernung sortieren,
    // und den Live-Bestand jeder Apotheke für genau dieses Medikament anzeigen
    function verfuegbarkeitImUmkreis(med) {
      const sortiertNachEntfernung = apotheken.slice().sort(function(a, b) {
        return a.entfernungKm - b.entfernungKm;
      });

      const zeilen = sortiertNachEntfernung.map(function(apo) {
        const verfuegbar = bestand[apo.name][med.name];
        const punkt = verfuegbar ? '<span class="punkt-gruen">●</span>' : '<span class="punkt-rot">●</span>';
        const nachweis = vorWieLange(bestandZeit[apo.name][med.name]);

        // Modul 11: je nach Zustand einen Reservieren-Button, einen "Reserviert"-Hinweis
        // oder gar nichts (falls nicht vorrätig) anzeigen
        let aktion = '';
        if (!verfuegbar) {
          aktion = '';
        } else if (istReserviert(apo.name, med.name)) {
          aktion = ' <span style="color:#1a9e5e;">✓ Reserviert</span>';
        } else {
          aktion = ' <button class="action" onclick="oeffneProduktseite(\'' + apo.name + '\', \'' + med.name + '\', ' + med.preis + ')">Reservieren</button>';
        }

        return punkt + ' ' + apo.name + ' (' + apo.entfernungKm.toFixed(1) + ' km) – ' +
          (verfuegbar ? 'vorrätig' : 'nicht vorrätig') + ' <span class="nachweis">(' + nachweis + ')</span>' + aktion;
      });

      return '<strong>In der Nähe:</strong><br>' + zeilen.join('<br>');
    }

    // Merkt sich den aktuellen Suchbegriff, damit der Live-Ticker die Ansicht korrekt neu zeichnen kann
    let aktuellerSuchbegriff = '';

    function zeigeGefilterteMedikamente() {
      const treffer = medikamente.filter(function(med) {
        return med.name.toLowerCase().includes(aktuellerSuchbegriff);
      });
      zeigeMedikamente(treffer);
    }

    // Auf Tastatureingabe im Suchfeld reagieren
    document.getElementById('such-eingabe').addEventListener('input', function(e) {
      aktuellerSuchbegriff = e.target.value.toLowerCase();
      zeigeGefilterteMedikamente();
    });

    // ---- Modul 5: Daten der Apotheken ----
    // "entfernungKm" simuliert die Distanz zum Kunden (in echt: per GPS/Geolocation-API berechnet)
    const apotheken = [
      { name: "Stadt-Apotheke", adresse: "Hauptstraße 12", oeffnungszeiten: "8:00 - 19:00", notdienst: false, entfernungKm: 0.8 },
      { name: "Rathaus-Apotheke", adresse: "Marktplatz 3", oeffnungszeiten: "9:00 - 18:00", notdienst: true, entfernungKm: 1.4 },
      { name: "Löwen-Apotheke", adresse: "Bahnhofstraße 5", oeffnungszeiten: "8:00 - 20:00", notdienst: false, entfernungKm: 2.1 },
      { name: "Sonnen-Apotheke", adresse: "Gartenweg 8", oeffnungszeiten: "durchgehend", notdienst: true, entfernungKm: 3.6 }
    ];

    // ---- Modul 8: Bestand pro Apotheke/Medikament (verschachteltes Objekt) ----
    // bestand["Stadt-Apotheke"]["Ibuprofen 400mg"] = true/false
    const bestand = {};
    // ---- Modul 10: Zeitstempel der letzten Prüfung, für den Vertrauens-Nachweis ----
    // bestandZeit["Stadt-Apotheke"]["Ibuprofen 400mg"] = Zeitpunkt der letzten Prüfung
    const bestandZeit = {};
    apotheken.forEach(function(apo) {
      bestand[apo.name] = {};
      bestandZeit[apo.name] = {};
      medikamente.forEach(function(med) {
        bestand[apo.name][med.name] = Math.random() > 0.3; // Start: meist verfügbar
        bestandZeit[apo.name][med.name] = Date.now();
      });
    });

    // Wandelt einen Zeitstempel in einen lesbaren Text um: "gerade eben", "vor 12 Sek.", "vor 2 Min."
    function vorWieLange(zeitstempel) {
      const sekunden = Math.round((Date.now() - zeitstempel) / 1000);
      if (sekunden < 5) return 'gerade eben geprüft';
      if (sekunden < 60) return 'vor ' + sekunden + ' Sek. geprüft';
      const minuten = Math.round(sekunden / 60);
      return 'vor ' + minuten + ' Min. geprüft';
    }

    function zeigeApotheken(liste) {
      const container = document.getElementById('apotheken-ergebnisse');
      container.innerHTML = '';

      if (liste.length === 0) {
        container.innerHTML = '<p>Keine Apotheke gefunden.</p>';
        return;
      }

      liste.forEach(function(apo) {
        // Bestandsliste für diese Apotheke aus "bestand" zusammenbauen
        const bestandZeilen = medikamente.map(function(med) {
          const verfuegbar = bestand[apo.name][med.name];
          const punkt = verfuegbar
            ? '<span class="punkt-gruen">●</span>'
            : '<span class="punkt-rot">●</span>';
          const nachweis = vorWieLange(bestandZeit[apo.name][med.name]);
          return punkt + ' ' + med.name + ' <span class="nachweis">(' + nachweis + ')</span>';
        }).join('<br>');

        const karte = document.createElement('div');
        karte.className = 'card';
        karte.innerHTML =
          '<strong>' + apo.name + '</strong>' + (apo.notdienst ? ' 🟢 Notdienst' : '') + '<br>' +
          apo.adresse + '<br>' +
          'Öffnungszeiten: ' + apo.oeffnungszeiten +
          '<div class="bestand-liste">' + bestandZeilen + '</div>';
        container.appendChild(karte);
      });
    }

    // Merkt sich, ob der Notdienst-Filter gerade aktiv ist
    let nurNotdienstAktiv = false;

    function zeigeGefilterteApotheken() {
      zeigeApotheken(nurNotdienstAktiv ? apotheken.filter(function(apo) { return apo.notdienst; }) : apotheken);
    }

    document.getElementById('nur-notdienst').addEventListener('change', function(e) {
      nurNotdienstAktiv = e.target.checked;
      zeigeGefilterteApotheken();
    });

    zeigeGefilterteApotheken();

    // ---- Modul 8: Live-Ticker mit setInterval ----
    let tickerNachrichten = [];

    function aktualisiereBestand() {
      // Zufällige Apotheke und zufälliges Medikament auswählen
      const apoNamen = apotheken.map(function(a) { return a.name; });
      const zufallsApo = apoNamen[Math.floor(Math.random() * apoNamen.length)];
      const zufallsMed = medikamente[Math.floor(Math.random() * medikamente.length)];

      // Status umkehren (verfügbar <-> nicht verfügbar) und Zeitstempel erneuern
      const neuerStatus = !bestand[zufallsApo][zufallsMed.name];
      bestand[zufallsApo][zufallsMed.name] = neuerStatus;
      bestandZeit[zufallsApo][zufallsMed.name] = Date.now();

      // Ticker-Nachricht ganz vorne einfügen, nur die letzten 5 behalten
      const nachricht = zufallsApo + ': ' + zufallsMed.name + (neuerStatus ? ' jetzt verfügbar' : ' nicht mehr verfügbar');
      tickerNachrichten.unshift(nachricht);
      tickerNachrichten = tickerNachrichten.slice(0, 5);
      document.getElementById('live-ticker').textContent = tickerNachrichten.join('   •   ');

      // Beide Ansichten neu zeichnen, damit Suche UND Finder immer aktuell sind
      zeigeGefilterteApotheken();
      zeigeGefilterteMedikamente();
    }

    // Hinweis: Der eigentliche Start des Timers (aktualisiereBestand + setInterval) steht
    // ganz am Ende des Scripts – dort, wo auch die Reservierungen bereits definiert sind.
    // Würde er hier oben stehen, gäbe es einen Fehler: er würde Funktionen/Variablen
    // aufrufen, die im Code weiter unten stehen und noch nicht bereit sind.

    // ---- Modul 11: Reservierungen ----
    let reservierungen = []; // { apotheke, medikament, preis, zeit }

    // Prüft, ob für diese Apotheke/Medikament-Kombination bereits reserviert wurde
    function istReserviert(apoName, medName) {
      return reservierungen.some(function(r) {
        return r.apotheke === apoName && r.medikament === medName;
      });
    }

    // ---- Modul 12: Produktseite mit E-Mail-Erfassung & Abholcode ----
    let aktuelleProduktseite = null; // merkt sich, welches Produkt/Apotheke gerade geöffnet ist

    function oeffneProduktseite(apoName, medName, preis) {
      aktuelleProduktseite = { apotheke: apoName, medikament: medName, preis: preis };
      zeigeAnsicht('produkt');
      zeigeProduktseite();
    }

    function zeigeProduktseite() {
      const p = aktuelleProduktseite;
      const container = document.getElementById('produkt-inhalt');
      container.innerHTML =
        '<h2>' + p.medikament + '</h2>' +
        '<p>Abholung bei: <strong>' + p.apotheke + '</strong><br>Preis: ' + p.preis.toFixed(2) + ' €</p>' +
        '<label>E-Mail-Adresse für den Abholcode<br>' +
        '<input type="text" id="produkt-email" placeholder="deine@email.de"></label>' +
        '<button class="action" onclick="bestaetigeReservierung()">Reservieren &amp; Abholcode anfordern</button>' +
        '<div id="produkt-bestaetigung" style="margin-top: 12px;"></div>';
    }

    // Erzeugt einen zufälligen 6-stelligen Abholcode (ohne leicht verwechselbare Zeichen wie O/0, I/1)
    function generiereAbholcode() {
      const zeichen = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += zeichen[Math.floor(Math.random() * zeichen.length)];
      }
      return code;
    }

    function bestaetigeReservierung() {
      const email = document.getElementById('produkt-email').value.trim();
      const bestaetigung = document.getElementById('produkt-bestaetigung');

      // Ganz einfache Prüfung: enthält die Eingabe ein "@"?
      if (!email.includes('@')) {
        bestaetigung.innerHTML = '<p style="color:#c0392b;">Bitte eine gültige E-Mail-Adresse eingeben.</p>';
        return;
      }

      const abholcode = generiereAbholcode();
      reservierungen.push({
        apotheke: aktuelleProduktseite.apotheke,
        medikament: aktuelleProduktseite.medikament,
        preis: aktuelleProduktseite.preis,
        email: email,
        abholcode: abholcode,
        zeit: Date.now()
      });
      aktualisiereReservierungen();

      bestaetigung.innerHTML =
        '<p style="color:#1a9e5e;"><strong>Reserviert!</strong><br>' +
        'Abholcode <strong>' + abholcode + '</strong> wurde (simuliert) an ' + email + ' gesendet.</p>';
    }

    function storniereReservierung(index) {
      reservierungen.splice(index, 1);
      aktualisiereReservierungen();
      zeigeGefilterteMedikamente();
    }

    function aktualisiereReservierungen() {
      document.getElementById('res-count').textContent = reservierungen.length;

      const container = document.getElementById('reservierungen-inhalt');
      container.innerHTML = '';

      if (reservierungen.length === 0) {
        container.innerHTML = '<p>Keine aktiven Reservierungen.</p>';
        return;
      }

      reservierungen.forEach(function(r, index) {
        const karte = document.createElement('div');
        karte.className = 'card';
        karte.innerHTML =
          '<strong>' + r.medikament + '</strong><br>' +
          'Abholung bei: ' + r.apotheke + '<br>' +
          r.preis.toFixed(2) + ' €<br>' +
          'Abholcode: <strong>' + r.abholcode + '</strong> (gesendet an ' + r.email + ')' +
          '<br><button class="action" onclick="storniereReservierung(' + index + ')">Stornieren</button>';
        container.appendChild(karte);
      });
    }

    aktualisiereReservierungen(); // Startzustand anzeigen

    // Navigation: Klick auf einen Nav-Button zeigt den passenden Bereich
    function zeigeAnsicht(name) {
      // Alle Sections und Nav-Buttons durchgehen und "active" entfernen
      document.querySelectorAll('main section').forEach(function(section) {
        section.classList.remove('active');
      });
      document.querySelectorAll('nav button').forEach(function(btn) {
        btn.classList.remove('active');
      });
      // Die gewünschte Section aktivieren
      document.getElementById('view-' + name).classList.add('active');

      // Den passenden Nav-Button aktivieren – falls es dafür überhaupt einen gibt
      // (die Produktseite z.B. hat keinen eigenen Button, sie wird nur per Klick geöffnet)
      const navButton = document.getElementById('nav-' + name);
      if (navButton) {
        navButton.classList.add('active');
      }
    }

    document.getElementById('nav-suche').addEventListener('click', function() {
      zeigeAnsicht('suche');
    });
    document.getElementById('nav-finder').addEventListener('click', function() {
      zeigeAnsicht('finder');
    });
    document.getElementById('nav-reservierungen').addEventListener('click', function() {
      zeigeAnsicht('reservierungen');
    });

    // Startansicht
    zeigeAnsicht('suche');

    // ---- Jetzt, wo alles definiert ist: den Live-Ticker starten ----
    aktualisiereBestand(); // sofort einmal ausführen
    setInterval(aktualisiereBestand, 4000); // danach alle 4 Sekunden wiederholen
  