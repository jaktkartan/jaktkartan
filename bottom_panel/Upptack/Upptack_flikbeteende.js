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
        .button-container ul {
            padding: 0;
            margin: 0;
        }
        .button-container li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            justify-content: space-between;
        }
        .button-container input[type="checkbox"] {
            margin-left: 10px;
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
            Upptack_geojsonHandler.resetFirstClickHandled();  // Återställ flaggan varje gång tab1 öppnas
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
            Upptack_geojsonHandler.activateAllLayers();
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
                navButtonsContainer.className = 'nav-buttons';
                container.appendChild(navButtonsContainer);

                const leftButton = document.createElement('button');
                leftButton.className = 'nav-button';
                leftButton.textContent = '<';
                leftButton.onclick = () => showFeature(currentIndex - 1);
                navButtonsContainer.appendChild(leftButton);

                const rightButton = document.createElement('button');
                rightButton.className = 'nav-button';
                rightButton.textContent = '>';
                rightButton.onclick = () => showFeature(currentIndex + 1);
                navButtonsContainer.appendChild(rightButton);

                function showFeature(index) {
                    if (index < 0 || index >= features.length) return;

                    currentIndex = index;
                    const feature = features[currentIndex];

                    container.innerHTML = '';

                    const featureContainer = document.createElement('div');
                    featureContainer.className = 'geojson-feature-container';
                    container.appendChild(featureContainer);

                    const featureElement = document.createElement('div');
                    featureElement.className = 'geojson-feature';
                    featureContainer.appendChild(featureElement);

                    const title = document.createElement('h3');
                    title.textContent = feature.properties.NAMN;
                    featureElement.appendChild(title);

                    const date = document.createElement('p');
                    date.textContent = `${new Date(feature.properties.DATUM_FRAN).toLocaleDateString()} - ${new Date(feature.properties.DATUM_TILL).toLocaleDateString()}`;
                    featureElement.appendChild(date);

                    const img = document.createElement('img');
                    img.src = feature.properties.IMAGE_URL; // Byt till rätt URL-fält
                    img.alt = feature.properties.NAMN;
                    featureElement.appendChild(img);
                }

                showFeature(currentIndex);
            });
    }

    function createFilterContent(contentDiv) {
        const container = document.createElement('div');
        container.className = 'button-container';

        const filterList = document.createElement('ul');
        filterList.style.listStyleType = 'none'; // Ingen standardpunkt eller nummer
        filterList.style.padding = '0'; // Ta bort standard padding
        filterList.style.margin = '0'; // Ta bort standard margin

        const filters = [
            {
                id: 'massorCheckbox',
                text: 'Mässor',
                imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                checkmarkSrc: 'bottom_panel/Upptack/bilder/checkmark.png', // Kontrollera sökvägen
                onChange: function(event) {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Toggling Mässor layer');
                        Upptack_geojsonHandler.toggleLayer('Mässor', event.target.checked);
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                }
            },
            {
                id: 'jaktkortCheckbox',
                text: 'Jaktkort',
                imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                checkmarkSrc: 'bottom_panel/Upptack/bilder/checkmark.png', // Kontrollera sökvägen
                onChange: function(event) {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Toggling Jaktkort layer');
                        Upptack_geojsonHandler.toggleLayer('Jaktkort', event.target.checked);
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                }
            },
            {
                id: 'jaktskyttebanorCheckbox',
                text: 'Jaktskyttebanor',
                imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                checkmarkSrc: 'bottom_panel/Upptack/bilder/checkmark.png', // Kontrollera sökvägen
                onChange: function(event) {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Toggling Jaktskyttebanor layer');
                        Upptack_geojsonHandler.toggleLayer('Jaktskyttebanor', event.target.checked);
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
            listItem.style.marginBottom = '10px'; // Avstånd mellan listobjekt
            listItem.style.padding = '5px'; // Padding för listobjekt
            listItem.style.border = '1px solid #ddd'; // Border för listobjekt
            listItem.style.borderRadius = '5px'; // Rundade hörn

            const img = document.createElement('img');
            img.src = filter.imgSrc;
            img.alt = filter.text;
            img.className = 'filter-img'; // Använd CSS-klass för bildstorlek

            const text = document.createElement('span');
            text.textContent = filter.text;
            text.style.marginLeft = '10px'; // Margin mellan bild och text

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = filter.id;
            checkbox.checked = true; // Initialt är alla lager aktiva
            checkbox.onchange = filter.onChange;
            checkbox.style.marginLeft = '10px'; // Margin mellan text och checkbox

            const checkmarkImg = document.createElement('img');
            checkmarkImg.src = filter.checkmarkSrc;
            checkmarkImg.alt = 'Checkmark';
            checkmarkImg.className = 'filter-img'; // Använd CSS-klass för bildstorlek
            checkmarkImg.style.display = 'none'; // Dölj standard checkmark, kan styras via JavaScript

            // Skapa en container för text, checkbox och checkmark
            const textContainer = document.createElement('div');
            textContainer.style.display = 'flex';
            textContainer.style.alignItems = 'center';

            textContainer.appendChild(img);
            textContainer.appendChild(text);
            textContainer.appendChild(checkbox);

            listItem.appendChild(textContainer);
            listItem.appendChild(checkmarkImg);
            filterList.appendChild(listItem);
        });

        container.appendChild(filterList);
        contentDiv.appendChild(container);
    }

    function createRekommendationerContent(contentDiv) {
        // Implementera innehåll för rekommendationer här
        contentDiv.innerHTML = '<p>Här kommer rekommendationer att visas.</p>';
    }
}
