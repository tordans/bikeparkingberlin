var mymap = L.map('mapid', {
    fullscreenControl: {
        pseudoFullscreen: false
    }
})
.setView([51.505, 13.09], 7);

var mapNodes = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 19,
    id: 'OrgMap'
}).addTo(mymap);

$('#mapid').css("position", "sticky");

var nodes = new L.geoJson(null, {onEachFeature: onEachFeaturePopup,
    pointToLayer:
        function (feature, latlng) {
            var colorm = 'red';
            if ( feature.properties.requestedValue && feature.properties.requestedValue != '' ) {
                selectBox = document.getElementById("selectValue");
                if (selectBox.value == '-' || selectBox.value == feature.properties.requestedValue) 
                    colorm = 'green';
                else
                    colorm = 'yellow';
            }
            var redMarker = L.ExtraMarkers.icon({
                icon: 'fa-number',
                markerColor: colorm,
                shape: 'circle'
            });
            return L.marker(latlng, {icon: redMarker }); 
        }
    });
nodes.addTo(mymap);

function onEachFeaturePopup(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        if (feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
        if (feature.properties.osm_id) {
            layer.on('popupopen', function(e) { window.location.href = '#' + feature.properties.osm_id; })
            mapNodes[feature.properties.osm_id] = layer;
        }
    }
}

function openNode(osm_id) {
    if (mapNodes[osm_id]) {
        mapNodes[osm_id].openPopup();
    }
}
if ("onhashchange" in window) {
    // move popup for node if anchor is changed
    window.onhashchange = function () {
        openNode(window.location.hash.substring(1));
    }
}