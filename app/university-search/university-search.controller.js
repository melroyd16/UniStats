(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch', [])
        .controller('UniversitySearchCtrl', UniversitySearchCtrl);

    UniversitySearchCtrl.$inject = ['$http', 'UniversitySearchService', '$timeout'];

    /* @ngInject */
    function UniversitySearchCtrl($http, UniversitySearchService, $timeout) {
        var vm = this;
        vm.yearFilter = "2015";
        vm.yearOptions = ["2012", "2013", "2014", "2015"];
        vm.filterUniversities = filterUniversities;
        vm.initializeSliders = initializeSliders;
        vm.renderCharts = renderCharts;
        vm.universityList = [];
        
<<<<<<< HEAD
/*        vm.renderSliders = function () {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        }*/
        
        var mapData=[],mapCategory = {};
        var conversionChart;
        var xAxisMaxVal,yAxisMaxVal,xAxisMinVal,yAxisMinVal;
        
        
        function fetchDataByState(state){
            
            mapData = []
            
            d3.json("/JSON/"+state+".json", function(data){
            
                console.log(data);
                
                for(var i=0;i<data.Item.length;i++){
                    
                    if(i==0){
                        xAxisMaxVal = data.Item[i]["2012Details"].admissionsMen;
                        xAxisMinVal = data.Item[i]["2012Details"].admissionsMen;
                        yAxisMaxVal = data.Item[i]["2012Details"].admissionsWomen;
                        yAxisMinVal = data.Item[i]["2012Details"].admissionsWomen;
                    }
                    
                    if(xAxisMaxVal < data.Item[i]["2012Details"].admissionsMen){
                        xAxisMaxVal = data.Item[i]["2012Details"].admissionsMen;
                    }
                    if(xAxisMinVal > data.Item[i]["2012Details"].admissionsMen){
                        xAxisMinVal = data.Item[i]["2012Details"].admissionsMen;
                    }
                    if(yAxisMaxVal < data.Item[i]["2012Details"].admissionsWomen){
                        yAxisMaxVal = data.Item[i]["2012Details"].admissionsWomen;
                    }
                    if(yAxisMinVal > data.Item[i]["2012Details"].admissionsWomen){
                        yAxisMinVal = data.Item[i]["2012Details"].admissionsWomen;
                    }
                    mapData[i]={x: parseInt(data.Item[i]["2012Details"].admissionsMen),
                                y: parseInt(data.Item[i]["2012Details"].admissionsWomen),
                                size: parseInt(data.Item[i]["2012Details"].admissionsTotal),
                                c:i+1,
                               name:data.Item[i].universityName};
                    
                    mapCategory[i]={label: parseInt(data.Item[i]["2012Details"].admissionsMen),
                                     x: parseInt(data.Item[i]["2012Details"].admissionsMen),
                                     showverticalline: i};
                }
                                    
                console.log(mapData);
                console.log(mapCategory);
                //conversionChart.render();
                
                bubbleChart(mapData);
                
        
            });
        }
        
        
        
=======
>>>>>>> 0971755e0d6bb920a3e72f152f35b553e09d2b2c
        function initializeSliders() {
            vm.minTempSlider = {
                min: 0,
                max: 150,
                options: {
                    floor: 0,
                    ceil: 150,
                    step: 1,
                    onEnd: vm.filterUniversities
                }
            };
            vm.maxTempSlider = angular.copy(vm.minTempSlider);
            vm.meanTempSlider = angular.copy(vm.minTempSlider);
            vm.snowfallSlider = angular.copy(vm.minTempSlider);
            vm.rainfallSlider = angular.copy(vm.minTempSlider);
            vm.snowfallSlider.options.ceil = 300;
            vm.snowfallSlider.max = 300;
            vm.inStateSlider = {
                min: 0,
                max: 80000,
                options: {
                    floor: 0,
                    ceil: 80000,
                    step: 5000,
                    onEnd: vm.filterUniversities
                }
            };
            vm.outStateSlider = angular.copy(vm.inStateSlider);
        }
        
        function filterUniversities(){
            console.log("hello");
        }
        
        function renderCharts(){
//            FusionCharts.ready(function () {
//                conversionChart = new FusionCharts({
//                type: 'bubble',
//                renderAt: 'bubble-chart-container',
//                width: '600',
//                height: '400',
//                dataFormat: 'json',
//                dataSource: {
//                    "chart": {
//                        "caption": "Analyis of universities in by State",
//                        "subcaption": vm.yearFilter,
//                        "xAxisMinValue": "0",
//                        "xAxisMaxValue": "100",
//                        "yAxisMinValue": "0",
//                        "yAxisMaxValue": "30000",
//                        "plotFillAlpha": "70",
//                        "plotFillHoverColor": "#6baa01",
//                        "showPlotBorder": "0",
//                        "xAxisName": "Tuition amount",
//                        "yAxisName": "No. Of Crimes",
//                        "numDivlines": "2",
//                        "showValues": "1",
//                        "showTrendlineLabels": "0",
//                        "plotTooltext": "$name : Profit Contribution - $zvalue%",
//                        "drawQuadrant": "1",
//                        "quadrantLineAlpha": "80",
//                        "quadrantLineThickness": "3",
//                        "quadrantXVal": "50",
//                        "quadrantYVal": "15000",
//                        //Quadrant Labels
//                        "quadrantLabelTL": "Low Price / High Sale",
//                        "quadrantLabelTR": "High Price / High Sale",
//                        "quadrantLabelBL": "Low Price / Low Sale",
//                        "quadrantLabelBR": "High Price / Low Sale",
//
//                        //Cosmetics
//                        "baseFontColor": "#333333",
//                        "baseFont": "Helvetica Neue,Arial",
//                        "captionFontSize": "14",
//                        "subcaptionFontSize": "14",
//                        "subcaptionFontBold": "0",
//                        "showBorder": "0",
//                        "bgColor": "#ffffff",
//                        "showShadow": "0",
//                        "canvasBgColor": "#ffffff",
//                        "canvasBorderAlpha": "0",
//                        "divlineAlpha": "100",
//                        "divlineColor": "#999999",
//                        "divlineThickness": "1",
//                        "divLineIsDashed": "1",
//                        "divLineDashLen": "1",
//                        "divLineGapLen": "1",
//                        "use3dlighting": "0",
//                        "showplotborder": "0",
//                        "showYAxisLine": "1",
//                        "yAxisLineThickness": "1",
//                        "yAxisLineColor": "#999999",
//                        "showXAxisLine": "1",
//                        "xAxisLineThickness": "1",
//                        "xAxisLineColor": "#999999",
//                        "showAlternateHGridColor": "0",
//                        "showAlternateVGridColor": "0"
//
//                    },
//                    "categories": [
//                        {
//                              "category":mapCategory
////                            "category": [
////                                {
////                                    "label": "$0",
////                                    "x": "0"
////                                },
////                                {
////                                    "label": "$20",
////                                    "x": "20",
////                                    "showverticalline": "1"
////                                },
////                                {
////                                    "label": "$40",
////                                    "x": "40",
////                                    "showverticalline": "1"
////                                },
////                                {
////                                    "label": "$60",
////                                    "x": "60",
////                                    "showverticalline": "1"
////                                },
////                                {
////                                    "label": "$80",
////                                    "x": "80",
////                                    "showverticalline": "1"
////                                }, {
////                                    "label": "$100",
////                                    "x": "100",
////                                    "showverticalline": "1"
////                                }
////                            ]
//                        }
//                    ],
//                    "dataset": [
//                        {
//                            "color": "#00aee4",
//                            "data":mapData
////                            "data": [
////                                {
////                                    "x": "80",
////                                    "y": "15000",
////                                    "z": "24",
////                                    "name": "University Of Arizona"
////                                },
////                                {
////                                    "x": "60",
////                                    "y": "18500",
////                                    "z": "26",
////                                    "name": "University Of Phoenix"
////                                },
////                                {
////                                    "x": "50",
////                                    "y": "19450",
////                                    "z": "19",
////                                    "name": "Grand Canyon University"
////                                },
////                                {
////                                    "x": "65",
////                                    "y": "10500",
////                                    "z": "8",
////                                    "name": "Northern Arizona University"
////                                },
////                                {
////                                    "x": "43",
////                                    "y": "8750",
////                                    "z": "5",
////                                    "name": "Mid Western University"
////                                },
////                                {
////                                    "x": "32",
////                                    "y": "22000",
////                                    "z": "10",
////                                    "name": "Rio Salado COllege"
////                                },
////                                {
////                                    "x": "44",
////                                    "y": "13000",
////                                    "z": "9",
////                                    "name": "Central Arizona College"
////                                }
////                            ]
//                        }
//                    ]
//                }
//            });
//            conversionChart.render();
//        });
        
        FusionCharts.ready(function () {
            var salesMap = new FusionCharts({
                type: 'usa',
                renderAt: 'map-chart-container',
                width: '600',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Statewise University count",
                        "subcaption": vm.yearFilter, 
                        "borderColor": "#DDDDDDD",
                        "showLabels": "1",               

                        "numberScaleValue": "1,1000,1000",
                        "numberScaleUnit": "K,M,B",
                        "numberPrefix": "$",
                        "entityFillHoverColor": "#d35400",
                        "entityFillHoverAlpha": "30",
                        //Theme
                        "theme" : "fint"
                    },
                    "colorrange": {
                        "gradient": "1",
                        "startLabel": "Low",
                        "endLabel": "High",
                        "code": "#9999ff",
                        "minvalue": "920000",
                        "maxValue": "97400000" 
                    },
                    "data": [
                        {
                            "id": "HI",
                            "value": "3189000"
                        },
                        {
                            "id": "DC",
                            "value": "2879000"
                        },
                        {
                            "id": "MD",
                            "value": "33592000"
                        },
                        {
                            "id": "DE",
                            "value": "4607000"
                        },
                        {
                            "id": "RI",
                            "value": "4890000"
                        },
                        {
                            "id": "WA",
                            "value": "34927000"
                        },
                        {
                            "id": "OR",
                            "value": "65798000"
                        },
                        {
                            "id": "CA",
                            "value": "61861000"
                        },
                        {
                            "id": "AK",
                            "value": "58911000"
                        },
                        {
                            "id": "ID",
                            "value": "42662000"
                        },
                        {
                            "id": "NV",
                            "value": "78041000"
                        },
                        {
                            "id": "AZ",
                            "value": "41558000"
                        },
                        {
                            "id": "MT",
                            "value": "62942000"
                        },
                        {
                            "id": "WY",
                            "value": "78834000"
                        },
                        {
                            "id": "UT",
                            "value": "50512000"
                        },
                        {
                            "id": "CO",
                            "value": "73026000"
                        },
                        {
                            "id": "NM",
                            "value": "78865000"
                        },
                        {
                            "id": "ND",
                            "value": "50554000"
                        },
                        {
                            "id": "SD",
                            "value": "35922000"
                        },
                        {
                            "id": "NE",
                            "value": "43736000"
                        },
                        {
                            "id": "KS",
                            "value": "32681000"
                        },
                        {
                            "id": "OK",
                            "value": "79038000"
                        },
                        {
                            "id": "TX",
                             "value": "97344000"
                        },
                        {
                            "id": "MN",
                            "value": "43485000"
                        },
                        {
                            "id": "IA",
                            "value": "46515000"
                        },
                        {
                            "id": "MO",
                            "value": "63715000"
                        },
                        {
                            "id": "AR",
                            "value": "34497000"
                        },
                        {
                            "id": "LA",
                            "value": "70706000"
                        },
                        {
                            "id": "WI",
                            "value": "42382000"
                        },
                        {
                            "id": "IL",
                            "value": "73202000" 
                        },
                        {
                            "id": "KY",
                            "value": "79118000"
                        },
                        {
                            "id": "TN",
                            "value": "44657000"
                        },
                        {
                            "id": "MS",
                            "value": "66205000"
                        },
                        {
                            "id": "AL",
                            "value": "75873000"
                        },
                        {
                            "id": "GA",
                            "value": "76895000"
                        },
                        {
                            "id": "MI",
                            "value": "67695000"
                        },
                        {
                            "id": "IN",
                            "value": "920000"
                        },
                        {
                            "id": "OH",
                            "value": "32960000"
                        },
                        {
                            "id": "PA",
                            "value": "54346000"
                        },
                        {
                            "id": "NY",
                            "value": "42828000"
                        },
                        {
                            "id": "VT",
                            "value": "77411000"
                        },
                        {
                            "id": "NH",
                            "value": "51403000"
                        },
                        {
                            "id": "ME",
                            "value": "64636000"
                        },
                        {
                            "id": "MA",
                            "value": "51767000"
                        },
                        {
                            "id": "CT",
                            "value": "57353000"
                        },
                        {
                            "id": "NJ",
                            "value": "80788000"
                        },
                        {
                            "id": "WV",
                            "value": "95890000"
                        },
                        {
                            "id": "VA",
                            "value": "83140000"
                        },
                        {
                            "id": "NC",
                            "value": "75425000"
                        },
                        {
                            "id": "SC",
                            "value": "88234000"
                        },
                        {
                            "id": "FL",
                            "value": "88234000"
                        }
                    ]
                },
                
              events: {
                    entityClick: function (event, args) {
                        console.log(args.label);
                        if(mapData.length){
                            mapData = [];
                            d3.select('#chartID').remove();
                        }
                        fetchDataByState(args.label);
                        
                }
            }
            });
            

            salesMap.render();
        });
        }
        
        init();

        function init() {
            vm.initializeSliders();
            vm.renderCharts();
            if(UniversitySearchService.cleanUniversityList.length > 0){
                vm.universityList = UniversitySearchService.cleanUniversityList;
            } else {
                UniversitySearchService.fetchAllUniversities().then(function(data){
                    vm.universityList = data;
                })
            }
            $('.collapse').on('shown.bs.collapse', function () {
                $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
            }).on('hidden.bs.collapse', function () {
                $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
            });
<<<<<<< HEAD
        }
        
        
        //// Buubble Chart//////////////
        
        function bubbleChart(data){
            var height = 400;
            var width = 600;
            var margin = 40;
            
            var data1=[];
            for(var i = 0; i < 4; i++) {
                data1.push({
                    x: Math.random() * 4000,
                    y: Math.random() * 1000,
                    c: i,
                    size: Math.random() * 2000,
                    });
            }

            console.log(data.length);
            console.log(data1);
            var labelX = 'X';
            var labelY = 'Y';
            var svg = d3.select('.chart')
                    .append('svg')
                    .attr('class', 'chart')
                    .attr("id","chartID")
                    .attr("width", width + margin + margin)
                    .attr("height", height + margin + margin)
                    .append("g")
                    .attr("transform", "translate(" + margin + "," + margin + ")");
                    
            var x = d3.scale.linear()
					            .domain([d3.min(data, function (d) { return d.x; }), d3.max(data, function (d) { return d.x; })])
					            .range([0, width]);

            var y = d3.scale.linear()
					            .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
					            .range([height, 0]);

            var scale = d3.scale.sqrt()
					            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
					            .range([1, 20]);

            var opacity = d3.scale.sqrt()
					            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
					            .range([1, .5]);
                                
            var color = d3.scale.category10();
            
            
            var xAxis = d3.svg.axis().scale(x);
            var yAxis = d3.svg.axis().scale(y).orient("left");
            console.log(xAxis);
 
            var div = d3.select("body").append("div")	
                    .attr("class", "tooltip")				
                    .style("opacity", 0);
            
                          svg.append("g")
					        .attr("class", "y axis")
					        .call(yAxis)
					        .append("text")
						        .attr("transform", "rotate(-90)")
						        .attr("x", 20)
						        .attr("y", -margin)
						        .attr("dy", ".71em")
						        .style("text-anchor", "end")
						        .text(labelY);
                          // x axis and label
                          svg.append("g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + height + ")")
                              .call(xAxis)
                              .append("text")
                                  .attr("x", width + 20)
                                  .attr("y", margin - 10)
                                  .attr("dy", ".71em")
                                  .style("text-anchor", "end")
                                  .text(labelX);
 
                          svg.selectAll("circle")
                              .data(data)
                              .enter()
                              .insert("circle")
                              .attr("cx", width / 2)
                              .attr("cy", height / 2)
                              .attr("opacity", function (d) { return opacity(d.size); })
                              .attr("r", function (d) {console.log(d); return scale(d.size); })
                              .style("fill", function (d) { return color(d.c); })
                              .on('mouseover', function (d, i) {
                                  fade(d.c, .1,d);
                              })
                             .on('mouseout', function (d, i) {
                                 div.transition()		
                                .duration(500)		
                                .style("opacity", 0);	
                                 fadeOut();
                             })
                            .transition()
                            .delay(function (d, i) { return x(d.x) - y(d.y); })
                            .duration(500)
                            .attr("cx", function (d) { return x(d.x); })
                            .attr("cy", function (d) { return y(d.y); })
                            .ease("bounce");
                             
                             
                            function fade(c, opacity,bubble) {
                                console.log(bubble.name);
                                div.transition()		
                                .duration(200)		
                                .style("opacity", .9);	
                                div.html(bubble.name)	
                                .style("left", (d3.event.pageX) + "px")		
                                .style("top", (d3.event.pageY) + "px");	
                              svg.selectAll("circle")
                                  .filter(function (d) {
                                      return d.c != c;
                                  })
                                .transition()
                                
                                 .style("opacity", opacity);
                            }

                            function fadeOut() {
                              svg.selectAll("circle")
                              .transition()
                                 .style("opacity", function (d) { opacity(d.size); });
                            }

        }
        
=======
        }    
>>>>>>> 0971755e0d6bb920a3e72f152f35b553e09d2b2c
    }
})();
