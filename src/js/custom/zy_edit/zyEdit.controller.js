/**
 * Created by wangll on 2017/2/8.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('zyEditController', zyEditController);

    zyEditController.$inject = ['$stateParams', 'cacheService', '$uibModal', '$timeout'];

    function zyEditController($stateParams, cacheService, $uibModal, $timeout) {
        var vm = this;

        vm.batchCode = $stateParams.batchCode;
        vm.isBusy = true; //本页面可能需要较长准备时间，数据获取和加载完成前，页面展示加载提示信息，通过busy属性控制信息显示与隐藏
        vm.realWishes = [//扩展后的志愿数据，前端业务处理用
        ];

        /**
         * @type {{batchCode: number, batchName: string, yxs: Number, yxzys: Number}}
         */
        vm.batch = {
            batchName: '普通类本科一批',
            batchCode: '1',
            dirty: false,
            collegeNum: 5,
            majorNum: 6
        };
        //cacheService.get(cacheService.prefix.batch)[vm.batchCode];
        cacheService.put('currentBatch', vm.batch);
        //模拟从服务器获取的最简计划数据，需要进行二次处理成为页面可直接用的数据
        vm.plainPlans =[
            '0001#北大#01#数学#02#历史#03#政治','0002#清华#01#文史#02#物理#03#哲学'
        ];
        //模拟从服务器获取的最简志愿数据，需要进行二次处理成为页面可直接用的数据
        vm.plainWishes = [
            [1, '1', ['01', '02', '03','01', '02', '03'], '1'],
            [2, '2', ['01', '02' ,'03','01', '02' ,'03'] ,1]
        ];
        _pollPlanPlans();

        vm.saveWishes = _saveWishes;

        //function ↓
        /**
         * 初始化考生志愿结构
         * @private
         */
        function _pollPlanPlans() {
            $timeout(function() {
                console.log('emulate poll plans from server');
                vm.plainPlans = [];
                for (var i= 0; i<= 20000; i++) {
                    vm.plainPlans.push(_.join([i, '院校' + i, '01', '数学', '02', '语文', '03', '物理', '04', '政治', '05', '哲学'],cacheService.prefix.joint));
                }
            },500)
                .then(
                    function() {
                        console.log(new Date().getTime());
                        _handlePlainPlans();
                        vm.realWishes = _fromPlain2RealWishes();
                        console.log(new Date().getTime());
                        vm.isBusy = false;
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

        function _saveWishes() {
            console.log(_fromReal2PlainWishes(vm.realWishes));
            _showZySubmitList();
        }

        //将压缩后的考生志愿扩展为页面可用的数据结构
        function _fromPlain2RealWishes() {
            var realWishes = [];
            var batchCode = vm.batch.batchCode;
            var collegeNum = vm.batch.collegeNum;
            var majorNum = vm.batch.majorNum;
            for (var i= 0; i< collegeNum; i++) {
                realWishes.push(
                    [i, undefined, _.times(majorNum, _.constant(undefined)), undefined]
                )
            }
            var plans = cacheService.get(cacheService.prefix.college + batchCode)['plans'];
            if (vm.plainWishes) {
                for (var index in vm.plainWishes) {
                    var realWish = realWishes[index];
                    var pw = vm.plainWishes[index];
                    var collegeCode = pw[1];
                    var majorCodes = pw[2];
                    var college = plans[collegeCode]['college'];
                    var majors = plans[collegeCode]['major'];
                    realWish[1] = college;
                    for (var m in majorCodes) {
                        var mindex = _.findIndex(majors, function(o) {return o['majorCode'] == majorCodes[m];});
                        realWish[2][m] = majors[mindex];
                    }
                    realWish[3] = pw[3];
                }
            }

            return realWishes;
        }

        //将扩展的考生志愿压缩为传输给服务器的数据结构
        function _fromReal2PlainWishes() {
            var plainWishes = [];
            for(var index in vm.realWishes) {
                var realWish = vm.realWishes[index];
                var college = realWish[1];
                if (!college) continue;
                var majors = realWish[2];
                var plainWish = [index, college.collegeCode, [], realWish[3]];
                for (var m in majors) {
                    if (!majors[m]) continue;
                    plainWish[2].push(majors[m].majorCode);
                }
                plainWishes.push(plainWish);
            }
            return plainWishes;
        }

        function _showZySubmitList() {
            //弹出收藏列表页面
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'zySubmit.html',
                controller: 'zySubmitCtrl',
                controllerAs: 'zysCtrl',
                size: 'lg',
                resolve: {
                    realWishes: function () {
                        return vm.realWishes;
                    }
                }
            });
        }
        //modalInstanceCtrl
        angular.module('naut')
            .controller('zySubmitCtrl', zySubmitCtrl);
        zySubmitCtrl.$inject = ['$uibModalInstance', 'realWishes'];
        function zySubmitCtrl($uibModalInstance, realWishes) {
            var vm = this;
            vm.realWishes = realWishes;
        }

        //单个院校select的controller
        angular.module('naut')
            .controller('collegeSelectController', collegeSelectController);
        collegeSelectController.$inject = ['$scope', 'cacheService'];
        function collegeSelectController($scope, cacheService) {
            var cvm = this;
            cvm.batchCode = cacheService.get('currentBatch').batchCode;
            cvm.collegesForSelect = cacheService.get(cacheService.prefix.college + cvm.batchCode)['colleges'];
            cvm.majorsForSelect = undefined;
            cvm.filteredColleges = undefined;
            cvm.isBusy = true;

            _prepareCollegeForSelect();

            cvm.refreshColleges = _.debounce(_refreshColleges, 500);
            cvm.clearCollege = _clear;
            cvm.collegeChange = _collegeChange;

            function _refreshColleges(collegeSearchStr) {
                $timeout(function() {
                    console.log('emulate poll filtered colleges from server');
                },0).then(function() {
                    cvm.isBusy = true;
                    var start = new Date().getTime();
                    var filteredColleges_ = [];
                    if (collegeSearchStr && collegeSearchStr.length >= 1) {
                        filteredColleges_.push({collegeCode: '', collegeName: ''});
                        for (var index in cvm.collegesForSelect) {
                            var college = cvm.collegesForSelect[index];
                            if (college.collegeName.indexOf(collegeSearchStr) >= 0) {
                                filteredColleges_.push(college);
                            }
                        }
                    }
                    console.log(new Date().getTime() - start);
                    cvm.filteredColleges = filteredColleges_;
                    cvm.isBusy = false;
                });
            }

            function _clear() {
                console.log('clear');
                if (!cvm.isBusy) {
                    $scope.wish[1] = undefined;
                    cvm.majorsForSelect = undefined;//清空可选专业的选项
                }
            }

            function _prepareCollegeForSelect() {
                cvm.collegesForSelect = cacheService.get(cacheService.prefix.college + cvm.batchCode)['colleges'];
            }

            function _collegeChange() {
                var college = $scope.wish[1];
                cvm.majorsForSelect = cacheService.get(cacheService.prefix.college + cvm.batchCode)['majors'][college];
            }
        }
    }

})();