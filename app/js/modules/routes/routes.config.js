/**=========================================================
 * Module: RoutesConfig.js
 =========================================================*/

(function() {
  'use strict';

  angular
      .module('naut')
      .config(routesConfig);

  routesConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'RouteProvider'];
  function routesConfig($locationProvider, $stateProvider, $urlRouterProvider, Route) {

    // use the HTML5 History API
    $locationProvider.html5Mode(false);

    // Default route
    $urlRouterProvider.otherwise('/app/welcome');

    // Application Routes States
    $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: Route.base('app.html')
        })
        .state('app.welcome', {
            url: '/welcome',
            templateUrl: Route.base('pages/welcome.html')
        })
        .state('app.agreement', {
            url: '/agreement',
            templateUrl: Route.base('pages/agreement.html')
        })
        .state('app.zyQuery', {
            url: '/zyQuery',
            templateUrl: Route.base('pages/zyQuery.html')
        })
        .state('app.zyEdit', {
            url: '/zyEdit/:batchCode/:canEdit',
            templateUrl: Route.base('pages/zyEdit.html')
        })
        .state('login', {
            url: '/login',
            templateUrl: Route.base('pages/login.html')
        })


        .state('app.notices', {
            url: '/notices',
            templateUrl: Route.base('pages/notices.html')
        });

  }

})();

