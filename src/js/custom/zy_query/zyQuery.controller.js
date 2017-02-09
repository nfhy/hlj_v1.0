/**
 * Created by wangll on 2017/2/7.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('zyQueryController', zyQueryController);

    zyQueryController.$inject = ['$uibModal', '$localStorage', '$timeout'];

    function zyQueryController($uibModal, $localStorage, $timeout) {
        var vm = this;


        //查询条件 start
        vm.q_yx = '';//院校
        vm.q_zy = '';//专业
        vm.q_sf = '';//省份
        vm.q_kl = '';//科类
        vm.q_batch = '';//批次
        //查询条件 end

        vm.results = [];
        vm.provinces = provinces();
        vm.batchs = [
            {
                batchCode: '0',
                batchName: '普通类本科一批'
            },
            {
                batchCode: '1',
                batchName: '普通类本科二批'
            },
            {
                batchCode: '2',
                batchName: '普通类专科一批'
            },
            {
                batchCode: '3',
                batchName: '普通类专科二批'
            },
            {
                batchCode: '4',
                batchName: '普通类专科高职'
            }
        ];
        vm.kls = [
            {
                kldm: '0',
                klmc: '理工'
            },
            {
                kldm: '1',
                klmc: '文史'
            }
        ];
        vm.favs = $localStorage.favs||'';
        vm.favs_jh = $localStorage.favs_jh||{};

        vm.q_up = true;
        vm.emptyResult = true;
        vm.tmp_counter = 0;
        //functions↓
        vm.queryResult = _queryResult;
        vm.pollResult = _moreResult;
        vm.favo = _favo;
        vm.showFavsList = _showFavsList;
        //查询数据
        function _queryResult() {
            vm.results = [];
            _moreResult();
        }
        //滚轮划至页面底部，自动加载新数据
        function _moreResult() {
            $timeout(function() {
                console.log('emulate poll zyResults from server');
            },500)
                .then(
                    function() {
                        if (vm.tmp_counter >= 5) {
                            vm.emptyResult = true;
                        }
                        else {
                            var arr = [];
                            for (var j = 1; j < 50; j++) {
                                var i = j + 50 * vm.tmp_counter;
                                arr.push([
                                    '' + i % 4, '批次' + i % 5,//批次
                                    '' + i % 20, '院校' + i % 20,//院校
                                    '' + i % 10, '专业' + i % 10,//专业
                                    '' + i % 5, '省份' + i % 5,//省份
                                    '4',//年制
                                    '5500',//学费
                                    i % 2 ? '文史' : '理工',//科类
                                    '备注' + i,
                                    i
                                ]);
                            }
                            vm.results = vm.results.concat(arr);
                            vm.tmp_counter++;
                            vm.emptyResult = false;
                        }
                    }
                );
        }

        //添加计划至收藏栏
        function _favo(jh) {
            var key = '#' + jh[12];
            if (vm.favs.indexOf(key) >= 0) {
                vm.favs = vm.favs.replace(key, '');
                delete vm.favs_jh[key];
            }
            else {
                vm.favs += key;
                vm.favs_jh[key] = jh;
            }
            $localStorage.favs = vm.favs;
            $localStorage.favs_jh = vm.favs_jh;
        }

        function _showFavsList() {
            //弹出收藏列表页面
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'favsList.html',
                controller: 'favsListCtrl',
                controllerAs: 'fCtrl',
                size: 'lg',
                resolve: {
                    favs_jh: function () {
                        return vm.favs_jh;
                    }
                }
            });
        }
    }

})();

//modalInstanceCtrl
angular.module('naut')
.controller('favsListCtrl', favsListCtrl);
favsListCtrl.$inject = ['$uibModalInstance', 'favs_jh'];
function favsListCtrl($uibModalInstance, favs_jh) {
    var vm = this;
    vm.favs_jh = favs_jh;
}