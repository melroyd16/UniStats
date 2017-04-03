(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversityCompare', [])
        .controller('UniversityCompareCtrl', UniversityCompareCtrl);

    UniversityCompareCtrl.$inject = ['$http', 'UniversityCompareService'];

    /* @ngInject */
    function UniversityCompareCtrl($http, UniversityCompareService) {
        var vm = this;
        vm.univList = [];
        vm.compareList = [];
        vm.dataLoaded = false;
        vm.year = 2012
        vm.selectUniversity = selectUniversity;
        vm.removeUniversity = removeUniversity;
        vm.crimeDataVisualization = crimeDataVisualization;

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
            UniversityCompareService.fetchUnivData($item).then(function (data) {
                vm.compareList.push(data.data.Item);
                d3.selectAll("svg > *").remove();
                d3.selectAll('#dashboard svg').remove();
                d3.selectAll('#dashboard table').remove();
                console.log(vm.compareList);
                //formatUnivDataMultiple(vm.compareList);
                crimeDataVisualization(vm.compareList, vm.year);
                weatherDataVisuzalization(vm.compareList, vm.year);
            })
        };

        function removeUniversity(index) {
            vm.compareList.splice(index, 1);
            d3.selectAll("svg > *").remove();
            d3.selectAll('#dashboard svg').remove();
            d3.selectAll('#dashboard table').remove();
            if(vm.compareList.length){
                //formatUnivDataMultiple(vm.compareList);
                crimeDataVisualization(vm.compareList, vm.year); 
                weatherDataVisuzalization(vm.compareList, vm.year);
            }   
        }
        
        function weatherDataVisuzalization(compareData, dataYear){
            console.log("Alan");
            var maxTemp = [];
            var minTemp = [];
            var meanTemp = [];
            var collegesSnowfall = [];
            var collegesRainfall= [];
            var collegesWind = [];
            var collegesTemp = [];
            
            var item;
            
            for (var i = 0; i < compareData.length; i++) {
                item = compareData[i];
                collegesTemp[i]=[];
                collegesSnowfall[i]=[];
                collegesRainfall[i]=[];
                collegesWind[i]=[];
                collegesTemp[i].push({"value": item.climateData.fall.meanTemp});
                collegesTemp[i].push({"value": item.climateData.winter.meanTemp});
                collegesTemp[i].push({"value": item.climateData.spring.meanTemp});
                collegesTemp[i].push({"value": item.climateData.summer.meanTemp});
                collegesSnowfall[i].push({"value": item.climateData.fall.avgSnowfall});
                collegesSnowfall[i].push({"value": item.climateData.winter.avgSnowfall});
                collegesSnowfall[i].push({"value": item.climateData.spring.avgSnowfall});
                collegesSnowfall[i].push({"value": item.climateData.summer.avgSnowfall});
                collegesRainfall[i].push({"value": item.climateData.fall.avgRainfall});
                collegesRainfall[i].push({"value": item.climateData.winter.avgRainfall});
                collegesRainfall[i].push({"value": item.climateData.spring.avgRainfall});
                collegesRainfall[i].push({"value": item.climateData.summer.avgRainfall});
                collegesWind[i].push({"value": item.climateData.fall.avgWind});
                collegesWind[i].push({"value": item.climateData.winter.avgWind});
                collegesWind[i].push({"value": item.climateData.spring.avgWind});
                collegesWind[i].push({"value": item.climateData.summer.avgWind});
             }
    
            
            
            var dataSourceVariable={
                "chart": {
                    "caption": "Seasonal Temperatures",
                    "subcaption": "in Fahrenheits",
                    "yaxismaxvalue": "150",
                    "decimals": "0",
                    "numberprefix": "",
                    "numbersuffix": "F",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineColor": "#cc3300",
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
        var dataSourceVariable2={
                "chart": {
                    "caption": "Average Snowfall",
                    "subcaption": "in Inches",
                    "yaxismaxvalue": "20",
                    "decimals": "0",
                    "numberprefix": "",
                    "numbersuffix": "",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineColor": "#cc3300",
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
            
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                type: 'MSColumn2D',
                renderAt: 'snowfall-container',
                width: '600',
                height: '400',
                dataFormat: 'json',
                dataSource: dataSourceVariable2
})
    .render();              
});
            var dataSourceVariable3={
                "chart": {
                    "caption": "Average Rainfall",
                    "subcaption": "in Inches",
                    "yaxismaxvalue": "20",
                    "decimals": "0",
                    "numberprefix": "",
                    "numbersuffix": "",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineColor": "#cc3300",
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
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                type: 'MSColumn2D',
                renderAt: 'rainfall-container',
                width: '600',
                height: '400',
                dataFormat: 'json',
                dataSource: dataSourceVariable3
})
    .render();              
});
            var dataSourceVariable4={
                "chart": {
                    "caption": "Average Wind",
                    "subcaption": "in Inches",
                    "yaxismaxvalue": "20",
                    "decimals": "0",
                    "numberprefix": "",
                    "numbersuffix": "",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "50",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineColor": "#cc3300",
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
            FusionCharts.ready(function () {
                var salesChart = new FusionCharts({
                type: 'MSColumn2D',
                renderAt: 'wind-container',
                width: '600',
                height: '400',
                dataFormat: 'json',
                dataSource: dataSourceVariable4
})
    .render();              
});
        }
        function crimeDataVisualization(data, dataYear) {
            var renderAtVariable = "chart-container";
            var dataSourceVariable = {
                "chart": {
                    "showvalues": "0",
                    "caption": "Comparison of On Campus Crime Incidents",
                    "numberprefix": "",
                    "xaxisname": "Colleges",
                    "yaxisname": "No of crimes",
                    "showBorder": "0",
                    "paletteColors": "#0075c2,#f2c500,#d35400,#196F3D",
                    "bgColor": "#ffffff",
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
                    "legendItemFontColor": '#666666'
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
                    renderAt: 'chart-container',
                    width: '500',
                    height: '350',
                    dataFormat: 'json',
                    dataSource: dataSourceVariable
                }).render(renderAtVariable);
            });


        }

        function formatUnivData(data) {

            var univData = {};
            univData = [{
                    'date': '2012',
                    'frequency': parseInt(data['2012Details'].admissionsTotal)
                },
                {
                    'date': '2013',
                    'frequency': parseInt(data['2013Details'].admissionsTotal)
                },
                {
                    'date': '2014',
                    'frequency': parseInt(data['2014Details'].admissionsTotal)
                },
                {
                    'date': '2015',
                    'frequency': parseInt(data['2015Details'].admissionsTotal)
                }];
            drawLineChart(univData);
        }

        function formatUnivDataMultiple(data) {

            var univData = {};
            var admissionsComp = [];
            univData = [{
                    'date': '2012'
                },
                {
                    'date': '2013'
                },
                {
                    'date': '2014'
                },
                {
                    'date': '2015'
                }];

            for (var i = 0; i < data.length; i++) {
                var key = data[i].universityName;
                univData[0][key] = parseInt(data[i]['2012Details'].admissionsTotal);
                univData[1][key] = parseInt(data[i]['2013Details'].admissionsTotal);
                univData[2][key] = parseInt(data[i]['2014Details'].admissionsTotal);
                univData[3][key] = parseInt(data[i]['2015Details'].admissionsTotal);
            }
            
            for(var j=0;j<data.length;j++){
                admissionsComp[j]={university:data[j].universityName,freq:{men:data[j]['2012Details'].admissionsMen, women:data[j]['2012Details'].admissionsWomen}};
            }
            
            drawMultiLineChart(univData);
            if(data.length>1){
                dashboard('#dashboard',admissionsComp);
            }       
        }

        function drawLineChart(data) {


            var svg = d3.select("svg"),
                margin = {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 50
                },
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var parseTime = d3.timeParse("%Y");

            var x = d3.scaleTime()
                .rangeRound([0, width]);

            // var x = d3.scaleOrdinal().rangePoints([0, width]);

            //.range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"])
            //        .domain(d3.range(0,7));

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var line = d3.line()
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.frequency);
                });


            for (var i = 0; i < 4; i++) {

                data[i].date = parseTime(data[i].date);
                data[i].frequency = +data[i].frequency;
            }

            x.domain(d3.extent(data, function (d) {
                return d.date
            }));
            //x.domain(data.map(function(d) { return d.date; }));

            y.domain([1000, d3.max(data, function (d) {
                return d.frequency;
            })]);

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .select(".domain")


            g.append("g")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "1em")
                .attr("text-anchor", "end")
                .text("Admissions");

            g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        }

        function drawMultiLineChart(data) {
            var svg = d3.select("svg"),
                margin = {
                    top: 20,
                    right: 80,
                    bottom: 30,
                    left: 50
                },
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var parseTime = d3.timeParse("%Y");

            var x = d3.scaleTime().range([0, width]),
                y = d3.scaleLinear().range([height, 0]),
                z = d3.scaleOrdinal(d3.schemeCategory10);

            var line = d3.line()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.frequency);
                });

            for (var i = 0; i < data.length; i++) {
                data[i].date = parseTime(data[i].date);
                //   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            }
            var universities = [];
            var values = []
            for (var i = 0; i < data.length; i++) {
                var j = 0;
                for (var key in data[i]) {

                    if (data[i].hasOwnProperty(key)) {

                        if (key != 'date') {
                            var id = key;
                            data[0][id] = +data[0][id];
                            data[1][id] = +data[1][id];
                            data[2][id] = +data[2][id];
                            data[3][id] = +data[3][id];

                            universities[j] = {
                                id: key,
                                values: [{
                                        date: data[0]['date'],
                                        frequency: data[0][id]
                                    },
                                    {
                                        date: data[1]['date'],
                                        frequency: data[1][id]
                                    },
                                    {
                                        date: data[2]['date'],
                                        frequency: data[2][id]
                                    },
                                    {
                                        date: data[3]['date'],
                                        frequency: data[3][id]
                                    }]
                            };
                            j++;
                        }
                    }
                }
            }

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            y.domain([
                    d3.min(universities, function (c) {
                    return d3.min(c.values, function (d) {
                        return d.frequency;
                    });
                }),
                    d3.max(universities, function (c) {
                    return d3.max(c.values, function (d) {
                        return d.frequency;
                    });
                })
                ]);

            z.domain(universities.map(function (c) {
                return c.id;
            }));

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Total Admissions");

            var university = g.selectAll(".university")
                .data(universities)
                .enter().append("g")
                .attr("class", "university");

            university.append("path")
                .attr("class", "line")
                .attr("d", function (d) {
                    return line(d.values);
                })
                .style("stroke", function (d) {
                    return z(d.id);
                });

            university.append("text")
                .datum(function (d) {
                    return {
                        id: d.id,
                        value: d.values[d.values.length - 1]
                    };
                })
                .attr("transform", function (d) {
                    return "translate(" + x(d.value.date) + "," + y(d.value.frequency) + ")";
                })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "10px sans-serif")
                .text(function (d) {
                    return d.id;
                });
        }
        
        function dashboard(id, data){
    var barColor = 'steelblue';
    function segColor(c){ return {men:"#807dba", women:"#e08214"}[c]; }
    
    // compute total for each university.
        
    data.forEach(function(d){d.total=parseInt(d.freq.men)+parseInt(d.freq.women);});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},  hGDim = {t: 20, r: 20, b: 30, l: 50};
        hGDim.w = 500 - hGDim.l - hGDim.r, 
        hGDim.h = 300 - hGDim.t - hGDim.b;
        
        console.log(fD);
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");
        
//        var svg = d3.select("svg"),
//                margin = {top: 20, right: 20, bottom: 30, left: 50},
//                width = +svg.attr("width") - margin.left - margin.right,
//                height = +svg.attr("height") - margin.top - margin.bottom,
//                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // create function for x-axis mapping.
//        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
//                .domain(fD.map(function(d) { console.log(d[0]); return d[0]; }));

        for(var i = 0;i<fD.length;i++){
            fD[i][0] = fD[i][0].split(" ").join("\n");
        }
        console.log(fD);
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { console.log(d[0]); return d[0]; }));

        console.log(hGDim);
        // Add x-axis to the histogram svg.
//        hGsvg.append("g").attr("class", "x axis")
//            .attr("transform", "translate(0," + hGDim.h + ")")
//            .call(d3.svg.axis().scale(x).orient("bottom"));

        
        hGsvg.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(90," + hGDim.h + ")")
                    .call(d3.axisBottom(x));
        
        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        console.log(x.rangeBand());
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { console.log(x(d[0])+ ", "+ x.rangeBand()/2);return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { console.log(y(d[1])-5); return y(d[1])-5; })
            .attr("text-anchor", "middle");
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected university.
            var st = data.filter(function(s){ return s.university == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.   
            pC.update(tF);
            leg.update(tF);
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            var normalisedData = [];
            var mean=0,stdDev=0;
            for(var i=0;i<nD.length;i++){
                normalisedData[i] = parseInt(nD[i][1]);
                nD[i][1] = parseInt(nD[i][1]);
                mean+=normalisedData[i];
            }
            
            console.log(normalisedData); 
            
            mean = mean/nD.length;
            stdDev = d3.deviation(normalisedData);
            
            console.log(mean + " " + stdDev);
            
            y.domain([0, d3.max(nD, function(d) { console.log(d[1]);return d[1]; })]);

            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1])})
                .attr("height", function(d) {
                
                console.log((Math.abs(y(d[1])-mean)*hGDim.h )/stdDev);
                return (hGDim.h - y(d[1])); 
                //return hGDim.h-(Math.abs(y(d[1])-mean)*hGDim.h )/stdDev;                            
                                            })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return (y(d[1])-5); });            
        }        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(data.map(function(v){ 
                return [v.university,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(data.map(function(v){
                return [v.university,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        }
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all university.
    var tF = ['men','women'].map(function(d){ 
        return {type:d, freq: d3.sum(data.map(function(t){ return t.freq[d];}))}; 
    });    
    
    // calculate total frequency by university for all segment.
    var sF = data.map(function(d){return [d.university,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}



    }
})();
