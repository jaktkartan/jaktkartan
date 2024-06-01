document.addEventListener('DOMContentLoaded', function() {
    // Hämta referens till flikknappen för Kartor-fliken
    var kartorTabButton = document.querySelector('#bottom-panel #tab2-button');

    // Hämta referens till innehållet för Kartor-fliken
    var kartorTabContent = document.querySelector('#tab2');

    // Lyssnare för klick på flikknappen
    kartorTabButton.addEventListener('click', function() {
        // Visa Kartor-fliken
        kartorTabContent.style.display = 'block';
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        // Exempel:
        // hideOtherTabs();
    });

    // Funktion för att dölja andra flikar (om det behövs)
    function hideOtherTabs() {
        // Loopa genom andra flikar och dölj dem
        // Exempel:
        // var otherTabs = document.querySelectorAll('.tab-pane:not(#tab2)');
        // otherTabs.forEach(function(tab) {
        //     tab.style.display = 'none';
        // });
    }
});

