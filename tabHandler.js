// Funktion för att visa användarens sparade position i fliken
function displaySavedUserPosition() {
    var savedPosition = getSavedUserPosition();
    if (savedPosition) {
        var tab = document.getElementById('tab3');
        tab.innerHTML = '';

        var heading = document.createElement('h2');
        heading.textContent = 'Jaktbart idag';
        tab.appendChild(heading);

        var positionInfo = document.createElement('p');
        positionInfo.textContent = 'Senast sparad position: Latitud ' + savedPosition.latitude.toFixed(6) + ', Longitud ' + savedPosition.longitude.toFixed(6);
        tab.appendChild(positionInfo);

        // Ladda GeoJSON-filen och avgör län baserat på sparade koordinater
        loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
            .then(geojson => {
                var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);

                // Bygg URL för Google Sheets baserat på länets namn
                var googleSheetsURL;
                switch (county.toUpperCase()) {
                    case 'BLEKINGES LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;
                    case 'DALARNAS LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdU_PeaOHXTCF6kaZb0k-431-WY47GIhhfJHaXD17-fC72GvBp2j1Tedcoko-cHQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;
                    case 'GOTLANDS LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnahCXZhD9i9dBjwHe70vxPgeoOE6bG7syOVElw-yYfTzFoh_ANDxov5ttmQWYCw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;
                    // Lägg till alla länens case här med motsvarande Google Sheets URL
                    default:
                        googleSheetsURL = ''; // Om län inte hittas, tom URL
                        break;
                }

                // Visa Google Sheets i en iframe om URL är definierad
                if (googleSheetsURL) {
                    var iframe = document.createElement('iframe');
                    iframe.src = googleSheetsURL;
                    iframe.style.width = '100%';
                    iframe.style.height = '600px'; // Justera höjden efter behov
                    iframe.setAttribute('frameborder', '0');
                    tab.appendChild(iframe);
                } else {
                    var noDataInfo = document.createElement('p');
                    noDataInfo.textContent = 'Ingen data tillgänglig för detta län.';
                    tab.appendChild(noDataInfo);
                }
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
                var errorInfo = document.createElement('p');
                errorInfo.textContent = 'Fel vid laddning av GeoJSON.';
                tab.appendChild(errorInfo);
            });
    } else {
        console.log("Ingen sparad position hittades.");
    }
}

// Funktion för att återställa flikarna till sitt ursprungliga tillstånd
function resetTabs() {
    var tabs = document.getElementsByClassName('tab-pane');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
        tabs[i].innerHTML = '';
    }
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs();
    var tab = document.getElementById(tabId);
    tab.style.display = 'block';
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block';

    if (tabId === 'tab4') {
        tab.innerHTML = '';

        var heading = document.createElement('h2');
        heading.textContent = 'Kaliberkrav';
        tab.appendChild(heading);

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
        tab.innerHTML = '';

        var heading = document.createElement('h2');
        heading.textContent = 'Jaktbart idag';
        tab.appendChild(heading);

        var paragraph = document.createElement('p');
        paragraph.textContent = 'Senaste lagrade position:';
        tab.appendChild(paragraph);

        displaySavedUserPosition(); // Anropa funktionen för att visa sparad position
    } else {
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

    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML += html;
            tab.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching Kaliberkrav content:', error);
        });
}

// Lyssnare för klick utanför flikar och panelknappar
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs();
    }
});

// Funktion för att stänga flikinnehåll
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Lyssnare för när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});
