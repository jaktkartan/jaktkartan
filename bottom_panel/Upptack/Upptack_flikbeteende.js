// Funktion för att skapa dropdown-menyn i tab1
function openUpptack() {
    // Skapa container för dropdown
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.marginLeft = '10px';

    // Skapa dropdown-knappen
    const button = document.createElement('button');
    button.textContent = 'Filtrera';
    button.style.padding = '12px 16px';
    button.style.border = '1px solid rgb(50, 94, 88)';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = 'rgb(240, 240, 240)';
    button.style.color = 'rgb(50, 94, 88)';
    button.style.cursor = 'pointer';
    button.style.outline = 'none';
    button.style.zIndex = '999';

    // Skapa dropdown-innehåll
    const dropdownContent = document.createElement('div');
    dropdownContent.style.position = 'absolute';
    dropdownContent.style.bottom = '100%'; // Positionera innehållet ovanför knappen
    dropdownContent.style.left = '0';
    dropdownContent.style.width = '250px';
    dropdownContent.style.maxHeight = '200px';
    dropdownContent.style.overflowY = 'auto';
    dropdownContent.style.backgroundColor = 'white';
    dropdownContent.style.border = '1px solid rgb(50, 94, 88)';
    dropdownContent.style.borderRadius = '5px';
    dropdownContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dropdownContent.style.display = 'none';
    dropdownContent.style.opacity = '0';
    dropdownContent.style.visibility = 'hidden';
    dropdownContent.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';

    // Alternativ för filtrering
    const filters = [
        { text: 'Visa allt', action: 'Visa_allt' },
        { text: 'Mässor', action: 'Mässor', icon: 'bottom_panel/Upptack/bilder/massa_ikon.png' },
        { text: 'Jaktkort', action: 'Jaktkort', icon: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png' },
        { text: 'Jaktskyttebanor', action: 'Jaktskyttebanor', icon: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png' },
        { text: 'Rensa allt', action: 'Rensa_allt' }
    ];

    filters.forEach(filter => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = filter.text;
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.padding = '8px 12px';
        link.style.textDecoration = 'none';
        link.style.color = 'rgb(50, 94, 88)';
        link.style.borderBottom = '1px solid rgb(50, 94, 88)';
        link.style.backgroundColor = 'rgb(240, 240, 240)';
        link.style.cursor = 'pointer';

        link.addEventListener('click', function (event) {
            event.preventDefault(); // Förhindra standardlänk-beteende
            if (typeof Upptack_geojsonHandler !== 'undefined') {
                Upptack_geojsonHandler.toggleLayer(filter.action);
            } else {
                console.error("Upptack_geojsonHandler är inte definierad.");
            }
        });

        if (filter.icon) {
            const img = document.createElement('img');
            img.src = filter.icon;
            img.alt = filter.text;
            img.style.width = '30px';
            img.style.height = '30px';
            img.style.marginRight = '10px';
            link.insertBefore(img, link.firstChild);
        }

        dropdownContent.appendChild(link);
    });

    // Lägg till dropdown-knappen och -innehåll i containern
    container.appendChild(button);
    container.appendChild(dropdownContent);

    // Lägg till containern i tab1
    const tab1 = document.getElementById('tab1');
    if (tab1) {
        tab1.appendChild(container);
    } else {
        console.error("Tab1 är inte definierad.");
    }

    // Lägg till eventlyssnare för att visa/dölj dropdown-innehållet
    button.addEventListener('click', function () {
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
        dropdownContent.style.opacity = isVisible ? '0' : '1';
        dropdownContent.style.visibility = isVisible ? 'hidden' : 'visible';
    });

    // Lägg till eventlyssnare för att stänga dropdown när klickas utanför
    document.addEventListener('click', function (event) {
        if (!container.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropdownContent.style.opacity = '0';
            dropdownContent.style.visibility = 'hidden';
        }
    });
}
