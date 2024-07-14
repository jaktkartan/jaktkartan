document.addEventListener('DOMContentLoaded', function() {
    // Funktion för att visa modalen och ladda innehåll
    function showModal(layerName) {
        var modalId = getModalId(layerName);
        var modal = document.getElementById(modalId);
        if (modal) {
            fetch(`path/to/bottom_panel/Kartor/${modalId}.html`)
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
            case 'Allmän jakt: Däggdjur':
                return 'modal-daggdjur';
            case 'Allmän jakt: Fågel':
                return 'modal-fagel';
            case 'Älgjaktskartan':
                return 'modal-alg';
            default:
                return '';
        }
    }

    // Lägg till klickhändelser för att visa modaler
    document.getElementById('fab-daggdjur')?.addEventListener('click', function() {
        showModal('Allmän jakt: Däggdjur');
    });
    document.getElementById('fab-fagel')?.addEventListener('click', function() {
        showModal('Allmän jakt: Fågel');
    });
    document.getElementById('fab-alg')?.addEventListener('click', function() {
        showModal('Älgjaktskartan');
    });

    // Lägg till klickhändelse för att stänga modal när man klickar utanför modalen
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modals = ['modal-daggdjur', 'modal-fagel', 'modal-alg'];
            modals.forEach(id => closeModal(id));
        }
    });
});
