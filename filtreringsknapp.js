document.addEventListener("DOMContentLoaded", function() {
    console.log("filtreringsknapp.js is loaded and running.");

    // Skapa container för filtreringsknappen
    const filterKnappContainer = document.createElement('div');
    Object.assign(filterKnappContainer.style, {
        position: 'fixed',
        top: '70%',
        right: '3px',
        transform: 'translateY(-40%)',
        zIndex: '1000',  // Sätt ett högre z-index för säkerhets skull
        display: 'block', // Gör knappen alltid synlig för att testa
        backgroundColor: 'red', // Testa med en röd bakgrund för att göra den synlig
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

    // Lägger till text i knappen tillfälligt för att se om den visas
    filterKnapp.textContent = "Filtrera";

    filterKnappContainer.appendChild(filterKnapp);
    document.body.appendChild(filterKnappContainer);

    console.log('Filterknapp skapad och tillagd i DOM');
});
