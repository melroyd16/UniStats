(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversityDetails', [])
        .controller('UniversityDetailsCtrl', UniversityDetailsCtrl);

    UniversityDetailsCtrl.$inject = [];

    /* @ngInject */
    function UniversityDetailsCtrl() {
        var vm = this;
        vm.message = 'Hello from University Details page';
    }
})();
