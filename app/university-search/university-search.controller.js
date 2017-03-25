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
        
        UniversitySearchService.fetchUnivData().then(function(data){
            vm.university = data.data.Item;
            console.log(data);

            if(vm.university.errorMessage){
                alert(vm.university.errorMessage);
            }
        })
    }
})();
