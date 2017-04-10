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
        vm.xAxisFilter = "Total Applicants";
        vm.xAxisOptions =  {"Total Applicants": "applicantsTotal","Enrolled Men": "enrolledMen",  "Enrolled Women":"enrolledWomen", "Price instate": "priceInStateOnCampus","Price outstate": "priceOutStateOnCampus"};
        vm.yAxisFilter = "Percent Admitted";
        vm.yAxisOptions ={"Percent Admitted": "percentAdmittedTotal","Student to Faculty Ratio":"sfr","Total Professor Count": "professorCountTotal", "Federal Grant Awarded (%)": "percentAwardedFederalGrant","Expenses on Research":"expensesResearch"};
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
        var lineChartData=[];
        var conversionChart;
        vm.compareList = [];
        vm.univList = [];
        vm.dataLoaded = false;
        vm.selectUniversity = selectUniversity;
        vm.removeUniversity = removeUniversity;
        vm.manualSearch = false;
        vm.weatherParameter = "Mean Temperature";
        vm.weatherParameters = ["Mean Temperature","Average Snowfall","Average Rainfall","Average Wind"];
        vm.crimeDataVisualization=crimeDataVisualization;
        vm.weatherDataVisuzalization=weatherDataVisuzalization;
        var maxVal=0,minVal=Number.MAX_SAFE_INTEGER;
        

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
            var mapData = [],
                j = 0;
            vm.maxUniversityCount = 0;
            var detailsParameter = vm.yearFilter + "Details";
            console.log(vm.universityList[0].climateData);
            for (var i = 0; i < vm.universityList.length; i++) {
                if (vm.universityList[i].climateData !== undefined &&
                    (parseInt(vm.universityList[i][detailsParameter].priceInStateOffCampus) >= vm.inStateSlider.min &&
                        parseInt(vm.universityList[i][detailsParameter].priceInStateOffCampus) <= vm.inStateSlider.max &&
                        parseInt(vm.universityList[i][detailsParameter].priceOutStateOnCampus) >= vm.outStateSlider.min &&
                        parseInt(vm.universityList[i][detailsParameter].priceOutStateOnCampus) <= vm.outStateSlider.max &&
                        parseInt(vm.universityList[i].climateData.annual.meanTemp) >= vm.meanTempSlider.min &&
                        parseInt(vm.universityList[i].climateData.annual.meanTemp) <= vm.meanTempSlider.max &&
                        parseInt(vm.universityList[i].climateData.annual.maxTemp) >= vm.maxTempSlider.min &&
                        parseInt(vm.universityList[i].climateData.annual.maxTemp) <= vm.maxTempSlider.max &&
                        parseInt(vm.universityList[i].climateData.annual.minTemp) >= vm.minTempSlider.min &&
                        parseInt(vm.universityList[i].climateData.annual.minTemp) <= vm.minTempSlider.max &&
                        parseInt(vm.universityList[i].climateData.annual.avgSnowfall) >= vm.snowfallSlider.min &&
                        parseInt(vm.universityList[i].climateData.annual.avgSnowfall) <= vm.snowfallSlider.max &&
                        parseInt(vm.universityList[i].climateData.annual.avgRainfall) >= vm.rainfallSlider.min &&
                        parseInt(vm.universityList[i].climateData.annual.avgRainfall) <= vm.rainfallSlider.max &&
                        satisfiesState(vm.universityList[i].stateCode)) || vm.manualSearch) {
                    vm.filteredUniversities.push(vm.universityList[i]);
                }

                if (i == vm.universityList.length - 1) {
                    formChoroplethData();
                }
            }

//            for (var key in vm.filteredUniversities[0][detailsParameter]) {
//                if (vm.filteredUniversities[0][detailsParameter].hasOwnProperty(key)) {
//                    vm.xAxisOptions.push(key);
//                    vm.yAxisOptions.push(key);
//                }
//            }
            

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
            d3.select('#chartID').remove();
            vm.filteredUniversities.sort(SortByEnrollment);
            vm.popularUnivList = $filter('limitTo')(vm.filteredUniversities, 10);
            vm.comparisonList = $filter('limitTo')(vm.filteredUniversities, 3);
            vm.renderCharts();
        }

        function crimeDataVisualization(data, dataYear) {
            var renderAtVariable = "crime-container";
            var dataSourceVariable = {
                "chart": {
                    "showvalues": "0",
                    "caption": "Comparison of On Campus Crime Incidents",
                    "numberprefix": "",
                    "xaxisname": "Colleges",
                    "yaxisname": "No of crimes",
                    "showBorder": "0",
                    "bgColor": "#ffffff",
                    "paletteColors": "#9ca089,#f26544,#0075c2,#F4D03F",
                    "canvasBgColor": "#ffffff",
                    "captionFontSize": "14",
                    "subcaptionFontSize": "14",
                    "subcaptionFontBold": "0",
                    "divlineColor": "#999999",
                    "divLineIsDashed": "1",
                    "divLineDashLen": "1",
                    "divLineGapLen": "1",
                    "toolTipColor": "#ffffff",
                    "toolTipBorderThickness": "0",
                    "toolTipBgColor": "#000000",
                    "toolTipBgAlpha": "80",
                    "toolTipBorderRadius": "2",
                    "toolTipPadding": "5",
                    "legendBgColor": "#ffffff",
                    "legendBorderAlpha": '0',
                    "legendShadow": '0',
                    "legendItemFontSize": '10',
                    "legendItemFontColor": '#666666',
                    "theme": "zune"
                },
                "categories": [
                ],
                "dataset": [
                ]
            }

            var category = [];
            var drugViolations = [];
            var others = [];
            var burglary = [];
            var liquorViolations = [];

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                category.push({
                    "label": item.universityName
                });
                var crimeItem;
                for (var j = 0; j < item.crimeStats.length; j++) {
                    if (item.crimeStats[j].year == dataYear) {
                        crimeItem = item.crimeStats[j];
                    }

                }
                var crimeYearItem = crimeItem.crimeInfo;
                drugViolations.push({
                    "value": crimeYearItem.drugViolations
                });
                burglary.push({
                    "value": crimeYearItem.burglary
                });
                liquorViolations.push({
                    "value": crimeYearItem.liquorViolations
                });
                others.push({
                    "value": crimeYearItem.aggravatedAssault + crimeYearItem.arson + crimeYearItem.illegalWeaponsPossession + crimeYearItem.manslaughter + crimeYearItem.murder + crimeYearItem.robbery + crimeYearItem.sexOffenses + crimeYearItem.vehicleTheft
                });
            }
            dataSourceVariable.categories.push({
                category
            });
            var data;
            data = drugViolations;
            dataSourceVariable.dataset.push({
                "seriesname": "Drug Violations",
                data
            });
            data = burglary;
            dataSourceVariable.dataset.push({
                "seriesname": "Burglary",
                data
            });
            data = liquorViolations;
            dataSourceVariable.dataset.push({
                "seriesname": "Liquor Violations",
                data
            });
            data = others;
            dataSourceVariable.dataset.push({
                "seriesname": "Other crimes",
                data
            });
            FusionCharts.ready(function () {
                var analysisChart = new FusionCharts({
                    type: 'scrollstackedcolumn2d',
                    renderAt: 'crime-container',
                    width: '500',
                    height: '350',
                    dataFormat: 'json',
                    dataSource: dataSourceVariable
                }).render(renderAtVariable);
            });


        }

        function weatherDataVisuzalization(compareData,dataYear) {
            console.log(vm.weatherParameter);
            var maxTemp = [];
            var minTemp = [];
            var meanTemp = [];
            var collegesSnowfall = [];
            var collegesRainfall = [];
            var collegesWind = [];
            var collegesTemp = [];

            var item;

            for (var i = 0; i < compareData.length; i++) {
                item = compareData[i];
                collegesTemp[i] = [];
                collegesSnowfall[i] = [];
                collegesRainfall[i] = [];
                collegesWind[i] = [];
                collegesTemp[i].push({
                    "value": item.climateData.fall.meanTemp
                });
                collegesTemp[i].push({
                    "value": item.climateData.winter.meanTemp
                });
                collegesTemp[i].push({
                    "value": item.climateData.spring.meanTemp
                });
                collegesTemp[i].push({
                    "value": item.climateData.summer.meanTemp
                });
                collegesSnowfall[i].push({
                    "value": item.climateData.fall.avgSnowfall
                });
                collegesSnowfall[i].push({
                    "value": item.climateData.winter.avgSnowfall
                });
                collegesSnowfall[i].push({
                    "value": item.climateData.spring.avgSnowfall
                });
                collegesSnowfall[i].push({
                    "value": item.climateData.summer.avgSnowfall
                });
                collegesRainfall[i].push({
                    "value": item.climateData.fall.avgRainfall
                });
                collegesRainfall[i].push({
                    "value": item.climateData.winter.avgRainfall
                });
                collegesRainfall[i].push({
                    "value": item.climateData.spring.avgRainfall
                });
                collegesRainfall[i].push({
                    "value": item.climateData.summer.avgRainfall
                });
                collegesWind[i].push({
                    "value": item.climateData.fall.avgWind
                });
                collegesWind[i].push({
                    "value": item.climateData.winter.avgWind
                });
                collegesWind[i].push({
                    "value": item.climateData.spring.avgWind
                });
                collegesWind[i].push({
                    "value": item.climateData.summer.avgWind
                });
            }



            var dataSourceVariable = {
                "chart": {
                    "caption": "Mean Temperature",
                    "subcaption": "in Fahrenheits",
                    "yaxismaxvalue": "150",
                    "decimals": "2",
                    "numberprefix": "",
                    "numbersuffix": "F",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineAlpha": "100",
                    "paletteColors": "#0075c2,#f26544,#9ca089",
                    "theme": "zune"
                },
                "categories": [{
                    "category": [{
                            "label": "Fall"
                    },
                        {
                            "label": "Winter"
                    },
                        {
                            "label": "Spring"
                    },
                        {
                            "label": "Summer"
                    }
                    ]
                }],
                "dataset": [
                ]
            }
            var data;
            for (var i = 0; i < compareData.length; i++) {
                data = collegesTemp[i];
                item = compareData[i];
                dataSourceVariable.dataset.push({
                    "seriesname": item.universityName,
                    data
                });
            }

            if(vm.weatherParameter=="Mean Temperature"){
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                        type: 'MSColumn2D',
                        renderAt: 'weather-container',
                        width: '600',
                        height: '400',
                        dataFormat: 'json',
                        dataSource: dataSourceVariable
                    })
                    .render();
            });
            }
            var dataSourceVariable2 = {
                "chart": {
                    "caption": "Average Snowfall",
                    "subcaption": "in Inches",
                    "yaxismaxvalue": "20",
                    "decimals": "2",
                    "numberprefix": "",
                    "numbersuffix": "",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineAlpha": "100",
                    "paletteColors": "#0075c2,#f26544,#9ca089",
                    "theme": "zune"
                },
                "categories": [{
                    "category": [{
                            "label": "Fall"
                    },
                        {
                            "label": "Winter"
                    },
                        {
                            "label": "Spring"
                    },
                        {
                            "label": "Summer"
                    }
                    ]
                }],
                "dataset": [
                ]
            }
            for (var i = 0; i < compareData.length; i++) {
                data = collegesSnowfall[i];
                item = compareData[i];
                dataSourceVariable2.dataset.push({
                    "seriesname": item.universityName,
                    data
                });
            }

            if(vm.weatherParameter=="Average Snowfall"){
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                        type: 'MSColumn2D',
                        renderAt: 'weather-container',
                        width: '600',
                        height: '400',
                        dataFormat: 'json',
                        dataSource: dataSourceVariable2
                    })
                    .render();
            });
            }
            var dataSourceVariable3 = {
                "chart": {
                    "caption": "Average Rainfall",
                    "subcaption": "in Inches",
                    "yaxismaxvalue": "15",
                    "decimals": "2",
                    "numberprefix": "",
                    "numbersuffix": "",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineAlpha": "100",
                    "paletteColors": "#0075c2,#f26544,#9ca089",
                    "theme": "zune"
                },
                "categories": [{
                    "category": [{
                            "label": "Fall"
                    },
                        {
                            "label": "Winter"
                    },
                        {
                            "label": "Spring"
                    },
                        {
                            "label": "Summer"
                    }
                    ]
                }],
                "dataset": [
                ]
            }
            for (var i = 0; i < compareData.length; i++) {
                data = collegesRainfall[i];
                item = compareData[i];
                dataSourceVariable3.dataset.push({
                    "seriesname": item.universityName,
                    data
                });
            }
            if(vm.weatherParameter=="Average Rainfall"){
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                        type: 'MSColumn2D',
                        renderAt: 'weather-container',
                        width: '600',
                        height: '400',
                        dataFormat: 'json',
                        dataSource: dataSourceVariable3
                    })
                    .render();
            });
            }
            var dataSourceVariable4 = {
                "chart": {
                    "caption": "Average Wind",
                    "subcaption": "in Inches",
                    "yaxismaxvalue": "20",
                    "decimals": "2",
                    "numberprefix": "",
                    "numbersuffix": "",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineAlpha": "100",
                    "paletteColors": "#0075c2,#f26544,#9ca089",
                    "theme": "zune"
                },
                "categories": [{
                    "category": [{
                            "label": "Fall"
                    },
                        {
                            "label": "Winter"
                    },
                        {
                            "label": "Spring"
                    },
                        {
                            "label": "Summer"
                    }
                    ]
                }],
                "dataset": [
                ]
            }
            for (var i = 0; i < compareData.length; i++) {
                data = collegesWind[i];
                item = compareData[i];
                dataSourceVariable4.dataset.push({
                    "seriesname": item.universityName,
                    data
                });
            }
            if(vm.weatherParameter=="Average Wind"){
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                        type: 'MSColumn2D',
                        renderAt: 'weather-container',
                        width: '600',
                        height: '400',
                        dataFormat: 'json',
                        dataSource: dataSourceVariable4
                    })
                    .render();
            });
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

            /****** Line Chart Code Starts ************/
            FusionCharts.ready(function () {
                 var lineChart = new FusionCharts({
                    type: 'msline',
                    renderAt: 'line-chart-container',
                    width: '90%',
                    height: '500',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "University Comparison",
                            "plotgradientcolor": "",
                            "bgcolor": "FFFFFF",
                            "showalternatehgridcolor": "0",
                            "divlinecolor": "CCCCCC",
                            "showvalues": "0",
                            "showcanvasborder": "0",
                            "canvasborderalpha": "0",
                            "canvasbordercolor": "CCCCCC",
                            "canvasborderthickness": "1",
                            "yaxismaxvalue": maxVal,
                            "yaxisminvalue": minVal,
                            "captionpadding": "30",
                            "linethickness": "3",
                            "yaxisvaluespadding": "15",
                            "legendshadow": "0",
                            "legendPosition": "right",
                            "legendborderalpha": "0",
                            "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78,#9b59b6,#3498db,#34495e,#2ecc71",
                            "showborder": "0"
                        },
                        "categories": [
                            {
                                "category": [
                                    {
                                        "label": "2012",
                                        "stepSkipped": false
                                    },
                                    {
                                        "label": "2013",
                                        "stepSkipped": false
                                    },
                                    {
                                        "label": "2014",
                                        "stepSkipped": false
                                    },
                                    {
                                        "label": "2015",
                                        "stepSkipped": false
                                    }
                                ]
                            }
                        ],
                        "dataset":lineChartData
                    }
                });
                lineChart.render();
            });
            /****** Line Chart Code ENDS ************/
            
            d3.select('#chartID').remove();
            var year = vm.yearFilter + "Details";
            bubbleData = [];
            var univData=[];
            lineChartData = [];
            maxVal=0;
            minVal = Number.MAX_SAFE_INTEGER;
            
            for (var i = 0; i < vm.popularUnivList.length; i++) {
                bubbleData[i] = {
                    x: parseInt(vm.popularUnivList[i][year][vm.xAxisOptions[vm.xAxisFilter]]),
                    y: parseInt(vm.popularUnivList[i][year][vm.yAxisOptions[vm.yAxisFilter]]),
                    size: parseInt(vm.popularUnivList[i][year].admissionsTotal),
                    c: i + 1,
                    name: vm.popularUnivList[i].universityName,
                    alias: vm.popularUnivList[i].alias

                };

                /****** Line Chart Code STARTS************/
                if(maxVal< parseInt(vm.popularUnivList[i]['2012Details'].admissionsTotal)){
                    maxVal =  parseInt(vm.popularUnivList[i]['2012Details'].admissionsTotal)
                }
                if(maxVal< parseInt(vm.popularUnivList[i]['2013Details'].admissionsTotal)){
                    maxVal =  parseInt(vm.popularUnivList[i]['2013Details'].admissionsTotal)
                }
                if(maxVal< parseInt(vm.popularUnivList[i]['2014Details'].admissionsTotal)){
                    maxVal =  parseInt(vm.popularUnivList[i]['2014Details'].admissionsTotal)
                }
                if(maxVal <  parseInt(vm.popularUnivList[i]['2015Details'].admissionsTotal)){
                    
                    maxVal =  parseInt(vm.popularUnivList[i]['2015Details'].admissionsTotal)
                }
                
                
                if(minVal> parseInt(vm.popularUnivList[i]['2012Details'].admissionsTotal)){
                    minVal =  parseInt(vm.popularUnivList[i]['2012Details'].admissionsTotal)
                }
                if(minVal> parseInt(vm.popularUnivList[i]['2013Details'].admissionsTotal)){
                    minVal =  parseInt(vm.popularUnivList[i]['2013Details'].admissionsTotal)
                }
                if(minVal> parseInt(vm.popularUnivList[i]['2014Details'].admissionsTotal)){
                    minVal =  parseInt(vm.popularUnivList[i]['2014Details'].admissionsTotal)
                }
                if(minVal >  parseInt(vm.popularUnivList[i]['2015Details'].admissionsTotal)){
                    
                    minVal =  parseInt(vm.popularUnivList[i]['2015Details'].admissionsTotal)
                }
                
                
                
                lineChartData[i] = {"seriesname":vm.popularUnivList[i].universityName,
                                     "data":[{"value" : parseInt(vm.popularUnivList[i]['2012Details'].admissionsTotal)},
                                            {"value" : parseInt(vm.popularUnivList[i]['2013Details'].admissionsTotal)},
                                            {"value" : parseInt(vm.popularUnivList[i]['2014Details'].admissionsTotal)},
                                            {"value" : parseInt(vm.popularUnivList[i]['2015Details'].admissionsTotal)}]};
                
            
                /****** Line Chart Code ENDS ************/
                
                if (bubbleData[i].alias == undefined || bubbleData[i].alias == "NA") {
                    bubbleData[i].alias = bubbleData[i].name;
                } else {
                    var shortName = []
                    var minLength;
                    shortName = bubbleData[i].alias.split("|");
                    shortName = shortName.filter(function (str) {
                        return /\S/.test(str);
                    });
                    shortName.map(Function.prototype.call, String.prototype.trim);
                    minLength = (Math.min.apply(Math, shortName.map(function (str) {
                        return str.length;
                    })));

                    bubbleData[i].alias = shortName.slice().sort((a, b) => b.length - a.length).pop();
                }

            }
           
            crimeDataVisualization(vm.comparisonList, vm.yearFilter);
            weatherDataVisuzalization(vm.comparisonList, vm.yearFilter);
            renderBubbleChart(bubbleData);

        }

        init();

        function init() {
            vm.initializeSliders();

            if (UniversitySearchService.cleanUniversityList.length > 0) {
                vm.universityList = UniversitySearchService.cleanUniversityList;
                formUnivNameList();
                filterUniversities();
            } else {
                UniversitySearchService.fetchAllUniversities().then(function (data) {
                    vm.universityList = data;
                    formUnivNameList();
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

            if (data.length == 1) {

                var x = d3.scale.linear()
                    .domain([d3.max(data, function (d) {
                        return d.x;
                    }) - ((d3.max(data, function (d) {
                       return d.x;
                   }))/10), d3.max(data, function (d) {
                        return d.x;
                    })+(d3.max(data, function (d) {
                       return d.x;
                   }))/10])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([d3.max(data, function (d) {
                        return d.y;
                    }) - ((d3.min(data, function (d) {
                       return d.y;
                   }))/10), d3.max(data, function (d) {
                        return d.y;
                    })+(d3.max(data, function (d) {
                       return d.y;
                   }))/10])
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
            } else {
               var x = d3.scale.linear()
                   .domain([d3.min(data, function (d) {
                       return d.x;
                   })-((d3.min(data, function (d) {
                       return d.x;
                   }))/10), d3.max(data, function (d) {
                       return d.x;
                   })+(d3.max(data, function (d) {
                       return d.x;
                   }))/10])
                   .range([0, width]);

               var y = d3.scale.linear()
                   .domain([d3.min(data, function (d) {
                       return d.y;
                   })-((d3.min(data, function (d) {
                       return d.y;
                   }))/10), (d3.max(data, function (d) {
                       return d.y;
                   }))+(d3.max(data, function (d) {
                       return d.y;
                   }))/10])
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
                .delay(function (d, i) {
                    return x(d.x) - y(d.y);
                })
                .duration(500)
                .attr("cx", function (d) {
                    return x(d.x);
                })
                .attr("cy", function (d) {
                    return y(d.y);
                })
                .ease("bounce");

            node.append("text")
                .attr("text-anchor", "middle")
                .attr("dx", function (d) {
                    return x(d.x);
                })
                .attr("dy", function (d) {
                    return y(d.y);
                })
                .text(function (d) {
                    return d.alias;
                });

            function fade(c, opacity, bubble) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(bubble.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
                svg.selectAll("circle,text")
                    .filter(function (d) {
                        if (d != undefined)
                            return d.c != c;
                    })
                    .transition()

                    .style("opacity", opacity);
            }

            function fadeOut() {
                svg.selectAll("circle,text").transition().style("opacity", function (d) {
                    if (d != undefined)
                        opacity(d.size);
                });
            }
        }


        /****** Code for search bar *******/

        function formUnivNameList() {
            for (var i = 0; i < vm.universityList.length; i++) {
                vm.univList.push({
                    unitId: vm.universityList[i].unitId,
                    universityName: vm.universityList[i].universityName
                })
            }
        }

        function selectUniversity($item, $model, $label) {
            UniversitySearchService.fetchUnivData($item).then(function (data) {
                vm.compareList.push(data.data.Item);
                vm.universityList = vm.compareList;
                vm.manualSearch = true;
                filterUniversities();
            })
        };

        function removeUniversity(index) {
            vm.compareList.splice(index, 1);
            vm.universityList = vm.compareList;
            if (vm.compareList.length > 0) {
                vm.manualSearch = true;
                filterUniversities();
            } else {
                vm.universityList = [];
                vm.manualSearch = false;
                init();
            }
        }
    }
})();
