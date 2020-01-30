
var map = L.map("map", {
  center: [20,0],
  zoom: 3
});

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  zoom: 2,
  maxZoom: 15,
  minZoom:2,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  zoom: 2,
  maxZoom: 15,
  minZoom:2,
  id: "mapbox.pirates",
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

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  zoom:2,
  maxZoom: 18,
  minZoom:2,
  id: "mapbox.satellite",
  accessToken: API_KEY
}).addTo(map);

var baseMaps = {
  Satellite: satellite,
  Pirate:pirates,
  Dark: dark,
  Light: light,
}

d3.json('PB2002_plates.json', function(tectonic_plates) {
  var all_plates=tectonic_plates.features
  
  for(i=0; i<all_plates.length; i++) {
    var plate=all_plates[i].geometry.coordinates[0]
    
    plate_coords=[]
    for(j=0; j<plate.length; j++){
      plate_coord=[plate[j][1],plate[j][0]]
      plate_coords.push(plate_coord)
    }
    
    var polygonPoints = plate_coords;

    var poly = L.polygon(polygonPoints).addTo(map);
  }
})

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
      if (magnitude >= 5){return 'red';}
      else if (magnitude >= 4){return 'orange';}
      else if (magnitude >= 3){return 'yellow';}
      else if (magnitude >= 2) {return 'yellowgreen';}
      else if (magnitude >= 1) {return 'green';}
      else if (magnitude < 1) {return 'black';}
    }

    circle_markers.push(
      L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
        fillColor: color_swap(magnitude),
        fillOpacity: 0.5,
        radius: magnitude*25000,
        color: "black",
        weight: .75
      }).bindPopup("<h5><a href='" + data.features[i].properties.url + "'>" + data.features[i].properties.place + "</a></h5><hr><p>" + new Date(data.features[i].properties.time) + "<h4>Magnitude: " + data.features[i].properties.mag + "</h4></p>")
      .addTo(map)
    );
  };

//   var earthquakeCount = {
//     Magnitude5plus: 0,
//     Magnitude4to5: 0,
//     Magnitude3to4: 0,
//     Magnitude2to3: 0,
//     Magnitude1to2: 0,
//     MagnitudeUnder1: 0
//   }

//   var earthquakeStatusCode;

//   for(i=0; i < data.features.length; i++) {

//     var magnitude = Object.assign({}, data.features[i].properties.mag);
    
//       if (magnitude >=5){
//         earthquakeStatusCode = "Magnitude5plus";
//       } 
      
//       else if (magnitude >= 4){
//         earthquakeStatusCode = "Magnitude3to4";
//       } 
      
//       else if (magnitude >= 3){
//         earthquakeStatusCode = "Magnitude3to4";
//       }
      
//       else if (magnitude >= 2) {
//         earthquakeStatusCode = "Magnitude2to3";
//       } 
      
//       else if (magnitude >= 1) {
//         earthquakeStatusCode = "Magnitude1to2";
//       } 
      
//       else {
//         earthquakeStatusCode = "MagnitudeUnder1";
//       }
    

//   earthquakeCount[earthquakeStatusCode]++;

//   var circleMarker = L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
//       fillColor: color_swap(magnitude),
//       fillOpacity: 0.5,
//       radius: magnitude*25000,
//       color: "black",
//       weight: .75
//     });

//   circleMarker.addTo(layers[earthquakeStatusCode]);

//   circleMarker.bindPopup("<h5><a href='" + data.features[i].properties.url + "'>" + data.features[i].properties.place + "</a></h5><hr><p>" + new Date(data.features[i].properties.time) + "<h4>Magnitude: " + data.features[i].properties.mag + "</h4></p>").addTo(map)
// }

//   updateLegend(earthquakeCount);
 
// });

// function updateLegend(earthquakeCount) {
//   document.querySelector(".legend").innerHTML = [
//     "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//     "<p class='Mag5+'>Magnitude 5+: " + earthquakeCount.Magnitude5plus + "</p>",
//     "<p class='Mag4-5'>Magnitude 4-5: " + earthquakeCount.Magnitude4to5 + "</p>",
//     "<p class='Mag3-4'>Magnitude 3-4: " + earthquakeCount.Magnitude3to4 + "</p>",
//     "<p class='Mag2-3'>Magnitude 2-3: " + earthquakeCount.Magnitude2to3 + "</p>",
//     "<p class='Mag1-2'>Magnitude 1-2: " + earthquakeCount.Magnitude1to2 + "</p>",
//     "<p class= 'MagUnder1'>Magnitude Under 1: " +earthquakeCount.MagnitudeUnder1 + "</p>"
//   ].join("");
// }
});

L.control.layers(baseMaps, null,{collapsed:false}).addTo(map);

map.on('popupopen', function(centerMarker) {
  var cM = map.project(centerMarker.popup._latlng);
  cM.y -= centerMarker.popup._container.clientHeight/5
  map.setView(map.unproject(cM),5, {animate: true})
});
