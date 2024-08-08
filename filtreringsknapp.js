document.addEventListener("DOMContentLoaded", function() {
    // Skapa knappcontainer
    const filterKnappContainer = document.createElement('div');
    filterKnappContainer.style.position = 'fixed';
    filterKnappContainer.style.top = '85%';
    filterKnappContainer.style.right = '10px';
    filterKnappContainer.style.transform = 'translateY(-50%)';
    filterKnappContainer.style.zIndex = '1000';

    // Skapa knapp
    const filterKnapp = document.createElement('button');
    filterKnapp.style.backgroundColor = '#fff';
    filterKnapp.style.border = '1px solid #ccc';
    filterKnapp.style.width = '60px';
    filterKnapp.style.height = '60px';
    filterKnapp.style.textAlign = 'center';
    filterKnapp.style.textDecoration = 'none';
    filterKnapp.style.cursor = 'pointer';
    filterKnapp.style.borderRadius = '5px';
    filterKnapp.style.display = 'flex';
    filterKnapp.style.alignItems = 'center';
    filterKnapp.style.justifyContent = 'center';
    filterKnapp.style.padding = '0';
    filterKnapp.style.transition = 'background-color 0.3s, box-shadow 0.3s';

    filterKnapp.onmouseover = function() {
        filterKnapp.style.backgroundColor = '#f0f0f0';
        filterKnapp.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    };

    filterKnapp.onmouseout = function() {
        filterKnapp.style.backgroundColor = '#fff';
        filterKnapp.style.boxShadow = 'none';
    };

    filterKnapp.onmousedown = function() {
        filterKnapp.style.backgroundColor = '#e0e0e0';
    };

    // Lägg till bilden i knappen
    const filterImg = document.createElement('img');
    filterImg.src = 'bilder/filtrera_bild.png'; // Ersätt med din bilds sökväg
    filterImg.alt = 'Filtrera';
    filterImg.style.maxWidth = '80%';
    filterImg.style.maxHeight = '80%';

    filterKnapp.appendChild(filterImg);
    filterKnappContainer.appendChild(filterKnapp);
    document.body.appendChild(filterKnappContainer);

    // Skapa container för filtrering
    const filterContainer = document.createElement('div');
    filterContainer.style.position = 'fixed';
    filterContainer.style.top = '0';
    filterContainer.style.right = '0';
    filterContainer.style.width = '250px';
    filterContainer.style.height = '100%';
    filterContainer.style.zIndex = '1001';
    filterContainer.style.backgroundColor = '#fff';
    filterContainer.style.boxShadow = '-2px 0 8px rgba(0, 0, 0, 0.2)';
    filterContainer.style.padding = '10px';
    filterContainer.style.borderRadius = '0';
    filterContainer.style.transform = 'translateX(100%)';
    filterContainer.style.transition = 'transform 0.3s ease-in-out';
    filterContainer.style.display = 'none'; // Börjar som dold

    document.body.appendChild(filterContainer);

    // Visa eller dölj menyn när knappen klickas
    filterKnapp.addEventListener('click', function() {
        if (filterContainer.style.transform === 'translateX(0px)') {
            filterContainer.style.transform = 'translateX(100%)';
            setTimeout(() => {
                filterContainer.style.display = 'none';
            }, 300); // Vänta på övergången innan du döljer den
        } else {
            filterContainer.style.display = 'block';
            setTimeout(() => {
                filterContainer.style.transform = 'translateX(0px)';
            }, 10); // Kort fördröjning för att tillåta displayändringen
        }
    });

    // Stäng menyn när man klickar utanför den
    document.addEventListener('click', function(event) {
        if (!filterKnappContainer.contains(event.target) && !filterContainer.contains(event.target)) {
            filterContainer.style.transform = 'translateX(100%)';
            setTimeout(() => {
                filterContainer.style.display = 'none';
            }, 300);
        }
    });

    function createFilterContent(contentDiv) {
        // Skapa en container div för att centrera innehållet
        const container = document.createElement('div');
        container.style.marginTop = '10px';

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
                    filterContainer.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        filterContainer.style.display = 'none';
                    }, 300); // Vänta på övergången innan du döljer den
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
                    filterContainer.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        filterContainer.style.display = 'none';
                    }, 300); // Vänta på övergången innan du döljer den
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
                    filterContainer.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        filterContainer.style.display = 'none';
                    }, 300); // Vänta på övergången innan du döljer den
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
            img.style.width = '30px';
            img.style.height = 'auto';
            img.style.marginRight = '10px';

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
