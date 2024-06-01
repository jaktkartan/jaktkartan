document.addEventListener('DOMContentLoaded', function() {
    // Hämta referens till flikknappen för Upptäck-fliken
    var upptackTabButton = document.querySelector('#bottom-panel #tab1-button');

    // Hämta referens till innehållet för Upptäck-fliken
    var upptackTabContent = document.querySelector('#tab1');

    // Lyssnare för klick på flikknappen
    upptackTabButton.addEventListener('click', function() {
        // Visa Upptäck-fliken
        upptackTabContent.style.display = 'block';
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        // Exempel:
        // hideOtherTabs();
    });

    // Funktion för att dölja andra flikar (om det behövs)
    function hideOtherTabs() {
        // Loopa genom andra flikar och dölj dem
        // Exempel:
        // var otherTabs = document.querySelectorAll('.tab-pane:not(#tab1)');
        // otherTabs.forEach(function(tab) {
        //     tab.style.display = 'none';
        // });
    }
});

