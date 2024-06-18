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

    var layerStyles = {
        'Allmän jakt: Däggdjur': {
            'Rvjaktilvdalenskommun_1.geojson': { fillColor: 'blue', color: 'black', weight: 2 },
            'Allman_jakt_daggdjur_2.geojson': { fill: false, color: 'black', weight: 2 }
        },
        'Allmän jakt: Fågel': {
            'Lnsindelning_1.geojson': { fill: false, color: 'black', weight: 2 },
            'Grnsfrripjaktilvdalenskommun_2.geojson': { fillColor: 'orange', color: 'black', weight: 2 },
            'GrnslvsomrdetillFinland_5.geojson': { weight: 8, color: 'red' },
            'NedanfrLappmarksgrnsen_3.geojson': { fillColor: 'purple', color: 'black', weight: 2 },
            'OvanfrLapplandsgrnsen_4.geojson': { fillColor: 'pink', color: 'black', weight: 2 }
        },
        'Älgjaktskartan': {
            'lgjaktJakttider_1.geojson': { fillColor: 'green', color: 'black', weight: 2 },
            'Srskiltjakttidsfnster_3.geojson': { fillColor: 'yellow', color: 'black', weight: 2 },
            'Omrdemedbrunstuppehll_2.geojson': { fillColor: 'blue', color: 'black', weight: 2 },
            'Kirunakommunnedanodlingsgrns_4.geojson': { fillColor: 'red', color: 'black', weight: 2 }
        }
    };

    // Funktion för att hämta GeoJSON-data och skapa lagret med stil
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var geojson = response.data;

                    var layer = L.geoJSON(geojson, {
                        style: function(feature) {
                            var filename = getFilenameFromURL(geojsonURL);
                            return layerStyles[layerName][filename];
                        },
                        onEachFeature: function(feature, layer) {
                            // Använd funktionen från popupHandler.js om nödvändigt
                        }
                    });

                    // Lägg till lagret i geojsonLayers arrayen
                    geojsonLayers[layerName].push(layer);
                    
                    // Om lagret är aktivt, lägg till det på kartan
                    if (layerIsActive[layerName]) {
                        layer.addTo(map);
                    }
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

    // Funktion för att extrahera filnamnet från URL:en
    function getFilenameFromURL(url) {
        var pathArray = url.split('/');
        var filename = pathArray[pathArray.length - 1];
        return filename;
    }

    // Returnera offentliga metoder och variabler
    return {
        toggleLayer: toggleLayer,
        fetchGeoJSONDataAndCreateLayer: fetchGeoJSONDataAndCreateLayer
    };
})();
