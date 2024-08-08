// CSS som en sträng
const filterKnappCSS = `
    #filter-knapp-container {
        position: fixed;
        bottom: 80px; /* Justera beroende på var du vill ha knappen */
        right: 20px;  /* Justera beroende på var du vill ha knappen */
        z-index: 1000; /* Se till att knappen är ovanpå andra element */
    }

    #filter-knapp {
        background-color: #326E58;
        color: white;
        border: none;
        width: 60px;
        height: 60px;
        text-align: center;
        text-decoration: none;
        font-size: 20px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s, box-shadow 0.3s;
    }
    #filter-knapp:hover {
        background-color: #274E44;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    #filter-knapp:active {
        background-color: #19362E;
    }

    #filter-container {
        display: none; /* Dölj containern som standard */
        position: fixed;
        bottom: 150px; /* Justera beroende på var du vill ha containern */
        right: 20px;  /* Justera beroende på var du vill ha containern */
        z-index: 1001; /* Se till att containern är ovanpå andra element */
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 10px;
        border-radius: 10px;
    }

    .button-container {
        margin-top: 10px;
    }

    .filter-img {
        width: 30px; /* Justera denna storlek enligt önskemål */
        height: auto;
        margin-right: 10px; /* Lägger till mellanrum mellan bild och text */
    }
`;

// Skapa ett style-element och lägg till CSS
const filterKnappStyle = document.createElement('style');
filterKnappStyle.textContent = filterKnappCSS;
document.head.appendChild(filterKnappStyle);

// JavaScript för att hantera knapptryckning och visa filtermeny
document.addEventListener("DOMContentLoaded", function() {
    const filterKnappContainer = document.createElement('div');
    filterKnappContainer.id = 'filter-knapp-container';

    const filterKnapp = document.createElement('button');
    filterKnapp.id = 'filter-knapp';
    filterKnapp.className = 'fab';
    filterKnapp.textContent = 'Filtrera';

    filterKnappContainer.appendChild(filterKnapp);
    document.body.appendChild(filterKnappContainer);

    // Skapa container för filtrering
    const filterContainer = document.createElement('div');
    filterContainer.id = 'filter-container';
    document.body.appendChild(filterContainer);

    filterKnapp.addEventListener('click', function() {
        filterContainer.style.display = filterContainer.style.display === 'block' ? 'none' : 'block';
    });

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
                        if (event.target.checked) {
                            console.log('Filtering to Mässor layer');
                            Upptack_geojsonHandler.filterLayer('Mässor');
                            updateCheckboxes('Mässor');
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
                        if (event.target.checked) {
                            console.log('Filtering to Jaktkort layer');
                            Upptack_geojsonHandler.filterLayer('Jaktkort');
                            updateCheckboxes('Jaktkort');
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
                        if (event.target.checked) {
                            console.log('Filtering to Jaktskyttebanor layer');
                            Upptack_geojsonHandler.filterLayer('Jaktskyttebanor');
                            updateCheckboxes('Jaktskyttebanor');
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

        function updateCheckboxes(activeLayer) {
            filters.forEach(filter => {
                const checkbox = document.getElementById(filter.id);
                checkbox.checked = (filter.text === activeLayer);
            });
        }
    }

    createFilterContent(filterContainer);
});
