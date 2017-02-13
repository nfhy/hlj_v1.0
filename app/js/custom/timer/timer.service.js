/**
 * Created by wangll on 2017/2/7.
 */
(function(){
    'use strict';

    angular.module('naut')
        .service('timerService', timerService);

    timerService.$inject = ['$timeout', '$localStorage'];

    function timerService($timeout, $localStorage) {
        var endDateStr = '';
        var _secondsLeft = 0;
        var _minutesLeft = 0;
        var _hoursLeft = 0;
        var _daysLeft = 0;
        var secondInterval = 0;
        var _i_default = 5;
        var _i = 0;

        var _pollFromServer = function() {
            $timeout(function() {
                console.log('emulate timer polling');
            }, 500)
                .then(function() {
                    endDateStr = '2017-03-07 16:55:00';
                    $localStorage.endDateStr = endDateStr;
                    secondInterval = (new Date(endDateStr).getTime() - new Date().getTime())/1000 + parseInt(Math.random()*100, 10);
                });
        };

        var _counter = function() {
            _i --;
            if (_i <= 0) {
                _pollFromServer();//每_i_default秒校对一次服务器时间，异步执行，没有必要与下部代码强制同步
                _i = _i_default;
            }
            if (secondInterval <= 0) {
            }
            else {
                secondInterval--;
                _secondsLeft = parseInt(secondInterval % 60);
                _minutesLeft = parseInt((secondInterval/60) % 60);
                _hoursLeft = parseInt((secondInterval/(60*60)) % 24);
                _daysLeft = parseInt((secondInterval/(60*60*24)));

            }
            return {
                intervals: secondInterval,
                secondsLeft: _secondsLeft,
                minutesLeft: _minutesLeft,
                hoursLeft: _hoursLeft,
                daysLeft: _daysLeft
            };
        };//每秒执行一次


        var timer = {
            counter: _counter
        };
        return timer;
    }

})();