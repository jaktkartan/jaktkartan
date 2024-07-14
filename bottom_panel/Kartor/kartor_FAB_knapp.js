// JavaScript-filen för att hantera FAB-knappen

// Funktion för att visa FAB-knappen
function showFABButton() {
    var fabButton = document.getElementById('fab-button');
    fabButton.style.display = 'flex';
}

// Lägg till event listeners på knapparna i Kartor.html
document.addEventListener("DOMContentLoaded", function() {
    var buttons = document.querySelectorAll('#tab2 .button-container .styled-button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            showFABButton();
        });
    });
});
