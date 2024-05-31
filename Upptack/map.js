// Upptack/map.js

document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([62.0, 15.0], 5);
    var geojsonData;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load the GeoJSON data
    axios.get('Upptack/geojson/handelser.geojson')
        .then(function (response) {
            geojsonData = response.data;
            L.geoJSON(geojsonData).addTo(map);
        })
        .catch(function (error) {
            console.error('Error loading GeoJSON:', error);
        });

    // Function to filter data based on a property value
    window.filterData = function(value) {
        // Clear existing layers
        map.eachLayer(function(layer) {
            if (layer.feature) {
                map.removeLayer(layer);
            }
        });

        // Add filtered layer
        var filteredLayer = L.geoJSON(geojsonData, {
            filter: function (feature) {
                return feature.properties.someProperty === value;
            }
        }).addTo(map);
    };
});

