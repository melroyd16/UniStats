(function () {
    'use strict';

    angular
        .module('UnistatsApp.Home', [])
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$http'];

    /* @ngInject */
    function HomeCtrl($http) {
        var vm = this;
        vm.message = 'Hello from home page';
        vm.populateData = populateData;
        vm.getUniversityNames = getUniversityNames;

        function populateData() {
            $http.get('JSON/data.json').then(function (data) {
                for (var i = 1801; i < data.data.length; i++) {
                    var payload = {
                        operation: "populateData",
                        populatePayload: {
                            TableName: "University",
                            Item: data.data[i]
                        }
                    }
                    $http.post(UNIVERSITY_DETAILS_API, payload).then(function (data) {
                        return data;
                    })
                }
            })
        }

        function getUniversityNames(evaluatedKey) {
            $http.get('JSON/data.json').then(function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    UNIVERSITY_LIST.push({
                        unitId : data.data[i].unitId,
                        universityName : data.data[i].universityName
                    })
                }
            })
        }
    }
})();
