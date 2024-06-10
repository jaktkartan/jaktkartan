// Uppdaterad openTab-funktion för att visa flikens innehåll och ladda dess data
function openTab(tabId, filePath) {
    console.log("Öppnar flik:", tabId, "med filväg:", filePath);
    var tabContent = document.getElementById('tab-content');
    var tabs = document.getElementsByClassName('tab-pane');

    // Dölj alla flikar först
    resetTabs();

    // Visa den aktuella fliken
    var activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';

    // Visa flikinnehållet
    tabContent.style.display = 'block';

    // Hämta och ladda flikens innehåll med hjälp av Axios
    axios.get(filePath)
        .then(function (response) {
            console.log("Innehåll hämtat för flik:", tabId);
            activeTab.innerHTML = response.data;
        })
        .catch(function (error) {
            console.log("Fel vid hämtning av innehåll för flik:", tabId, "Felmeddelande:", error.message);
        });
}

// Uppdaterad closeTabContent-funktion för att dölja flikinnehållet när man klickar utanför det
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Lägg till en händelselyssnare för att stänga flikinnehållet när man klickar utanför det
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        closeTabContent();
    }
});

// Anropa openTab-funktionen när dokumentet har laddats för att öppna den första fliken
document.addEventListener("DOMContentLoaded", function() {
    openTab('tab1', 'bottom_panel/Upptack/Upptack.html');
});
