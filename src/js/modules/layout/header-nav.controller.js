/**=========================================================
 * Module: HeaderNavController
 * Controls the header navigation
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('HeaderNavController', HeaderNavController);
    /* @ngInject */
    function HeaderNavController($rootScope) {
        var vm = this;

        vm.srefs = [
            {
                url: 'app.welcome',
                title: '首页',
                active: false
            },
            {
                url: 'app.agreement',
                title: '考生须知',
                active: false
            },
            {
                url: 'app.zyQuery',
                title: '计划查询',
                active: false
            },
            {
                url: 'app.dashboard',
                title: '志愿总览',
                active: false
            },
            {
                url: 'app.notices',
                title: '通知消息',
                active: false
            },
            {
                url: 'app.dashboard',
                title: '安全登出',
                active: false
            }
        ];
        vm.headerMenuCollapsed = true;
        vm.menuClick = _menuClick;

        vm.toggleHeaderMenu = function() {
            vm.headerMenuCollapsed = !vm.headerMenuCollapsed;
        };

        // Adjustment on route changes
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            vm.headerMenuCollapsed = true;
        });

        function _menuClick(sref) {
            for (var s in vm.srefs) {
                vm.srefs[s].active = false;
                if (vm.srefs[s].title == sref.title) {
                    vm.srefs[s].active = true;
                }
            }
        }

    }
    HeaderNavController.$inject = ['$rootScope'];

})();
