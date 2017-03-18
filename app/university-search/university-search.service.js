(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch')
        .service('UniversitySearchService', UniversitySearchService);

    UniversitySearchService.$inject = ['$http'];

    /* @ngInject */
    function UniversitySearchService($http) {
        var vm = this;
        vm.testAPI = testAPI;

        function testAPI() {
            var payload = {
                operation: "temp"
            }
            return $http.post(UNIVERSITY_DETAILS_API, payload).then(function (data) {
                return data;
            })
        }
    }
})();
