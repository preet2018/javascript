(function() {
    var app = angular.module('app.directives');
    // Mapbox start
    // app.directive('grid', ['$rootScope', '$http', '$compile', '$location', 'QueryService', function($rootScope, $http, $compile, $location, Query) {

    app.directive('mapboxgl', ['$rootScope', '$http', '$compile', '$location', 'QueryService', function($rootScope, $http, $compile,$location, Query) {
        var directiveDefinitionObject = {
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                var icons = [];
                var popup;
                this.map = null;
                var _this = this;
                $('#' + $attrs.id).height('99.1%');
                $('#' + $attrs.id).width('99.7%');
                var mapPlace = $attrs.id;
                mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94LXJpIiwiYSI6IjAwbE9iblkifQ.BCxGtN4YUR4U4ivMIe05cQ';
                var tileset = 'mapbox.streets';
                //added code for satelite map
                var stateliteData = [];
                $('#satellite').click(function() {
                    if ($(this).prop("checked") == true) {
                      NormalMapviewEnable();
                    } else {
                      NormalMapviewDisable();
                    }
                });
                var checkMapData = 0;
                var popup_markerOri;
                var popup_markerDes;
                var checkStore;
                function NormalMapviewEnable()
                {
                    map.setStyle('mapbox://sprites/mapbox/streets-v8');
                    checkMapData++;
                    delete Query.get()['EQUIPMENT_ID'];
                    delete Query.get()['precision'];
                    delete Query.get()['bounds'];
                    Query.updateUrl();
                    $scope.$apply();
                    if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                    {
                      popup_markerOri.remove();
                      popup_markerDes.remove();
                    }
                    document.getElementById('currentlocationbox').style.display = "none";
                    map.setZoom(1.6);
                    // console.log("Inside Normal view");
                    // console.log(stateliteData[0]);
                    // console.log(window.location);
                    var contents = document.getElementById('currentlocation-area');
                    contents.innerHTML = "";


                    //Remove Layer red and green line after user click on radio
                    // var removeEquip;
                    // if(checkStore!=null) {
                    //     removeEquip = checkStore;
                    //     console.log("StreetView:"+removeEquip);
                    // }
                    // // console.log(JSON.parse(JSON.stringify(removeEquip)));
                    // var previousTrnID = localStorage.getItem("trainIdCheck");
                    // if (map.getLayer("route_satelite_" + previousTrnID) == undefined) {
                    //     // do nothing  origincity_  source_circle_500  circle500
                    //     console.log("GOESSSatelite!!!"+previousTrnID);
                    //    
                    //     // map.removeLayer("route_satelite_" + previousTrnID);
                    //     // map.removeSource("route_satelite_" + previousTrnID);
                    //     // map.removeLayer("route_current_dest_satelite_"+ previousTrnID);
                    //     // map.removeSource("route_current_dest_satelite_" + previousTrnID);
                    //     // map.removeLayer("origincity_satelite_"+ previousTrnID);
                    //     // map.removeSource("origincity_satelite_"+ previousTrnID);
                    //     // map.removeLayer("destinationcity_satelite_"+previousTrnID);
                    //     // map.removeSource("destinationcity_satelite_"+previousTrnID);

                    // } else {
                    //     console.log("Change satelite");
                    //     map.removeLayer("route_satelite_" + previousTrnID);
                    //     map.removeSource("route_satelite_" + previousTrnID);
                    //     map.removeLayer("route_current_dest_satelite_"+ previousTrnID);
                    //     map.removeSource("route_current_dest_satelite_" + previousTrnID);
                    //     map.removeLayer("origincity_satelite_"+ previousTrnID);
                    //     map.removeSource("origincity_satelite_"+ previousTrnID);
                    //     map.removeLayer("destinationcity_satelite_"+previousTrnID);
                    //     map.removeSource("destinationcity_satelite_"+previousTrnID);

                    //     if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                    //     {
                    //         popup_markerOri.remove();
                    //         popup_markerDes.remove();
                    //     }
                    //     document.getElementById('currentlocationbox').style.display = "none";
                    //     // popup.remove();
                    // }
                    // localStorage.setItem("trainIdCheck", checkStore);
                    //Remove Layer red and green line after user click on radio

                    map.on('style.load', function() {
                        // console.log("Inside MapNormalMode!!!");
                        map.addSource("sateliteMap", {
                            type: "geojson",
                            data: {
                                "type": "FeatureCollection",
                                "features":stateliteData[0]
                            },
                            cluster: true,
                            clusterMaxZoom: 3, // Max zoom to cluster points on
                            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                        });
                        //Added state layers
                        var layers = map.getStyle().layers;
                        var firstSymbolId;
                        for (var i = 0; i < layers.length; i++) {
                            if (layers[i].type === 'symbol') {
                                firstSymbolId = layers[i].id;
                                break;
                            }
                        }
                        map.addLayer({
                            'id': 'USStates',
                            'type': 'line',
                            'source': {
                                'type': 'geojson',
                                'data': 'js/geojson/USA_AdminGeojson/US-State-borders.geojson'
                            },
                            'layout': {
                                "line-join": "round",
                                "line-cap": "round"
                            },
                            'paint': {
                                'line-color': 'black',
                                'line-width': 2

                            }
                        }, firstSymbolId);
                        //added state layers
                        map.addLayer({
                            id: "clustersatelite",
                            type: "circle",
                            source: "sateliteMap",
                            filter: ["has", "point_count"],
                            paint: {
                                "circle-color": [
                                    "step", ["get", "point_count"],
                                    "#1adb44",
                                    100,
                                    "#f1f075",
                                    700,
                                    "#f28cb1"
                                ],
                                "circle-radius": [
                                    "step", ["get", "point_count"],
                                    20,
                                    100,
                                    30,
                                    750,
                                    40
                                ]
                            }
                        });

                        //circle inside text
                        map.addLayer({
                            id: "cluster-countsatelite",
                            type: "symbol",
                            source: "sateliteMap",
                            filter: ["has", "point_count"],
                            layout: {
                                "text-field": "{point_count_abbreviated}",
                                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                                "text-size": 12
                            }
                        });

                        //this is small green simbol
                        map.addLayer({
                            id: "unclustered-pointsatelite",
                            // type: "circle",
                            type: 'symbol',
                            source: "sateliteMap",
                            filter: ["!has", "point_count"],
                            layout: {
                                'visibility': 'visible',
                                'icon-image': 'bus-15',
                                'icon-allow-overlap': true
                            }
                        });
                        map.on('mouseenter', 'clustersatelite', function() {
                            map.getCanvas().style.cursor = 'pointer';
                        });

                        // Change it back to a pointer when it leaves.
                        map.on('mouseleave', 'clustersatelite', function() {
                            map.getCanvas().style.cursor = '';
                        }); //Show case GEO JSON Data on map end

                        //Show the cursor on map for perticular well
                        map.on('mouseenter', 'unclustered-pointsatelite', function() {
                            map.getCanvas().style.cursor = 'pointer';
                        });

                        // Change it back to a pointer when it leaves.
                        map.on('mouseleave', 'unclustered-pointsatelite', function() {
                            map.getCanvas().style.cursor = '';
                        });
                        // map.on('click', 'unclustered-point', function(e) {
                        //     // addLine(e.features[0].properties);
                        // });
                        map.flyTo({
                            center: startLocation,
                            zoom: 3.6,
                            bearing: 0,
                            speed: 0.2, // make the flying slow
                            curve: 1, // change the speed at which it zooms out
                        });

                        map.on('click', 'unclustered-pointsatelite', function(e) {
                            var proppant_type = e.features[0].properties.proppant_type;
                            var event_location_city = e.features[0].properties.current_event_city;
                            var event_location_state = e.features[0].properties.current_event_state;
                            var current_city = e.features[0].properties.current_location_city;
                            var current_state = e.features[0].properties.current_location_state;
                            
                            var po_number = e.features[0].properties.po_number;
                            var Endate = e.features[0].properties.estimated_notify_date;
                            var counter_checking=0;
                            if(proppant_type==undefined)
                            {
                                proppant_type = "";
                            }
                            if(event_location_city==undefined)
                            {
                                event_location_city = "";
                                counter_checking++;
                            }
                            if(event_location_state==undefined)
                            {
                                event_location_state="";
                                counter_checking++;
                            }
                            if(po_number==undefined)
                            {
                                po_number="";
                            }
                            if(Endate==undefined)
                            {
                                Endate="";
                            }
                            console.log("counter chk"+counter_checking);
                            var popup_data;
                            if(counter_checking==2) {
                                popup_data = '<table border="1" style="border-collapse: collapse;"><tr><td style = "font-weight: bold;font-size:10px;">EQP ID:</td><td style="font-size:10px;">' + e.features[0].properties.equipment_id + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Propnt type:</td><td style="font-size:10px;">' + proppant_type + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current city:</td><td style="font-size:10px;">' + current_city + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current state:</td><td style="font-size:10px;">' + current_state + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">PO no:</td><td style="font-size:10px;">' + po_number + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">ETA/ETI date:</td><td style="font-size:10px;">' + Endate + '</td></tr></table>';
                            } else {
                                popup_data = '<table border="1" style="border-collapse: collapse;"><tr><td style = "font-weight: bold;font-size:10px;">EQP ID:</td><td style="font-size:10px;">' + e.features[0].properties.equipment_id + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Propnt type:</td><td style="font-size:10px;">' + proppant_type + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current event city:</td><td style="font-size:10px;">' + event_location_city + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current event state:</td><td style="font-size:10px;">' + event_location_state + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">PO no:</td><td style="font-size:10px;">' + po_number + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">ETA/ETI date:</td><td style="font-size:10px;">' + Endate + '</td></tr></table>';
                            }
                            
                            // var contents = $('#currentlocation-area').val();
                            var contents_className = document.getElementById('currentlocationbox');
                            var contents = document.getElementById('currentlocation-area');
                            contents.innerHTML = popup_data;
                            // $(".currentlocation-area").show();
                            var store_displayResult = contents_className.style.display;
                            // console.log(contents_className.style.display);
                            if (store_displayResult == "none") {
                                // console.log("Under None");
                                document.getElementById('currentlocationbox').style.display = "block";
                            } else {
                                // console.log("NotUnder None");
                                // contents_className.style.display = "none";
                                document.getElementById('currentlocationbox').style.display = "block";
                            }                            //commentted popup code

                            addLineSatelite(e.features[0].properties);
                            //startLocation
                            map.flyTo({
                                center: startLocation,
                                zoom: 3.6,
                                bearing: 0,
                                speed: 0.2, // make the flying slow
                                curve: 1, // change the speed at which it zooms out
                            });
                            // popup.remove();  //Error coming for remove
                        });
                  });
                }
                function addLineSatelite(properties) {
                    //Origin Location
                    var origin_location = JSON.parse(properties.origin_location);
                    var origin_location_lon = origin_location.lon;
                    var origin_location_lat = origin_location.lat;

                    //Current Location
                    var current_location = JSON.parse(properties.current_location);
                    var current_location_lon = current_location.lon;
                    var current_location_lat = current_location.lat;
                    console.log(properties); 
                    //Destination Location
                    var destination_location = JSON.parse(properties.destination_location);
                    var destination_location_lon = destination_location.lon;
                    var destination_location_lat = destination_location.lat;


                    var equipment_id = properties.equipment_id;
                    const previousTrainID = localStorage.getItem("trainId");



                    // console.log("Equipment ID:"+equipment_id);
                    // console.log("Origin Location:"+origin_location_lon+' '+origin_location_lat);
                    // console.log("Current Location:"+current_location_lon+' '+current_location_lat);
                    // console.log("Destination Location:"+destination_location_lon+' '+destination_location_lat);

                    if (map.getLayer("route_satelite_" + previousTrainID) == undefined) {
                        // do nothing  origincity_  source_circle_500  circle500
                        // console.log("GOESSSatelite!!!");
                    } else {
                        // console.log("Change satelite");
                        map.removeLayer("route_satelite_" + previousTrainID);
                        map.removeSource("route_satelite_" + previousTrainID);
                        map.removeLayer("route_current_dest_satelite_"+ previousTrainID);
                        map.removeSource("route_current_dest_satelite_" + previousTrainID);
                        map.removeLayer("origincity_satelite_"+ previousTrainID);
                        map.removeSource("origincity_satelite_"+ previousTrainID);
                        map.removeLayer("destinationcity_satelite_"+previousTrainID);
                        map.removeSource("destinationcity_satelite_"+previousTrainID);
                        // popup.remove();
                    }

                    localStorage.setItem("trainId", equipment_id);

                    map.addLayer({
                        "id": "route_satelite_" + equipment_id,
                        "type": "line",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [
                                        [origin_location_lon, origin_location_lat],
                                        [current_location_lon, current_location_lat]
                                        // [destination_location_lon, destination_location_lat]
                                    ]
                                }
                            }
                        },
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "green",
                            "line-width": 4,
                            // "line-dasharray": [2, 6],
                        }
                    });

                    //Add Current Location to Destination
                    map.addLayer({
                        "id": "route_current_dest_satelite_"+equipment_id,
                        "type": "line",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [
                                        // [origin_location_lon, origin_location_lat],
                                        [current_location_lon, current_location_lat],
                                        [destination_location_lon, destination_location_lat]
                                    ]
                                }
                            }
                        },
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "red",
                            "line-width": 4,
                            "line-dasharray": [2, 4],
                        }
                    });


                    //Add Origin Location
                    map.addLayer({
                        "id": "origincity_satelite_"+equipment_id,
                        "type": "symbol",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "FeatureCollection",
                                "features": [{
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [origin_location_lon, origin_location_lat]
                                    }
                                }]
                            }
                        },
                        "layout": {
                            'visibility': 'visible',
                            "icon-image": "picnic-site-15", // beer-11
                            "icon-allow-overlap": true
                        }
                    });

                    //Add Destination Location
                    map.addLayer({
                        "id": "destinationcity_satelite_"+equipment_id,
                        "type": "symbol",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "FeatureCollection",
                                "features": [{
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [destination_location_lon, destination_location_lat]
                                    }
                                }]
                            }
                        },
                        "layout": {
                            'visibility': 'visible',
                            "icon-image": "stadium-15", //circle-stroked-11
                            "icon-allow-overlap": true
                        }
                    });

                    if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                    {
                      popup_markerOri.remove();
                      popup_markerDes.remove();
                    }
                    //Origin Popup
                    var popup_data_origin = '<table><tr><td style = "font-weight: bold;font-size: 12px;">Origin city:</td><td style="font-size: 12px;">' + properties.origin_city + '</td></tr></table>';
                    var origin_arr = [];
                    origin_arr.push(origin_location_lon);
                    origin_arr.push(origin_location_lat);
                    var popup_orign = new mapboxgl.Popup()
                        .setHTML(popup_data_origin);
                    popup_markerOri = new mapboxgl.Marker()
                        .setLngLat(origin_arr)
                        .setPopup(popup_orign)
                        .addTo(map);

                    //Destination Popup
                    var popup_data_destination = '<table><tr><td style = "font-weight: bold;font-size: 12px;">Dest city:</td><td style="font-size: 12px;">' + properties.destination_city + '</td></tr></table>';
                    var destination_arr = [];
                    destination_arr.push(destination_location_lon);
                    destination_arr.push(destination_location_lat);
                    var popup_desc = new mapboxgl.Popup({offset:[0, -30]})
                        .setHTML(popup_data_destination);
                    popup_markerDes = new mapboxgl.Marker()
                        .setLngLat(destination_arr)
                        .setPopup(popup_desc)
                        .addTo(map);

                    //Destination Popup
                    
                    var equipment_id = properties.equipment_id;
                    const previousTTID = localStorage.getItem("trainId");
                    $('#fclear').on('click', function(e) {
                        // hasBeenClicked = true;

                        map.flyTo({
                            zoom: 3.8,
                            center: [-94.29179687498357, 42.40000000000000],
                            bearing: 0,
                            speed: 0.2, // make the flying slow
                            curve: 1 // change the speed at which it zooms out
                        });
                        
                        if (map.getLayer("route_satelite_" + previousTTID) == undefined) {
                            // do nothing  origincity_  source_circle_500  circle500
                            // console.log("GOESSSatelite!!!");
                        } else {
                            // console.log("Change satelite");
                            map.removeLayer("route_satelite_" + previousTTID);
                            map.removeSource("route_satelite_" + previousTTID);
                            map.removeLayer("route_current_dest_satelite_"+ previousTTID);
                            map.removeSource("route_current_dest_satelite_" + previousTTID);
                            map.removeLayer("origincity_satelite_"+ previousTTID);
                            map.removeSource("origincity_satelite_"+ previousTTID);
                            map.removeLayer("destinationcity_satelite_"+previousTTID);
                            map.removeSource("destinationcity_satelite_"+previousTTID);
                            if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                            {
                              popup_markerOri.remove();
                              popup_markerDes.remove();
                            }
                            document.getElementById('currentlocationbox').style.display = "none";
                        }
                        
                    
                    });
                    localStorage.setItem("trainId", equipment_id);

                }
                function NormalMapviewDisable()
                
                {

                    map.setStyle('mapbox://styles/mapbox-ri/cjhfvpn050hkf2spbb1jxt9d9');
                    delete Query.get()['EQUIPMENT_ID'];
                    delete Query.get()['precision'];
                    delete Query.get()['bounds'];
                    Query.updateUrl();
                    $scope.$apply();
                    console.log('--------------------------welcome')
                    document.getElementById('currentlocationbox').style.display = "none";
                    if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                    {
                      popup_markerOri.remove();
                      popup_markerDes.remove();
                    }
                    var contents = document.getElementById('currentlocation-area');
                    contents.innerHTML = "";
                    map.setZoom(1.6);
                    map.flyTo({
                        center: startLocation,
                        zoom: 3.6,
                        bearing: 0,
                        speed: 0.2, // make the flying slow
                        curve: 1, // change the speed at which it zooms out
                    });
                }
                //added code for satelite map if user want to have default and satelite map
                var startLocation = [-94.29179687498357, 41.40000000000000];
                var map = new mapboxgl.Map({
                    container: 'map', // container id
                    center: [-98.29179687498357, 41.10000000000000],
                    zoomControl: false,
                    style: 'mapbox://styles/mapbox-ri/cjhfvpn050hkf2spbb1jxt9d9',
                    attributionControl: false, //Remove mapboxGLAdd
                    zoom:  2.8// starting zoom 3.8
                });
                map.setCenter(map.getCenter().wrap());
                var hasBeenClicked = false;
                var nav = new mapboxgl.NavigationControl();
                map.addControl(nav, 'bottom-right');
                var Fullscreen = new mapboxgl.FullscreenControl();
                map.addControl(Fullscreen, 'bottom-right');
                $(document).ready(function() {
                    $(".mapboxgl-ctrl-fullscreen").click(function() {
                        if (Fullscreen._fullscreen == false) {
                            // console.log("Fullscreen false");
                            // console.log(Fullscreen._fullscreen);
                            $(".Layercontrol").css("right", "1%");
                            $(".Layercontrol").css("bottom", "30%"); // change
                            $("#check").css("border", "1px solid");
                            $("#check").css("right", "1%");
                            $("#check").css("bottom", "20%"); // change
                            $("#check").css("position", "absolute");
                            $("#currentlocationbox").css("bottom","32%");
                            $("#currentlocationbox").css("right","1%");
                            $("#currentlocationbox").css("position", "absolute");
                            // $("#currentlocationbox").css("z-index", "3172343433");
                        } else {
                            // console.log("Fullscreen true");
                            // console.log(Fullscreen._fullscreen);
                            $(".Layercontrol").css("right", "1%");
                            $(".Layercontrol").css("bottom", "30%");
                            $("#check").css("bottom", "15%");
                            $("#check").css("margin-right", "1%");
                            $("#currentlocationbox").css("bottom","32%");
                            $("#currentlocationbox").css("right","1%");
                        }
                    });
                    $('#fclear').on('click', function(e) {
                        hasBeenClicked = true;
                        map.flyTo({
                            zoom: 3.8,
                            center: [-94.29179687498357, 42.40000000000000],
                            bearing: 0,
                            speed: 0.2, // make the flying slow
                            curve: 1 // change the speed at which it zooms out
                        });
                        $('#keywordbox').val(''); 
                    });

                    $("#map").click(function() {
                        // alert($(this).attr('class'));
                        map.resize();
                    });
                    $('#USStates').click(function() {
                        if ($(this).prop("checked") == true) {
                            var layers = map.getStyle().layers;
                            var firstSymbolId;
                            for (var i = 0; i < layers.length; i++) {
                                if (layers[i].type === 'symbol') {
                                    firstSymbolId = layers[i].id;
                                    break;
                                }
                            }
                            map.addLayer({
                                'id': 'UScity',
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/StateName/state_city_name.geojson'
                                }

                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("UScity")) {
                                map.removeLayer("UScity");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("UScity")) {
                                map.removeSource("UScity");
                            }
                        }
                    });
                    $('#USCounties').click(function() {
                        if ($(this).prop("checked") == true) {
                            var layers = map.getStyle().layers;
                            // Find the index of the first symbol layer in the map style
                            var firstSymbolId;
                            for (var i = 0; i < layers.length; i++) {
                                if (layers[i].type === 'symbol') {
                                    firstSymbolId = layers[i].id;
                                    break;
                                }
                            }
                            map.addLayer({
                                'id': 'USCounties',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/USA_AdminGeojson/USCounties.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': 'blue',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("USCounties")) {
                                map.removeLayer("USCounties");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("USCounties")) {
                                map.removeSource("USCounties");
                            }
                        }
                    });
                });
                /* var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
                var mapBox_height_width = document.getElementById("map").style;
                mapCanvas.style.height = mapBox_height_width.height;
                mapCanvas.style.width = mapBox_height_width.width; */

                map.on('load', function() {
                    map.resize();
                    //For Getting StateLayers
                    var layers = map.getStyle().layers;
                    var firstSymbolId;
                    for (var i = 0; i < layers.length; i++) {
                        if (layers[i].type === 'symbol') {
                            firstSymbolId = layers[i].id;
                            break;
                        }
                    }
                    map.addLayer({
                        'id': 'USStates',
                        'type': 'line',
                        'source': {
                            'type': 'geojson',
                            'data': 'js/geojson/USA_AdminGeojson/US-State-borders.geojson'
                        },
                        'layout': {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        'paint': {
                            'line-color': 'black',
                            'line-width': 2

                        }
                    }, firstSymbolId);
                    //MapFlyCode
                    map.flyTo({
                        center: startLocation,
                        zoom: 3.6,
                        bearing: 0,
                        speed: 0.2, // make the flying slow
                        curve: 1 // change the speed at which it zooms out
                        // easing: function (t) {
                        //     return t;
                        // }
                    });
                });


                var draw = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {   
                        // point: true,
                        // line_string: true,
                        // combine_features: true,
                        // uncombine_features: true,
                        polygon: true,
                        trash: true
                    }
                });
                map.addControl(draw, 'bottom-right');
                map.on('draw.create', updateArea);
                map.on('draw.delete', updateArea);
                map.on('draw.update', updateArea);

                function updateArea(e) {
                    var data = draw.getAll();
                    // var answer = document.getElementById('calculated-area');
                    // console.log(e);
                    // console.log(e.features[0].geometry.type);
                    if (data.features.length > 0) {
                        var area = turf.area(data);
                        // restrict to area to 2 decimal points
                        // console.log("Polydata area:"+area);
                        // console.log("Polydata data:"+JSON.stringify(data));
                        // var rounded_area = Math.round(area*100)/100;
                        // answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
                        var coordinates;
                        if (e.features[0].geometry.type == "LineString") {
                            coordinates = data.features[0].geometry.coordinates;
                            // console.log(coordinates);
                            var vert = [];
                            for (var check = 0; check < coordinates.length; check++) {
                                //console.log(coordinates[check][0]);
                                vert.push({
                                    "lat": coordinates[check][0],
                                    "lon": coordinates[check][1]
                                })
                            }
                            // console.log(vert);
                            var coordinate_lineString = coordinates;
                            var bounds = coordinate_lineString.reduce(function(bounds, coord) {
                                return bounds.extend(coord);
                            }, new mapboxgl.LngLatBounds(coordinate_lineString[0], coordinate_lineString[0]));
                            map.fitBounds(bounds, {
                                padding: 20
                            });
                        } else if (e.features[0].geometry.type == "Polygon") {
                            coordinates = data.features[0].geometry.coordinates[0];
                            // console.log(coordinates);
                            var vert = [];
                            for (var check = 0; check < coordinates.length; check++) {
                                //console.log(coordinates[check][0]);
                                vert.push({
                                    "lat": coordinates[check][0],
                                    "lon": coordinates[check][1]
                                })
                            }
                            // console.log(vert);
                            coordinates = data.features[0].geometry.coordinates[0];
                            var bounds = coordinates.reduce(function(bounds, coord) {
                                console.log(bounds.extend(coord));
                                return bounds.extend(coord);
                            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
                            map.fitBounds(bounds, {
                                padding: 20
                            });
                            // Dance india dance
                            map.handlemove = true;
                            var b = map.getBounds();
                            //alert(_this.map.getZoom() +" - "+Query.get()['precision']);
                            if (map.handlemove && !e.hard) {
                                map.nofit = true;
                                var zoom = Math.ceil(map.getZoom() / 2);
                               if (zoom < 2) zoom = 2;
                                // console.log("Inside Facet clicked:" + hasBeenClicked);
                                if (hasBeenClicked == true) {
                                    Query.get()['precision'] = zoom;
                                    Query.get()['bounds'] = b.getNorthWest().lat + '|' + b.getNorthWest().lng + '|' + b.getSouthEast().lat + '|' + b.getSouthEast().lng;
                                    //Query.updateUrl();
                                    hasBeenClicked = false;
                                    $scope.$apply();
                                } else {
                                    // console.log("Zoom Hey:-"+zoom);
                                    Query.get()['precision'] = zoom;
                                     if (b.getNorthWest().lat > 40.00000000000000) {
                                    //     // console.log("Lat is gets bounced !!!!!!");
                                    } else {
                                        Query.get()['bounds'] = b.getNorthWest().lat + '|' + b.getNorthWest().lng + '|' + b.getSouthEast().lat + '|' + b.getSouthEast().lng;
                                        Query.updateUrl();
                                        $scope.$apply();
                                        console.log('hi preeti');
                                    }
                                  }
                            }
                            setTimeout(function() {
                                map.handlemove = true;
                            }, 3000);

                            //Dance India Dance
                            //Query.get()['Poly'] = JSON.stringify(vert);
                            //Query.updateUrl();
                            //$scope.$apply();
                        } else {
                            coordinates = data.features[0].geometry.coordinates;
                            // console.log(coordinates);
                            var vert = [];
                            // console.log(coordinates[0]);
                            // console.log(coordinates[1]);
                            vert.push({
                                "lat": coordinates[0],
                                "lon": coordinates[1]
                            })
                            // console.log(vert);
                            var coordinate_point = data.features[0].geometry.coordinates;
                            // console.log(coordinate_point);
                            var bounds = coordinate_point.reduce(function(bounds, coord) {
                                return bounds.extend(coord);
                            }, new mapboxgl.LngLatBounds(coordinate_point, coordinate_point));
                            map.fitBounds(bounds, {
                                padding: 20
                            });
                        }
                    } else {
                        // answer.innerHTML = '';
                        if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
                    }
                }


                var counter = 0;
                $scope.$watch(function(scope) {

                    if (typeof scope.geodata != 'undefined') {
                        counter++;
                        if (counter > 1) {
                            // console.log("Hey SateliteViewMap!!!!");
                            if (map.getLayer("clusters")) {
                                map.removeLayer("clusters");
                            }
                            if (map.getLayer("cluster-count")) {
                                map.removeLayer("cluster-count");
                            }
                            if (map.getLayer("unclustered-point")) {
                                map.removeLayer("unclustered-point");
                            }
                            if (map.getSource("MapgoeData")) {
                                map.removeSource("MapgoeData");
                            }
                        }
                        stateliteData.push(scope.geodata.geojson);
                        // console.log("Scope GEODATA")
                        // console.log(scope.geodata.geojson);
                        // console.log("Scope GEODATA");
                        $scope.addClusterlivedata(scope.geodata.geojson);
                        if(checkMapData>0)
                        {
                            stateliteData = [];
                            // console.log("Hey NormalViewMap!!!!");
                            if (map.getLayer("clustersatelite")) {
                                map.removeLayer("clustersatelite");
                            }
                            if (map.getLayer("cluster-countsatelite")) {
                                map.removeLayer("cluster-countsatelite");
                            }
                            if (map.getLayer("unclustered-pointsatelite")) {
                                map.removeLayer("unclustered-pointsatelite");
                            }
                            if (map.getSource("sateliteMap")) {
                                map.removeSource("sateliteMap");
                            }
                            //Remove above layers

                            map.on('click', 'unclustered-pointsatelite', function(e) { //under scope cluster
                                
                                addLineSatelite(e.features[0].properties);
                                //startLocation
                                map.flyTo({
                                    center: startLocation,
                                    zoom: 3.6,
                                    bearing: 0,
                                    speed: 0.2, // make the flying slow
                                    curve: 1, // change the speed at which it zooms out
                                });
                            });
                        }

                    }
                    return scope.geodata
                }, function(newValue, oldValue) {
                    if (!newValue) return;
                    var data = newValue;
                    if (data.recordsTotal > 25) {
                        var states = data.facets.clusters.buckets;
                        var res = [];
                        for (var i in states) {
                            var state = states[i];
                            var geojson = {};
                            var geometry = {};
                            var loc = []
                            geometry.type = "Point";
                            loc.push(state.lon.value);
                            loc.push(state.lat.value);
                            geometry.coordinates = loc;
                            geojson.type = "Feature";
                            geojson.geometry = geometry;
                            var props = {};
                            geojson.properties = props;
                            geojson.geohash = state.key;
                            geojson.count = state.doc_count;
                            geojson.bounds = state.bounds;
                            geojson.precision = state.key.length;
                            res.push(geojson);
                        }
                        $scope.addCluster(res);
                    } else {
                        $scope.addCluster(data.geojson);
                    }
                });


                $scope.addClusterlivedata = function(data, append) {
                    //Remove Layer red and green line after user click on radio
                    checkStore = data[0].properties.equipment_id;
                    // var removeEquip = data[0].properties.equipment_id;
                    var previousTrnID = localStorage.getItem("trainId");
                    if (map.getLayer("route_" + previousTrnID) == undefined) {
                        // do nothing  origincity_  source_circle_500  circle500
                        // console.log("GOESSS!!!");
                    } else {
                        // console.log("Chaega");
                        map.removeLayer("route_" + previousTrnID);
                        map.removeSource("route_" + previousTrnID);
                        map.removeLayer("route_current_destination");
                        map.removeSource("route_current_destination");
                        map.removeLayer("origincity_");
                        map.removeSource("origincity_");
                        map.removeLayer("destinationcity_");
                        map.removeSource("destinationcity_");
                        if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                        {
                            popup_markerOri.remove();
                            popup_markerDes.remove();
                        }
                        document.getElementById('currentlocationbox').style.display = "none";
                        // popup.remove();
                    }
                    localStorage.setItem("trainId", checkStore);
                    // console.log(data[0].properties.equipment_id);
                    //Remove Layer red and green line after user click on radio
                   
                    map.addSource("MapgoeData", {
                        type: "geojson",
                        data: {
                            "type": "FeatureCollection",
                            "features": data
                        },
                        // data: data,
                        cluster: true,
                        clusterMaxZoom: 3, // Max zoom to cluster points on
                        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                    });
                    //this is for green circle
                    map.addLayer({
                        id: "clusters",
                        type: "circle",
                        source: "MapgoeData",
                        filter: ["has", "point_count"],
                        paint: {
                            "circle-color": [
                                "step", ["get", "point_count"],
                                "#1adb44",
                                100,
                                "#f1f075",
                                700,
                                "#f28cb1"
                            ],
                            "circle-radius": [
                                "step", ["get", "point_count"],
                                20,
                                100,
                                30,
                                750,
                                40
                            ]
                        }
                    });

                    //circle inside text
                    map.addLayer({
                        id: "cluster-count",
                        type: "symbol",
                        source: "MapgoeData",
                        filter: ["has", "point_count"],
                        layout: {
                            "text-field": "{point_count_abbreviated}",
                            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                            "text-size": 12
                        }
                    });

                    //this is small green simbol
                    map.addLayer({
                        id: "unclustered-point",
                        // type: "circle",
                        type: 'symbol',
                        source: "MapgoeData",
                        filter: ["!has", "point_count"],
                        layout: {
                            'visibility': 'visible',
                            'icon-image': 'bus-15',
                            'icon-allow-overlap': true
                        }
                    });
                    map.on('mouseenter', 'clusters', function() {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Change it back to a pointer when it leaves.
                    map.on('mouseleave', 'clusters', function() {
                        map.getCanvas().style.cursor = '';
                    }); //Show case GEO JSON Data on map end

                    //Show the cursor on map for perticular well
                    map.on('mouseenter', 'unclustered-point', function() {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Change it back to a pointer when it leaves.
                    map.on('mouseleave', 'unclustered-point', function() {
                        map.getCanvas().style.cursor = '';
                    }); //Show case GEO JSON Data on map end
                   //Add source and destination

                    function addLine(properties) {
                        //Origin Location
                        var origin_location = JSON.parse(properties.origin_location);
                        var origin_location_lon = origin_location.lon;
                        var origin_location_lat = origin_location.lat;

                        //Current Location
                        var current_location = JSON.parse(properties.current_location);
                        var current_location_lon = current_location.lon;
                        var current_location_lat = current_location.lat;
 
                        //Destination Location 
                        var destination_location = JSON.parse(properties.destination_location);
                        var destination_location_lon = destination_location.lon;
                        var destination_location_lat = destination_location.lat;



                        const previousTrainID = localStorage.getItem("trainId");

                        var equipment_id = properties.equipment_id;

                        // console.log("Equipment ID:"+equipment_id);
                        // console.log("Origin Location:"+origin_location_lon+' '+origin_location_lat);
                        // console.log("Current Location:"+current_location_lon+' '+current_location_lat);
                        // console.log("Destination Location:"+destination_location_lon+' '+destination_location_lat);

                        if (map.getLayer("route_" + previousTrainID) == undefined) {
                            // do nothing  origincity_  source_circle_500  circle500
                            // console.log("GOESSS!!!");
                        } else {
                            // console.log("Chaega");
                            map.removeLayer("route_" + previousTrainID);
                            map.removeSource("route_" + previousTrainID);
                            map.removeLayer("route_current_destination");
                            map.removeSource("route_current_destination");
                            map.removeLayer("origincity_");
                            map.removeSource("origincity_");
                            map.removeLayer("destinationcity_");
                            map.removeSource("destinationcity_");
                            // popup.remove();
                        }
                        map.addLayer({
                            "id": "route_" + equipment_id,
                            "type": "line",
                            "source": {
                                "type": "geojson",
                                "data": {
                                    "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "LineString",
                                        "coordinates": [
                                            [origin_location_lon, origin_location_lat],
                                            [current_location_lon, current_location_lat]
                                            // [destination_location_lon, destination_location_lat]
                                        ]
                                    }
                                }
                            },
                            "layout": {
                                "line-join": "round",
                                "line-cap": "round"
                            },
                            "paint": {
                                "line-color": "green",
                                "line-width": 4,
                                // "line-dasharray": [2, 6],
                            }
                        });

                        //Add Current Location to Destination
                        map.addLayer({
                            "id": "route_current_destination",
                            "type": "line",
                            "source": {
                                "type": "geojson",
                                "data": {
                                    "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "LineString",
                                        "coordinates": [
                                            // [origin_location_lon, origin_location_lat],
                                            [current_location_lon, current_location_lat],
                                            [destination_location_lon, destination_location_lat]
                                        ]
                                    }
                                }
                            },
                            "layout": {
                                "line-join": "round",
                                "line-cap": "round"
                            },
                            "paint": {
                                "line-color": "red",
                                "line-width": 4,
                                "line-dasharray": [2, 4],
                            }
                        });


                        //Add Origin Location
                        map.addLayer({
                            "id": "origincity_",
                            "type": "symbol",
                            "source": {
                                "type": "geojson",
                                "data": {
                                    "type": "FeatureCollection",
                                    "features": [{
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [origin_location_lon, origin_location_lat]
                                        }
                                    }]
                                }
                            },
                            "layout": {
                                'visibility': 'visible',
                                "icon-image": "picnic-site-15", // beer-11
                                "icon-allow-overlap": true
                            }
                        });

                        //Add Destination Location
                        map.addLayer({
                            "id": "destinationcity_",
                            "type": "symbol",
                            "source": {
                                "type": "geojson",
                                "data": {
                                    "type": "FeatureCollection",
                                    "features": [{
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [destination_location_lon, destination_location_lat]
                                        }
                                    }]
                                }
                            },
                            "layout": {
                                'visibility': 'visible',
                                "icon-image": "stadium-15", //circle-stroked-11
                                "icon-allow-overlap": true
                            }
                        });


                        if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                        {
                          popup_markerOri.remove();
                          popup_markerDes.remove();
                        }
                        //Origin Popup
                        var popup_data_origin = '<table><tr><td style = "font-weight: bold;font-size: 12px;">Origin city:</td><td style="font-size: 12px;">' + properties.origin_city + '</td></tr></table>';
                        var origin_arr = [];
                        origin_arr.push(origin_location_lon);
                        origin_arr.push(origin_location_lat);

                        //Marker Popup
                        var popup_orign = new mapboxgl.Popup()
                            .setHTML(popup_data_origin);
                        popup_markerOri = new mapboxgl.Marker()
                            .setLngLat(origin_arr)
                            .setPopup(popup_orign)
                            .addTo(map);
                        // new mapboxgl.Popup({
                        //         closeOnClick: false
                        //     })
                        //     .setLngLat(origin_arr)
                        //     .setHTML(popup_data_origin) //properties.title
                        //     .addTo(map);

                        //Destination Popup
                        var popup_data_destination = '<table><tr><td style = "font-weight: bold;font-size: 12px;">Dest city:</td><td style="font-size:12px;">' + properties.destination_city + '</td></tr></table>';
                        var destination_arr = [];
                        destination_arr.push(destination_location_lon);
                        destination_arr.push(destination_location_lat);

                        //Marker Destination popup
                        var popup_desc = new mapboxgl.Popup({offset:[0, -30]})
                            .setHTML(popup_data_destination);
                        popup_markerDes = new mapboxgl.Marker()
                            .setLngLat(destination_arr)
                            .setPopup(popup_desc)
                            .addTo(map);
                        // new mapboxgl.Popup({
                        //         closeOnClick: false
                        //     })
                        //     .setLngLat(destination_arr)
                        //     .setHTML(popup_data_destination) //$("#hiddendiv").html();
                        //     .addTo(map);
                        // popup.remove();
                        //Destination Popup
                        
                        // console.log(popup_markerOri);
                        // console.log(popup_markerDes);
                        $('#fclear').on('click', function(e) {
                            // hasBeenClicked = true;
                            map.flyTo({
                                zoom: 3.8,
                                center: [-94.29179687498357, 42.40000000000000],
                                bearing: 0,
                                speed: 0.2, // make the flying slow
                                curve: 1 // change the speed at which it zooms out
                            });
                            if (map.getLayer("route_" + previousTrainID) == undefined) {
                                // do nothing  origincity_  source_circle_500  circle500
                            } else {
                                map.removeLayer("route_" + previousTrainID);
                                map.removeSource("route_" + previousTrainID);
                                map.removeLayer("route_current_destination");
                                map.removeSource("route_current_destination");
                                map.removeLayer("origincity_");
                                map.removeSource("origincity_");
                                map.removeLayer("destinationcity_");
                                map.removeSource("destinationcity_");
                                // popup.remove();
                                if(popup_markerOri!=undefined && popup_markerDes!=undefined)
                                {
                                  popup_markerOri.remove();
                                  popup_markerDes.remove();
                                }
                                document.getElementById('currentlocationbox').style.display = "none";
                            }
                        });
                        // console.log(popup_markerOri);
                        // console.log(popup_markerDes);
                        localStorage.setItem("trainId", equipment_id);
                    }
                    //Add Source & Destination

                    map.on('click', 'unclustered-point', function(e) {
                        var proppant_type = e.features[0].properties.proppant_type;
                        var event_location_city = e.features[0].properties.current_event_city;
                        var event_location_state = e.features[0].properties.current_event_state;
                        var current_city = e.features[0].properties.current_location_city;
                        var current_state = e.features[0].properties.current_location_state;

                        var po_number = e.features[0].properties.po_number;
                        var Endate = e.features[0].properties.estimated_notify_date;
                        var counter_checking=0;
                        if(proppant_type==undefined)
                        {
                            proppant_type="";
                        }
                        if(event_location_city==undefined)
                        {
                            event_location_city = "";
                            counter_checking++;
                        }
                        if(event_location_state==undefined)
                        {
                            event_location_state="";
                            counter_checking++;
                        }
                        if(po_number==undefined)
                        {
                            po_number="";
                        }
                        if(Endate==undefined)
                        {
                            Endate="";
                        }
                        // console.log("Countter Chek:"+counter_checking);
                        var popup_data;
                        if(counter_checking==2) {
                            popup_data = '<table border="1" style="border-collapse: collapse;"><tr><td style = "font-weight: bold;font-size:10px;">EQP ID:</td><td style="font-size:10px;">' + e.features[0].properties.equipment_id + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Propnt type:</td><td style="font-size:10px;">' + proppant_type + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current city:</td><td style="font-size:10px;">' + current_city + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current state:</td><td style="font-size:10px;">' + current_state + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">PO no:</td><td style="font-size:10px;">' + po_number + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">ETA/ETI date:</td><td style="font-size:10px;">' + Endate + '</td></tr></table>';
                        } else {
                            popup_data = '<table border="1" style="border-collapse: collapse;"><tr><td style = "font-weight: bold;font-size:10px;">EQP ID:</td><td style="font-size:10px;">' + e.features[0].properties.equipment_id + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Propnt type:</td><td style="font-size:10px;">' + proppant_type + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current event city:</td><td style="font-size:10px;">' + event_location_city + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">Current event state:</td><td style="font-size:10px;">' + event_location_state + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">PO no:</td><td style="font-size:10px;">' + po_number + '</td></tr><tr><td style="font-weight: bold;font-size:10px;">ETA/ETI date:</td><td style="font-size:10px;">' + Endate + '</td></tr></table>';
                        }
                        

                        
                        var contents_className = document.getElementById('currentlocationbox');
                        var contents = document.getElementById('currentlocation-area');
                        contents.innerHTML = popup_data;
                        // $(".currentlocation-area").show();
                        var store_displayResult = contents_className.style.display;
                        // console.log(contents_className.style.display);
                        if (store_displayResult == "none") {
                            // console.log("Under None");
                            document.getElementById('currentlocationbox').style.display = "block";
                        } else {
                            // console.log("NotUnder None");
                            // contents_className.style.display = "none";
                            document.getElementById('currentlocationbox').style.display = "block";
                        }

                        //Commented mapboxGL popup
                        // new mapboxgl.Popup({
                        //         closeOnClick: false
                        //     })
                        //     .setLngLat(e.features[0].geometry.coordinates)
                        //     .setHTML(popup_data)
                        //     .addTo(map);
                        //Commented mapboxGL popup

                        addLine(e.features[0].properties);

                        map.flyTo({
                            center: startLocation,
                            zoom: 3.6,
                            bearing: 0,
                            speed: 0.2, // make the flying slow
                            curve: 1 // change the speed at which it zooms out
                            // easing: function (t) {
                            //     return t;
                            // }
                        });
                        // popup.remove();  //Error coming for remove
                        //check moring [&precision=2] 
                        var checkUpdateURL = e.features[0].properties.equipment_id;
                        // console.log(checkUpdateURL); //EquipmentID
                        // $scope.updateURLEquipmentID(checkUpdateURL); //uncomment later

                    });
                    

                };
                $scope.addCluster = function(data, append) {

                };
                $scope.updateURLEquipmentID = function(data, append) {
                    console.log(data);
                    if(data!=null) {
                        console.log("inside!!!");
                        window.location = '/home#?searchType=wells' +''+ '&EQUIPMENT_ID=' + data;
                        // Query.setSearch(window.location);
                        var Checkingurl = $location.url();
                        console.log(Checkingurl);
                        delete Query.get()['precision'];
                        Query.updateUrl();
                        $scope.$apply();
                    }
                };
                // preeti
              //  map.handlemove = true;
                // _this.moveEndHandler = function(e) {
                //     var b = map.getBounds();
                //     //alert(_this.map.getZoom() +" - "+Query.get()['precision']);
                //     if (map.handlemove && !e.hard) {
                //         map.nofit = true;
                //         var zoom = Math.ceil(map.getZoom() / 3);
                //        if (zoom < 3) zoom = 3;
                //         // console.log("Inside Facet clicked:" + hasBeenClicked);
                //         if (hasBeenClicked == true) {
                //             Query.get()['precision'] = zoom;
                //             Query.get()['bounds'] = b.getNorthWest().lat + '|' + b.getNorthWest().lng + '|' + b.getSouthEast().lat + '|' + b.getSouthEast().lng;
                //             //Query.updateUrl();
                //             hasBeenClicked = false;
                //             $scope.$apply();
                //         } else {
                //             // console.log("Zoom Hey:-"+zoom);
                //             Query.get()['precision'] = zoom;
                //              if (b.getNorthWest().lat > 45.00000000000000) {
                //             //     // console.log("Lat is gets bounced !!!!!!");
                //             } else {
                //                 Query.get()['bounds'] = b.getNorthWest().lat + '|' + b.getNorthWest().lng + '|' + b.getSouthEast().lat + '|' + b.getSouthEast().lng;
                //                 Query.updateUrl();
                //                 $scope.$apply();
                //                 console.log('hi preeti');
                //             }
                //           }
                //     }
                //     setTimeout(function() {
                //         map.handlemove = true;
                //     }, 3000);
                // };
                // map.on('zoomend', _this.moveEndHandler);
                // preeti

                $scope.wellDetails = function(id) {
                    $rootScope.lock();
                    $.http({
                        url: "/searchAttr?&page=details&attr=_id&val=" + id,
                        success: function(data, status, headers, config) {
                            $rootScope.unlock();
                            if (Query.get().searchType == 'wells')
                                $rootScope.well = data;

                            else
                                $rootScope.permit = data;
                            $('#details_modal').modal('show');
                        }
                    });
                }

                // $scope.fitBounds = function(bounds) {
                //     map.fitBounds(bounds);
                // }

                $('#map').unbind('click');
                $('#map').on('click', '.popup', function(e) {
                    openDetailsPopup(e, $http, $rootScope);
                });
            },

            compile: function(element, iAttrs) {
                directiveDefinitionObject.template = '<div id="' + iAttrs.id + '" style="' + iAttrs.style + '"></div>';
            },
            controllerAs: 'shell',
            replace: true
        };
        return directiveDefinitionObject;
    }]);
}());
