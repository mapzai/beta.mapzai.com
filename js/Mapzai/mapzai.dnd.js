function dropJSON(targetEl, callback) {
    // disable default drag & drop functionality
    targetEl.addEventListener('dragenter', function(e){ e.preventDefault(); });
    targetEl.addEventListener('dragover',  function(e){ e.preventDefault(); });

    targetEl.addEventListener('drop', function(event) {

        var reader = new FileReader();
        reader.onloadend = function() {
            var data = JSON.parse(this.result);
            callback(data);
        };

        reader.readAsText(event.dataTransfer.files[0]);    
        event.preventDefault();
    });
}

dropJSON(
    document.getElementById("dropTarget"),
    function(data) {
        
        // dropped - do something with data
        console.log(data);

        // Modifying code to add popups
        var importedDataLayer =  L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                onEachFeature(feature, layer);
            }
        });

        var droppedGeoJson = drawnItems.addLayer(importedDataLayer);
        var featureGroupBounds = droppedGeoJson.getBounds()        
        map.fitBounds(featureGroupBounds);
    }
);