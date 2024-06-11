let massorLayer;
let massorLayerVisible = false;

function toggleLayer_Massor() {
    if (massorLayerVisible) {
        map.removeLayer(massorLayer);
        massorLayerVisible = false;
    } else {
        if (!massorLayer) {
            fetch('https://raw.githubusercontent.com/timothylevin/Testmiljo/main/bottom_panel/Upptack/upptack.geojson')
                .then(response => response.json())
                .then(data => {
                    massorLayer = L.geoJSON(data, {
                        style: {
                            color: 'red',
                            weight: 2,
                            fillOpacity: 0.5
                        }
                    }).addTo(map);
                    massorLayerVisible = true;
                })
                .catch(error => console.error('Error loading Massor layer:', error));
        } else {
            map.addLayer(massorLayer);
            massorLayerVisible = true;
        }
    }
}
