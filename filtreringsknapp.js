document.addEventListener("DOMContentLoaded", function() {
    console.log("filtreringsknapp.js is loaded and running.");

    function initializeFilterButton() {
        const filterKnappContainer = document.createElement('div');
        Object.assign(filterKnappContainer.style, {
            position: 'fixed',
            top: '70%',
            right: '3px',
            transform: 'translateY(-40%)',
            zIndex: '1000',
            display: 'none',
        });

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

        filterKnapp.textContent = "Filtrera";

        filterKnappContainer.appendChild(filterKnapp);
        document.body.appendChild(filterKnappContainer);

        console.log('Filterknapp skapad och tillagd i DOM');

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

        filterKnapp.addEventListener('click', function() {
            if (filterContainer.style.transform === 'translateX(0px)') {
                hideFilterMenu();
            } else {
                showFilterMenu();
            }
        });

        document.addEventListener('click', function(event) {
            if (!filterKnappContainer.contains(event.target) && !filterContainer.contains(event.target)) {
                hideFilterMenu();
            }
        });

        const filterContainer = document.createElement('div');
        Object.assign(filterContainer.style, {
            position: 'fixed',
            top: '0',
            right: '0',
            width: '250px',
            height: '100%',
            zIndex: '1001',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            display: 'none',
        });

        document.body.appendChild(filterContainer);

        function showFilterMenu() {
            filterContainer.style.display = 'block';
            setTimeout(() => {
                filterContainer.style.transform = 'translateX(0px)';
            }, 10);
        }

        function hideFilterMenu() {
            filterContainer.style.transform = 'translateX(100%)';
            setTimeout(() => {
                filterContainer.style.display = 'none';
            }, 300);
        }

        // Försök att uppdatera knappens synlighet efter initialiseringen
        updateButtonVisibility();
    }

    // Fördröj initialiseringen tills Upptack_geojsonHandler är definierad
    function waitForUpptackHandler() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            initializeFilterButton();
        } else {
            console.log('Waiting for Upptack_geojsonHandler to be defined...');
            setTimeout(waitForUpptackHandler, 100);
        }
    }

    waitForUpptackHandler();
});
