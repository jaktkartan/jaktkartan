document.addEventListener('DOMContentLoaded', function() {
    // Funktion för att visa modalen och ladda innehåll
    function showModal(layerName) {
        var modalId = getModalId(layerName);
        var modal = document.getElementById(modalId);
        if (modal) {
            var modalPath = getModalPath(layerName);

            fetch(modalPath)
                .then(response => response.text())
                .then(html => {
                    var modalContent = modal;
                    if (modalContent) {
                        modalContent.innerHTML = html;
                        modal.style.display = 'block';
                        
                        // Lägg till klickhändelser för att stänga modalen
                        var closeBtn = modal.querySelector('.close');
                        if (closeBtn) {
                            closeBtn.addEventListener('click', function() {
                                closeModal(modalId);
                            });
                        }
                    }
                })
                .catch(error => console.error('Error loading modal content:', error));
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    // Funktion för att stänga modalen
    function closeModal(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        } else {
            console.error('Modal not found:', modalId);
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
            case 'Älgjaktsområden':
                return 'modal-alg-omraden';
            case 'Upptäck':
                return 'modal-upptack';
            case 'Startmodal':
                return 'modal-startruta';
            default:
                return ''; // Om inget matchar
        }
    }

    // Hjälpfunktion för att få rätt sökväg till modalfilen baserat på lagrets namn
    function getModalPath(layerName) {
        switch(layerName) {
            case 'Allmän jakt: Däggdjur':
                return 'bottom_panel/Kartor/modal-daggdjur.html';
            case 'Allmän jakt: Fågel':
                return 'bottom_panel/Kartor/modal-fagel.html';
            case 'Älgjaktskartan':
                return 'bottom_panel/Kartor/modal-alg.html';
            case 'Älgjaktsområden':
                return 'bottom_panel/Kartor/modal-alg-omraden.html';
            case 'Upptäck':
                return 'bottom_panel/Upptack/modal-upptack.html';
            case 'Startmodal':
                return 'modal-startruta.html';
            default:
                return ''; // Om inget matchar
        }
    }

    // Lägg till klickhändelser för att visa modaler
    var fabDaggdjur = document.getElementById('fab-daggdjur');
    if (fabDaggdjur) {
        fabDaggdjur.addEventListener('click', function() {
            showModal('Allmän jakt: Däggdjur');
        });
    }

    var fabFagel = document.getElementById('fab-fagel');
    if (fabFagel) {
        fabFagel.addEventListener('click', function() {
            showModal('Allmän jakt: Fågel');
        });
    }

    var fabAlg = document.getElementById('fab-alg');
    if (fabAlg) {
        fabAlg.addEventListener('click', function() {
            showModal('Älgjaktskartan');
        });
    }

    var fabAlgOmraden = document.getElementById('fab-alg-omraden');
    if (fabAlgOmraden) {
        fabAlgOmraden.addEventListener('click', function() {
            showModal('Älgjaktsområden');
        });
    }

    var fabUpptack = document.getElementById('fab-upptack');
    if (fabUpptack) {
        fabUpptack.addEventListener('click', function() {
            showModal('Upptäck');
        });
    }

    // Lägg till klickhändelse för att stänga modal när man klickar utanför modalen
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modals = ['modal-daggdjur', 'modal-fagel', 'modal-alg', 'modal-upptack', 'modal-startruta', 'modal-alg-omraden'];
            modals.forEach(id => closeModal(id));
        }
    });

    // Visa startmodalen när sidan initieras
    showModal('Startmodal');
});
