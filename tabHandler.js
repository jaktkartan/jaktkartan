// Funktioner för toggle väder fliken, för knapparna i bottenpanelen och en specialarne för kaliberkrav fliken som först ger användaren 2 knappar för att välja vilken flik som ska visas.

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
}

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

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs(); // Återställ flikarna innan en ny öppnas
    var tab = document.getElementById(tabId);
    tab.style.display = 'block'; // Visa den valda fliken
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block'; // Visa flikinnehållet

    if (tabId === 'tab4') {
        // Om det är tab4 (Kaliberkrav), visa knapparna för alternativen
        var tabContent = document.getElementById('tab4');
        tabContent.innerHTML = ''; // Rensa flikinnehållet

        // Rubrik för fliken
        var heading = document.createElement('h2');
        heading.textContent = 'Kaliberkrav';
        tabContent.appendChild(heading);

        // Brödtext för information
        var paragraph = document.createElement('p');
        paragraph.textContent = 'Kaliberkrav och lämplig hagelstorlek vid jakt';
        tabContent.appendChild(paragraph);

        var button1 = document.createElement('button');
        button1.textContent = 'Kaliberkrav: Däggdjur';
        button1.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
            // Dölj rubriken och brödtexten när knappen klickas
            heading.style.display = 'none';
            paragraph.style.display = 'none';
        };
        tabContent.appendChild(button1);

        var button2 = document.createElement('button');
        button2.textContent = 'Kaliberkrav: Fågel';
        button2.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
            // Dölj rubriken och brödtexten när knappen klickas
            heading.style.display = 'none';
            paragraph.style.display = 'none';
        };
        tabContent.appendChild(button2);
    } else {
        // Om det inte är tab4 (Kaliberkrav), hämta innehållet från den angivna URL:en
        fetch(url)
            .then(response => response.text())
            .then(html => {
                tab.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching tab content:', error);
            });
    }
}

function openKaliberkravTab(url) {
    var tabContent = document.getElementById('tab-content');
    var tab = document.createElement('div');
    tab.className = 'tab-pane';
    tabContent.appendChild(tab);

    // Rubrik för fliken
    var heading = document.createElement('h2');
    heading.textContent = 'Kaliberkrav';
    tab.appendChild(heading);

    // Brödtext för information
    var paragraph = document.createElement('p');
    paragraph.textContent = 'Kaliberkrav och lämplig hagelstorlek vid jakt';
    tab.appendChild(paragraph);

    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML += html; // Lägg till innehållet från URL:en
        })
        .catch(error => {
            console.error('Error fetching Kaliberkrav content:', error);
        });
}

// Händelselyssnare för att hantera klick utanför flikarna och panelknapparna
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs(); // Återställ flikarna om användaren klickar utanför dem
    }
});

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
