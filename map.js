$(document).ready(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGFya291cm1ldGhvZCIsImEiOiI5Y2JmOGJhMDYzZDgyODBhYzQ3OTFkZWE3NGFiMmUzYiJ9.kp_5LMwcR79TKOERpkilAQ';
    
    var googleAPI = 'AIzaSyALB5yXEHcbkr51lCbrPeCdVf60SbWENtU';
    
    // Set bounds to DMV
    var bounds = [
        [-77.247255, 38.764495], // Southwest coordinates
        [-76.851141, 39.032550]  // Northeast coordinates
    ];
    
    var currentAddress;
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/parkourmethod/cim5hb9c600jza0m473wrw6y6',
        center: [-77.043132, 38.902705],
        zoom: 16,
        minZoom: 4,
        attributionControl: false
    });

    map.dragRotate.disable();
        
    var defLoc = "DC";
    
    //initial button focus
    document.getElementById("DC").focus();
    
    //initialize car for transit
    var transitType = "driving";
    document.getElementById("car").style.backgroundColor = "#3A5391";
        
    //fly to cities
    $('.DC').on('click', function(e) {
        map.flyTo({
            center: [-77.043132, 38.902705],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "DC";
    });
    
    $('.NYC').on('click', function() {
        map.flyTo({
            center: [-73.998742, 40.725301],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "NYC";
    });
    
    $('.SF').on('click', function() {
        map.flyTo({
            center: [-122.410829, 37.785506],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "SF";
    });
    
    $('.PA').on('click', function() {
        map.flyTo({
            center: [-122.155012, 37.447295],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "PA";
    });
    
    $('.SM').on('click', function() {
        map.flyTo({
            center: [-118.480961, 34.001161],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "SM";
    });
    
    $('.CHI').on('click', function() {
        map.flyTo({
            center: [-87.628595, 41.881745],
            zoom: 16,
            speed: 1.5
        });
        
        defLoc = "CHI";
    });
    
    //keep focus on the buttons so they stay highlighted
    map.on("click", function(){
       //keep focus on buttons
        document.getElementById(defLoc).focus();
    });
    
    map.on("dragend", function(){
       //keep focus on buttons
        document.getElementById(defLoc).focus();
    });
    
    map.on("dragstart", function(){
       //keep focus on buttons
        document.getElementById(defLoc).focus();
    });
    
    //zoom buttons
    $('.IN').on('click', function(e) {
        var zoom = map.getZoom();        
        map.setZoom(zoom + 1);
    });
    
    $('.OUT').on('click', function(e) {
        var zoom = map.getZoom();        
        map.setZoom(zoom - 1);
    });
    
    //search
    $('.address-search').on('click', function(e) {
         var query = document.getElementById('address-query').value;
        var cityState = document.getElementById('city-state').value;
                
        if(cityState == ""){
            coordSearch(query);
        }else{
            if(cityState.indexOf(",") == -1){
                alert("Make sure there is a comma between city and state.");
                return;
            }
            
            stateSearch(query, cityState);
        }
        
//        googleSearch(query + " " + cityState);
//        openSearch(query + " " + cityState);
    });
    
    function stateSearch(thisQuery, cityState){
        var xhttp = new XMLHttpRequest();
        
        //split address
        var splitQuery = cityState.split(",");
        
        var state = splitQuery[1].replace(/\s/g, '');
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);

               if(myArr[0]){
                   readLocation(myArr);
                   
                   //setup additional searches
                   googleSearch(thisQuery + " " + cityState);
                   openSearch(thisQuery + " " + cityState);
               }else{
                   console.log("no data found");
                   alert("No Matching Address found. Please try another address.");
               }
           }else if(xhttp.readyState == 4){
               alert(xhttp.responseText);
           }
             
         };
        
        xhttp.open('GET', "https://api.parkourmethod.com/address?address=" + thisQuery + "\&city="+ splitQuery[0] +"\&state=" + state + "\&api_key=c628cf2156354f53b704bd7f491607a7", true);
        
         xhttp.send();
    }
    
    function coordSearch(thisQuery){
        var xhttp = new XMLHttpRequest();
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);

               if(myArr[0]){
                   readLocation(myArr);
               }else{
                   console.log("no data found");
                   alert("No Matching Address found. Please try another address.");
               }
           }  
         };

         xhttp.open('GET', "https://api.parkourmethod.com/address?address=" + thisQuery + "\&lat=" + center.lat +"\&lon=" + center.lng + "\&api_key=c628cf2156354f53b704bd7f491607a7", true);
        
         xhttp.send();
    }
    
    function googleSearch(thisQuery){
        
        for(var i = 0; i < thisQuery.length; i++) {
         thisQuery = thisQuery.replace(" ", "+");
        }
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
               
               //get start point
                var result = response.results;
                var thisLoc = result[0].geometry.location;

               dropGoogle(thisLoc);
           }  
         };
        
        xhttp.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + thisQuery + "&key=" + googleAPI, true);
        
        xhttp.send();
    }
    
    function openSearch(thisQuery){
        
        for(var i = 0; i < thisQuery.length; i++) {
            thisQuery = thisQuery.replace(" ", "+");
        }
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
                              
                var features = response.features;
                var center = features[0].center;

               dropOpen(center);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/geocoding/v5/mapbox.places/" + thisQuery + ".json?access_token=" + mapboxgl.accessToken, true);
        
        xhttp.send();
    }
    
    function readLocation(arr){
         var lat = arr[0].lat;
         var lon = arr[0].lon;
         console.log("data - lat: " + lat + ", lon: " + lon);
        
        dropMarker(arr[0]);

        map.flyTo({
            center: [lon, lat],
            zoom: 17,
            speed: 1.5
        });
        
        currentAddress = {"lat": lat, "lon": lon};
     }
    
    //drop marker
    function dropMarker(data){
        var thisAddJsonArray = new Array;
        
        var thisJSON = {"type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    data.lon,
                    data.lat
                  ]
                },
                "properties": {
                  "description": data.address,
                  "address" : data.address,
                  "city" : data.city,
                  "state" : data.state,
                  "zip" : data.zip,
                  "placeType" : data["place-type"],
                  "icon" : "circle",
                  "color" : '#4DD10F'
                }};

            thisAddJsonArray.push(thisJSON);
    
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }

        var addresses = map.getSource('addresses')

        if(addresses){
            map.getSource('addresses').setData(geoJson);
            map.setLayoutProperty("addresses", 'visibility', 'visible');
        }else{
            map.addSource('addresses',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'addresses',
                source: 'addresses',
                type: 'circle',
                paint: {
                  'circle-color': '#4DD10F',
                  'circle-radius': 7
                },
            });
        }
        
        //show popup
        var popup = new mapboxgl.Popup()
            .setLngLat([data.lon,data.lat])
            .setHTML("<center><b><p style=\"font-size:12px\">" + data.address + "</p></b>\n" + data.city + ", " + data.state + " " + data.zip + "<center>")
            .addTo(map);
    }
    
    //drop google point
    function dropGoogle(location){
        var thisAddJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                location.lng,
                location.lat
              ]
            }
        }
        
        thisAddJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }
        
        var gAdd = map.getSource('gAddress')

        if(gAdd){
            map.getSource('gAddress').setData(geoJson);
            map.setLayoutProperty("gAddress", 'visibility', 'visible');
        }else{
            map.addSource('gAddress',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'gAddress',
                source: 'gAddress',
                type: 'circle',
                paint: {
                  'circle-color': '#D10F0F',
                  'circle-radius': 6
                }
            });
        }
        
        drawGLine(location);
    }
    
    function drawGLine(location){
        
        var locationArray = [[location.lng, location.lat], [currentAddress.lon, currentAddress.lat]];
        
        var gDist = map.getSource('gDist');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(gDist){
            map.getSource('gDist').setData(locData);
            map.setLayoutProperty("gDist", 'visibility', 'visible');
        }else{
            map.addSource('gDist',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "gDist",
                "type": "line",
                "source": "gDist",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 5,
                    "line-dasharray": [.5, 1.5]
                }
            }, 'addresses');
        }
    }
    
    //drop OPEN point
    function dropOpen(location){
        var thisAddJsonArray = new Array;

        var thisJSON = {"type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                location[0],
                location[1]
              ]
            }
        }
        
        thisAddJsonArray.push(thisJSON);
        
        var geoJson = {
            "type": "FeatureCollection",       
            "features": thisAddJsonArray
        }
        
        var openAdd = map.getSource('openAddress')

        if(openAdd){
            map.getSource('openAddress').setData(geoJson);
            map.setLayoutProperty("openAddress", 'visibility', 'visible');
        }else{
            map.addSource('openAddress',{
                type: 'geojson',
                data: geoJson
            });

            map.addLayer({
                id: 'openAddress',
                source: 'openAddress',
                type: 'circle',
                paint: {
                  'circle-color': '#F4F41C',
                  'circle-radius': 6
                },
            });
        }
        
        drawOPENLine(location);
    }
    
    function drawOPENLine(location){
        
        var locationArray = [[location[0], location[1]], [currentAddress.lon, currentAddress.lat]];
        
        var openDist = map.getSource('openDist');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(openDist){
            map.getSource('openDist').setData(locData);
            map.setLayoutProperty("openDist", 'visibility', 'visible');
        }else{
            map.addSource('openDist',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "openDist",
                "type": "line",
                "source": "openDist",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#F4F41C",
                    "line-width": 5,
                    "line-dasharray": [.5, 1.5]
                }
            }, 'addresses');
        }
    }
    
    //marker click detection
    map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['addresses'] });
    
        if (!features.length) {
            return;
        }

        var feature = features[0];
        latestSearchArray = features;

        // Populate the popup and set its coordinates
        var popup = new mapboxgl.Popup()
            .setLngLat([data.lon,data.lat])
            .setHTML("<center><b><p style=\"font-size:12px\">" + data.address + "</p></b>\n" + data.city + ", " + data.state + " " + data.zip + "<center>")
            .addTo(map);            
    });
        
    //***********************DIRECTIONS*********************************************
    
    //directions button
    $('.open-Directions').on('click', function(e) {
        var addresses = map.getSource('addresses')

        if(addresses){
            map.setLayoutProperty("addresses", 'visibility', 'none');
        }
        document.getElementById("menu").style.marginLeft = "0px";
    });
    
    $('.close').on('click', function(e) {
        document.getElementById("menu").style.marginLeft = "-387px";
        
        map.setLayoutProperty("route", 'visibility', 'none');
        map.setLayoutProperty("gRoute", 'visibility', 'none');
        map.setLayoutProperty("gStart", 'visibility', 'none');
        map.setLayoutProperty("gEnd", 'visibility', 'none');
    });
    
    $('.swap').on('click', function(e) {        
        var startAddress = $('#start-address').val();
        var startCityState = $('#start-city-state').val();
        var endAddress = $('#end-address').val();
        var endCityState = $('#end-city-state').val();
                
        $('#end-address').val(startAddress);
        $('#start-address').val(endAddress);
        $('#start-city-state').val(endCityState);
        $('#end-city-state').val(startCityState);
    });
    
    $('#car').on('click', function(e){
        transitType = "driving";
        document.getElementById("car").style.backgroundColor = "#3A5391";
        document.getElementById("walk").style.backgroundColor = "#FFFFFF";
        document.getElementById("bike").style.backgroundColor = "#FFFFFF";
    });
    
    $('#walk').on('click', function(e){
        transitType = "walking";
        document.getElementById("walk").style.backgroundColor = "#3A5391";
        document.getElementById("car").style.backgroundColor = "#FFFFFF";
        document.getElementById("bike").style.backgroundColor = "#FFFFFF";
    });
    
    $('#bike').on('click', function(e){
        transitType = "cycling";
        document.getElementById("bike").style.backgroundColor = "#3A5391";
        document.getElementById("walk").style.backgroundColor = "#FFFFFF";
        document.getElementById("car").style.backgroundColor = "#FFFFFF";
    });
        
    $('.get-directions').on('click', function(e) {        
        console.log("get " + transitType + " directions");
        
        //get query parts
        var startAddress = document.getElementById('start-address').value;
        var startCityState = document.getElementById('start-city-state').value;
        var endAddress = document.getElementById('end-address').value;
        var endCityState = document.getElementById('end-city-state').value;
        
        if(startCityState.indexOf(",") == -1){
            alert("Your start address is missing a comma between city and state");
            return;
        }
        
        if(endCityState.indexOf(",") == -1){
            alert("Your destination is missing a comma between city and state");
            return;
        }
        
        startSearch(startAddress, startCityState, endAddress, endCityState);
    });
    
    function startSearch(startAddress, startCityState, endAddress, endCityState){
        var xhttp = new XMLHttpRequest();
        
        //split address
        var splitQuery = startCityState.split(",");
        
        var state = splitQuery[1].replace(/\s/g, '');
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);

               if(myArr[0]){
                   endSearch(myArr[0], endAddress, endCityState);
               }else{
                   console.log("no data found");
                   alert("No Matching Address found for your start location. Please try another address.");
               }
           }else if(xhttp.status == 500){
               alert("There was an error. Please try your request again");
           }
         };
        
        xhttp.open('GET', "https://api.parkourmethod.com/address?address=" + startAddress + "\&city="+ splitQuery[0] +"\&state=" + state + "\&api_key=c628cf2156354f53b704bd7f491607a7", true);
        
         xhttp.send();
    }
    
    function endSearch(startResult, endAddress, endCityState){
        var xhttp = new XMLHttpRequest();
        
        //split address
        var splitQuery = endCityState.split(",");
        
        var state = splitQuery[1].replace(/\s/g, '');
        
        var center = map.getCenter();
         xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var myArr = JSON.parse(xhttp.responseText);

               if(myArr[0]){
                    console.log("start: " + startResult.lat + ", " + startResult.lon + "\n end: " + myArr[0].lat + ", " + myArr[0].lon);

                   callMapboxDirections(startResult, myArr[0]);
                   googleDirections(startResult, myArr[0]);
               }else{
                   console.log("no data found");
                   alert("No Matching Address found for your destination. Please try another address.");
               }
           }else if(xhttp.status == 500){
               alert("There was an error. Please try your request again");
           }
         };
        
        xhttp.open('GET', "https://api.parkourmethod.com/address?address=" + endAddress + "\&city="+ splitQuery[0] +"\&state=" + state + "\&api_key=c628cf2156354f53b704bd7f491607a7", true);
        
         xhttp.send();
    }
    
    function callMapboxDirections(startResult, endResult){
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
               
               reverseMapboxDirections(startResult, endResult, response);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/directions/v5/mapbox/" + transitType + "/" + startResult.lon + "," + startResult.lat + ";" + endResult.lon + "," + endResult.lat + "?steps=true&access_token=" + mapboxgl.accessToken, true);
        
         xhttp.send();
    }
    
    function reverseMapboxDirections(startResult, endResult, correctResponse){
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
               
               readDirections(correctResponse, response, startResult, endResult);
           }  
         };
        
        xhttp.open('GET', "https://api.mapbox.com/directions/v5/mapbox/" + transitType + "/" + endResult.lon + "," + endResult.lat + ";" + startResult.lon + "," + startResult.lat + "?steps=true&access_token=" + mapboxgl.accessToken, true);
        
         xhttp.send();
    }
    
    function googleDirections(startResult, endResult){
        
        var start = startResult.address + " " + startResult.city + " " + startResult.state;
        var end = endResult.address + " " + endResult.city + " " + endResult.state;
        
        //convert addresses
        for(var i = 0; i < start.length; i++) {
         start = start.replace(" ", "+");
        }
        
        for(var e = 0; e < end.length; e++) {
         end = end.replace(" ", "+");
        }
        
        var gTransit = "DRIVING";
        
        if(transitType.valueOf() == "cycling"){
            gTransit = "BICYCLING";
        }else if(transitType.valueOf() == "walking"){
            gTransit = "WALKING";
        }
        
        //google js api
        var directionsService = new google.maps.DirectionsService;
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: gTransit
        }, function(response, status) {
          if (status === 'OK') {
            googleGeocode(start, end, response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }
    
    //google geocode
    function googleGeocode(start, end, directions){
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);

               googleGeocode2(response, end, directions);
           }  
         };
        
        xhttp.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + start + "&key=" + googleAPI, true);
        
        xhttp.send();
    }
    
    function googleGeocode2(startResponse, end, directions){
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function(){
           if(xhttp.readyState == 4 && xhttp.status == 200){
               var response = JSON.parse(xhttp.responseText);
            
               readGoogleDirections(directions, startResponse, response);
           }  
         };
        
        xhttp.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + end + "&key=" + googleAPI, true);
        
        xhttp.send();
    }
    
    function readDirections(correctResponse, reverseResponse, startResult, endResult){
        
        var routes = correctResponse.routes;
        var revRoutes = reverseResponse.routes;
        var duration = routes[0].duration;
        var distance = routes[0].distance;
        var polyline = routes[0].geometry;
        
        //format start and stop coordinates
        var startLoc = [startResult.lon, startResult.lat];
        var endLoc = [endResult.lon, endResult.lat];

        //get location points for route
        var locationArray = [];
        var geometryArray = [];
        var steps = routes[0].legs[0].steps;
        var revSteps = revRoutes[0].legs[0].steps;
        
        //add first location
        locationArray.push(startLoc);
        
        //test
        var polylineArray = decode(polyline, 5);
        
        //add first and last points
        polylineArray.unshift(startLoc);
        polylineArray.push(endLoc);
                
        drawRoute(polylineArray);
        
        fillInDetails(distance, duration);
        
        map.flyTo({
            center: endLoc,
            zoom: 14,
            speed: 1.5
        });
    }
    
    function readGoogleDirections(directions, startResponse, endResponse){
        
        var routes = directions.routes;
        var bounds = routes[0].bounds;
        var polyline = routes[0]["overview_polyline"];
        
        //get start point
        var startResult = startResponse.results;
        var startLoc = startResult[0].geometry.location;
        var startPoint = [];
        startPoint.push(startLoc.lng);
        startPoint.push(startLoc.lat);
        
        //get start point
        var endResult = endResponse.results;
        var endLoc = endResult[0].geometry.location;
        var endPoint = [];
        endPoint.push(endLoc.lng);
        endPoint.push(endLoc.lat);
        
        console.log(JSON.stringify(polyline));
        
        var googleArray = decode(polyline, 5);
        
        drawGoogle(googleArray);
        drawGoogleEnds(googleArray, startPoint, endPoint);
    }
    
    function drawRoute(locationArray){
        
        var route = map.getSource('route');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(route){
            map.getSource('route').setData(locData);
            map.setLayoutProperty("route", 'visibility', 'visible');
        }else{
            map.addSource('route',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "route",
                "type": "line",
                "source": "route",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#4DD10F",
                    "line-width": 8
                }
            });
        }
    }
    
    function drawGoogle(locationArray){
        
        var gRoute = map.getSource('gRoute');
        var locData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": locationArray
                }
        }

        if(gRoute){
            map.getSource('gRoute').setData(locData);
            map.setLayoutProperty("gRoute", 'visibility', 'visible');
        }else{
            map.addSource('gRoute',{
                type: 'geojson',
                data: locData
            });
            
            map.addLayer({
                "id": "gRoute",
                "type": "line",
                "source": "gRoute",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 14,
                }
            }, 'route');
        }
    }
    
    function drawGoogleEnds(locationArray, start, end){
        //start line
        var gStart = map.getSource('gStart');
        var startLocData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [start, locationArray[0]]
                }
        }

        if(gStart){
            map.getSource('gStart').setData(startLocData);
            map.setLayoutProperty("gStart", 'visibility', 'visible');
        }else{
            map.addSource('gStart',{
                type: 'geojson',
                data: startLocData
            });
            
            map.addLayer({
                "id": "gStart",
                "type": "line",
                "source": "gStart",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 6,
                    "line-dasharray": [.5, 1.5]
                }
            });
        }
        
        //end line
        var gEnd = map.getSource('gEnd');
        var endLocData = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [locationArray[locationArray.length -1 ], end]
                }
        }

        if(gEnd){
            map.getSource('gEnd').setData(endLocData);
            map.setLayoutProperty("gEnd", 'visibility', 'visible');
        }else{
            map.addSource('gEnd',{
                type: 'geojson',
                data: endLocData
            });
            
            map.addLayer({
                "id": "gEnd",
                "type": "line",
                "source": "gEnd",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#D10F0F",
                    "line-width": 6,
                    "line-dasharray": [.5, 1.5]
                }
            });
        }
    }
    
    function fillInDetails(meters, seconds){
        var miles = meters*0.000621371192;
        var time = secondsToHms(seconds);
                
        $('#distance').text("Distance:  " + miles.toFixed(1) + " miles");
        $('#duration').text("Duration:  " + time);
    }
    
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + " h " + (m < 10 ? "0" : "") : "") + m + " min"); 
    }
    
    //decode polyline
    function decode(str, precision) {        
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;
                        
            var theseCoords = [];
            theseCoords.push(lng / factor);
            theseCoords.push(lat/factor);

            coordinates.push(theseCoords);
        }

        return coordinates;
    };
});

