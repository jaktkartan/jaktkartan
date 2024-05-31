// jaktkollenHandler.js

// Funktion för att hämta HTML-innehåll från en fil
function fetchHTMLContent(url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => data)
        .catch(error => console.error('Error fetching HTML content:', error));
}

// Funktion för att uppdatera sidans innehåll med det hämtade HTML-innehållet
function updateContent(data) {
    // Här kan du manipulera DOM för att infoga datan på lämpliga platser i din HTML-struktur
    document.getElementById('content').innerHTML = data;
}

// Funktion för att visa laddningsindikator medan HTML-innehållet hämtas
function showLoadingIndicator() {
    // Visa en laddningsindikator eller meddelande för användaren
}

// Funktion för att dölja laddningsindikator när HTML-innehållet har hämtats
function hideLoadingIndicator() {
    // Dölj laddningsindikatorn eller meddelandet för användaren
}

// Funktion för att initiera sidan och hämta HTML-innehållet
function init() {
    showLoadingIndicator(); // Visa laddningsindikator

    // Ange sökvägen till din HTML-fil (jaktkollen_stackedit.html)
    var htmlPath = 'bottom_panel/Jaktkollen_StackEdit.html';

    // Konstruera fullständig URL baserad på sökvägen till din HTML-fil
    var htmlURL = window.location.origin + '/' + htmlPath;

    // Hämta HTML-innehållet från filen
    fetchHTMLContent(htmlURL)
        .then(data => {
            updateContent(data); // Uppdatera sidans innehåll med det hämtade HTML-innehållet
            hideLoadingIndicator(); // Dölj laddningsindikator
        });
}

// Kör init-funktionen när sidan har laddats
document.addEventListener('DOMContentLoaded', init);
