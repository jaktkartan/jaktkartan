// Upptack/map.js

document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map');
    var geojsonData;

    // Load the GeoJSON data
    axios.get('../Upptack/geojson/handelser.geojson')
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
