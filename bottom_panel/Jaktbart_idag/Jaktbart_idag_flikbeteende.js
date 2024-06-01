document.addEventListener("DOMContentLoaded", function() {
    var jaktbartIdagTabButton = document.querySelector("#jaktbart-idag-tab-button");
    var jaktbartIdagTabContent = document.querySelector("#tab3");

    jaktbartIdagTabButton.addEventListener("click", function() {
        // Visa Jaktbart idag-fliken
        jaktbartIdagTabContent.style.display = "block";
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        hideOtherTabs(jaktbartIdagTabContent);
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
