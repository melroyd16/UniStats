(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch')
        .service('UniversityCompareService', UniversityCompareService);

    UniversityCompareService.$inject = ['$http'];

    /* @ngInject */
    function UniversityCompareService($http) {
        var vm = this;
        vm.fetchUnivData = fetchUnivData;

        function fetchUnivData(university) {
            var payload = {
                operation: "fetchUniversityData",
                university: university
            }
            return $http.post(UNIVERSITY_DETAILS_API, payload).then(function (data) {
                return data;
            })
        }
    }
})();
