// fabHandler.js

// Variabel för att hålla reda på den aktiva knappen
var activeButton = null;

// Funktion som hanterar knapptryck
function handleButtonClick(buttonType, geojsonUrls) {
    // Visa FAB-knappen
    var fabButton = document.getElementById('fab-button');
    fabButton.style.display = 'flex';

    // Uppdatera aktiv knapp
    activeButton = buttonType;

    // Kalla på funktionen för att toggla lager
    Kartor_geojsonHandler.toggleLayer(buttonType, geojsonUrls);
}

// Funktion som hanterar FAB-knappens klickhändelse
function handleFabClick() {
    if (activeButton === 'Allmän jakt: Däggdjur') {
        // Gör något specifikt för Däggdjur
        console.log('FAB för Däggdjur klickad');
    } else if (activeButton === 'Allmän jakt: Fågel') {
        // Gör något specifikt för Fågel
        console.log('FAB för Fågel klickad');
    } else if (activeButton === 'Älgjaktskartan') {
        // Gör något specifikt för Älgjaktskartan
        console.log('FAB för Älgjaktskartan klickad');
    }
}

// Globala variabler för kartan och lager
var map;
var layers = {};

// Funktion för att toggla lager
function toggleLayer(layerName, geojsonUrls) {
    if (layers[layerName]) {
        // Om lagret redan finns, ta bort det
        map.removeLayer(layers[layerName]);
        delete layers[layerName];
    } else {
        // Skapa ett nytt lager och lägg till det på kartan
        layers[layerName] = L.layerGroup();
        geojsonUrls.forEach(function(url) {
            axios.get(url).then(function(response) {
                var geojsonLayer = L.geoJson(response.data);
                layers[layerName].addLayer(geojsonLayer);
            }).catch(function(error) {
                console.error('Error loading GeoJSON:', error);
            });
        });
        layers[layerName].addTo(map);
    }
}

// Exportera funktionerna om de används i andra filer
export { handleButtonClick, handleFabClick, toggleLayer };

