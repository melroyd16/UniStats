(function () {
    'use strict';

    angular
        .module('UnistatsApp.UniversityCompare', [])
        .controller('UniversityCompareCtrl', UniversityCompareCtrl);

    UniversityCompareCtrl.$inject = [];

    /* @ngInject */
    function UniversityCompareCtrl() {
        var vm = this;
        vm.message = 'Hello from University Compare page';
    }
})();
