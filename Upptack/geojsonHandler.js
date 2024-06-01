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
                // Skapa popup-innehållet dynamiskt baserat på alla attribut i geojson-egenskaperna
                var popupContent = '<div>';
                for (var prop in feature.properties) {
                    popupContent += '<p><strong>' + prop + ':</strong> ' + feature.properties[prop] + '</p>';
                }
                popupContent += '</div>';
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(function (error) {
        console.log("Error fetching GeoJSON data:", error.message);
    });
