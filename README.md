# Umfangreicher Zinsrechner

Ein moderner, benutzerfreundlicher Zinsrechner mit verschiedenen Berechnungsmöglichkeiten für finanzielle Planungen.

## Funktionen

Der Zinsrechner bietet folgende Berechnungsmöglichkeiten:

1. **Einfache Verzinsung** - Berechnung von Zinsen ohne Zinseszinseffekt
2. **Zinseszins** - Berechnung von Kapitalwachstum mit Zinseszinseffekt und verschiedenen Zinsperioden
3. **Kreditrechner** - Berechnung von Kreditraten, Gesamtkosten und Erstellung eines Tilgungsplans
4. **Sparplanrechner** - Berechnung von Sparplanentwicklungen mit regelmäßigen Einzahlungen

## Technologien

Der Zinsrechner wurde mit folgenden Technologien entwickelt:

- HTML5
- CSS3 mit modernem Design und Responsive Layout
- Vanilla JavaScript für alle Berechnungen
- Chart.js für die Visualisierung der Ergebnisse

## Installation und Verwendung

1. Laden Sie alle Dateien herunter
2. Öffnen Sie die `index.html` Datei in einem modernen Webbrowser
3. Alternativ können Sie die Dateien auf einem Webserver hosten

Es sind keine weiteren Abhängigkeiten oder Installationen erforderlich, da alle externen Bibliotheken (Chart.js und Font Awesome) über CDNs eingebunden werden.

## Berechnungsformeln

### Einfache Verzinsung
```
Zinsen = Kapital × Zinssatz × Zeit
```

### Zinseszins
```
Endkapital = Kapital × (1 + Zinssatz/n)^(n×t)
```
wobei n die Anzahl der Zinsperioden pro Jahr und t die Zeit in Jahren ist.

### Kreditrate
```
Rate = Kreditbetrag × (r × (1 + r)^n) / ((1 + r)^n - 1)
```
wobei r der Zinssatz pro Periode und n die Anzahl der Zahlungen ist.

### Sparplan
```
Endkapital = Anfangskapital × (1 + r)^n + Regelmäßige Einzahlung × ((1 + r)^n - 1) / r
```
wobei r der Zinssatz pro Periode und n die Anzahl der Einzahlungen ist.

## Datenschutz

Alle Berechnungen werden lokal im Browser durchgeführt. Es werden keine Daten an externe Server gesendet.

## Haftungsausschluss

Dieser Zinsrechner dient nur zu Informationszwecken. Die Berechnungen sind Schätzungen und sollten nicht als finanzielle Beratung betrachtet werden. Für eine professionelle Finanzberatung wenden Sie sich bitte an einen qualifizierten Finanzberater.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. 