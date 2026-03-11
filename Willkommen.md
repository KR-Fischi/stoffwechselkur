# 🥗 Willkommen im Stoffwechselrezepte-Vault

Hier sammelst du Rezepte und Wissen rund um die **Stoffwechselkur**.

## 📁 Struktur

- [[Rezepte/Diätphase]] – Rezepte für die Diätphase
- [[Rezepte/Stabi-Phase]] – Rezepte für die Stabilisierungsphase
- [[Wissen]] – Hintergrundinformationen zur Stoffwechselkur
- [[Templates/Rezept-Vorlage]] – Vorlage für neue Rezepte

## ✨ Schnellstart

Neues Rezept anlegen:
1. Vorlage [[Templates/Rezept-Vorlage]] öffnen
2. In den passenden Ordner kopieren (`Diätphase` oder `Stabi-Phase`)
3. Felder ausfüllen — fertig!

## 📊 Alle Rezepte

```dataview
TABLE phase, kategorie, portionen, zubereitungszeit + " Min." AS Zeit
FROM "Rezepte"
SORT file.name ASC
```

## 🔍 Filter-Beispiele (Dataview)

**Nur Diätphase:**
```dataview
TABLE kategorie, zubereitungszeit + " Min." AS Zeit
FROM "Rezepte"
WHERE contains(phase, "diät")
SORT file.name ASC
```

**Nur vegan/vegetarisch:**
```dataview
TABLE phase, zubereitungszeit + " Min." AS Zeit
FROM "Rezepte"
WHERE kategorie = "vegan" OR kategorie = "vegetarisch"
SORT file.name ASC
```
