document.addEventListener("DOMContentLoaded", function() {
    var upptackTabButton = document.querySelector("#upptack-tab-button");
    var upptackTabContent = document.querySelector("#tab1");

    upptackTabButton.addEventListener("click", function() {
        // Visa Upptäck-fliken
        upptackTabContent.style.display = "block";
        
        // Tillämpa CSS-klassen för höjd och andra egenskaper
        upptackTabContent.classList.add("tab1");
        
        // Dölj andra flikar om det behövs (beroende på din implementation)
        hideOtherTabs(upptackTabContent);
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
