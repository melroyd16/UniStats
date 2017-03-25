(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversityCompare', [])
        .controller('UniversityCompareCtrl', UniversityCompareCtrl);

    UniversityCompareCtrl.$inject = ['UniversityCompareService'];

    /* @ngInject */
    function UniversityCompareCtrl(UniversityCompareService) {
        var vm = this;
        vm.message = 'Hello from University Compare page';
        
        UniversityCompareService.fetchUnivData().then(function(data){
            console.log(data);
        })
    }
})();
