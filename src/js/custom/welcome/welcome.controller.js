/**
 * Created by wangll on 2017/2/7.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('welcomeController', welcomeController);

    welcomeController.$inject = ['cacheService', '$scope', '$interval', '$state', '$timeout', 'timerService'];

    function welcomeController(cacheService, $scope, $interval, $state, $timeout, timerService) {
        var vm = this;

        vm.conterDownText = '';
        vm.welcomeInfo = '欢迎您，XXX';
        vm.postEndDate = true;

        vm.editWishes = _editWishes;

        //刷新考生批次填报状态
        _pollBatchs();

        //functions↓

        function _pollBatchs() {
            $timeout(function() {
                console.log('emulate poll batchs from server');
            }, 500)
                .then(function() {
                    vm.batchs = [
                        {
                            batchName: '普通类本科一批',
                            batchCode: '1',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类本科二批',
                            batchCode: '2',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类专科一批',
                            batchCode: '3',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类专科二批',
                            batchCode: '4',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类中职',
                            batchCode: '5',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        }
                    ];
                    var arr = {};
                    for (var b in vm.batchs) {
                        arr[vm.batchs[b].batchCode] = vm.batchs[b];
                    }
                    cacheService.put(cacheService.prefix.batch, arr);
                });
        }

        //edit wishes
        function _editWishes(batch) {
            $state.go('app.zyEdit', {'batchCode': batch.batchCode});
        }

        //每 _i 秒校对一次服务器时间
        //每秒倒计时，更新页面倒计时信息
        var counter = $interval(function() {
            var countDownTimer = timerService.counter();
            if(countDownTimer.intervals > 0) {
                vm.postEndDate = false;
                vm.conterDownText = '距离截止时间：'
                    + countDownTimer.daysLeft + '天'
                    + countDownTimer.hoursLeft + '小时'
                    + countDownTimer.minutesLeft + '分'
                    + countDownTimer.secondsLeft + '秒';
            }
            else if (countDownTimer.intervals < 0){
                vm.postEndDate = true;
                vm.conterDownText = '已过填报截止时间';
            }
        },1000);//每秒执行一次

        $scope.$on('$destroy',function(){
            $interval.cancel(counter);
        })
    }
})();