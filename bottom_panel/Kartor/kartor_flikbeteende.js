// Funktion för att skapa kartor-fliken
function openKartor() {
    // Skapa container för dropdown
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.display = 'inline-flex'; // Använd flexbox för att arrangera knapparna horisontellt
    container.style.marginLeft = '10px';

    // Skapa dropdown-knappen
    const filterButton = document.createElement('button');
    filterButton.textContent = 'Filtrera';
    filterButton.style.padding = '12px 16px';
    filterButton.style.border = '1px solid rgb(50, 94, 88)';
    filterButton.style.borderRadius = '5px';
    filterButton.style.backgroundColor = 'rgb(240, 240, 240)';
    filterButton.style.color = 'rgb(50, 94, 88)';
    filterButton.style.cursor = 'pointer';
    filterButton.style.outline = 'none';
    filterButton.style.zIndex = '999';

    // Skapa dropdown-innehåll
    const dropdownContent = document.createElement('div');
    dropdownContent.style.position = 'absolute';
    dropdownContent.style.top = '100%'; // Positionera innehållet direkt under knappen
    dropdownContent.style.left = '0'; // Positionera innehållet direkt till vänster om knappen
    dropdownContent.style.whiteSpace = 'nowrap'; // Förhindra radbrytning
    dropdownContent.style.overflowX = 'auto'; // Horisontell rullning om det inte får plats
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

    // Använd flexbox för att ordna alternativen horisontellt
    dropdownContent.style.display = 'flex';
    dropdownContent.style.flexDirection = 'row';

    filters.forEach(filter => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = filter.text;
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.padding = '8px 12px';
        link.style.textDecoration = 'none';
        link.style.color = 'rgb(50, 94, 88)';
        link.style.borderRight = '1px solid rgb(50, 94, 88)';
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

    // Skapa knappen "Nästkommande mässa"
    const nextEventButton = document.createElement('button');
    nextEventButton.textContent = 'Nästkommande mässa';
    nextEventButton.style.padding = '12px 16px';
    nextEventButton.style.border = '1px solid rgb(50, 94, 88)';
    nextEventButton.style.borderRadius = '5px';
    nextEventButton.style.backgroundColor = 'rgb(240, 240, 240)';
    nextEventButton.style.color = 'rgb(50, 94, 88)';
    nextEventButton.style.cursor = 'pointer';
    nextEventButton.style.outline = 'none';
    nextEventButton.style.marginLeft = '10px'; // Lägg till mellanrum mellan knapparna
    nextEventButton.style.zIndex = '999';

    // Lägg till en eventlyssnare för knappen "Nästkommande mässa"
    nextEventButton.addEventListener('click', function () {
        // Implementera vad som ska hända när knappen klickas
        alert('Här kan du lägga till funktionalitet för att visa nästa mässa!');
    });

    // Lägg till knapparna i containern
    container.appendChild(filterButton);
    container.appendChild(dropdownContent);
    container.appendChild(nextEventButton);

    // Lägg till containern i tab1
    const tab1 = document.getElementById('tab1');
    if (tab1) {
        tab1.appendChild(container);
    } else {
        console.error("Tab1 är inte definierad.");
    }

    // Lägg till eventlyssnare för att visa/dölj dropdown-innehållet
    filterButton.addEventListener('click', function () {
        const isVisible = dropdownContent.style.display === 'flex';
        dropdownContent.style.display = isVisible ? 'none' : 'flex';
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
