document.addEventListener("DOMContentLoaded", function() {
    console.log("filtreringsknapp.js is loaded and running.");

    const filterKnappContainer = document.createElement('div');
    Object.assign(filterKnappContainer.style, {
        position: 'fixed',
        top: '70%',
        right: '3px',
        transform: 'translateY(-40%)',
        zIndex: '500',
        display: 'block', // Alltid synlig för att testa
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        width: '60px',
        height: '60px',
    });

    const filterKnapp = document.createElement('button');
    filterKnapp.textContent = "Test Knapp"; // Skriv något text i knappen
    Object.assign(filterKnapp.style, {
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        padding: '0',
    });

    filterKnappContainer.appendChild(filterKnapp);
    document.body.appendChild(filterKnappContainer);
});
