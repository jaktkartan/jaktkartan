// Mapping län to respective Google Sheet URLs
const googleSheetUrls = {
    "BLEKINGE LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "DALARNAS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdU_PeaOHXTCF6kaZb0k-431-WY47GIhhfJHaXD17-fC72GvBp2j1Tedcoko-cHQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "GOTLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnahCXZhD9i9dBjwHe70vxPgeoOE6bG7syOVElw-yYfTzFoh_ANDxov5ttmQWYCw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "GÄVLEBORGS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKBoQAP9xihDzgBbm3t_SFZ70leHTWK0tJ82v1koj9QzSFJQxxkPmKLwATSoAPMA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "HALLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2BFE-SRmBCBS-0yByDhuEVp_sTnVw1zTiknHvfzE0Fmw4efRYz0EPMwnhGKiy5g/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "JÄMTLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTG9X1E7-ZXI7gp9-BizmipzFh701pawm3hxzVKu_DyRtQ1p2zshsjLy4-PB2exEw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "JÖNKÖPINGS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0cpVw1Eu79k1YIHiSLawV2PbV9kYxiRtrpM8dp33OdC-U-qsWS7GkqWMbTi2WkQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "KALMAR LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR72MO0TobqcwmZI2ioQ9lJGw38V1B2qECC5RILBDJHSHR7sOV3U_P3ucSolLieMg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "KRONOBERGS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpPY36rcqD3cp18IHfEeZcyJ2m-N4MZMX63_3lVZEaxvlR00JeQ8-mLyPHCyPD4Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "NORRBOTTENS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8OM2nEjFB8MPX8Uq9x5eRkFiLAOUUc_f358zWCxEYZUP2I_FDG1JCNFbM9Vuyg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "SKÅNE LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRH9Vp7_2DfEMY2qkQ7TI_haVuWH4u14zSff5NyOSafAzgGG22pIENzyRKpDObpEA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "STOCKHOLMS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9BnmJgLti5F3KZmXVMQXZO1cSJ9-3GJiDMgoTcd0Yyiv4fCbNkpycpG80nrcNnA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "SÖDERMANLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvDQei2FICBkyASfI0ZKktuRKVeOnLtk4RMEXqT_Ycg-ycmWydMbIQQM72O1Ctiw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "UPPSALA LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtBAPI022uMmngp6WwyK6dTD0IU8xM5j_WuN3T5dgpssPCg5gatmDGVtGc4r_aWQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "VÄRMLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyx5mAaJouc0DkfdjF9LGND-LrEk3b7ndFCRb_4ever12Gf95c1K5hLjYph3mcmw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "VÄSTERBOTTENS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQY5Xy7Mp13JyoehpsZcZiELwv1EBKybInh2HPSR8OK1c-_PZOvUTS4rD4uhFHRQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "VÄSTERNORRLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTK_yxu8WaXUNqFvMBFY1B-AtjrmRJ6KzoHJpK_0pOmEGF_UNgP7U-EoO5_ujSE4A/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "VÄSTMANLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vSU9ys200Rvtft1xU8Vz6hwCTiNlAK-9poMwuLht1l9SYzIqtIfOnb_XM8toL2pfA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "VÄSTRA GÖTALANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTgFOYLMInhQ7SZDQ4SFE17OJBpcUYSZcyVeCY_q2zBKNsdc5hbSwoRNMoFOMIeag/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "ÖREBRO LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTeXGD1OrUQ2L43q1pCdmt1clCZ5aCgbNSKaH2Bi_UOCrv8SXMOY_ePD5uzF7nBSQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false",
    "ÖSTERGÖTLANDS LÄN": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOyZdJccrGY4NDIGozjnF_IEpyp4_ZjjFxGY7trJVIieueJIJn3y76OqnsVEbMDg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false"
};

function openGoogleSheetForCounty(lan) {
    const sheetUrl = googleSheetUrls[lan];
    if (sheetUrl) {
        window.open(sheetUrl, '_blank');
    } else {
        console.error('No Google Sheet URL found for county:', lan);
    }
}

// Funktionsdeklaration för att få användarens län baserat på position
function getUserCounty(lat, lon) {
    return axios.get('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
        .then(function(response) {
            var geojson = response.data;
            var userCounty = null;

            L.geoJSON(geojson, {
                onEachFeature: function(feature, layer) {
                    var polygon = L.geoJSON(feature.geometry);
                    if (polygon.getBounds().contains([lat, lon])) {
                        userCounty = feature.properties.LÄN; // Använd rätt fältnamn
                    }
                }
            });

            if (userCounty) {
                return userCounty;
            } else {
                throw new Error('User is not located within any county polygon.');
            }
        })
        .catch(function(error) {
            console.error('Error determining user county:', error);
            return null;
        });
}

// Funktion för att hantera användarens position
function handleUserPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(`User position: ${lat}, ${lon}`);

    getUserCounty(lat, lon)
        .then(function(lan) {
            if (lan) {
                console.log(`User is located in ${lan}`);
                openGoogleSheetForCounty(lan);
            } else {
                console.error('Could not determine user county.');
            }
        });
}

// Starta process för att få användarens position
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleUserPosition, function(error) {
        console.error('Geolocation error:', error);
    }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
} else {
    console.error('Geolocation is not supported by this browser.');
}
