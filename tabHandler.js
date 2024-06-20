// Funktion för att hantera väderpanelen och geolocation
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

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs(); // Återställ alla flikar innan en ny öppnas
    var tab = document.getElementById(tabId);
    tab.style.display = 'block'; // Visa den valda fliken
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block'; // Visa flikinnehållet

    if (tabId === 'tab4') {
        openTab4();
    } else if (tabId === 'tab3') {
        openTab3('bottom_panel/Jaktbart_idag/Jaktbart_idag.html'); // Ladda Jaktbart idag innehåll
        // Anropa updateUserPosition här om det behövs
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

// Funktion för att öppna Jaktbart idag fliken (tab3) och uppdatera användarens position
function openTab3(url) {
    var tabContent = document.getElementById('tab3');
    fetch(url)
        .then(response => response.text())
        .then(html => {
            tabContent.innerHTML = html;
            // Anropa updateUserPosition här om det behövs
            // Exempel:
            updateUserPosition(latitude, longitude, accuracy); // Ersätt med faktiska värden
        })
        .catch(error => {
            console.error('Error fetching Jaktbart idag content:', error);
        });
}

// Funktion för att öppna Kaliberkrav fliken (tab4)
function openTab4() {
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
    };
    tabContent.appendChild(button1);

    var button2 = document.createElement('button');
    button2.textContent = 'Kaliberkrav: Fågel';
    button2.onclick = function() {
        openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
    };
    tabContent.appendChild(button2);
}

// Funktion för att öppna Kaliberkrav-fliken
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

    // Dölj rubriken och brödtexten initialt
    heading.style.display = 'none';
    paragraph.style.display = 'none';

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

// Funktion för att stänga flikinnehållet
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Stäng flikinnehållet när man klickar utanför det
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        closeTabContent();
    }
});

