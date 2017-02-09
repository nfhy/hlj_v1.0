/**=========================================================
 * Module: ApplicationRun.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .run(appRun);


    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$localStorage', 'translator', 'settings', 'browser', 'cacheService'];
    function appRun($rootScope, $state, $stateParams, $localStorage, translator, settings, browser, cacheService) {

        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $localStorage;

        translator.init();
        settings.init();
        cacheService.init();

        // add a classname to target different platforms form css
        var root = document.querySelector('html');
        root.className += ' ' + browser.platform;

    }

})();

