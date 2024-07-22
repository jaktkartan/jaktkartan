// Funktion för att skapa knappar i tab1
function openUpptack() {
    // Hitta tab-pane för upptäck
    const tabPane = document.getElementById('tab1');
    if (!tabPane) {
        console.error('Tab pane for upptäck not found.');
        return;
    }

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.overflow = 'hidden'; // Förhindra scrollning

    // Skapa knapp-container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'nowrap'; // Förhindra radbrytning
    buttonContainer.style.gap = '10px'; // Mellanrum mellan knapparna
    buttonContainer.style.justifyContent = 'center'; // Centrera knapparna horisontellt

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
    buttonContainer.appendChild(showAllButton);

    // Skapa "Filtrera"-knappen
    const filterButton = document.createElement('button');
    filterButton.className = 'styled-button';
    filterButton.textContent = 'Filtrera';
    filterButton.id = 'filter-button';
    filterButton.onclick = function(event) {
        event.stopPropagation();
        showFilterOptions();
    };
    buttonContainer.appendChild(filterButton);

    // Skapa en meny för "Filtrera"-knappen
    function showFilterOptions() {
        buttonContainer.innerHTML = ''; // Rensa knappcontainern

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

            buttonContainer.appendChild(btn);
        });
    }

    // Funktion för att återställa de ursprungliga knapparna
    function restoreOriginalButtons() {
        buttonContainer.innerHTML = '';

        buttonContainer.appendChild(showAllButton);
        buttonContainer.appendChild(filterButton);
    }

    // Lägg till knapp-container till containern
    container.appendChild(buttonContainer);

    // Lägg till containern i tab-pane
    tabPane.appendChild(container);
}

// Anropa openUpptack-funktionen för att generera innehållet
openUpptack();
