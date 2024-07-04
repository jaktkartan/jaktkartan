// Funktioner för att toggle väderfliken, knapparna i bottenpanelen och särskilt för kaliberkravsfliken som ger användaren två knappar för att välja vilken flik som ska visas.
// Ladda GeoJSON-filen med Sveriges länspolygoner.
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

        // Visa rull-lista för att välja annat län direkt
        showCountySelection(savedPosition); // Flyttad hit för att visa rull-listan först

        // Ladda GeoJSON-filen och avgör län baserat på sparade koordinater
        loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
            .then(geojson => {
                var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);

                if (county === 'Okänt län') {
                    var noDataInfo = document.createElement('p');
                    noDataInfo.textContent = 'Ingen data tillgänglig för detta län.';
                    tab.appendChild(noDataInfo);
                } else {
                    loadCountyGoogleSheet(county, savedPosition);
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
    var options = ['BLEKINGE LÄN', 'DALARNAS LÄN', 'GOTLANDS LÄN', 'GÄVLEBORGS LÄN', 'HALLANDS LÄN', 
    'JÄMTLANDS LÄN', 'JÖNKÖPINGS LÄN', 'KALMARS LÄN', 'KRONOBERGS LÄN', 'NORRBOTTENS LÄN', 
    'SKÅNES LÄN', 'STOCKHOLMS LÄN', 'SÖDERMANLANDS LÄN', 'UPPSALA LÄN', 'VÄRMLANDS LÄN', 
    'VÄSTERBOTTENS LÄN', 'VÄSTERNORRLAND', 'VÄSTMANLANDS LÄN', 'VÄSTRA GÖTALAND', 
    'ÖREBROS LÄN', 'ÖSTERGÖTLANDS LÄN'];
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

    // Bygg URL för Google Sheets baserat på det valda länet
    var googleSheetsURL = getGoogleSheetsURL(county);

    // Visa Google Sheets i en iframe om URL är definierad
    if (googleSheetsURL) {
        var iframe = document.createElement('iframe');
        iframe.src = googleSheetsURL;
        iframe.style.width = '100%';
        iframe.style.height = '1400px'; // Justera höjden efter behov
        iframe.setAttribute('frameborder', '0');
        tab.appendChild(iframe);
    } else {
        var noDataInfo = document.createElement('p');
        noDataInfo.textContent = 'Ingen data tillgänglig för detta län.';
        tab.appendChild(noDataInfo);
    }
}

// Funktion för att få Google Sheets URL baserat på län
function getGoogleSheetsURL(county) {
    switch (county.toUpperCase()) {
        case 'BLEKINGE LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'DALARNAS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdU_PeaOHXTCF6kaZb0k-431-WY47GIhhfJHaXD17-fC72GvBp2j1Tedcoko-cHQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'GOTLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnahCXZhD9i9dBjwHe70vxPgeoOE6bG7syOVElw-yYfTzFoh_ANDxov5ttmQWYCw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'GÄVLEBORGS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQAkbQ_UO-ynOXpzz2SKTx-Cz3m4Y7Z35ptVV1OMlGVXtQl-YbfR9OkM0_a5m14EA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'HALLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQjeA3Jd2AEIXeVcAAyuwySeSHiNRJFXuDmbIH7xxA65ZV3bgHG-SDd8l4CoRYOw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'JÄMTLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5bsutvaz4sqS7reKPfTluBQKQixleLMPT5sFT6sDLKKOPHMiKbHXPL5HS2xfWzQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'JÖNKÖPINGS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTSzUIiJ7HEesADExNcVhR4yMjipznpT4H6vPa-MdjGb_y1lBvUIUB_LW4I2kBPrw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'KALMARS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT18OpbB5O1u_joK5tT1OfqG3g7MgxJWEz9xGGB1Tz4u8G22twEg8d-nDJJIfQnEw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'KRONOBERGS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTO-LI4P2awMrVSMtTTEdCPL5y2_tB8GZ3xh_dMDoXAlpVR0u2iGZc2lDvnN5W3pw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'NORRBOTTENS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSK4qXgmb_fH8yWxq-Blnj2aEbhrYBGW3ipFOyPuyIow0kS16lTgfdGcdKONDTaWA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'SKÅNES LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRAAfXtJ9PQJArIzmrZHDf7P9v50FEfCdOsYJh0llhCWrqop0I12bniLHL25X3iw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'STOCKHOLMS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5Roh8rTLBvl0MBU6slLfClu5WNYa9RVCB8fZ3-SdfXSE7Ds47TcuRi2w0a_5VwQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'SÖDERMANLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPfDBgr2aSSNOMIjN0UBjxzbnASq4k2tI8tttRmY7FbUNqByTL1QZy5D5N4q93hg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'UPPSALA LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSY5r8U6m_Tp0DErXeg3GAH5QGQjaT9GnTOV6PiChhvjU5GLWJiqz80VPUjckuTog/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'VÄRMLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTR-QhDE0xrc9Hg52G-X1cZrkxetWl-0gCmN-5AW73ADhdmff_korAa3nKq__n0Tg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'VÄSTERBOTTENS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5W_hadnVi5XJ7YB4mCeNUEOZXT1gTPw4a_4BbkJjVoT-iPFFJp0UjtCW1dpG9fg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'VÄSTERNORRLAND':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vROc88rHGQIRPBVvNRFjq2soEySu8eUKRA7JyrqlkD8ECmXomSTNpnOT18yHs8h4Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'VÄSTMANLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj-XkGP4D5LDsZ5RXgkW39sES-F3CrMbEbcjNzBePiHbPKuG82_aPKoUakVaMbEA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'VÄSTRA GÖTALAND':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0c5C5D9GD9-Y_eEcZV0gO4ELc8Iv7uqxh9yTpcT0xB-iZsDEKls6PxRSbCHU3gA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'ÖREBROS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBRoJ2e8G_G54lyHfgsXfg5yMFllgED3OaiAPNK2E_X9sRiUNpYOZti6JXjTBGfw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        case 'ÖSTERGÖTLANDS LÄN':
            return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMGvBtJrXYV0o3c7MyVsBDtK3jAe1ktKb-tQzKdv0rDgbg5AZ8jQ0vn7UN_kAaXQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
        default:
            return null; // Returnera null om länet inte matchar något känt
    }
}

// Visa den sparade positionen när sidan laddas
window.addEventListener('DOMContentLoaded', displaySavedUserPosition);


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
