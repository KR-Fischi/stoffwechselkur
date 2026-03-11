---
name: "{{Rezeptname}}"
portionen: 2
bild: ""
phase:
  - diät        # "diät" und/oder "stabi"
kategorie: "vegetarisch"  # "vegetarisch", "vegan" oder "fleisch"
zutaten:
  - { name: "Zutat 1", menge: "100g" }
  - { name: "Zutat 2", menge: "1 Stück" }
zubereitungszeit: 30  # in Minuten
tags: []
erstellt: "{{date:YYYY-MM-DD}}"
---

# {{Rezeptname}}

> **Portionen:** {{portionen}} | **Phase:** {{phase}} | **Kategorie:** {{kategorie}} | **Zeit:** {{zubereitungszeit}} Min.

{{#if bild}}
![[{{bild}}]]
{{/if}}

## Zutaten

| Menge | Zutat |
|-------|-------|
| 100g  | Zutat 1 |
| 1 Stück | Zutat 2 |

## Zubereitung

1. Ersten Schritt beschreiben.
2. Zweiten Schritt beschreiben.
3. Weiteren Schritt beschreiben.

---

> [!tip] Tipp
> Hier kann ein hilfreicher Tipp zum Rezept stehen.
