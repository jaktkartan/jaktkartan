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

    // Funktion för att hämta GeoJSON-data och skapa lagret
    function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        geojsonURLs.forEach(function(geojsonURL) {
            axios.get(geojsonURL)
                .then(function(response) {
                    console.log("Successfully fetched GeoJSON data:", response.data);
                    var geojson = response.data;

                    var layer = L.geoJSON(geojson, {
                        style: function(feature) {
                            // Använd stilar baserat på layerName och feature properties
                            switch (layerName) {
                                case 'Allmän jakt: Däggdjur':
                                    return Allman_jakt_daggdjur_stilar(feature.properties.style);
                                case 'Allmän jakt: Fågel':
                                    return Allman_jakt_Fagel_stilar(feature.properties.style);
                                case 'Älgjaktskartan':
                                    return Algjaktskartan_stilar(feature.properties.style);
                                default:
                                    return {}; // Returnera tomma stilar om inget matchar
                            }
                        },
                        onEachFeature: function(feature, layer) {
                            addClickHandlerToLayer(layer); // Använd funktionen från popupHandler.js
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

    // Funktion för att tända och släcka lagret för Allmän jakt: Däggdjur
    function toggleAllmänJaktDäggdjur() {
        var layerName = 'Allmän jakt: Däggdjur';
        if (!layerIsActive[layerName]) {
            var geojsonURLs = [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Rvjaktilvdalenskommun_1.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Allman_jakt_daggdjur_2.geojson'
            ];
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
        }
    }

    // Funktion för att tända och släcka lagret för Allmän jakt: Fågel
    function toggleAllmänJaktFågel() {
        var layerName = 'Allmän jakt: Fågel';
        if (!layerIsActive[layerName]) {
            var geojsonURLs = [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Grnsfrripjaktilvdalenskommun_2.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/GrnslvsomrdetillFinland_5.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/OvanfrLapplandsgrnsen_4.geojson'
            ];
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
        }
    }

    // Funktion för att tända och släcka lagret för Älgjaktskartan
    function toggleÄlgjaktskartan() {
        var layerName = 'Älgjaktskartan';
        if (!layerIsActive[layerName]) {
            var geojsonURLs = [
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Srskiltjakttidsfnster_3.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson',
                'https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Kirunakommunnedanodlingsgrns_4.geojson'
            ];
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else {
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            geojsonLayers[layerName] = [];
            layerIsActive[layerName] = false;
        }
    }

    // Returnera offentliga metoder och variabler
    return {
        toggleAllmänJaktDäggdjur: toggleAllmänJaktDäggdjur,
        toggleAllmänJaktFågel: toggleAllmänJaktFågel,
        toggleÄlgjaktskartan: toggleÄlgjaktskartan
    };
})();
