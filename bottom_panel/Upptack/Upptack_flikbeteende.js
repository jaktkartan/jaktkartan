function openUpptack() {
    // Dölj andra flikar
    document.getElementById('tab2').style.display = 'none';

    // Hitta tab-pane för upptäck
    const tabPane = document.getElementById('tab1');
    if (!tabPane) {
        console.error('Tab pane for upptäck not found.');
        return;
    }

    // Visa tab1
    tabPane.style.display = 'flex';

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.className = 'button-container';

    // Skapa "Visa allt"-knappen
    const showAllButton = document.createElement('button');
    showAllButton.className = 'styled-button';
    showAllButton.textContent = 'Visa allt';
    showAllButton.onclick = function() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            Upptack_geojsonHandler.toggleLayer('Visa_allt');
        } else {
            console.error("Upptack_geojsonHandler är inte definierad.");
        }
    };
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

    // Skapa en meny för "Filtrera"-knappen
    function showFilterOptions() {
        container.innerHTML = ''; // Rensa knappcontainern

        const filters = [
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        Upptack_geojsonHandler.toggleLayer('Mässor', [
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/Massor.geojson'
                        ]);
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                imgAlt: 'Mässor'
            },
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        Upptack_geojsonHandler.toggleLayer('Jaktkort', [
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktkort.geojson'
                        ]);
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                imgAlt: 'Jaktkort'
            },
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        Upptack_geojsonHandler.toggleLayer('Jaktskyttebanor', [
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktskyttebanor.geojson'
                        ]);
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                imgAlt: 'Jaktskyttebanor'
            },
            {
                className: 'styled-button',
                textContent: 'Rensa allt',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        Upptack_geojsonHandler.toggleLayer('Rensa_allt');
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                }
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
            } else if (filter.textContent) {
                btn.textContent = filter.textContent;
            }

            container.appendChild(btn);
        });
    }

    // Funktion för att återställa de ursprungliga knapparna
    function restoreOriginalButtons() {
        container.innerHTML = '';

        container.appendChild(showAllButton);
        container.appendChild(filterButton);
    }

    // Lägg till knapp-container till tab-pane
    tabPane.appendChild(container);
}

// Anropa openUpptack-funktionen för att generera innehållet
openUpptack();
