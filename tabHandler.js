// Funktion för att återställa flikarna till sitt ursprungliga tillstånd
function resetTabs() {
    var tabs = document.getElementsByClassName('tab-pane');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none'; // Göm flikarna
        tabs[i].innerHTML = ''; // Ta bort innehållet i flikarna
    }
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none'; // Göm flikinnehållet
}

// Händelselyssnare för att hantera klick utanför flikarna och panelknapparna
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs(); // Återställ flikarna om användaren klickar utanför dem
    }
});

function togglePanel() {
    console.log("Toggling weather panel...");
    var weatherInfo = document.getElementById('weather-info');
    if (weatherInfo.style.display === 'none') {
        console.log("Showing weather panel...");
        weatherInfo.style.display = 'block';
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Getting current position...");
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            console.log("Current position:", latitude, longitude);
            getWeatherForecast(latitude, longitude);
        });
    } else {
        console.log("Hiding weather panel...");
        weatherInfo.style.display = 'none';
    }
} // Här stängs togglePanel-funktionen

function openTab(tabId, filePath) {
    console.log("Opening tab:", tabId, "with file path:", filePath);
    var tabContent = document.getElementById('tab-content');
    var tabs = document.getElementsByClassName('tab-pane');

    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }

    var activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';

    tabContent.style.display = 'block';

    axios.get(filePath)
        .then(function (response) {
            console.log("Successfully fetched content for tab:", tabId);
            activeTab.innerHTML = response.data;

            // Dynamiskt justera bottenhöjden på tab1 (Upptäck) baserat på panel-button höjden
            if (tabId === 'tab1') {
                var bottomPanelHeight = document.getElementById('bottom-panel').offsetHeight;
                activeTab.style.bottom = bottomPanelHeight + 'px';
                activeTab.style.height = 'calc(100vh - ' + bottomPanelHeight + 'px)';
            }
        })
        .catch(function (error) {
            console.log("Error fetching content for tab:", tabId, "Error message:", error.message);
        });
}

function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Close the tab content when clicking outside of it
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        closeTabContent();
    }
});
