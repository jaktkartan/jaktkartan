axios.get('https://raw.githubusercontent.com/timothylevin/Testmiljo/main/Upptack/upptack.geojson')
    .then(function (response) {
        console.log("Successfully fetched GeoJSON data:", response.data);
        var geojsonLayer = L.geoJSON(response.data, {
            onEachFeature: function (feature, layer) {
                if (feature.geometry.crs && feature.geometry.crs.type && feature.geometry.crs.type.toUpperCase() !== 'NAME') {
                    console.error("Invalid CRS type:", feature.geometry.crs.type);
                    alert("Invalid CRS type detected. Skipping this feature.");
                    return;
                }
                // Inkludera attributen "TYP", "BILD", "NAMN" etc. i popup-innehållet
                var popupContent = '<h3>' + feature.properties.NAMN + '</h3>';
                popupContent += '<p>' + feature.properties.TYP + '</p>';
                popupContent += '<img src="' + feature.properties.BILD + '" alt="Bild" width="200">';
                // Du kan inkludera fler attribut här på samma sätt
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(function (error) {
        console.log("Error fetching GeoJSON data:", error.message);
    });

