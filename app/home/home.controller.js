(function () {
    'use strict';

    angular
        .module('UnistatsApp.Home', [])
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];

    /* @ngInject */
    function HomeCtrl() {
        var vm = this;
        vm.message = 'Hello from home page';
    }
})();
