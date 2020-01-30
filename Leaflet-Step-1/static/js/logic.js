
var map = L.map("map", {
  center: [20,0],
  zoom: 3
});

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  zoom: 2,
  maxZoom: 15,
  minZoom:2,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);


var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  zoom:2,
  maxZoom: 18,
  minZoom:2,
  id: "mapbox.dark",
  accessToken: API_KEY
}).addTo(map);

var baseMaps = {
  Dark: dark,
  Light: light
}

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson', function(data) {
  console.log(data.metadata);
  L.Control.textbox = L.Control.extend({
    onAdd: function(map) {
      
    var text = L.DomUtil.create('div');
    text.id = "info_text";
    text.innerHTML = "<h1><a href='" + data.metadata.url + "'>Today's Global Earthquake Activity</a></h1><h4>" + data.metadata.count + " earthquakes in the past 24 hours</h4><h6>" + new Date(data.metadata.generated) + "</h6>"
    return text;
    },

    onRemove: function(map) {
      // Nothing to do here
    }
  });
  L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
  L.control.textbox({ position: 'bottomleft' }).addTo(map);

  console.log(data.features)

  var circle_markers=[];
  for(i=0; i < data.features.length; i++) {
    var magnitude = data.features[i].properties.mag
    function color_swap(magnitude){ 
      if (magnitude >= 5){
          return 'red';
      } else if (magnitude >= 4){
          return 'orange';
      } else if (magnitude >= 3){
          return 'yellow';
      }  else if (magnitude >= 2) {
          return 'yellowgreen';
      } else if (magnitude >= 1) {
          return 'green';
      } else if (magnitude < 1) {
        return 'black';
      }
    }
  circle_markers.push(
    L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
      fillColor: color_swap(magnitude),
      fillOpacity: 0.5,
      radius: magnitude*25000,
      color: "black",
      weight: .75
    })
    .bindPopup("<h5><a href='" + data.features[i].properties.url + "'>" + data.features[i].properties.place + "</a></h5><hr><p>" + new Date(data.features[i].properties.time) + "<h4>Magnitude: " + data.features[i].properties.mag + "</h4></p>").addTo(map)
  );
  var earthquakes = L.layerGroup(circle_markers)
  console.log(earthquakes);

var overlayMaps = {
  Earthquakes:earthquakes
};

};



});


L.control.layers(baseMaps, null,{collapsed:false}).addTo(map);



          

map.on('popupopen', function(centerMarker) {
  var cM = map.project(centerMarker.popup._latlng);
  cM.y -= centerMarker.popup._container.clientHeight/5
  map.setView(map.unproject(cM),5, {animate: true})
});

L.Control.legend = L.Control.extend({
  onAdd: function(map) {
    
     var legend = L.DomUtil.create('div');
     legend.id = "legend";
     legend.innerHTML = "<center><h4>Magnitudes</h4>"
     return legend;
     },

   onRemove: function(map) {
     // Nothing to do here
   }

 });




L.control.textbox = function(opts) { return new L.Control.legend(opts);}
L.control.textbox({ position: 'bottomright' }).addTo(map);




