(function() {
    var app = angular.module('app.directives');

    // Mapbox start
    app.directive('mapboxgl', ['$rootScope', '$http', '$compile', 'QueryService', function($rootScope, $http, $compile, Query) {
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


                // this.map = _this.map = L.map('map', {maxZoom: 15}).setView([$attrs.lat, $attrs.lng], $attrs.zoom);
                mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94LXJpIiwiYSI6IjAwbE9iblkifQ.BCxGtN4YUR4U4ivMIe05cQ';

                var tileset = 'mapbox.streets';
                var map = new mapboxgl.Map({
                    container: 'map', // container id
                    // style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
                    // maxZoom: 15,
                    // minZoom: 2,
                    center: [-108.29179687498357, 39.40000000000000],
                    zoomControl: false,
                    //   style: {
                    //     "version": 8,
                    //     "sources": {
                    //         "raster-tiles": {
                    //             "type": "raster",
                    //             "url": "mapbox://" + tileset,
                    //             "tileSize": 256
                    //         }
                    //     },
                    //     "layers": [{
                    //         "id": "simple-tiles",
                    //         "type": "raster",
                    //         "source": "raster-tiles"
                    //     }]
                    // },
                    // style: 'mapbox://styles/mapbox/basic-v9',
                    // style: 'mapbox://styles/mapbox/light-v9',
                    // pitch: 50, // pitch in degrees
                    // bearing: -60, // bearing in degrees
                    // style: 'mapbox://styles/mapbox/satellite-v9',
                    style: 'mapbox://styles/mapbox-ri/cjhfvpn050hkf2spbb1jxt9d9',
                    attributionControl: false, //Remove mapboxGLAdd
                    zoom: 7 // starting zoom
                });
                map.setCenter(map.getCenter().wrap());
                var hasBeenClicked = false;
                var nav = new mapboxgl.NavigationControl();
                map.addControl(nav, 'bottom-right');
                var Fullscreen = new mapboxgl.FullscreenControl();
                map.addControl(Fullscreen, 'bottom-right');

                // console.log(Fullscreen);


                // var Draw_Control = new MapboxDraw();
                // map.addControl(Draw_Control, 'bottom-bright');

                // var toggle = new ToggleControl(document.querySelector('.Layercontrol'))
                // map.addControl(toggle, 'bottom-right');
                // Locate the User

                //Remove GEO Locator
                // var locateUser = new mapboxgl.GeolocateControl({
                //     positionOptions: {
                //         enableHighAccuracy: true
                //     },
                //     trackUserLocation: true
                // });
                // map.addControl(locateUser, 'bottom-right');
                // var counter = 0;
                $(document).ready(function() {
                    $(".mapboxgl-ctrl-fullscreen").click(function() {
                        if (Fullscreen._fullscreen == false) {
                            console.log("Fullscreen false");
                            console.log(Fullscreen._fullscreen);
                            $(".Layercontrol").css("right", "1%");
                            $(".Layercontrol").css("bottom", "48%"); // change
                            $("#check").css("border", "1px solid");
                            $("#check").css("right", "0.3%");
                            $("#check").css("bottom", "20%"); // change
                            $("#check").css("position", "absolute");
                            $("#check").css("z-index", "21470");
                            // counter++;
                        }
                        else {
                            console.log("Fullscreen true");
                            console.log(Fullscreen._fullscreen);
                            $(".Layercontrol").css("right", "1%");
                            $(".Layercontrol").css("top", "45%");
                            $("#check").css("bottom", "10%");
                            $("#check").css("margin-right", "0.7%");
                        }
                    });
                    $('#fclear').on('click', function(e) {
                        hasBeenClicked = true;
                        map.flyTo({
                            zoom: 7,
                            center: [-108.29179687498357, 39.40000000000000]
                        });

                        
                        $('#keywordbox').val(''); //globle search clear
                        $('#ss_list_dd').val(''); //Recall save clear
                        $('.mapboxgl-popup ').remove()//map popup clear
                       
                    });

                    $("#map").click(function() {
                        // alert($(this).attr('class'));
                        map.resize();
                    });
                    $('#CBM').click(function() {
                        if ($(this).prop("checked") == true) {
                            //You can add your stylings
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
                                'id': 'CBM',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/Basins/CBMBasins.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': '#4C1DB7',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                            //You can add your stylings
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("CBM")) {
                                map.removeLayer("CBM");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("CBM")) {
                                map.removeSource("CBM");
                            }
                        }
                    });
                    $('#SedimentaryBasins').click(function() {
                        if ($(this).prop("checked") == true) {
                            //You can add your stylings
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
                                'id': 'SedimentaryBasins',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/Basins/SedimentaryBasins.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': '#402b12',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                            //You can add your stylings
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("SedimentaryBasins")) {
                                map.removeLayer("SedimentaryBasins");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("SedimentaryBasins")) {
                                map.removeSource("SedimentaryBasins");
                            }
                        }
                    });
                    $('#ShaleGas').click(function() {
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
                                'id': 'ShaleGas',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/Basins/ShaleGas.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': '#0000FF',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("ShaleGas")) {
                                map.removeLayer("ShaleGas");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("ShaleGas")) {
                                map.removeSource("ShaleGas");
                            }
                        }
                    });
                    $('#ShalegasP').click(function() {
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
                                'id': 'ShalegasP',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/Basins/shalegasplay.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': '#4A235A',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("ShalegasP")) {
                                map.removeLayer("ShalegasP");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("ShalegasP")) {
                                map.removeSource("ShalegasP");
                            }
                        }
                    });
                    $('#USABasins').click(function() {
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
                                'id': 'USABasins',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/Basins/USABasins.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': '#196486',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("USABasins")) {
                                map.removeLayer("USABasins");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("USABasins")) {
                                map.removeSource("USABasins");
                            }
                        }
                    });
                    $('#WorldBasins-ExceptUSA').click(function() {
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
                                'id': 'WorldBasins',
                                'type': 'fill',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/Basins/WorldBasins-ExceptUSA.geojson'
                                },
                                'layout': {},
                                'paint': {
                                    'fill-color': '#4a7ae1',
                                    'fill-opacity': 0.4
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("WorldBasins")) {
                                map.removeLayer("WorldBasins");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("WorldBasins")) {
                                map.removeSource("WorldBasins");
                            }
                        }
                    });
                    $('#CrudeOil_Pipelines_US_201703').click(function() {
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
                                'id': 'CrudeOil_Pipelines',
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/PipelineGeojson/CrudeOil_Pipelines_US_201703.geojson'
                                },
                                'layout': {
                                  "line-join": "round",
                                  "line-cap": "round"
                                },
                                'paint': {
                                    'line-color': '#4a7ae1',
                                    'line-width': 6
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("CrudeOil_Pipelines")) {
                                map.removeLayer("CrudeOil_Pipelines");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("CrudeOil_Pipelines")) {
                                map.removeSource("CrudeOil_Pipelines");
                            }
                        }
                    });
                    $('#HGL_Pipelines_US_201703').click(function() {
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
                                'id': 'HGL_Pipelines_US',
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/PipelineGeojson/HydrocarbonGasLiquid(HGL)_Pipelines_US_201703.geojson'
                                },
                                'layout': {
                                  "line-join": "round",
                                  "line-cap": "round"
                                },
                                'paint': {
                                    'line-color': '#BE7DBF',
                                    'line-width': 6
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("HGL_Pipelines_US")) {
                                map.removeLayer("HGL_Pipelines_US");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("HGL_Pipelines_US")) {
                                map.removeSource("HGL_Pipelines_US");
                            }
                        }
                    });
                    $('#NaturalGas_Pipelines').click(function() {
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
                                'id': 'NaturalGas_Pipelines',
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/PipelineGeojson/NaturalGas_Pipelines.geojson'
                                },
                                'layout': {
                                  "line-join": "round",
                                  "line-cap": "round"
                                },
                                'paint': {
                                    'line-color': '#ff4c4c',
                                    'line-width': 6
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("NaturalGas_Pipelines")) {
                                map.removeLayer("NaturalGas_Pipelines");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("NaturalGas_Pipelines")) {
                                map.removeSource("NaturalGas_Pipelines");
                            }
                        }
                    });
                    $('#PetroleumProduct_Pipelines').click(function() {
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
                                'id': 'PetroleumProduct_Pipelines',
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': 'js/geojson/PipelineGeojson/PetroleumProduct_Pipelines_US_201703.geojson'
                                },
                                'layout': {
                                  "line-join": "round",
                                  "line-cap": "round"
                                },
                                'paint': {
                                    'line-color': '#804EF3',
                                    'line-width': 6
                                }
                            }, firstSymbolId);
                        } else if ($(this).prop("checked") == false) {
                            if (map.getLayer("PetroleumProduct_Pipelines")) {
                                map.removeLayer("PetroleumProduct_Pipelines");
                            }
                            //Same like getSource and RemoveSourse
                            if (map.getSource("PetroleumProduct_Pipelines")) {
                                map.removeSource("PetroleumProduct_Pipelines");
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
                                    'fill-color': '#58562E',
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

                // Layers End here
                // console.log(counter);
                // $(function() {
                //     console.log( "ready!" );
                //     console.log(counter);
                //
                //       $(document).keyup(function(e) {
                //         console.log(counter);
                //            if (e.keyCode == 27) { // escape key maps to keycode `27`
                //               console.log("OnKeyUP!");
                //           }
                //       });
                //
                // });
                var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
                var mapBox_height_width = document.getElementById("map").style;
                mapCanvas.style.height = mapBox_height_width.height;
                mapCanvas.style.width = mapBox_height_width.width;

                map.on('load', function() {

                    // var mapboxGL_Map = document.getElementsByClassName('mapboxgl-map')[0];
                    // mapboxGL_Map.style.height = '100%';
                    // mapboxGL_Map.style.width = '100%';
                    var MissingCSS = document.getElementsByClassName('mapboxgl-missing-css')[0];
                    MissingCSS.remove();

                    map.resize();

                    // map.fitBounds();

                });


                // var customControl = new CustomControl(document.querySelector('#my-legend'));
                // map.addControl(toggle, 'bottom-left');



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
                //MapboxGL Flyback and Reset

                var counter = 0;
                $scope.$watch(function(scope) {
                    // alert("All Data:");
                    if (typeof scope.geodata != 'undefined') {
                        // MapgeoJSONData.push(scope.geodata.geojson);

                        counter++;
                        // console.log("Counter:"+counter);
                        if (counter > 1) {
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
                        $scope.addClusterlivedata(scope.geodata.geojson);
                    }
                    return scope.geodata
                },
                 function(newValue, oldValue) {
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

                    map.addSource("MapgoeData", {
                        type: "geojson",
                        data: {
                            "type": "FeatureCollection",
                            "features": data
                        },
                        cluster: true,
                        clusterMaxZoom: 14, // Max zoom to cluster points on
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
                                750,
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
                        // paint: {
                        //     "circle-color": "#4ada11",
                        //     "circle-radius": 7,
                        //     "circle-stroke-width": 1,
                        //     "circle-stroke-color": "#fff"
                        // }
                        layout: {
                            'visibility': 'visible',
                            'icon-image': 'circle-15',
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

                    //display popup
                    map.on('click', 'unclustered-point', function(e) {
                        // var popupContent = '<br><a class="popup" href="javascript:;" id="' + a.properties._id + '">details</a>';

                        // console.log(e.features[0].properties.title);
                        var table = e.features[0].properties.title;
                        var ref = $.parseHTML(table);
                        // console.log(ref);
                        // console.log(ref[0].innerHTML);


                        // console.log(JSON.stringify(table));
                      console.log(e.features[0].properties._id);
                      new mapboxgl.Popup()
                            //.closeButton: false,
                            //+'<br><tr><td><a class="popup">details</a></tr></td>'
                            // <br><a class="popup" href="javascript:;" id="' + a.properties._id + '">details</a>
                            // /'<br><a class="popup" href="javascript:;" id="' + e.features[0].properties._id + '">details</a>'
                            .setLngLat(e.features[0].geometry.coordinates)
                            .setHTML(e.features[0].properties.title)
                            .addTo(map);
                            popup.remove();
                            
                    });

                };
                $scope.addCluster = function(data, append) {
                    // console.log("----------------------2 state DATA------------------------------");
                    // // console.log(JSON.stringify(data));
                    // console.log("----------------------------------------------------------------");
                    // console.log();
                    //
                    // console.log("----------------------All data-------------------------");
                    //
                    // console.log("------------------------------------------------------");
                };

                // Update URL part
                map.handlemove = true;
                _this.moveEndHandler = function(e) {
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
                        } 
                        else {
                            // console.log("Zoom Hey:-"+zoom);
                            Query.get()['precision'] = zoom;
                            // console.log("-------------Checking bounds for lat long------------------");
                            // console.log(b.getNorthWest().lat);
                            // console.log(b.getNorthWest().lng);
                            // console.log(b.getSouthEast().lat);
                            // console.log(b.getSouthEast().lng);

                            // if(!b.getNorthWest().lat>40.00000000000000 && b.getNorthWest().lng<-111.50824638420728 && b.getSouthEast().lat>38.4172784951372 && b.getSouthEast().lng<-104.85203767495304)
                            if (b.getNorthWest().lat > 40.00000000000000) {
                                // console.log("Lat is gets bounced !!!!!!");
                            } else {
                                Query.get()['bounds'] = b.getNorthWest().lat + '|' + b.getNorthWest().lng + '|' + b.getSouthEast().lat + '|' + b.getSouthEast().lng;
                                Query.updateUrl();
                                $scope.$apply();
                            }
                            // console.log("-------------Checking bounds end lat long------------------");
                        }
                    }
                    setTimeout(function() {
                        map.handlemove = true;
                    }, 3000);
                };
                map.on('zoomend', _this.moveEndHandler);
                // Update URL part

                // Remove comment later
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
                            $( ".scrolling" ).scrollTop( 0 );
                            $( ".scrolling" ).scrollLeft( 0 );
                        }
                    });
                }

                $scope.fitBounds = function(bounds) {
                    map.fitBounds(bounds);
                }

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
    // Mapbox end
}());
