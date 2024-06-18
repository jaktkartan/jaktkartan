// Jaktbart_idag_flikbeteende.js

function openTab(tabId, url) {
    var i, tabcontent;

    // Dölj alla flikar
    tabcontent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Visa den valda fliken
    var tab = document.getElementById(tabId);
    tab.style.display = "block";

    // Ladda innehållet i iframen om det är tab3 och om den inte redan är laddad
    if (tabId === 'tab3' && tab.innerHTML.trim() === '') {
        if (typeof updateUserPosition === 'function') {
            const userLocation = updateUserPosition();

            if (userLocation) {
                const { latitude, longitude } = userLocation;
                determineCounty(latitude, longitude)
                    .then(county => {
                        const sheetUrl = getGoogleSheetUrlForCounty(county);
                        tab.innerHTML = '<iframe src="' + sheetUrl + '" style="width: 100%; height: 100vh;"></iframe>';
                    })
                    .catch(error => {
                        console.error('Error determining county:', error);
                    });
            } else {
                console.error('User location is not available');
            }
        } else {
            console.error('updateUserPosition function is not available');
        }
    }
}

function determineCounty(latitude, longitude) {
    return fetch('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
        .then(response => response.json())
        .then(data => {
            for (let feature of data.features) {
                if (isPointInPolygon([longitude, latitude], feature.geometry.coordinates[0])) {
                    return feature.properties.lan; // Assuming 'lan' is the property name for county
                }
            }
            throw new Error('County not found.');
        });
}

function isPointInPolygon(point, polygon) {
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];
        var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function getGoogleSheetUrlForCounty(county) {
    // Define your mapping from county to Google Sheet URL
    const countyToSheetUrl = {
        'Stockholm': 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_1/edit',
        'Uppsala': 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_2/edit',
        // Add other counties and their corresponding URLs
    };
    return countyToSheetUrl[county] || 'https://docs.google.com/spreadsheets/d/DEFAULT_SHEET_ID/edit';
}
