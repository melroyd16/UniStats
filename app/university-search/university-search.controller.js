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
        vm.filteredUniversities = [];
        vm.stateUnivCountData = {};

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
                    vm.renderCharts();
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
            for(var i = 0; i < vm.stateUnivCountData.length; i++){
                vm.stateUnivCountData[i]["id"] = vm.stateUnivCountData[i]["key"];
                delete vm.stateUnivCountData[i]["key"];
            }
        }

        function renderCharts() {
            FusionCharts.ready(function () {
                var conversionChart = new FusionCharts({
                    type: 'bubble',
                    renderAt: 'bubble-chart-container',
                    width: '600',
                    height: '400',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "Analyis of universities in Arizona",
                            "subcaption": vm.yearFilter,
                            "xAxisMinValue": "0",
                            "xAxisMaxValue": "100",
                            "yAxisMinValue": "0",
                            "yAxisMaxValue": "30000",
                            "plotFillAlpha": "70",
                            "plotFillHoverColor": "#6baa01",
                            "showPlotBorder": "0",
                            "xAxisName": "Tuition amount",
                            "yAxisName": "No. Of Crimes",
                            "numDivlines": "2",
                            "showValues": "1",
                            "showTrendlineLabels": "0",
                            "plotTooltext": "$name : Profit Contribution - $zvalue%",
                            "drawQuadrant": "1",
                            "quadrantLineAlpha": "80",
                            "quadrantLineThickness": "3",
                            "quadrantXVal": "50",
                            "quadrantYVal": "15000",
                            //Quadrant Labels
                            "quadrantLabelTL": "Low Price / High Sale",
                            "quadrantLabelTR": "High Price / High Sale",
                            "quadrantLabelBL": "Low Price / Low Sale",
                            "quadrantLabelBR": "High Price / Low Sale",

                            //Cosmetics
                            "baseFontColor": "#333333",
                            "baseFont": "Helvetica Neue,Arial",
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "showBorder": "0",
                            "bgColor": "#ffffff",
                            "showShadow": "0",
                            "canvasBgColor": "#ffffff",
                            "canvasBorderAlpha": "0",
                            "divlineAlpha": "100",
                            "divlineColor": "#999999",
                            "divlineThickness": "1",
                            "divLineIsDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "use3dlighting": "0",
                            "showplotborder": "0",
                            "showYAxisLine": "1",
                            "yAxisLineThickness": "1",
                            "yAxisLineColor": "#999999",
                            "showXAxisLine": "1",
                            "xAxisLineThickness": "1",
                            "xAxisLineColor": "#999999",
                            "showAlternateHGridColor": "0",
                            "showAlternateVGridColor": "0"

                        },
                        "categories": [
                            {
                                "category": [
                                    {
                                        "label": "$0",
                                        "x": "0"
                                },
                                    {
                                        "label": "$20",
                                        "x": "20",
                                        "showverticalline": "1"
                                },
                                    {
                                        "label": "$40",
                                        "x": "40",
                                        "showverticalline": "1"
                                },
                                    {
                                        "label": "$60",
                                        "x": "60",
                                        "showverticalline": "1"
                                },
                                    {
                                        "label": "$80",
                                        "x": "80",
                                        "showverticalline": "1"
                                }, {
                                        "label": "$100",
                                        "x": "100",
                                        "showverticalline": "1"
                                }
                            ]
                        }
                    ],
                        "dataset": [
                            {
                                "color": "#00aee4",
                                "data": [
                                    {
                                        "x": "80",
                                        "y": "15000",
                                        "z": "24",
                                        "name": "University Of Arizona"
                                },
                                    {
                                        "x": "60",
                                        "y": "18500",
                                        "z": "26",
                                        "name": "University Of Phoenix"
                                },
                                    {
                                        "x": "50",
                                        "y": "19450",
                                        "z": "19",
                                        "name": "Grand Canyon University"
                                },
                                    {
                                        "x": "65",
                                        "y": "10500",
                                        "z": "8",
                                        "name": "Northern Arizona University"
                                },
                                    {
                                        "x": "43",
                                        "y": "8750",
                                        "z": "5",
                                        "name": "Mid Western University"
                                },
                                    {
                                        "x": "32",
                                        "y": "22000",
                                        "z": "10",
                                        "name": "Rio Salado COllege"
                                },
                                    {
                                        "x": "44",
                                        "y": "13000",
                                        "z": "9",
                                        "name": "Central Arizona College"
                                }
                            ]
                        }
                    ]
                    }
                });
                conversionChart.render();
            });

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
                            "gradient": "1",
                            "startLabel": "Low",
                            "endLabel": "High",
                            "code": "#1a8cff",
                            "minvalue": "0",
                            "maxValue": "100"
                        },
                        "data": vm.stateUnivCountData
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
    }
})();
