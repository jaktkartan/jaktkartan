    // I geojson handlern så finns en funktion för att aktivera fab knapparna samtidigt som lagren. den kallas: Hjälpfunktion för att få FAB-knappens ID baserat på lagrets namn


document.addEventListener('DOMContentLoaded', function() {
    // Funktion för att visa modalen och ladda innehåll
    function showModal(layerName) {
        var modalId = getModalId(layerName);
        var modal = document.getElementById(modalId);
        if (modal) {
            fetch(`bottom_panel/Upptack/${modalId}.html`)
                .then(response => response.text())
                .then(html => {
                    modal.innerHTML = html;
                    modal.style.display = 'block';
                    
                    // Lägg till klickhändelser för att stänga modalen
                    var closeBtn = modal.querySelector('.close');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', function() {
                            closeModal(modalId);
                        });
                    }
                })
                .catch(error => console.error('Error loading modal content:', error));
        }
    }

    // Funktion för att stänga modalen
    function closeModal(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Hjälpfunktion för att få modalens ID baserat på lagrets namn
    function getModalId(layerName) {
        switch(layerName) {
            case 'Visa allt':
                return 'fab-upptack';
            case 'Mässor':
                return 'fab-upptack';
            case 'jaktkort':
                return 'fab-upptack';
            default:
                return '';
        }
    }

    // Lägg till klickhändelser för att visa modaler
    document.getElementById('fab-upptack')?.addEventListener('click', function() {
        showModal('Visa allt');
    });
    document.getElementById('fab-upptack')?.addEventListener('click', function() {
        showModal('Mässor');
    });
    document.getElementById('fab-upptack')?.addEventListener('click', function() {
        showModal('jaktkort');
    });

    // Lägg till klickhändelse för att stänga modal när man klickar utanför modalen
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modals = ['modal-upptack', 'modal-upptack', 'modal-upptack'];
            modals.forEach(id => closeModal(id));
        }
    });
});
