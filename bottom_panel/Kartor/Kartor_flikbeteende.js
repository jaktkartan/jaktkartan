document.addEventListener("DOMContentLoaded", function() {
    var kartorTabButton = document.querySelector("#kartor-tab-button");
    var kartorTabContent = document.querySelector("#tab2");

    kartorTabButton.addEventListener("click", function() {
        // Visa Kartor-fliken
        kartorTabContent.style.display = "block";
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        hideOtherTabs(kartorTabContent);
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
