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
    }

    function createUpptackContent(contentDiv) {
        fetch('bottom_panel/Upptack/Massor.geojson')
            .then(response => response.json())
            .then(data => {
                const today = new Date();
                let currentIndex = 0;
                const features = data.features.filter(feature => new Date(feature.properties.DATUM_TILL) >= today);

                // Sortera funktionerna baserat på "DATUM_FRAN"
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

                    const linkButton = document.createElement('button');
                    linkButton.className = 'link-button';
                    linkButton.onclick = () => {
                        window.open(feature.properties.LINK, '_blank');
                    };
                    linkButton.textContent = 'Mer info';
                    const linkImg = document.createElement('img');
                    linkImg.src = 'bilder/extern_link.png'; // Ange den korrekta sökvägen till bilden
                    linkImg.alt = 'Extern länk';
                    linkImg.className = 'custom-image';
                    linkButton.appendChild(linkImg);
                    featureDiv.appendChild(linkButton);

                    featureContainer.appendChild(featureDiv);
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

        // Skapa "Visa allt"-knappen
        const showAllButton = document.createElement('button');
        showAllButton.className = 'styled-button';
        showAllButton.id = 'show-all-button';
        showAllButton.onclick = function() {
            if (typeof Upptack_geojsonHandler !== 'undefined') {
                console.log('Activating all layers');
                Upptack_geojsonHandler.toggleLayer('Visa_allt');
            } else {
                console.error("Upptack_geojsonHandler är inte definierad.");
            }
        };
        const showAllImg = document.createElement('img');
        showAllImg.src = 'bottom_panel/Upptack/bilder/visa_allt_ikon.png';
        showAllImg.alt = 'Visa allt';
        showAllButton.appendChild(showAllImg);
        const showAllText = document.createElement('div');
        showAllText.className = 'text-content';
        showAllText.textContent = 'Visa allt';
        showAllButton.appendChild(showAllText);
        container.appendChild(showAllButton);

        // Skapa "Filtrera"-knappen
        const filterButton = document.createElement('button');
        filterButton.className = 'styled-button';
        filterButton.textContent = 'Filtrera';
        filterButton.id = 'filter-button';
        filterButton.onclick = function(event) {
            event.stopPropagation();
            showFilterOptions();
        };
        container.appendChild(filterButton);

        // Lägg till knappcontainern till content-div
        contentDiv.appendChild(container);

        // Skapa en meny för "Filtrera"-knappen
        function showFilterOptions() {
            container.innerHTML = ''; // Rensa knappcontainern

            const filters = [
                {
                    className: 'styled-button',
                    onclick: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Activating Mässor layer');
                            Upptack_geojsonHandler.toggleLayer('Mässor');
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        restoreOriginalButtons();
                    },
                    imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                    imgAlt: 'Mässor',
                    text: 'Mässor'
                },
                {
                    className: 'styled-button',
                    onclick: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Activating Jaktkort layer');
                            Upptack_geojsonHandler.toggleLayer('Jaktkort');
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        restoreOriginalButtons();
                    },
                    imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                    imgAlt: 'Jaktkort',
                    text: 'Jaktkort'
                },
                {
                    className: 'styled-button',
                    onclick: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Activating Jaktskyttebanor layer');
                            Upptack_geojsonHandler.toggleLayer('Jaktskyttebanor');
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        restoreOriginalButtons();
                    },
                    imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                    imgAlt: 'Jaktskyttebanor',
                    text: 'Jaktskytte-<br>banor' // Exempel på radbrytning
                }
            ];

            filters.forEach(filter => {
                const btn = document.createElement('button');
                btn.className = filter.className;
                btn.onclick = filter.onclick;

                if (filter.imgSrc) {
                    const img = document.createElement('img');
                    img.src = filter.imgSrc;
                    img.alt = filter.imgAlt;
                    btn.appendChild(img);
                }

                const textDiv = document.createElement('div');
                textDiv.className = 'text-content';
                textDiv.innerHTML = filter.text; // Använd innerHTML för att tolka <br>
                btn.appendChild(textDiv);

                container.appendChild(btn);
            });
        }

        // Funktion för att återställa de ursprungliga knapparna
        function restoreOriginalButtons() {
            container.innerHTML = '';
            container.appendChild(showAllButton);
            container.appendChild(filterButton);
        }
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
