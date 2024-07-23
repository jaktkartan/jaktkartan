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
            console.log('Activating all layers');
            Upptack_geojsonHandler.toggleLayer('Visa_allt');
        } else {
            console.error("Upptack_geojsonHandler är inte definierad.");
        }
    };
    container.appendChild(showAllButton);

    // Skapa "Rensa allt"-knappen
    const clearAllButton = document.createElement('button');
    clearAllButton.className = 'styled-button';
    clearAllButton.textContent = 'Rensa allt';
    clearAllButton.onclick = function() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            console.log('Clearing all layers');
            Upptack_geojsonHandler.toggleLayer('Rensa_allt');
        } else {
            console.error("Upptack_geojsonHandler är inte definierad.");
        }
    };
    container.appendChild(clearAllButton);

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
                text: 'Jaktskyttebanor'
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

            const spanContainer = document.createElement('div');
            spanContainer.className = 'scrolling-text';
            const span = document.createElement('span');
            span.textContent = filter.text;
            spanContainer.appendChild(span);
            btn.appendChild(spanContainer);

            container.appendChild(btn);

            // Kontrollera om texten är för bred och lägg till animation vid behov
            requestAnimationFrame(() => {
                const isOverflowing = span.scrollWidth > spanContainer.clientWidth;
                if (isOverflowing) {
                    spanContainer.classList.add('animate');
                    span.textContent += " \u00A0 \u00A0 \u00A0 " + filter.text; // Lägg till mellanrum och duplicera text
                } else {
                    spanContainer.classList.remove('animate');
                }
            });
        });

        // Lägg till "Rensa allt"-knappen igen
        container.appendChild(clearAllButton);
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
