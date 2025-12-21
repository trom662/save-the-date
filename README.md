# 🤘 Save The Date - Metal Wedding

Eine ironische, selbstbewusste Save-the-Date Webseite mit Metal-Ästhetik.  
Klickdummy für eine Hochzeit am **19. September 2026**.

![Preview](assets/design-hero.jpg)

---

## 📁 Projektstruktur

```
01_SaveTheDate_Page/
├── index.html          # Hauptseite
├── styles.css          # Eigene CSS-Anpassungen
├── scripts.js          # JavaScript (Countdown, Navigation, Lightbox)
├── assets/
│   └── design-hero.jpg # Hero-Bild (Platzhalter)
└── README.md           # Diese Datei
```

---

## 🚀 Lokale Entwicklung

### Projekt starten

1. **Einfachste Methode:** Öffne `index.html` direkt im Browser
   ```
   # Windows
   start index.html
   
   # macOS
   open index.html
   
   # Linux
   xdg-open index.html
   ```

2. **Mit Live Server (empfohlen):**
   - VS Code Extension "Live Server" installieren
   - Rechtsklick auf `index.html` → "Open with Live Server"

3. **Mit Python:**
   ```bash
   python -m http.server 8000
   # Dann http://localhost:8000 öffnen
   ```

---

## 🔧 Konfiguration

### Google Form ID einsetzen

1. Erstelle ein Google Formular mit den Feldern:
   - Name (Pflichtfeld)
   - Anzahl Personen (Pflichtfeld)  
   - Nachricht (Optional)

2. Klicke auf "Senden" → "< >" (Einbetten)

3. Kopiere die ID aus der URL:
   ```
   https://docs.google.com/forms/d/e/DEINE_ID_HIER/viewform
   ```

4. Ersetze in `index.html` (ca. Zeile 265):
   ```html
   <!-- Vorher -->
   src="https://docs.google.com/forms/d/e/{{GOOGLE_FORM_ID}}/viewform?embedded=true"
   
   <!-- Nachher -->
   src="https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?embedded=true"
   ```

### Datum ändern

In `scripts.js` (Zeile 170):
```javascript
initCountdown('2026-09-19T14:00:00');  // Format: YYYY-MM-DDTHH:MM:SS
```

### Farben anpassen

In `index.html` (Tailwind Config, ca. Zeile 13):
```javascript
colors: {
    'metal-black': '#0b0b0b',  // Hintergrund
    'metal-red': '#c62828',    // Akzentfarbe
    'metal-gray': '#1a1a1a',   // Sekundärer Hintergrund
    'metal-light': '#e0e0e0',  // Text
}
```

### Tailwind-Klassen anpassen

Die Seite nutzt [Tailwind CSS via CDN](https://tailwindcss.com/docs/installation/play-cdn).  
Alle Utility-Klassen können direkt im HTML verwendet werden:

```html
<!-- Beispiel: Button-Farbe ändern -->
<a class="bg-metal-red hover:bg-red-700 ...">

<!-- Beispiel: Mehr Padding -->
<section class="py-20 md:py-32 ...">
```

---

## 🌐 Deployment auf GitHub Pages

1. **Repository erstellen** auf GitHub

2. **Code pushen:**
   ```bash
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

3. **GitHub Pages aktivieren:**
   - Repository → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` / `/ (root)`
   - Save

4. **URL:** `https://USERNAME.github.io/REPO/`

---

## ✅ Features

- [x] **Hero-Sektion** mit Foto und dekorativen Elementen
- [x] **Countdown** bis zum Hochzeitstag (JavaScript)
- [x] **Responsive Navigation** mit Hamburger-Menü
- [x] **Timeline** mit 3 Events (Zeremonie, Empfang, Party)
- [x] **Anfahrt** mit OpenStreetMap-Einbettung
- [x] **RSVP** mit Google Form iframe
- [x] **Fotogalerie** mit Lightbox
- [x] **Accessibility** (semantisches HTML, ARIA, Kontrast)
- [x] **Smooth Scroll** und Hover-Effekte

---

## 📋 To-Do Liste

### 🔴 Kurzfristig (vor Launch)

1. **[ ] Hero-Foto austauschen**
   - Eigenes Verlobungsfoto in `assets/design-hero.jpg`
   - Empfohlene Größe: 800x1000px (Hochformat) oder 800x800px (Quadrat)
   - Format: JPEG, optimiert (< 200KB)

2. **[ ] Google Form ID einsetzen**
   - Formular erstellen und ID kopieren
   - In `index.html` ersetzen

3. **[ ] Adressen & Kontaktdaten aktualisieren**
   - Location-Adresse
   - Trauzeugen-Kontakte
   - E-Mail-Adresse

### 🟡 Mittelfristig (nach Launch)

4. **[ ] Illustration als SVG-Overlay**
   - Skulls, Gitarren, Ketten als echte SVGs
   - Ersetzt die Emoji-Platzhalter im Hero

5. **[ ] DSGVO-Texte erstellen**
   - Impressum mit korrekten Angaben
   - Datenschutzerklärung (Google Forms erwähnen!)

6. **[ ] OpenStreetMap-Koordinaten anpassen**
   - Echte Location-Koordinaten eintragen
   - Eventuell Google Maps Alternative

### 🟢 Langfristig (Erweiterungen)

7. **[ ] Formspree statt Google Forms**
   - Mehr Kontrolle über Styling
   - Keine Google-Abhängigkeit
   - [formspree.io](https://formspree.io)

8. **[ ] Gästebuch hinzufügen**
   - Einfaches Backend (Netlify Forms, Airtable)
   - Oder statisch mit GitHub Issues

9. **[ ] Custom Domain**
   - z.B. `sarah-und-max.de`
   - CNAME in GitHub Pages konfigurieren

10. **[ ] Gästeliste-Filter für Akt 1+2**
    - Nur eingeladene Gäste für die ersten beiden Akte
    - Später per RSVP/Backend umsetzen
    - Unterscheidung "enger Kreis" vs. "Party only"

---

## 🎨 Design-Entscheidungen

| Element | Entscheidung |
|---------|--------------|
| **Framework** | Tailwind CSS via CDN (schnelles Prototyping) |
| **Fonts** | Metal Mania (Akzente), Inter (Body) |
| **Farben** | Schwarz (#0b0b0b), Rot (#c62828), Grau (#1a1a1a) |
| **Icons** | Emoji als Platzhalter (später SVG) |
| **Forms** | Google Forms iframe (später Formspree) |
| **Maps** | OpenStreetMap (DSGVO-freundlicher) |

---

## 🛠️ Tech Stack

- **HTML5** - Semantische Struktur
- **Tailwind CSS** - Utility-First Styling
- **Vanilla JavaScript** - Keine Dependencies
- **Google Fonts** - Metal Mania, Inter

---

## 📝 Lizenz

Privates Projekt. Code darf für eigene Hochzeitsseiten verwendet werden.  
Bilder und Texte sind Platzhalter.

---

Made with 🖤 and 🤘
