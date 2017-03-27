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
                //formatUnivData(vm.compareList[0]);
                d3.selectAll("svg > *").remove();
                formatUnivDataMultiple(vm.compareList);
            })
        };
        
        function removeUniversity(index){
            vm.compareList.splice(index, 1);
            d3.selectAll("svg > *").remove();
            if(vm.compareList.length)
                formatUnivDataMultiple(vm.compareList);
        }

        function formatUnivData(data) {

            var univData = {};

            univData=[{'date': '2012', 'frequency': parseInt(data['2012Details'].admissionsTotal)},
            {'date': '2013', 'frequency': parseInt(data['2013Details'].admissionsTotal)},
            {'date': '2014', 'frequency': parseInt(data['2014Details'].admissionsTotal)},
            {'date': '2015', 'frequency': parseInt(data['2015Details'].admissionsTotal)}];

            drawLineChart(univData);
        }

        function formatUnivDataMultiple(data) {

            var univData = {};
            univData = [{'date': '2012'},
                {'date': '2013'},
                {'date': '2014'},
                {'date': '2015'}];

            for(var i=0;i<data.length;i++) {
                var key=data[i].universityName;
                univData[0][key]= parseInt(data[i]['2012Details'].admissionsTotal);
                univData[1][key]= parseInt(data[i]['2013Details'].admissionsTotal);
                univData[2][key]= parseInt(data[i]['2014Details'].admissionsTotal);
                univData[3][key]= parseInt(data[i]['2015Details'].admissionsTotal);
            }
            drawMultiLineChart(univData);

            console.log(univData);
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

           // var x = d3.scaleOrdinal().rangePoints([0, width]);

        //.range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"])
        //        .domain(d3.range(0,7));

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
            //x.domain(data.map(function(d) { return d.date; }));

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

        function drawMultiLineChart(data) {
            var svg = d3.select("svg"),
                margin = {top: 20, right: 80, bottom: 30, left: 50},
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var parseTime = d3.timeParse("%Y");

            var x = d3.scaleTime().range([0, width]),
                y = d3.scaleLinear().range([height, 0]),
                z = d3.scaleOrdinal(d3.schemeCategory10);

            var line = d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.frequency); });


                console.log(data);

            for(var i=0;i<data.length;i++) {
                data[i].date = parseTime(data[i].date);
             //   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            }
            var universities = [];
            var values=[]
            for(var i=0;i<data.length;i++){
                var j=0;
                for (var key in data[i]) {

                    if (data[i].hasOwnProperty(key)) {
                        console.log(key + " -> " + data[i][key]);

                        if(key!='date') {
                            var id = key;
                            data[0][id]=+data[0][id];
                            data[1][id]=+data[1][id];
                            data[2][id]=+data[2][id];
                            data[3][id]=+data[3][id];

                            universities[j]={id: key,values:[{date:data[0]['date'],frequency:data[0][id]},
                                {date:data[1]['date'],frequency:data[1][id]},
                                {date:data[2]['date'],frequency:data[2][id]},
                                {date:data[3]['date'],frequency:data[3][id]}]};
                            j++;
                        }
                    }

                }

            }

                console.log(universities);

                x.domain(d3.extent(data, function(d) { return d.date; }));

                y.domain([
                    d3.min(universities, function(c) { return d3.min(c.values, function(d) { return d.frequency; }); }),
                    d3.max(universities, function(c) { return d3.max(c.values, function(d) { return d.frequency; }); })
                ]);

                z.domain(universities.map(function(c) { return c.id; }));

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
                    .attr("d", function(d) { return line(d.values); })
                    .style("stroke", function(d) { return z(d.id); });

                university.append("text")
                    .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
                    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.frequency) + ")"; })
                    .attr("x", 3)
                    .attr("dy", "0.35em")
                    .style("font", "10px sans-serif")
                    .text(function(d) { return d.id; });
            //});


        }
    }
})();
