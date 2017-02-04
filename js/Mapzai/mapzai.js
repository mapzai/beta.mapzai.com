/********************************
*   MAPZAI
* 
*   Coopyright 2017 - All rights reserved
*   Mapzai.com
*   
********************************/

var markets = {
    "HKG" : {
        marketName: "Hong Kong",
        latLng: [22.278816, 114.165076],
        zoom: 12
    },
    "SIN" : {
        marketName: "Singapore",
        latLng: [1.290270, 103.851959],
        zoom: 12
    },
    "BNE" : {
        marketName: "Brisbane",
        latLng: [-27.470125, 153.021072],
        zoom: 11
    },
    "SYD" : {
        marketName: "Sydney",
        latLng: [-33.865143, 151.209900],
        zoom: 12
    }
};

// OSM layers
var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});

var cartoUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
var cartoAttrib = 'Map data &copy; OpenStreetMap contributors';
var carto = new L.TileLayer(cartoUrl, {attribution: cartoAttrib})

var cartoDarkUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
var cartoDarkAttrib = 'Map data &copy; OpenStreetMap contributors';
var cartoDark = new L.TileLayer(cartoDarkUrl, {attribution: cartoDarkAttrib})

//inserting drawControl for leaflet draw plugin
var map = L.map('map', {
    center: [22.278816, 114.165076],
    zoom: 12
});

// Set the default/initial map layer
map.addLayer(carto);

var baseMaps = [
    {
        groupName : "OSM Base Maps",
        layers    : {
            "OpenStreetMaps" : osm
        }
    }, {
        groupName : "Carto Base Maps",
        layers    : {
            "Light" : carto,
            "Dark"  : cartoDark
        }
    }                           
];

var overlays = [];

var options = {
    container_width     : "300px",
    container_maxHeight : "450px", 
    group_maxHeight     : "80px",
    exclusive           : false
};

// Add the StyleLayerControl control to the map
var control = L.Control.styledLayerControl(baseMaps, overlays, options);
map.addControl(control);

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

var sampleGeoJsonFile = '/data/hkg/hk-schools-sample.geojson'
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

function panToMarket(marketCode) {
    latLng = markets[marketCode].latLng;
    zoom = markets[marketCode].zoom;
    map.setView(latLng, zoom);
    //map.setZoom(zoom);
    console.log(latLng + ":" + zoom);
}

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

// Create event binding and function for clearing all layers.
// We are binding to the click event for this button/link.
var clearLayers = document.getElementById('clearLayers');
clearLayers.addEventListener('click', function() {
    clearLayer(drawnItems);
    //alert('Cleared All Layers!');
}, false);

// Create event binding for GoToMarkets
$(".goToMarket").click(function(e) {
    market = $(this).attr('data-market');
    panToMarket(market);
    //console.log(market);
});

$(".loadData").click(function(e) {
    dataUrl = $(this).attr('data-url');
    console.log(dataUrl);

    var geoJsonFile = dataUrl;
    var geoJsonImport = new L.GeoJSON.AJAX(geoJsonFile, {
        onEachFeature: function (feature, layer) {
            drawnItems.addLayer(layer);
            onEachFeature(feature, layer);
        }
    });
    console.log(geoJsonImport);
    // trying to zoom the map to fit the bounds of the just-loaded dataset.
    var featureGroupBounds = geoJsonImport.getBounds();
    // map.fitBounds(featureGroupBounds);
    // Try to disable or grey-out the button after the layer has been loaded.
});
