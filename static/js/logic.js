
var map = L.map("map", {
  center: [20,0],
  zoom: 3,
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
  Light: light
}

var markers=new L.LayerGroup();

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson', function(data) {

  console.log(data.metadata);
  
  L.Control.textbox = L.Control.extend({
    onAdd: function(map) {
      
      var text = L.DomUtil.create('div');
      text.id = "info_text";
      text.innerHTML = "<h3><a href='" + data.metadata.url + "'>Today's Global Earthquake Activity</a></h3><h5>" + data.metadata.count + " earthquakes in the past 24 hours</h5><strong>" + new Date(data.metadata.generated) + "</strong>"
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
      else if (magnitude >= 3){return 'yellowgreen';}
      else if (magnitude >= 2) {return 'green';}
      else if (magnitude >= 1) {return 'blue';}
      else if (magnitude < 1) {return 'black';}
    }

    var markers1 = circle_markers.push(
      L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
        fillColor: color_swap(magnitude),
        fillOpacity: 0.5,
        radius: magnitude*25000,
        color: "black",
        weight: .75
      }).bindPopup("<h5><a href='" + data.features[i].properties.url + "'>" + data.features[i].properties.place + "</a></h5><hr><p>" + new Date(data.features[i].properties.time) + "<h4>Magnitude: " + data.features[i].properties.mag + "</h4></p>")
      .addTo(markers))
      markers.addTo(map)
    // );
  };

    var earthquakeStatusCode;
    var earthquakeCount = {
            Magnitude5plus: 0,
            Magnitude4to5: 0,
            Magnitude3to4: 0,
            Magnitude2to3: 0,
            Magnitude1to2: 0,
            MagnitudeUnder1: 0
        };

    for(i=0; i < data.features.length; i++) {
        
        // var magnitude = Object.assign({}, data.features[i].properties.mag);
        var magnitude = data.features[i].properties.mag;
    
        if (magnitude >=5){earthquakeStatusCode = "Magnitude5plus";} 
        else if (magnitude >= 4){earthquakeStatusCode = "Magnitude3to4";} 
        else if (magnitude >= 3){earthquakeStatusCode = "Magnitude3to4";}
        else if (magnitude >= 2) {earthquakeStatusCode = "Magnitude2to3";} 
        else if (magnitude >= 1) {earthquakeStatusCode = "Magnitude1to2";} 
        else {earthquakeStatusCode = "MagnitudeUnder1";}
        earthquakeCount[earthquakeStatusCode]++;
    };


    console.log(earthquakeCount);
    // updateLegend(earthquakeCount);
 
    L.Control.legend = L.Control.extend({
        onAdd: function(map) {
          
            var legend = L.DomUtil.create('div');
            legend.id = "legend";
            legend.innerHTML = [
                "<strong><table><tr><td><div class='Mag5'>Mag 5+</td><td align='right'>" + earthquakeCount.Magnitude5plus +"</td></div></tr>",
                "<tr><td><div class='Mag4'>Mag 4-5</td><td align='right'>" + earthquakeCount.Magnitude4to5 +"</td></div></tr>",
                "<tr><td><div class='Mag3'>Mag 3-4</td><td align='right'>" + earthquakeCount.Magnitude3to4 +"</td></div></tr>",
                "<tr><td><div class='Mag2'>Mag 2-3</td><td align = 'right'>" + earthquakeCount.Magnitude2to3 +"</td></div></tr>",
                "<tr><td><div class='Mag1'>Mag 1-2</td><td align='right'>" + earthquakeCount.Magnitude1to2 +"</td></div></tr>",
                "<tr><td><div class= 'MagUnder1'>Mag under 1</td><td align='right'>" +earthquakeCount.MagnitudeUnder1 + "</td></div></tr></strong></table>"
            ].join("");
            return legend;
    },

    onRemove: function(map) {
      // Nothing to do here
    }
  
  });  
  L.control.legend = function(opts) { return new L.Control.legend(opts);}
  L.control.legend({ position: 'bottomright' }).addTo(map);
  
});

var tectonic_plates=new L.LayerGroup();

d3.json('PB2002_plates.json', function(plate_data) {
    L.geoJson(plate_data).addTo(tectonic_plates)
    tectonic_plates.addTo(map);
});


var overlays = {
    Earthquakes:markers,
    TectonicPlates:tectonic_plates,
}


L.control.layers(baseMaps, overlays, {collapsed:false}).addTo(map);

map.on('popupopen', function(centerMarker) {
  var cM = map.project(centerMarker.popup._latlng);
  cM.y -= centerMarker.popup._container.clientHeight/5
  map.setView(map.unproject(cM),5, {animate: true})
});
