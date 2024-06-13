// Skapa ett namnområde för Kartor_geojsonHandler
var Kartor_geojsonHandler = (function() {
    // Deklarera globala variabler för att spåra lagrets tillstånd och geojson-lager
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false
    };

    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': []
    };

    // Funktion för att lägga till CSS-stilar till <style> taggen i <head> av din HTML-dokument
    function addPopupStyles() {
        if (!document.querySelector('style#popupStyles')) {
            var styleTag = document.createElement('style');
            styleTag.textContent = popupStyles;
            styleTag.id = 'popupStyles'; // Sätt ett id för att kolla om stilen redan finns
            document.head.appendChild(styleTag);
        }
    }

    // Funktion för att skapa en marker med popup-fönster för bilder och text från GeoJSON
    function createMarkerWithPopup(map, feature) {
        console.log('Creating marker with popup for feature:', feature);

        var properties = feature.properties;
        var popupContent = '';

        // Loopa igenom alla egenskaper och samla både bilder och text i popup-innehållet
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var value = properties[key];
                if (typeof value === 'string' && isImageUrl(value)) {
                    // Om det är en bild-URL, lägg till en <img> tagg i popup-innehållet
                    popupContent += `<img src="${value}" alt="Image"><br>`;
                } else if (value !== null && typeof value !== 'object') {
                    // Om det är text (inte null och inte en objekt), lägg till det som text i popup-innehållet
                    popupContent += `<strong>${key}:</strong> ${value}<br>`;
                }
            }
        }

        if (popupContent !== '') {
            var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(map);
            var popup = L.popup({
                maxWidth: 300, // Sätt maxbredd för popup-fönster
                maxHeight: 400, // Sätt maxhöjd för popup-fönster
                autoPan: true, // Automatisk panorering för att visa hela popup-fönstret inom kartans synliga område
                closeButton: false, // Inget stängknapp i popup-fönstret
                closeOnClick: false // Stäng inte popup-fönstret när användaren klickar på kartan
            }).setContent(popupContent);

            // Sätt ett högt z-index-värde för popup-fönstret
            popup.getElement().style.zIndex = '10000';

            marker.bindPopup(popup);

            // Lägg till en klickhändelse för markören
            marker.on('click', function () {
                console.log('Marker clicked, opening popup');
                this.openPopup(); // Öppna popup-fönstret
                this.bringToFront(); // Flytta markören till främsta plan i förhållande till andra markörer

                // Justera z-index direkt på popup-fönstret
                var popupElement = this.getPopup().getElement();
                if (popupElement) {
                    console.log('Setting popup z-index to 2000');
                    popupElement.style.zIndex = '2000'; // Anpassa z-index efter behov för att popup-fönstret ska ligga över annat innehåll
                }
            });
        }
    }

    // Funktion för att avgöra om en given sträng är en giltig bild-URL
    function isImageUrl(url) {
        return (url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null);
    }

    // Funktion för att hämta GeoJSON-data och skapa lagret
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var layer = L.geoJSON(response.data, {
                        onEachFeature: function(feature, layer) {
                            // Anropa createMarkerWithPopup för att skapa markör med popup-fönster
                            createMarkerWithPopup(map, feature);
                        }
                    }).addTo(map);
                    // Lägg till lagret i geojsonLayers arrayen
                    geojsonLayers[layerName].push(layer);
                })
                .catch(function(error) {
                    console.log("Error fetching GeoJSON data:", error.message);
                });
        });
        // Uppdatera layerIsActive för det aktuella lagret
        layerIsActive[layerName] = true;
    }

    // Funktion för att tända och släcka lagret
    function toggleLayer(layerName, geojsonURLs) {
        if (!layerIsActive[layerName]) {
            // Om lagret inte är aktivt, lägg till lagret på kartan
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            // Om lagret är aktivt, ta bort lagret från kartan
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            // Töm geojsonLayers arrayen för det aktuella lagret
            geojsonLayers[layerName] = [];
            // Uppdatera layerIsActive för det aktuella lagret
            layerIsActive[layerName] = false;
        }
    }

    // Returnera offentliga metoder och variabler
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
