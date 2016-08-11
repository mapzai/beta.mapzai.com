/********************************
*   MAPZAI
* 
*   Coopyright 2016 - All rights reserved
*   Mapzai.com
********************************/

//inserting drawControl for leaflet draw plugin
var map = L.map('map');

// Set Initial viewport to Hong Kong
map.setView([22.278816, 114.165076], 12);

// Create basemap tileLayer and "addTo" the map
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

// Code to add a single marker at a single point (no longer used)
// var marker = L.marker([51.2, 7]).addTo(map);

// Leaflet.Draw Plugin
// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();

// Add the FeatureGroup (which is editable using leaflet.draw) to the map
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        circle: {
            shapeOptions: {
                color: '#202C52',
                opacity: 0.3,
            }}
    },
    edit: {
        featureGroup: drawnItems
    }
});
// Add the drawcontrol to the map
map.addControl(drawControl);

// Listeners to run when new drawing object is created
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        // Do marker specific actions
    }

    // Do whatever else you need to. (save to db, add to map etc)
    drawnItems.addLayer(layer);
});

var sampleGeoJsonFile = '/data/hk/hk-schools-sample.geojson'
var geoJsonImport = new L.GeoJSON.AJAX(sampleGeoJsonFile, {
    onEachFeature: function (feature, layer) {
        drawnItems.addLayer(layer);
        onEachFeature(feature, layer);

    }
});

drawnItems.addLayer(geoJsonImport); // modified code to add this layer to be editable - testing

function clearLayer(layer) {
    layer.clearLayers();
};


/*
 Sample code taken from leaflet examples (http://leafletjs.com/examples/geojson-example.html)
*/
function onEachFeature(feature, layer) {
    var popupContent = "<strong>Mapzai popup</strong><br />Feature Type: " +
            feature.geometry.type;

    if (feature.id) {
        popupContent = "<strong>" + feature.geometry.type + "</strong><br/>" +
            "id: <a target=\"_blank\" href=\"http://www.openstreetmap.org/" + feature.id + "\">" + feature.id + "</a>";
    }

/*    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
*/
    layer.bindPopup(popupContent);
}


var clearLayers = document.getElementById('clearLayers');
clearLayers.addEventListener('click', function() {
    clearLayer(drawnItems);
    //alert('Cleared All Layers!');
}, false);
