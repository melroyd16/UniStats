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
        vm.year=2012
        vm.selectUniversity = selectUniversity;
        vm.removeUniversity = removeUniversity;
        vm.crimeDataCalling = crimeDataCalling;
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
                        console.log(true);
                    }
                }

            })
        } else {
            vm.univList = UNIVERSITY_LIST;
            vm.dataLoaded = true;
        }

        function selectUniversity($item, $model, $label) {
            UniversityCompareService.fetchUnivData($item).then(function(data){
                vm.compareList.push(data.data.Item);
                console.log(vm.compareList);
                formatUnivData(vm.compareList[0]);
            })
        };
        
        function crimeDataCalling(){
            console.log("Alan");
            crimeDataVisualization(vm.compareList,vm.year);
        }
        function removeUniversity(index){
            vm.compareList.splice(index, 1);
            d3.selectAll("svg > *").remove();
        }
        
        function crimeDataVisualization(data,dataYear){
            var renderAtVariable = "chart-container";
            var dataSourceVariable = {
                "chart": {
                "showvalues": "0",
                "caption": "Comparison of On Campus Crime Incidents",
                "numberprefix": "",
                "xaxisname": "Colleges",
                "yaxisname": "No of crimes",
                "showBorder": "0",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#9b59b6,#f1C40f,#c39bd3,#f5cba7,#73c6b6,#7fb3d5,#d35400,#196F3D",
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
            var aggravatedAssault = [];
            var arson = [];
            var burglary = [];
            var illegalWeaponsPossession = [];
            var liquorViolations = [];
            var manslaughter = [];
            var murder = [];
            var robbery = [];
            var sexOffenses = [];
            var vehicleTheft = [];
        
            for(var i=0;i<data.length;i++){
                var item=data[i];
                console.log(item.universityName)
                category.push({"label": item.universityName });
                var crimeItem;
                for(var j=0;j<item.crimeStats.length;j++){
                    if(item.crimeStats[j].year==dataYear){
                        crimeItem=item.crimeStats[j];   
                    }
                    
                }
                var crimeYearItem=crimeItem.crimeInfo;
                drugViolations.push({"value": crimeYearItem.drugViolations});
                aggravatedAssault.push({"value": crimeYearItem.aggravatedAssault});
                arson.push({"value": crimeYearItem.arson});
                burglary.push({"value": crimeYearItem.burglary});
                illegalWeaponsPossession.push({"value": crimeYearItem.illegalWeaponsPossession});
                liquorViolations.push({"value": crimeYearItem.liquorViolations});
                manslaughter.push({"value": crimeYearItem.manslaughter});
                murder.push({"value": crimeYearItem.murder});
                robbery.push({"value": crimeYearItem.robbery});
                sexOffenses.push({"value": crimeYearItem.sexOffenses});
                vehicleTheft.push({"value": crimeYearItem.vehicleTheft});
            }
            dataSourceVariable.categories.push({category});
            var data;
            data=drugViolations;
            dataSourceVariable.dataset.push({"seriesname": "Drug Violations",data});
            data=aggravatedAssault;
            dataSourceVariable.dataset.push({"seriesname": "Aggravated Assault",data});
            data=arson;
            dataSourceVariable.dataset.push({"seriesname": "Arson",data});
            data=burglary;
            dataSourceVariable.dataset.push({"seriesname": "Burglary",data});
            data=illegalWeaponsPossession;
            dataSourceVariable.dataset.push({"seriesname": "Illegal Weapons Possession",data});
            data=liquorViolations;
            dataSourceVariable.dataset.push({"seriesname": "Liquor Violations",data});
            data=manslaughter;
            dataSourceVariable.dataset.push({"seriesname": "Man slaughter",data});
            data=murder;
            dataSourceVariable.dataset.push({"seriesname": "murder",data});
            data=murder;
            dataSourceVariable.dataset.push({"seriesname": "murder",data});
            data=robbery;
            dataSourceVariable.dataset.push({"seriesname": "Robbery",data});
            data=sexOffenses;
            dataSourceVariable.dataset.push({"seriesname": "Sex Offenses",data});
            data=vehicleTheft;
            dataSourceVariable.dataset.push({"seriesname": "Vehicle Theft",data});
            FusionCharts.ready(function () {
            var analysisChart = new FusionCharts({
        type: 'stackedColumn3DLine',
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

            univData=[{'date': 2012, 'frequency': parseInt(data['2012Details'].admissionsTotal)},
            {'date': 2013, 'frequency': parseInt(data['2013Details'].admissionsTotal)},
            {'date': 2014, 'frequency': parseInt(data['2014Details'].admissionsTotal)},
            {'date': 2015, 'frequency': parseInt(data['2015Details'].admissionsTotal)}];

            drawLineChart(univData);
        }


        function drawLineChart(data) {


            var svg = d3.select("svg"),
                margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var parseTime = d3.timeParse("%Y");

            var x = d3.scaleTime()
                .rangeRound([0, width]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var line = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.frequency); });


            for(var i=0;i<4;i++){

                data[i].date=parseTime(data[i].date);
                data[i].frequency = +data[i].frequency;
            }

            console.log(data);

            x.domain(d3.extent(data, function(d) { return d.date}));
            y.domain([1000, d3.max(data, function(d) { return d.frequency; })]);

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
    }
})();
