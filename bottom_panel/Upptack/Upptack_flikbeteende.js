function openUpptack() {
    // Hitta tab-pane för upptäck
    const tabPane = document.getElementById('tab1');
    if (!tabPane) {
        console.error('Tab pane for upptäck not found.');
        return;
    }

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Definiera CSS
    const style = document.createElement('style');
    style.textContent = `
        .tabs {
            display: flex;
            width: 100%;
            justify-content: space-around;
            background-color: #f1f1f1;
        }
        .tab-button {
            flex: 1;
            padding: 10px;
            cursor: pointer;
            text-align: center;
            background-color: #ddd;
            border: none;
            outline: none;
            transition: background-color 0.3s;
        }
        .tab-button.active {
            background-color: #bbb;
        }
        .tab-content-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 15px 0px 5px 0px;
            box-sizing: border-box;
        }
        .tab-content {
            display: none;
        }
        .geojson-container {
            margin-bottom: 10px; /* Minska avståndet mellan rader */
        }
        .geojson-feature-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .geojson-feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 10px; /* Minska avståndet mellan funktionerna */
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            flex-grow: 1;
        }
        .geojson-feature h3 {
            margin: 0;
            padding: 5px 0; /* Minska padding */
        }
        .geojson-feature p {
            margin: 0;
            padding: 3px 0; /* Minska padding */
        }
        .geojson-feature img {
            width: 90%; /* Gör så att bilden tar upp 90% av tillgänglig plats */
            display: block;
            margin: 0 auto 5px auto; /* Centrera bilden horisontellt och lägg till marginal nedåt */
        }
        .nav-button {
            background-color: #326E58; /* Bakgrundsfärg */
            color: white; /* Textfärg */
            border: none;
            width: 40px;
            height: 40px;
            text-align: center;
            text-decoration: none;
            font-size: 20px;
            cursor: pointer;
            border-radius: 50%;
            transition: background-color 0.3s, box-shadow 0.3s; /* Övergångseffekt */
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .nav-button:hover {
            background-color: #274E44; /* Mörkare bakgrundsfärg vid hover */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Skugga vid hover */
        }
        .nav-button:active {
            background-color: #19362E; /* Ännu mörkare bakgrundsfärg vid klick */
        }
        .button-container {
            margin-top: 10px;
        }
        .link-button {
            display: inline-flex;
            align-items: center;
            background-color: rgb(50, 94, 88); /* Färg på knappen */
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
            white-space: nowrap; /* Förhindra radbrytning */
            justify-content: center; /* Lägg till detta för att centrera innehållet horisontellt */
        }
        .link-button img {
            height: 20px; /* Ändrar storlek på bilden */
            width: auto;
            margin-left: 10px;
            border-radius: 0 !important; /* Tar bort rundade hörn med !important */
        }
        .link-button .custom-image {
            border-radius: 0 !important; /* Tar bort rundade hörn specifikt för denna bild */
        }
        .filter-img {
            width: 30px; /* Justera denna storlek enligt önskemål */
            height: auto;
            margin-right: 10px; /* Lägger till mellanrum mellan bild och text */
        }
    `;
    document.head.appendChild(style);

    // Skapa en container för flikarna
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';

    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'tab-content-container';

    // Skapa flikarna
    const tabButtons = [
        { id: 'upptackTab', text: 'Upptäck', contentId: 'upptackContent' },
        { id: 'filterTab', text: 'Filtrera', contentId: 'filterContent' },
        { id: 'rekommendationerTab', text: 'Rekommendationer', contentId: 'rekommendationerContent' }
    ];

    tabButtons.forEach(tab => {
        const button = document.createElement('button');
        button.id = tab.id;
        button.className = 'tab-button';
        button.textContent = tab.text;
        button.onclick = function() {
            openTabContent(tab.contentId, tab.id);
        };
        tabsContainer.appendChild(button);
    });

    tabPane.appendChild(tabsContainer);
    tabPane.appendChild(tabContentContainer);

    // Skapa innehåll för varje flik
    const tabContents = [
        { id: 'upptackContent', content: createUpptackContent },
        { id: 'filterContent', content: createFilterContent },
        { id: 'rekommendationerContent', content: createRekommendationerContent }
    ];

    tabContents.forEach(tab => {
        const contentDiv = document.createElement('div');
        contentDiv.id = tab.id;
        contentDiv.className = 'tab-content';
        contentDiv.style.display = 'none';
        tabContentContainer.appendChild(contentDiv);
        tab.content(contentDiv);
    });

    // Visa första fliken som standard
    openTabContent('upptackContent', 'upptackTab');

    function openTabContent(contentId, tabId) {
        const contents = document.getElementsByClassName('tab-content');
        for (let content of contents) {
            content.style.display = 'none';
        }
        document.getElementById(contentId).style.display = 'block';

        const buttons = document.getElementsByClassName('tab-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }
        document.getElementById(tabId).classList.add('active');

        // Om upptäck fliken visas, kör funktioner som "Visa allt" skulle köra
        if (contentId === 'upptackContent') {
            deactivateAllLayersKartor();
            runShowAllFunctions();
        }
    }

    function deactivateAllLayersKartor() {
        if (typeof Kartor_geojsonHandler !== 'undefined') {
            console.log('Deactivating all layers in Kartor');
            Kartor_geojsonHandler.deactivateAllLayersKartor();
        } else {
            console.error("Kartor_geojsonHandler är inte definierad.");
        }
    }

    function runShowAllFunctions() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            console.log('Activating all layers in Upptack');
            Upptack_geojsonHandler.toggleLayer('Visa_allt');
        } else {
            console.error("Upptack_geojsonHandler är inte definierad.");
        }
    }

    function createUpptackContent(contentDiv) {
        fetch('bottom_panel/Upptack/Massor.geojson')
            .then(response => response.json())
            .then(data => {
                const today = new Date();
                let currentIndex = 0;
                const features = data.features.filter(feature => new Date(feature.properties.DATUM_TILL) >= today);

                features.sort((a, b) => new Date(a.properties.DATUM_FRAN) - new Date(b.properties.DATUM_FRAN));

                const container = document.createElement('div');
                container.className = 'geojson-container';
                contentDiv.appendChild(container);

                const navButtonsContainer = document.createElement('div');
                navButtonsContainer.className = 'geojson-feature-container';

                const prevButton = document.createElement('button');
                prevButton.className = 'nav-button';
                prevButton.textContent = '<';
                prevButton.onclick = () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateFeatureDisplay();
                    }
                };

                const nextButton = document.createElement('button');
                nextButton.className = 'nav-button';
                nextButton.textContent = '>';
                nextButton.onclick = () => {
                    if (currentIndex < features.length - 1) {
                        currentIndex++;
                        updateFeatureDisplay();
                    }
                };

                navButtonsContainer.appendChild(prevButton);

                const featureContainer = document.createElement('div');
                featureContainer.className = 'geojson-feature';

                navButtonsContainer.appendChild(featureContainer);
                navButtonsContainer.appendChild(nextButton);
                container.appendChild(navButtonsContainer);

                function updateFeatureDisplay() {
                    featureContainer.innerHTML = '';

                    const feature = features[currentIndex];
                    const featureDiv = document.createElement('div');

                    const img = document.createElement('img');
                    img.src = feature.properties.Bild_massor;
                    img.alt = feature.properties.NAMN;
                    featureDiv.appendChild(img);

                    const name = document.createElement('h3');
                    name.textContent = feature.properties.NAMN;
                    featureDiv.appendChild(name);

                    const dates = document.createElement('p');
                    dates.textContent = `Datum: ${feature.properties.DATUM_FRAN} - ${feature.properties.DATUM_TILL}`;
                    featureDiv.appendChild(dates);

                    const info = document.createElement('p');
                    info.textContent = `Info: ${feature.properties.INFO}`;
                    featureDiv.appendChild(info);

                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.style.display = 'flex';
                    buttonsContainer.style.justifyContent = 'space-between'; /* Fördela utrymmet mellan knapparna */

                    const linkButton = document.createElement('button');
                    linkButton.className = 'link-button';
                    linkButton.onclick = () => {
                        window.open(feature.properties.LINK, '_blank');
                    };
                    linkButton.textContent = 'Mer info';
                    const linkImg = document.createElement('img');
                    linkImg.src = 'bilder/extern_link.png';
                    linkImg.alt = 'Extern länk';
                    linkImg.className = 'custom-image';
                    linkButton.appendChild(linkImg);
                    buttonsContainer.appendChild(linkButton);

                    const zoomButton = document.createElement('button');
                    zoomButton.className = 'link-button';
                    zoomButton.textContent = 'Zooma till';
                    zoomButton.onclick = () => {
                        zoomToCoordinates(feature.geometry.coordinates);
                    };
                    buttonsContainer.appendChild(zoomButton);

                    featureDiv.appendChild(buttonsContainer);
                    featureContainer.appendChild(featureDiv);
                }

                function zoomToCoordinates(coordinates) {
                    // Använd Leaflet för att zooma till koordinaterna
                    if (typeof map !== 'undefined') {
                        const zoomLevel = 13; // Justera zoomnivån efter behov
                        const latLng = L.latLng(coordinates[1], coordinates[0]);

                        // Zooma till koordinaterna först
                        map.setView(latLng, zoomLevel);

                        // Lägg till en offset
                        const offset = [0, 100]; // Justera offsetten (x, y) i pixlar

                        // Konvertera offset till latLng
                        const point = map.latLngToContainerPoint(latLng); // Konvertera latLng till pixelpunkter
                        const newPoint = L.point(point.x + offset[0], point.y + offset[1]); // Lägg till offset
                        const newLatLng = map.containerPointToLatLng(newPoint); // Konvertera tillbaka till latLng

                        // Panorera till den nya positionen med offset
                        map.setView(newLatLng, zoomLevel);
                    } else {
                        console.error("Kartan är inte definierad.");
                    }
                }

                updateFeatureDisplay();
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
    }

    function createFilterContent(contentDiv) {
        // Skapa en container div för att centrera innehållet
        const container = document.createElement('div');
        container.className = 'button-container';

        // Skapa en lista med checkboxar och bilder
        const filterList = document.createElement('ul');
        filterList.style.listStyleType = 'none'; // Ta bort punktlistestilen
        filterList.style.padding = '0'; // Ta bort padding

        const filters = [
            {
                id: 'massorCheckbox',
                text: 'Mässor',
                imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                onChange: function(event) {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Toggling Mässor layer');
                        if (event.target.checked) {
                            Upptack_geojsonHandler.activateLayer('Mässor');
                        } else {
                            Upptack_geojsonHandler.deactivateLayer('Mässor');
                        }
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                }
            },
            {
                id: 'jaktkortCheckbox',
                text: 'Jaktkort',
                imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                onChange: function(event) {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Toggling Jaktkort layer');
                        if (event.target.checked) {
                            Upptack_geojsonHandler.activateLayer('Jaktkort');
                        } else {
                            Upptack_geojsonHandler.deactivateLayer('Jaktkort');
                        }
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                }
            },
            {
                id: 'jaktskyttebanorCheckbox',
                text: 'Jaktskyttebanor',
                imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                onChange: function(event) {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Toggling Jaktskyttebanor layer');
                        if (event.target.checked) {
                            Upptack_geojsonHandler.activateLayer('Jaktskyttebanor');
                        } else {
                            Upptack_geojsonHandler.deactivateLayer('Jaktskyttebanor');
                        }
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                }
            }
        ];

        filters.forEach(filter => {
            const listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = filter.id;
            checkbox.onchange = filter.onChange;

            const label = document.createElement('label');
            label.htmlFor = filter.id;
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer'; // Gör labeln klickbar

            const img = document.createElement('img');
            img.src = filter.imgSrc;
            img.alt = filter.text;
            img.className = 'filter-img'; // Lägger till en specifik klass för bildstorlek

            label.appendChild(img);
            label.appendChild(document.createTextNode(filter.text));

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            filterList.appendChild(listItem);
        });

        container.appendChild(filterList);
        contentDiv.appendChild(container);
    }

    function createRekommendationerContent(contentDiv) {
        // Skapa en container div för att centrera innehållet
        const container = document.createElement('div');
        container.className = 'button-container';

        // Skapa innehåll för rekommendationer (lägg till lämpliga element)
        const rekommendationerContent = document.createElement('p');
        rekommendationerContent.textContent = 'Här hittar du rekommendationer.';
        container.appendChild(rekommendationerContent);

        // Lägg till containern till content-div
        contentDiv.appendChild(container);
    }
}
