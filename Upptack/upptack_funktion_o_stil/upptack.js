axios.get('Upptack/upptack.geojson')
    .then(function (response) {
        console.log("Successfully fetched GeoJSON data:", response.data);
        var geojsonLayer = L.geoJSON(response.data).addTo(map);
    })
    .catch(function (error) {
        console.log("Error fetching GeoJSON data:", error.message);
    });
