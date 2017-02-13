/**
 * Created by wangll on 2017/2/13.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('loginController', loginController);
    loginController.$inject = ['$state', '$localStorage'];
    function loginController($state, $localStorage) {
        var vm = this;

        vm.doLogin = _doLogin;

        function _doLogin() {
            $state.go('app.welcome');
        }
    }
})();