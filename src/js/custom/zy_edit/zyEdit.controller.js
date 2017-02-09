/**
 * Created by wangll on 2017/2/8.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('zyEditController', zyEditController);

    zyEditController.$inject = ['$stateParams', 'cacheService', '$timeout'];

    function zyEditController($stateParams, cacheService, $timeout) {
        var vm = this;

        vm.batchCode = $stateParams.batchCode;
        vm.busy = false; //本页面可能需要较长准备时间，数据获取和加载完成前，页面展示加载提示信息，通过busy属性控制信息显示与隐藏

        vm.realWishes = [//扩展后的志愿数据，前端业务处理用
        ];

        /**
         * @type {{batchCode: number, batchName: string, yxs: Number, yxzys: Number}}
         */
        vm.batch = cacheService.get(cacheService.prefix.batch)[vm.batchCode];
        cacheService.put('currentBatch', vm.batch);
        //模拟从服务器获取的最简计划数据，需要进行二次处理成为页面可直接用的数据
        vm.plainPlans =[
            '0001#北大#01#数学#02#历史#03#政治','0002#清华#01#文史#02#物理#03#哲学'
        ];
        //模拟从服务器获取的最简志愿数据，需要进行二次处理成为页面可直接用的数据
        vm.plainWishes = [
            ['1#0001#01#02#03#1', '2#0002#01#02#03#1']
        ];
        _pollPlanPlans();

        //function ↓
        /**
         * 初始化考生志愿结构
         * @private
         */
        function _prepareForEdit() {
            var newWishes = [];
            var yxs = vm.batch.collegeNum;
            var yxzys = vm.batch.majorNum;
            var blankMajors = [];
            for (var i= 0; i< yxzys; i++) {
                blankMajors.push('');
            }
            for (var i= 0; i< yxs; i++) {
                var newWish = vm.wishes[i] || [i+1, '', [], 0];
                newWish[2] = newWish[2].concat(blankMajors).slice(0, yxzys);
                newWishes.push(newWish);
                console.log(newWish);
            }
            vm.wishes = newWishes;
        }

        function _pollPlanPlans() {
            $timeout(function() {
                console.log('emulate poll plans from server');
                for (var i= 0; i<= 20000; i++) {
                    vm.plainPlans.push(_.join([i, '院校i', '01', '数学', '02', '语文', '03', '物理', '04', '政治', '05', '哲学'],cacheService.prefix.joint));
                }
            },500)
                .then(
                    function() {
                        console.log(new Date().getTime());
                        _handlePlainPlans();
                        _handlePlainWishes()
                        console.log(new Date().getTime());
                    }
                );
        }

        //转换原始计划数据为页面可用数据结构
        function _handlePlainPlans() {
            var colleges = [];
            var majors = {};
            var plans = {};
            for (var index in vm.plainPlans) {
                var planInfo = vm.plainPlans[index].split(cacheService.prefix.joint);
                var college = {
                    collegeCode: planInfo[0],
                    collegeName: planInfo[1]
                };
                var major = [];
                for (var m= 2; m< planInfo.length; m= m+2) {
                    major.push({
                        majorCode: planInfo[m],
                        majorName: planInfo[m+1]
                    });
                }
                colleges.push(college);
                majors[college] = major;
                plans[college.collegeCode] = {
                    'college': college,
                    'major': major
                }
            }
            cacheService.put(cacheService.prefix.college + vm.batchCode, {
                'colleges': colleges,
                'majors': majors,
                'plans': plans
            });
        }

        //转换原始志愿数据为页面可用数据结构
        function _handlePlainWishes() {
            var collegeNum = vm.batch.collegeNum;
            var majorNum = vm.batch.majorNum;
            for (var i= 0; i< collegeNum; i++) {
                vm.realWishes.push(
                    [i, {}, [{},{},{},{},{},{}], 1]
                )
            }
        }
    }

    //单个院校select的controller
    angular.module('naut')
        .controller('collegeSelectController', collegeSelectController);
    collegeSelectController.$inject = ['$scope', 'cacheService'];
    function collegeSelectController($scope, cacheService) {
        $scope.collegesForSelect = [];
        $scope.collegeSelected = {};

        _prepareCollegeForSelect();

        $scope.$watch('collegeSelected', function(newValue, oldValue, scope) {
           _collegeChange();
        });

        function _prepareCollegeForSelect() {
            var batch = cacheService.get('currentBatch');
            $scope.collegesForSelect = cacheService.get(cacheService.prefix.college + batch.batchCode)['colleges'];
        }

        function _collegeChange() {
            $scope.$broadcast('collegeChange', {'collegeSelected': $scope.collegeSelected});
        }
    }

    //单个专业select的controller
    angular.module('naut')
        .controller('majorSelectController', majorSelectController);
    majorSelectController.$inject = ['$scope', 'cacheService'];
    function majorSelectController($scope, cacheService) {
        var vm = this;

        vm.majorsForSelect = [];
        vm.majorSelected = {};

        $scope.$on('collegeChange', function(event, data) {
           _reloadSelect(data.collegeSelected.collegeCode);
        });

        function _reloadSelect(collegeCode) {
            var batch = cacheService.get('currentBatch');
            vm.majorsForSelect = cacheService.get(cacheService.prefix.college + batch.batchCode)['majors'][collegeCode];
        }
    }

})();