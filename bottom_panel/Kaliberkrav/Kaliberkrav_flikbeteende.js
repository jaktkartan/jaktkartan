document.addEventListener("DOMContentLoaded", function() {
    var kaliberkravTabButton = document.querySelector("#kaliberkrav-tab-button");
    var kaliberkravTabContent = document.querySelector("#tab4");

    kaliberkravTabButton.addEventListener("click", function() {
        // Visa Kaliberkrav-fliken
        kaliberkravTabContent.style.display = "block";
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        hideOtherTabs(kaliberkravTabContent);
    });

    // Funktion för att dölja andra flikar (om det behövs)
    function hideOtherTabs(activeTab) {
        var allTabs = document.querySelectorAll(".tab-pane");
        allTabs.forEach(function(tab) {
            if (tab !== activeTab) {
                tab.style.display = "none";
            }
        });
    }
});
