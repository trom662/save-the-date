# 🧪 Test Suite Dokumentation

## Übersicht

Das Test-Suite für die Save The Date Website besteht aus zwei Komponenten:

1. **Playwright Integration Tests** - Automatisierte Browser-Tests
2. **Pre-Commit Validation Script** - Lokale Checks vor dem Commit

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Tests ausführen

```bash
# Alle Tests im Headless-Modus
npm test

# Tests mit UI (interaktiv)
npm run test:ui

# Tests im Browser anschauen
npm run test:headed

# Test Report öffnen
npm run test:report

# Debug-Modus
npm run test:debug
```

### Pre-Commit Checks
```bash
# Vollständige Validierung vor dem Commit
node pre-commit-test.js
```

---

## 📋 Test-Kategorien

### 1. 🔐 Security Tests
- ✅ Protected Content ist standardmäßig versteckt
- ✅ Timeline ist geschützt
- ✅ Umfrage ist geschützt
- ✅ Gallery ist ÖFFENTLICH

**Warum wichtig:** Verhindert Sicherheitslücken beim Zugriff auf sensible Inhalte.

### 2. 📄 HTML Structure Tests
- ✅ Meta Tags vorhanden (charset, viewport, description)
- ✅ Alle Hauptsektionen existieren
- ✅ Navigation ist fixed positioned
- ✅ Music Controls sind vorhanden

**Warum wichtig:** Grundlegende HTML-Integrität und SEO.

### 3. 🖼️ Assets & Resources Tests
- ✅ Alle kritischen Bilder laden
- ✅ Audio-Dateien sind zugänglich
- ✅ Favicon ist vorhanden

**Warum wichtig:** Sichert visuelles & akustisches Erlebnis.

### 4. 🔗 Link & Navigation Tests
- ✅ Alle Navigation Links sind vorhanden
- ✅ Externe Links sind korrekt
- ✅ Contact Email ist valide

**Warum wichtig:** Benutzernavigation funktioniert korrekt.

### 5. ⚙️ JavaScript Tests
- ✅ Keine Console-Fehler
- ✅ Welcome Overlay ist interaktiv
- ✅ Music Toggle funktioniert
- ✅ Background Audio Element existiert

**Warum wichtig:** JavaScript Funktionalität ist stabil.

### 6. 📱 Responsive Design Tests
- ✅ Mobile (375px)
- ✅ Tablet (768px)
- ✅ Desktop (1920px)

**Warum wichtig:** Website funktioniert auf allen Geräten.

### 7. ♿ Accessibility Tests
- ✅ Seiten-Titel vorhanden
- ✅ Form Labels vorhanden
- ✅ Alt-Texte auf Bildern

**Warum wichtig:** Barrierefreier Zugang für alle.

### 8. ⚡ Performance Tests
- ✅ Seite lädt in < 5 Sekunden
- ✅ Critical CSS ist vorhanden

**Warum wichtig:** Schnelle Ladezeiten = bessere Erfahrung.

### 9. 📅 Event Data Validation Tests
- ✅ Korrektes Hochzeitsdatum (19.09.2026)
- ✅ Datum im Title
- ✅ Location Info ist vorhanden

**Warum wichtig:** Kritische Event-Informationen sind korrekt.

---

## 📊 Pre-Commit Script Details

Der `pre-commit-test.js` Script führt folgende Checks durch:

```
1. Prerequisites Check
   └─ Playwright Module installt?
   
2. File Integrity Check
   └─ Alle Dateien vorhanden?
   
3. HTML Validation
   └─ DOCTYPE, Struktur, Protected Content korrekt?
   
4. Playwright Tests
   └─ Alle automatisierten Browser-Tests bestanden?
```

### Verwendung vor Commit:
```bash
# In Windows PowerShell
node pre-commit-test.js

# In Git Bash oder Linux/Mac
node ./pre-commit-test.js
```

**Output-Beispiel:**
```
✓ All Playwright tests passed
✓ File integrity check passed
✓ HTML validation passed

✓✓✓ ALL TESTS PASSED - READY TO COMMIT ✓✓✓
```

---

## ⚡ Server für Tests starten

**Wichtig:** Tests benötigen einen laufenden lokalen Server!

```bash
# Terminal 1: Starte den Server
python -m http.server 8000

# Terminal 2: Führe Tests aus
npm test
```

---

## 🐛 Fehlerbehebung

### "Could not connect to localhost:8000"
→ Starten Sie den Server: `python -m http.server 8000`

### "Playwright modules not found"
→ Installieren Sie Dependencies: `npm install`

### Tests schlagen fehl
→ Rufen Sie den detaillierten Report auf: `npm run test:report`

---

## 🔄 CI/CD Integration

Dieser Test-Suite kann in CI/CD Pipelines integriert werden:

```yaml
# GitHub Actions Beispiel
- name: Run Website Tests
  run: |
    npm install
    python -m http.server 8000 &
    npm test
```

---

## 📝 Best Practices

1. **Vor jedem Commit:** `node pre-commit-test.js` ausführen
2. **Nach Breaking Changes:** `npm run test:ui` für visuelles Debugging
3. **Für neue Features:** Tests in `tests/website.spec.js` hinzufügen
4. **Report Review:** `npm run test:report` um detaillierte Ergebnisse zu sehen

---

## 🚀 Nächste Schritte

- [ ] Tests in CI/CD Pipeline integrieren
- [ ] Lighthouse Performance Tests hinzufügen
- [ ] Visual Regression Tests (z.B. mit Percy)
- [ ] Load Testing (wenn nötig)
- [ ] SEO Validierung erweitern

---

**Dokumentation letzte Aktualisierung:** 01.02.2026
**Verwaltete Website Version:** 1.0.0
