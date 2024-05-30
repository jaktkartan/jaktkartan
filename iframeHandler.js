function showIframe(url) {
    var iframeContainer = document.getElementById('iframe-container');
    var countyButtons = document.getElementById('county-buttons');
    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);
    countyButtons.style.display = 'none'; // Dölj knappen när iframe visas
    iframeContainer.style.display = 'block';
}
