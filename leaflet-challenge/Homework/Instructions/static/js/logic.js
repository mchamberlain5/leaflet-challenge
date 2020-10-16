// Store our API endpoint inside queryUrl
var queryUrl = "static/js/all_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  console.log(earthquakeData);

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function radiusSize(magnitude) {
    return magnitude * 5;
      }


  function circleColor(d) {
    if (d < 10) {
      return "#feebe2"
    }
    else if (d > 10 && d < 20) {
      return "#fcc5c0"
    }
    else if (d > 20 && d < 50) {
      return "#fa9fb5"
    }
    else if (d > 50 && d < 100) {
      return  "#f768a1"
    }
    else if (d > 100  && d < 200) {
      return "#dd3497"
    }
    else if (d > 200  && d< 300) {
      return "#ae017e"
    }
    else if (d > 300  && d < 500) {
      return "#7a0177"
    }
    else {
      return "#feebe2"
    }
  }
function style (feature) {
  return {
        radius: radiusSize(feature.properties.mag),
        color: circleColor(feature.geometry.coordinates[2]),
        fillOpacity: 1
      }
}

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circleMarker(latlng);
    },
    onEachFeature: onEachFeature, 
     style: style 
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  //fault liines
/*var faults = new L.layerGroup();

faultsURL = "static/js/PB2002_boundaries"

d3.json(faultsURL, function(response) {
  function faultStyle(feature) {
    return {
      weight: 2,
      color: "white"
    };
  }

  L.geoJSON(response, {
    style: faultStyle
  }).addTo(faults);
  faults.addTo(map)
})
*/
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

    // Set up the legend
  var legend = L.control({ position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depth = ["<10","10-20","20-50","50-100","100-200","200-300","300-500"];
    var colors = ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"];
    var labels = [];

    // div.innerHTML 
    labels.push("<p style='background-color: #feebe2'<b> Depth (km) </b></p>");
    depth.forEach(function(depth,i){
    	labels.push(`<ul style="background-color: ${colors[i]}"> ${depth} km </ul>`);
	});

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);


};
