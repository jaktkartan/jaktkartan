document.addEventListener("DOMContentLoaded", function() {
    var jaktkollenTabButton = document.querySelector("#jaktkollen-tab-button");
    var jaktkollenTabContent = document.querySelector("#tab5");

    jaktkollenTabButton.addEventListener("click", function() {
        // Visa Jaktkollen-fliken
        jaktkollenTabContent.style.display = "block";
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        hideOtherTabs(jaktkollenTabContent);
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
