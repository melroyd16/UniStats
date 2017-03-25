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

        //console.log(vm.fetchUnivData);

        function fetchUnivData() {
            var payload = {
                operation: "fetchUniversityData",
                univId:"104151"
            }
            return $http.post(UNIVERSITY_DETAILS_API, payload).then(function (data) {
                return data;
            })
        }
    }
})();
