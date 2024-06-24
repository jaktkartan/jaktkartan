// Funktioner för att toggle väderfliken, knapparna i bottenpanelen och särskilt för kaliberkravsfliken som ger användaren två knappar för att välja vilken flik som ska visas.

// Funktion för att toggle väderpanelen
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

// Ladda GeoJSON-filen med Sveriges länspolygoner
async function loadGeoJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to load GeoJSON file');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
        return null;
    }
}

// Jämför användarens sparade position med länspolygoner
function findCountyForCoordinates(latitude, longitude, geojson) {
    if (!geojson || !geojson.features) {
        console.error('GeoJSON data is invalid.');
        return 'Okänt län';
    }

    for (let feature of geojson.features) {
        if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
            for (let polygon of feature.geometry.coordinates) {
                if (isPointInPolygon([longitude, latitude], polygon)) {
                    return feature.properties.LÄN;
                }
            }
        }
    }

    return 'Okänt län'; // Om ingen matchning hittades
}

// Funktion för att avgöra om en punkt ligger inuti en polygon
function isPointInPolygon(point, polygon) {
    if (!polygon || polygon.length === 0 || polygon[0].length === 0) {
        return false;
    }

    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++) {
        let xi = polygon[0][i][0], yi = polygon[0][i][1];
        let xj = polygon[0][j][0], yj = polygon[0][j][1];

        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Hämta användarens sparade position från localStorage
function getSavedUserPosition() {
    var storedPosition = localStorage.getItem('lastKnownPosition');
    if (storedPosition) {
        var { latitude, longitude } = JSON.parse(storedPosition);
        return { latitude, longitude };
    } else {
        return null; // Returnera null om ingen position är sparad
    }
}

// Visa användarens sparade position i fliken
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

        // Visa rull-lista för att välja annat län direkt
        showCountySelection(savedPosition); // Flyttad hit för att visa rull-listan först

        // Ladda GeoJSON-filen och avgör län baserat på sparade koordinater
        loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
            .then(geojson => {
                var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);

                // Bygg URL för Google Sheets baserat på länets namn
                var googleSheetsURL;
                switch (county.toUpperCase()) {
                    case '':
                        googleSheetsURL = '';
                        break;
                    case 'BLEKINGES LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;
                    case 'DALARNAS LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdU_PeaOHXTCF6kaZb0k-431-WY47GIhhfJHaXD17-fC72GvBp2j1Tedcoko-cHQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;
                    case 'GOTLANDS LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnahCXZhD9i9dBjwHe70vxPgeoOE6bG7syOVElw-yYfTzFoh_ANDxov5ttmQWYCw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;
                    case 'GÄVLEBORGS LÄN':
                        googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKBoQAP9xihDzgBbm3t_SFZ70leHTWK0tJ82v1koj9QzSFJQxxkPmKLwATSoAPMA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                        break;

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

// Funktion för att visa en lista över län för att välja ett annat län
function showCountySelection(savedPosition) {
    var tab = document.getElementById('tab3');
    var countyList = document.createElement('div');
    countyList.className = 'county-list';
    tab.appendChild(countyList);

    var select = document.createElement('select');
    countyList.appendChild(select);
    
    // Lägg till ett tomt alternativ först
    var optionElement = document.createElement('option');
    optionElement.textContent = 'Välj annat län'; // Tomt alternativ
    select.appendChild(optionElement);
    
    // Alternativ för varje län
    var options = ['BLEKINGES LÄN', 'DALARNAS LÄN', 'GOTLANDS LÄN', 'GÄVLEBORGS LÄN'];
    options.forEach(option => {
        var optionElement = document.createElement('option');
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    // Lyssnare för val av län
    select.addEventListener('change', function() {
        var selectedCounty = select.value;
        loadCountyGoogleSheet(selectedCounty, savedPosition);
    });
}

// Funktion för att ladda Google Sheets för det valda länet
function loadCountyGoogleSheet(county, savedPosition) {
    var tab = document.getElementById('tab3');
    tab.innerHTML = '';

    var heading = document.createElement('h2');
    heading.textContent = 'Jaktbart idag - ' + county;
    tab.appendChild(heading);

    var positionInfo = document.createElement('p');
    positionInfo.textContent = 'Senast sparad position: Latitud ' + savedPosition.latitude.toFixed(6) + ', Longitud ' + savedPosition.longitude.toFixed(6);
    tab.appendChild(positionInfo);

    // Bygg URL för Google Sheets baserat på det valda länet
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
        case 'GÄVLEBORGS LÄN':
            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKBoQAP9xihDzgBbm3t_SFZ70leHTWK0tJ82v1koj9QzSFJQxxkPmKLwATSoAPMA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
            break;

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

        displaySavedUserPosition(); // Anropar direkt för att visa rull-listan
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
