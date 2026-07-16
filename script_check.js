
    // ---- Modul 4/14: Daten der Medikamente (ein Array von Objekten) ----
    // "kategorie" wird für die Alternativen-Suche gebraucht (Modul 14): fehlt Medikament A,
    // aber ein anderes aus derselben Kategorie ist vorrätig, wird es als Alternative vorgeschlagen.
    // "beipackzettel" ist reiner Beispieltext fürs Lernen – KEINE echte medizinische Information.
    const medikamente = [
      { name: "Ibuprofen 400mg", beschreibung: "Schmerz- und Entzündungshemmer", preis: 4.95, kategorie: "Schmerzmittel", rezeptpflichtig: false,
        beipackzettel: "Beispieltext (nicht real): Übliche Anwendung 1 Tablette bei Bedarf, max. 3x täglich. Nicht einnehmen bei Magen-Darm-Geschwüren. Bei Unsicherheit Apotheke oder Arzt fragen." },
      { name: "Paracetamol 500mg", beschreibung: "Schmerzmittel, fiebersenkend", preis: 3.50, kategorie: "Schmerzmittel", rezeptpflichtig: false,
        beipackzettel: "Beispieltext (nicht real): Übliche Anwendung 1-2 Tabletten alle 6 Stunden, max. Tagesdosis beachten. Bei Leber-Vorerkrankungen vorher Rücksprache halten." },
      { name: "Aspirin 500mg", beschreibung: "Schmerzmittel, blutverdünnend", preis: 5.20, kategorie: "Schmerzmittel", rezeptpflichtig: false,
        beipackzettel: "Beispieltext (nicht real): Nicht geeignet bei Blutgerinnungsstörungen oder in der Schwangerschaft. Bei Fragen Apotheke kontaktieren." },
      { name: "Nasenspray Xylometazolin", beschreibung: "Abschwellend bei Schnupfen", preis: 2.99, kategorie: "Erkältung", rezeptpflichtig: false,
        beipackzettel: "Beispieltext (nicht real): Maximal 7 Tage am Stück anwenden, sonst Gewöhnungseffekt möglich." },
      { name: "Hustensaft", beschreibung: "Lindert Husten und Reizhusten", preis: 6.80, kategorie: "Erkältung", rezeptpflichtig: false,
        beipackzettel: "Beispieltext (nicht real): 1 Esslöffel 3x täglich. Nicht gleichzeitig mit hustenreizdämpfenden Mitteln kombinieren." },
      { name: "Vitamin C Brausetabletten", beschreibung: "Nahrungsergänzung", preis: 4.10, kategorie: "Nahrungsergänzung", rezeptpflichtig: false,
        beipackzettel: "Beispieltext (nicht real): 1 Tablette täglich in einem Glas Wasser auflösen." },
      { name: "Amoxicillin 500mg", beschreibung: "Antibiotikum", preis: 12.90, kategorie: "Antibiotika", rezeptpflichtig: true,
        beipackzettel: "Beispieltext (nicht real): Nur nach ärztlicher Verordnung, Einnahmedauer unbedingt wie verschrieben einhalten." }
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
          '<strong>' + med.name + '</strong>' +
          (med.rezeptpflichtig ? ' <span style="color:#c0392b; font-size:12px;">℞ rezeptpflichtig</span>' : '') + '<br>' +
          med.beschreibung + '<br>' +
          med.preis.toFixed(2) + ' €' +
          '<details style="margin-top:6px;"><summary style="cursor:pointer; color:#0b7d6b;">Beipackzettel anzeigen</summary>' +
          '<p class="nachweis">' + med.beipackzettel + '</p></details>' +
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
        // Modul 14: manche Apotheken speisen (noch) keine Bestandsdaten in die App ein
        if (!apo.meldetBestand) {
          return '❔ ' + apo.name + ' (' + apo.entfernungKm.toFixed(1) + ' km) – keine Information verfügbar. ' +
            '<span class="nachweis">Bitte direkt Kontakt aufnehmen: ' + apo.telefon + '</span>';
        }

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

        // Modul 14: falls nicht vorrätig, nach einer Alternative aus derselben Kategorie suchen
        let alternative = '';
        if (!verfuegbar) {
          const alternativeMed = medikamente.find(function(m) {
            return m.name !== med.name && m.kategorie === med.kategorie && bestand[apo.name][m.name];
          });
          if (alternativeMed) {
            alternative = ' <span class="nachweis">– Alternative lagernd: ' + alternativeMed.name + '</span>';
          }
        }

        return punkt + ' ' + apo.name + ' (' + apo.entfernungKm.toFixed(1) + ' km) – ' +
          (verfuegbar ? 'vorrätig' : 'nicht vorrätig') + ' <span class="nachweis">(' + nachweis + ')</span>' + aktion + alternative;
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

    // ---- Modul 5/13: Daten der Apotheken ----
    // "entfernungKm" simuliert die Distanz zum Kunden (in echt: per GPS/Geolocation-API berechnet)
    // "lat"/"lng" sind echte Koordinaten für die Karte (Modul 13)
    // "oeffnungszeiten" ist jetzt strukturiert (von/bis oder durchgehend), damit wir live prüfen können, ob offen ist
    // "meldetBestand": false simuliert eine Apotheke, die (noch) keine Bestandsdaten liefert (Modul 14)
    const apotheken = [
      { name: "Stadt-Apotheke", adresse: "Hauptstraße 12", telefon: "089 123456", lat: 48.1371, lng: 11.5754, oeffnungszeiten: { von: "08:00", bis: "19:00" }, notdienst: false, entfernungKm: 0.8, meldetBestand: true },
      { name: "Rathaus-Apotheke", adresse: "Marktplatz 3", telefon: "089 234567", lat: 48.1374, lng: 11.5755, oeffnungszeiten: { von: "09:00", bis: "18:00" }, notdienst: true, entfernungKm: 1.4, meldetBestand: true },
      { name: "Löwen-Apotheke", adresse: "Bahnhofstraße 5", telefon: "089 345678", lat: 48.1400, lng: 11.5600, oeffnungszeiten: { von: "08:00", bis: "20:00" }, notdienst: false, entfernungKm: 2.1, meldetBestand: false },
      { name: "Sonnen-Apotheke", adresse: "Gartenweg 8", telefon: "089 456789", lat: 48.1250, lng: 11.6000, oeffnungszeiten: { durchgehend: true }, notdienst: true, entfernungKm: 3.6, meldetBestand: true }
    ];

    // Wandelt die strukturierten Öffnungszeiten in einen lesbaren Text um
    function oeffnungszeitenText(apo) {
      return apo.oeffnungszeiten.durchgehend
        ? 'durchgehend geöffnet'
        : apo.oeffnungszeiten.von + ' - ' + apo.oeffnungszeiten.bis;
    }

    // Live-Check: hat die Apotheke JETZT (aktuelle Uhrzeit) geöffnet?
    function jetztGeoeffnet(apo) {
      if (apo.oeffnungszeiten.durchgehend) return true;
      const jetzt = new Date();
      const aktuelleMinuten = jetzt.getHours() * 60 + jetzt.getMinutes();
      const [vonH, vonM] = apo.oeffnungszeiten.von.split(':').map(Number);
      const [bisH, bisM] = apo.oeffnungszeiten.bis.split(':').map(Number);
      return aktuelleMinuten >= (vonH * 60 + vonM) && aktuelleMinuten < (bisH * 60 + bisM);
    }

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
        // Bestandsliste für diese Apotheke aus "bestand" zusammenbauen –
        // sofern die Apotheke überhaupt Bestandsdaten liefert (Modul 14)
        const bestandZeilen = !apo.meldetBestand
          ? '❔ Diese Apotheke liefert (noch) keine Bestandsdaten. Bitte telefonisch nachfragen: ' + apo.telefon
          : medikamente.map(function(med) {
              const verfuegbar = bestand[apo.name][med.name];
              const punkt = verfuegbar
                ? '<span class="punkt-gruen">●</span>'
                : '<span class="punkt-rot">●</span>';
              const nachweis = vorWieLange(bestandZeit[apo.name][med.name]);
              return punkt + ' ' + med.name + ' <span class="nachweis">(' + nachweis + ')</span>';
            }).join('<br>');

        const offen = jetztGeoeffnet(apo);
        const statusText = offen
          ? '<span class="punkt-gruen">●</span> Jetzt geöffnet'
          : '<span class="punkt-rot">●</span> Jetzt geschlossen';

        const favoritSymbol = istFavorit(apo.name) ? '★' : '☆';

        const karte = document.createElement('div');
        karte.className = 'card';
        karte.innerHTML =
          '<button onclick="favoritToggle(\'' + apo.name + '\')" ' +
          'style="float:right; background:none; border:none; font-size:22px; cursor:pointer; color:#e8a33d;" ' +
          'title="Als Lieblingsapotheke merken">' + favoritSymbol + '</button>' +
          '<strong>' + apo.name + '</strong>' + (apo.notdienst ? ' 🟢 Notdienst' : '') + '<br>' +
          apo.adresse + '<br>' +
          'Öffnungszeiten: ' + oeffnungszeitenText(apo) + '<br>' +
          statusText +
          '<div class="bestand-liste">' + bestandZeilen + '</div>';
        container.appendChild(karte);
      });
    }

    // ---- Modul 16: Lieblingsapotheken, dauerhaft gespeichert mit localStorage ----
    // localStorage.getItem gibt beim allerersten Aufruf "null" zurück, deshalb der Fallback "[]"
    let favoriten = JSON.parse(localStorage.getItem('apotheken-favoriten') || '[]');

    function istFavorit(apoName) {
      return favoriten.includes(apoName);
    }

    function favoritToggle(apoName) {
      if (istFavorit(apoName)) {
        favoriten = favoriten.filter(function(name) { return name !== apoName; });
      } else {
        favoriten.push(apoName);
      }
      // In localStorage speichern, damit die Auswahl auch nach dem Neuladen der Seite erhalten bleibt
      localStorage.setItem('apotheken-favoriten', JSON.stringify(favoriten));
      zeigeGefilterteApotheken();
    }

    // Merkt sich, ob der Notdienst-Filter gerade aktiv ist
    let nurNotdienstAktiv = false;

    function zeigeGefilterteApotheken() {
      let liste = nurNotdienstAktiv ? apotheken.filter(function(apo) { return apo.notdienst; }) : apotheken.slice();
      // Favoriten zuerst anzeigen
      liste = liste.slice().sort(function(a, b) {
        return (istFavorit(b.name) ? 1 : 0) - (istFavorit(a.name) ? 1 : 0);
      });
      zeigeApotheken(liste);
    }

    document.getElementById('nur-notdienst').addEventListener('change', function(e) {
      nurNotdienstAktiv = e.target.checked;
      zeigeGefilterteApotheken();
    });

    zeigeGefilterteApotheken();

    // ---- Modul 13: Karte mit Leaflet/OpenStreetMap ----
    let karte = null;
    const markerProApotheke = {}; // merkt sich den Leaflet-Marker pro Apotheken-Name

    function initKarte() {
      // Karte auf den Durchschnittspunkt aller Apotheken zentrieren
      const mitteLat = apotheken.reduce(function(s, a) { return s + a.lat; }, 0) / apotheken.length;
      const mitteLng = apotheken.reduce(function(s, a) { return s + a.lng; }, 0) / apotheken.length;

      karte = L.map('apotheken-karte').setView([mitteLat, mitteLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap-Mitwirkende'
      }).addTo(karte);

      apotheken.forEach(function(apo) {
        const marker = L.marker([apo.lat, apo.lng]).addTo(karte);
        markerProApotheke[apo.name] = marker;
      });

      aktualisiereKarte(); // Popup-Inhalte direkt einmal setzen
    }

    // Aktualisiert nur den Inhalt der Popups (nicht die ganze Karte neu aufbauen!)
    function aktualisiereKarte() {
      apotheken.forEach(function(apo) {
        const offen = jetztGeoeffnet(apo);
        const inhalt =
          '<strong>' + apo.name + '</strong><br>' +
          apo.adresse + '<br>' +
          (offen ? '🟢 Jetzt geöffnet' : '🔴 Jetzt geschlossen');
        markerProApotheke[apo.name].bindPopup(inhalt);
      });
    }

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

      // Alle Ansichten neu zeichnen, damit Suche, Finder UND Karte immer aktuell sind
      zeigeGefilterteApotheken();
      zeigeGefilterteMedikamente();
      if (karte) { aktualisiereKarte(); }
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

    // ---- Modul 15: Einnahmeplan mit Browser-Benachrichtigungen ----
    let einnahmeplan = []; // { medikament, menge, uhrzeit, zuletztBenachrichtigtAm }

    // Das Auswahlfeld im Formular mit allen Medikamenten befüllen
    function fuelleMedikamentenAuswahl() {
      const auswahl = document.getElementById('plan-medikament');
      auswahl.innerHTML = medikamente.map(function(med) {
        return '<option value="' + med.name + '">' + med.name + '</option>';
      }).join('');
    }

    function einnahmeHinzufuegen() {
      const medikament = document.getElementById('plan-medikament').value;
      const menge = document.getElementById('plan-menge').value.trim();
      const uhrzeit = document.getElementById('plan-uhrzeit').value;

      if (!menge || !uhrzeit) {
        alert('Bitte Menge und Uhrzeit ausfüllen.');
        return;
      }

      einnahmeplan.push({ medikament: medikament, menge: menge, uhrzeit: uhrzeit, zuletztBenachrichtigtAm: null });
      document.getElementById('plan-menge').value = '';
      document.getElementById('plan-uhrzeit').value = '';
      zeigeEinnahmeplan();
    }

    function einnahmeLoeschen(index) {
      einnahmeplan.splice(index, 1);
      zeigeEinnahmeplan();
    }

    function zeigeEinnahmeplan() {
      const container = document.getElementById('einnahmeplan-inhalt');
      container.innerHTML = '';

      if (einnahmeplan.length === 0) {
        container.innerHTML = '<p>Noch kein Einnahmeplan angelegt.</p>';
        return;
      }

      einnahmeplan.forEach(function(eintrag, index) {
        const zeile = document.createElement('div');
        zeile.className = 'card';
        zeile.innerHTML =
          '<strong>' + eintrag.medikament + '</strong><br>' +
          eintrag.menge + ' um ' + eintrag.uhrzeit + ' Uhr' +
          '<br><button class="action" onclick="einnahmeLoeschen(' + index + ')">Löschen</button>';
        container.appendChild(zeile);
      });
    }

    // Fragt die Erlaubnis für Browser-Benachrichtigungen ab (Notification-API)
    function benachrichtigungenAnfragen() {
      const status = document.getElementById('benachrichtigungs-status');

      if (!('Notification' in window)) {
        status.textContent = 'Dieser Browser unterstützt keine Benachrichtigungen.';
        return;
      }

      Notification.requestPermission().then(function(ergebnis) {
        status.textContent = ergebnis === 'granted'
          ? '✓ Benachrichtigungen sind aktiviert.'
          : 'Benachrichtigungen wurden nicht erlaubt.';
      });
    }

    // Läuft regelmäßig im Hintergrund: prüft, ob JETZT ein Eintrag fällig ist
    function pruefeFaelligeEinnahmen() {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const jetzt = new Date();
      const aktuelleZeit = String(jetzt.getHours()).padStart(2, '0') + ':' + String(jetzt.getMinutes()).padStart(2, '0');
      const heute = jetzt.toDateString();

      einnahmeplan.forEach(function(eintrag) {
        // Nur einmal pro Tag benachrichtigen, auch wenn wir mehrmals pro Minute prüfen
        if (eintrag.uhrzeit === aktuelleZeit && eintrag.zuletztBenachrichtigtAm !== heute) {
          new Notification('Zeit für ' + eintrag.medikament, { body: eintrag.menge + ' jetzt einnehmen.' });
          eintrag.zuletztBenachrichtigtAm = heute;
        }
      });
    }

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

      // Leaflet-Falle: eine Karte, die in einem unsichtbaren Bereich erzeugt wurde,
      // kennt ihre echte Größe nicht. Beim Anzeigen der Finder-Ansicht deshalb nachträglich neu vermessen.
      if (name === 'finder' && karte) {
        setTimeout(function() { karte.invalidateSize(); }, 0);
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
    document.getElementById('nav-einnahmeplan').addEventListener('click', function() {
      zeigeAnsicht('einnahmeplan');
    });

    // Startansicht
    zeigeAnsicht('suche');

    // ---- Jetzt, wo alles definiert ist: Karte erzeugen und Live-Ticker starten ----
    initKarte();
    fuelleMedikamentenAuswahl();
    zeigeEinnahmeplan();
    aktualisiereBestand(); // sofort einmal ausführen
    setInterval(aktualisiereBestand, 4000); // danach alle 4 Sekunden wiederholen
    setInterval(pruefeFaelligeEinnahmen, 20000); // alle 20 Sek. prüfen, ob eine Einnahme fällig ist
  