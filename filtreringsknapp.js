document.addEventListener("DOMContentLoaded", function() {
    // Skapa container för filtreringsknappen
    const filterKnappContainer = document.createElement('div');
    Object.assign(filterKnappContainer.style, {
        position: 'fixed',
        top: '70%',
        right: '3px',
        transform: 'translateY(-40%)',
        zIndex: '500',  // Lägre z-index
        display: 'none', // Börjar som dold
    });

    // Skapa filtreringsknappen
    const filterKnapp = document.createElement('button');
    Object.assign(filterKnapp.style, {
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        width: '60px',
        height: '60px',
        textAlign: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        transition: 'background-color 0.3s, box-shadow 0.3s',
    });

    // Lägger till hover-effekter på knappen
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

    // Lägger till bild i knappen
    const filterImg = document.createElement('img');
    Object.assign(filterImg.style, {
        maxWidth: '80%',
        maxHeight: '80%',
    });
    filterImg.src = 'bilder/filtrera_bild.png'; // Ändra till korrekt bildsökväg
    filterImg.alt = 'Filtrera';

    filterKnapp.appendChild(filterImg);
    filterKnappContainer.appendChild(filterKnapp);
    document.body.appendChild(filterKnappContainer);

    // Skapa container för filtermenyn
    const filterContainer = document.createElement('div');
    Object.assign(filterContainer.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        width: '250px',
        height: '100%',
        zIndex: '501',  // Lägre z-index än tidigare men högre än knappen
        backgroundColor: '#fff',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
        padding: '10px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        display: 'none',
    });

    document.body.appendChild(filterContainer);

    // Visa eller dölj filtermenyn när knappen klickas
    filterKnapp.addEventListener('click', function() {
        if (filterContainer.style.transform === 'translateX(0px)') {
            hideFilterMenu();
        } else {
            showFilterMenu();
        }
    });

    // Stäng menyn när man klickar utanför den
    document.addEventListener('click', function(event) {
        if (!filterKnappContainer.contains(event.target) && !filterContainer.contains(event.target)) {
            hideFilterMenu();
        }
    });

    // Funktion för att visa filtermenyn
    function showFilterMenu() {
        filterContainer.style.display = 'block';
        setTimeout(() => {
            filterContainer.style.transform = 'translateX(0px)';
        }, 10);
    }

    // Funktion för att dölja filtermenyn
    function hideFilterMenu() {
        filterContainer.style.transform = 'translateX(100%)';
        setTimeout(() => {
            filterContainer.style.display = 'none';
        }, 300);
    }

    // Skapa innehåll i filtermenyn
    createFilterContent(filterContainer);

    function createFilterContent(contentDiv) {
        const container = document.createElement('div');
        container.style.marginTop = '10px';

        const filterList = document.createElement('ul');
        Object.assign(filterList.style, {
            listStyleType: 'none',
            padding: '0',
        });

        const filters = [
            {
                id: 'massorCheckbox',
                text: 'Mässor',
                imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                onChange: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Filtering to Mässor layer');
                        Upptack_geojsonHandler.filterLayer('Mässor');
                        notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    hideFilterMenu(); // Stäng menyn efter att valet gjorts
                }
            },
            {
                id: 'jaktkortCheckbox',
                text: 'Jaktkort',
                imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                onChange: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Filtering to Jaktkort layer');
                        Upptack_geojsonHandler.filterLayer('Jaktkort');
                        notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    hideFilterMenu(); // Stäng menyn efter att valet gjorts
                }
            },
            {
                id: 'jaktskyttebanorCheckbox',
                text: 'Jaktskyttebanor',
                imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                onChange: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Filtering to Jaktskyttebanor layer');
                        Upptack_geojsonHandler.filterLayer('Jaktskyttebanor');
                        notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    hideFilterMenu(); // Stäng menyn efter att valet gjorts
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
            label.style.cursor = 'pointer';

            const img = document.createElement('img');
            Object.assign(img.style, {
                width: '30px',
                height: 'auto',
                marginRight: '10px',
            });
            img.src = filter.imgSrc;
            img.alt = filter.text;

            label.appendChild(img);
            label.appendChild(document.createTextNode(filter.text));

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            filterList.appendChild(listItem);
        });

        container.appendChild(filterList);
        contentDiv.appendChild(container);
    }

    // Funktion för att uppdatera knappens synlighet
    function updateButtonVisibility() {
        if (typeof Upptack_geojsonHandler !== 'undefined' && Upptack_geojsonHandler.layerIsActive) {
            const anyLayerActive = Object.values(Upptack_geojsonHandler.layerIsActive).some(isActive => isActive);
            filterKnappContainer.style.display = anyLayerActive ? 'block' : 'none';
            console.log('Button visibility updated:', anyLayerActive ? 'Visible' : 'Hidden');
        } else {
            console.log('Upptack_geojsonHandler or layerIsActive not defined.');
        }
    }

    // Event Listener för att uppdatera knappens synlighet från andra delar av sidan
    document.addEventListener('layerStatusChanged', updateButtonVisibility);

    // Vänta tills Upptack_geojsonHandler är definierad, uppdatera då knappens synlighet
    const interval = setInterval(function() {
        if (typeof Upptack_geojsonHandler !== 'undefined' && Upptack_geojsonHandler.layerIsActive) {
            clearInterval(interval);
            updateButtonVisibility();
        }
    }, 100); // Kontrollera var 100ms
});

// Anropa denna funktion varje gång du ändrar lagerstatus någon annanstans på sidan
function notifyLayerStatusChanged() {
    const event = new Event('layerStatusChanged');
    document.dispatchEvent(event);
}
