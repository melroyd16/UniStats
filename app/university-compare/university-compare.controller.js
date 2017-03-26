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
        vm.selectUniversity = selectUniversity;
        vm.removeUniversity = removeUniversity;

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
        
        function removeUniversity(index){
            vm.compareList.splice(index, 1);
            d3.selectAll("svg > *").remove();
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


            //var data = {};
            //
            //data=[{'date': 2012, 'frequency': 26425},
            //    {'date': 2013, 'frequency': 17465},
            //    {'date': 2014, 'frequency': 19042},
            //    {'date': 2015, 'frequency': 21042}];


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
