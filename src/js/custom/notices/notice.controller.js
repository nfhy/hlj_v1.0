/**
 * Created by wangll on 2017/2/8.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('noticesController', noticesController);

    noticesController.$inject = ['$timeout'];

    function noticesController($timeout) {
        var vm = this;

        vm.notices = [];
        _pollNotices();

        //functions↓
        function _pollNotices() {
            $timeout(function() {
                console.log('emulate poll notices from server');
            },500)
                .then(
                    function() {
                        var arr = [];
                        for (var i= 0; i<= 10; i++) {
                            arr.push({
                                title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题'+i,
                                url: 'http://www.baidu.com'
                            })
                        }
                        vm.notices = arr;
                    }
                );
        }
    }
})();