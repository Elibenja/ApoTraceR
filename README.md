# Apotheken-App

Eine kleine Web-App (reines HTML/CSS/JavaScript, ohne Build-Tools) für den Grundkurs "App programmieren". Alles läuft in einer einzigen Datei: `index.html`. Einfach im Browser öffnen, keine Installation nötig.

## Funktionen

- **Medikamentensuche im Umkreis**: Suche nach Medikamenten, live sortiert nach Entfernung der Apotheke.
- **Apotheken-Finder**: Liste aller Apotheken mit Öffnungszeiten und Notdienst-Filter.
- **Live-Ticker**: Simulierter Echtzeit-Bestand pro Apotheke/Medikament (`setInterval`), inkl. Zeitstempel als Vertrauens-Nachweis ("vor X Sek. geprüft").
- **Reservierung mit Abholcode**: Produktseite mit E-Mail-Erfassung, generiert einen 6-stelligen Abholcode (simulierter Versand – ohne echten Server/E-Mail-Dienst).
- **Warenkorb**: Medikamente merken, Summe berechnen.

## Technisch

- Reines Vanilla JavaScript: Arrays/Objekte als Datenspeicher, `filter()`, `map()`, `reduce()`, `forEach()`, `setInterval()`, DOM-Events.
- Kein Backend, keine echte Datenbank – alle Daten sind im Skript hart codiert und simuliert (Bestand, Entfernung, E-Mail-Versand).

## Nächste mögliche Schritte

- Echtes Backend/API statt fester Arrays (z.B. um reale Warenwirtschaftssysteme der Apotheken anzubinden).
- Echte Geolocation (Browser-API) statt fester `entfernungKm`-Werte.
- Echter E-Mail-Versand für den Abholcode (z.B. über einen Server mit E-Mail-Dienst).
