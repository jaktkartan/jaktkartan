function openTab(tabId, filePath) {
    console.log("Opening tab:", tabId, "with file path:", filePath);

    var tabContent = document.getElementById('tab-content');
    var tabs = document.getElementsByClassName('tab-pane');

    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }

    var activeTab = document.getElementById(tabId);
    if (!activeTab) {
        console.error("No element found with id:", tabId);
        return;
    }

    activeTab.style.display = 'block';
    activeTab.classList.add(tabId);

    tabContent.style.display = 'block';

    console.log("Fetching content from:", filePath);
    axios.get(filePath)
        .then(function (response) {
            console.log("Content fetched for tabId:", tabId);
            console.log(response.data); // Log the fetched content
            activeTab.innerHTML = response.data;
        })
        .catch(function (error) {
            console.error("Error fetching content for tab:", tabId, "Error message:", error.message);
        });
}
