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
        vm.renderBubbleChart = renderBubbleChart;
        vm.universityList = [];
        vm.filteredUniversities = [];
        vm.stateUnivCountData = {};
        vm.maxUniversityCount = 0;
        vm.filteredUniversities=[];
        var mapData=[];
        var conversionChart;

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

        function filterUniversities() {
            vm.filteredUniversities = [];
            var mapData=[],j=0;
            vm.maxUniversityCount = 0;
            var detailsParameter = vm.yearFilter + "Details";
            for (var i = 0; i < vm.universityList.length; i++) {
                if (parseInt(vm.universityList[i][detailsParameter].priceInStateOffCampus) >= vm.inStateSlider.min &&
                    parseInt(vm.universityList[i][detailsParameter].priceInStateOffCampus) <= vm.inStateSlider.max &&
                    parseInt(vm.universityList[i][detailsParameter].priceOutStateOnCampus) >= vm.outStateSlider.min &&
                    parseInt(vm.universityList[i][detailsParameter].priceOutStateOnCampus) <= vm.outStateSlider.max) {
                    vm.filteredUniversities.push(vm.universityList[i]);
                }
                
                 if (i == vm.universityList.length - 1) {
                    formChoroplethData();
                    
                }
                
                
            }
            for(var i=0;i<vm.filteredUniversities.length;i++){
                    //if(vm.filteredUniversities[i].stateCode==stateCode){
                        //console.log(vm.filteredUniversities[i]);
                        
                        mapData[j]={x: parseInt(vm.filteredUniversities[i][detailsParameter].admissionsMen),
                                y: parseInt(vm.filteredUniversities[i][detailsParameter].admissionsWomen),
                                size: parseInt(vm.filteredUniversities[i][detailsParameter].admissionsTotal),
                                c:i+1,
                               name:vm.filteredUniversities[i].universityName};
                            
                        j++;
                    //}
                }
                vm.renderBubbleChart(mapData);
               
            }

        function formChoroplethData() {
            vm.stateUnivCountData = d3.nest()
                .key(function (d) {
                    return d.stateCode;
                })
                .rollup(function (v) {
                    return v.length;
                })
                .entries(vm.filteredUniversities);
            
            console.log(vm.stateUnivCountData);
            for (var i = 0; i < vm.stateUnivCountData.length; i++) {
                console.log(vm.stateUnivCountData[i]["id"]);
                vm.stateUnivCountData[i]["id"] = vm.stateUnivCountData[i]["key"];
                delete vm.stateUnivCountData[i]["key"];
                if(vm.stateUnivCountData[i].hasOwnProperty("values")){
                    vm.stateUnivCountData[i].value = vm.stateUnivCountData[i].values;
                }
                if (vm.stateUnivCountData[i].value > vm.maxUniversityCount) {
                    vm.maxUniversityCount = vm.stateUnivCountData[i].values
                }
                
                if (i == vm.stateUnivCountData.length - 1) {
                    vm.renderCharts();
                }
            }
        }

        function renderCharts() {
    
            //vm.renderBubbleChart();
            
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
                            "entityFillHoverColor": "#d35400",
                            "entityFillHoverAlpha": "30",
                            //Theme
                            "theme": "fint"
                        },
                        "colorrange": {
                            "startlabel": "Low",
                            "endlabel": "High",
                            "code": "#ccccff",
                            "gradient": "1",
                            "color": [{
                                "maxvalue": vm.maxUniversityCount,
                                "code": "#000066"
                            }]
                        },
                        "data": vm.stateUnivCountData
                    }, events: {
                    entityClick: function (event, args) {
                        console.log((args.id).toUpperCase());
                        if(mapData.length){
                            mapData = [];
                            d3.select('#chartID').remove();
                        }
                        fetchDataByStateCode((args.id).toUpperCase());
                        
                }
            }
                });
                salesMap.render();
            });

        }

        init();

        function init() {
            vm.initializeSliders();
            if (UniversitySearchService.cleanUniversityList.length > 0) {
                vm.universityList = UniversitySearchService.cleanUniversityList;
                vm.renderCharts();
            } else {
                UniversitySearchService.fetchAllUniversities().then(function (data) {
                    vm.universityList = data;
                    filterUniversities();
                })
            }
            $('.collapse').on('shown.bs.collapse', function () {
                $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
            }).on('hidden.bs.collapse', function () {
                $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
            });
        }

        
        
        /****************************** Bubble chart **********************************/
                
        function fetchDataByStateCode(stateCode){
            
                mapData=[];
                var year = vm.yearFilter + "Details";
                console.log(year);
                var j=0;
                for(var i=0;i<vm.filteredUniversities.length;i++){
                    if(vm.filteredUniversities[i].stateCode==stateCode){
                        console.log(vm.filteredUniversities[i]);
                        
                        mapData[j]={x: parseInt(vm.filteredUniversities[i][year].admissionsMen),
                                y: parseInt(vm.filteredUniversities[i][year].admissionsWomen),
                                size: parseInt(vm.filteredUniversities[i][year].admissionsTotal),
                                c:i+1,
                               name:vm.filteredUniversities[i].universityName};
                            
                        j++;
                    }
                }
                
                vm.renderBubbleChart(mapData);
      }
        
        function renderBubbleChart(data){
            
            d3.select('#chartID').remove();
             
            console.log(data.length);
            var height = 400;
            var width = 600;
            var margin = 40; 
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
                              .attr("r", function (d) { return scale(d.size); })
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
          
    }
})();
