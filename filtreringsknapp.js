document.addEventListener("DOMContentLoaded", function() {
    console.log("filtreringsknapp.js is loaded and running.");

    // Skapa container för filtreringsknappen
    const filterKnappContainer = document.createElement('div');
    Object.assign(filterKnappContainer.style, {
        position: 'fixed',
        top: '70%',
        right: '3px',
        transform: 'translateY(-40%)',
        zIndex: '1000',
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

    // Lägger till text i knappen
    filterKnapp.textContent = "Filtrera";

    filterKnappContainer.appendChild(filterKnapp);
    document.body.appendChild(filterKnappContainer);

    console.log('Filterknapp skapad och tillagd i DOM');

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

    // Vänta tills Upptack_geojsonHandler är definierad, uppdatera då knappens synlighet
    function waitForUpptackHandler() {
        if (typeof Upptack_geojsonHandler !== 'undefined' && Upptack_geojsonHandler.layerIsActive) {
            updateButtonVisibility();
        } else {
            console.log('Waiting for Upptack_geojsonHandler to be defined...');
            setTimeout(waitForUpptackHandler, 100); // Kontrollera var 100ms
        }
    }

    // Starta väntan på Upptack_geojsonHandler
    waitForUpptackHandler();

    // Event Listener för att uppdatera knappens synlighet från andra delar av sidan
    document.addEventListener('layerStatusChanged', updateButtonVisibility);

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

    // Skapa container för filtermenyn (om den inte redan är skapad)
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
});

// Anropa denna funktion varje gång du ändrar lagerstatus någon annanstans på sidan
function notifyLayerStatusChanged() {
    const event = new Event('layerStatusChanged');
    document.dispatchEvent(event);
}
