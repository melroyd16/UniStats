(function(){
    'use strict';
    angular.module('UnistatsApp',['UnistatsApp.Home', 'UnistatsApp.UniversitySearch','UnistatsApp.UniversityCompare', 'UnistatsApp.UniversityDetails', 'rzModule', 'ngSanitize', 'apg.typeaheadDropdown', 'perfect_scrollbar','ui.router', 'ui.bootstrap']);
    
    angular.module('UnistatsApp').config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home")
        $stateProvider.state('home', {
            url:'/home',
            templateUrl: 'app/university-search/university-search.tpl.html',
            controller: 'UniversitySearchCtrl as univSCtrl'
        }).state('university-search',{
            url:'/university-search',
            templateUrl: 'app/university-search/university-search.tpl.html',
            controller: 'UniversitySearchCtrl as univSCtrl'
        }).state('university-details',{
            url:'/university-details/:univId/:univLocation',
            templateUrl: 'app/university-details/university-details.tpl.html',
            controller: 'UniversityDetailsCtrl as univDCtrl'
        }).state('university-compare',{
            url:'/university-compare',
            templateUrl: 'app/university-compare/university-compare.tpl.html',
            controller: 'UniversityCompareCtrl as univCCtrl'
        })
    }
})();