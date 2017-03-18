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
        
        UniversitySearchService.testAPI().then(function(data){
            vm.university = data.data.Item;
        })
    }
})();
