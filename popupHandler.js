<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popup Panel</title>
    <style>
        #popup-panel {
            position: fixed;
            bottom: 0px;
            width: 100%;
            height: 40%;
            background-color: #fff;
            border-top: 5px solid #000;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
            overflow-y: auto;
            transform: translateY(100%);
            transition: transform 0.5s ease-in-out;
        }

        .show {
            transform: translateY(0);
        }

        .hide {
            transform: translateY(100%);
        }
    </style>
</head>
<body>
    <button onclick="showPopupPanel()">Visa popup</button>
    <div id="popup-panel" class="hide">
        <div id="popup-panel-content">Popup innehåll här</div>
    </div>
    <script>
        var popupPanel = document.getElementById('popup-panel');
        
        function showPopupPanel() {
            popupPanel.classList.remove('hide');
            popupPanel.classList.add('show');
        }
    </script>
</body>
</html>
