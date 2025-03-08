// DOM-Elemente nach dem Laden des Dokuments initialisieren
document.addEventListener('DOMContentLoaded', function() {
    // Tab-Funktionalität
    initTabs();
    
    // Event-Listener für Berechnungsbuttons
    document.getElementById('calculate-simple').addEventListener('click', calculateSimpleInterest);
    document.getElementById('calculate-compound').addEventListener('click', calculateCompoundInterest);
    document.getElementById('calculate-loan').addEventListener('click', calculateLoan);
    document.getElementById('calculate-savings').addEventListener('click', calculateSavings);
    
    // Initialisiere die Berechnungen mit Standardwerten
    calculateSimpleInterest();
    calculateCompoundInterest();
    calculateLoan();
    calculateSavings();
});

// Tab-Funktionalität initialisieren
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktiven Tab-Button entfernen
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Aktiven Tab-Inhalt entfernen
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Aktuellen Tab-Button aktivieren
            this.classList.add('active');
            
            // Entsprechenden Tab-Inhalt anzeigen
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Formatierungsfunktionen
function formatCurrency(amount) {
    return '€' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatPercentage(value) {
    return value.toFixed(2) + '%';
}

// Einfache Verzinsung berechnen
function calculateSimpleInterest() {
    // Eingabewerte abrufen
    const principal = parseFloat(document.getElementById('simple-principal').value);
    const rate = parseFloat(document.getElementById('simple-rate').value) / 100;
    const time = parseFloat(document.getElementById('simple-time').value);
    
    // Berechnung
    const interest = principal * rate * time;
    const total = principal + interest;
    
    // Ergebnisse anzeigen
    document.getElementById('simple-result-principal').textContent = formatCurrency(principal);
    document.getElementById('simple-result-interest').textContent = formatCurrency(interest);
    document.getElementById('simple-result-total').textContent = formatCurrency(total);
}

// Zinseszins berechnen
function calculateCompoundInterest() {
    // Eingabewerte abrufen
    const principal = parseFloat(document.getElementById('compound-principal').value);
    const rate = parseFloat(document.getElementById('compound-rate').value) / 100;
    const time = parseFloat(document.getElementById('compound-time').value);
    const frequency = parseInt(document.getElementById('compound-frequency').value);
    
    // Berechnung
    const n = frequency; // Anzahl der Zinsperioden pro Jahr
    const t = time; // Zeit in Jahren
    const r = rate; // Jährlicher Zinssatz
    
    const total = principal * Math.pow(1 + r/n, n*t);
    const interest = total - principal;
    
    // Ergebnisse anzeigen
    document.getElementById('compound-result-principal').textContent = formatCurrency(principal);
    document.getElementById('compound-result-interest').textContent = formatCurrency(interest);
    document.getElementById('compound-result-total').textContent = formatCurrency(total);
    
    // Diagramm erstellen
    createCompoundChart(principal, rate, time, frequency);
}

// Kreditberechnung
function calculateLoan() {
    // Eingabewerte abrufen
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const annualRate = parseFloat(document.getElementById('loan-rate').value) / 100;
    const loanTerm = parseFloat(document.getElementById('loan-term').value);
    const paymentFrequency = parseInt(document.getElementById('payment-frequency').value);
    
    // Berechnung
    const numberOfPayments = loanTerm * paymentFrequency;
    const ratePerPeriod = annualRate / paymentFrequency;
    
    // Monatliche Rate berechnen (PMT-Formel)
    const payment = loanAmount * (ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPayments)) / 
                   (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);
    
    const totalPayment = payment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    // Ergebnisse anzeigen
    document.getElementById('loan-result-payment').textContent = formatCurrency(payment);
    document.getElementById('loan-result-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('loan-result-total').textContent = formatCurrency(totalPayment);
    
    // Tilgungsplan erstellen
    createAmortizationTable(loanAmount, annualRate, loanTerm, paymentFrequency, payment);
    
    // Diagramm erstellen
    createLoanChart(loanAmount, totalInterest);
}

// Sparplanberechnung
function calculateSavings() {
    // Eingabewerte abrufen
    const initialAmount = parseFloat(document.getElementById('savings-initial').value);
    const regularContribution = parseFloat(document.getElementById('savings-contribution').value);
    const annualRate = parseFloat(document.getElementById('savings-rate').value) / 100;
    const savingsTerm = parseFloat(document.getElementById('savings-time').value);
    const contributionFrequency = parseInt(document.getElementById('savings-frequency').value);
    
    // Berechnung
    const numberOfContributions = savingsTerm * contributionFrequency;
    const ratePerPeriod = annualRate / contributionFrequency;
    
    // Endkapital berechnen
    // Formel für regelmäßige Einzahlungen mit Zinseszins
    const futureValueOfSeries = regularContribution * ((Math.pow(1 + ratePerPeriod, numberOfContributions) - 1) / ratePerPeriod);
    
    // Anfangskapital mit Zinseszins
    const futureValueOfPrincipal = initialAmount * Math.pow(1 + ratePerPeriod, numberOfContributions);
    
    const totalContributions = initialAmount + (regularContribution * numberOfContributions);
    const totalFutureValue = futureValueOfPrincipal + futureValueOfSeries;
    const totalInterest = totalFutureValue - totalContributions;
    
    // Ergebnisse anzeigen
    document.getElementById('savings-result-contributions').textContent = formatCurrency(totalContributions);
    document.getElementById('savings-result-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('savings-result-total').textContent = formatCurrency(totalFutureValue);
    
    // Diagramm erstellen
    createSavingsChart(initialAmount, regularContribution, annualRate, savingsTerm, contributionFrequency);
}

// Tilgungsplan erstellen
function createAmortizationTable(loanAmount, annualRate, loanTerm, paymentFrequency, payment) {
    const tableBody = document.querySelector('#amortization-table tbody');
    tableBody.innerHTML = '';
    
    const numberOfPayments = loanTerm * paymentFrequency;
    const ratePerPeriod = annualRate / paymentFrequency;
    
    let remainingBalance = loanAmount;
    
    // Maximal 60 Einträge anzeigen, um Performance-Probleme zu vermeiden
    const maxEntries = Math.min(numberOfPayments, 60);
    
    for (let i = 1; i <= maxEntries; i++) {
        const interestPayment = remainingBalance * ratePerPeriod;
        const principalPayment = payment - interestPayment;
        remainingBalance -= principalPayment;
        
        // Negative Restschuld verhindern (Rundungsfehler)
        if (remainingBalance < 0) remainingBalance = 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${formatCurrency(payment)}</td>
            <td>${formatCurrency(interestPayment)}</td>
            <td>${formatCurrency(principalPayment)}</td>
            <td>${formatCurrency(remainingBalance)}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Hinweis hinzufügen, wenn nicht alle Zahlungen angezeigt werden
    if (numberOfPayments > maxEntries) {
        const noteRow = document.createElement('tr');
        noteRow.innerHTML = `
            <td colspan="5" style="text-align: center; font-style: italic;">
                Nur die ersten ${maxEntries} von ${numberOfPayments} Zahlungen werden angezeigt.
            </td>
        `;
        tableBody.appendChild(noteRow);
    }
}

// Diagramm für Zinseszins erstellen
function createCompoundChart(principal, rate, time, frequency) {
    const ctx = document.getElementById('compound-chart').getContext('2d');
    
    // Alte Diagramme löschen
    if (window.compoundChart instanceof Chart) {
        window.compoundChart.destroy();
    }
    
    // Datenpunkte generieren
    const labels = [];
    const principalData = [];
    const interestData = [];
    
    const n = frequency;
    const r = rate;
    
    for (let t = 0; t <= time; t++) {
        labels.push(t);
        principalData.push(principal);
        
        const total = principal * Math.pow(1 + r/n, n*t);
        const interest = total - principal;
        interestData.push(interest);
    }
    
    // Diagramm erstellen
    window.compoundChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Anfangskapital',
                    data: principalData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Zinsen',
                    data: interestData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Jahre'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Betrag (€)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Kapitalentwicklung mit Zinseszins'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });
}

// Diagramm für Kreditberechnung erstellen
function createLoanChart(loanAmount, totalInterest) {
    const ctx = document.getElementById('loan-chart').getContext('2d');
    
    // Alte Diagramme löschen
    if (window.loanChart instanceof Chart) {
        window.loanChart.destroy();
    }
    
    // Diagramm erstellen
    window.loanChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Kreditbetrag', 'Zinsen'],
            datasets: [{
                data: [loanAmount, totalInterest],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Kreditkosten'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatCurrency(context.raw) + 
                                   ' (' + (context.raw / (loanAmount + totalInterest) * 100).toFixed(1) + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Diagramm für Sparplan erstellen
function createSavingsChart(initialAmount, regularContribution, annualRate, savingsTerm, contributionFrequency) {
    const ctx = document.getElementById('savings-chart').getContext('2d');
    
    // Alte Diagramme löschen
    if (window.savingsChart instanceof Chart) {
        window.savingsChart.destroy();
    }
    
    // Datenpunkte generieren
    const labels = [];
    const principalData = [];
    const contributionsData = [];
    const interestData = [];
    
    const n = contributionFrequency;
    const r = annualRate / n;
    
    let runningPrincipal = initialAmount;
    let runningContributions = 0;
    let runningTotal = initialAmount;
    
    for (let year = 0; year <= savingsTerm; year++) {
        labels.push(year);
        
        // Berechnung für jedes Jahr
        if (year > 0) {
            for (let i = 0; i < n; i++) {
                // Zinsen für diese Periode
                const interestThisPeriod = runningTotal * r;
                
                // Beitrag hinzufügen
                runningTotal += interestThisPeriod + regularContribution;
                runningContributions += regularContribution;
            }
        }
        
        principalData.push(initialAmount);
        contributionsData.push(runningContributions);
        interestData.push(Math.max(0, runningTotal - initialAmount - runningContributions));
    }
    
    // Diagramm erstellen
    window.savingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Anfangskapital',
                    data: principalData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Einzahlungen',
                    data: contributionsData,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Zinsen',
                    data: interestData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Jahre'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Betrag (€)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Sparplanentwicklung'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });
} 