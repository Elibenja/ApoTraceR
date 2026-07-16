# Apotheken-App

Eine kleine Web-App (reines HTML/CSS/JavaScript, ohne Build-Tools) für den Grundkurs "App programmieren". Alles läuft in einer einzigen Datei: `index.html`. Einfach im Browser öffnen, keine Installation nötig (Internetverbindung wird für die Kartenanzeige benötigt).

## Funktionen

- **Medikamentensuche im Umkreis**: Suche nach Medikamenten, live sortiert nach Entfernung der Apotheke. Zeigt "Alternative lagernd" (gleiche Wirkstoffgruppe), falls das gesuchte Produkt fehlt, oder "keine Information verfügbar", falls eine Apotheke (noch) keine Bestandsdaten liefert.
- **Rezeptpflicht & Beipackzettel**: Medikamente mit Rezeptpflicht sind markiert (℞), ein aufklappbarer Beipackzettel-Text ist hinterlegt (reiner Beispieltext für den Kurs, **keine echte medizinische Information**).
- **Apotheken-Finder mit Karte**: Liste aller Apotheken mit Öffnungszeiten, Notdienst-Filter und einer echten Karte (Leaflet/OpenStreetMap) mit Markern. Live-Status "Jetzt geöffnet/geschlossen" wird aus der aktuellen Uhrzeit berechnet.
- **Live-Ticker**: Simulierter Echtzeit-Bestand pro Apotheke/Medikament (`setInterval`), inkl. Zeitstempel als Vertrauens-Nachweis ("vor X Sek. geprüft").
- **Reservierung mit Abholcode**: Produktseite mit E-Mail-Erfassung, generiert einen 6-stelligen Abholcode (simulierter Versand – ohne echten Server/E-Mail-Dienst).
- **Mein Einnahmeplan**: Medikament, Menge und Uhrzeit eintragen; bei erlaubten Benachrichtigungen (Notification-API) erinnert die App zur passenden Zeit (nur solange der Tab geöffnet ist).
- **Meine Lieblingsapotheken**: Apotheken als Favorit markieren (Stern-Symbol), gespeichert mit `localStorage` – bleibt auch nach dem Neuladen der Seite erhalten, Favoriten erscheinen zuerst in der Liste.

## Technisch

- Reines Vanilla JavaScript: Arrays/Objekte als Datenspeicher, `filter()`, `map()`, `reduce()`, `forEach()`, `setInterval()`, DOM-Events, `localStorage`, Notification-API.
- Externe Bibliothek: [Leaflet](https://leafletjs.com/) (per CDN eingebunden) für die Kartenansicht mit OpenStreetMap-Kacheln.
- Kein Backend, keine echte Datenbank – alle Daten sind im Skript hart codiert und simuliert (Bestand, Entfernung, Öffnungszeiten, E-Mail-Versand).

## Nächste mögliche Schritte

- Echtes Backend/API statt fester Arrays (z.B. um reale Warenwirtschaftssysteme der Apotheken anzubinden).
- Echte Geolocation (Browser-API) für den eigenen Standort statt fester `entfernungKm`-Werte.
- Echter E-Mail-Versand für den Abholcode und echte Push-Benachrichtigungen (z.B. über einen Server mit E-Mail-/Push-Dienst statt der browserbasierten Notification-API).
