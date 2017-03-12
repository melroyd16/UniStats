(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversitySearch', [])
        .controller('UniversitySearchCtrl', UniversitySearchCtrl);

    UniversitySearchCtrl.$inject = [];

    /* @ngInject */
    function UniversitySearchCtrl() {
        var vm = this;
        vm.message = 'Hello from University Search page';
    }
})();
