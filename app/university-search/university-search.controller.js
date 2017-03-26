(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch', [])
        .controller('UniversitySearchCtrl', UniversitySearchCtrl);

    UniversitySearchCtrl.$inject = ['$http', 'UniversitySearchService'];

    /* @ngInject */
    function UniversitySearchCtrl($http, UniversitySearchService) {
        var vm = this;
        vm.message = 'Hello from University Search page';
        vm.university = "";
        vm.name = "melroy";
        
        //UniversitySearchService.fetchUnivData().then(function(data){
        //    vm.university = data.data.Item;
        //    //console.log(vm.university);
        //
        //    if(vm.university.errorMessage){
        //        alert(vm.university.errorMessage);
        //    }
        //
        //    drawLineChart(vm.university);
        //})
        drawLineChart(vm.university);

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


            var data = {};

            data=[{'date': 2012, 'frequency': 26425},
            {'date': 2013, 'frequency': 17465},
            {'date': 2014, 'frequency': 19042},
            {'date': 2015, 'frequency': 21042}];


            for(var i=0;i<4;i++){

                data[i].date=parseTime(data[i].date);
                data[i].frequency = +data[i].frequency;
            }

                console.log(data);

                x.domain(d3.extent(data, function(d) { return d.date; }));
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
