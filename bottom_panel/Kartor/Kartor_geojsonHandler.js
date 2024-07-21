var Kartor_geojsonHandler = (function() {
    // Status för vilka lager som är aktiva
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Älgjaktskartan': false,
        'Älgjaktsområden': false // Nytt lager
    };

    // Objekt som lagrar GeoJSON-lager för varje lager
    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Älgjaktskartan': [],
        'Älgjaktsområden': null // Nytt lager
    };

    // Stilar för olika lager och GeoJSON-filer
    var layerStyles = {
        'Allmän jakt: Däggdjur': {
            'Rvjaktilvdalenskommun_1.geojson': { fillColor: 'orange', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'Allman_jakt_daggdjur_2.geojson': { fillColor: 'blue', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 }
        },
        'Allmän jakt: Fågel': {
            'Lnsindelning_1.geojson': { fillColor: 'yellow', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 },
            'Grnsfrripjaktilvdalenskommun_2.geojson': { fillColor: 'rgb(50, 94, 88)', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'GrnslvsomrdetillFinland_5.geojson': { fillColor: 'blue', color: 'blue', weight: 8, fillOpacity: 0.5, dashArray: '5, 10' },
            'NedanfrLappmarksgrnsen_3.geojson': { fillColor: '#fdae61', color: '#edf8e9', weight: 2, fillOpacity: 0.5, dashArray: '5, 10' },
            'OvanfrLapplandsgrnsen_4.geojson': { fillColor: '#a6d96a', color: '#edf8e9', weight: 2, fillOpacity: 0.5 }
        },
        'Älgjaktskartan': {
            'lgjaktJakttider_1.geojson': {
                style: (function() {
                    // Färgschema för jakttider
                    var colorScale = [
                        '#ffd54f', '#72d572', '#ff7043', '#1ba01b', '#20beea',
                        '#81d4fa', '#ab47bc', '#e9a6f4', '#78909c', '#9c8019', '#b5f2b5'
                    ];
                    var jakttidToColor = {};
                    var currentIndex = 0;
                    
                    // Returnerar en funktion som tilldelar färg baserat på jakttid
                    return function(feature) {
                        var jakttid = feature.properties['jakttid'];
                        if (!jakttidToColor[jakttid]) {
                            jakttidToColor[jakttid] = colorScale[currentIndex];
                            currentIndex = (currentIndex + 1) % colorScale.length;
                        }
                        return { fillColor: jakttidToColor[jakttid], color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.5 };
                    };
                })()
            },
            'Omrdemedbrunstuppehll_2.geojson': { fill: false, color: 'black', weight: 7, dashArray: '5, 10' }
        }
    };

    // Funktion för att hämta GeoJSON-data och skapa ett lager
    async function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        // Hämta GeoJSON-data från URL och skapa lager i ordning
        for (const geojsonURL of geojsonURLs) {
            try {
                const response = await axios.get(geojsonURL);
                const geojson = response.data;
                
                // Skapa GeoJSON-lager med stil och klickhändelse
                const layer = L.geoJSON(geojson, {
                    style: function(feature) {
                        var filename = getFilenameFromURL(geojsonURL);
                        return layerStyles[layerName][filename].style ? layerStyles[layerName][filename].style(feature) : layerStyles[layerName][filename];
                    },
                    onEachFeature: function(feature, layer) {
                        addClickHandlerToLayer(layer);
                    }
                });

                geojsonLayers[layerName].push(layer);

                // Lägg till lagret på kartan om det är aktivt
                if (layerIsActive[layerName]) {
                    layer.addTo(map);
                }
            } catch (error) {
                console.error("Error fetching GeoJSON data.");
            }
        }

        updateFAB(layerName, true);
    }

    // Funktion för att växla (aktivera/inaktivera) lager
    function toggleLayer(layerName, geojsonURLs) {
        // Inaktivera alla andra lager
        deactivateAllLayersKartor();

        if (!layerIsActive[layerName]) {
            // Markera lagret som aktivt
            layerIsActive[layerName] = true;

            // Om lagret är GeoJSON, hämta och lägg till det på kartan
            if (geojsonURLs) {
                fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
            } else if (layerName === 'Älgjaktsområden') {
                // Om det är Älgjaktsområden, ladda WMS-lagret
                loadElgjaktsomradenWMS(true);
            }
        } else {
            // Om lagret redan är aktivt, ta bort det
            deactivateLayer(layerName);
        }
    }

    // Funktion för att ladda eller ta bort WMS-lager för Älgjaktsområden
    function loadElgjaktsomradenWMS(add) {
        if (add) {
            // Lägg till WMS-lagret
            var wmsLayer = L.tileLayer.wms('https://geodata.naturvardsverket.se/arcgis/services/Inspire_SE_Harvest_object_Harvest_object_HR/MapServer/WmsServer', {
                layers: '0',
                format: 'image/png',
                transparent: true,
                attribution: 'Naturvårdsverket'
            }).addTo(map);
            geojsonLayers['Älgjaktsområden'] = wmsLayer;
        } else {
            if (geojsonLayers['Älgjaktsområden']) {
                // Ta bort WMS-lagret
                map.removeLayer(geojsonLayers['Älgjaktsområden']);
                geojsonLayers['Älgjaktsområden'] = null;
            }
        }
    }

    // Funktion för att inaktivera alla lager
    function deactivateAllLayersKartor() {
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                deactivateLayer(layerName);
            }
        });
    }

    // Funktion för att inaktivera ett specifikt lager
    function deactivateLayer(layerName) {
        // Ta bort alla GeoJSON-lager
        if (geojsonLayers[layerName] && geojsonLayers[layerName].length > 0) {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer); // Ta bort lager från kartan
            });
            geojsonLayers[layerName] = []; // Rensa listan med lager
        }

        // Ta bort WMS-lagret om det är aktivt
        if (layerName === 'Älgjaktsområden' && geojsonLayers[layerName]) {
            loadElgjaktsomradenWMS(false);
        }

        layerIsActive[layerName] = false; // Markera som inaktiv
        updateFAB(layerName, false);
    }

    // Funktion för att få filnamnet från en URL
    function getFilenameFromURL(url) {
        return url.split('/').pop();
    }

    // Funktion för att uppdatera FAB-knappen baserat på lagrets tillstånd
    function updateFAB(layerName, show) {
        var fabId = getFABId(layerName);
        var fabButton = document.getElementById(fabId);
        if (fabButton) {
            fabButton.style.display = show ? 'block' : 'none';
        }
    }

    // Hjälpfunktion för att få FAB-knappens ID baserat på lagrets namn
    function getFABId(layerName) {
        switch(layerName) {
            case 'Allmän jakt: Däggdjur':
                return 'fab-daggdjur';
            case 'Allmän jakt: Fågel':
                return 'fab-fagel';
            case 'Älgjaktskartan':
                return 'fab-alg';
            case 'Älgjaktsområden':
                return 'fab-alg-omraden'; // Nytt fall för Älgjaktsområden
            default:
                return '';
        }
    }

    // Exponerar funktionerna för att växla lager och hämta GeoJSON-data
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer,
        deactivateAllLayersKartor: deactivateAllLayersKartor, // Exponerar den nya funktionen
        loadElgjaktsomradenWMS: loadElgjaktsomradenWMS // Exponerar funktionen för WMS-lagret
    };
})();

// Separat funktion för att ladda FeatureLayer (t.ex. 'Älgjaktsområden')
function loadElgjaktsomradenFeatureLayer() {
    // Funktion för att generera en slumpmässig färg i en naturlig nyans
    function getRandomColor() {
        var hue = Math.floor(Math.random() * 360); // Färgton
        var lightness = Math.floor(Math.random() * 40) + 40; // Ljushet från 40 till 80
        return `hsl(${hue}, 70%, ${lightness}%)`;
    }

    // Färgcache för att bevara färger för varje feature
    var colorCache = {};

    // Skapa FeatureLayer
    var featureLayer = L.esri.featureLayer({
        url: 'https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/rest/services/Jaktadm/lst_jaktadm_visning/MapServer/0',
        style: function (feature) {
            // Om feature inte redan har en färg i cache, generera och spara i cache
            if (!colorCache[feature.id]) {
                colorCache[feature.id] = getRandomColor();
            }
            return {
                color: colorCache[feature.id], // Kantfärg
                weight: 2, // Kantens tjocklek
                opacity: 1, // Kantens opacitet
                fillColor: colorCache[feature.id], // Fyllningsfärg
                fillOpacity: 0.5 // Konstant transparens på fyllningen
            };
        },
        onEachFeature: function (feature, layer) {
            // Bygg en HTML-tabell med attributdata
            var popupContent = '<table class="popup-table">';
            if (feature.properties) {
                for (var key in feature.properties) {
                    if (feature.properties.hasOwnProperty(key)) {
                        popupContent += '<tr><th>' + key + '</th><td>' + feature.properties[key] + '</td></tr>';
                    }
                }
            }
            popupContent += '</table>';
            
            // Bind popup med HTML-tabellen
            layer.bindPopup(popupContent);
        }
    });

    // Lägg till FeatureLayer till kartan
    window.map.addLayer(featureLayer);

    // Funktion som uppdaterar datalagret baserat på kartans bounding box
    function updateFeatureLayer() {
        var bounds = window.map.getBounds();
        var query = L.esri.query({
            url: 'https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/rest/services/Jaktadm/lst_jaktadm_visning/MapServer/0'
        }).within(bounds).run(function (error, featureCollection) {
            if (error) {
                console.error('Error querying features:', error);
                return;
            }
            featureLayer.clearLayers();
            featureLayer.addData(featureCollection.features);
        });
    }

    // Uppdatera datalagret när användaren panorerar eller zoomar
    window.map.on('moveend', updateFeatureLayer);

    // Initial uppdatering när kartan först laddas
    updateFeatureLayer();
}
