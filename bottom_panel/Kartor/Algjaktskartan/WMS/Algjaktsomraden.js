// Define the feature layer globally
var featureLayer = L.featureGroup().addTo(map);

// Function to update the feature layer
let updateTimeout;

function updateFeatureLayer() {
    clearTimeout(updateTimeout); // Clear previous timeout
    updateTimeout = setTimeout(() => {
        const bounds = window.map.getBounds();
        const query = featureLayer.createQuery();
        query.intersects(bounds);
        featureLayer.queryFeatures(query, function (error, featureCollection) {
            if (error) {
                console.error('Error querying features:', error);
                return;
            }
            featureLayer.clearLayers();
            featureLayer.addData(featureCollection.features);
        });
    }, 500); // Delay update by 500 ms
}

// Attach event listener to update feature layer when map is moved or zoomed
window.map.on('moveend', updateFeatureLayer);

// Function to load data into the feature layer
function loadFeatureLayerData() {
    // Define the URL for the feature layer data
    const featureLayerURL = 'https://geodata.naturvardsverket.se/arcgis/services/Inspire_SE_Harvest_object_Harvest_object_HR/MapServer/WmsServer';

    // Fetch the feature layer data
    fetch(featureLayerURL)
        .then(response => response.json())
        .then(data => {
            featureLayer.clearLayers();
            featureLayer.addData(data);
        })
        .catch(error => {
            console.error('Error loading feature layer data:', error);
        });
}

// Call the function to load the feature layer data on page load or when needed
loadFeatureLayerData();
