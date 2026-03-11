# 🥗 Stoffwechselrezepte

Eine Obsidian-Wissenssammlung rund um die **Stoffwechselkur** – mit Rezepten für Diät- und Stabi-Phase, filterbar nach Zutaten und Ernährungsweise.

## 📁 Struktur

```
Stoffwechselrezepte/
├── Rezepte/
│   ├── Diätphase/      ← Rezepte für die Diätphase
│   └── Stabi-Phase/    ← Rezepte für die Stabilisierungsphase
├── Wissen/             ← Hintergrundinformationen zur Stoffwechselkur
├── Attachments/        ← Bilder und Medien
└── Templates/          ← Vorlagen für neue Rezepte
```

## 🏷️ Rezept-Frontmatter

Jedes Rezept nutzt YAML-Frontmatter für strukturierte Metadaten:

```yaml
---
name: "Rezeptname"
portionen: 2
bild: "dateiname.jpg"
phase: ["diät"]          # "diät", "stabi" oder beide
kategorie: "vegetarisch" # "vegetarisch", "vegan", "fleisch"
zutaten:
  - { name: "Zutat", menge: "100g" }
zubereitungszeit: 30     # Minuten
tags: []
erstellt: "YYYY-MM-DD"
---
```

## 🌐 Web App

Eine statische Web-App (geplant) liest die Markdown-Dateien und ermöglicht das Filtern nach:
- Verfügbaren Zutaten
- Phase (Diät / Stabi)
- Kategorie (vegetarisch / vegan / Fleisch)
- Zubereitungszeit

## 🔧 Setup

### Obsidian
- Empfohlene Plugins: **Dataview**, **Templater**, **Obsidian Git**
- Vorlage für neue Rezepte: `Templates/Rezept-Vorlage.md`

### GitHub Sync
```bash
git init
git remote add origin https://github.com/DEIN-USERNAME/stoffwechselrezepte.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

*Erstellt mit [Obsidian](https://obsidian.md)*
