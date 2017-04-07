(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch')
        .service('UniversitySearchService', UniversitySearchService);

    UniversitySearchService.$inject = ['$http'];

    /* @ngInject */
    function UniversitySearchService($http) {
        var vm = this;
        vm.fetchUnivData = fetchUnivData;
        vm.fetchAllUniversities = fetchAllUniversities;
        vm.cleanUniversityList = [];

        function fetchUnivData(university) {
            var payload = {
                operation: "fetchUniversityData",
                university: university
            }
            return $http.post(UNIVERSITY_DETAILS_API, payload).then(function (data) {
                return data;
            })
        }
        
        function fetchAllUniversities(){
            return $http.get('JSON/data.json').then(function (data) {
                vm.cleanUniversityList = data.data;
                return vm.cleanUniversityList;
            })
        }
    }
})();
