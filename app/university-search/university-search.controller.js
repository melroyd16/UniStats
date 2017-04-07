(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch', [])
        .controller('UniversitySearchCtrl', UniversitySearchCtrl);

    UniversitySearchCtrl.$inject = ['$http', 'UniversitySearchService', '$timeout', '$filter', '$scope'];

    /* @ngInject */
    function UniversitySearchCtrl($http, UniversitySearchService, $timeout, $filter, $scope) {
        var vm = this;
        vm.yearFilter = "2015";
        vm.yearOptions = ["2012", "2013", "2014", "2015"];
        vm.xAxisFilter = "priceInStateOnCampus";
        vm.xAxisOptions = [];
        vm.yAxisFilter = "sfr";
        vm.yAxisOptions = [];
        vm.filterUniversities = filterUniversities;
        vm.initializeSliders = initializeSliders;
        vm.renderCharts = renderCharts;
        vm.renderBubbleChart = renderBubbleChart;
        vm.removeState = removeState;
        vm.universityList = [];
        vm.filteredUniversities = [];
        vm.stateUnivCountData = {};
        vm.maxUniversityCount = 0;
        vm.filteredUniversities = [];
        vm.popularUnivList = [];
        vm.selectedStateArray = [];
        var bubbleData = [];
        var conversionChart;
        vm.compareList = [];
        vm.univList = [];
        vm.dataLoaded = false;
        vm.selectUniversity = selectUniversity;
        vm.removeUniversity = removeUniversity;
        vm.manualSearch = false;

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
            console.log(vm.universityList);
            vm.filteredUniversities = [];
            var mapData=[],j=0;
            vm.maxUniversityCount = 0;
            var detailsParameter = vm.yearFilter + "Details";
            for (var i = 0; i < vm.universityList.length; i++) {
                if ((parseInt(vm.universityList[i][detailsParameter].priceInStateOffCampus) >= vm.inStateSlider.min &&
                    parseInt(vm.universityList[i][detailsParameter].priceInStateOffCampus) <= vm.inStateSlider.max &&
                    parseInt(vm.universityList[i][detailsParameter].priceOutStateOnCampus) >= vm.outStateSlider.min &&
                    parseInt(vm.universityList[i][detailsParameter].priceOutStateOnCampus) <= vm.outStateSlider.max &&
                    satisfiesState(vm.universityList[i].stateCode)) || vm.manualSearch ) {
                    vm.filteredUniversities.push(vm.universityList[i]);
                }
                
                //console.log(vm.universityList.length - 1)
                 if (i == vm.universityList.length - 1) {
                    formChoroplethData();
                    
                }
                
                
            }
            
            //console.log(vm.filteredUniversities);
            for (var key in vm.filteredUniversities[0][detailsParameter]) {

                if (vm.filteredUniversities[0][detailsParameter].hasOwnProperty(key)) {
                    
                    vm.xAxisOptions.push(key);
                    vm.yAxisOptions.push(key);
                }
            }
               
        }

        function removeState(index) {
            vm.selectedStateArray.splice(index, 1);
            filterUniversities();
        }

        function satisfiesState(stateCode) {
            if (vm.selectedStateArray.length == 0) {
                return true;
            } else {
                for (var i = 0; i < vm.selectedStateArray.length; i++) {
                    if (stateCode == vm.selectedStateArray[i].code) {
                        return true;
                    } else {
                        if (i == vm.selectedStateArray.length - 1) {
                            return false;
                        }
                    }
                }
            }
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
            for (var i = 0; i < vm.stateUnivCountData.length; i++) {
                vm.stateUnivCountData[i]["id"] = vm.stateUnivCountData[i]["key"];
                delete vm.stateUnivCountData[i]["key"];
                if (vm.stateUnivCountData[i].hasOwnProperty("values")) {
                    vm.stateUnivCountData[i].value = vm.stateUnivCountData[i].values;
                }
                if (vm.stateUnivCountData[i].value > vm.maxUniversityCount) {
                    vm.maxUniversityCount = vm.stateUnivCountData[i].values
                }
                if (i == vm.stateUnivCountData.length - 1) {
                    formUniversitiesForComparison();
                    vm.renderCharts();
                }
            }
        }

        function SortByEnrollment(a, b) {
            var parameter1 = a[vm.yearFilter + "Details"]["enrolledTotal"];
            var parameter2 = b[vm.yearFilter + "Details"]["enrolledTotal"];

            if (parameter1 == "NA" && parameter2 == "NA") {
                return 0;
            } else if (parameter1 == "NA" && parameter2 !== "NA") {
                return 1;
            } else if (parameter1 !== "NA" && parameter2 == "NA") {
                return -1;
            } else {
                return ((parseInt(parameter1) < parseInt(parameter2)) ? 1 : ((parseInt(parameter1) > parseInt(parameter2)) ? -1 : 0))
            }
        }

        function formUniversitiesForComparison() {
            console.log(vm.manualSearch)
            if(!vm.manualSearch){
                vm.filteredUniversities.sort(SortByEnrollment);
                vm.popularUnivList = $filter('limitTo')(vm.filteredUniversities, 20);
            }
            else{
                d3.select('#chartID').remove();
                vm.popularUnivList = vm.universityList;
                console.log(vm.popularUnivList )
            }
        }

        function renderCharts() {

            FusionCharts.ready(function () {
                var salesMap = new FusionCharts({
                    type: 'usa',
                    renderAt: 'map-chart-container',
                    width: '450',
                    height: '400',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "Statewise University count",
                            "subcaption": vm.yearFilter,
                            "borderColor": "#DDDDDDD",
                            "showLabels": "1",
                            "showMarkerLabels": "1",
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
                    },
                    events: {
                        entityClick: function (event, args) {
                            if (bubbleData.length) {
                                bubbleData = [];
                                d3.select('#chartID').remove();
                            }
                            for (var i = 0; i < vm.selectedStateArray.length; i++) {
                                if (vm.selectedStateArray[i].code == (args.id).toUpperCase()) {
                                    vm.selectedStateArray.splice(i, 1);
                                    vm.filterUniversities();
                                    $scope.$apply();
                                    return;
                                }
                            }
                            for (var i = 0; i < STATE_ARRAY.length; i++) {
                                if ((args.id).toUpperCase() == STATE_ARRAY[i].code) {
                                    vm.selectedStateArray.push(STATE_ARRAY[i]);
                                    vm.filterUniversities();
                                    $scope.$apply();
                                    break;
                                }
                            }
                        }
                    }
                });
                salesMap.render();
            });

            d3.select('#chartID').remove();
            var year = vm.yearFilter + "Details";
            console.log(vm.popularUnivList);
            bubbleData = [];
            for (var i = 0; i < vm.popularUnivList.length; i++) {
                
                bubbleData[i] = {
                    x: parseInt(vm.popularUnivList[i][year][vm.xAxisFilter]),
                    y: parseInt(vm.popularUnivList[i][year][vm.yAxisFilter]),
                    size: parseInt(vm.popularUnivList[i][year].admissionsTotal),
                    c: i + 1,
                    name: vm.popularUnivList[i].universityName,
                    alias:vm.popularUnivList[i].alias
                        
                };
                if(bubbleData[i].alias==undefined || bubbleData[i].alias=="NA"){
                    bubbleData[i].alias = bubbleData[i].name;
                }else{
                    var shortName=[]
                    var minLength;
                    shortName=bubbleData[i].alias.split("|");
                    shortName = shortName.filter(function(str) {return /\S/.test(str);});
                    shortName.map(Function.prototype.call, String.prototype.trim);
                    //console.log(shortName);
                    minLength=(Math.min.apply(Math, shortName.map(function(str) { return str.length; })));
                    //console.log(shortName.slice().sort((a, b) => b.length - a.length).pop()); 
                    
                    bubbleData[i].alias = shortName.slice().sort((a, b) => b.length - a.length).pop();
                }
                //console.log(bubbleData[i].alias==undefined)
                
            }
            console.log(bubbleData);
            renderBubbleChart(bubbleData);
        }

        init();

        function init() {
            console.log(UniversitySearchService.cleanUniversityList);
            console.log(vm.universityList);
            vm.initializeSliders();
            
            if(!vm.manualSearch){
                UniversitySearchService.fetchAllUniversities().then(function (data) {
                    vm.universityList = data;
                    filterUniversities();
                })
            }
            
            if (UniversitySearchService.cleanUniversityList.length > 0) {
                vm.universityList = UniversitySearchService.cleanUniversityList;
                console.log(vm.universityList);
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

        function renderBubbleChart(data) {
            var height = 360;
            var width = 450;
            var margin = 40;
            var labelX = vm.xAxisFilter;
            var labelY = vm.yAxisFilter;
            var svg = d3.select('.chart')
                .append('svg')
                .attr('class', 'chart')
                .attr("id", "chartID")
                .attr("width", width + margin + margin)
                .attr("height", height + margin + margin)
                .append("g")
                .attr("transform", "translate(" + margin + "," + margin + ")");

            if(data.length==1){
               
                var x = d3.scale.linear()
                    .domain([d3.max(data, function (d) {
                        return d.x;
                    })-100, d3.max(data, function (d) {
                        return d.x;
                    })*.5])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([d3.max(data, function (d) {
                        return d.y;
                    })-10, d3.max(data, function (d) {
                        return d.y;
                    })])
                    .range([height, 20]);

                var scale = d3.scale.sqrt()
                    .domain([0, d3.max(data, function (d) {
                        return d.size;
                    })])
                    .range([1, 50]);

                var opacity = d3.scale.sqrt()
                    .domain([0, d3.max(data, function (d) {
                        return d.size;
                    })])
                    .range([1, .5]);
               } 
            else{
                var x = d3.scale.linear()
                    .domain([d3.min(data, function (d) {
                        return d.x;
                    })-((d3.max(data, function (d) {
                        return d.x;
                    })-d3.min(data, function (d) {
                        return d.x;
                    }))/width), d3.max(data, function (d) {
                        return d.x;
                    })])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([d3.min(data, function (d) {
                        return d.y;
                    })-((d3.max(data, function (d) {
                        return d.y;
                    })-d3.min(data, function (d) {
                        return d.y;
                    }))/10), d3.max(data, function (d) {
                        return d.y;
                    })])
                    .range([height, 20]);

                var scale = d3.scale.sqrt()
                    .domain([d3.min(data, function (d) {
                        return d.size;
                    }), d3.max(data, function (d) {
                        return d.size;
                    })])
                    .range([1, 50]);

                var opacity = d3.scale.sqrt()
                    .domain([d3.min(data, function (d) {
                        return d.size;
                    }), d3.max(data, function (d) {
                        return d.size;
                    })])
                    .range([1, .5]);
            }

            var color = d3.scale.category10();
            var xAxis = d3.svg.axis().scale(x);
            var yAxis = d3.svg.axis().scale(y).orient("left");
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
            
            var node = svg.append("g")
                       .attr("class", "node")
                       .selectAll("circle")
                       .data(data)
                       .enter()
                       // Add one g element for each data node here.
                       .append("g");
            
            node.append("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("opacity", function (d) {
                    return opacity(d.size);
                })
                .attr("r", function (d) {
                    return scale(d.size);
                })
                .style("fill", function (d) {
                    return color(d.c);
                })
                .on('mouseover', function (d, i) {
                    fade(d.c, .1, d);
                })
                .on('mouseout', function (d, i) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                    fadeOut();
                })
                .transition()
                .delay(function (d, i) {return x(d.x) - y(d.y);})
                .duration(500)
                .attr("cx", function (d) {return x(d.x);})
                .attr("cy", function (d) {return y(d.y);})
                .ease("bounce");

         node.append("text")
             .attr("text-anchor", "middle")
             .attr("dx", function (d) { return x(d.x); })
             .attr("dy", function (d) { return y(d.y); })
             .text(function(d) {console.log(d.alias);return d.alias;});

            function fade(c, opacity, bubble) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(bubble.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
                svg.selectAll("circle,text")
                    .filter(function (d) {
                    if(d!=undefined)
                        return d.c != c;
                    })
                    .transition()

                .style("opacity", opacity);
            }

            function fadeOut() {
                svg.selectAll("circle,text").transition().style("opacity", function (d) {
                    if(d!=undefined)
                        opacity(d.size);
                });
            }
        }
        
        
        /****** Code for search bar *******/
        
        if (UNIVERSITY_LIST.length == 0) {
            $http.get('JSON/data.json').then(function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    UNIVERSITY_LIST.push({
                        unitId: data.data[i].unitId,
                        universityName: data.data[i].universityName
                    })
                    if (i == data.data.length - 1) {
                        vm.univList = UNIVERSITY_LIST;
                        vm.dataLoaded = true;
                    }
                }

            })
        } else {
            vm.univList = UNIVERSITY_LIST;
            vm.dataLoaded = true;
        }
        
        
        function selectUniversity($item, $model, $label) {
            UniversitySearchService.fetchUnivData($item).then(function (data) {
                vm.compareList.push(data.data.Item);
                vm.universityList = vm.compareList;
                console.log(vm.universityList);
                if(vm.compareList.length>0){
                    vm.manualSearch = true;
                    filterUniversities();
                }
                else{
                    vm.universityList=[];
                    vm.manualSearch = false;
                    init();
                }

            })
        };

        function removeUniversity(index) {
            vm.compareList.splice(index, 1);
            vm.universityList = vm.compareList;
            console.log(vm.universityList);
            if(vm.compareList.length>0){    
                vm.manualSearch = true;
                filterUniversities();
            }
             else{
                    console.log("here")
                    vm.universityList=[];
                    vm.manualSearch = false;
                    init();
            }
                        
        }
        
    }
})();
