// Funktioner för att toggle väderfliken, knapparna i bottenpanelen och särskilt för kaliberkravsfliken som ger användaren två knappar för att välja vilken flik som ska visas.

function togglePanel() {
    console.log("Toggling weather panel...");
    var weatherInfo = document.getElementById('weather-info');
    if (weatherInfo.style.display === 'none') {
        console.log("Showing weather panel...");
        weatherInfo.style.display = 'block';
        getUserPosition(function(lat, lon) {
            console.log("Current position:", lat, lon);
            getWeatherForecast(lat, lon);
        }, function(error) {
            console.error("Error getting position:", error);
        });
    } else {
        console.log("Hiding weather panel...");
        weatherInfo.style.display = 'none';
    }
}

// Funktion för att hämta den sparade positionen från localStorage
function getSavedUserPosition() {
    var storedPosition = localStorage.getItem('lastKnownPosition');
    if (storedPosition) {
        var { latitude, longitude } = JSON.parse(storedPosition);
        return { latitude, longitude };
    } else {
        return null; // Returnera null om ingen position är sparad
    }
}

// Funktion för att visa användarens sparade position i fliken
function displaySavedUserPosition() {
    var savedPosition = getSavedUserPosition();
    if (savedPosition) {
        var tab = document.getElementById('tab3'); // Antag att detta är ID för fliken där positionen ska visas
        tab.innerHTML = ''; // Rensa flikinnehållet

        // Rubrik för fliken
        var heading = document.createElement('h2');
        heading.textContent = 'Jaktbart idag';
        tab.appendChild(heading);

        // Visa sparade koordinater
        var positionInfo = document.createElement('p');
        positionInfo.textContent = 'Senast sparad position: Latitud ' + savedPosition.latitude.toFixed(6) + ', Longitud ' + savedPosition.longitude.toFixed(6);
        tab.appendChild(positionInfo);
    } else {
        console.log("Ingen sparad position hittades.");
    }
}

// Exempel på hur du kan anropa displaySavedUserPosition vid behov
document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});

// Övriga funktioner och händelselyssnare...


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
        tab.innerHTML = ''; // Rensa flikinnehållet

        // Rubrik för fliken
        var heading = document.createElement('h2');
        heading.textContent = 'Kaliberkrav';
        tab.appendChild(heading);

        // Brödtext för information
        var paragraph = document.createElement('p');
        paragraph.textContent = 'Kaliberkrav och lämplig hagelstorlek vid jakt';
        tab.appendChild(paragraph);

        var button1 = document.createElement('button');
        button1.textContent = 'Kaliberkrav: Däggdjur';
        button1.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
        };
        tab.appendChild(button1);

        var button2 = document.createElement('button');
        button2.textContent = 'Kaliberkrav: Fågel';
        button2.onclick = function() {
            openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
        };
        tab.appendChild(button2);
    } else if (tabId === 'tab3') {
        // Om det är tab3 (Jaktbart idag), visa användarens lagrade geolokationsinformation
        tab.innerHTML = ''; // Rensa flikinnehållet

        // Rubrik för fliken
        var heading = document.createElement('h2');
        heading.textContent = 'Jaktbart idag';
        tab.appendChild(heading);

        // Innehåll för geolokation
        var paragraph = document.createElement('p');
        paragraph.textContent = 'Senaste lagrade position:';
        tab.appendChild(paragraph);

        // Visa den senaste kända positionen om den är giltig
        if (lastKnownPosition && isPositionValid()) {
            var positionInfo = document.createElement('p');
            positionInfo.textContent = 'Latitud: ' + lastKnownPosition.latitude.toFixed(6) + ', Longitud: ' + lastKnownPosition.longitude.toFixed(6);
            tab.appendChild(positionInfo);
        } else {
            // Visa meddelande om ingen position är lagrad
            var noPositionInfo = document.createElement('p');
            noPositionInfo.textContent = 'Ingen lagrad position tillgänglig.';
            tab.appendChild(noPositionInfo);
        }
    } else {
        // Om det inte är tab4 eller tab3, hämta innehållet från den angivna URL:en
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

// Funktion för att öppna Kaliberkrav-fliken
function openKaliberkravTab(url) {
    var tabContent = document.getElementById('tab-content');
    var tab = document.createElement('div');
    tab.className = 'tab-pane';
    tabContent.appendChild(tab);

    // Hämta innehållet från den angivna URL:en
    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML += html; // Lägg till innehållet från URL:en

            // Visa innehållet och dölj rubriken och brödtexten igen
            tab.style.display = 'block';
            heading.style.display = 'none';
            paragraph.style.display = 'none';
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

// Funktion för att stänga flikinnehållet
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}
