document.addEventListener('DOMContentLoaded', function() {
    function loadIframe(url) {
        document.getElementById('sheet-iframe').src = url;
        document.getElementById('iframe-container').style.display = 'block';
    }

    const buttons = document.querySelectorAll('.county-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            loadIframe(this.dataset.url);
        });
    });
});
