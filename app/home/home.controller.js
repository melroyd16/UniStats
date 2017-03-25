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

        function populateData() {
            $http.get('JSON/data.json').then(function (data) {
                for (var i = 1801; i < data.data.length; i++) {
                    var payload = {
                        operation: "populateData",
                        populatePayload: {
                            TableName: "university",
                            Item: data.data[i]
                        }
                    }
                    $http.post(UNIVERSITY_DETAILS_API, payload).then(function (data) {
                        return data;
                    })
                }
            })
        }
    }
})();
