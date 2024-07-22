// bottom_panel/Kartor/kartor_flikbeteende.js
function openKartor() {
    // Hitta tab-pane för kartor
    const tabPane = document.getElementById('tab2');
    if (!tabPane) {
        console.error('Tab pane for kartor not found.');
        return;
    }

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
        if (typeof Kartor_geojsonHandler !== 'undefined') {
            Kartor_geojsonHandler.toggleLayer('Visa_allt');
        } else {
            console.error("Kartor_geojsonHandler är inte definierad.");
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
                    if (typeof Kartor_geojsonHandler !== 'undefined') {
                        Kartor_geojsonHandler.toggleLayer('Allmän jakt: Däggdjur', [
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Rvjaktilvdalenskommun_1.geojson',
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Allman_jakt_daggdjur_2.geojson'
                        ]);
                    } else {
                        console.error("Kartor_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Kartor/bilder/daggdjurikon.png',
                imgAlt: 'Allmän jakt: Däggdjur'
            },
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Kartor_geojsonHandler !== 'undefined') {
                        Kartor_geojsonHandler.toggleLayer('Allmän jakt: Fågel', [
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/OvanfrLapplandsgrnsen_4.geojson',
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson',
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Grnsfrripjaktilvdalenskommun_2.geojson',
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson',
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/GrnslvsomrdetillFinland_5.geojson'
                        ]);
                    } else {
                        console.error("Kartor_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Kartor/bilder/fagelikon.png',
                imgAlt: 'Allmän jakt: Fågel'
            },
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Kartor_geojsonHandler !== 'undefined') {
                        Kartor_geojsonHandler.toggleLayer('Älgjaktskartan', [
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/lgjaktJakttider_1.geojson',
                            'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Algjaktskartan/geojsonfiler/Omrdemedbrunstuppehll_2.geojson'
                        ]);
                    } else {
                        console.error("Kartor_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Kartor/bilder/algikon.png',
                imgAlt: 'Älgjaktskartan'
            },
            {
                className: 'styled-button',
                textContent: 'Rensa allt',
                onclick: function() {
                    if (typeof Kartor_geojsonHandler !== 'undefined') {
                        Kartor_geojsonHandler.toggleLayer('Rensa_allt');
                    } else {
                        console.error("Kartor_geojsonHandler är inte definierad.");
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

// Anropa openKartor-funktionen för att generera innehållet
openKartor();
